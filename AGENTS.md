# AGENTS.md — VibeQuestGuardians

## 0. Purpose and mandatory status

This file is the mandatory repository-side execution, evidence, safety, ownership, and release discipline for work on **`funmarket/VibeQuestGuardians`**. It does not replace Product Owner decisions or the approved governing product/architecture documents.

Every substantial VibeQuestGuardians task must follow:

**INSPECT → IMPLEMENT (only when authorized) → VERIFY → RECONCILE → CLOSE → REPORT**

A generated file, green CI run, created route, migration file, deployment, or agent confidence is never enough by itself to establish completion.

---

## 1. Mandatory source-of-truth and continuity gate

Before any project-specific claim, recommendation, design, code change, document mutation, release action, database action, or deployment action:

1. **NO SOURCE, NO CLAIM.** Inspect the current governing sources and relevant live source. If proof is unavailable, mark the affected conclusion `UNKNOWN` or `BLOCKED`.
2. **HANDOFFS ARE LOCATORS, NEVER AUTHORITY.** Memory, summaries, previous-agent claims, and continuity documents point to evidence; they do not replace it.
3. **SEARCH BEFORE ASKING.** Search current Product Owner decisions, governing documents, supplied files, source, and relevant history before asking a question already answered by available evidence.
4. **DO NOT REOPEN ACCEPTED DECISIONS.** Reopen only when a newer explicit Product Owner decision, a verified contradiction, or a demonstrated defect requires it.
5. **RECONCILE DECISIONS BEFORE OUTPUT.** Classify relevant rules as `DIRECTED`, `LOCKED`, `REVISED`, `PROPOSED`, or `OPEN`.
6. **HISTORICAL REFERENCE FIREWALL.** Old VibeQuest, Gemini, Manus, old Railway state, legacy ZIPs, and HOOMA are never current implementation authority.
7. **SOURCE TRUTH ≠ RUNTIME TRUTH.** Source presence does not prove an installed migration, serving revision, durable write, database state, deployment, or working runtime.
8. **NO INTERPRETATION-BASED OVERRIDES.** An agent preference never supersedes an explicit Product Owner rule.
9. **CONTRADICTION BLOCKER.** Compare relevant governing sources before approving or publishing a material conclusion. Resolve source-answerable inconsistencies; isolate genuine unresolved policy conflicts.
10. **KEEP AN EVIDENCE LEDGER.** For material claims record source path/artifact, branch/SHA where relevant, evidence class, decision status, and limitation.
11. **COMPLETE THE AUTHORIZED TASK, NOT A NEW TASK.** Do not expand scope because another improvement is relevant or convenient.
12. **FAIL CLOSED ON UNSUPPORTED CERTAINTY.** If the required inspection/reconciliation was not performed, do not claim a project-specific result is verified or complete.

Use evidence labels precisely: `APPROVED TARGET`, `SOURCE-OBSERVED`, `HISTORICAL-OBSERVED`, `RUNTIME-VERIFIED`, `PROPOSED`, `UNKNOWN`, `CONTRADICTED`.

---

## 2. Project identity firewall

### Current product

- Repository: `funmarket/VibeQuestGuardians`
- Stable/release branch: `main`
- Integration branch: `vibefoundation`
- Current project stage: **PRE-S01 APPROVED GOVERNING-DOCUMENT BASELINE**

The project currently has Product Owner-approved governing documents for product behavior, architecture, conceptual persistence, and implementation sequencing. That approval is not proof that the application, staging environment, database, or production runtime is implemented or accepted.

Preserve this distinction:

**approved governing documents ≠ implemented application ≠ staging acceptance ≠ production acceptance**

### Historical/reference-only sources

The following may be used only as evidence for historical product intent, UX, interaction reconstruction, visual behavior, failure lessons, and bounded implementation concepts:

- `funmarket/VibeQuest`
- old `phase-0-foundation`
- Gemini outputs and ZIPs
- Manus plans/reports
- old Railway state
- legacy schemas, migrations, deployment definitions, and source implementation

They are not current architecture, canonical ownership, persistence, deployment, or release authority.

### HOOMA

HOOMA is a different project. Never mix its repositories, accounts, schemas, infrastructure, test evidence, deployments, or decisions with VibeQuestGuardians.

---

## 3. Governing authority hierarchy

Use this precedence exactly:

1. **Latest explicit Product Owner decision**
2. **Approved `Master Plan.md`** — controlling implementation, sequencing, operational, and acceptance authority
3. **Approved `Requirements.md`** — product-behavior baseline
4. **Approved `structure.md`** — architecture/module/ownership baseline
5. **Approved `Database.md`** — conceptual persistence/invariant baseline
6. **Historical/reference/think-tank material**

`AGENTS.md` is mandatory execution/evidence/release discipline. It does not outrank the Product Owner or `Master Plan.md` as product-policy authority.

### `docs/product-design/*`

`docs/product-design/*` is **THINK-TANK / REFERENCE MATERIAL ONLY**.

It may contain research, ideas, source reconstruction, historical analysis, experiments, or supporting evidence. It is not governing product authority, canonical domain authority, architecture authority, persistence authority, implementation authority, or release authority.

Do not instruct agents to treat any of the following as governing implementation sources:

- `02_DOMAIN_OWNERSHIP_FINAL_LEAN.md`
- a separate “domain ownership register”
- a separate “28-domain ownership file”
- a product-design “decisions” file

The approved 28-domain ownership model is embedded in the governing set itself.

---

## 4. Current project stage and authorization boundary

The approved restart state is:

**PRE-S01 APPROVED GOVERNING-DOCUMENT BASELINE**

This means:

- Product behavior is approved.
- Architecture/module ownership is approved.
- Conceptual persistence/invariants are approved.
- The Master Plan is approved.
- S01 has not automatically begun.
- The application is not complete.
- Staging has not been accepted merely because documents exist.
- Production has not been accepted merely because documents exist.

The canonical agent continuation contract is [`EXECUTION_PLAN.md`](EXECUTION_PLAN.md). New agents must read it after this file and before selecting work. It records the phase sequence, no-mock/no-placeholder rules, authorization contract, acceptance evidence, handoff protocol and stop conditions.

Document approval does not authorize arbitrary execution:

- document approval ≠ repository mutation authority
- document approval ≠ database mutation authority
- document approval ≠ deployment authority
- document approval ≠ production acceptance

Every implementation, repository, database, infrastructure, deployment, release, or external mutation requires its own bounded authorization.

---

## 5. Clean-room rebuild and historical behavior recovery

**Preserve the product. Rebuild the engineering.**

Historical sources may be inspected for intended behavior, UI/UX, visual language, labels, flows, interaction choreography, and useful bounded concepts. They must not be transplanted as current implementation authority.

### Prohibited legacy transplant

Do not copy, mechanically translate, rename-and-reuse, or bootstrap legacy VibeQuest:

- source code
- components
- hooks
- services
- API routes
- repositories/data-access layers
- state stores
- authentication/session implementation
- schemas
- migrations
- folder topology
- dependencies
- deployment configuration
- infrastructure definitions

S01 explicitly prohibits bootstrap/import of legacy **code, schemas, migrations, and infrastructure definitions**.

This is not a blanket Product Owner rule that historical application data can never be migrated. Any future historical-data migration would require separate explicit authority, design, privacy/security review, and verification.

### No mock authority or false success

Reject as production truth:

- fake users/activity
- localStorage as canonical business state
- invented GPS/check-ins/geofences
- synthetic live-camera proof
- fake bookings/Handshakes
- canned messages presented as real humans
- client-minted VQ
- fictitious confidence
- fake notifications
- pretend payment/ticket/QR success
- optimistic success after failed authoritative persistence

A broken or mocked historical implementation is a reason to re-engineer the intended feature correctly, not to delete the feature.

---

## 6. Complete initial product and canonical ownership

All **D01–D28** belong to the complete initial application. No domain is casually deferred. There is **no D29**.

The 28 logical domains do not imply 28 microservices, databases, schemas, deployments, packages, teams, or migrations.

Each authoritative business fact/invariant has one canonical writer. Cross-domain journeys use explicit owner-authorized commands/contracts, orchestration, events, and projections without creating a duplicate writer.

Important ownership boundaries include:

- D01 identity/authentication and Admin role/capability associations
- D02 profiles/preferences
- D03 follows/blocks
- D04 geographic consent/evidence/presence/proximity
- D05 Places/check-ins/validation/confidence
- D06 Trails
- D07 Guardian/Legend qualification and service rules
- D08 Tours/reservations/Guardian engagements
- D09 Businesses/organizations/operator authority
- D10 Activities
- D11 Events
- D12 Social Content
- D13 global media asset lifecycle
- D14 Messaging
- D15 Live Rooms
- D16 Communities
- D17 Matching/confirmed Vibes/Pulls
- D18 VibeCheck/VibeFlash challenge state
- D19 Guardian/provider recognition and reputation-review content
- D20 sole VQ writer
- D21 moderation/reports/cases/sanctions/appeals
- D22 Handshake identity/lifecycle/review-eligibility proof
- D23 notification delivery/inbox
- D24 Advertising
- D25 Subscriptions/Entitlements
- D26 Marketplace, including Marketplace product/deal-item review content
- D27 future platform-fiat/payment boundary
- D28 Ticketing

Read-only UI, search, analytics, dashboards, and projections are not second writers.

---

## 7. Architecture invariants

The approved target is a clean domain-oriented system with separate application/runtime boundaries:

- `apps/client`: one responsive Web client plus Telegram Mini App host adaptation; no direct database access or business authority.
- `apps/api`: synchronous authenticated HTTP/realtime boundary composed from explicit owner-domain modules, capability ports, commands, queries and authorized projections.
- `apps/worker`: separately runnable durable asynchronous runtime for outbox delivery, retries, deadlines, cleanup, media processing, projections and explicitly owned jobs.
- PostgreSQL + PostGIS: authoritative transactional/spatial persistence.
- Object storage and external providers: replaceable adapters behind explicit ownership contracts.

This is **not** a monolithic script, god service, universal repository, universal controller, universal schema owner, or second business writer. The API may initially host multiple isolated domain modules in one deployable, but every D01–D28 domain retains its own ownership, canonical writer, interfaces, persistence adapters and tests. The logical domains are not a requirement for 28 microservices, databases or deployments.

Composition roots may wire concrete implementations. Domain modules may use narrow capability ports, but may not import foreign infrastructure or write foreign canonical records. Admin Control Room is a privileged orchestration surface, not D29 and not a direct-SQL writer.

One designated release/pre-deploy migration authority runs migrations once per target database. API and Worker replicas must not race to migrate. Applied migration checksums, required extensions, readiness and actual serving revision must be verified separately.

Every deployable must expose separate liveness and dependency-aware readiness, together with exact repository/ref/commit, build artifact, serving revision and environment identity. Staging must be isolated, persistent and production-shaped; staging acceptance never substitutes for production acceptance.

### Web + Telegram

Web and Telegram are one product.

- Web is the responsive browser client.
- Telegram is a Telegram Mini App host adaptation.
- Telegram host APIs are adapters, not a separate business system.

Do not create or imply a separate Telegram database, wallet, identity authority, ledger, business state, or redirect-only fake implementation.

### Device permissions

Location, camera, and microphone are independent reusable platform capabilities. Distinguish:

- application rationale/consent
- browser/OS/Telegram host permission
- actual device availability
- feature-specific privacy authorization
- granted/denied/blocked/unavailable/revoked states where observable

An in-app permission dialog cannot pretend to grant OS/device access.

## 8. Root navigation and product composition

The five root destinations are:

- Home
- Explore
- Share
- Vibe
- Purse

All five are **equal-sized**. Share may retain heart imagery but is not elevated, oversized, floating, or a larger central action.

Guest-first read-only public discovery remains approved. Registration/authentication is required only for protected actions that need an account.

A page may compose many features, but it must not become the combined business implementation. Distinct user-facing experiences keep identifiable frontend ownership and authoritative backend interfaces.

---

## 9. Admin Control Room

Admin Control Room is a first-class application/orchestration surface, **not D29**.

- S02 begins the permanent Admin shell and scoped authorization/RBAC.
- Owner-domain panels are added progressively as their domains are implemented.
- S15 is integrated Control Room completeness, not the first appearance of Admin.
- Admin is not direct SQL.
- Admin is not an unrestricted god-mode subsystem.
- Admin is not a second business writer.
- Commands route through D01–D28 canonical owners.
- Privileged actions require scoped authorization and appropriate audit.

D21 owns reports/cases/sanctions/appeals; D20 owns VQ postings/rules/grants; D05 owns Place confidence; D07 owns Guardian eligibility; D24 owns Advertising; and so on.

---

## 10. Settled product rules that must not be reopened casually

### Handshake — D22

For qualifying approved source journeys, a qualifying accepted source agreement creates exactly one idempotent D22 Handshake.

For Guardian/Legend/Tour service flows, **real provider acceptance** is the trigger. Opening Hire, submitting a request, sending a message, or an unanswered invitation is insufficient.

Lifecycle:

`NO_HANDSHAKE → ACTIVE_HANDSHAKE → EXPIRED_HANDSHAKE`

Rules:

- exactly 24 hours
- server-authoritative expiry
- no Handshake cancellation state
- underlying booking/deal cancellation does not revoke, reset, delete, or extend an issued Handshake
- D22 owns identity, issuance, expiry, idempotency, and review-eligibility proof
- D22 does not own review content
- D19 owns Guardian/provider reputation-review content
- D26 owns Marketplace product/deal-item review content

Do not reopen Handshake cancellation/review eligibility as an open Product Owner decision.

### D05 confidence

D05 Place confidence is governed by a versioned, auditable, Admin-configurable policy. Admin changes policy through authorized D05 commands. D05 remains the sole canonical confidence writer.

Exact active formula/parameters are implementation/configuration work, not a current Product Owner policy gate.

### VQ and Marketplace

- D20 is the sole canonical VQ writer.
- VQ is an internal, noncrypto reward/value unit.
- Recognition/reputation is separate from VQ.
- Marketplace VQ is direct buyer/user → seller/provider through D20.
- Ordinary Marketplace has no default escrow, Marketplace commission, platform delivery guarantee, automatic refund, handover proof, authenticity proof, or fiat-settlement proof.
- D26 owns Marketplace listing/deal/negotiation state and Marketplace product/deal-item review content.
- D27 is a future-only platform-fiat/payment boundary for launch unless separately authorized.

### Geo

Preserve:

- genuine device location
- D04 consent/evidence authority
- PostgreSQL/PostGIS authoritative VibeQuest-owned spatial operations
- MapLibre presentation
- replaceable tile/style/geocoding/external-POI/navigation boundaries
- current low-cost Overpass adapter where applicable

Current numeric rules:

- Place check-in maximum: **5 m**
- applicable Secrets / Find Hub / nearby-feed discovery scope: **23 km**
- Find Hub temporary-position maximum retention: **2 hours**

Do not confuse discovery radius, check-in radius, Secret claim radius, Validate approach radius, individual Find Hub geofence radius, or D18 challenge eligibility.

The historical Share 5 km / Home 10 km nearby-feed radii are superseded where the directed 23 km nearby-feed discovery scope applies.

### VibeCheck / VibeFlash

- VibeCheck: **180 seconds**
- VibeFlash: **33 seconds**
- server-authoritative timers
- separate features
- no geographic/proximity participation gate

A qualifying reciprocal completed VibeCheck may provide D18 proof for exactly one idempotent D17 confirmed Vibe. Invitation acceptance alone, one-sided participation, Skip/Refuse, expiry, follow, mutual follow, compatibility score, or ordinary VibeFlash participation does not create that Vibe.

---

## 11. Exactly three current Product Owner policy gates

Only these three slice-local Product Owner decisions remain open:

1. **Secret bounty-claim proximity**
2. **Validate approach-notification radius**
3. **VibeFlash scheduling/automation**

Do not list the following as current open Product Owner decisions:

- Handshake cancellation/review policy
- Marketplace escrow/refund policy
- Marketplace VQ transfer policy
- D05 confidence ownership/formula policy
- general Guardian booking policy
- general finance boundaries
- API performance numbers
- stronger Admin-grant approval
- historical 5 km / 10 km feed radii

Historical Secret 50 m and Validate 200 m values are references only until their corresponding open gates are decided.

---

## 12. S01 boundary

S01 is the engineering substrate slice. It must not be treated as a business-feature completion milestone.

S01 establishes the permanent engineering foundation, including:

- repository/workspace substrate
- one shared Web/Telegram client
- API
- Worker
- shared contracts/testing
- migration mechanism
- PostgreSQL/PostGIS foundation
- isolated test database
- persistent production-shaped staging path
- CI
- health/readiness
- structured configuration
- exact build/deployment/revision observability

S01 completes **no business domain**.

Five-tab placeholders are allowed only as explicit navigation scaffolding/unavailable-state UI. No fake business state. No speculative physical schema for all 28 domains.

Do not start S01 merely because the governing documents are approved. S01 requires explicit implementation authorization.

---

## 13. Evidence and source/runtime separation

Never equate:

- source code with installed runtime
- migration file with installed migration
- schema design with live database state
- test pass with deployment
- CI with production acceptance
- deployment success with correct serving revision
- browser preview with Web/Telegram device acceptance
- handler existence with durable write
- API response with persisted business effect

For mutable source, verify exact branch/HEAD at the gate where it matters.

For runtime/database claims, inspect the applicable environment directly. If that access is unavailable, label the claim `UNKNOWN`/`BLOCKED`; do not substitute documentation.

---

## 14. Historical release-failure prevention

Historical evidence showed divergent Web/API revisions, a newer API deployment failing readiness, and an older successful API revision continuing to serve. Database/migration incompatibility was suspected but was **not proven as the single definitive root cause**.

Do not rewrite that history as “the database caused it.”

For applicable future API/Worker/database/Web/Telegram releases, verify as required by scope:

1. exact repository/ref/commit and target environment
2. exact build/deploy artifact/revision
3. actual serving revision
4. installed migration ledger and required checksums
5. actual schema/extensions/indexes, including PostGIS where required
6. forward/backward and mixed-version compatibility
7. migration-before-dependent-runtime sequencing when applicable
8. liveness separately from dependency-aware readiness
9. worker/outbox compatibility
10. representative authorized runtime probes
11. post-release serving evidence
12. rollback/forward-fix authority before executing recovery

A migration file in Git is never proof it is installed.

---

## 15. Execution protocol and authorization discipline

Before consequential work, classify the task:

- `ANSWER`
- `READ-ONLY INSPECTION`
- `LOCAL ARTIFACT`
- `REPOSITORY MUTATION`
- `EXTERNAL MUTATION`
- `RELEASE`

Maintain one bounded authorized semantic outcome. Relevant work outside that boundary is not automatically authorized.

### Before mutation

Establish:

- exact current target
- exact allowed files/objects
- forbidden targets/actions
- current branch/HEAD when mutable source is involved
- governing authority and canonical owner
- expected semantic diff/state
- verification method
- stop conditions

### During mutation

- change only authorized targets
- do not bundle unrelated cleanup
- do not create a second independent fix
- correct mechanically necessary in-scope mistakes without unnecessary approval loops
- stop on true material drift, new canonical-owner choice, new architecture choice, new external consequence, or missing required proof

### After mutation

- read back the complete result
- inspect the complete diff/state change
- verify no forbidden target changed
- run the required focused and broader checks for the exact final state
- reconcile affected status/documentation only when that reconciliation is inside the authorized outcome
- report exact evidence and limitations

After true drift, do not automatically reset, rebase, restore, roll back, compensate, or switch strategy unless recovery itself is authorized.

---

## 16. Document integrity and publication discipline

For governing/documentation work:

- inspect the complete relevant governing set, not only the last reported defect
- build one consolidated stale/contradiction ledger before editing when multiple issues are expected
- preserve document-purpose boundaries
- perform an independent reverse audit from binding decisions back into the deliverable
- mechanically verify headings, references, code fences, file integrity, hashes/counts where required
- do not call a draft `FINAL`, `APPROVED`, `VERIFIED`, `READY`, or `CLOSED` without the required evidence

`Requirements.md`, `structure.md`, `Database.md`, and `Master Plan.md` have distinct purposes. Do not collapse them into one uncontrolled document.

Publication, commit, push, PR, merge, deployment, migration, or production mutation remains separate from local drafting/review and requires explicit authorization.

---

## 17. Mandatory architecture-conformance checks

For architecture or implementation design, independently verify:

1. no monolithic legacy feature/service recreation
2. explicit frontend feature ownership
3. one canonical backend writer per D01–D28 business invariant
4. explicit cross-domain coordination
5. historical user-facing behavior preserved unless superseded
6. Trail adoption/remix and Tour reuse relationships preserved
7. reusable location/camera/microphone permission lifecycle
8. one Web/Telegram product with server-validated identity
9. media, messaging, live rooms, notifications, and originating business state remain separate owners
10. no mocked/fabricated business-state authority
11. equal Home / Explore / Share / Vibe / Purse navigation and accessible responsive composition
12. no settled Product Owner decision is silently reopened

A second pass must begin from governing requirements/decisions and ask what the draft omitted, grouped incorrectly, duplicated, or invented.

---

## 18. Acceptance and reporting

For **Master Plan slices, domains, and journeys**, use only the approved status vocabulary:

- `PLANNED`
- `READY`
- `IN PROGRESS`
- `IMPLEMENTED`
- `VERIFIED`
- `STAGING ACCEPTED`
- `PRODUCTION ACCEPTED`
- `BLOCKED`

For **bounded agent/task execution disposition only**, where useful, use:

- `CLOSED`
- `CONDITIONALLY ACCEPTED`
- `IMPLEMENTED / ACCEPTANCE OPEN`
- `BLOCKED`
- `NOT STARTED`

Task-level disposition labels must never replace, reinterpret, or be reported as the Master Plan status of a slice, domain, or journey. Do not use `done`, `fixed`, `safe`, `merged`, and `closed` interchangeably.

Before reporting task-level `CLOSED`, establish that all applicable mandatory acceptance evidence exists for the exact authorized scope.

At task end report, as applicable:

- exact source/artifact state inspected
- governing sources used
- exact targets changed
- complete-diff/state verification
- tests/checks actually run
- runtime/database/deployment proof only if directly verified
- Product Owner decisions applied
- remaining genuine unknowns/blockers
- exact next permissible action

Never claim a commit, push, PR, merge, migration, deployment, database change, or production result without direct corresponding evidence.

---

## 19. Final non-negotiable invariant

Preserve the product. Rebuild the engineering. Respect established decisions. Keep one canonical owner for every business fact. Keep historical/reference material in its proper place. Never convert missing proof into invented truth, and never convert a relevant task into authorization for an unrelated mutation.
