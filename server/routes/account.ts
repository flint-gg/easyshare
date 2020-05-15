import express from 'express';
import { userForClient } from '../switch-share/enums';
import { hashtagsToFollow } from '../switch-share/twitter';

import {
  updateHashtags,
  getUser,
  getUserStats,
} from '../switch-share/db-queries';
import { hashtagChangePolicy } from './switchPolicies';

const app = express.Router();

app.patch('/', hashtagChangePolicy, async (req, res) => {
  const { id } = req.user as any;
  const { hashtags } = req.body;
  await updateHashtags(id, hashtags);
  return res.status(200).send();
});

app.get('/', async (req, res) => {
  const { id } = req.user as any;
  const user = await getUser(id);
  const stats = await getUserStats(id);
  if (!user) {
    return res.status(404).send();
  }
  const response: userForClient = {
    name: user.name,
    linkedPhotos: Boolean(user.ph_album),
    hashtags: user.hashtags,
    hashtagsToFollow,
    stats,
  };
  return res.status(200).send(response);
});

// TODO delete account

export default app;
