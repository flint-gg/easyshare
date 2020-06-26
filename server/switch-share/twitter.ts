import Twitter from 'twitter-lite';
import {
  twitterMediaType,
  twitterMedia,
  twitterImageSize,
  twitterStatus,
} from '../../types/twitter';

import flintURL from '../../scripts/flintURL';
import { uploadMedia } from './gphotos';
import {
  getUser,
  createUser,
  cachedUsers,
  fillCache,
  addEvent,
} from './db-queries';
import {
  switchHashtag,
  switchEvent,
  switchAccountType,
  streamEndResponse,
} from './enums';

if (
  !(
    process.env.TW_CONSUMER_SECRET
    && process.env.TW_ACCESS_KEY
    && process.env.TW_ACCESS_SECRET
  )
) {
  throw new Error('Missing Twitter secret!');
}
const consumer_key = 'mWXh7Ckerb965P11kXd8xgcgq';
const consumer_secret = process.env.TW_CONSUMER_SECRET;
const twitterAPI = new Twitter({
  consumer_key,
  consumer_secret,
  access_token_key: process.env.TW_ACCESS_KEY, // from your User (oauth_token)
  access_token_secret: process.env.TW_ACCESS_SECRET, // from your User (oauth_token_secret)
});

export async function getEmailOfUser(
  id: flintId,
  access_token_key: string,
  access_token_secret: string,
) {
  const twitterApi = new Twitter({
    consumer_key,
    consumer_secret,
    access_token_key,
    access_token_secret,
  });
  // TODO check if we want to "need" emails , change on twitter app; only then can we get it
  const user = await twitterApi.get('account/verify_credentials.json', {
    include_email: true,
  });
  return user; // TODO get email part
}

// hashtags directly map to enum switchHashtag; id 0 is the always followed hashtag
export const hashtagsToFollow = [
  'flintgg', // tracked because it is the dont delete flag
  'NintendoSwitch',
  'switchshare',
  'flintggshare',
  'easyshare',
];

const switchShareSource = '<a href="https://www.nintendo.com/countryselector" rel="nofollow">Nintendo Switch Share</a>';

function getImageUrl(
  media: twitterMedia,
  size: twitterImageSize,
  png?: boolean,
) {
  return media.type === twitterMediaType.photo
    ? `${media.media_url_https}?format=${png ? 'png' : 'jpg'}&name=${size}`
    : media.video_info.variants
      .filter((a) => a.bitrate)
      .sort((a, b) => b.bitrate! - a.bitrate!)[0].url;
}

function isSharedMediaBySwitch(status: twitterStatus) {
  return (
    status.extended_entities
    && (status.source === switchShareSource
      || status.source.includes('Nintendo Switch Share'))
  );
}

async function destroyTweet(tweetId: flintId, client: Twitter) {
  await client.post('statuses/destroy' /* /${tweetId}` */, {
    id: tweetId,
  });
}

/* async function getUsersMedia(
  username: string,
  latestID?: flintId | bigint | number,
  hashtag?: string,
) {
  const response = await twitterAPI.getBearerToken();
  const app = new Twitter({
    bearer_token: response.access_token,
  });

  const resp: { statuses: Array<twitterStatus> } = await app.get(
    'search/tweets',
    {
      q: `from:${username} #${hashtag || defaultHashTag} filter:media`,
      result_type: 'recent',
      count: 100,
      since_id: latestID || 0,
    },
  );

  return cleanStatuses(resp.statuses)
    .map((stat) => stat.extended_entities!.media)
    .flat();
} */

function checkHashtags(
  userHashtags: Array<switchHashtag>,
  hashtagsInTweet: Array<{ text: string; indices: Array<number> }>,
) {
  const hashtags: Array<string> = [];
  userHashtags.forEach((i) => hashtags.push(hashtagsToFollow[i]));
  return (
    hashtagsInTweet.filter((h) => hashtags.find((hs) => hs === h.text)).length
    > 0
  );
}

async function listenToStream(timeouted = 0) {
  let timeout = timeouted;
  const parameters = {
    track: `#${hashtagsToFollow.join(',#')}`,
    filter_level: 'none', // none, low, or medium ; this is a rating twitter adds, and does not go hand in hand with our query
  };
  const stream = twitterAPI.stream('statuses/filter', parameters);
  stream
    .on('start', (/* response */) => console.log('started stream'))
    .on('data', async (tweet: twitterStatus) => {
      if (!isSharedMediaBySwitch(tweet)) {
        /* console.log('[INCOMING] non switch tweet'); */
        return;
      }
      const user = cachedUsers.get(tweet.user.id_str);
      if (
        user
        && user.ph_album
        && checkHashtags(user.hashtags, tweet.entities.hashtags)
      ) {
        console.log('[INCOMING] tracked user', user.name);

        const imageURLs = tweet.extended_entities!.media.map((m) => {
          const imageURL = getImageUrl(m, twitterImageSize.large);
          return imageURL;
        });
        try {
          await uploadMedia(user, imageURLs);
        } catch (e) {
          console.error(e);
        }
        // check if deletion is turned on and "do not delete" flag is not set: flintgg
        if (
          user.autoDelete
          && tweet.entities.hashtags.findIndex((ht) => ht.text === 'flintgg')
            === -1
        ) {
          await destroyTweet(
            tweet.id_str,
            new Twitter({
              consumer_key,
              consumer_secret,
              access_token_key: user.token,
              access_token_secret: user.token_secret,
            }),
          );
        }
      } else {
        /* console.log('[INCOMING] non tracked user'); */
      }
    })
    .on('ping', () => console.log('ping'))
    .on('error', (error) => console.log('stream error:', error))
    .on('end', async (response: streamEndResponse) => {
      console.log(
        'ended stream; status:',
        response.status,
        '; text:',
        response.statusText,
      );
      console.log('entire response:', response);
      if (Number(response.status) === 420) {
        timeout = (timeout || 1) * 2;
      } else {
        timeout = 0;
      }
      // restart stream
      console.log('restarting stream with timeout', timeout);
      setTimeout(() => listenToStream(timeout), timeout * 1000);
    });
}

const listenToStreamInDev = true;

export async function run() {
  await fillCache();
  if (listenToStreamInDev || process.env.NODE_ENV !== 'development') {
    await listenToStream();
  }
}

export async function getAuthFlowToken() {
  const tokenresp = await twitterAPI.getRequestToken(
    `${flintURL.getURL()}callback/twitter`,
  );
  if (tokenresp.oauth_callback_confirmed === 'true') {
    return tokenresp.oauth_token;
  }
  throw new Error('Failed to get RequestToken');
}

export async function getTokensetFromCompletedAuthFlow(tokens: {
  oauth_token: string;
  oauth_verifier: string;
}) {
  const response = await twitterAPI.getAccessToken(tokens);
  let user = await getUser(response.user_id);
  if (!user) {
    user = await createUser(
      response.user_id,
      response,
      switchAccountType.twitter,
    );
  }
  await addEvent(response.user_id, switchEvent.login);
  return user;
}
