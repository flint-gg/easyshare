import { Transaction, Sequelize, Op } from 'sequelize';
import { flintId } from '~/types/flintgg';
import { asyncForEach } from '../../scripts/helper/helperFunctions';
import { sequelize } from '../db';
import {
  easyshareHashtag,
  trackedUser,
  gphotosTokens,
  switchShareUser,
  easyshareEvent,
  switchShareUserWithPh,
  switchShareUserWithoutPh,
  switchStat,
  easyshareAccountType,
  getSwitchHashtagNumbers,
  easyshareSource,
} from './enums';
import { switch_share_user, switch_share_events } from './models';

export const cachedUsers = new Map<flintId, switchShareUser>();

export async function updateUserInCache(
  userid: flintId,
  passedUser?: switchShareUser | null,
) {
  let user = passedUser;
  if (user === undefined) {
    user = (await switch_share_user.findByPk(userid, {
      raw: true,
    })) as switchShareUser | null;
  }
  if (user) {
    cachedUsers.set(user.id, user);
  } else {
    cachedUsers.delete(userid);
  }
}

export async function fillCache() {
  const allUsers = await switch_share_user.findAll({ raw: true });
  await asyncForEach(allUsers, async (u) => {
    await updateUserInCache(u.id, u as switchShareUser);
  });
}

export async function addEvent(
  author: flintId,
  type: easyshareEvent,
  source: easyshareSource,
  transaction?: Transaction,
  amount = 1,
) {
  return switch_share_events.upsert(
    {
      author,
      date: new Date(),
      type,
      amount,
      source,
    },
    { transaction },
  );
}

export async function getUser(id: flintId) {
  const user = await switch_share_user.findByPk(id);
  return user;
}

export async function getUserStats(author: flintId) {
  const stats: Array<switchStat> = (await switch_share_events.findAll({
    where: { author },
    group: ['type', 'author', 'source'],
    attributes: [
      [Sequelize.fn('sum', Sequelize.col('amount')), 'amount'],
      'type',
      'source',
    ],
  })) as any;
  return stats;
}

export async function getGeneralStats(): Promise<Array<switchStat>> {
  const stats: Array<
    switchStat & {
      author: flintId;
    }
  > = (await switch_share_events.findAll({
    group: ['type', 'author', 'source'],
    attributes: [
      [Sequelize.fn('sum', Sequelize.col('amount')), 'amount'],
      'type',
      'author',
      'source',
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
      source: s.source,
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
  const user: switchShareUser = {
    id,
    type,
    created: now,
    updated: now,
    hashtags,
    autoDelete: true,
    token: tw.oauth_token,
    token_secret: tw.oauth_token_secret,
    name: tw.screen_name,
    ph_album: null,
    ph_refresh_token: null,
    ph_token: null,
    ph_token_expiry: null,
  };
  await sequelize.transaction(async (t) => {
    await switch_share_user.upsert(user, { transaction: t });
    await addEvent(id, easyshareEvent.signup, easyshareSource.webclient, t);
    await updateUserInCache(id, user);
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
    await updateUserInCache(id, null);
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
      {
        where: { id },
        returning: true,
        raw: true,
        transaction: t,
      },
    );
    const user = response[1][0] as switchShareUserWithPh;
    if (!onlyUpdatingTokens) {
      await addEvent(
        id,
        easyshareEvent.linkPhotos,
        easyshareSource.webclient,
        t,
      );
    }
    await updateUserInCache(id, user);
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
      {
        where: { id },
        returning: true,
        raw: true,
        transaction: t,
      },
    );
    const user = response[1][0] as switchShareUserWithoutPh;
    await addEvent(
      id,
      easyshareEvent.unlinkPhotos,
      easyshareSource.webclient,
      t,
    );
    await updateUserInCache(id, user);
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
        {
          where: { id: u.id },
          returning: true,
          raw: true,
          transaction: t,
        },
      );
      const user = response[1][0] as switchShareUser;
      await updateUserInCache(u.id, user);
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
      {
        where: { id },
        returning: true,
        raw: true,
        transaction: t,
      },
    );
    const user = response[1][0] as switchShareUser;
    await addEvent(
      id,
      easyshareEvent.changeSettings,
      easyshareSource.webclient,
      t,
    );
    await updateUserInCache(id, user);
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
      {
        where: { id },
        returning: true,
        raw: true,
        transaction: t,
      },
    );
    const user = response[1][0] as switchShareUser;
    await addEvent(
      user.id,
      easyshareEvent.updateEmail,
      easyshareSource.webclient,
      t,
    );
    await updateUserInCache(id, user);
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
      {
        where: { id },
        returning: true,
        raw: true,
        transaction: t,
      },
    );
    const user = response[1][0] as switchShareUser;
    await addEvent(
      user.id,
      easyshareEvent.updateEmail,
      easyshareSource.webclient,
      t,
    );
    await updateUserInCache(id, user);
    return user;
  });
}
