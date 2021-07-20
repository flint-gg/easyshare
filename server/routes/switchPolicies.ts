import joi from 'joi';
import { flintError } from '~/types/flintgg';
import { getSwitchHashtagNumbers } from '../easy-share/enums';

const configChangeSchema = joi.object({
  hashtags: joi
    .array()
    .items(
      joi
        .number()
        .integer()
        .greater(0)
        .valid(...getSwitchHashtagNumbers())
        .required(),
    )
    .min(1)
    .required(),
  autoDelete: joi.boolean().required(),
});

export function configChangePolicy(req, res, next) {
  const { error } = configChangeSchema.validate(req.body);
  if (error && error.details[0].context) {
    switch (error.details[0].context.key) {
    case 'hashtags':
      return res.status(400).json({
        error: {
          title: 'Invalid array of hashtags.',
          detail: 'The hashtags provided are invalid.',
        } as flintError,
      });
    default:
      console.error(error.details);
      return res.status(400).json({
        error: {
          title: 'Unknown Error.',
          detail: 'An unknown error ocurred.',
        } as flintError,
      });
    }
  }
  return next();
}

const twitterTokensSchema = joi.object({
  oauth_token: joi.string(),
  oauth_verifier: joi.string(),
});

export function twitterTokensPolicy(req, res, next) {
  const { error } = twitterTokensSchema.validate(req.body.tokens);
  if (error && error.details[0].context) {
    return res.status(400).json({
      error: {
        title: 'Invalid token format.',
        detail: 'The tokens provided are in invalid format.',
      } as flintError,
    });
  }
  return next();
}

const photosCodeSchema = joi.object({
  code: joi.string(),
});

export function photosCodePolicy(req, res, next) {
  const { error } = photosCodeSchema.validate(req.body);
  if (error && error.details[0].context) {
    return res.status(400).json({
      error: {
        title: 'Invalid token format.',
        detail: 'The token provided is in invalid format.',
      } as flintError,
    });
  }
  return next();
}

const mailchimpSubscribeSchema = joi.object({
  email: joi.string().email(),
});

export function mailchimpSubscribePolicy(req, res, next) {
  const { error } = mailchimpSubscribeSchema.validate(req.body);
  if (error && error.details[0].context) {
    return res.status(400).json({
      error: {
        title: 'Invalid email format.',
        detail: 'The email provided is in invalid format.',
      } as flintError,
    });
  }
  return next();
}
