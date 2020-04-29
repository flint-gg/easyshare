import crypto from 'crypto';
import jwt from 'express-jwt';
import jsonwebtoken from 'jsonwebtoken';
import { Router } from 'express';

// Create secret for sessions
export function generateSecret(length = 64) {
  return crypto.randomBytes(length).toString('base64');
}

const secret = generateSecret();

if (process.env.TOKEN_SECRET) {
  console.warn(
    'Theres still a secret in the .env. Were not using that anymore, so you can get rid of it.',
  );
}

const JWTlifetime = 30 * 60; // 30mins
/** Returns TTL of JWTs in seconds */
export function getJWTLifetime() {
  return JWTlifetime;
}

function getS() {
  return secret;
}

function setupAuth(app: Router) {
  app.use(
    jwt({
      secret: getS(),
    }).unless({
      path: ['/api/auth/login', '/api/auth/refresh'],
    }),
  );
}

export default {
  getS,
  setupAuth,
};

// Nintendo Switch Screenshot share:
const switchSecret = generateSecret();

export function getSwitchSecret() {
  return switchSecret;
}

export function getSwitchToken(twitterId: flintId, name: string) {
  return jsonwebtoken.sign(
    {
      id: twitterId,
      name,
    } as switchShareUserToken,
    switchSecret,
    { expiresIn: JWTlifetime },
  );
}

export function getSwitchAuthMiddleware() {
  return jwt({
    secret: switchSecret,
  });
}
