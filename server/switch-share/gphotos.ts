import { google } from 'googleapis';
import Photos from 'googlephotos';
import fs from 'fs';
import Path from 'path';
import Axios from 'axios';
import { asyncForEach } from '../../scripts/helper/helperFunctions';
import flintURL from '../../scripts/flintURL';
import {
  gphotosTokens,
  switchEvent,
  switch_share_user_type,
  switch_share_user_type_with_ph,
} from './enums';
import { addEvent, connectPhotos } from './db-queries';

const { PHOTOS_CLIENT_SECRET } = process.env;

if (!PHOTOS_CLIENT_SECRET) {
  throw new Error('Missing google photos credentials!');
}

const PHOTOS_CLIENT_ID = '104723095324-q88qqa8vo95ofb3h268k5pm3m3kv3h6a.apps.googleusercontent.com';

const oauth2Client = new google.auth.OAuth2(
  PHOTOS_CLIENT_ID,
  PHOTOS_CLIENT_SECRET,
  `${flintURL.getURL()}callback/photos`,
);

const scopes = [
  Photos.Scopes.READ_DEV_DATA, // read data we created, e.g. albums
  Photos.Scopes.APPEND_ONLY, // upload media
];

export const url = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent',
  scope: scopes,
});

type photoAlbum = {
  id: string;
  title: string;
  productUrl: string;
  isWriteable: boolean;
  coverPhotoBaseUrl?: string;
};

async function getOrCreatePhotosAlbum(user: gphotosTokens) {
  const photos = new Photos(user.access_token);
  const { albums }: { albums?: Array<photoAlbum> } = await photos.albums.list();
  let album: string;
  if (!albums || albums.length === 0) {
    const response: photoAlbum = await photos.albums.create(
      'Nintendo Switch Share by flint.gg',
    );
    album = response.id;
  } else {
    album = albums[0].id;
  }

  return album;
}

async function refreshToken(user: switch_share_user_type) {
  const response = await Axios.post<{
    access_token: string;
    expires_in: number;
    scope: string;
    token_type: string;
  }>(
    'https://oauth2.googleapis.com/token',
    {},
    {
      params: {
        client_id: PHOTOS_CLIENT_ID,
        client_secret: PHOTOS_CLIENT_SECRET,
        refresh_token: user.ph_refresh_token,
        grant_type: 'refresh_token',
      },
    },
  );
  console.log('refresh token response:', response.data);
  return {
    ...response.data,
    refresh_token: user.ph_refresh_token,
    expiry_date: Date.now() + response.data.expires_in * 1000,
  } as gphotosTokens;
}

async function getAPI(user: switch_share_user_type_with_ph) {
  // if it runs out in 30 seconds or less
  const needsToRefresh = user.ph_token_expiry.getTime() < Date.now() - 30 * 1000;
  let u = user;
  if (needsToRefresh) {
    const newTokenSet = await refreshToken(user);
    let album = user.ph_album;
    if (!album) {
      album = await getOrCreatePhotosAlbum(newTokenSet);
    }
    u = await connectPhotos(user.id, newTokenSet, album);
  }

  return new Photos(u.ph_token);
}

export async function onCallback(code: string, twitterId: flintId) {
  const tokens = (await oauth2Client.getToken(code)).tokens as gphotosTokens;
  const album = await getOrCreatePhotosAlbum(tokens);
  const user = await connectPhotos(twitterId, tokens, album);
  return user;
}

// TODO dynamic, add game info?
const description = 'Uploaded via the flint.gg Nintendo Switch Share';

const imageBaseDirectory = Path.resolve(__dirname, 'cached-files'); // 'https://pbs.twimg.com/media/';

async function downloadImage(uri: string, filename: string): Promise<string> {
  if (!fs.existsSync(imageBaseDirectory)) {
    fs.mkdirSync(imageBaseDirectory);
  }

  const path = Path.resolve(__dirname, 'cached-files', `${filename}`);
  const writer = fs.createWriteStream(path);

  const response = await Axios.get(uri, { responseType: 'stream' });
  const ret = await response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', () => resolve(ret.path as string));
    writer.on('error', reject);
  });
}

// The token from above can be used to initialize the photos library.
export async function uploadMedia(
  user: switch_share_user_type_with_ph,
  fileURLs: Array<string>,
) {
  const photos = await getAPI(user);
  const downloadedFiles = await asyncForEach(fileURLs, async (u) => {
    if (u.includes('.jpg')) {
      const shorterURL = u.slice(28); // remove base url https://pbs.twimg.com/media/
      const name = `${shorterURL.split('.jpg')[0]}.jpg`; // remove query params and file ending EWIx0XlUwAEc5Lf.jpg?format=jpg&name=large
      const file = await downloadImage(u, name);
      return { name, file };
    }
    const splitBySlash = u.split('.mp4')[0].split('/'); // remove query params and file ending 1247505060222758913/pu/vid/1280x720/-NLI766iWVe1obMc.mp4?tag=10
    const name = `${splitBySlash[splitBySlash.length - 1]}.mp4`;
    const file = await downloadImage(u, name);
    return { name, file };
  });
  try {
    if (fileURLs.length > 1) {
      const files = downloadedFiles.map((u) => ({ name: u.name, description }));
      await photos.mediaItems.uploadMultiple(
        user.ph_album,
        files,
        imageBaseDirectory,
        10000,
      );
      await addEvent(user.id, switchEvent.multiImage);
    } else if (fileURLs.length === 1) {
      await photos.mediaItems.upload(
        user.ph_album,
        downloadedFiles[0].name,
        downloadedFiles[0].file,
        description,
      );
      await addEvent(
        user.id,
        downloadedFiles[0].name.endsWith('mp4')
          ? switchEvent.singleVideo
          : switchEvent.singleImage,
      );
    }
  } catch (e) {
    console.error(e.stack || e);
  }
  downloadedFiles.forEach((f) => {
    fs.unlinkSync(f.file);
  });
}
