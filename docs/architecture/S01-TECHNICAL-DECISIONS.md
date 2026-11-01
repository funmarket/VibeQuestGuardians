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

## Unresolved decisions — BLOCKED

| ID | Decision needed | Why it is blocked | Required evidence before selection |
|---|---|---|---|
| S01-OPEN-001 | Runtime language, package manager, lockfile policy, and supported version range | No governing document selects a language or package manager. | Compatibility review, reproducible-install design, approved package-lock strategy. |
| S01-OPEN-002 | API framework and HTTP test harness | No framework is authoritative. | Error-envelope, shutdown, liveness/readiness, and independent-build proof. |
| S01-OPEN-003 | Client framework/build system and platform-test harness | No client implementation framework is authoritative. | Web/Telegram adapter, EN/FR/AR/RTL, theme/text-size/accessibility seam proof; no product UI. |
| S01-OPEN-004 | Migration runner/tool and isolated PostGIS test harness | A migration mechanism is required but no library/tool is selected. | Ordering, checksum, lock, transaction, rerun, rollback, cleanup, and status behavior design. |
| S01-OPEN-005 | Shared runtime-health implementation location | Contracts are required, but shared executable platform code has no approved package owner. | Demonstrate one canonical contract owner and no duplicate identity/readiness type definitions. |
| S01-OPEN-006 | Exact CI commands and security/dependency scan tooling | Commands derive from the selected stack. | Full-source format, lint, typecheck, independent build, tests, architecture check, dependency/secret scan design. |
| S01-OPEN-007 | Railway project, environment, service identities, database, artifact path, and migration authority identity | No target staging resource is identified in current repository evidence. | Explicit Product Owner authorization and direct Railway inspection. |

## Prohibited assumptions

- Do not reuse the deleted S01 Node, Fastify, Vite, TypeScript, package, migration, CI, or Railway implementation as authority.
- Do not select an unlisted dependency, framework, provider, service ID, database, or environment by memory.
- Do not create a fake backend, fake user, seed business authority, placeholder product UI, simulated provider result, or localStorage authority.
- Do not deploy, provision Railway resources, run a migration, or install dependencies until a bounded follow-up task is approved.

## Decision exit gate

S01 source work remains BLOCKED until S01-OPEN-001 through S01-OPEN-006 have an explicit approved resolution and S01-OPEN-007 is either approved for staging work or recorded as an external staging blocker. The follow-up packet must then list exact files, contracts, red tests, commands, runtime probes, and stop conditions.
