import { randomUUID } from 'node:crypto';

import type { Pool } from 'pg';

import {
  assertFixtureEnvironment,
  assertFixtureNamespace,
  type ProfileRecord,
} from '../../../../packages/contracts/src/d02-fixtures.js';

export interface ProfileFixtureInput {
  environment: string;
  namespace: string;
  profileId?: string;
  userId: string;
  accountId: string;
  displayName?: string;
}

export async function loadProfileFixture(
  pool: Pool,
  input: ProfileFixtureInput,
): Promise<ProfileRecord> {
  assertFixtureEnvironment(input.environment);
  assertFixtureNamespace(input.namespace);
  const profileId = input.profileId ?? randomUUID();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const user = await client.query<{ accountId: string }>(
      `SELECT account_id AS "accountId" FROM vq_d01_users WHERE id = $1`,
      [input.userId],
    );
    if (user.rows[0]?.accountId !== input.accountId) {
      throw new Error('Fixture owner does not match the canonical user');
    }
    const result = await client.query<ProfileRecord>(
      `INSERT INTO vq_d02_profiles
         (id, user_id, display_name, fixture_namespace)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id) DO UPDATE
         SET display_name = EXCLUDED.display_name,
             fixture_namespace = EXCLUDED.fixture_namespace,
             updated_at = now()
       RETURNING id,
                 $5::text AS "accountId",
                 display_name AS "displayName",
                 fixture_namespace AS "fixtureNamespace",
                 created_at AS "createdAt",
                 updated_at AS "updatedAt"`,
      [
        profileId,
        input.userId,
        input.displayName ?? null,
        input.namespace,
        input.accountId,
      ],
    );
    await client.query(
      `INSERT INTO vq_platform_fixture_records
         (environment, namespace, record_type, record_id, owner_account_id)
       VALUES ($1, $2, 'd02_profile', $3, $4)
       ON CONFLICT (environment, namespace, record_type, record_id) DO UPDATE
         SET owner_account_id = EXCLUDED.owner_account_id`,
      [input.environment, input.namespace, result.rows[0].id, input.accountId],
    );
    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function cleanupFixtureNamespace(
  pool: Pool,
  environment: string,
  namespace: string,
): Promise<number> {
  assertFixtureEnvironment(environment);
  assertFixtureNamespace(namespace);
  const result = await pool.query<{ count: string }>(
    `WITH removed AS (
       DELETE FROM vq_d02_profiles profile
        USING vq_platform_fixture_records fixture
        WHERE fixture.environment = $1
          AND fixture.namespace = $2
          AND fixture.record_type = 'd02_profile'
          AND fixture.record_id = profile.id
        RETURNING profile.id
     )
     DELETE FROM vq_platform_fixture_records
      WHERE environment = $1
        AND namespace = $2
      RETURNING 1 AS count`,
    [environment, namespace],
  );
  return result.rowCount ?? 0;
}

export async function readProfile(
  pool: Pool,
  accountId: string,
): Promise<ProfileRecord | null> {
  const result = await pool.query<ProfileRecord>(
    `SELECT profile.id,
            $1::text AS "accountId",
            profile.display_name AS "displayName",
            profile.fixture_namespace AS "fixtureNamespace",
            profile.created_at AS "createdAt",
            profile.updated_at AS "updatedAt"
       FROM vq_d02_profiles profile
       JOIN vq_d01_users users ON users.id = profile.user_id
      WHERE users.account_id = $1`,
    [accountId],
  );
  return result.rows[0] ?? null;
}
