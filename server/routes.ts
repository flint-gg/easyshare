import rateLimit from 'express-rate-limit';
import { Express } from 'express';
import twitterCallback from './routes/twitter';
import photosCallback from './routes/photos';
import { getSwitchAuthMiddleware } from './tokenGen';
import switchAccount from './routes/account';

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2000,
});

export default (app: Express) => {
  app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)

  app.use('/api/', apiLimiter); // add general api ratelimit

  app.use('/api/twitter', twitterCallback);
  app.use('/api/photos', getSwitchAuthMiddleware(), photosCallback);
  app.use('/api/account', getSwitchAuthMiddleware(), switchAccount);

  // fail for any other /api requests
  app.use('/api', (req, res) => res.status(404).json('API not found.'));
};
