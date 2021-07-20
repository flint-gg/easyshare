import { flintId } from './flintgg';

export enum twitterMediaType {
  photo = 'photo',
  video = 'video',
}

export enum twitterImageSize {
  medium = 'medium',
  thumb = 'thumb',
  small = 'small',
  large = 'large',
}

type twitterImageSizeDetail = {
  w: number;
  h: number;
  resize: string;
};

type twitterImage = {
  type: twitterMediaType.photo;
};

type twitterVideo = {
  type: twitterMediaType.video;
  video_info: {
    aspect_ratio: Array<number>; // [16, 9];
    duration_millis: number; // 29834;
    variants: [
      {
        bitrate: 832000;
        content_type: 'video/mp4';
        url: string; // 'https://video.twimg.com/ext_tw_video/1247505060222758913/pu/vid/640x360/rexaINR9IrxvuKMi.mp4?tag=10';
      },
      {
        bitrate: undefined;
        content_type: 'application/x-mpegURL';
        url: string; // 'https://video.twimg.com/ext_tw_video/1247505060222758913/pu/pl/2YuznbAJmJ6GL4Ac.m3u8?tag=10';
      },
      {
        bitrate: 256000;
        content_type: 'video/mp4';
        url: string; // 'https://video.twimg.com/ext_tw_video/1247505060222758913/pu/vid/480x270/RU4fQxOVGCmz1HS7.mp4?tag=10';
      },
      {
        bitrate: 2176000;
        content_type: 'video/mp4';
        url: string; // 'https://video.twimg.com/ext_tw_video/1247505060222758913/pu/vid/1280x720/-NLI766iWVe1obMc.mp4?tag=10';
      }
    ];
  };
  additional_media_info: {
    monetizable: false;
  };
};

export type twitterMedia = {
  id: flintId; // 1247447808501637000,
  id_str: string; // '1247447808501637125',
  indices: Array<number>;
  media_url: string; // 'http://pbs.twimg.com/media/EU_TLC2UYAUdVjK.jpg',
  media_url_https: string; // 'https://pbs.twimg.com/media/EU_TLC2UYAUdVjK.jpg',
  url: string; // 'https://t.co/II7XIWGrG7',
  display_url: string; // 'pic.twitter.com/II7XIWGrG7',
  expanded_url: string; // 'https://twitter.com/T0TProduction/status/1247447810552688641/photo/1',
  sizes: {
    medium: twitterImageSizeDetail;
    thumb: twitterImageSizeDetail;
    small: twitterImageSizeDetail;
    large: twitterImageSizeDetail;
  };
} & (twitterImage | twitterVideo);

export type twitterUser = {
  id: flintId; // 792416251998007300,
  id_str: string; // '792416251998007296',
  name: string; // 'T0TProduction',
  screen_name: string; // 'T0TProduction',
  location: string; // 'Dachau, Germany',
  description: string; // '',
  url: string | null; // null,
  entities: Array<any>;
  protected: boolean;
  followers_count: number;
  friends_count: number; // 69,
  listed_count: number;
  created_at: string; // 'Sat Oct 29 17:22:11 +0000 2016',
  favourites_count: number; // 1277,
  utc_offset: any; // null,
  time_zone: any; // null,
  geo_enabled: boolean; // false,
  verified: boolean; // false,
  statuses_count: number; // 92,
  lang: any; // null,
  contributors_enabled: boolean; // false,
  is_translator: boolean; // false,
  is_translation_enabled: boolean; // false,
  profile_background_color: string; // 'F5F8FA',
  profile_background_image_url: string | null;
  profile_background_image_url_https: string | null;
  profile_background_tile: boolean; // false,
  profile_image_url: string; // 'http://pbs.twimg.com/profile_images/1204682619641880577/FOb3JeOS_normal.jpg',
  profile_image_url_https: string; // 'https://pbs.twimg.com/profile_images/1204682619641880577/FOb3JeOS_normal.jpg',
  profile_banner_url: string; // 'https://pbs.twimg.com/profile_banners/792416251998007296/1480328876',
  profile_link_color: string; // '1DA1F2',
  profile_sidebar_border_color: string; // 'C0DEED',
  profile_sidebar_fill_color: string; // 'DDEEF6',
  profile_text_color: string; // '333333',
  profile_use_background_image: boolean; // true,
  has_extended_profile: boolean; // true,
  default_profile: boolean; // true,
  default_profile_image: boolean; // false,
  following: any; // null,
  follow_request_sent: any; // null,
  notifications: any; // null,
  translator_type: string; // 'none'
};

export type twitterStatus = {
  created_at: string; // 'Tue Apr 07 08:55:09 +0000 2020',
  id: flintId; // 1247447810552688600,
  id_str: string; // '1247447810552688641',
  text: string; // '#AnimalCrossing #ACNH #NintendoSwitch https://t.co/II7XIWGrG7',
  truncated: boolean;
  entities: {
    hashtags: Array<{ text: string; indices: Array<number> }>;
    symbols: Array<any>;
    user_mentions: Array<any>;
    urls: Array<any>;
    media: Array<twitterMedia>;
  };
  extended_entities?: { media: Array<twitterMedia> };
  metadata: { iso_language_code: string; result_type: string };
  source: string; // '<a href="https://www.nintendo.com/countryselector" rel="nofollow">Nintendo Switch Share</a>',
  in_reply_to_status_id: any; // null,
  in_reply_to_status_id_str: any; // null,
  in_reply_to_user_id: any; // null,
  in_reply_to_user_id_str: any; // null,
  in_reply_to_screen_name: any; // null,
  user: twitterUser;
  geo: any; // null,
  coordinates: any; // null,
  place: any; // null,
  contributors: any; // null,
  is_quote_status: boolean; // false,
  retweet_count: number; // 0,
  favorite_count: number; // 0,
  favorited: boolean; // false,
  retweeted: boolean; // false,
  possibly_sensitive: boolean; // false,
  lang: string; // 'und'
};

export type requestTokenResponse =
  | {
      oauth_token: string;
      oauth_verifier: string;
    }
  | {
      oauth_token: undefined;
      oauth_verifier: undefined;
    };
