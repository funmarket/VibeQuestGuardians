import { createApiServer } from './app.js';

const server = createApiServer({ env: process.env });

function shutdown(): void {
  server.close(() => process.exit(0));
}

process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
