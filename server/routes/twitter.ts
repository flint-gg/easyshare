import express from 'express';
import {
  getAuthFlowToken,
  getTokensetFromCompletedAuthFlow,
} from '../easy-share/twitter';

import '../easy-share/gphotos';
import { getSwitchToken } from '../tokenGen';
import { twitterTokensPolicy } from './switchPolicies';

const app = express.Router();

app.get('/', async (req, res) => {
  try {
    const tokens = await getAuthFlowToken();
    return res.status(200).json(tokens);
  } catch (e) {
    console.error(e);
    return res.status(500).end();
  }
});

app.post('/', twitterTokensPolicy, async (req, res) => {
  try {
    const { tokens } = req.body;
    const user = await getTokensetFromCompletedAuthFlow(tokens);
    return res.status(200).json(getSwitchToken(user.id, user.name));
  } catch (e) {
    console.error(e);
    return res.status(500).end();
  }
});

export default app;
