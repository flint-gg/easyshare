import FlakeId from 'flake-idgen';
import intformat from 'biguint-format';
import { flintId } from '~/types/flintgg';

const epoch = new Date(2018, 10, 1).valueOf(); // Start of time according to flint.gg
const flakeIdGenUsers = new FlakeId({ worker: 0, epoch });
const flakeIdGenMedia = new FlakeId({ worker: 1, epoch });

export function generateUserId():flintId {
  return intformat(flakeIdGenUsers.next(), 'dec');
}

export function generateMediaId():flintId {
  return intformat(flakeIdGenMedia.next(), 'dec');
}
