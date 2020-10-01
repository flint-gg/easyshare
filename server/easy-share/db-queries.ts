import { Transaction, Sequelize, Op } from 'sequelize';
import { asyncForEach } from '../../scripts/helper/helperFunctions';
import { sequelize } from '../db';
import {
  easyshareHashtag,
  trackedUser,
  gphotosTokens,
  switch_share_user_type,
  easyshareEvent,
  switch_share_user_type_with_ph,
  switch_share_user_type_without_ph,
  switchStat,
  easyshareAccountType,
  getSwitchHashtagNumbers,
} from './enums';
import { switch_share_user, switch_share_events } from './models';

export const cachedUsers = new Map<flintId, switch_share_user_type>();

export async function fillCache() {
  const allUsers = await switch_share_user.findAll({ raw: true });
  allUsers.forEach((u) => cachedUsers.set(u.id, u as switch_share_user_type));
}

export async function addEvent(
  author: flintId,
  type: easyshareEvent,
  transaction?: Transaction,
  amount = 1,
) {
  return switch_share_events.upsert(
    {
      author,
      date: new Date(),
      type,
      amount,
    },
    { transaction },
  );
}

export async function getUser(id: flintId) {
  const user = await switch_share_user.findByPk(id);
  return user as switch_share_user_type | null;
}

export async function getUserStats(author: flintId) {
  const stats: Array<switchStat> = (await switch_share_events.findAll({
    where: { author },
    group: ['type', 'author'],
    attributes: [
      [Sequelize.fn('sum', Sequelize.col('amount')), 'amount'],
      'type',
    ],
  })) as any;
  return stats;
}

export async function getGeneralStats() {
  const stats: Array<
    switchStat & {
      author: flintId;
    }
  > = (await switch_share_events.findAll({
    group: ['type', 'author'],
    attributes: [
      [Sequelize.fn('sum', Sequelize.col('amount')), 'amount'],
      'type',
      'author',
    ],
  })) as any;
  // anonymize author IDs
  const authorMap = new Map<flintId, number>();
  let i = 0;
  return stats.map((s) => {
    let anonymousName = 'easyshare user ';
    const auth = authorMap.get(s.author);
    if (auth) {
      anonymousName += auth;
    } else {
      anonymousName += i;
      authorMap.set(s.author, i);
      i++;
    }
    return {
      amount: s.amount,
      type: s.type,
      author: anonymousName,
    };
  });
}

export async function getLandingStats() {
  const stats: Array<{
    amount: number;
    type: easyshareEvent;
  }> = (await switch_share_events.findAll({
    group: ['type'],
    where: {
      [Op.or]: [
        { type: easyshareEvent.singleImage },
        { type: easyshareEvent.multiImage },
        { type: easyshareEvent.singleVideo },
      ],
    },
    attributes: [
      [Sequelize.fn('sum', Sequelize.col('amount')), 'amount'],
      'type',
    ],
  })) as any;

  return {
    imagesShared: stats
      .filter(
        (s) => s.type === easyshareEvent.singleImage
          || s.type === easyshareEvent.multiImage,
      )
      .reduce((a, b) => a + Number(b.amount), 0),
    videosShared: stats
      .filter((s) => s.type === easyshareEvent.singleVideo)
      .reduce((a, b) => a + Number(b.amount), 0),
  };
}

export async function createUser(
  id: flintId,
  tw: trackedUser,
  type: easyshareAccountType,
) {
  const now = new Date();
  const hashtags = [easyshareHashtag.NintendoSwitch, easyshareHashtag.PS4share];
  const user: switch_share_user_type = {
    id,
    type,
    created: now,
    updated: now,
    hashtags,
    autoDelete: true,
    token: tw.oauth_token,
    token_secret: tw.oauth_token_secret,
    name: tw.screen_name,
    ph_album: undefined,
    ph_refresh_token: undefined,
    ph_token: undefined,
    ph_token_expiry: undefined,
  };
  await sequelize.transaction(async (t) => {
    await switch_share_user.upsert(user, { transaction: t });
    await addEvent(id, easyshareEvent.signup, t);
    cachedUsers.set(id, user);
  });
  return user;
}

// remember: this skews stats because removed accounts are not counted to the stats anymore!
export async function removeUser(id: flintId) {
  return sequelize.transaction(async (t) => {
    await switch_share_events.destroy({
      where: { author: id },
      transaction: t,
    });
    await switch_share_user.destroy({ where: { id }, transaction: t });
    cachedUsers.delete(id);
  });
}

export async function connectPhotos(
  id: flintId,
  ph: gphotosTokens,
  album: string,
  onlyUpdatingTokens?: boolean,
) {
  const now = new Date();
  return sequelize.transaction(async (t) => {
    const response = await switch_share_user.update(
      {
        updated: now,
        ph_token: ph.access_token,
        ph_refresh_token: ph.refresh_token,
        ph_album: album,
        ph_token_expiry: new Date(ph.expiry_date),
      },
      { where: { id }, returning: true, transaction: t },
    );
    const user = response[1][0] as switch_share_user_type_with_ph;
    if (!onlyUpdatingTokens) {
      await addEvent(id, easyshareEvent.linkPhotos, t);
    }
    cachedUsers.set(id, user);
    return user;
  });
}

export async function disconnectPhotos(id: flintId) {
  const now = new Date();
  return sequelize.transaction(async (t) => {
    const response = await switch_share_user.update(
      {
        updated: now,
        ph_token: null,
        ph_refresh_token: null,
        ph_album: null,
        ph_token_expiry: null,
      },
      { where: { id }, returning: true, transaction: t },
    );
    const user = response[1][0] as switch_share_user_type_without_ph;
    await addEvent(id, easyshareEvent.unlinkPhotos, t);
    cachedUsers.set(id, user);
    return user;
  });
}

export async function cleanOutdatedHashtags() {
  return sequelize.transaction(async (t) => {
    const potentiallyOutdatedUsers = await switch_share_user.findAll({
      transaction: t,
    }); // i found no smart way to find users that have hashtags that are NOT in our array
    await asyncForEach(potentiallyOutdatedUsers, async (u) => {
      const response = await switch_share_user.update(
        {
          hashtags: u.hashtags.filter((ht) => getSwitchHashtagNumbers().includes(ht)),
        },
        { where: { id: u.id }, returning: true, transaction: t },
      );
      const user = response[1][0] as switch_share_user_type;
      cachedUsers.set(u.id, user);
    });
    console.info(
      `[Hashtag cleanup] Cleaned up hashtags of ${potentiallyOutdatedUsers.length} users.`,
    );
  });
}

export async function updateConfiguration(
  id: flintId,
  hashtags: Array<easyshareHashtag>,
  autoDelete: boolean,
) {
  const now = new Date();
  return sequelize.transaction(async (t) => {
    const response = await switch_share_user.update(
      {
        updated: now,
        hashtags,
        autoDelete,
      },
      { where: { id }, returning: true, transaction: t },
    );
    const user = response[1][0] as switch_share_user_type;
    await addEvent(id, easyshareEvent.changeSettings, t);
    cachedUsers.set(id, user);
    return user;
  });
}

export async function addUserEmail(id: flintId, email: string) {
  const now = new Date();
  return sequelize.transaction(async (t) => {
    const response = await switch_share_user.update(
      {
        updated: now,
        email,
      },
      { where: { id }, returning: true, transaction: t },
    );
    const user = response[1][0] as switch_share_user_type;
    await addEvent(user.id, easyshareEvent.updateEmail, t);
    cachedUsers.set(id, user);
    return user;
  });
}

export async function removeUserEmail(id: flintId) {
  const now = new Date();
  return sequelize.transaction(async (t) => {
    const response = await switch_share_user.update(
      {
        updated: now,
        email: null,
      },
      { where: { id }, returning: true, transaction: t },
    );
    const user = response[1][0] as switch_share_user_type;
    await addEvent(user.id, easyshareEvent.updateEmail, t);
    cachedUsers.set(id, user);
    return user;
  });
}
