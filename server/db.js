const path = require('path');
const knex = require('knex');
const config = require('./config');

const client = config.dbClient;
const connection =
  client === 'pg'
    ? config.databaseUrl
    : {
        filename: config.sqliteFilename
      };

const db = knex({
  client,
  connection,
  useNullAsDefault: true,
  pool: client === 'sqlite3' ? { min: 1, max: 1 } : { min: 2, max: 10 }
});

const connect = async () => {
  await db.raw(client === 'pg' ? 'select 1+1 as result' : 'select 1');
  await db.migrate.latest({
    directory: path.resolve(__dirname, 'migrations')
  });
  console.log(`Connected to database using ${client}`);
};

const disconnect = async () => {
  await db.destroy();
};

module.exports = {
  connect,
  disconnect,
  db
};
