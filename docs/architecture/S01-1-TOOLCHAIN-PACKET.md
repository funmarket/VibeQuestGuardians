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

### Scope and evidence sequence (supplements; does not replace the commands above)

1. **Execution checkpoint:** preserve this packet's recorded `base HEAD` as historical provenance. Immediately before an authorized S01-1 implementation, record the fresh `vibefoundation` HEAD as `EXECUTION_BASE_HEAD`; re-read current packet and governing identities. Stop on unexpected subsequent branch movement. The packet itself does not authorize implementation.
2. **Dependency and lockfile truth:** resolve dependencies using the approved npm toolchain and generate `package-lock.json` through npm, never by hand or by transplanting another project's lockfile. Record actual Node/npm versions and the command outcome. Stop if resolution or network access fails; do not substitute dependencies or execution platforms.
3. **Existing positive commands:** run both `npm ci` executions, then `npm run format:check`, `npm run lint:config`, and `git diff --exit-code` exactly as listed above. Specify the candidate/commit checkpoint at which `git diff --exit-code` is evaluated so legitimate intended edits are not mistaken for unexplained dirty state. Record actual outputs and lockfile fingerprint before/after installs. Never treat a green command as proof of another check.
4. **Exact change-set proof:** compare `EXECUTION_BASE_HEAD` to the submitted candidate commit/tree and enumerate every added, modified, deleted, and renamed tracked path (for example `git diff --name-status EXECUTION_BASE_HEAD..HEAD`). Only the 20 authorized paths above may change; no governing file may be modified as an incidental edit. A comparison against the previous packet's historical base is not the implementation diff.
5. **Tracked, untracked, and ignored-artifact proof:** inspect ordinary tracked changes and all untracked files (for example `git status --porcelain=v1 --untracked-files=all`, and `git ls-files --others --exclude-standard`). Because ignored files are omitted from these checks, additionally inventory ignored and other filesystem artifacts relative to the authorized path set; exclude only expected installation/generated tool output such as `.git` and `node_modules` from the inspection, never a forbidden `src/`, `database/`, `.github/workflows/`, or deployment path by blanket assumption. Record any unexpected file as failure. A clean Git diff alone is insufficient.
6. **Negative acceptance cases:** preserve the existing behavior-matrix requirements. Verify wrong-Node-major enforcement, manifest/lock mismatch rejection, and invalid formatting/lint configuration detection with observed failing results in an isolated/disposable copy or equivalently isolated approved environment, leaving the canonical candidate and lockfile unchanged. Use only an already approved execution environment; if no approved means exists for a negative case, report `NOT VERIFIED` and obtain separate authorization rather than inventing Docker, CI, a version manager, or another platform.
7. **Published-source confirmation:** after any separately authorized commit, re-fetch the branch HEAD and final GitHub tree. Confirm the exact implementation commit and its parent/base diff changed only authorized configuration paths and introduced no application source, runtime, database/migration, CI workflow, Railway configuration or product behavior. Stop and report mismatch; do not auto-repair or silently update this packet.
8. **Evidence ledger:** record exact command, environment, input revision, outcome, failure cases, diff and tree identities. An unrun negative test is `NOT VERIFIED`, not PASS. No S01-1 completion, S01 verification, staging or production acceptance follows merely from packet presence.

**Historical checkpoint note:** The header `base HEAD` identifies the repository state before this packet was introduced. It is not an instruction to reset the branch, replace it with the latest HEAD, or skip fresh execution-state verification.

## Stop conditions

- The branch has an unexpected commit after this packet's commit; re-inspect the current tree and reconcile before any configuration mutation.
- A dependency cannot be resolved through npm with the approved policy.
- A real package-lock.json cannot be generated and verified.
- Any requested change reaches source, database, CI, Railway, or product behavior.
- Any check would need to be weakened or replaced without explicit Product Owner approval.

## No-fake confirmation

S01-1 cannot create a mock backend, fake API, fake user, seeded business authority, synthetic device/provider state, localStorage authority, placeholder feature, or partial business implementation.
