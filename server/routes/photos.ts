import express from 'express';

import { url, onCallback } from '../switch-share/gphotos';
import { disconnectPhotos } from '../switch-share/db-queries';

const app = express.Router();

app.get('/', async (req, res) => res.status(200).send(url));


// TODO policy
app.post('/', async (req, res) => {
  try {
    const { code } = req.body;
    const { id } = req.user as any;
    await onCallback(code, id);
    return res.status(200).send();
  } catch (e) {
    console.error(e);
    return res.status(500).send();
  }
});

app.delete('/', async (req, res) => {
  try {
    const { id } = req.user as any;
    await disconnectPhotos(id);
    return res.status(200).send();
  } catch (e) {
    console.error(e);
    return res.status(500).send();
  }
});

export default app;
