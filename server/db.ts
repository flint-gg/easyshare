/* eslint-disable max-classes-per-file */
import Sequelize from 'sequelize';
import { switch_share_events, switch_share_user } from './easy-share/models';

const AWSConfig = {
  host: process.env.RDS_HOSTNAME,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  port: process.env.RDS_PORT,
  database: process.env.RDS_DB_NAME,
};

const sequelizeOptions = {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  dialect: 'postgres' as 'postgres', // To make sequelizes type check shut up, as string is not a compatible type to the string literals we can choose from
  logging: false && Boolean(process.env.NODE_ENV === 'development'),
  define: {
    // do not automatically add timestamps, this only helps when using sequelize to write/read
    timestamps: false,
    freezeTableName: true, // do not add "s" to all table names
  },
  schema: 'public',
};
export const sequelize = !AWSConfig.host
  ? new Sequelize.Sequelize(`${process.env.DATABASE_URL!}`, sequelizeOptions)
  : new Sequelize.Sequelize(
      AWSConfig.database!,
      AWSConfig.user!,
      AWSConfig.password,
      {
        host: AWSConfig.host!,
        port: Number(AWSConfig.port!),
        ...sequelizeOptions,
      },
  );

// Initilaize tables

switch_share_user.initWithSequelize(sequelize);
switch_share_events.initWithSequelize(sequelize);
