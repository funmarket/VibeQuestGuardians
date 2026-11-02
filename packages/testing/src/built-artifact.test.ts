import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { request } from 'node:http';
import { test } from 'node:test';
import { once } from 'node:events';

interface RuntimeCase {
  name: string;
  artifact: string;
  port: number;
  identityPath: string;
}

const repository = 'funmarket/VibeQuestGuardians';
const ref = 'vibefoundation';
const commit = 'a56b892b4d8e7f49a6389db8a600ce309fa78be2';

const runtimeCases: RuntimeCase[] = [
  {
    name: 'api',
    artifact: 'dist/api/apps/api/src/server.js',
    port: 43100,
    identityPath: '/health/identity',
  },
  {
    name: 'worker',
    artifact: 'dist/worker/apps/worker/src/server.js',
    port: 43101,
    identityPath: '/health/identity',
  },
];

function getJson(port: number, path: string): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    const requestInstance = request(
      { hostname: '127.0.0.1', path, port },
      (response) => {
        let body = '';
        response.setEncoding('utf8');
        response.on('data', (chunk) => {
          body += chunk;
        });
        response.on('end', () => {
          if (response.statusCode !== 200) {
            reject(new Error(`Unexpected status ${response.statusCode}`));
            return;
          }
          resolve(JSON.parse(body) as Record<string, unknown>);
        });
      },
    );
    requestInstance.on('error', reject);
    requestInstance.end();
  });
}

async function waitForHealth(port: number): Promise<void> {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      await getJson(port, '/health/live');
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
  throw new Error(`Runtime on port ${port} did not become healthy`);
}

for (const runtimeCase of runtimeCases) {
  test(`${runtimeCase.name} built artifact starts, serves health, and shuts down`, async () => {
    assert.equal(existsSync(runtimeCase.artifact), true);
    const child = spawn(process.execPath, [runtimeCase.artifact], {
      env: {
        ...process.env,
        VQ_REPOSITORY: repository,
        VQ_REF: ref,
        VQ_COMMIT: commit,
        VQ_BUILD: `s01-5-${runtimeCase.name}`,
        VQ_SERVING_REVISION: commit,
        VQ_ENVIRONMENT: 'test',
        ...(runtimeCase.name === 'api'
          ? { API_PORT: String(runtimeCase.port) }
          : { WORKER_PORT: String(runtimeCase.port) }),
      },
      stdio: 'ignore',
    });

    try {
      await waitForHealth(runtimeCase.port);
      const identity = await getJson(
        runtimeCase.port,
        runtimeCase.identityPath,
      );
      assert.equal(identity.commit, commit);
      child.kill('SIGTERM');
      const [exitCode, signal] = (await once(child, 'exit')) as [
        number | null,
        NodeJS.Signals | null,
      ];
      if (process.platform === 'win32') {
        assert.equal(signal, 'SIGTERM');
      } else {
        assert.equal(exitCode, 0);
        assert.equal(signal, null);
      }
    } finally {
      if (!child.killed) {
        child.kill('SIGKILL');
      }
    }
  });
}
