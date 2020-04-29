import express from 'express';
import {
  getAuthFlowToken,
  getTokensetFromCompletedAuthFlow,
} from '../switch-share/twitter';

import '../switch-share/gphotos';
import { getSwitchToken } from '../tokenGen';

const app = express.Router();

app.get('/', async (req, res) => {
  try {
    const tokens = await getAuthFlowToken();
    return res.status(200).send(tokens);
  } catch (e) {
    console.error(e);
    return res.status(500).send();
  }
});

// TODO policy
app.post('/', async (req, res) => {
  try {
    const { tokens } = req.body;
    const user = await getTokensetFromCompletedAuthFlow(tokens);
    return res.status(200).send(getSwitchToken(user.id, user.name));
  } catch (e) {
    console.error(e);
    return res.status(500).send();
  }
});

export default app;
