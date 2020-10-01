export enum easyshareAccountType {
  'twitter' = 1,
  'facebook',
}

export enum easyshareSource {
  'switch' = 0x0001,
  'ps4',
  'webclient' = 0x1001,
}

export enum easyshareHashtag {
  'NintendoSwitch' = 0x0001,
  'switchshare',
  'flintggshare',
  'easyshare',
  'PS4share' = 0x1001,
}

export function getSwitchHashtagNumbers() {
  return Object.values(easyshareHashtag).filter((ht) => !isNaN(ht as any));
}

export enum easyshareEvent {
  'signup' = 1,
  'login',
  'logout',
  'linkPhotos',
  'unlinkPhotos',
  'singleImage',
  'multiImage',
  'singleVideo',
  'changeSettings',
  'updateEmail',
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
  hashtags: Array<easyshareHashtag>;
  autoDelete: boolean;
  token: string;
  token_secret: string;
  name: string;
  type: easyshareAccountType;
  email?: string;
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
  type: easyshareEvent;
};
export type userForClient = {
  name: string;
  linkedPhotos: boolean;
  hashtags: Array<easyshareHashtag>;
  hashtagsToFollow: Array<string>;
  stats: Array<switchStat>;
  autoDelete: boolean;
  linkedEmail: boolean;
};

export enum streamEndReason {
  'Shutdown' = 1, // The feed was shutdown (possibly a machine restart)
  'DuplicateStream' = 2, // The same endpoint was connected too many times.
  'Stall' = 4, // The client was reading too slowly and was disconnected by the server.
  'Normal' = 5, // The client appeared to have initiated a disconnect.
  'AdminLogout' = 7, // The same credentials were used to connect a new stream and the oldest was disconnected.
  'MaxMessageLimit' = 9, // The stream connected with a negative count parameter and was disconnected after all backfill was delivered.
  'StreamException' = 10, // An internal issue disconnected the stream.
  'BrokerStall' = 11, // An internal issue disconnected the stream.
  'ShedLoad' = 12, // The host the stream was connected to became overloaded and streams were disconnected to balance load. Reconnect as usual.
}

// for now it seems to not include these infos at all,
// even though the docs mention them https://developer.twitter.com/en/docs/tweets/filter-realtime/overview/statuses-filter
export type streamEnd = {
  disconnect: {
    code: streamEndReason;
    stream_name: string;
    reason: string;
  };
};

export type streamEndResponse = {
  size: number;
  timeout: number;
  url: string;
  status: number;
  statusText: string;
  headers: any;
  counter: number;
  body: any;
};
