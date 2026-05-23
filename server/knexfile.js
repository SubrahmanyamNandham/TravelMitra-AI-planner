const config = require('./config');

const connection =
  config.dbClient === 'pg'
    ? config.databaseUrl
    : { filename: config.sqliteFilename };

const common = {
  migrations: {
    directory: './migrations'
  }
};

module.exports = {
  development: {
    client: config.dbClient,
    connection,
    useNullAsDefault: config.dbClient === 'sqlite3',
    ...common
  },
  production: {
    client: config.dbClient,
    connection,
    useNullAsDefault: config.dbClient === 'sqlite3',
    ...common
  }
};
