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
  easyshareHashtag,
  easyshareEvent,
  easyshareAccountType,
  streamEndResponse,
  easyshareSource,
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

// eslint-disable-next-line no-restricted-globals
export const hashtagsToFollow = Object.values(easyshareHashtag).filter((ht) => isNaN(ht as any));

const hashtagsToFollowInternal = hashtagsToFollow.concat(
  'flintgg', // always tracked because it is the dont delete flag
);

const switchShareSource = '<a href="https://www.nintendo.com/countryselector" rel="nofollow">Nintendo Switch Share</a>';

const ps4ShareSource = '<a href="https://www.playstation.com" rel="nofollow">PlayStation®Network</a>';

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
  return Boolean(
    status.extended_entities
      && (status.source === switchShareSource
        || status.source.includes('Nintendo Switch Share')),
  );
}

function isSharedMediaByPS4(status: twitterStatus) {
  return Boolean(
    status.extended_entities
      && (status.source === ps4ShareSource
        || status.source.includes('PlayStation')),
  );
}

function getConsoleType(status: twitterStatus) {
  if (isSharedMediaBySwitch(status)) {
    return easyshareSource.switch;
  }
  if (isSharedMediaByPS4(status)) {
    return easyshareSource.ps4;
  }
  return null;
}

async function destroyTweet(tweetId: flintId, client: Twitter) {
  await client.post('statuses/destroy', {
    id: tweetId,
  });
}

// old function to get all tweets of user; needs to be adjusted if used
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
  userHashtags: Array<easyshareHashtag>,
  hashtagsInTweet: Array<{ text: string; indices: Array<number> }>,
) {
  const hashtags: Array<string> = [];
  userHashtags.forEach((i) => hashtags.push(easyshareHashtag[i]));
  return (
    hashtagsInTweet.filter((h) => hashtags.find((hs) => hs === h.text)).length
    > 0
  );
}

async function listenToStream(timeouted = 0) {
  let timeout = timeouted;
  const parameters = {
    track: `#${hashtagsToFollowInternal.join(',#')}`,
    filter_level: 'none', // none, low, or medium ; this is a rating twitter adds, and does not go hand in hand with our query
  };
  const stream = twitterAPI.stream('statuses/filter', parameters);
  stream
    .on('start', (/* response */) => console.log('[STREAM] started'))
    .on('data', async (tweet: twitterStatus) => {
      const consoleType = getConsoleType(tweet);
      if (!consoleType) {
        /* console.log('[INCOMING] non switch tweet'); */
        return;
      }
      const user = cachedUsers.get(tweet.user.id_str);
      if (
        user
        && user.ph_album
        && checkHashtags(user.hashtags, tweet.entities.hashtags)
      ) {
        console.log(
          '[INCOMING] twitter user',
          user.name,
          'via source',
          easyshareSource[consoleType],
        );

        const imageURLs = tweet.extended_entities!.media.map((m) => {
          const imageURL = getImageUrl(m, twitterImageSize.large);
          return imageURL;
        });
        try {
          await uploadMedia(user, imageURLs, consoleType);
        } catch (e) {
          console.error('Failed uploading media:');
          console.error(e);
        }
        // check if deletion is turned on and "do not delete" flag is not set: flintgg
        if (
          user.autoDelete
          && tweet.entities.hashtags.findIndex((ht) => ht.text === 'flintgg')
            === -1
        ) {
          try {
            await destroyTweet(
              tweet.id_str,
              new Twitter({
                consumer_key,
                consumer_secret,
                access_token_key: user.token,
                access_token_secret: user.token_secret,
              }),
            );
          } catch (e) {
            console.error('Failed deleting tweet:');
            console.error(e);
          }
        }
      } else {
        /* console.log('[INCOMING] non tracked user'); */
      }
    })
    .on('ping', () => console.log('[STREAM] ping'))
    // error does not also throw end event, so we need to restart here as well!
    .on('error', (error: Error) => {
      console.log('[STREAM] error:', error);
      /* timeout = (timeout || 1) * 2;
      // restart stream
      console.log('[STREAM] restarting with timeout', timeout);
      setTimeout(() => listenToStream(timeout), timeout * 1000); */
    })
    .on('end', async (response: streamEndResponse) => {
      console.log(
        '[STREAM] ended with status:',
        response.status,
        '; text:',
        response.statusText,
      );
      // console.log('entire response:', response);
      if (Number(response.status) === 420) {
        timeout = (timeout || 1) * 2;
      } else {
        timeout = 0;
      }
      // restart stream
      console.log('[STREAM] restarting with timeout', timeout);
      setTimeout(() => listenToStream(timeout), timeout * 1000);
    });
}

const listenToStreamInDev = false;

export async function run() {
  await fillCache();
  if (listenToStreamInDev || process.env.NODE_ENV !== 'development') {
    await listenToStream();
  } else {
    console.info(
      '[STREAM] Detected development mode, not listening to to stream.',
    );
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
      easyshareAccountType.twitter,
    );
  }
  await addEvent(
    response.user_id,
    easyshareEvent.login,
    easyshareSource.webclient,
  );
  return user;
}
