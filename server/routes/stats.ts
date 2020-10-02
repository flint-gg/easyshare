import express from 'express';
import { getGeneralStats, getLandingStats } from '../easy-share/db-queries';

const app = express.Router();

app.get('/landing', async (req, res) => {
  const stats = await getLandingStats();
  return res.status(200).json(stats);
});

app.get('/', async (req, res) => {
  const stats = await getGeneralStats();
  return res.status(200).json(stats);
});

export default app;
