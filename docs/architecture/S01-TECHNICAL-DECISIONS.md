# S01 Technical Decisions

**Task:** S01-0 technical-decision record  
**Status:** IMPLEMENTED — documentation only  
**Repository/branch/HEAD inspected:** funmarket/VibeQuestGuardians / vibefoundation / fad89f60901b1128b38cc0f69abd0002e13b56d7  
**Authorization:** Product Owner instruction to approve and commit the two S01-0 documentation artifacts while preserving unresolved technical-stack and staging-target decisions.

## Authority

1. Latest Product Owner direction
2. Master Plan.md
3. Requirements.md
4. structure.md
5. Database.md

This record does not authorize source code, dependency installation, migration execution, deployment, staging creation, or production change.

## Locked S01 decisions

| ID | Decision | Authority | Consequence |
|---|---|---|---|
| S01-DEC-001 | Client, API, and Worker are separate runtime boundaries. | Master Plan.md; structure.md | No monolithic script or cross-application source import. |
| S01-DEC-002 | PostgreSQL plus PostGIS is the authoritative transactional/spatial platform. | Master Plan.md; Database.md | S01 may establish only operational migration records and a PostGIS gate. |
| S01-DEC-003 | One designated release/pre-deploy authority runs migrations once per target database. | Master Plan.md; structure.md; Database.md | API and Worker startup never mutate schema. |
| S01-DEC-004 | Liveness, dependency-aware readiness, and exact serving identity are separate concerns. | Master Plan.md; structure.md | Empty dependency evidence is not readiness. |
| S01-DEC-005 | Staging is isolated, persistent, production-shaped, and not production acceptance. | Master Plan.md; structure.md; Database.md | No production resource, credential, data, or deployment may be reused. |
| S01-DEC-006 | S01 completes no D01-D28 business domain. | Master Plan.md; EXECUTION_PLAN.md | No auth, product feature, business schema, fake flow, or seed business state. |
| S01-DEC-007 | Full formatting, build, HTTP runtime tests, and staging limitations are required before S01 can be VERIFIED. | AGENTS.md; EXECUTION_PLAN.md | A green partial command cannot promote S01 status. |

## Approved S01 technical selections

| ID | Selection | Evidence / rationale | Boundary |
|---|---|---|---|
| S01-SEL-001 | Node.js 26 LTS with npm workspaces and a committed npm lockfile | Node.js 26 is currently LTS; npm is bundled with Node and provides a reproducible `npm ci` path. Exact package versions are captured only in the committed lockfile. | No dependency installation occurs until S01-1 is approved. |
| S01-SEL-002 | TypeScript with native ESM modules | The repository needs explicit contracts across Client/API/Worker; TypeScript supplies compile-time contract checking without changing runtime ownership. | No generated source or implicit cross-application imports. |
| S01-SEL-003 | Fastify v5 for the API boundary | Fastify v5 supports Node.js 20+ and provides a focused HTTP composition boundary and inject-based HTTP testing. | API owns HTTP composition only; no Worker or migration responsibility. |
| S01-SEL-004 | React 19 plus Vite 8 for the Client boundary | Vite supports modern Node versions and provides a distinct Web build boundary; React supports the approved Web/Telegram host-adapter seam. | S01 creates no product UI, fake state, or D02 persistence. |
| S01-SEL-005 | Vitest for unit and HTTP integration tests; real PostgreSQL/PostGIS integration tests through `pg` | A single TypeScript test runner supports shared-contract, Client seam, API injection, and lifecycle tests; database evidence remains real PostGIS, not a mock backend. | Test doubles are allowed only at explicit adapter boundaries and never become product authority. |
| S01-SEL-006 | Raw versioned SQL migrations using `pg`; no ORM or automatic startup migration | The migration contract requires visible ordering, checksums, locking, transaction control, and resource cleanup. | Only the designated migration process writes the migration ledger or schema. |
| S01-SEL-007 | `packages/contracts` owns schemas; `packages/platform-runtime` owns pure cross-runtime readiness evaluation; `packages/testing` owns test helpers; `packages/design-system` owns Client tokens/accessibility primitives. | This prevents duplicate contract definitions while keeping executable platform logic out of the contracts package. | None of these packages own a D01-D28 business fact. |
| S01-SEL-008 | GitHub Actions is the final CI confirmation; GitHub Codespaces/devcontainer is the required non-local development verification environment. | The Product Owner requires GitHub-only work while the project rules prohibit treating CI as the first serious verifier. | No source task may claim verification if its red/green cycle was not observed in the approved remote development environment. |
| S01-SEL-009 | Railway is the staging provider, using a new isolated `VibeQuestGuardians` project in the existing workspace, with separate `staging` and `production` environments. | Direct Railway inspection found no `VibeQuestGuardians` project. Existing `VibeQuest` and `HoomaUltimate` projects are reference/legacy resources and are prohibited from reuse. | Project/environment/service/database IDs remain unavailable until a separately authorized infrastructure task creates them. |
| S01-SEL-010 | The designated staging migration authority is a controlled GitHub Actions release/pre-deploy migration job, never API or Worker startup. | Satisfies the one-writer migration rule and prevents replica races. | Requires later explicit Railway credentials and staging authorization; no workflow may run a staging migration before then. |

Official compatibility evidence used for S01-SEL-001 through S01-SEL-004: Node.js LTS release information, Fastify v5 Node 20+ support, and Vite’s Node compatibility guidance, inspected 2026-11-01.

## Unresolved decisions — BLOCKED

| ID | Decision needed | Why it is blocked | Required evidence before selection |
|---|---|---|---|
| S01-OPEN-001 | Runtime language, package manager, lockfile policy, and supported version range | RESOLVED by S01-SEL-001 and S01-SEL-002. | Exact dependency versions are recorded only by the future committed lockfile. |
| S01-OPEN-002 | API framework and HTTP test harness | RESOLVED by S01-SEL-003 and S01-SEL-005. | Exact API contracts and red tests remain required in S01-1+. |
| S01-OPEN-003 | Client framework/build system and platform-test harness | RESOLVED by S01-SEL-004 and S01-SEL-005. | Exact Client seam contracts and red tests remain required in S01-1+. |
| S01-OPEN-004 | Migration runner/tool and isolated PostGIS test harness | RESOLVED by S01-SEL-006; PostGIS image digest is deferred to its bounded migration task. | Ordering, checksum, lock, transaction, rerun, rollback, cleanup, and status behavior tests remain required. |
| S01-OPEN-005 | Shared runtime-health implementation location | RESOLVED by S01-SEL-007. | The follow-up packet must provide exact interfaces and prove no duplicate contract definition exists. |
| S01-OPEN-006 | Exact CI commands and security/dependency scan tooling | RESOLVED in principle by S01-SEL-001, S01-SEL-005, and S01-SEL-008. | Exact commands are part of the S01-1 toolchain packet and must not be guessed before dependency resolution. |
| S01-OPEN-007 | Railway project, environment, service identities, database, artifact path, and migration authority identity | PARTIALLY RESOLVED by S01-SEL-009 and S01-SEL-010; physical identities do not exist. | Separate infrastructure authorization is required before project creation or deployment. |

## Prohibited assumptions

- Do not reuse the deleted S01 Node, Fastify, Vite, TypeScript, package, migration, CI, or Railway implementation as authority.
- Do not select an unlisted dependency, framework, provider, service ID, database, or environment by memory.
- Do not create a fake backend, fake user, seed business authority, placeholder product UI, simulated provider result, or localStorage authority.
- Do not deploy, provision Railway resources, run a migration, or install dependencies until a bounded follow-up task is approved.

## Decision exit gate

S01 source work remains BLOCKED until the S01-1 toolchain packet is approved with exact files, dependency versions, red/green verification environment, commands, and stop conditions. S01-OPEN-007 remains an external staging blocker and does not authorize Railway creation.
