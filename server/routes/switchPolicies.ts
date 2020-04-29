import joi from 'joi';
import { hashtagsToFollow } from '../switch-share/twitter';

const hashtagChangeSchema = {
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
};

export function hashtagChangePolicy(req, res, next) {
  const { error } = joi.validate(req.body, hashtagChangeSchema);
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
