// eslint-disable-next-line max-classes-per-file
import Sequelize from 'sequelize';
import { flintId } from '~/types/flintgg';
import {
  easyshareHashtag,
  easyshareEvent,
  easyshareAccountType,
  easyshareSource,
  switchShareUser,
} from './enums';

export class switch_share_user extends Sequelize.Model<
  switchShareUser,
  switchShareUser
> {
  public created!: Date;

  public updated!: Date;

  public type!: easyshareAccountType;

  public id!: flintId;

  public hashtags!: Array<easyshareHashtag>;

  public autoDelete!: boolean;

  public token!: string;

  public token_secret!: string;

  public name!: string;

  public ph_token?: string;

  public ph_refresh_token?: string;

  public ph_album?: string;

  public ph_token_expiry?: Date;

  public email?: string;

  public static initWithSequelize(sequelize: Sequelize.Sequelize) {
    switch_share_user.init(
      {
        created: {
          type: Sequelize.DATE,
          allowNull: false,
          comment: 'When was this account created',
        },
        updated: {
          type: Sequelize.DATE,
          allowNull: false,
          comment: 'When was this account last updated',
        },
        hashtags: {
          type: Sequelize.ARRAY(Sequelize.INTEGER),
          allowNull: false,
          comment:
            'Settings: The hashtags to follow for this user. Values are based on our ENUM',
        },
        autoDelete: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
          comment: 'Should we delete tweets/posts automatically',
        },
        // twitter or facebook
        id: {
          type: Sequelize.BIGINT,
          primaryKey: true,
        },
        type: {
          type: Sequelize.INTEGER,
          allowNull: false,
          comment: 'Is this a twitter or facebook, etc. account?',
        },
        token: {
          type: Sequelize.TEXT,
          allowNull: false,
          comment: 'Account oauth_token',
        },
        token_secret: {
          type: Sequelize.TEXT,
          allowNull: false,
          comment: 'Account oauth_token_secret',
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
          comment: 'Account username',
        },
        // gphotos (or apple photos?)
        ph_token: {
          type: Sequelize.TEXT,
          comment: 'Photos oauth_token',
        },
        ph_refresh_token: {
          type: Sequelize.TEXT,
          comment: 'Photos refresh_token',
        },
        ph_album: {
          type: Sequelize.TEXT,
          comment: 'Photos refresh_token',
        },
        ph_token_expiry: {
          type: Sequelize.DATE,
          comment: `Date on which the Photos oauth_token expires.
            It could also be revoked earlier, but this is the last point in time we could use it.`,
        },
        email: {
          type: Sequelize.TEXT,
          comment: 'The email the user manually added.',
        },
      },
      { sequelize },
    );
  }
}

export class switch_share_events extends Sequelize.Model {
  public author!: flintId;

  public date!: Date;

  public type!: easyshareEvent;

  public source!: easyshareSource;

  public amount?: number;

  public static initWithSequelize(sequelize: Sequelize.Sequelize) {
    switch_share_events.init(
      {
        author: {
          type: Sequelize.BIGINT,
          primaryKey: true,
          references: {
            model: switch_share_user,
            key: 'id',
          },
        },
        date: {
          type: Sequelize.DATE,
          primaryKey: true,
          comment: 'When did this event occur',
        },
        type: {
          type: Sequelize.INTEGER,
          allowNull: false,
          comment: 'Type of the event. Based on our ENUM',
        },
        source: {
          type: Sequelize.INTEGER,
          allowNull: false,
          comment:
            'Source of the event, can be type of client or console from which the image came.',
          defaultValue: easyshareSource.webclient, // to make migration easier
        },
        amount: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
          comment:
            'Occurence amount of the event. Currently only relevant for multi image uploads',
        },
      },
      { sequelize },
    );
  }
}
