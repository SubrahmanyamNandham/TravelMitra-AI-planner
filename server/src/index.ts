import { app } from './app.js';
import { env } from './lib/env.js';
import { logger } from './lib/logger.js';

const port = env.PORT;

const server = app.listen(port, () => {
  logger.info({ port }, 'Travel.io API server is listening');
});

process.on('unhandledRejection', (reason) => {
  logger.error({ reason }, 'Unhandled rejection');
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (error) => {
  logger.error({ error }, 'Uncaught exception');
  server.close(() => process.exit(1));
});
