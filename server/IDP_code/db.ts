import pg from 'pg';

const confOld = {
  user: 'postgres',
  database: 'flint',
  password: '2412',
  port: 5432,
};

export const AWSConfig = {
  host: process.env.RDS_HOSTNAME,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  port: process.env.RDS_PORT,
  database: process.env.RDS_DB_NAME,
};
const conf = {
  connectionString: process.env.DATABASE_URL,
  ssl: true,
};

let chosenConf : Object = process.env.DATABASE_URL ? conf : confOld;
if (AWSConfig.host) {
  chosenConf = AWSConfig;
}

const pool = new pg.Pool(chosenConf);

export {
  pool,
};
