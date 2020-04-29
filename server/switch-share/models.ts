// eslint-disable-next-line max-classes-per-file
import Sequelize from 'sequelize';
import { switchHashtag, switchEvent, switchAccountType } from './enums';

export class switch_share_user extends Sequelize.Model {
  public created!: Date;

  public updated!: Date;

  public type!: switchAccountType;

  public id!: flintId;

  public hashtags!: Array<switchHashtag>;

  public token!: string;

  public token_secret!: string;

  public name!: string;

  public ph_token?: string;

  public ph_refresh_token?: string;

  public ph_album?: string;

  public ph_token_expiry?: Date;

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
      },
      { sequelize },
    );
  }
}

export class switch_share_events extends Sequelize.Model {
  public author!: flintId;

  public date!: Date;

  public type!: switchEvent;

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
      },
      { sequelize },
    );
  }
}
