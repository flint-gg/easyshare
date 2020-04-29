/* eslint-disable max-classes-per-file */
import Sequelize from 'sequelize';
import { AWSConfig, pool } from './db';
import { switch_share_events, switch_share_user } from '../switch-share/models';

// We will now start defining DB stuff via sequelize.
// The types will then be defined by schemats in types/db.ts

const sequelizeOptions = {
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
  ? new Sequelize.Sequelize(
    `${process.env.DATABASE_URL!}?ssl=true`,
    sequelizeOptions,
  )
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

// switch share tool
switch_share_user.initWithSequelize(sequelize);
switch_share_events.initWithSequelize(sequelize);

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err); // your callback here
  // process.exit(-1);
});
