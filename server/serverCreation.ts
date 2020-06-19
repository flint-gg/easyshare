import http from 'http';
import { Express } from 'express';
import flintURL from '../scripts/flintURL';

// this will be our instance
const options = flintURL.getServerOptions();
options.origins = [
  'http://localhost:3000',
  'https://flint.gg:*',
  'https://www.flint.gg:*',
  'https://staging.flint.gg:*',
  'http://staging.flint.gg:*', // also allow unsafe here
];

export function serverSetup(app: Express) {
  const server = http.createServer(app);

  server.listen(options.port, () => {
    console.info(
      `listening on ${options.host}:${options.port}${options.path}`,
    );
  });
}
