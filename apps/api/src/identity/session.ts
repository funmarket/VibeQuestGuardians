import { createHash } from 'node:crypto';

import type { Pool } from 'pg';

import {
  assertSessionActive,
  IdentityContractError,
  parseCanonicalPrincipal,
  type CanonicalPrincipal,
} from '../../../../packages/contracts/src/identity-host.js';
import { createDatabasePool } from '../database/adapter.js';
import type { DatabaseConfig } from '../database/config.js';

export interface SessionStore {
  resolve: (token: string) => Promise<CanonicalPrincipal>;
  revoke: (token: string) => Promise<boolean>;
  close: () => Promise<void>;
}

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function createPostgresSessionStore(
  config: DatabaseConfig,
): SessionStore {
  const pool = createDatabasePool(config);

  return createSessionStore(pool);
}

export function createSessionStore(pool: Pool): SessionStore {
  return {
    async resolve(token) {
      if (!token || /\s/.test(token)) {
        throw new IdentityContractError(
          'INVALID_CONTEXT',
          'Session credential is invalid',
        );
      }

      const result = await pool.query<{
        accountId: string;
        sessionId: string;
        host: 'web' | 'telegram';
        capabilities: string[];
        expiresAt: Date;
        revokedAt: Date | null;
      }>(
        `SELECT u.account_id AS "accountId",
                s.id AS "sessionId",
                s.host,
                s.capabilities,
                s.expires_at AS "expiresAt",
                s.revoked_at AS "revokedAt"
           FROM vq_d01_sessions s
           JOIN vq_d01_users u ON u.id = s.user_id
          WHERE s.token_hash = $1`,
        [hashToken(token)],
      );

      const session = result.rows[0];
      if (!session) {
        throw new IdentityContractError(
          'UNAUTHORIZED',
          'Session credential is invalid',
        );
      }

      assertSessionActive({
        expiresAt: session.expiresAt.getTime(),
        revokedAt: session.revokedAt?.getTime() ?? null,
      });

      return parseCanonicalPrincipal({
        accountId: session.accountId,
        sessionId: session.sessionId,
        host: session.host,
        capabilities: session.capabilities,
      });
    },

    async revoke(token) {
      if (!token || /\s/.test(token)) {
        throw new IdentityContractError(
          'INVALID_CONTEXT',
          'Session credential is invalid',
        );
      }
      const result = await pool.query(
        `UPDATE vq_d01_sessions
            SET revoked_at = COALESCE(revoked_at, now())
          WHERE token_hash = $1`,
        [hashToken(token)],
      );
      return (result.rowCount ?? 0) > 0;
    },

    async close() {
      await pool.end();
    },
  };
}
