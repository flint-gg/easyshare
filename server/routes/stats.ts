import express from 'express';
import { getGeneralStats, getLandingStats } from '../switch-share/db-queries';

const app = express.Router();

app.get('/landing', async (req, res) => {
  const stats = await getLandingStats();
  return res.status(200).send(stats);
});

app.get('/', async (req, res) => {
  const stats = await getGeneralStats();
  return res.status(200).send(stats);
});

export default app;
