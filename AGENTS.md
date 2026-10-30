# AGENTS.md — VibeQuestGuardians

> **Status: Product Owner authorized for publication on `vibefoundation`.** Applies to every ChatGPT agent inspecting, designing, implementing, testing, operating or documenting this project. Read in full before work. Acknowledging this document is not compliance; demonstrate compliance with evidence.

## 0. Non-negotiable operating contract

1. **Project firewall:** This is the *new* `funmarket/VibeQuestGuardians` only. `main` is the stable branch, `vibefoundation` the integration branch. `funmarket/VibeQuest` / `phase-0-foundation`, old Gemini/Manus files and ZIPs are **historical references**, not target architecture or installable implementation. HOOMA is unrelated. Verify the current target branch and full SHA; do not take remembered values as live truth.
2. **The Product Owner controls product choices and external authorization.** Do not infer permission to write code, publish documents, open PRs, merge, deploy, migrate, alter configuration, delete data, or spend money from a request to analyze, plan, or draft.
3. **No guessing, no drift, no invented success.** Distinguish `APPROVED TARGET`, `SOURCE-OBSERVED`, `HISTORICAL-OBSERVED`, `PROPOSED`, `RUNTIME-VERIFIED`, `UNKNOWN`, and `CONTRADICTED`. Cite actual path/symbol/commit/log/test/run, not a plausible story.
4. **Full lifecycle:** `INSPECT → IMPLEMENT (only if authorized) → VERIFY → RECONCILE → CLOSE → REPORT`. Closure means all *applicable* acceptance evidence, not merely a generated file, a green check, successful deploy, or an agent's confidence.
5. **One authorized semantic outcome per command packet, not one edit attempt.** Correct ordinary in-scope mistakes and rerun the same relevant checks without repeat approvals; stop for material change of target, owner, architecture, external consequence, or truly unauthorized side effect. After real drift do not autonomously reset/rebase/rollback/compensate.

## 1. Required ChatGPT agent startup

Before any substantive assertion or action:

- Identify the exact task, repository, branch, intended output, authorization class (`ANSWER`, `READ-ONLY`, `LOCAL ARTIFACT`, `REPOSITORY MUTATION`, `EXTERNAL MUTATION`, `RELEASE`) and stop condition.
- Read this file and the *current* source baseline, product decisions, domain ownership register, and relevant accepted requirements/architecture/database/build plan. Read the applicable VibeBehaviorGate skill and both of its full reference files **when available in the agent environment**; this document stands on its own if a skill is unavailable. Do not assert you loaded a skill you cannot access.
- Inspect source *before* drafting conclusions or changing code. For source/archive review, discover and inspect **all already provided** conversation uploads, relevant Project/Library files, ZIP entries, and repository documents. Record names, provenance, source hashes or commit, duplicates and variant differences. **Never ask to re-upload a file until you have searched for its existing copy and explained the access failure.**
- Inspect actual wiring from entry point to validation, auth, domain command, persistence, event/worker, error path and tests. A filename/handler match is not proof of execution; an API response is not proof of durable write; a migration file is not proof of installed schema.
- Establish the canonical writer for each business record/invariant. Read-only UI, search and analytics are not business writers. A multi-domain journey can orchestrate separately owned commands without creating duplicate writers.
- State the verified current state and required outcome before any mutation. Check the complete diff afterwards and recheck current state where time-sensitive.
- Never publish a draft with a word such as `FINAL`, `VERIFIED`, `CLOSED` or `APPROVED` unless the declared gates and Product Owner acceptance actually hold.

## 2. Evidence, source and document integrity

- Source hierarchy: explicit current Product Owner decisions > accepted governing documents > exact inspected current source/schema/tests/runtime > historic source and reports > inference. Historical documents or generated contracts can be wrong. When two sources conflict, expose the conflict and inspect; do not silently choose the convenient version.
- Original **215-feature historical inventory is preservation evidence**, not 215 deployed capabilities, 215 endpoints or the complete new product specification. Preserve all 215 identifiers/descriptions, trace each material feature, classify mock/fallback versus actual behavior, and compare against all **28 initial-product domains**. No domain is arbitrarily deferred.
- For feature audits perform a **second independent semantic pass** on every material ownership mapping as well as mechanical count/ID integrity. Audit ownership hotspots: Trails vs Geo; Profiles vs Identity; event discussion vs Messaging; notifications vs originating actions; Media vs attachment; matching vs geofence; rewards vs reputation; reservations vs tickets; marketplace vs payments.
- Preserve safe user-visible behavior, not defective implementation. Never copy fabricated users, client-controlled VQ balances, simulated alerts, pretend GPS/photo/camera proof, fake bookings, hardcoded cities/reviews, browser-local authentication or invented finance success as production functionality.
- Technical gaps, code-inspectable disagreements and unfinished verification are **agent work**, not deferred Product Owner questions. Product Owner decisions are limited to genuine policy/experience choices not answered by existing approved requirements; record the exact choice, options, affected feature IDs, dependency and implementation restriction. Do not abandon the rest of the technical task.
- Generate and **open/read back** every deliverable. Check exact file path exists, nonzero bytes, expected headings, CSV row count/header uniqueness, and checksums when using copies. Never offer unverified or empty downloads. Do not claim a source survey is an independent end-to-end semantic audit.

## 3. Fixed product boundaries (reconfirm current approvals before implementation)

- One product, shared canonical identity/API/database, separately frontend-serving Web and Telegram deployments with host adapters; no redirect-only Telegram substitute.
- Five root destinations: **Home / Explore / Share / Vibe / Purse**. Guest-first *public read*, authenticated protected actions. Preferences adapt to device/host, with user overrides; notification bell in top bar and user settings in profile menu.
- **VibeCheck 180 seconds; VibeFlash 33 seconds** with server-authoritative expiry. Do not confuse VibeFlash with Home Flash Events.
- **VQ is the sole in-app reward unit**, with admin-governed awards and immutable ledger semantics; not legacy Points or an implicit crypto token. Recognition/reputation is separate from reward balance and payments.
- All 28 domains belong to the complete initial application. Ticketing is independent of Events and Guardian Reservations; Events and Activities remain separate. Advertising, Subscriptions/Entitlements, Payments/Billing and Marketplace have distinct ownership.
- Media owns assets; consumer domains own attachment authorization. Geo owns location proof, not Trails. Notifications owns delivery, not initiating actions. Search/Discovery is a projection, not a second writer.
- Unapproved policy, schema and physical service boundaries remain unapproved. Do not turn a 28-domain logical register into 28 microservices, schemas, DB roles or packages by assumption.

## 4. The old API/readiness failure: mandatory preventive release gate

**Observed historical risk (not a proven single root cause):** the old reconstruction had divergent Web/API revisions, an attempted newer API revision failed readiness (HTTP 503), and the previous successful API revision continued serving. Database/migration incompatibility was suspected, **not independently established as the exact cause**. Never convert this history into an invented definitive root-cause diagnosis.

**No API/Worker/database or Web/Telegram release may be declared successful without the following ordered checks appropriate to the proposed change:**

1. **Identify live truth:** exact repository/branch/commit, build artifact or image digest, environment (dev/staging/prod), service IDs, deployment IDs, active served version, and deployed API/Worker/Web/Telegram versions. A GitHub merge or latest green CI is not proof of the currently serving artifact.
2. **Installed database reality:** inspect the *actual target environment's* migration ledger, schema names, table/column definitions, functions, constraints, PostGIS extensions, indexes, grants and migration checksums needed by the API/Worker. A SQL file in Git and a clean isolated database install **do not certify production**. Do not use personal/production records as disposable fixtures.
3. **Forward/backward compatibility:** explicitly compare proposed migration/API contracts with the **currently serving** older instances as well as new ones; assess mixed-version windows, Web/API/Worker compatibility, outbox payloads and dependencies. Prefer safe expand/contract plans. Do not apply destructive/irreversible DDL without specific approval and data recovery plan.
4. **Pre-deployment verification:** compile/typecheck, relevant integration and migration tests against isolated/staging equivalent state; test schema version gating, auth, key endpoints, worker processing, idempotency, retries, failure modes and realistic seed-free probes. Verify target environment secrets/config *presence and shape without exposing values*.
5. **Migration before dependent rollout:** when a migration is authorized, validate it in an isolated environment, confirm compatibility, apply it to the exact approved target, then re-query installed ledger/schema/checksums; only afterward roll out instances that require it. Never guess deployment sequencing from a README or rerun a partial migration blindly.
6. **Readiness is not mere liveness:** distinguish process alive from dependency-compatible ready. Probe exact API readiness and representative authorized endpoints, database connection and query capability, required migrations, Worker/Outbox interaction, and Web/Telegram request paths. Capture actual HTTP status and diagnostic logs. Do not hide required missing dependencies by weakening readiness checks or returning fake success.
7. **Safe serving and promotion:** verify the new API revision actually reaches READY and is serving; old instance safety is not new-instance success. Confirm Web/Telegram compatibility and Worker version; check logs, status, migration compatibility and error rates following promotion. Verify autodeploy settings and never disable/enable without approval. Explicitly gate promotion and rollback boundaries.
8. **Failure response:** a 503, failed readiness, missing migration, or version divergence is an **OPEN RELEASE BLOCKER**. Preserve the last known healthy serving revision when possible; inspect logs, exact failed artifact, installed schema, configuration and dependency initialization to establish root cause. Do **not** guess 'database' solely from a 503. Do not bypass health checks, force-promote, delete data, migrate or roll back without authorization. Report failed vs serving revisions separately.
9. **Closure evidence:** record successful checks with exact revision/environment/timestamp, installed migration evidence, active serving API/Worker/Web/Telegram artifacts, readiness response, representative tests and Product Owner acceptance where required. If any mandatory proof is absent, status is `IMPLEMENTED / ACCEPTANCE OPEN` or `BLOCKED`, not CLOSED.

**Mandatory pre-release questions:** Which exact commit is serving each component? Which migrations are installed in the target DB? Can both old and new versions function through the transition? Does readiness prove required dependencies, not merely process health? Can outbox/Worker handle mixed versions? What live evidence shows new requests reach the intended API? What is the authorized recovery/forward-fix plan if the rollout fails?

## 5. Other historical traps to prohibit

- **Misleading success:** never report completion for localStorage fallback, mock payment, client-balance adjustment, imaginary push delivery, generated review/user data, client-side GPS distance, or synthetic dual-camera image. Reject false-positive proof at the server trust boundary.
- **Ownership drift:** no feature-specific phantom tables/endpoints, no dual writes, no admin bypass of owner commands, no UI action storing canonical business state locally as sole authority, no service-level circular ownership.
- **Incomplete work disguised as a gate:** do not turn a 210-row unfinished audit into 210 Product Owner questions. Do not substitute filename scanning, row counts, test names or CI for independent semantic review.
- **Premature document publication:** do not put candidate architecture, generated 215-row ownership or unapproved DDL into the canonical approved folder. Review exact content, reconcile dependencies and obtain explicit approval first.
- **Blind deployment/recovery:** no release on partial migration proof; no production seed/SQL cleanup or rebase/force-push/rollback unless authorized. Do not break deployed compatibility to make a test green.
- **Agent passivity:** no repeated permission requests for normal in-scope reads/edits/checks, no blaming user for sources already supplied, no unsupported claim that an environment/tool cannot be accessed before checking the relevant available connector.
- **False UI acceptance:** desktop preview, successful API and green CI do not establish phone-first Web/Telegram UI or actual device permissions. Test real target surfaces before asserting visual/host acceptance.

## 6. Exact execution protocol

**For every substantial task**, prepare a concise internal command packet: `TASK`, `MODE`, `TARGET`, `AUTHORIZED OUTCOME`, `FORBIDDEN SIDE EFFECTS`, `CURRENT SOURCE`, `REQUIRED EVIDENCE`, `EXPECTED DIFF` (if modifying), and `DONE WHEN`. Execute the bounded task. Do not create ceremony, new gates or extra branches for ordinary mechanics.

**For changes:** preflight current HEAD and worktree/diff → inspect canonical owner and call path → implement *only* approved semantic outcome → inspect complete diff → run targeted tests and relevant integration/security checks → reconcile documentation/status → report. Correct in-scope mistakes without reapproval. Stop on actual material drift or a missing consequential authorization; after drift, no autonomous recovery.

**Report using evidence labels:** verified current facts; exact changed artifacts; tests and limits; API/runtime serving proof when relevant; owner decisions; remaining genuinely unavailable evidence; exact next permissible action. A source file existing ≠ wired feature; CI green ≠ deployed; READY ≠ complete end-to-end user acceptance; downloaded file exists ≠ nonempty valid data.

## 7. Handoff and acceptance

- Retain one canonical record of decisions/status, not competing reports. Preserve accepted work unless a new defect, changed condition or user request justifies reopening.
- Record what was accepted **by whom and for what scope**, exact commit/test/runtime environment, open issues and next authorized action. Product Owner decisions may remain pending **only as genuinely independent policy choices**; technical investigation remains the agent's responsibility.
- A new agent starts from the live revision and these source references, not the preceding agent's confidence. If a necessary source is genuinely unavailable, identify the exact evidence and affected conclusion; do not fabricate.

## 8. Governing source pointers (verify live content and status)

- `docs/product-design/00_SOURCE_BASELINE.md` — evidence baseline and recorded historical failure.
- `docs/product-design/01_PRODUCT_DECISIONS_AND_IDEAS.md` — binding directions and outstanding product-policy questions.
- `docs/product-design/02_DOMAIN_OWNERSHIP_FINAL_LEAN.md` — 28-domain candidate awaiting its documented approval gates.
- Original 215-row history and the reviewed safe-behavior extraction: inspect the actual supplied artifacts and status; do not assume they are committed or semantically certified.
- VibeBehaviorGate `skill.md`, `references/BEHAVIOR.md`, `references/EXECUTION_ACCEPTANCE_CLOSURE.md` — source policy this file operationalizes. Skill availability varies; this file is a repository-side practical summary, not proof the external skill was loaded.

**Publication authority:** Product Owner explicitly authorized adding this agent guide as root `AGENTS.md` on `vibefoundation`. This does not authorize edits to `main`, deployment, schema changes, or publication of other unreviewed documents.
