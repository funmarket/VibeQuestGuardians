import { createWorkerServer } from './app.js';

const server = createWorkerServer();

function shutdown(): void {
  server.close(() => process.exit(0));
}

process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
