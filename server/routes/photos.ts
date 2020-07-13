import express from 'express';

import { url, onCallback } from '../switch-share/gphotos';
import { disconnectPhotos } from '../switch-share/db-queries';
import { photosCodePolicy } from './switchPolicies';

const app = express.Router();

app.get('/', async (req, res) => res.status(200).json(url));

app.post('/', photosCodePolicy, async (req, res) => {
  try {
    const { code } = req.body;
    const { id } = req.user as any;
    await onCallback(code, id);
    return res.status(200).end();
  } catch (e) {
    console.error(e);
    return res.status(500).end();
  }
});

app.delete('/', async (req, res) => {
  try {
    const { id } = req.user as any;
    await disconnectPhotos(id);
    return res.status(200).end();
  } catch (e) {
    console.error(e);
    return res.status(500).end();
  }
});

export default app;
