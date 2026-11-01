# S01 Foundation

S01 establishes engineering substrate only. It does not implement product domains, authentication, quests, guardians, social behavior, payments, or production deployment.

## Boundaries

- Client, API, and Worker are separate runtimes.
- Shared packages contain contracts, runtime-health, and test-environment helpers only.
- No runtime imports another application source tree.

## Verification

API and Worker expose /health/live for liveness and /health/ready for runtime identity, database, PostGIS, and migration-ledger readiness. Readiness is HTTP 503 until all checks pass. DATABASE_URL and deployment identity variables are required. scripts/migrate.mjs is the only migration runner and uses an advisory lock plus checksum ledger.

## Commands

npm install; npm run db:validate; npm run db:migrate; npm run check
