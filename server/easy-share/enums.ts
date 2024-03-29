import { flintId } from '~/types/flintgg';

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
  return Object.values(easyshareHashtag).filter(
    // eslint-disable-next-line no-restricted-globals
    (ht) => !isNaN(ht as number),
  ) as Array<easyshareHashtag>;
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

type switchShareUserBase = {
  created: Date;
  updated: Date;
  id: flintId;
  hashtags: Array<easyshareHashtag>;
  autoDelete: boolean;
  token: string;
  token_secret: string;
  name: string;
  type: easyshareAccountType;
  email?: string | null;
};

export type switchShareUserWithPh = switchShareUserBase & {
  ph_token: string;
  ph_refresh_token: string;
  ph_album: string;
  ph_token_expiry: Date;
};

export type switchShareUserWithoutPh = switchShareUserBase & {
  ph_token: undefined | null;
  ph_refresh_token: undefined | null;
  ph_album: undefined | null;
  ph_token_expiry: undefined | null;
};

export type switchShareUser = switchShareUserWithoutPh | switchShareUserWithPh;

export type switchStat = {
  amount: number;
  type: easyshareEvent;
  source: easyshareSource;
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
