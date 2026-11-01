# S01-1 — Workspace Toolchain Packet

**Milestone:** S01  
**Task:** S01-1 — Hooma-aligned workspace/toolchain configuration  
**Status:** READY  
**Repository / branch / base HEAD:** funmarket/VibeQuestGuardians / vibefoundation / 7ac0ac4a7eedc78cc6f6fc011d783b6ef4d4e595  
**Authorization:** Product Owner approval to adopt the Hooma engineering approach with VibeQuest-specific PostgreSQL/PostGIS and isolated-staging adaptations.  
**Owner / canonical writer:** Platform tooling; no D01-D28 business owner or canonical business writer.

## Approved technical direction

- Node.js 22 and npm workspaces with a committed npm lockfile.
- TypeScript native ESM.
- React, Vite, and React Router for the Client boundary.
- Express with an explicit composition root for the API boundary.
- A separately runnable Worker with its own lifecycle and health boundary.
- Node test runner executed through tsx; integration tests serialize where shared database state requires it.
- Prisma migration workflow, adapted by later approved SQL migrations and integration tests for PostgreSQL plus PostGIS.
- Zod configuration validation in a shared platform package when behavior-bearing S01-2 tests exist.
- Architecture-boundary checks and GitHub Actions CI.
- A new Railway project with separate staging and production environments in a later authorized infrastructure task. No existing Hooma or VibeQuest resource may be reused.

## Authorized scope

Create a reproducible empty npm workspace and quality configuration only. This task creates no application/package source, route, database connection, runtime process, migration, CI workflow, Railway resource, product UI, business contract, or business behavior.

## Exact allowed paths

- .gitignore
- .npmrc
- .nvmrc
- .prettierignore
- .prettierrc.json
- eslint.config.js
- package.json
- package-lock.json
- tsconfig.base.json
- apps/api/package.json
- apps/api/tsconfig.json
- apps/client/package.json
- apps/client/tsconfig.json
- apps/client/vite.config.ts
- apps/worker/package.json
- apps/worker/tsconfig.json
- packages/contracts/package.json
- packages/contracts/tsconfig.json
- packages/testing/package.json
- packages/testing/tsconfig.json

## Explicitly forbidden

- Any src/ file.
- database/, Prisma schema, migration, seed, or migration execution.
- .github/workflows/.
- Railway configuration, project, environment, service, variable, deployment, bucket, or database.
- Product route, screen, authentication/session implementation, provider adapter, data fixture, mock backend, fake data, or placeholder capability.
- Master Plan.md, Requirements.md, structure.md, Database.md, AGENTS.md, README.md, and docs/product-design/.

## Ownership boundaries

| Configuration area | Owner | Responsibility | Must not contain |
|---|---|---|---|
| Root workspace | Platform tooling | Node/npm reproducibility, lockfile, formatting and lint configuration | Domain logic, credentials, provider settings |
| Client manifest/config | Client boundary | Future independent React/Vite build boundary | UI, host behavior, API access |
| API manifest/config | API boundary | Future independent Express build boundary | Routes, container, database code |
| Worker manifest/config | Worker boundary | Future independent Worker build boundary | Jobs, timers, schema writes |
| Contracts manifest/config | Contract boundary | Future versioned type/schema boundary | Runtime/database behavior |
| Testing manifest/config | Test boundary | Future explicit test-support boundary | Production seeds or authority |

## Behavior matrix

| Case | Expected result | Required proof |
|---|---|---|
| Approved Node/npm environment | npm ci reproduces the committed dependency tree. | Observed command after real lockfile generation. |
| Wrong Node major | Install/check fails through the declared engine policy. | Observed command. |
| Manifest/lockfile mismatch | npm ci fails without rewriting the lockfile. | Observed command. |
| Invalid formatting/lint config | Dedicated command fails; no silent bypass. | Observed command. |
| Repeated frozen install | No tracked lockfile drift. | Observed clean-tree check. |
| Empty workspace | No runtime, route, database, migration, or product behavior exists. | GitHub tree inspection. |
| Dependency/network failure | Stop and report; do not substitute versions or hand-write a lockfile. | Evidence ledger. |
| Timeout/cleanup/shutdown | No process/database/browser is started in this task. | Task-scope inspection. |

## Tests first

This configuration-only task introduces no production behavior and is exempt from behavior TDD.

Before S01-2 adds source, it must create and observe failing tests for:

1. environment configuration validation;
2. versioned API error-envelope contract;
3. exact runtime identity contract;
4. liveness versus readiness semantics;
5. duplicate readiness/identity definition prevention.

## Migration, runtime, and deployment impact

None in S01-1. Prisma/PostGIS migrations, API/Worker lifecycle, CI workflow, and Railway infrastructure are separately authorized future work and require their own exact packets and tests.

## Verification commands

The packet requires these commands after a real dependency resolution produces package-lock.json:

- npm ci
- npm ci
- npm run format:check
- npm run lint:config
- git diff --exit-code

No command may be weakened, renamed, or skipped to obtain a green result.

## Stop conditions

- The current branch diverges from the base state before mutation.
- A dependency cannot be resolved through npm with the approved policy.
- A real package-lock.json cannot be generated and verified.
- Any requested change reaches source, database, CI, Railway, or product behavior.
- Any check would need to be weakened or replaced without explicit Product Owner approval.

## No-fake confirmation

S01-1 cannot create a mock backend, fake API, fake user, seeded business authority, synthetic device/provider state, localStorage authority, placeholder feature, or partial business implementation.
