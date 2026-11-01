# S01 Implementation Packet

**Task:** S01-0 — pre-implementation gate  
**Status:** IMPLEMENTED — documentation artifact only; S01 source implementation is BLOCKED  
**Repository/branch/HEAD before this packet:** funmarket/VibeQuestGuardians / vibefoundation / fad89f60901b1128b38cc0f69abd0002e13b56d7  
**Technical decision record:** [S01-TECHNICAL-DECISIONS.md](S01-TECHNICAL-DECISIONS.md)  
**Authorization:** Product Owner instruction to approve and commit S01-0 artifacts while retaining unresolved technical-stack and staging-target decisions.

## Milestone

```yaml
Milestone: S01
Authorized scope: S01-0 documentation only
Non-goals:
  - D01-D28 business domains
  - authentication, sessions, or product workflows
  - product UI, five-tab UI, fake unavailable-state screens, or Gemini implementation transfer
  - fake backend, fake API, fake user, seeded business authority, localStorage authority, simulated device/provider proof
  - migration execution, Railway provisioning, deployment, release, or production mutation
Exact repository/ref/HEAD: funmarket/VibeQuestGuardians / vibefoundation / fad89f60901b1128b38cc0f69abd0002e13b56d7
Files allowed to change:
  - docs/architecture/S01-TECHNICAL-DECISIONS.md
  - docs/architecture/S01-IMPLEMENTATION-PACKET.md
  - EXECUTION_PLAN.md (evidence update after both artifacts exist)
Files forbidden to change:
  - Master Plan.md
  - Requirements.md
  - structure.md
  - Database.md
  - all application, package, migration, CI, provider, Railway, and deployment files
Domain owner: Cross-cutting platform infrastructure only; no D01-D28 owner is implemented
Canonical writer:
  - migration ledger: designated release/pre-deploy authority only, not yet selected
  - runtime identity: build/deployment pipeline, not yet selected
  - business state: none
Interfaces/contracts: BLOCKED pending S01-OPEN-001 through S01-OPEN-005
Behavior matrix:
  - success: the two durable records exist and source remains absent
  - empty state: no source/runtime/deployment is claimed to exist
  - invalid input: unresolved technical choices cannot be silently defaulted
  - dependency failure: unavailable staging/provider evidence remains BLOCKED
  - duplicate request: no migration or source operation is executed
  - concurrent request: no runtime or migration exists in S01-0
  - retry: later implementation begins only from a new approved packet
  - timeout: not applicable; no external operation is invoked
  - cleanup/shutdown: not applicable; no runtime resource is created
Tests to write first:
  - BLOCKED until the technology, test framework, and exact contracts are approved
  - required behavior classes are recorded below
Expected red result:
  - each future behavior test must fail before production implementation exists
Implementation strategy:
  - one bounded task and one semantic commit at a time
Migration impact:
  - none in S01-0
Runtime/deployment impact:
  - none in S01-0
Verification commands:
  - GitHub read-back of both documents and current branch HEAD
Runtime verification:
  - none; no runtime is created
Stop conditions:
  - any source/dependency/migration/deployment request before unresolved decisions are resolved
Open decisions:
  - S01-OPEN-001 through S01-OPEN-007 in S01-TECHNICAL-DECISIONS.md
```

## Exact future file ownership

No production file is authorized in S01-0. After technical selection, a new packet must replace every `BLOCKED` entry with exact paths and signatures before a source mutation.

| Boundary | Required owner | Future file responsibility | Status |
|---|---|---|---|
| Client | apps/client | Web/Telegram host adapters, platform signals, tokens, accessibility seams; no business authority | BLOCKED |
| API | apps/api | HTTP composition, health endpoints, controlled shutdown; no schema mutation | BLOCKED |
| Worker | apps/worker | Durable runtime composition and controlled shutdown; no API/business endpoint ownership | BLOCKED |
| Contracts | packages/contracts | Versioned runtime identity, readiness, and error-envelope schemas only | BLOCKED |
| Testing | packages/testing | Explicit test fixtures and isolated-test-database guard only | BLOCKED |
| Design system | packages/design-system, if selected | Semantic tokens and accessibility primitives only | BLOCKED |
| Runtime health | approved location only | Pure readiness evaluation; cannot duplicate contract authority | BLOCKED |
| Migrations | database/migrations | Immutable operational migration records only | BLOCKED |
| Migration authority | release/pre-deploy process only | Ordered installation and ledger writes | BLOCKED |
| CI | .github/workflows | Confirmation of already-reviewed checks; cannot weaken gates | BLOCKED |
| Staging | approved Railway target only | Isolated Client/API/Worker/PostGIS environment | BLOCKED |

## Required future red-test classes

The follow-up packet must map each item to an exact test file, test name, expected red result, implementation commit, green result, full-suite result, and runtime evidence.

1. Missing/invalid runtime configuration fails before a server listens.
2. Complete exact runtime identity is accepted; missing or `unknown` identity fails readiness.
3. PostGIS absence, empty migration ledger, incompatible migration state, and unavailable database each fail readiness.
4. A valid installed PostGIS and compatible ledger pass readiness.
5. First migration applies once; rerun is idempotent; changed applied checksum fails closed.
6. Migration lock, transaction rollback, client release, pool shutdown, and status-mode cleanup are each proven.
7. API and Worker liveness/readiness differ, return truthful HTTP status, and shut down cleanly.
8. Client preference seams obey explicit > Telegram > browser/OS > product default and support EN/FR/AR/RTL without product preference persistence.
9. Client has no direct database access; API/Worker do not start migrations; no cross-app source imports occur.
10. Full format, lint, typecheck, independent builds, tests, architecture checks, dependency/secret checks, and staging probes are not weakened.

## S01-0 acceptance evidence

- [x] The current branch was inspected before mutation.
- [x] Current source contains no S01 implementation files.
- [x] No framework, package, service, database, migration, or provider was guessed.
- [x] No source, dependency, CI, migration, or Railway resource was created.
- [x] The technical-decision record identifies every unresolved decision as BLOCKED.
- [x] The execution plan was updated in commit `4f84e9f7564ca859606d06955655e2338c462c4e` with the artifact commit SHAs and remaining blockers.
