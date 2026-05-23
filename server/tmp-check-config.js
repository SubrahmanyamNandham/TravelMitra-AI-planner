const config = require('./config');
console.log('config loaded', {
  jwtAccessSecret: !!config.jwtAccessSecret,
  jwtRefreshSecret: !!config.jwtRefreshSecret,
  cookieSecret: !!config.cookieSecret,
  dbClient: config.dbClient,
  databaseUrl: config.databaseUrl,
  sqliteFilename: config.sqliteFilename
});
