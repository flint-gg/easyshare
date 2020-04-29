export const enum Gender {
  Unknown = 0, // unknown
  Male = 1, // male
  Female = 2, // female
  Diverse = 3, // divers
  Apache = 4 // apache helicopter
}

export const enum mailchimpSubscribe {
  failure = 0,
  success,
  already
}

export const enum likeMediaReturn {
  ownMedia = 0,
  success,
  failed,
  alreadyLiked,
  unknownError
}

export enum gameId {
  lol = 0, // 0 aka. League of Legends
  wow, // 1 aka. World of Warcraft
  fn, // 2 aka. Fortnite
  tft, // 3 aka. Teamfight Tactics
  hs // 4 aka. Hearthstone
}

export enum gameGenre {
  action = 0, // 0
  sport, // 1
  fantasy, // 2
  strategy, // 3
  history, // 4
  drama, // 5
  crime, // 6
  war, // 7
  cartoon, // 8
  driving // 9
}

export const enum typeOfMedia {
  image = 0,
  video = 1 // other might come later
}

export const enum mediaIntent { // add +1 to typeOfMedia for conversion
  profilepicture = 0,
  image,
  video
}

export const enum getMediaIntent {
  profilepicture = 0,
  gamecard
}

export const enum language {
  en = 0,
  de,
  ru
  // TODO add more
}

// stuff for gamecards

// fortnite
export const enum fnGameMode {
  solo = 0,
  duo,
  team
}

export enum fnLandingspot {
  'Junk Junction' = 0,
  'The Block',
  'Haunted Hills',
  'Pleasant Park',
  'Snobby Shores',
  'Loot Lake',
  'Neo Tilted',
  'Shifty Shafts',
  'Polar Peak',
  'Happy Hamlet',
  'Frosty Flights',
  'Lazy Lagoon',
  'Dusty Depot',
  'Salty Springs',
  'Fatal Fields',
  'Lucky Landing',
  'Pressure Plant',
  'Mega Mall',
  'Paradise Palms',
  'Lonely Lodge',
  'Sunny Steps',
  'Greasy Grove',
  'Moisty Palms',
  'Pandora',
  'Steamy Stacks',
  'E.G.O Science Station',
  'Retail Row',
  'Camp Cod',
  'Eye Land'
}

export enum fnItemRarity {
  common = 'common',
  uncommon = 'uncommon',
  rare = 'rare',
  epic = 'epic',
  dc = 'dc',
  marvel = 'marvel',
  legendary = 'legendary',
  dark = 'dark',
  lava = 'lava',
  starwars = 'starwars',
  frozen = 'frozen',
  creator = 'creator',
  shadow = 'shadow'
}

export enum fnPlatform {
  all = 0,
  keyboardmouse,
  touch,
  gamepad
}

export enum duoModes {
  defaultduo = 1,
  deimos_duo_winter,
  goose_duos_24,
  deimos_duo,
  showdowntournament_duos,
  unvaulted_duos,
  score_duos,
  showdownalt_duos,
  blitz_duos,
  fill_duos,
  snipers_duos
}

export enum squadModes {
  showdown_trios = 1,
  paradise_squads,
  deimos_squad_winter,
  solidgold_squads,
  sword_squads,
  showdowntournament_trios,
  close_squad,
  classic_squads,
  steady_squads,
  wax_squads,
  trios,
  deimos_squad,
  showdownalt_trios,
  vamp_squad,
  ground_squads,
  bling_squads,
  blitz_squad,
  bison_respawn_squads,
  hard_squads,
  defaultsquad,
  showdown_squads,
  snipers_squad
}

// leagueoflegends

export enum lolGameMode {
  solo = 0,
  flex,
  twistedtreeline
}

export enum lolRank {
  unranked = 0,
  ironiv,
  ironiii,
  ironii,
  ironi,
  bronzeiv,
  bronzeiii,
  bronzeii,
  bronzei,
  silveriv,
  silveriii,
  silverii,
  silveri,
  goldiv,
  goldiii,
  goldii,
  goldi,
  plativ,
  platiii,
  platii,
  plati,
  diaiv,
  diaiii,
  diaii,
  diai,
  master,
  grandmaster,
  challenger
}

export enum lolLane {
  top = 0,
  jungle,
  mid,
  bot,
  support
}

export enum matchLane { // used by pyke
  top = 'TOP',
  jungle = 'JUNGLE',
  mid = 'MID',
  bot = 'BOTTOM',
  sup = 'SUPPORT',
  none = 'NONE'
}
export enum matchRole { // also pyke
  solo = 'SOLO',
  duo = 'DUO',
  duo_carry = 'DUO_CARRY',
  duo_support = 'DUO_SUPPORT',
  none = 'NONE'
}

export const enum HTTPStatusCodes {
  defaultError = 400,
  unauthorized = 401,
  forbidden = 403,
  defaultServerError = 500
}
export const enum reportReason {
  spam = 0,
  inappropriate
}

export const enum ApiState {
  ok = 1,
  slow,
  dead,
  untracked = -1
}

export enum flintMust {
  dontCare = 0, // flint state does not care about api state
  beFast = 1, // flint state == api state
  beOk // flint state is only afflicted if the api is down
}

export const enum deletionStatus {
  not = 0,
  pending = 1,
  deleted = 2
}
