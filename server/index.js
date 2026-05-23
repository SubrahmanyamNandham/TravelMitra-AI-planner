const app = require('./app');
const config = require('./config');
const db = require('./db');

const bootServer = async () => {
  try {
    await db.connect();

    app.listen(config.port, () => {
      console.log(`Travel.io auth server is running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

bootServer();
