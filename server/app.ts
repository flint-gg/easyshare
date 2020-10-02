/* eslint-disable import/first */ // we do this so we can call dotenv first
import dotenv from 'dotenv';

dotenv.config();
if (process.env.NODE_ENV === 'development' && !process.env.DATABASE_URL) {
  throw new Error(`[FATAL ERROR] Missing environment variables. 
This Error is thrown if the database connection URL is not defined, which let's us assume that the entire .env is not available.`);
}

import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import consola from 'consola';
import { Nuxt, Builder } from 'nuxt';
// import { matchUsersInBackground, updateUsersInBackground } from './backgroundMatcher';
import Umzug from 'umzug';
import { Sequelize } from 'sequelize';
import routeSetup from './routes';
import { serverSetup } from './serverCreation';
import config from '../nuxt.config';
import { sequelize } from './db';
import { run } from './easy-share/twitter';
import { cleanOutdatedHashtags } from './easy-share/db-queries';

const umzug = new Umzug({
  storage: 'sequelize',
  storageOptions: {
    sequelize, // here should be a sequelize instance, not the Sequelize module
  },
  migrations: {
    params: [
      sequelize.getQueryInterface(),
      Sequelize, // Sequelize constructor - the required module
    ],
    path: './migrations',
    pattern: /\.js$/,
  },
});

const app = express();

// activate features
app.use(cors());
// allow OPTIONS on all resources
app.options('*', cors());
app.use(logger('dev'));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  }),
);
app.use(cookieParser());

// Set up the routes
routeSetup(app);

// setting up server
serverSetup(app);

// Import and Set Nuxt.js options
config.dev = !(process.env.NODE_ENV === 'production');

async function start() {
  try {
    console.info('[UMZUG] Applying pending migrations.');
    const migrations = await umzug.up();
    if (migrations.length > 0) {
      console.info('[UMZUG] Applied migrations:');
      /* eslint-disable no-restricted-syntax */
      for (const m of migrations) {
        console.info(` -  ${m.file}`);
      }
      /* eslint-enable no-restricted-syntax */
    } else {
      console.info('[UMZUG] Database is up to date.');
    }
  } catch (e) {
    console.error('[UMZUG] Failed migrating database:');
    console.error(e);
    process.exit();
  }

  // do some cleanup work after backend changes
  cleanOutdatedHashtags();

  // start switch share code
  run();

  const syncSequelizeModels = true;
  if (syncSequelizeModels && process.env.NODE_ENV === 'development') {
    console.info(
      '[SEQUELIZE] Starting to sync defined tables to DB because we are in dev mode.',
    );
    const wipeDB = false; // set to true if you changed the DB and are in dev mode
    // sync force apparently also wipes the SequelizeMeta table,
    // which then errors on re-trying migrations
    await sequelize.sync({
      force: wipeDB && process.env.NODE_ENV === 'development',
    });
    console.info('[SEQUELIZE] Finished syncing defined tables to DB.');
  }

  // Init Nuxt.js
  const nuxt = new Nuxt(config);
  await nuxt.ready();

  const {
    host = process.env.HOST || process.env.NUXT_HOST || '127.0.0.1',
    port = process.env.PORT || process.env.NUXT_PORT || 3000,
  } = nuxt.options.server;

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  }
  // Handle production
  if (process.env.NODE_ENV === 'production') {
    // Static folder
    app.use(express.static(`${__dirname}/../dist/`));
  }

  // Give nuxt middleware to express
  app.use(nuxt.render);

  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true,
  });
}

start();
