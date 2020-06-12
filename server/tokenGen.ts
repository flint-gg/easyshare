import crypto from 'crypto';
import jwt from 'express-jwt';
import jsonwebtoken from 'jsonwebtoken';

// Create secret for sessions
export function generateSecret(length = 64) {
  return crypto.randomBytes(length).toString('base64');
}

if (process.env.TOKEN_SECRET) {
  console.warn(
    'Theres still a secret in the .env. Were not using that anymore, so you can get rid of it.',
  );
}

const JWTlifetime = 30 * 60; // 30mins

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
