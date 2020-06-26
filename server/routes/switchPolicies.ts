import joi from 'joi';
import { hashtagsToFollow } from '../switch-share/twitter';

const configChangeSchema = {
  hashtags: joi
    .array()
    .items(
      joi
        .number()
        .integer()
        .greater(0)
        .less(hashtagsToFollow.length + 1)
        .required(),
    )
    .min(1)
    .required(),
  autoDelete: joi.boolean().required(),
};

export function configChangePolicy(req, res, next) {
  const { error } = joi.validate(req.body, configChangeSchema);
  if (error && error.details[0].context) {
    switch (error.details[0].context.key) {
    case 'hashtags':
      return res.status(400).send({
        error: {
          title: 'Invalid array of hashtags.',
          detail: 'The hashtags provided are invalid.',
        } as flintError,
      });
    default:
      return res.status(400).send({
        error: {
          title: 'Unknown Error.',
          detail: 'An unknown error ocurred.',
        } as flintError,
      });
    }
  }
  return next();
}

const twitterTokensSchema = {
  oauth_token: joi.string(),
  oauth_verifier: joi.string(),
};

export function twitterTokensPolicy(req, res, next) {
  const { error } = joi.validate(req.body.tokens, twitterTokensSchema);
  if (error && error.details[0].context) {
    return res.status(400).send({
      error: {
        title: 'Invalid token format.',
        detail: 'The tokens provided are in invalid format.',
      } as flintError,
    });
  }
  return next();
}

const photosCodeSchema = {
  code: joi.string(),
};

export function photosCodePolicy(req, res, next) {
  const { error } = joi.validate(req.body, photosCodeSchema);
  if (error && error.details[0].context) {
    return res.status(400).send({
      error: {
        title: 'Invalid token format.',
        detail: 'The token provided is in invalid format.',
      } as flintError,
    });
  }
  return next();
}

const mailchimpSubscribeSchema = {
  email: joi.string().email(),
};

export function mailchimpSubscribePolicy(req, res, next) {
  const { error } = joi.validate(req.body, mailchimpSubscribeSchema);
  if (error && error.details[0].context) {
    return res.status(400).send({
      error: {
        title: 'Invalid email format.',
        detail: 'The email provided is in invalid format.',
      } as flintError,
    });
  }
  return next();
}
