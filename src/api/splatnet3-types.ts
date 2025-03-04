/** /bullet_tokens */
export interface BulletToken {
    bulletToken: string;
    lang: string;
    is_noe_country: 'true' | 'false';
}

/** /graphql */
export interface GraphQLRequest<Variables extends unknown> {
    variables: Variables;
    extensions: {
        persistedQuery: {
            version: 1;
            sha256Hash: RequestParameters['id'];
        };
    };
}

export interface RequestParameters {
    id: string;
    // ...
}

export interface GraphQLResponse<T = unknown> {
    data: T;
}

export enum RequestId {
    SupportButton_SupportChallengeMutation = '30aa261475d43bd765b4200fc67003c8',
    CheckinWithQRCodeMutation = '8e3fecf7cfce83f6831b17e9052791d0',
    CoopPagerLatestCoopQuery = '82385ab3c3444c857bd35a8d87dbc700',
    VotesUpdateFestVoteMutation = 'a2c742c840718f37488e0394cd6e1e08',
    CreateMyOutfitMutation = '31ff008ea218ffbe11d958a52c6f959f',
    UpdateMyOutfitMutation = 'bb809066282e7d659d3b9e9d4e46b43b',
    DownloadSearchReplayQuery = 'b461048f9ffc414b3967a3cdad0805dd',
    ReplayModalReserveReplayDownloadMutation = '87bff2b854168b496c2da8c0e7f3e5bc',
    PagerLatestVsDetailQuery = '0329c535a32f914fd44251be1f489e24',
    PagerUpdateBattleHistoriesByVsModeQuery = '67224c25f7b2e605205d152009f593c9',
    ConfigureAnalyticsQuery = 'f8ae00773cc412a50dd41a6d9a159ddd',
    CurrentFestQuery = 'c0429fd738d829445e994d3370999764',
    BankaraBattleHistoriesQuery = 'c1553ac75de0a3ea497cdbafaa93e95b',
    BankaraBattleHistoriesRefetchQuery = 'd8a8662345593bbbcd63841c91d4c6f5',
    LatestBattleHistoriesQuery = '7d8b560e31617e981cf7c8aa1ca13a00',
    LatestBattleHistoriesRefetchQuery = '80585ad4e4ecb674c3d8cd278adb1d21',
    PrivateBattleHistoriesQuery = '51981299595060692440e0ca66c475a1',
    PrivateBattleHistoriesRefetchQuery = '9ef974f2686a88f24e0dbff6f63a83c4',
    RegularBattleHistoriesQuery = '819b680b0c7962b6f7dc2a777cd8c5e4',
    RegularBattleHistoriesRefetchQuery = 'fed6e752513a9986177e8eec50dfdd3c',
    BattleHistoryCurrentPlayerQuery = '49dd00428fb8e9b4dde62f585c8de1e0',
    ChallengeQuery = '8a079214500148bf88a8fce1d7209b90',
    ChallengeRefetchQuery = '34aedc79f96b8613501bba465295f779',
    JourneyChallengeDetailQuery = '38e58b84376a2ad49ddbe4061b948455',
    JourneyChallengeDetailRefetchQuery = '8dc246933b1f4e26a6dfd251878cf786',
    JourneyQuery = 'bc71fc0264f3f72256724b069f7a4097',
    JourneyRefetchQuery = '09eee118fa16415d6bc3846bc6e5d8e5',
    CheckinQuery = 'af8cac2c2554e22e2bbada19392083a2',
    CoopHistoryDetailQuery = 'f3799a033f0a7ad4b1b396f9a3bafb1e',
    CoopHistoryDetailRefetchQuery = 'd3188df2fd4436870936b109675e2849',
    CoopHistoryQuery = '817618ce39bcf5570f52a97d73301b30',
    RefetchableCoopHistory_CoopResultQuery = 'a5692cf290ffb26f14f0f7b6e5023b07',
    DetailFestRecordDetailQuery = '2d661988c055d843b3be290f04fb0db9',
    DetailFestRefethQuery = '0eb7bac3d8aabcad0e9d663ee5b90846',
    DetailFestVotingStatusRefethQuery = '92f51ed1ab462bbf1ab64cad49d36f79',
    DetailRankingQuery = '58bdd28e3cf71c3bf38bc45836ee1e96',
    DetailVotingStatusQuery = '53ee6b6e2acc3859bf42454266d671fc',
    FestRecordQuery = '44c76790b68ca0f3da87f2a3452de986',
    FestRecordRefetchQuery = '73b9837d0e4dd29bfa2f1a7d7ee0814a',
    FriendListQuery = '7a0e05c28c7d3f7e5a06def87ab8cd2d',
    FriendListRefetchQuery = 'c1afed6111887347e244c639e7d35c69',
    GesotownQuery = 'd08dbdd29f31471e61daa978feea697a',
    GesotownRefetchQuery = 'c61bf8a7f7bc47393b8c0e7590ae11f4',
    SaleGearDetailOrderGesotownGearMutation = 'aebd822b4a4e48dc48f618411054b8f5',
    SaleGearDetailQuery = '7c4173bb0f5d56f29dbec889173cff24',
    HeroHistoryQuery = 'fbee1a882371d4e3becec345636d7d1c',
    HeroHistoryRefetchQuery = '4f9ae2b8f1d209a5f20302111b28f975',
    HistoryRecordQuery = '29957cf5d57b893934de857317cd46d8',
    HistoryRecordRefetchQuery = '5e1d0bb4b52e2a99049df6e17117f363',
    MyOutfitDetailQuery = 'd935d9e9ba7a5b6b5d6ece7f253304fc',
    MyOutfitsQuery = '81d9a6849467d2aa6b1603ebcedbddbe',
    MyOutfitsRefetchQuery = '10db4e349f3123c56df14e3adec2ee6f',
    MyOutfitCommonDataEquipmentsQuery = 'd29cd0c2b5e6bac90dd5b817914832f8',
    MyOutfitCommonDataFilteringConditionQuery = 'd02ab22c9dccc440076055c8baa0fa7a',
    PhotoAlbumQuery = '7e950e4f69a5f50013bba8a8fb6a3807',
    PhotoAlbumRefetchQuery = '53fb0ad32c13dd9a6e617b1158cc2d41',
    ReplayQuery = 'f98cc8326d0d17b07a5785096b0f3517',
    ReplayUploadedReplayListRefetchQuery = 'dd56e76c75cda6af077a223c351ad61d',
    SettingQuery = '61228d553e7463c203e05e7810dd79a7',
    StageRecordQuery = '53dffcfb06b273dd7bdf6a303d310730',
    StageRecordsRefetchQuery = '38624d4864879c745c7b20e653e062db',
    StageScheduleQuery = '10e1d424391e78d21670227550b3509f',
    WeaponRecordQuery = 'a0c277c719b758a926772879d8e53ef8',
    WeaponRecordsRefetchQuery = '23c9b2b4ad878c2d91a68859be928dea',
    CatalogQuery = 'aead379b98c14798df81f0dd3ebe6121',
    CatalogRefetchQuery = '02d2de8967f4ad2ce4f67a3c6c7c4d48',
    HomeQuery = 'dba47124d5ec3090c97ba17db5d2f4b3',
    VsHistoryDetailPagerRefetchQuery = '994cf141e55213e6923426caf37a1934',
    VsHistoryDetailQuery = 'cd82f2ade8aca7687947c5f3210805a6',
}

interface _NodeList<T, C extends boolean = false> {
    nodes: T[];
    totalCount: number;
}
type NodeList<T, C extends boolean = false> =
    C extends true ? _NodeList<T> : Pick<_NodeList<T>, 'nodes'>;
type NodeListTotal = Pick<_NodeList<unknown>, 'totalCount'>;

interface Colour {
    a: number;
    b: number;
    g: number;
    r: number;
}

interface Weapon {
    name: string;
    image: {
        url: string;
    };
    id: string;
}
interface SubWeapon {
    name: string;
    image: {
        url: string;
    };
    id: string;
}
interface SpecialWeapon {
    name: string;
    image: {
        url: string;
    };
    id: string;
}
interface WeaponSet extends Weapon {
    subWeapon: SubWeapon;
    specialWeapon: SpecialWeapon;
}

interface ExtendedSpecialWeapon extends SpecialWeapon {
    maskingImage: {
        width: number;
        height: number;
        maskImageUrl: string;
        overlayImageUrl: string;
    };
}
interface ExtendedWeaponSet extends WeaponSet {
    specialWeapon: ExtendedSpecialWeapon;
    image3d: {
        url: string;
    };
    image2d: {
        url: string;
    };
    image3dThumbnail: {
        url: string;
    };
    image2dThumbnail: {
        url: string;
    };
}

interface VsMode {
    mode: string; // "REGULAR"
    id: string; // "VnNNb2RlLTE="
}

interface Nameplate {
    badges: [NameplateBadge | null, NameplateBadge | null, NameplateBadge | null];
    background: NameplateBackground;
}
interface NameplateBadge {
    id: string;
    image: {
        url: string;
    };
}
interface NameplateBackground {
    textColor: Colour;
    image: {
        url: string;
    };
    id: string;
}

export enum Judgement {
    WIN = 'WIN',
    LOSE = 'LOSE',
    EXEMPTED_LOSE = 'EXEMPTED_LOSE', // exemption
    DEEMED_LOSE = 'DEEMED_LOSE', // penalty
    DRAW = 'DRAW', // no contest
}
export enum JudgementKnockout {
    NEITHER = 'NEITHER',
    WIN = 'WIN',
    LOSE = 'LOSE',
}
export enum Species {
    INKLINK = 'INKLING',
    OCTOLING = 'OCTOLING',
}

interface HeadGear {
    __isGear: 'HeadGear';
    name: string;
    image: {
        url: string;
    };
    primaryGearPower: GearPower;
    additionalGearPowers: GearPower[];
}
interface ClothingGear {
    __isGear: 'ClothingGear';
    name: string;
    image: {
        url: string;
    };
    primaryGearPower: GearPower;
    additionalGearPowers: GearPower[];
}
interface ShoesGear {
    __isGear: 'ShoesGear';
    name: string;
    image: {
        url: string;
    };
    primaryGearPower: GearPower;
    additionalGearPowers: GearPower[];
}
interface GearPower {
    name: string; // "Ink Recovery Up", "Unknown"
    image: {
        url: string;
    };
}

export enum FestState {
    SCHEDULED = 'SCHEDULED',
    FIRST_HALF = 'FIRST_HALF',
    SECOND_HALF = 'SECOND_HALF',
    CLOSED = 'CLOSED',
}
export enum FestVoteState {
    VOTED = 'VOTED',
    PRE_VOTED = 'PRE_VOTED',
}
export enum FestTeamRole {
    ATTACK = 'ATTACK',
    DEFENSE = 'DEFENSE',
}
export enum TricolourRole {
    ATTACK_1 = 'ATTACK1',
    ATTACK_2 = 'ATTACK2',
    DEFENSE = 'DEFENSE',
}
export enum DragonMatchType {
    NORMAL = 'NORMAL',
    DECUPLE = 'DECUPLE', // 10x
    DRAGON = 'DRAGON', // 100x
    DOUBLE_DRAGON = 'DOUBLE_DRAGON', // 333x
}
export enum FestDragonCert {
    NONE = 'NONE',
    DRAGON = 'DRAGON', // 100x
    DOUBLE_DRAGON = 'DOUBLE_DRAGON', // 333x
}

/** a2c742c840718f37488e0394cd6e1e08 VotesUpdateFestVoteMutation */
export interface VotesUpdateFestVoteResult {
    updateFestVote: {
        fest: {
            id: string;
            teams: DetailVotingStatusTeam<NodeList<FestVotePlayer, true>>[];
            isVotable: boolean;
            undecidedVotes: NodeList<FestVotePlayer, true>;
        };
        userErrors: null;
    };
}

/** f8ae00773cc412a50dd41a6d9a159ddd ConfigureAnalyticsQuery */
export interface ConfigureAnalyticsResult {
    playHistory: {
        udemaeMax: string;
        paintPointTotal: number;
        gameStartTime: string;
        battleNumTotal: number;
        xMatchMaxAr: {
            rank: string | null;
        };
        xMatchMaxCl: {
            rank: string | null;
        };
        xMatchMaxGl: {
            rank: string | null;
        };
        xMatchMaxLf: {
            rank: string | null;
        };
    }
}

/** c0429fd738d829445e994d3370999764 useCurrentFestQuery */
export interface CurrentFestResult {
    currentFest: CurrentFest | null;
}

interface CurrentFest {
    id: string;
    state: FestState;
    teams: CurrentFestTeam[];
}
interface CurrentFestTeam {
    color: Colour;
    id: string;
}

/** c1553ac75de0a3ea497cdbafaa93e95b BankaraBattleHistoriesQuery */
export type BankaraBattleHistoriesResult = unknown;

/** 817618ce39bcf5570f52a97d73301b30 CoopHistoryQuery */
export interface CoopHistoryResult {
    coopResult: {
        historyGroups: NodeList<CoopHistoryGroup>;
        historyGroupsOnlyFirst: unknown;
        monthlyGear: unknown;
        pointCard: unknown;
        regularAverageClearWave: unknown;
        regularGrade: unknown;
        regularGradePoint: unknown;
        scale: unknown;
    }
}
interface CoopHistoryGroup {
    historyDetails: NodeList<CoopHistoryDetail>;
}
interface CoopHistoryDetail {
    afterGrade: unknown;
    afterGradePoint: unknown;
    bossResult: unknown;
    coopStage: unknown;
    gradePointDiff: unknown;
    id: string;
    memberResults: unknown;
    myResult: unknown;
    nextHistoryDetail: {
        id: string;
    } | null;
    previousHistoryDetail: {
        id: string;
    } | null;
    resultWave: unknown;
    waveResults: unknown;
    weapons: unknown;
}

/** f3799a033f0a7ad4b1b396f9a3bafb1e CoopHistoryDetailQuery */
export interface CoopHistoryDetailResult {
    coopHistoryDetail: unknown;
}

/** 7d8b560e31617e981cf7c8aa1ca13a00 LatestBattleHistoriesQuery */
export interface LatestBattleHistoriesResult {
    latestBattleHistories: {
        summary: latestBattleHistoriesSummary;
        historyGroupsOnlyFirst: NodeList<LatestBattleHistoryGroupOnlyFirst>;
        historyGroups: NodeList<LatestBattleHistoryGroup>;
    };
    currentFest: CurrentFest | null;
}
interface latestBattleHistoriesSummary {
    assistAverage: number;
    deathAverage: number;
    killAverage: number;
    lose: number;
    perUnitTimeMinute: number;
    specialAverage: number;
    win: number;
}
interface LatestBattleHistoryGroupOnlyFirst<HasOverlayImage extends boolean = false> {
    historyDetails: NodeList<LatestBattleHistoryGroupOnlyFirstDetails<HasOverlayImage>>;
}
interface LatestBattleHistoryGroupOnlyFirstDetails<HasOverlayImage extends boolean = false> {
    player: {
        weapon: {
            specialWeapon: {
                maskingImage: {
                    width: number;
                    height: number;
                    maskImageUrl: string;
                    overlayImageUrl: HasOverlayImage extends true ? string : never;
                };
                id: string;
            };
            id: string;
        };
        id: string;
    };
    id: string;
}
interface LatestBattleHistoryGroup {
    historyDetails: NodeList<AnyLatestBattleHistoryDetails>;
}
interface LatestBattleHistoryDetails {
    id: string;
    vsMode: VsMode;
    vsRule: {
        name: string; // "Turf War"
        id: string; // "VnNSdWxlLTA="
    };
    vsStage: {
        name: string; // "Mincemeat Metalworks"
        id: string; // "VnNTdGFnZS02"
        image: {
            url: string;
        };
    };
    judgement: Judgement;
    player: {
        weapon: Weapon;
        id: string;
        festGrade: unknown | null;
    };
    knockout: JudgementKnockout;
    myTeam: {
        result: {
            paintPoint: number;
            paintRatio: number;
            score: number | null;
        };
    };
    nextHistoryDetail: {
        id: string;
    } | null;
    previousHistoryDetail: {
        id: string;
    } | null;
}
interface AnyLatestBattleHistoryDetails extends LatestBattleHistoryDetails {
    udemae: unknown | null;
    bankaraMatch: unknown | null;
    leagueMatch: unknown | null;
}

/** 51981299595060692440e0ca66c475a1 PrivateBattleHistoriesQuery */
export type PrivateBattleHistoriesResult = unknown;

/** 819b680b0c7962b6f7dc2a777cd8c5e4 RegularBattleHistoriesQuery */
export interface RegularBattleHistoriesResult {
    regularBattleHistories: {
        summary: latestBattleHistoriesSummary;
        historyGroupsOnlyFirst: NodeList<LatestBattleHistoryGroupOnlyFirst<true>>;
        historyGroups: NodeList<RegularBattleHistoryGroup>;
    };
}
interface RegularBattleHistoryGroup {
    lastPlayedTime: string;
    historyDetails: NodeList<LatestBattleHistoryDetails>;
}

/** 49dd00428fb8e9b4dde62f585c8de1e0 BattleHistoryCurrentPlayerQuery */
export interface BattleHistoryCurrentPlayerResult {
    currentPlayer: {
        species: Species;
        weapon: {
            specialWeapon: {
                maskingImage: {
                    width: number;
                    height: number;
                    maskImageUrl: string;
                    overlayImageUrl: string;
                };
                id: string;
            };
            id: string;
        };
    };
}

/** 7a0e05c28c7d3f7e5a06def87ab8cd2d FriendListQuery */
export interface FriendListResult {
    /** Only includes friends that have played Splatoon 3 */
    friends: NodeList<Friend>;
    currentFest: CurrentFest | null;
}

/** c1afed6111887347e244c639e7d35c69 FriendListRefetchQuery */
export type FriendListRefetchResult = FriendListResult;

interface Friend {
    id: string;
    onlineState: FriendOnlineState;
    /** Switch user name */
    nickname: string;
    /** Splatoon 3 name, if the user has one set and is currently playing Splatoon 3 */
    playerName: string | null;
    userIcon: {
        url: string;
        width: number;
        height: number;
    };
    vsMode: {
        id: string; // "VnNNb2RlLTI=" (2 == Anarchy Series), "VnNNb2RlLTUx" (51 == Anarchy Open)
        mode: string; // "BANKARA"
        name: string; // "Anarchy Battle"
    } | null;
    isFavorite: boolean;
    isLocked: boolean | null;
    isVcEnabled: boolean | null;
}

export enum FriendOnlineState {
    OFFLINE = 'OFFLINE',
    /**
     * The user is online and selected in *any* game, not just Splatoon 3.
     * Coral may be used to check which game the user is playing.
     */
    ONLINE = 'ONLINE',
    VS_MODE_MATCHING = 'VS_MODE_MATCHING',
    COOP_MODE_MATCHING = 'COOP_MODE_MATCHING',
    VS_MODE_FIGHTING = 'VS_MODE_FIGHTING',
    COOP_MODE_FIGHTING = 'COOP_MODE_FIGHTING',
}

/** 29957cf5d57b893934de857317cd46d8 HistoryRecordQuery */
export interface HistoryRecordResult {
    currentPlayer: CurrentPlayer;
    playHistory: PlayHistory;
}

interface CurrentPlayer {
    __isPlayer: 'CurrentPlayer';
    byname: string; // "Splatlandian Youth"
    name: string;
    nameId: string;
    nameplate: Nameplate;
    weapon: WeaponSet;
    headGear: HeadGear;
    clothingGear: ClothingGear;
    shoesGear: ShoesGear;
}

interface PlayHistory {
    currentTime: string;
    gameStartTime: string;
    udemaeMax: string; // "B-"
    xMatchMaxAr: XMatchMax;
    xMatchMaxCl: XMatchMax;
    xMatchMaxGl: XMatchMax;
    xMatchMaxLf: XMatchMax;
    winCountTotal: number;
    frequentlyUsedWeapons: Weapon[];
    paintPointTotal: number;
    badges: HistoryBadgeId[];
    weaponHistory: NodeList<WeaponHistorySeason>;
    recentBadges: HistoryBadge[];
    allBadges: HistoryBadge[];
}
interface HistoryBadgeId {
    id: string;
}
interface HistoryBadge {
    description: string;
    id: string;
    image: {
        url: string;
    };
}
interface XMatchMax {
    power: null;
    rank: null;
    rankUpdateSeasonName: null;
    powerUpdateTime: null;
}
interface WeaponHistorySeason {
    seasonName: string; // "Drizzle Season 2022"
    isMonthly: boolean;
    startTime: string; // "2022-09-01T00:00:00Z"
    endTime: string; // "2022-09-09T10:13:36Z"
    weaponCategories: WeaponHistoryCategory[];
    weapons: WeaponHistoryRecord[];
}
interface WeaponHistoryRecord {
    weapon: WeaponHistoryWeapon;
    utilRatio: number;
}
interface WeaponHistoryWeapon extends Weapon {
    weaponId: number;
}
interface WeaponHistoryCategory {
    weaponCategory: WeaponCategory;
    utilRatio: number;
    weapons: WeaponHistoryCategoryRecord[];
}
interface WeaponCategory {
    name: string; // "Shooters"
    category: string; // "Shooter"
    id: string; // "V2VhcG9uQ2F0ZWdvcnktMA=="
}
interface WeaponHistoryCategoryRecord {
    weapon: WeaponHistoryCategoryWeapon;
    utilRatio: number;
}
interface WeaponHistoryCategoryWeapon extends WeaponHistoryWeapon {
    weaponCategory: {
        category: string; // "Shooter"
        id: string; // "V2VhcG9uQ2F0ZWdvcnktMA=="
    };
}

/** 2d661988c055d843b3be290f04fb0db9 DetailFestRecordDetailQuery */
export interface DetailFestRecordDetailResult {
    fest: {
        __typename: 'Fest';
        id: string;
        title: string;
        lang: string;
        startTime: string;
        endTime: string;
        state: FestState;
        image: {
            url: string;
        };
        teams: DetailFestTeam[];
        playerResult: unknown | null;
        myTeam: unknown | null;
        isVotable: boolean;
        undecidedVotes: NodeListTotal;
    };
    currentPlayer: {
        name: string;
        userIcon: {
            url: string;
        };
    };
}

interface DetailFestTeam<Votes = NodeListTotal> {
    result: unknown | null;
    id: string;
    teamName: string;
    color: Colour;
    image: {
        url: string;
    };
    myVoteState: FestVoteState | null;
    preVotes: Votes;
    votes: Votes;
    role: FestTeamRole | null;
}

/** 0eb7bac3d8aabcad0e9d663ee5b90846 DetailFestRefethQuery */
export type DetailFestRefetchResult = DetailFestRecordDetailResult;

/** 92f51ed1ab462bbf1ab64cad49d36f79 DetailFestVotingStatusRefethQuery */
export type DetailFestVotingStatusRefetchResult = DetailVotingStatusResult;

/** 53ee6b6e2acc3859bf42454266d671fc DetailVotingStatusQuery */
export interface DetailVotingStatusResult {
    fest: {
        __typename: 'Fest';
        id: string;
        lang: string;
        teams: DetailVotingStatusTeam[];
        undecidedVotes: NodeList<FestVotePlayer>;
    };
}

interface DetailVotingStatusTeam<Votes = NodeList<FestVotePlayer>> {
    id: string;
    teamName: string;
    image: {
        url: string;
    };
    color: Colour;
    /** undefined = not voted, null = not voted for this team */
    myVoteState?: FestVoteState | null;
    preVotes: Votes;
    votes: Votes;
}

interface FestVotePlayer {
    playerName: string;
    userIcon: {
        url: string;
    };
}

/** 44c76790b68ca0f3da87f2a3452de986 FestRecordQuery */
export interface FestRecordResult {
    festRecords: NodeList<FestRecord>;
    currentPlayer: {
        name: string;
        userIcon: {
            url: string;
        };
    };
}

interface FestRecord {
    id: string;
    state: FestState;
    startTime: string;
    endTime: string;
    title: string;
    lang: string;
    image: {
        url: string;
    };
    playerResult: unknown | null;
    teams: FestRecordTeam[];
    myTeam: unknown | null;
}

interface FestRecordTeam {
    id: string;
    teamName: string;
    result: unknown | null;
}

/** 73b9837d0e4dd29bfa2f1a7d7ee0814a FestRecordRefetchQuery */
export type FestRecordRefetchResult = FestRecordResult;

/** 61228d553e7463c203e05e7810dd79a7 SettingQuery */
export interface SettingResult {
    currentPlayer: {
        name: string;
        userIcon: {
            url: string;
        };
    };
}

/** 10e1d424391e78d21670227550b3509f StageScheduleQuery */
export interface StageScheduleResult {
    regularSchedules: NodeList<ScheduleResult<RegularSchedule>>;
    bankaraSchedules: NodeList<ScheduleResult<BankaraSchedule>>;
    xSchedules: NodeList<ScheduleResult<XSchedule>>;
    leagueSchedules: NodeList<ScheduleResult<LeagueSchedule>>;
    coopGroupingSchedule: {
        regularSchedules: NodeList<CoopRegularSchedule>;
        bigRunSchedules: NodeList<unknown>;
    };
    festSchedules: NodeList<FestSchedule>;
    currentFest: SchedulesCurrentFest | null;
    currentPlayer: {
        userIcon: {
            url: string;
        };
    };
    vsStages: NodeList<VsStageDetail>;
}

interface Schedule {
    startTime: string; // "2022-09-09T08:00:00Z"
    endTime: string; // "2022-09-09T10:00:00Z"
}

type ScheduleResult<T extends Schedule> = NormalSchedule<T> | FestActiveSchedule<T>;
type NormalSchedule<T extends Schedule> = T & {
    festMatchSetting: null;
};
type FestActiveSchedule<T extends Schedule> = {
    [K in keyof T]:
        K extends `festMatchSetting` ? FestActiveSetting :
        K extends `${string}MatchSetting${'' | 's'}` ? null : T[K];
} & {
    festMatchSetting: FestActiveSetting;
};

interface RegularSchedule extends Schedule {
    regularMatchSetting: RegularMatchSetting;
}
interface RegularMatchSetting {
    __isVsSetting: 'RegularMatchSetting';
    __typename: 'RegularMatchSetting';
    vsStages: VsStage[];
    vsRule: VsRule;
}

interface BankaraSchedule extends Schedule {
    bankaraMatchSettings: BankaraMatchSetting[];
}
interface BankaraMatchSetting {
    __isVsSetting: 'BankaraMatchSetting';
    __typename: 'BankaraMatchSetting';
    vsStages: VsStage[];
    vsRule: VsRule;
    mode: BankaraMatchMode;
}

export enum BankaraMatchMode {
    CHALLENGE = 'CHALLENGE',
    OPEN = 'OPEN',
}

interface XSchedule extends Schedule {
    xMatchSetting: XMatchSetting;
}
interface XMatchSetting {
    __isVsSetting: 'XMatchSetting';
    __typename: 'XMatchSetting';
    vsStages: VsStage[];
    vsRule: VsRule;
}

interface LeagueSchedule extends Schedule {
    leagueMatchSetting: LeagueMatchSetting;
}
interface LeagueMatchSetting {
    __isVsSetting: 'LeagueMatchSetting';
    __typename: 'LeagueMatchSetting';
    vsStages: VsStage[];
    vsRule: VsRule;
}

interface VsStage {
    id: string; // "VnNTdGFnZS0xMQ=="
    vsStageId: number; // 11
    name: string; // "Museum d'Alfonsino"
    image: {
        url: string;
    };
}

interface VsRule {
    name: string; // "Turf War", "Rainmaker", "Tower Control", "Splat Zones", "Clam Blitz"
    rule: string; // "TURF_WAR", "GOAL", "LOFT", "AREA", "CLAM"
    id: string; // "VnNSdWxlLTA=", "VnNSdWxlLTM=", "VnNSdWxlLTI=", "VnNSdWxlLTE=", "VnNSdWxlLTQ="
}

interface CoopRegularSchedule {
    startTime: string; // "2022-09-08T08:00:00Z"
    endTime: string; // "2022-09-10T00:00:00Z"
    setting: CoopNormalSetting;
}

interface CoopNormalSetting {
    __typename: 'CoopNormalSetting';
    coopStage: CoopStage;
    weapons: CoopWeapon[];
}

interface CoopStage {
    name: string; // "Sockeye Station"
    coopStageId: number; // 2
    thumbnailImage: {
        url: string;
    };
    image: {
        url: string;
    };
    id: string; // "Q29vcFN0YWdlLTI="
}

interface CoopWeapon {
    name: string; // "Splattershot Jr."
    image: {
        url: string;
    };
}

interface SchedulesCurrentFest {
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    midtermTime: string;
    state: FestState;
    teams: SchedulesCurrentFestTeam[];
    tricolorStage: Omit<VsStage, 'vsStageId'>;
}
interface SchedulesCurrentFestTeam {
    id: string;
    color: Colour;
    /** null = not voted or not voted for this team */
    myVoteState: FestVoteState | null;
    role: FestTeamRole | null;
}

interface FestSchedule extends Schedule {
    festMatchSetting: FestMatchSetting | null;
}
interface FestMatchSetting {
    __isVsSetting: 'FestMatchSetting';
    __typename: 'FestMatchSetting';
    vsStages: VsStage[];
    vsRule: VsRule;
    // ...
}

interface FestActiveSetting {
    __typename: 'FestMatchSetting';
}

interface VsStageDetail {
    stageId: number; // 1
    id: string; // "VnNTdGFnZS0x"
    originalImage: {
        url: string;
    };
    name: string; // "Scorch Gorge"
    stats: VsStageStats | null;
}

interface VsStageStats {
    winRateAr: null;
    winRateLf: null;
    winRateGl: null;
    winRateCl: null;
}

/** dba47124d5ec3090c97ba17db5d2f4b3 HomeQuery */
export interface HomeResult {
    currentPlayer: {
        weapon: {
            image: {
                url: string;
            };
            id: string;
        };
    };
    banners: HomeBanner[];
    /**
     * Only includes up to 3 online friends that have played Splatoon 3, even if they are currently
     * playing a different game. `totalCount` also only counts online friends.
     */
    friends: NodeList<HomeFriend, true>;
    footerMessages: HomeFooterMessage[];
}

interface HomeBanner {
    image: {
        url: string;
        width: number;
        height: number;
    };
    message: string;
    jumpTo: string;
}

interface HomeFriend {
    id: string;
    nickname: string;
    userIcon: {
        height: number;
        url: string;
        width: number;
    };
}

type HomeFooterMessage = FooterBigRunMessage | FooterFestMessage | FooterSeasonMessage;

interface FooterBigRunMessage {
    __typename: 'FooterBigRunMessage';
    bigRunState: 'SCHEDULED' | unknown;
}
interface FooterFestMessage {
    __typename: 'FooterFestMessage';
    festState: FestState;
    festTitle: string;
}
interface FooterSeasonMessage {
    __typename: 'FooterSeasonMessage';
    seasonName: string;
}

/** 994cf141e55213e6923426caf37a1934 VsHistoryDetailPagerRefetchQuery */
export interface VsHistoryDetailPagerRefetchQueryResult {
    vsHistoryDetail: {
        __typename: 'VsHistoryDetail';
        nextHistoryDetail: {
            id: string;
        } | null;
        previousHistoryDetail: {
            id: string;
        } | null;
        id: string;
    };
}

/** cd82f2ade8aca7687947c5f3210805a6 VsHistoryDetailQuery */
export interface VsHistoryDetailResult {
    vsHistoryDetail: VsHistoryDetail;
}

interface VsHistoryDetail {
    __typename: 'VsHistoryDetail';
    id: string;
    vsRule: VsRule;
    vsMode: VsMode;
    player: VsHistoryDetailPlayer;
    judgement: Judgement;
    myTeam: VsHistoryDetailTeam;
    vsStage: {
        name: string; // "Mincemeat Metalworks"
        image: {
            url: string;
        };
        id: string; // "VnNTdGFnZS02"
    };
    festMatch: FestMatchDetail | null;
    knockout: JudgementKnockout;
    otherTeams: VsHistoryDetailTeam[];
    bankaraMatch: BankaraMatchDetail | null;
    xMatch: XMatchDetail | null;
    duration: number;
    playedTime: string;
    awards: Award[];
    leagueMatch: unknown | null;
    nextHistoryDetail: {
        id: string;
    } | null;
    previousHistoryDetail: {
        id: string;
    } | null;
}

interface FestMatchDetail {
    myFestPower: number;
    contribution: number;
    jewel: number;
    dragonMatchType: DragonMatchType;
    // ...
}
interface BankaraMatchDetail {
    earnedUdemaePoint: number;
    mode: BankaraMatchMode;
    // ...
}
interface XMatchDetail {
    lastXPower: number;
    entireXPower: number;
    // ...
}

interface BaseVsPlayer {
    __isPlayer: 'VsPlayer';
    byname: string; // "Splatlandian Youth"
    name: string;
    nameId: string;
    nameplate: Nameplate;
    id: string;
    paint: number;
}

interface VsHistoryDetailPlayer extends BaseVsPlayer {
    headGear: VsHistoryDetailPlayerHeadGear;
    clothingGear: VsHistoryDetailPlayerClothingGear;
    shoesGear: VsHistoryDetailPlayerShoesGear;
}
interface VsHistoryDetailPlayerHeadGear extends HeadGear {
    originalImage: {
        url: string;
    };
    brand: GearBrand;
}
interface VsHistoryDetailPlayerClothingGear extends ClothingGear {
    originalImage: {
        url: string;
    };
    brand: GearBrand;
}
interface VsHistoryDetailPlayerShoesGear extends ShoesGear {
    originalImage: {
        url: string;
    };
    brand: GearBrand;
}

interface VsHistoryDetailTeam {
    color: Colour;
    judgement: Judgement;
    result: {
        paintRatio: number;
        score: number | null;
        noroshi: number | null;
    };
    tricolorRole: TricolourRole | null;
    festTeamName: string | null;
    players: VsPlayer[];
    order: number;
}

interface VsPlayer extends BaseVsPlayer {
    __typename: 'VsPlayer';
    isMyself: boolean;
    weapon: ExtendedWeaponSet;
    headGear: VsPlayerHeadGear;
    clothingGear: VsPlayerClothingGear;
    shoesGear: VsPlayerShoesGear;
    species: Species;
    result: {
        kill: number;
        death: number;
        assist: number;
        special: number;
        noroshiTry: number | null;
    };
    festDragonCert: FestDragonCert;
}

interface GearBrand {
    name: string; // "Forge"
    image: {
        url: string;
    };
    id: string; // "QnJhbmQtNQ=="
}
interface VsPlayerHeadGear {
    __isGear: 'HeadGear';
    name: string;
    primaryGearPower: GearPower;
    additionalGearPowers: GearPower[];
    originalImage: {
        url: string;
    };
    thumbnailImage: {
        url: string;
    };
    brand: GearBrand;
}
interface VsPlayerClothingGear {
    __isGear: 'ClothingGear';
    name: string;
    primaryGearPower: GearPower;
    additionalGearPowers: GearPower[];
    originalImage: {
        url: string;
    };
    thumbnailImage: {
        url: string;
    };
    brand: GearBrand;
}
interface VsPlayerShoesGear {
    __isGear: 'ShoesGear';
    name: string;
    primaryGearPower: GearPower;
    additionalGearPowers: GearPower[];
    originalImage: {
        url: string;
    };
    thumbnailImage: {
        url: string;
    };
    brand: GearBrand;
}

interface Award {
    name: string; // "#1 Turf Inker"
    rank: string; // "GOLD"
}
