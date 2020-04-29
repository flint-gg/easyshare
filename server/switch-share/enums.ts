export enum switchAccountType {
  'twitter' = 1,
  'facebook'
}

export enum switchHashtag {
  'NintendoSwitch' = 1,
  'switchshare',
  'flintggshare',
  'flintgg',
  'easyshare'
}
export enum switchEvent {
  'signup' = 1,
  'login',
  'logout',
  'linkPhotos',
  'unlinkPhotos',
  'singleImage',
  'multiImage',
  'singleVideo',
  'changeSettings'
}
export type trackedUser = {
  oauth_token: string;
  oauth_token_secret: string;
  screen_name: string;
};

export type gphotosTokens = {
  access_token: string;
  refresh_token: string; // since on link, we force to get another
  expiry_date: number;
  scope: string;
  token_type: string;
};

export type linkedUser = gphotosTokens & { albumId?: string };

type base_share_user_type = {
  created: Date;
  updated: Date;
  id: flintId;
  hashtags: Array<switchHashtag>;
  token: string;
  token_secret: string;
  name: string;
  type: switchAccountType;
};

export type switch_share_user_type_with_ph = base_share_user_type & {
  ph_token: string;
  ph_refresh_token: string;
  ph_album: string;
  ph_token_expiry: Date;
};

export type switch_share_user_type_without_ph = base_share_user_type & {
  ph_token: undefined;
  ph_refresh_token: undefined;
  ph_album: undefined;
  ph_token_expiry: undefined;
};

export type switch_share_user_type =
  | switch_share_user_type_without_ph
  | switch_share_user_type_with_ph;

export type switchStat = {
  amount: number;
  type: switchEvent;
};
export type userForClient = {
  name: string;
  linkedPhotos: boolean;
  hashtags: Array<switchHashtag>;
  hashtagsToFollow: Array<string>;
  stats: Array<switchStat>;
};
