import express from 'express';
import { getGeneralStats } from '../switch-share/db-queries';

const app = express.Router();

app.get('/', async (req, res) => {
  const stats = await getGeneralStats();
  return res.status(200).send(stats);
});

export default app;
