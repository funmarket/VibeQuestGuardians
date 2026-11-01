---
name: vibeq
description: Use for VibeQuestGuardians planning, source-grounded implementation, semantic audits, UX-reference mapping, milestone verification, and agent handoffs.
---

# VibeQ — VibeQuestGuardians project workflow

Use this skill for work inside funmarket/VibeQuestGuardians or for analysis that will determine what is allowed to enter that repository. Do not use it for unrelated generic coding.

## Required context

Read, in order:

1. Repository AGENTS.md.
2. Repository EXECUTION_PLAN.md.
3. Master Plan.md.
4. The relevant sections of Requirements.md, structure.md, and Database.md.
5. The exact current branch/HEAD and relevant source.

If a required source cannot be inspected, label the affected result UNKNOWN or BLOCKED. Do not replace missing evidence with memory, a mock, or a historical example.

## Source and authority discipline

Apply this authority order:

1. latest explicit Product Owner decision;
2. Master Plan.md;
3. Requirements.md;
4. structure.md;
5. Database.md;
6. historical/reference material.

Keep these evidence classes separate:

- APPROVED TARGET: governing rule or explicit decision;
- SOURCE-OBSERVED: current repository evidence;
- HISTORICAL-OBSERVED: old repository, Gemini, Hooma, Railway, or ZIP evidence;
- RUNTIME-VERIFIED: directly observed deployed/database/runtime evidence;
- PROPOSED: recommendation not yet approved;
- UNKNOWN/BLOCKED: required evidence unavailable;
- CONTRADICTED: source conflicts with a higher-authority rule.

## Project invariants

- Client, API, and Worker are separate runtime boundaries.
- Domains D01–D28 have one canonical writer each.
- Composition roots may wire implementations; domains do not import foreign infrastructure or write foreign canonical records.
- PostgreSQL + PostGIS is the intended authoritative transactional/spatial platform.
- One migration authority runs migrations once per target database.
- Liveness and dependency-aware readiness are separate.
- Exact repository/ref/commit, artifact and serving revision must be verified for release claims.
- Staging is isolated, persistent and production-shaped.
- Web and Telegram share one backend, identity and business state.
- Admin is orchestration, not D29 or direct SQL.
- No mock backend, fake API, fake users, fake coordinates, simulated camera proof, seeded business authority, fake VQ, fake payment/ticket success, placeholder product feature, or partial business implementation presented as available.

## Task workflow

### 1. Classify the task

Identify one: ANSWER, READ-ONLY INSPECTION, DOCUMENTATION, REPOSITORY MUTATION, DATABASE/INFRASTRUCTURE MUTATION, RELEASE, or BLOCKED.

State the exact authorized scope. Document approval alone does not authorize implementation, migration, deployment, release, or production changes.

### 2. Inspect before deciding

Record:

- repository, branch and HEAD;
- relevant governing documents;
- current files/runtime state;
- owner and canonical writer;
- dependencies and conflicts;
- evidence limitations.

Do not assume a target file, application, migration, deployment, or database exists because a plan names it.

### 3. For Gemini or historical references

Treat them as UX, interaction, failure-prevention, or bounded-algorithm evidence only.

For every candidate behavior, record:

- source file and observed behavior;
- intended user-visible purpose;
- proposed D01–D28 owner;
- persistence and authorization needed;
- governing rule;
- classification PRESERVE, ADAPT, REJECT, or OPEN;
- verification required.

Never transplant their backend, LocalStorage/Firebase/Solana authority, authentication, seeds, mock providers, fallback coordinates, simulated media, schemas, migrations, deployment files, or folder topology.

### 4. Plan or implement one bounded outcome

For planning, define exact files, interfaces, dependencies, tests, runtime evidence and stop conditions.

For implementation:

- change only authorized files/resources;
- keep domain ownership explicit;
- use real persistence and truthful failure states;
- add tests for authorization, invariants, idempotency and failure;
- keep durable asynchronous work in the Worker;
- do not make an incomplete business capability appear available.

### 5. Verify and report

Read back the complete changed state. Report:

- exact commit and files changed;
- owner/canonical writer;
- checks/tests actually run;
- runtime/database/deployment evidence actually verified;
- decisions and surprises;
- remaining UNKNOWN/BLOCKED items;
- approved status;
- one next permissible action;
- explicit no-fake confirmation.

Use the Master Plan status vocabulary only: PLANNED, READY, IN PROGRESS, IMPLEMENTED, VERIFIED, STAGING ACCEPTED, PRODUCTION ACCEPTED, BLOCKED.

## Acceptance gate

Do not mark a slice VERIFIED or higher until applicable evidence proves:

- authoritative state and constraints;
- authorization/privacy and denial behavior;
- failure/retry behavior;
- idempotency/concurrency;
- migration installation/checksums where applicable;
- liveness/readiness;
- exact artifact/serving identity;
- staging behavior;
- representative Web/Telegram behavior;
- no fake, mock, placeholder, seeded, or partial authority.

## Handoff format

Use this compact handoff:

- Task/milestone:
- Status:
- Repository/branch/HEAD:
- Files changed:
- Owner/canonical writer:
- Requirements/invariants:
- Tests/checks actually run:
- Runtime/database/deployment evidence:
- Decisions/surprises:
- Unknowns/blockers:
- Next permissible action:
- No-fake confirmation:

## Stop conditions

Stop and report BLOCKED or UNKNOWN when:

- branch drift is detected;
- authorization is missing;
- a new Product Owner decision is required;
- ownership is ambiguous;
- a foreign-domain write is required;
- runtime/database/deployment proof is unavailable;
- an external provider or credential is unavailable;
- the only way to continue is a mock, placeholder, fake success, or partial business feature.

## Skill maintenance

When the same VibeQuest workflow is repeated and corrected, update this skill narrowly. Keep durable repository rules in AGENTS.md, milestone/task details in EXECUTION_PLAN.md, and task-specific procedures in focused skills rather than expanding this skill into a generic manual.
