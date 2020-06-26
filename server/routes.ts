import rateLimit from 'express-rate-limit';
import { Express } from 'express';
import twitterCallback from './routes/twitter';
import photosCallback from './routes/photos';
import { getSwitchAuthMiddleware } from './tokenGen';
import switchAccount from './routes/account';
import statsEndpoint from './routes/stats';
import mailchimpEndpoint from './routes/mailchimp';

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2000,
});

const apiLimit5perMin = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  skipFailedRequests: true,
});

export default (app: Express) => {
  app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)

  app.use('/api/', apiLimiter); // add general api ratelimit

  app.use('/api/newsletter', apiLimit5perMin, mailchimpEndpoint);
  app.use('/api/twitter', twitterCallback);
  app.use('/api/stats', statsEndpoint);
  app.use('/api/photos', getSwitchAuthMiddleware(), photosCallback);
  app.use('/api/account', getSwitchAuthMiddleware(), switchAccount);

  // fail for any other /api requests
  app.use('/api', (req, res) => res.status(404).json('Route does not exist.'));
};
