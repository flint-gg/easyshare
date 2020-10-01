import express from 'express';
import { userForClient } from '../easy-share/enums';
import { hashtagsToFollow } from '../easy-share/twitter';

import {
  updateConfiguration,
  getUser,
  getUserStats,
} from '../easy-share/db-queries';
import { configChangePolicy } from './switchPolicies';

const app = express.Router();

app.patch('/', configChangePolicy, async (req, res) => {
  const { id } = req.user as any;
  const { hashtags, autoDelete } = req.body;
  await updateConfiguration(id, hashtags, autoDelete);
  return res.status(200).end();
});

app.get('/', async (req, res) => {
  const { id } = req.user as any;
  const user = await getUser(id);
  if (!user) {
    return res.status(404).end();
  }
  const stats = await getUserStats(id);
  const response: userForClient = {
    name: user.name,
    linkedPhotos: Boolean(user.ph_album),
    hashtags: user.hashtags,
    hashtagsToFollow,
    stats,
    autoDelete: user.autoDelete,
    linkedEmail: Boolean(user.email),
  };
  return res.status(200).json(response);
});

// TODO delete account

export default app;
