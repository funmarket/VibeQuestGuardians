# AGENTS.md — VibeQuestGuardians

This file is the repository’s durable agent guidance. Read it before acting. It is intentionally concise; detailed milestone procedures and task templates live in EXECUTION_PLAN.md.

## 1. Project identity

- Repository: funmarket/VibeQuestGuardians
- Working branch: vibefoundation
- Current stage: S01 IMPLEMENTED; staging not accepted
- Product: VibeQuest
- Stable/release branch: main

Document approval does not prove implementation, database state, staging acceptance, deployment, or production acceptance.

## 2. Required reading order

Before making a project-specific claim or change:

1. Read this file.
2. Read [EXECUTION_PLAN.md](EXECUTION_PLAN.md).
3. Read [Master Plan.md](Master%20Plan.md).
4. Read the relevant sections of [Requirements.md](Requirements.md), [structure.md](structure.md), and [Database.md](Database.md).
5. Inspect the exact current GitHub branch/HEAD and relevant source.

Authority order:

1. latest explicit Product Owner decision;
2. Master Plan.md;
3. Requirements.md;
4. structure.md;
5. Database.md;
6. historical/reference material.

This file governs agent procedure, not product policy.

## 3. Current repository layout

The current branch contains the S01 engineering substrate. Do not assume any business domain or staging environment exists.

    /
      AGENTS.md
      EXECUTION_PLAN.md
      Master Plan.md
      Requirements.md
      structure.md
      Database.md
      README.md
      docs/
        product-design/       # reference/think-tank material only

The target implementation layout is defined by structure.md and the S01 milestone in EXECUTION_PLAN.md:

    apps/
      client/                 # Web + Telegram host adaptation
      api/                    # authenticated HTTP/realtime boundary
      worker/                 # durable asynchronous work
    packages/
      contracts/
      testing/
    database/
      migrations/

Do not create these directories or claim they exist until implementation is explicitly authorized and verified.

## 4. Commands and verification

### Current verified commands

None. The current branch has no verified package manifest, dependency installation, build script, test runner, lint command, or typecheck command. Do not invent commands or copy them from historical repositories.

### Once implementation exists

The owning implementation task must record the exact verified commands in EXECUTION_PLAN.md and the relevant handoff. At minimum, the repository must eventually expose and verify:

- formatting;
- lint;
- typecheck;
- unit/integration tests;
- architecture-boundary checks;
- build;
- migration validation;
- readiness/runtime probes.

A command passing locally is not deployment or staging evidence. Record the exact commit, command, result and environment.

## 5. Architecture rules

The target has separate runtime boundaries:

- Client: Web plus Telegram Mini App host adaptation; no direct database access.
- API: authenticated HTTP/realtime boundary composed from explicit domain modules.
- Worker: separately runnable durable jobs, outbox delivery, retries, deadlines, cleanup and projections.
- PostgreSQL + PostGIS: authoritative transactional/spatial persistence.
- Object storage/providers: replaceable adapters behind explicit contracts.

This is not a monolithic script, god service, universal repository, universal controller, or second business writer. The API may host isolated domain modules in one deployable initially, but each D01–D28 domain keeps one canonical writer and explicit interfaces.

Composition roots may wire implementations. Domain code may not import foreign infrastructure or write foreign canonical records. Admin Control Room is orchestration, not D29 and not direct SQL.

## 6. Non-negotiable product and safety rules

- No mock backend, fake API, fake users, seeded production interactions, fake sessions, fake coordinates, simulated camera proof, canned messages, fake notifications, fake VQ, fake tickets, fake payments, or optimistic success after failed persistence.
- No placeholder product feature presented as available.
- No partial business implementation merged or reported as usable.
- S01 is real engineering substrate only; it completes no business domain.
- LocalStorage, Firebase/Firestore, Solana, Gemini code, old VibeQuest code, Hooma code, historical Railway configuration, and legacy schemas are not current authority.
- Gemini files may only provide UX/interaction evidence. Extract, map to D01–D28, classify as PRESERVE, ADAPT, REJECT, or OPEN, then rebuild through the approved architecture.
- Web and Telegram share one backend, identity and business state.
- D20 is the only VQ writer.
- D22 Handshake is exactly ACTIVE → EXPIRED after 24 hours; there is no cancellation state.
- D05 confidence is versioned, Admin-configurable through D05 commands, auditable and D05-owned.
- Liveness and dependency-aware readiness are separate.
- One designated migration authority runs migrations once per target database; API and Worker replicas do not race.
- Staging is isolated, persistent and production-shaped; staging acceptance is not production acceptance.

## 7. Work procedure

Use:

INSPECT → IMPLEMENT (only when explicitly authorized) → VERIFY → RECONCILE → CLOSE → REPORT

Before editing, record:

- exact repository, branch and HEAD;
- authorized milestone/task;
- exact files and runtime resources in scope;
- owner and canonical writer;
- forbidden changes;
- expected semantic result;
- verification method;
- stop conditions.

Make one bounded semantic change at a time. Do not bundle unrelated cleanup. If the branch drifts, ownership is unclear, a policy decision is needed, or proof is unavailable, stop and report UNKNOWN or BLOCKED.

## 8. Done means evidence

Never report completion from a green build, route, migration file, deployment record, screenshot or agent confidence alone.

For the authorized scope, report:

- exact files changed and current commit;
- owner and canonical writer;
- persistence, authorization, privacy, failure and idempotency evidence;
- tests/checks actually run;
- installed migration and readiness evidence where applicable;
- exact artifact and serving revision where applicable;
- staging evidence separately from production evidence;
- remaining unknowns and the next permissible action;
- explicit confirmation that no mock, fake, placeholder authority or partial business feature was presented as available.

Use only the status vocabulary:

PLANNED, READY, IN PROGRESS, IMPLEMENTED, VERIFIED, STAGING ACCEPTED, PRODUCTION ACCEPTED, BLOCKED.

## 9. Handoff and layered guidance

Every handoff must be independently verifiable from the current repository. Chat history and previous-agent claims are locators, not proof.

Guidance may be layered:

- global ~/.codex/AGENTS.md for user-wide rules;
- repository-root AGENTS.md for this project;
- subdirectory AGENTS.md files for narrower conventions.

A deeper applicable file may add constraints but may not silently override Product Owner authority or this project’s governing documents. Task-specific procedures belong in skills or the relevant execution-plan task, not in this file.

## 10. Historical references

The old VibeQuest repository, HoomaUltimate, Railway references, Gemini files, ZIPs and docs/product-design/* are reference material only. They may inform UX, failure prevention, engineering patterns or bounded algorithms. They are never authority for current code, schema, authentication, deployment, infrastructure, domain ownership or acceptance.
