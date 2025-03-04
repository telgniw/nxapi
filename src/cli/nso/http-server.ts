import * as net from 'node:net';
import createDebug from 'debug';
import * as persist from 'node-persist';
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { v4 as uuidgen } from 'uuid';
import { Announcement, CoralErrorResponse, CoralStatus, CurrentUser, Friend, FriendCodeUrl, FriendCodeUser, GetActiveEventResult, Presence, WebService } from '../../api/coral-types.js';
import CoralApi from '../../api/coral.js';
import type { Arguments as ParentArguments } from '../nso.js';
import { ArgumentsCamelCase, Argv, YargsArguments } from '../../util/yargs.js';
import { initStorage } from '../../util/storage.js';
import { getToken, SavedToken } from '../../common/auth/coral.js';
import { NotificationManager, PresenceEvent, ZncNotifications } from '../../common/notify.js';
import { product } from '../../util/product.js';
import { parseListenAddress } from '../../util/net.js';
import { AuthPolicy, AuthToken, ZncPresenceEventStreamEvent } from '../../api/znc-proxy.js';
import { addCliFeatureUserAgent } from '../../util/useragent.js';
import { ErrorResponse } from '../../api/util.js';

declare global {
    namespace Express {
        interface Request {
            znc?: CoralApi;
            zncAuth?: SavedToken;

            zncAuthPolicy?: AuthPolicy;
            zncAuthPolicyUser?: string;
            zncAuthPolicyToken?: string;
        }
    }
}

const debug = createDebug('cli:nso:http-server');

export const command = 'http-server';
export const desc = 'Starts a HTTP server to access the Nintendo Switch Online app API';

export function builder(yargs: Argv<ParentArguments>) {
    return yargs.option('listen', {
        describe: 'Server address and port',
        type: 'array',
        default: ['[::]:0'],
    }).option('require-token', {
        describe: 'Require Nintendo Account session token for all requests (if disabled the user query string parameter can be used to use the last token for that user)',
        type: 'boolean',
        default: true,
    }).option('update-interval', {
        describe: 'Max. update interval in seconds',
        type: 'number',
        default: 30,
    });
}

type Arguments = YargsArguments<ReturnType<typeof builder>>;

export async function handler(argv: ArgumentsCamelCase<Arguments>) {
    addCliFeatureUserAgent('http-server');

    const storage = await initStorage(argv.dataPath);

    const app = createApp(storage, argv.zncProxyUrl, argv.requireToken, argv.updateInterval * 1000);

    for (const address of argv.listen) {
        const [host, port] = parseListenAddress(address);
        const server = app.listen(port, host ?? '::');
        server.on('listening', () => {
            const address = server.address() as net.AddressInfo;
            console.log('Listening on %s, port %d', address.address, address.port);
        });
    }
}

function createApp(
    storage: persist.LocalStorage,
    znc_proxy_url?: string,
    require_token = true,
    update_interval = 30 * 1000
) {
    const app = express();

    // Friend codes won't change very frequently, but associated data in the response
    // (user name/image) might change
    const friendcode_update_interval = 24 * 60 * 60 * 1000; // 24 hours

    app.use('/api/znc', (req, res, next) => {
        console.log('[%s] %s %s HTTP/%s from %s, port %d%s, %s',
            new Date(), req.method, req.path, req.httpVersion,
            req.socket.remoteAddress, req.socket.remotePort,
            req.headers['x-forwarded-for'] ? ' (' + req.headers['x-forwarded-for'] + ')' : '',
            req.headers['user-agent']);

        res.setHeader('Server', product + ' znc-proxy');

        next();
    });

    const localAuth: express.RequestHandler = async (req, res, next) => {
        if (require_token || !req.query.user) return next();

        const token = await storage.getItem('NintendoAccountToken.' + req.query.user);
        if (!token) return next();

        req.headers['authorization'] = 'na ' + token;

        next();
    };

    const authToken: express.RequestHandler = async (req, res, next) => {
        if (req.headers['authorization']?.startsWith('Bearer ')) {
            const token = req.headers['authorization'].substr(7);

            const auth: AuthToken | undefined = await storage.getItem('ZncProxyAuthPolicy.' + token);
            if (!auth) return next();

            req.zncAuthPolicy = auth.policy;
            req.zncAuthPolicyUser = auth.user;
            req.zncAuthPolicyToken = token;
        } else if (req.query.token) {
            const auth: AuthToken | undefined = await storage.getItem('ZncProxyAuthPolicy.' + req.query.token);
            if (!auth) return next();

            req.zncAuthPolicy = auth.policy;
            req.zncAuthPolicyUser = auth.user;
            req.zncAuthPolicyToken = '' + req.query.token;
        }

        next();
    };
    function tokenUnauthorised(req: Request, res: Response) {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
            error: 'token_unauthorised',
        }));
    }

    const znc_auth_promise = new Map</** session token */ string, Promise<{nso: CoralApi, data: SavedToken;}>>();
    const znc_auth_timeout = new Map</** session token */ string, NodeJS.Timeout>();

    const nsoAuth: express.RequestHandler = async (req, res, next) => {
        try {
            let nintendoAccountSessionToken: string;
            if (req.zncAuthPolicyUser) {
                const na_token = await storage.getItem('NintendoAccountToken.' + req.zncAuthPolicyUser);
                if (!na_token) throw new Error('Nintendo Account for this token must reauthenticate');
                nintendoAccountSessionToken = na_token;
            } else {
                const auth = req.headers['authorization'];
                if (!auth || !auth.startsWith('na ')) throw new Error('Requires Nintendo Account authentication');
                nintendoAccountSessionToken = auth.substr(3);
            }

            const promise = znc_auth_promise.get(nintendoAccountSessionToken) ?? (async () => {
                const auth = await getToken(storage, nintendoAccountSessionToken, znc_proxy_url);

                const users = new Set(await storage.getItem('NintendoAccountIds') ?? []);
                users.add(auth.data.user.id);
                await storage.setItem('NintendoAccountIds', [...users]);

                return auth;
            })().catch(err => {
                znc_auth_promise.delete(nintendoAccountSessionToken);
                clearTimeout(znc_auth_timeout.get(nintendoAccountSessionToken));
                znc_auth_timeout.delete(nintendoAccountSessionToken);
                throw err;
            });
            znc_auth_promise.set(nintendoAccountSessionToken, promise);

            // Remove the authenticated ZncApi 30 minutes after last use
            clearTimeout(znc_auth_timeout.get(nintendoAccountSessionToken));
            znc_auth_timeout.set(nintendoAccountSessionToken, setTimeout(() => {
                znc_auth_promise.delete(nintendoAccountSessionToken);
                znc_auth_timeout.delete(nintendoAccountSessionToken);
            }, 30 * 60 * 1000).unref());

            const {nso, data} = await promise;
            req.znc = nso;
            req.zncAuth = data;

            next();
        } catch (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                error: err,
                error_message: (err as Error).message,
            }));
        }
    };

    app.get('/api/znc/auth', nsoAuth, (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(req.zncAuth));
    });

    app.get('/api/znc/token', authToken, (req, res) => {
        if (!req.zncAuthPolicyToken) {
            res.statusCode = 403;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({error: 'no_policy'}));
            return;
        }

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(req.zncAuthPolicy));
    });
    app.delete('/api/znc/token', authToken, async (req, res) => {
        if (!req.zncAuthPolicyToken) {
            res.statusCode = 403;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({error: 'no_policy'}));
            return;
        }

        await storage.removeItem('ZncProxyAuthPolicy.' + req.zncAuthPolicyToken!);

        const tokens = new Set(await storage.getItem('ZncProxyAuthPolicies.' + req.zncAuthPolicyUser) ?? []);
        tokens.delete(req.zncAuthPolicyToken);
        await storage.setItem('ZncProxyAuthPolicies.' + req.zncAuthPolicyUser, [...tokens]);

        res.statusCode = 204;
        res.end();
    });
    app.get('/api/znc/tokens', nsoAuth, async (req, res) => {
        const token_ids: string[] | undefined = await storage.getItem('ZncProxyAuthPolicies.' + req.zncAuth!.user.id);
        const tokens = (await Promise.all(token_ids?.map(async id => {
            const auth: AuthToken | undefined = await storage.getItem('ZncProxyAuthPolicy.' + id);
            if (!auth) return;
            return {
                token: id,
                user: auth.user,
                policy: auth.policy,
                created_at: auth.created_at,
            };
        }) ?? [])).filter(p => p);

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({tokens}));
    });
    app.post('/api/znc/tokens', nsoAuth, bodyParser.json(), async (req, res) => {
        const token = uuidgen();
        const auth: AuthToken = {
            user: req.zncAuth!.user.id,
            policy: req.body.policy,
            created_at: Math.floor(Date.now() / 1000),
        };

        await storage.setItem('ZncProxyAuthPolicy.' + token, auth);

        const tokens = new Set(await storage.getItem('ZncProxyAuthPolicies.' + req.zncAuth!.user.id) ?? []);
        tokens.add(token);
        await storage.setItem('ZncProxyAuthPolicies.' + req.zncAuth!.user.id, [...tokens]);

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
            token,
            ...auth,
        }));
    });

    //
    // Announcements
    // This is cached for all users.
    //

    let cached_announcements: Announcement[] | null = null;
    app.get('/api/znc/announcements', authToken, (req, res, next) => {
        if (!req.zncAuthPolicy) return next();
        if (!req.zncAuthPolicy.announcements) return tokenUnauthorised(req, res);
        next();
    }, localAuth, nsoAuth, async (req, res) => {
        if (cached_announcements) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                announcements: cached_announcements,
            }));
            return;
        }

        try {
            const announcements = await req.znc!.getAnnouncements();
            cached_announcements = announcements;

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({announcements}));
        } catch (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                error: err,
                error_message: (err as Error).message,
            }));
        }
    });

    //
    // Nintendo Switch user data
    //

    const user_data_promise = new Map</** NA ID */ string, Promise<void>>();
    const cached_userdata = new Map</** NA ID */ string, [CurrentUser, number]>();

    const getUserData: express.RequestHandler = async (req, res, next) => {
        const cache = cached_userdata.get(req.zncAuth!.user.id);

        if (cache && ((cache[1] + update_interval) > Date.now())) {
            debug('Using cached user data for %s', req.zncAuth!.user.id);
            next();
            return;
        }

        try {
            const promise = user_data_promise.get(req.zncAuth!.user.id) ?? req.znc!.getCurrentUser().then(user => {
                cached_userdata.set(req.zncAuth!.user.id, [user, Date.now()]);
            }).finally(() => {
                user_data_promise.delete(req.zncAuth!.user.id);
            });
            user_data_promise.set(req.zncAuth!.user.id, promise);
            await promise;

            next();
        } catch (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                error: err,
                error_message: (err as Error).message,
            }));
        }
    };

    app.get('/api/znc/user', authToken, (req, res, next) => {
        if (!req.zncAuthPolicy) return next();
        if (!req.zncAuthPolicy.current_user) return tokenUnauthorised(req, res);
        next();
    }, localAuth, nsoAuth, getUserData, async (req, res) => {
        const [user, updated] = cached_userdata.get(req.zncAuth!.user.id)!;

        res.setHeader('Cache-Control', 'private, immutable, max-age=' + cacheMaxAge(updated, update_interval));
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({user, updated}));
    });

    app.get('/api/znc/user/presence', authToken, (req, res, next) => {
        if (!req.zncAuthPolicy) return next();
        if (!req.zncAuthPolicy.current_user_presence) return tokenUnauthorised(req, res);
        if (!('current_user_presence' in req.zncAuthPolicy) && !req.zncAuthPolicy.current_user) return tokenUnauthorised(req, res);
        next();
    }, localAuth, nsoAuth, getUserData, async (req, res) => {
        const [user, updated] = cached_userdata.get(req.zncAuth!.user.id)!;

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(user.presence));
    });

    //
    // Nintendo Switch friends, NSO app web services, events
    //

    const friends_data_promise = new Map</** NA ID */ string, Promise<void>>();
    const cached_friendsdata = new Map</** NA ID */ string, [Friend[], number]>();
    const app_data_promise = new Map</** NA ID */ string, Promise<void>>();
    const cached_appdata = new Map</** NA ID */ string, [WebService[], GetActiveEventResult, number]>();

    const getFriendsData: express.RequestHandler = async (req, res, next) => {
        const cache = cached_friendsdata.get(req.zncAuth!.user.id);

        if (cache && ((cache[1] + update_interval) > Date.now())) {
            debug('Using cached friends data for %s', req.zncAuth!.user.id);
            next();
            return;
        }

        try {
            const promise = friends_data_promise.get(req.zncAuth!.user.id) ?? req.znc!.getFriendList().then(friends => {
                cached_friendsdata.set(req.zncAuth!.user.id, [friends.friends, Date.now()]);
            }).finally(() => {
                friends_data_promise.delete(req.zncAuth!.user.id);
            });
            friends_data_promise.set(req.zncAuth!.user.id, promise);
            await promise;

            next();
        } catch (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                error: err,
                error_message: (err as Error).message,
            }));
        }
    };
    const getAppData: express.RequestHandler = async (req, res, next) => {
        const cache = cached_appdata.get(req.zncAuth!.user.id);

        if (cache && ((cache[2] + update_interval) > Date.now())) {
            debug('Using cached app data for %s', req.zncAuth!.user.id);
            next();
            return;
        }

        try {
            const friends_promise = friends_data_promise.get(req.zncAuth!.user.id) ?? req.znc!.getFriendList().then(friends => {
                cached_friendsdata.set(req.zncAuth!.user.id, [friends.friends, Date.now()]);
            }).finally(() => {
                friends_data_promise.delete(req.zncAuth!.user.id);
            });
            friends_data_promise.set(req.zncAuth!.user.id, friends_promise);

            const promise = app_data_promise.get(req.zncAuth!.user.id) ?? Promise.all([
                friends_promise,
                req.znc!.getWebServices(),
                req.znc!.getActiveEvent(),
            ]).then(([friends, webservices, activeevent]) => {
                // Friends list was already added to cache
                cached_appdata.set(req.zncAuth!.user.id, [webservices, activeevent, Date.now()]);
            }).finally(() => {
                app_data_promise.delete(req.zncAuth!.user.id);
            });
            app_data_promise.set(req.zncAuth!.user.id, promise);
            await promise;

            next();
        } catch (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                error: err,
                error_message: (err as Error).message,
            }));
        }
    };

    app.get('/api/znc/friends', authToken, (req, res, next) => {
        if (!req.zncAuthPolicy) return next();
        if (!req.zncAuthPolicy.list_friends) return tokenUnauthorised(req, res);
        next();
    }, localAuth, nsoAuth, getFriendsData, async (req, res) => {
        const [friends, updated] = cached_friendsdata.get(req.zncAuth!.user.id)!;

        res.setHeader('Cache-Control', 'private, immutable, max-age=' + cacheMaxAge(updated, update_interval));
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
            friends: req.zncAuthPolicy?.friends ?
                friends.filter(f => req.zncAuthPolicy!.friends!.includes(f.nsaId)) : friends,
            updated,
        }));
    });

    app.get('/api/znc/friends/favourites', authToken, (req, res, next) => {
        if (!req.zncAuthPolicy) return next();
        if (!req.zncAuthPolicy.list_friends) return tokenUnauthorised(req, res);
        next();
    }, localAuth, nsoAuth, getFriendsData, async (req, res) => {
        const [friends, updated] = cached_friendsdata.get(req.zncAuth!.user.id)!;

        res.setHeader('Cache-Control', 'private, immutable, max-age=' + cacheMaxAge(updated, update_interval));
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
            friends: friends.filter(f => {
                if (req.zncAuthPolicy?.friends && !req.zncAuthPolicy.friends.includes(f.nsaId)) return false;

                return f.isFavoriteFriend;
            }),
            updated,
        }));
    });

    app.get('/api/znc/friends/presence', authToken, (req, res, next) => {
        if (!req.zncAuthPolicy) return next();
        if (!req.zncAuthPolicy.list_friends_presence) return tokenUnauthorised(req, res);
        next();
    }, localAuth, nsoAuth, getFriendsData, async (req, res) => {
        const [friends, updated] = cached_friendsdata.get(req.zncAuth!.user.id)!;
        const presence: Record<string, Presence> = {};

        for (const friend of friends) {
            if (req.zncAuthPolicy) {
                const p = req.zncAuthPolicy;
                if (p.friends_presence && !p.friends_presence.includes(friend.nsaId)) continue;
                if (p.friends && !p.friends_presence && !p.friends.includes(friend.nsaId)) continue;
            }

            presence[friend.nsaId] = friend.presence;
        }

        res.setHeader('Cache-Control', 'private, immutable, max-age=' + cacheMaxAge(updated, update_interval));
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(presence));
    });

    app.get('/api/znc/friends/favourites/presence', authToken, (req, res, next) => {
        if (!req.zncAuthPolicy) return next();
        if (!req.zncAuthPolicy.list_friends_presence) return tokenUnauthorised(req, res);
        next();
    }, localAuth, nsoAuth, getFriendsData, async (req, res) => {
        const [friends, updated] = cached_friendsdata.get(req.zncAuth!.user.id)!;
        const presence: Record<string, Presence> = {};

        for (const friend of friends) {
            if (req.zncAuthPolicy) {
                const p = req.zncAuthPolicy;
                if (p.friends_presence && !p.friends_presence.includes(friend.nsaId)) continue;
                if (p.friends && !p.friends_presence && !p.friends.includes(friend.nsaId)) continue;
            }

            if (!friend.isFavoriteFriend) continue;

            presence[friend.nsaId] = friend.presence;
        }

        res.setHeader('Cache-Control', 'private, immutable, max-age=' + cacheMaxAge(updated, update_interval));
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(presence));
    });

    app.get('/api/znc/friend/:nsaid', authToken, (req, res, next) => {
        if (!req.zncAuthPolicy) return next();
        if (!req.zncAuthPolicy.friend) return tokenUnauthorised(req, res);
        if (req.zncAuthPolicy.friends && !req.zncAuthPolicy.friends.includes(req.params.nsaid)) return tokenUnauthorised(req, res);
        next();
    }, localAuth, nsoAuth, getFriendsData, async (req, res) => {
        const [friends, updated] = cached_friendsdata.get(req.zncAuth!.user.id)!;
        const friend = friends.find(f => f.nsaId === req.params.nsaid);

        if (!friend) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                error: 'not_found',
                error_message: 'The user is not friends with the authenticated user.',
            }));
            return;
        }

        res.setHeader('Cache-Control', 'private, immutable, max-age=' + cacheMaxAge(updated, update_interval));
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({friend, updated}));
    });

    app.post('/api/znc/friend/:nsaid', nsoAuth, getFriendsData, bodyParser.json(), async (req, res) => {
        const [friends, updated] = cached_friendsdata.get(req.zncAuth!.user.id)!;
        const friend = friends.find(f => f.nsaId === req.params.nsaid);

        if (!friend) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                error: 'not_found',
                error_message: 'The user is not friends with the authenticated user.',
            }));
            return;
        }

        if ('isFavoriteFriend' in req.body &&
            req.body.isFavoriteFriend !== true &&
            req.body.isFavoriteFriend !== false
        ) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                error: 'invalid_request',
                error_message: 'Invalid value for isFavoriteFriend',
            }));
            return;
        }

        if ('isFavoriteFriend' in req.body) {
            try {
                if (friend.isFavoriteFriend !== req.body.isFavoriteFriend) {
                    if (req.body.isFavoriteFriend) await req.znc!.addFavouriteFriend(friend.nsaId);
                    if (!req.body.isFavoriteFriend) await req.znc!.removeFavouriteFriend(friend.nsaId);
                } else {
                    // No change
                }
            } catch (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                    error: err,
                    error_message: (err as Error).message,
                }));
                return;
            }
        }

        res.statusCode = 204;
        res.end();
    });

    app.get('/api/znc/friend/:nsaid/presence', authToken, (req, res, next) => {
        if (!req.zncAuthPolicy) return next();
        if (!req.zncAuthPolicy.friend_presence) return tokenUnauthorised(req, res);
        if (req.zncAuthPolicy.friends_presence && !req.zncAuthPolicy.friends_presence.includes(req.params.nsaid)) return tokenUnauthorised(req, res);
        if (req.zncAuthPolicy.friends && !req.zncAuthPolicy.friends_presence && !req.zncAuthPolicy.friends.includes(req.params.nsaid)) return tokenUnauthorised(req, res);
        next();
    }, localAuth, nsoAuth, getFriendsData, async (req, res) => {
        const [friends, updated] = cached_friendsdata.get(req.zncAuth!.user.id)!;
        const friend = friends.find(f => f.nsaId === req.params.nsaid);

        if (!friend) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                error: 'not_found',
                error_message: 'The user is not friends with the authenticated user.',
            }));
            return;
        }

        res.setHeader('Cache-Control', 'private, immutable, max-age=' + cacheMaxAge(updated, update_interval));
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(friend.presence));
    });

    app.get('/api/znc/webservices', authToken, (req, res, next) => {
        if (!req.zncAuthPolicy) return next();
        if (!req.zncAuthPolicy.webservices) return tokenUnauthorised(req, res);
        next();
    }, localAuth, nsoAuth, getAppData, async (req, res) => {
        const [webservices, activeevent, updated] = cached_appdata.get(req.zncAuth!.user.id)!;

        res.setHeader('Cache-Control', 'private, immutable, max-age=' + cacheMaxAge(updated, update_interval));
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({webservices, updated}));
    });

    app.get('/api/znc/webservice/:id/token', nsoAuth, async (req, res) => {
        try {
            const token = await req.znc!.getWebServiceToken(parseInt(req.params.id));

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({token}));
        } catch (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                error: err,
                error_message: (err as Error).message,
            }));
        }
    });

    app.get('/api/znc/activeevent', authToken, (req, res, next) => {
        if (!req.zncAuthPolicy) return next();
        if (!req.zncAuthPolicy.activeevent) return tokenUnauthorised(req, res);
        next();
    }, localAuth, nsoAuth, getAppData, async (req, res) => {
        const [webservices, activeevent, updated] = cached_appdata.get(req.zncAuth!.user.id)!;

        res.setHeader('Cache-Control', 'private, immutable, max-age=' + cacheMaxAge(updated, update_interval));
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({activeevent, updated}));
    });

    app.get('/api/znc/event/:id', nsoAuth, async (req, res) => {
        try {
            const event = await req.znc!.getEvent(parseInt(req.params.id));

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({event}));
        } catch (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                error: err,
                error_message: (err as Error).message,
            }));
        }
    });

    app.get('/api/znc/user/:id', nsoAuth, async (req, res) => {
        try {
            if (!req.params.id.match(/^[0-9]{16}$/)) {
                throw new Error('Invalid user ID');
            }

            const user = await req.znc!.getUser(parseInt(req.params.id));

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({user}));
        } catch (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                error: err,
                error_message: (err as Error).message,
            }));
        }
    });

    //
    // Friend codes
    //

    const friendcode_data_promise = new Map</** NA ID */ string, Map</** FC ID */ string, Promise<void>>>();
    const cached_friendcode_data = new Map</** NA ID */ string, Map</** FC ID */ string, [FriendCodeUser | null, number]>>();
    const FRIEND_CODE = /^\d{4}-\d{4}-\d{4}$/;

    const getFriendCodeData: express.RequestHandler = async (req, res, next) => {
        if (!FRIEND_CODE.test(req.params.friendcode)) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                error: 'invalid_request',
                error_message: 'Invalid friend code',
            }));
            return;
        }

        const cache = cached_friendcode_data.get(req.zncAuth!.user.id)?.get(req.params.friendcode);

        if (cache && ((cache[1] + friendcode_update_interval) > Date.now())) {
            debug('Using cached friend code data for %s, %s', req.zncAuth!.user.id, req.params.friendcode);
            next();
            return;
        }

        try {
            const promise = friendcode_data_promise.get(req.zncAuth!.user.id)?.get(req.params.friendcode) ?? req.znc!.getUserByFriendCode(req.params.friendcode).catch((err: Error | ErrorResponse<CoralErrorResponse>) => {
                if ('response' in err && err.data?.status === CoralStatus.RESOURCE_NOT_FOUND) {
                    // A user with this friend code doesn't exist
                    // This should be cached
                    return null;
                }

                throw err;
            }).then(user => {
                const cache = cached_friendcode_data.get(req.zncAuth!.user.id) ?? new Map<string, [FriendCodeUser | null, number]>();
                cache.set(req.params.friendcode, [user ?? null, Date.now()]);
                cached_friendcode_data.set(req.zncAuth!.user.id, cache);
            }).finally(() => {
                const promises = friendcode_data_promise.get(req.zncAuth!.user.id);
                promises?.delete(req.params.friendcode);
                if (!promises?.size) friendcode_data_promise.delete(req.zncAuth!.user.id);
            });
            const promises = friendcode_data_promise.get(req.zncAuth!.user.id) ?? new Map<string, Promise<void>>();
            promises.set(req.params.friendcode, promise);
            friendcode_data_promise.set(req.zncAuth!.user.id, promises);
            await promise;

            next();
        } catch (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                error: err,
                error_message: (err as Error).message,
            }));
        }
    };

    app.get('/api/znc/friendcode/:friendcode', localAuth, nsoAuth, getFriendCodeData, async (req, res) => {
        const [user, updated] = cached_friendcode_data.get(req.zncAuth!.user.id)!.get(req.params.friendcode)!;

        if (!user) res.statusCode = 404;
        res.setHeader('Cache-Control', 'immutable, max-age=' + cacheMaxAge(updated, friendcode_update_interval));
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(user ? {
            user,
            updated,
        } : {
            error: 'not_found',
            error_message: 'A user with this friend code was not found',
        }));
    });

    const user_friendcodeurl_promise = new Map</** NA ID */ string, Promise<void>>();
    const cached_friendcodeurl = new Map</** NA ID */ string, [FriendCodeUrl, number]>();

    const getFriendCodeUrl: express.RequestHandler = async (req, res, next) => {
        const cache = cached_friendcodeurl.get(req.zncAuth!.user.id);

        if (cache && ((cache[1] + update_interval) > Date.now())) {
            debug('Using cached friend code URL for %s', req.zncAuth!.user.id);
            next();
            return;
        }

        try {
            const promise = user_friendcodeurl_promise.get(req.zncAuth!.user.id) ?? req.znc!.getFriendCodeUrl().then(user => {
                cached_friendcodeurl.set(req.zncAuth!.user.id, [user, Date.now()]);
            }).finally(() => {
                user_friendcodeurl_promise.delete(req.zncAuth!.user.id);
            });
            user_friendcodeurl_promise.set(req.zncAuth!.user.id, promise);
            await promise;

            next();
        } catch (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                error: err,
                error_message: (err as Error).message,
            }));
        }
    };

    app.get('/api/znc/friendcode', localAuth, nsoAuth, getFriendCodeUrl, async (req, res) => {
        const [friendcodeurl, updated] = cached_friendcodeurl.get(req.zncAuth!.user.id)!;

        res.setHeader('Cache-Control', 'private, immutable, max-age=' + cacheMaxAge(updated, update_interval));
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
            friendcode: friendcodeurl,
            updated,
        }));
    });

    //
    // Event stream
    //

    app.get('/api/znc/presence/events', localAuth, nsoAuth, async (req, res) => {
        res.setHeader('Cache-Control', 'no-store');
        res.setHeader('Content-Type', 'text/event-stream');

        const nintendoAccountSessionToken = req.headers['authorization']!.substr(3);
        const i = new ZncNotifications(storage, nintendoAccountSessionToken, req.znc!, req.zncAuth!);

        i.user_notifications = false;
        i.friend_notifications = true;
        i.update_interval = update_interval / 1000;

        const es = i.notifications = new EventStreamNotificationManager(req, res);

        try {
            await i.loop(true);

            while (true) {
                await i.loop();
            }
        } catch (err) {
            es.sendEvent('error', {
                error: (err as Error).name,
                error_message: (err as Error).message,
            });
            res.end();
        }
    });

    return app;
}

function cacheMaxAge(updated_timestamp_ms: number, update_interval_ms: number) {
    return Math.floor(((updated_timestamp_ms + update_interval_ms) - Date.now()) / 1000);
}

class EventStreamNotificationManager extends NotificationManager {
    constructor(
        public req: express.Request,
        public res: express.Response
    ) {
        super();
    }

    sendEvent(event: string | null, ...data: unknown[]) {
        if (event) this.res.write('event: ' + event + '\n');
        for (const d of data) this.res.write('data: ' + JSON.stringify(d) + '\n');
        this.res.write('\n');
    }

    onPresenceUpdated(
        friend: CurrentUser | Friend, prev?: CurrentUser | Friend, type?: PresenceEvent,
        naid?: string, ir?: boolean
    ) {
        this.sendEvent(ZncPresenceEventStreamEvent.PRESENCE_UPDATED, {
            id: friend.nsaId, presence: friend.presence, prev: prev?.presence,
        });
    }

    onFriendOnline(friend: CurrentUser | Friend, prev?: CurrentUser | Friend, naid?: string, ir?: boolean) {
        this.sendEvent(ZncPresenceEventStreamEvent.FRIEND_ONLINE, {
            id: friend.nsaId, presence: friend.presence, prev: prev?.presence,
        });
    }

    onFriendOffline(friend: CurrentUser | Friend, prev?: CurrentUser | Friend, naid?: string, ir?: boolean) {
        this.sendEvent(ZncPresenceEventStreamEvent.FRIEND_OFFLINE, {
            id: friend.nsaId, presence: friend.presence, prev: prev?.presence,
        });
    }

    onFriendPlayingChangeTitle(friend: CurrentUser | Friend, prev?: CurrentUser | Friend, naid?: string, ir?: boolean) {
        this.sendEvent(ZncPresenceEventStreamEvent.FRIEND_TITLE_CHANGE, {
            id: friend.nsaId, presence: friend.presence, prev: prev?.presence,
        });
    }

    onFriendTitleStateChange(friend: CurrentUser | Friend, prev?: CurrentUser | Friend, naid?: string, ir?: boolean) {
        this.sendEvent(ZncPresenceEventStreamEvent.FRIEND_TITLE_STATECHANGE, {
            id: friend.nsaId, presence: friend.presence, prev: prev?.presence,
        });
    }
}
