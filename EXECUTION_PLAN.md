# VibeQuestGuardians — Living Agent Execution Plan

> **For agentic workers:** Read `AGENTS.md` first. Then read this plan and the governing documents listed below. Use this document as the operational continuation guide, not as permission to make unbounded changes. Implement only an explicitly authorized milestone and update the progress/evidence sections before handoff.

**Goal:** Build the complete VibeQuestGuardians product from the approved documentation baseline into a real, production-ready system with truthful behavior, clean domain ownership, durable persistence, secure runtime boundaries, staging acceptance, and release evidence.

**Architecture:** The product uses separate Client, API, and Worker runtime boundaries. The API may initially host isolated domain modules in one deployable, but no domain may become a god service, universal repository, second writer, or monolithic script. PostgreSQL + PostGIS is the intended authoritative transactional/spatial platform; migrations, readiness, exact serving identity, and isolated staging are release requirements.

**Tech Stack:** PostgreSQL + PostGIS are directed. No agent may select or add an exact library, provider, package manager, runtime version, CI/CD system, verification environment, or deployment platform from preference, tool availability, or historical material. The Product Owner must explicitly approve each exact choice before it enters the repository; an agent may recommend and document evidence, but may not make the choice. Web and Telegram are one product; Telegram is a host adapter.

**Spec:** `Master Plan.md`, `Requirements.md`, `structure.md`, `Database.md`, and `AGENTS.md`.

---

## 0. How a new agent starts

A new agent must complete this sequence before proposing or editing anything:

- [ ] Read `AGENTS.md`.
- [ ] Read this entire plan.
- [ ] Read the relevant sections of `Master Plan.md`, `Requirements.md`, `structure.md`, and `Database.md`.
- [ ] Confirm repository `funmarket/VibeQuestGuardians`, branch `vibefoundation`, and current HEAD from GitHub.
- [ ] Inspect the current tree and relevant source. Do not assume a file or runtime exists because this plan names it.
- [ ] Search the decision log, surprise log, progress table, and evidence ledger for the selected milestone.
- [ ] Confirm explicit authorization for the selected milestone and exact target files/resources.
- [ ] State the planned semantic outcome, verification method, and stop conditions before editing.

If any required fact is unavailable, report `UNKNOWN` or `BLOCKED`. Do not create a mock or placeholder to continue.

## 1. Global constraints

These constraints apply to every milestone:

1. **No fake behavior:** no mock backend, fake API, fake users, seeded production interactions, fabricated coordinates, simulated camera proof, canned messages, client-minted VQ, fake bookings, fake tickets, fake payments, fake notifications, fake confidence, or optimistic success after failed persistence.
2. **No placeholder product features:** do not create a route, screen, handler, repository, table, or response that presents an unimplemented business capability as available.
3. **No partial business implementation:** a business feature is not merged or reported as available until its authorized slice has complete owner-domain persistence, authorization, failure behavior, tests, and required runtime evidence.
4. **S01 is engineering substrate only:** S01 may establish real infrastructure, but it must not pretend to complete a business domain.
5. **One canonical writer:** every business fact and invariant has exactly one D01–D28 owner.
6. **No foreign writes:** cross-domain work uses explicit commands, capability ports, events, or authorized projections. A consumer never writes another domain's canonical records.
7. **Explicit composition:** composition roots wire concrete adapters. Domain modules do not import foreign infrastructure.
8. **Separate runtimes:** Client, API, and Worker are independently runnable boundaries. Telegram is not a second backend.
9. **Migration authority:** one designated release/pre-deploy authority runs migrations once per target database. API and Worker replicas never race to migrate.
10. **Truthful capability states:** location, camera, microphone, notification, storage, payment, and provider failures are exposed honestly.
11. **No silent policy changes:** the three open policy gates remain open until the Product Owner decides them: Secret bounty proximity, Validate approach-notification radius, and VibeFlash scheduling/automation.
12. **No historical transplant:** old VibeQuest, Hooma, old Railway state, and Gemini files are reference evidence only.
13. **No completion by artifact:** a source file, migration, route, green CI, deployment record, or demo is not acceptance by itself.
14. **No unrelated cleanup:** change only the authorized scope.

## 2. Authority and status vocabulary

### 2.1 Authority order

Use this order when sources disagree:

1. latest explicit Product Owner decision;
2. `Master Plan.md`;
3. `Requirements.md`;
4. `structure.md`;
5. `Database.md`;
6. historical/reference/think-tank material.

`AGENTS.md` and this plan define execution discipline. They do not silently override product policy.

### 2.2 Milestone status

Use only:

`PLANNED`, `READY`, `IN PROGRESS`, `IMPLEMENTED`, `VERIFIED`, `STAGING ACCEPTED`, `PRODUCTION ACCEPTED`, `BLOCKED`.

Meaning:

- `PLANNED`: defined but dependencies or authorization are not satisfied.
- `READY`: dependencies, scope, owner and acceptance contract are known.
- `IN PROGRESS`: authorized work is actively changing source.
- `IMPLEMENTED`: code/persistence exists, but required verification is incomplete.
- `VERIFIED`: required automated/source evidence passes.
- `STAGING ACCEPTED`: integrated production-shaped runtime evidence passes.
- `PRODUCTION ACCEPTED`: final release gates and post-release evidence pass.
- `BLOCKED`: a required authority, dependency, proof, or external state prevents safe progress.

Do not use `done`, `complete`, `fixed`, `safe`, or `merged` as substitutes for these statuses.

## 2.3 Mandatory engineering gates

These gates are execution controls. They apply to every milestone and override schedule pressure or an agent's desire to begin implementation. They do not change product policy or authorize a mutation by themselves.

### A. Pre-implementation gate

Before any source change, every milestone must include a committed or recorded implementation packet containing:

```yaml
Milestone:
Authorized scope:
Non-goals:
Exact repository/ref/HEAD:
Files allowed to change:
Files forbidden to change:
Domain owner:
Canonical writer:
Interfaces/contracts:
Behavior matrix:
- success
- empty state
- invalid input
- dependency failure
- duplicate request
- concurrent request
- retry
- timeout
- cleanup/shutdown

Tests to write first:
Expected red result:
Implementation strategy:
Migration impact:
Runtime/deployment impact:
Verification commands:
Runtime verification:
Stop conditions:
Open decisions:
```

No implementation commit is allowed until this packet exists. The packet must identify the current source state and the smallest intended change; it is not permission for unrelated cleanup, deployment, migration execution, or policy invention.

### B. Test-first acceptance gate

For every acceptance item, record:

```text
Requirement
Test name/path
Expected failure before implementation
Implementation commit
Green result
Full-suite result
Runtime evidence
Remaining limitations
```

A feature cannot move from `READY` to `IMPLEMENTED` unless its acceptance tests exist. For behavior-changing work, the target test must be recorded as failing before the production implementation is added. CI confirms evidence; it is not the first meaningful verifier.

### C. Readability gate

Production source must be readable and reviewable. Compressed one-line source, generated application source, opaque code generation, and bulk source synthesis are prohibited unless explicitly authorized, documented, and reviewed.

### D. Verification-gate protection

An agent may not narrow, remove, skip, rename, or weaken a verification command to obtain a green result. Any required change to a gate requires Product Owner approval, a decision-log entry, and a replacement gate proving equal or stronger coverage.

## 3. Current project state

| Item | Current verified state | Evidence/limitation |
|---|---|---|
| Repository | `funmarket/VibeQuestGuardians` | Verify current HEAD before every mutation |
| Working branch | `vibefoundation` | Integration branch; not proof of release |
| Product stage | `S01-1 CONFIGURATION IMPLEMENTED; S01 INCOMPLETE` | Node 24 workspace/toolchain configuration is published; application not accepted |
| Client | S01-1 manifest/config boundary only | No Client runtime or UI behavior was introduced |
| API | S01-1 manifest/config boundary only | No API runtime or HTTP behavior was introduced |
| Worker | S01-1 manifest/config boundary only | No Worker runtime or job behavior was introduced |
| Physical database | Not verified | `Database.md` is conceptual, not installed state |
| Migrations | Not verified | A migration file is not installation evidence |
| Staging | Not accepted | Must be isolated, persistent, production-shaped |
| Production | Not accepted | Requires S18 gates and explicit release authorization |
| Gemini reference | External local reference only | UX/interaction evidence; no implementation authority |
| Historical repositories | Reference only | No blind code/schema/infrastructure transplant |

**Current next permissible action:** complete this S01-1 evidence reconciliation, then authorize the next bounded S01 slice separately. No source behavior, migration, CI, Railway, runtime, database, deployment, or product behavior beyond the published S01-1 configuration is authorized by this status entry.

## 4. Progress board

Update this table only with evidence. Add commit SHA, test/run links, or runtime evidence to the Evidence column; do not write “done” without proof.

| Milestone | Name | Status | Dependencies | Owner/agent | Last update | Evidence |
|---|---|---|---|---|---|---|
| S01 | Engineering substrate, CI, migration, readiness, staging path | PLANNED | Approved governing set; S01-1 configuration published; remaining S01 slices separately authorized | Platform tooling | 2026-11-02 | Source: `e78ffb43425c951360b4670cd128c141f8025c55` added exactly 20 S01-1 configuration files; prior execution record reports positive/negative checks, but raw logs are not persisted in the repository. No API/Worker runtime, database, migration, CI, or staging evidence. |
| S02 | D01 identity, authorization, shell, Web/Telegram host authority | PLANNED | S01 | Unassigned |  |  |
| S03 | D13 media and device capabilities | PLANNED | S01–S02 | Unassigned |  |  |
| S04 | D02 profiles, D03 social graph, D09 business authority | PLANNED | S02–S03 | Unassigned |  |  |
| S05 | D14 messaging, D23 notifications, D21 report/case core | PLANNED | S02; S03 where media/voice attachments are exercised | Unassigned |  |  |
| S06 | D20 VQ ledger | PLANNED | S01–S02 | Unassigned |  |  |
| S07 | D04 geo/presence and provider adapters | PLANNED | S01 PostgreSQL/PostGIS; S02; S04; S05 | Unassigned |  |  |
| S08 | D05 Places, validation, check-in, confidence | PLANNED | S03, S06, S07 | Unassigned |  |  |
| S09 | D06 Trails | PLANNED | S03; S04; S07; S08 | Unassigned |  |  |
| S10 | D07 Guardians, D08 Tours, D19 recognition, D22 Handshakes, D25 entitlements | PLANNED | S04; S05; S06; S09 | Unassigned |  |  |
| S11 | D12 content, D16 communities, D15 live rooms | PLANNED | S04; S05 | Unassigned |  |  |
| S12 | D17 matching, D18 challenges, confirmed Vibes | PLANNED | S04; S05; S11 | Unassigned |  |  |
| S13 | D10 activities, D11 events, D28 ticketing | PLANNED | S03; S04; S05; S08 | Unassigned |  |  |
| S14 | D26 Marketplace, D27 payment boundary, Purse, reviews | PLANNED | S05, S06, S10 | Unassigned |  |  |
| S15 | Admin completeness, Trust & Safety, business, advertising, operations | PLANNED | S02; S04; S05; S06; S08; S10; S11; S12; S13; S14 | Unassigned |  |  |
| S16 | Full Home/Explore/Share/Vibe/Purse composition | PLANNED | S07; S08; S09; S10; S11; S12; S13; S14 where Purse/Marketplace links are consumed; S15 | Unassigned |  |  |
| S17 | Web/Telegram parity and device acceptance | PLANNED | S02–S16 | Unassigned |  |  |
| S18 | Production readiness, controlled release, post-deploy acceptance | PLANNED | S01–S17 staging accepted | Unassigned |  |  |

## 4A. Platform preferences and accessibility contract

This contract is a prerequisite for S01/S02 client work. It prevents language, theme, text sizing, and accessibility behavior from being improvised separately by screens or host integrations.

### Ownership

- D02 owns authenticated user preferences, localization choice, accessibility settings and privacy-visible preference state.
- Client platform adapters observe browser/OS capabilities and Telegram host signals. They do not become business authorities.
- The shared Client design system owns tokens, semantic color roles, typography scales, directionality, safe-area handling and accessible component behavior.
- The API persists explicit user overrides through D02 contracts. Local browser storage may cache non-authoritative UI state only; it must never be the canonical preference or identity store.
- Telegram is a host adapter. It shares the same D01 identity and D02 preferences as Web and does not create a second settings authority.

### Preference precedence

For each supported preference, resolve in this order:

1. explicit authenticated user override;
2. Telegram host preference or theme signal, when available;
3. browser/OS system preference;
4. product default.

The UI must show the effective source where that distinction matters and must not silently overwrite an explicit user choice when the host or system changes.

### Required platform behavior

- **Language:** detect the browser/OS locale and Telegram language signal where available; support the approved EN/FR/AR experience and RTL directionality; allow an explicit user choice; update labels, formatting and direction without duplicating domain state.
- **Theme:** support system/default, light and dark behavior; consume Telegram theme parameters where available; use browser/OS color-scheme preference otherwise; allow an explicit user override; use semantic tokens rather than screen-specific hard-coded colors.
- **Text size:** support system-default text sizing and an explicit accessible text-size adjustment; use rem/token-based typography and layout that reflows without clipping or hiding controls; verify modal, navigation, form, map, chat and Admin surfaces at enlarged sizes.
- **Accessibility:** preserve keyboard/focus behavior on Web, screen-reader names/roles, visible focus, contrast, reduced-motion behavior, touch target sizing, safe areas, and truthful disabled/loading/error states. Telegram host limitations must be surfaced rather than simulated away.
- **Host consistency:** Web and Telegram may differ in capability availability, but they must resolve the same backend identity, preference model and business state. Host-specific presentation must remain in adapters.
- **Settings:** settings changes must have explicit loading/saved/failed states. A failed save must not appear successful. A user override must remain after reload and after switching between Web and Telegram when the same account is used.

### Acceptance evidence

Before S02 can reach VERIFIED, shell/host-adapter tests and applicable acceptance evidence must demonstrate (without claiming durable D02 preference persistence):

- browser system locale detection and explicit language override;
- EN/FR/AR rendering and RTL layout where applicable;
- browser system light/dark preference and explicit theme override;
- Telegram host theme/language signals through the host adapter, with a truthful unavailable path;
- system-default text sizing and explicit larger text settings without clipping or inaccessible controls;
- correct contract and UI states for explicit authenticated preferences, with durable save/reload and same-account Web/Telegram persistence accepted under S04 rather than S02;
- denial/failure handling when preference persistence is unavailable;
- no localStorage/Firebase/Telegram host value is used as the canonical account preference;
- no product business state is fabricated to demonstrate a preference.

**Preference sequencing (Master Plan):** S01 establishes interfaces, semantic tokens, RTL/text-scale foundations, host-adapter seams, and an accessibility test harness without owning D02 data. S02 boots the D01 shell with truthful browser/OS and Telegram host defaults and no canonical D02 writes or durable authenticated overrides. S04 implements and verifies D02-owned persisted profile/preferences/privacy/localization/accessibility overrides, including save/failure, reload, and same-account Web/Telegram consistency. S17 completes cross-host, EN/FR/AR, RTL, text scaling, responsiveness, and accessibility parity. No earlier shell behavior is evidence of S04/S17 acceptance.

## 5. Milestone contract

Each milestone is a complete, bounded deliverable. A milestone may be split into independently reviewable tasks, but no task may create fake business behavior or claim a domain is available before the milestone gate passes.

### S01 — Real engineering substrate

**Purpose:** establish the real foundation without implementing a partial product. Include the shared design-token system, platform-preference interfaces, Web/Telegram host-adapter seams, and accessibility test harness; do not present D02 preference persistence as complete.

**Must produce:**

- separate Client, API and Worker runtimes;
- shared typed contracts and test harness;
- structured configuration and secret validation;
- PostgreSQL/PostGIS connection and extension gate;
- one migration mechanism, lock, checksum ledger and pre-deploy authority;
- isolated test database;
- CI architecture, formatting, lint, typecheck, build and test gates;
- liveness and dependency-aware readiness;
- exact repository/ref/commit/build/serving identity;
- isolated persistent production-shaped staging path.

**Must not produce:** business-domain data, fake endpoints, mock responses, fake accounts, placeholder feature screens, simulated auth, simulated location, speculative all-domain schema, or partial business flows.

**Acceptance evidence:**

- CI passes from the exact commit;
- API, Worker and Client build independently;
- migration ledger and checksum behavior are tested;
- API and Worker do not race to migrate;
- readiness fails truthfully when required dependencies are unavailable;
- liveness is separate from readiness;
- staging shows exact serving revision and installed migration state;
- no business domain is reported above `PLANNED`.

### S02 — Identity, authorization, shell and host authority

**Must produce:** real D01 identity/session/recovery, Telegram launch verification and canonical linking, guest/protected behavior, five equal root destinations, permanent scoped Admin authorization shell, and the D02 platform-preference/accessibility behavior defined in section 4A.

**Acceptance:** real test identities share one backend identity across Web and Telegram; unauthorized actions fail; no UI-only privilege; no fake session/token.

### S03 — Media and device capabilities

**Must produce:** D13 media lifecycle and real camera/microphone/location capability adapters with permission, denial, blocked, unavailable, cleanup and retention states.

**Acceptance:** real supported-device capture/upload/cleanup flows work; failure never creates synthetic proof.

### S04 — Profiles, social graph and business authority

**Must produce:** real D02 profile/preferences/privacy, D03 follow/block, and D09 organization/operator authority.

**Acceptance:** two real staging principals exercise authorized and denied flows; no relationship inferred from display similarity.

### S05 — Messaging, notifications and Trust & Safety core

**Must produce:** D14 message persistence and source-context authorization, D23 inbox/delivery/retry/deduplication, and D21 report/case intake.

**Acceptance:** messages, reads, reconnects, retries, notification delivery and reports are durable; a report does not automatically punish; unsupported source contexts are denied rather than fabricated.

### S06 — VQ ledger

**Must produce:** D20 immutable postings, versioned rules, grants/transfers only where authorized, idempotency and compensating corrections.

**Acceptance:** concurrent posting tests prevent double credit/spend; ledger is the only balance writer; no client balance authority or unauthorized reward rule.

### S07 — Geo and presence

**Must produce:** D04 consented device evidence, freshness, spatial operations, Find Hub and replaceable external-provider adapters.

**Acceptance:** real device location is distinguished from denied/unavailable/manual discovery context; no fallback coordinate is accepted as proof; privacy and retention are tested.

### S08 — Places and confidence

**Must produce:** D05 Place truth, observations, Validate, check-in, confidence policy versioning and provenance.

**Acceptance:** 5 m check-in rule, applicable 23 km discovery scope, policy versioning and historical observation immutability are directly tested.

### S09 — Trails

**Must produce:** D06 authoring, ordered stops, publication, adoption/remix, attribution, lineage, navigation and offline behavior.

**Acceptance:** author and consumer journeys persist real data and preserve lineage; no copied Trail becomes an unowned duplicate.

### S10 — Guardians, Tours, recognition, Handshakes and entitlements

**Must produce:** D07/D08 eligibility and engagement behavior, D19 review ownership, D22 qualifying Handshake and D25 entitlements.

**Acceptance:** real provider acceptance triggers exactly one idempotent Handshake; lifecycle is ACTIVE→EXPIRED after exactly 24 hours; no cancellation state; D22 does not own review text.

### S11 — Content, Communities and Live Rooms

**Must produce:** D12 content, D16 membership/roles/invitations and D15 room state with D21 moderation contracts.

**Acceptance:** visibility, membership, privacy, moderation and room authorization are durable and tested.

### S12 — Matching and Challenges

**Must produce:** D17 matching/Pulls/Vibes and D18 VibeCheck/VibeFlash.

**Acceptance:** VibeCheck is server-authoritative 180 seconds; VibeFlash is separate at 33 seconds; no geographic participation gate; only qualifying reciprocal completion establishes exactly one confirmed Vibe.

### S13 — Activities, Events and Ticketing

**Must produce:** D10 activities, D11 events/RSVP and independent D28 tickets.

**Acceptance:** event and ticket state remain separate; issuance, validation, admission and repeat-scan denial are authoritative.

### S14 — Marketplace, Purse and payment boundary

**Must produce:** D26 listings/deals/reviews, D20 direct VQ behavior, D27 explicit future/authorized real-money boundary and Purse composition.

**Acceptance:** no default escrow, commission, delivery guarantee, authenticity guarantee, automatic refund or fiat-settlement claim; D26 owns Marketplace review content.

### S15 — Admin and operational completeness

**Must produce:** scoped Control Room panels, D21 sanctions/appeals, D24 advertising, owner-domain commands, audit and read-only operations views.

**Acceptance:** privileged actions are scoped, auditable and owner-routed; Admin never writes business facts directly.

### S16 — Destination composition

**Must produce:** complete compositions for Home, Explore, Share, Vibe and Purse from accepted feature contracts.

**Acceptance:** no page-level business monolith, duplicate state, hidden fake data or incomplete feature presented as available.

### S17 — Web/Telegram parity

**Must produce:** shared identity/data behavior, host adaptation, responsive behavior, RTL/localization, safe areas and real device acceptance.

**Acceptance:** representative browser and Telegram flows prove parity and truthful capability states.

### S18 — Production readiness and controlled release

**Must produce:** security, backups/restore, observability, performance evidence, migration compatibility, rollback/forward-fix authority, exact artifact identity, production deployment and post-deploy evidence.

**Acceptance:** all launch-scope domains are `STAGING ACCEPTED`; exact desired revision serves; installed schema/migrations/readiness and representative authorized journeys are verified; explicit production acceptance is recorded.

## 6. Task template

Copy this template for each bounded task under the relevant milestone.

### Task [ID]: [short outcome]

**Milestone:** [S01–S18]  
**Status:** PLANNED  
**Agent:** [name/session]  
**Authorization:** [exact user/PO authorization reference]  
**Branch/HEAD inspected:** [exact SHA]  
**Owner domain:** [D01–D28 or platform]  
**Canonical writer:** [exact owner]  
**Scope:** [exact files/packages/runtime objects allowed]  
**Forbidden:** [files, domains, actions, external mutations not allowed]  
**Dependencies:** [milestones/tasks and why]  
**Expected semantic outcome:** [one sentence]

**Files:**

- Create: [exact path]
- Modify: [exact path and responsibility]
- Test: [exact path]
- Do not change: [explicit paths]

**Interfaces:**

- Consumes: [exact existing contracts/signatures]
- Produces: [exact contracts/signatures/events/read models]
- Ownership boundary: [what this task owns and does not own]

**Acceptance criteria:**

- [ ] authoritative persistence/state transition exists;
- [ ] authorization/privacy behavior is tested;
- [ ] failure and retry behavior is truthful;
- [ ] idempotency/concurrency behavior is tested;
- [ ] relevant Client/API/Worker boundary is verified;
- [ ] migrations are installed and checked where applicable;
- [ ] staging/runtime evidence is recorded where applicable;
- [ ] no mock, fake, placeholder, seeded authority or partial feature was introduced.

**Verification commands/checks:**

- Command: `[exact command]`
- Expected: `[exact passing result]`
- Runtime probe: `[exact URL/action/query]`
- Expected runtime evidence: `[observable result]`

**Handoff:** [one precise next permissible action]

## 7. Progress update template

Every agent must update the relevant task and append a handoff entry:

```markdown
### Progress update — [UTC timestamp]

- Task:
- Status:
- Repository/branch/HEAD:
- Changed files:
- Owner/canonical writer:
- Implemented:
- Verified:
- Runtime/database/deployment evidence:
- Tests/checks actually run:
- Failures/unknowns:
- Surprises:
- Next permissible action:
- No-fake confirmation: no mock, fake backend, placeholder authority, or partial business capability was presented as available.
```

## 8. Decision log

Only record decisions with evidence or explicit Product Owner direction. Do not turn an agent preference into a decision.

| ID | Date | Decision | Authority/source | Affected milestones | Consequence | Status |
|---|---|---|---|---|---|---|
| DEC-001 | 2026-11-01 | Use separate Client/API/Worker runtime boundaries with explicit domain ownership and composition roots. | Product Owner direction; current `Master Plan.md`; `structure.md` | S01–S18 | No monolithic script/god service; API modules remain owner-isolated. | LOCKED |
| DEC-002 | 2026-11-01 | Gemini application is UX/interaction reference only; no blind code, backend, schema, auth, payment, or deployment adoption. | Product Owner direction; `AGENTS.md`; this plan | All | Extract/map/classify before rebuilding. | LOCKED |
| DEC-003 | 2026-11-01 | No fake placeholders, mocks, fake backend, or partial business functionality presented as available. | Product Owner direction; `AGENTS.md` | All | Incomplete capability remains unavailable, not simulated. | LOCKED |
| DEC-004 | 2026-11-01 | S01 establishes substrate only and completes no business domain. | `Master Plan.md`, S01 contract | S01 | First implementation authorization must name S01. | LOCKED |
| DEC-005 | 2026-11-01 | PostgreSQL + PostGIS is intended authoritative transactional/spatial persistence; one migration authority controls installation. | `Master Plan.md`, `Database.md` | S01 onward | No client/localStorage/Firebase authority. | LOCKED |
| DEC-006 | 2026-11-01 | Language, theme, text-size, accessibility and host preference behavior use D02 ownership with system/Telegram detection and explicit-user override precedence. | Product Owner direction; Master Plan S02/S04/S17; this plan section 4A | S01–S02, S04, S17 | Shared tokens/adapters in S01, shell/host defaults in S02, D02 durable preferences in S04, final parity in S17. | LOCKED |

When adding a decision, use:

| DEC-[NNN] | [UTC date] | [one precise decision] | [source/evidence] | [milestones] | [implementation consequence] | PROPOSED/OPEN/LOCKED/REVISED |

## 9. Surprise and contradiction log

A surprise is an observed fact that changes the plan, reveals a source contradiction, or invalidates an assumption. Record it before changing strategy.

| ID | Date | Observed evidence | Impact | Classification | Action/owner | Status |
|---|---|---|---|---|---|---|
| SUR-001 | 2026-11-01 | Current VibeQuestGuardians branch is a governing-document baseline rather than an implemented application. | No feature implementation can be assumed; S01 must establish substrate. | SOURCE-OBSERVED | Reconcile through S01 authorization. | OPEN |
| SUR-002 | 2026-11-01 | Gemini reference contains LocalStorage, Firebase/Firestore, Solana, seeded state, fallback coordinates, mock providers and simulated camera behavior. | Useful for UX only; unsafe as implementation. | HISTORICAL-OBSERVED | Use the Gemini reference protocol; reject authority code. | RECORDED |
| SUR-003 | 2026-11-01 | Historical reference projects contained useful domain/UX patterns but failed to prove production runtime acceptance. | Runtime claims require direct staging evidence. | HISTORICAL-OBSERVED | Apply exact revision/migration/readiness gates. | RECORDED |

Use:

| SUR-[NNN] | [UTC date] | [observed fact and source] | [milestone impact] | UNKNOWN/SOURCE-OBSERVED/CONTRADICTED | [next action] | OPEN/RESOLVED |

## 10. Gemini UX extraction register

Do not import Gemini code. Record extracted behavior here or in a linked UX-parity artifact.

| Ref | Source file | User-visible behavior | Proposed owner | Classification | Governing rule | Rebuild/verification requirement | Status |
|---|---|---|---|---|---|---|---|
| GEM-001 | `Shell.tsx` | Five-tab mobile shell and header/modal composition | Client composition; D01–D28 features | ADAPT | Five equal root destinations | Rebuild with real routes/contracts; verify Share is not visually elevated | OPEN |
| GEM-002 | `VibeCheck*.tsx` | One-to-one camera challenge choreography and reveal | D18 + D13 | ADAPT | 180-second server-authoritative VibeCheck | Real camera/media path, server deadline, reciprocal completion tests | OPEN |
| GEM-003 | `VibeFlash*.tsx` | 33-second challenge window and response UI | D18 + D13 | ADAPT | Separate 33-second VibeFlash; no geo gate | Real server window and media lifecycle; no simulated camera | OPEN |
| GEM-004 | `FindHubModal.tsx` | Find Hub map/geofence interaction | D04 + D03 + D23 | ADAPT | Consent, 2-hour retention, truthful device evidence | API/Worker-backed presence; no seeded contacts or mock movement | OPEN |
| GEM-005 | `distance.ts`, `coordinateHelpers.ts` | Pure distance/range calculations | D04/D05 | ADAPT | 5 m check-in and distinct discovery scopes | Independently test formula and server-side use | OPEN |
| GEM-006 | `index (19).ts`, `index (21).ts` | VQ/Handshake domain-shaped source files | D20/D22 | REJECT | Current Database/Requirements rules | Rebuild from approved contracts; reject LocalStorage, seeds, wrong states/rewards | OPEN |

Add rows for additional behavior before implementation. A row marked `REJECT` must include the reason.

## 11. Evidence ledger

Every material claim must point to direct evidence.

| Evidence ID | Claim | Evidence type | Source/path/URL | Revision/time | Verified by | Limitation |
|---|---|---|---|---|---|---|
| E-001 | Governing documents define the approved baseline. | SOURCE-OBSERVED | `Master Plan.md`, `Requirements.md`, `structure.md`, `Database.md` | Current branch HEAD | Documentation audit | Does not prove implementation |
| E-002 | Hooma runtime topology uses separate API/Worker/Web services and readiness/deploy identity patterns. | HISTORICAL-OBSERVED | Hooma reference repository/Railway project | Verified during reference audit | Source/Railway inspection | Reference only; not reusable authority |
| E-003 | Gemini files contain mock/local/seeded/simulated behaviors. | HISTORICAL-OBSERVED | `C:\Users\GrowB\Downloads\geminiapp` | Inspected 2026-11-01 | Read-only source audit | Local reference, not repository source |
| E-004 | S01-1 Node 24 workspace/toolchain configuration was published. | SOURCE-OBSERVED | GitHub commit `e78ffb43425c951360b4670cd128c141f8025c55`; parent `eb6d0c9fab8efe1bd2dd7ad36f5112c9c11d51c2` | Current `vibefoundation` HEAD | GitHub tree/diff inspection | Proves source scope and contents, not command execution or runtime acceptance |
| E-005 | Required S01-1 positive and negative command outcomes were reported. | AGENT-REPORTED | Prior Codex execution record for candidate `e78ffb43425c951360b4670cd128c141f8025c55` | Reported 2026-11-02 | Prior execution record | Raw command logs are not persisted in this repository; do not upgrade to EXECUTION-VERIFIED |
| E-006 | npm reported five moderate audit findings during S01-1 install. | AGENT-REPORTED | Prior Codex npm install output | Reported 2026-11-02 | Prior execution record | Not independently audited or remediated; dependency remediation was out of scope |

Add evidence before changing a milestone status.

## 12. Semantic acceptance checklist

Before marking any milestone `VERIFIED` or higher, perform an independent reverse audit:

- [ ] correct Product Owner policy and authority hierarchy applied;
- [ ] all relevant Requirements behavior mapped to an owner;
- [ ] Database invariants represented without duplicate writers;
- [ ] Structure runtime/domain boundary rules preserved;
- [ ] no legacy/Gemini implementation authority copied;
- [ ] no mock/fake/placeholder/seeded business authority;
- [ ] no partial business feature presented as available;
- [ ] authorization, privacy, denial and failure paths tested;
- [ ] idempotency/concurrency tested where state can repeat;
- [ ] server time used for deadlines/expiry;
- [ ] Worker owns durable asynchronous work;
- [ ] migrations are installed and checksummed in the target environment;
- [ ] liveness and readiness are separate;
- [ ] exact source/build/serving identity is verified;
- [ ] staging evidence is distinct from production acceptance;
- [ ] Web/Telegram parity is verified where applicable;
- [ ] status vocabulary is used correctly;
- [ ] evidence ledger and handoff are updated.

## 13. Agent handoff and continuation

A handoff is valid only when it includes:

- current branch and exact HEAD;
- milestone/task status;
- exact files changed;
- owner and canonical writer;
- tests/checks actually run;
- runtime/database/deployment evidence actually verified;
- open surprises/decisions;
- known failures and unknowns;
- one next permissible action;
- explicit no-fake confirmation.

The next agent must re-read the current branch and independently verify the handoff. No agent may continue solely from a chat summary.

## 14. Stop conditions

Stop and report `BLOCKED` or `UNKNOWN` when:

- current branch or target files drift unexpectedly;
- a required authorization is absent;
- a new Product Owner policy is needed;
- two governing documents materially conflict;
- ownership is ambiguous;
- a foreign-domain write is required;
- database/runtime/deployment evidence cannot be directly inspected;
- an external provider or credential is unavailable;
- the only way to show progress is a mock, placeholder, fake success, or partial business feature.

Do not invent a workaround.

## 15. Change log

| Date | Commit | Change |
|---|---|---|
| 2026-11-01 | Initial publication | Created self-contained execution-control document for S01–S18, agent handoffs, evidence, decisions, surprises and Gemini reference extraction. |
| 2026-11-01 | Platform preferences added | Added D02 ownership, system/Telegram precedence, language/theme/text-size/accessibility behavior and S01/S02 acceptance evidence. |
| 2026-11-01 | `0e8c2d22f9f0fa5952dfb15e51b5c725851a013c` | Added mandatory pre-implementation, test-first, readability, and verification-gate protection controls after the S01 process audit. |
| 2026-11-01 | `fc4011b73a7b7700884d4d30a6dc5b097b8bdacc` | Recorded Product Owner-approved Hooma-aligned S01-1 workspace direction; source, migration, CI, Railway, and runtime work remain unimplemented. |
| 2026-11-02 | `e78ffb43425c951360b4670cd128c141f8025c55` | Published S01-1 Node 24 workspace/toolchain configuration; application runtimes and broader S01 acceptance remain open. |

Append every future plan change with date, commit SHA and semantic reason.

## 16. Self-review before accepting plan changes

Before accepting any edit to this plan, verify:

- [ ] the change has a clear owner and authority;
- [ ] no product policy was invented;
- [ ] no existing milestone dependency was silently changed;
- [ ] the progress board remains internally consistent;
- [ ] acceptance criteria remain directly verifiable;
- [ ] decision and surprise logs were reconciled;
- [ ] no fake/placeholder/partial behavior was introduced;
- [ ] the complete file was read back from GitHub;
- [ ] the final commit SHA is recorded.

**Project completion condition:** the project is complete only when the Master Plan S18 production-readiness contract is directly evidenced. This plan never authorizes implementation, deployment, migration, release, or production mutation by itself.



## Current-state reconciliation and S02-1 handoff — 2026-11-02

This section supersedes earlier current-state entries that say S01 has no API/Worker runtime, physical database, migrations, or staging evidence. Those entries are historical baseline records; the current verified state is below.

### Exact checkpoint

- Repository: `funmarket/VibeQuestGuardians`
- Branch: `vibefoundation`
- Documentation checkpoint before this reconciliation: `70b1c1f35747d0cea08ab378e055be12655f6cf3`
- Runtime source commit: `9d91ec12488e1741c9cd637b308e5c94dcfa4d1f`
- Client correction commit: `f985dc9a180b6fddd23b0c508250844701512b9b`
- Railway project: `VibeQuest` / `6aed68eb-cb62-4d2e-8606-900b57b6c389`
- Railway staging environment: `staging` / `fd6553dc-5a72-4b28-b0ae-ad1d938dd468`

### Evidence ledger

| Acceptance item | Evidence | Result | Limitation |
|---|---|---|---|
| Persistent PostgreSQL/PostGIS staging | Railway `staging-postgis` deployment and persistent volume | VERIFIED | Business schema remains bounded to the implemented foundation |
| Migration authority and ledger | API pre-deploy migration log: target `vibequest_staging`, PostGIS `3.5.2`, ledger count `1` | VERIFIED | Full S01 migration safety matrix remains required before S01 final acceptance |
| API HTTP runtime | Railway API deployment plus live `/health/live`, `/health/ready`, and `/health/identity` checks | VERIFIED | Business endpoints are not implemented by S01 |
| Worker runtime | Successful Railway Worker deployment and health evidence | VERIFIED | Full business-job and shutdown acceptance remains required |
| Client runtime | Successful Railway Client deployment and live foundation page | VERIFIED | Product routes/authenticated behavior remain future milestones |
| Production isolation | Production environment still contains only existing Postgres | VERIFIED | Production application acceptance has not begun |
| Redis | No VibeQuest Redis service or consumer in current source | NOT IMPLEMENTED | Must wait for a real queue/cache/lease contract and tests |
| Telegram | No VibeQuest Telegram adapter/runtime in current source | NOT IMPLEMENTED | S02 host contract is next; no bot deployment is authorized |
| Media | No VibeQuest object-storage adapter or media runtime in current source | NOT IMPLEMENTED | S03/D13 contract is required before provisioning as integrated |

### Reconciled S01 status

S01 is **IMPLEMENTED and partially VERIFIED at staging runtime** for the PostgreSQL/PostGIS, API, Worker, and Client substrate. S01 is not **PRODUCTION ACCEPTED**. The project must not claim that Redis, Telegram, media, business domains, or authenticated product behavior are complete.

### Next authorized slice: S02-1

The next bounded slice is D01 Identity and Web/Telegram Host Contract Foundation. It may define and test canonical principals, Web host context, Telegram host context, session/revocation boundaries, and fail-closed verification semantics. It must not add Redis, media storage, Telegram deployment, provider credentials, production resources, or business-domain behavior.

Before S02-1 source changes, the agent must record its implementation packet, write and run red acceptance tests, implement the smallest source change, run focused and full checks, and update this evidence ledger at the resulting branch HEAD.

### Documentation and infrastructure rule

A Railway service, environment variable, successful container, or provider deployment is not application integration evidence. Redis, media, and Telegram may only move from PLANNED to IMPLEMENTED after the owning source contract, actual consumer, secrets/reference wiring, negative tests, cleanup/shutdown behavior, and live staging verification all exist.

## S02-1 implementation packet — D01 identity and Web/Telegram host contracts

### Authorized scope

Implement one contract-only vertical slice for D01:

- canonical authenticated principal validation;
- Web and Telegram host-context assertion contracts;
- fail-closed session state validation;
- fail-closed capability authorization;
- replay-guard and duplicate-provider-link boundaries;
- focused tests proving the contracts and failure semantics.

### Exact target and checkpoint

- Repository: `funmarket/VibeQuestGuardians`
- Branch: `vibefoundation`
- Pre-mutation HEAD: `034e54ba5f96f85be7dcb2914d3f7823150e22ab`

### Files allowed to change

- `EXECUTION_PLAN.md`
- `package.json`
- `packages/contracts/src/identity-host.ts`
- `packages/testing/src/identity-host.test.ts`

No other source, test, configuration, dependency, database, Railway, or production files are authorized.

### Owner and canonical writer

- Domain owner: D01 Identity and Authorization.
- Canonical writer: future D01 identity/session application service; this slice writes no database state and does not introduce a competing writer.
- Web and Telegram are host adapters only. They resolve to the same canonical principal shape.

### Interfaces and failure semantics

- `CanonicalPrincipal`: authenticated account/session identity with host metadata and explicit capabilities.
- `HostContextAssertion`: verified Web session or verified Telegram init-data assertion; unverified Telegram data is never accepted as identity.
- `ReplayGuard`: interface boundary only; no Redis or in-memory production authority is added.
- `ProviderLinkRegistry`: interface boundary only; duplicate linking fails closed.
- Missing, malformed, unverified, expired, revoked, replayed, duplicate, and unauthorized contexts throw typed identity errors.
- Client-provided identity fields are input only and cannot become canonical without a verified assertion.

### Tests to write first

- valid canonical principal is accepted;
- malformed principal is rejected;
- valid Web assertion resolves through the canonical principal shape;
- Telegram assertion requires verified init-data and does not bypass principal validation;
- missing and invalid Telegram verification fail closed;
- replay guard rejects a repeated assertion key;
- expired and revoked sessions fail closed;
- duplicate provider linking fails closed;
- missing capability fails closed;
- Web and Telegram assertions resolve to the same principal representation;
- no database, Redis, media, or external provider mutation occurs.

### Expected red result

The new focused test file must fail before production implementation because the authorized contract module does not yet exist or does not yet expose the required behavior. A test error caused by the test's own import or assertion syntax must be corrected until the failure is a genuine missing-behavior failure.

### Migration and runtime impact

- No migration.
- No database write.
- No Redis.
- No media storage.
- No Telegram bot token, webhook, polling, or Railway service.
- No production mutation.
- No frontend component or visual change.

### Verification commands

- `npm ci`
- focused identity-host test;
- `npm test`;
- `npm run typecheck`;
- `npm run typecheck:client`;
- `npm run build`;
- `npm run format:check`;
- `npm run lint:config`;
- `git diff --check`;
- final branch/status/diff review.

### Stop conditions

- current owner is not D01;
- a second canonical writer is required;
- implementation requires a database, Redis, media, Telegram deployment, provider secret, or new dependency;
- any unauthorized file changes appear;
- verification requires a different semantic fix or new architecture;
- current branch/HEAD changes with overlapping work.

### Done when

The two authorized source/test files contain the contract-only S02-1 implementation, the focused test was observed red before implementation and green afterward, the full authorized checks pass, the final diff contains no unrelated files, and this packet is updated with exact evidence at the resulting HEAD.

### Next step

NOT AUTHORIZED

## S02-1 execution evidence

### Reconciliation before implementation

- Working checkout: disposable clone of `funmarket/VibeQuestGuardians`, branch `vibefoundation`.
- Pre-mutation remote HEAD: `034e54ba5f96f85be7dcb2914d3f7823150e22ab`.
- No Railway, database, Redis, media, Telegram deployment, provider-secret, or frontend files were changed.
- `package.json` was added to the allowed-file list only to register the new focused test in the existing full-test command.

### Test-first evidence

| Stage | Exact command | Result |
|---|---|---|
| RED | `./node_modules/.bin/tsx.cmd --test packages/testing/src/identity-host.test.ts` before `identity-host.ts` existed | Failed with `ERR_MODULE_NOT_FOUND` for the authorized production contract; exit 1 |
| Focused GREEN | `./node_modules/.bin/tsx.cmd --test packages/testing/src/identity-host.test.ts` | 10 passed, 0 failed |
| Full tests | `C:\Program Files\nodejs\npm.cmd test` | 28 passed, 0 failed |
| Typecheck | `C:\Program Files\nodejs\npm.cmd run typecheck` | Passed |
| Client typecheck | `C:\Program Files\nodejs\npm.cmd run typecheck:client` | Passed |
| Build | `C:\Program Files\nodejs\npm.cmd run build` | Client, API, and Worker builds passed |
| Formatting | `C:\Program Files\nodejs\npm.cmd run format:check` | Passed |
| Config lint | `C:\Program Files\nodejs\npm.cmd run lint:config` | Passed |
| Diff hygiene | `git diff --check` | Passed |

The shell `npm`/`npx` launchers resolve to a missing global npm installation in this environment. Verification used the installed `C:\Program Files\nodejs\npm.cmd` and local `node_modules/.bin` executables; this is an environment/tooling limitation, not a project dependency change.

### Acceptance result

S02-1 is **IMPLEMENTED and VERIFIED for the contract-only slice** in the disposable checkout. The implementation adds no runtime identity provider, database writer, Redis consumer, media adapter, Telegram deployment, or frontend behavior. Staging and production remain unchanged. The branch must be pushed only after the final diff review and commit records this evidence.

## S02-2 pre-implementation packet and blocker — 2026-11-02

### Authorized slice

Implement one database-backed D01 API session boundary consuming the S02-1 identity contracts. The bounded outcome includes server-validated session lookup, expiry/revocation enforcement, current-user resolution, safe HTTP error responses, HTTP-level acceptance tests, and migration safety tests only if a migration is required.

### Authorized targets

- Repository: `funmarket/VibeQuestGuardians`
- Branch: `vibefoundation`
- Preflight HEAD: local checkout reports commit `0f19df5` (full SHA must be re-read before any future execution)
- Local test database requested by Product Owner: `vibequest_m1_test`

No source files were authorized or changed by this preflight. Any future implementation packet must name the exact API, contract, migration, and testing files after database/configuration inspection.

### Owner and canonical writer

- Domain owner: D01 Identity and Authorization.
- Canonical writer: the D01 database-backed identity/session application boundary.
- PostgreSQL/PostGIS remains authoritative. No Redis, browser storage, Telegram service, or in-memory session authority may be introduced.

### Required contract and failure semantics

- Resolve the S02-1 canonical principal only from a server-validated session.
- Reject missing, malformed, unknown, expired, and revoked sessions.
- Return safe versioned error envelopes without exposing tokens, credentials, init data, connection strings, or stack traces.
- Preserve Web/Telegram convergence without deploying Telegram.
- Repeated revoke must be idempotent.
- Database failure must return a truthful dependency failure, never HTTP success.

### Required acceptance and verification

- Actual HTTP boundary tests for every session outcome, current-user secrecy, cross-session mismatch, revoke idempotency, request cleanup, shutdown, and dependency failure.
- If schema changes are required: first apply, rerun, checksum rejection, advisory-lock release, lock contention, rollback, client/pool release, and early-exit cleanup tests.
- Full repository tests, typechecks, build, formatting, config lint, and diff review.

### Preflight evidence and blocker

- `Get-Service postgresql-x64-18` reports the local PostgreSQL service as `Running`.
- No `VQ_TEST_DATABASE_URL`, `VQ_TEST_DATABASE_TARGET`, or equivalent database credentials are configured in the checkout/environment.
- An unauthenticated probe to `postgresql://postgres@127.0.0.1:5432/vibequest_m1_test` failed with `client password must be a string`; no password was guessed or persisted.
- Because the authorized task requires real PostgreSQL-backed behavior and forbids mock/in-memory authority, implementation cannot safely begin without a configured connection to `vibequest_m1_test`.

### Status

`BLOCKED — database connectivity/configuration unavailable before implementation.` No production source, migration, Railway resource, staging variable, or production resource was changed. No commit or push was performed for S02-2.

### Resume condition

Resume only after the user provides or configures the approved local test-database connection through the repository’s expected `VQ_TEST_DATABASE_URL` and `VQ_TEST_DATABASE_TARGET` mechanism, with credentials kept outside source control. Re-read the current HEAD and create a fresh implementation packet before editing source.

### Follow-up preflight result — database reachable, ownership conflict remains

- The approved connection authenticated successfully to `vibequest_m1_test` as `vibequest_app`; PostGIS is installed.
- Read-only catalog inspection found existing public tables `vq_users`, `vq_sessions`, `vq_check_ins`, `vq_places`, `vq_vq_accounts`, `vq_vq_ledger_entries`, and `vq_vq_reward_rules`.
- The database uses a separate `vq_migration_ledger` with prior identity-related migration records, including `002_identity-vq`; the current checkout owns `vq_platform_migration_ledger` and only declares `0001_postgis_extension`.
- The existing identity/session schema and migration history are not represented in the current GitHub source or current migration authority. The user previously identified this database as shared with another local project.
- No write, migration, fixture insertion, session creation, or schema change was performed during this retry.

`STOPPED_ON_DRIFT — the database is reachable, but its existing identity/session tables and migration authority are not owned or declared by the current checkout. S02-2 cannot safely consume or modify them without a new explicit ownership/schema decision. Source files, Railway, staging, and production remain unchanged; no S02-2 commit or push was made.`

## S02-2 resumed implementation packet — 2026-11-02

### Authorization and checkpoint

- User authorized continuation after the isolated database was created.
- Repository: `funmarket/VibeQuestGuardians`
- Branch: `vibefoundation`
- Current HEAD before source mutation: `0f19df591a0cf53aa30956eba296f91f3b4c9137`
- Database target: `vibequest_s02_2_test`, owned by `vibequest_app`, isolated from `vibequest_m1_test`.
- PostGIS bootstrap was executed successfully in the isolated target.

### Bounded semantic outcome

Implement only the D01 database-backed API session boundary:

- `GET /me` resolves the canonical principal from a server-validated bearer session;
- `POST /sessions/revoke` revokes the authenticated session idempotently;
- missing, malformed, unknown, expired, revoked, mismatched, and database-failure cases return safe typed HTTP errors;
- session secrets are hashed at rest and never returned;
- API shutdown closes the session database pool;
- one additive D01 migration creates the minimum user/session tables and indexes.

### Exact files authorized

- `EXECUTION_PLAN.md`
- `package.json`
- `apps/api/src/app.ts`
- `apps/api/src/database/migrator.ts`
- `apps/api/src/identity/session.ts`
- `packages/testing/src/identity-session.test.ts`

No other source, frontend, deployment, Railway, provider, Redis, media, Telegram, or production files may change.

### Owner and database boundary

- Owner: D01 Identity and Authorization.
- Canonical writer: the D01 PostgreSQL session boundary only.
- Physical tables must use explicit D01 names (`vq_d01_users`, `vq_d01_sessions`) to avoid adopting the unrelated shared database schema.
- PostgreSQL/PostGIS is authoritative; no browser, Redis, or in-memory session authority is permitted.

### Required contracts and failure semantics

- Bearer token is accepted only from the `Authorization` header.
- Store only a SHA-256 token hash; never log or return the raw token.
- Valid sessions resolve the S02-1 canonical principal shape with `host`, `sessionId`, `accountId`, and capabilities.
- Missing/malformed/unknown credentials return `401` with the existing safe error envelope.
- Expired and revoked sessions return `401` with no identity disclosure.
- Revoke is idempotent for the authenticated session and never revokes another session.
- Database failures return `503` dependency errors, never a success response.
- Pool/client release and HTTP server shutdown are explicitly tested.

### Test-first and migration acceptance

Write and run the real HTTP tests before production implementation. The tests must cover missing, malformed, unknown, valid, expired, revoked, mismatch, secret non-disclosure, idempotent revoke, database failure, request cleanup, and shutdown. The migration must be tested for first application, rerun, checksum rejection, advisory-lock release, rollback, and pool/client cleanup using the isolated target.

### Verification and stop conditions

Use Node 24 and the configured isolated database. Run focused RED, focused GREEN, database safety checks, full tests, typechecks, build, formatting, config lint, diff review, and final clean-tree review. Stop if the work requires a new owner, a second schema authority, any unrelated file, a shared database mutation, or any Railway/production change.

## S02-2 execution evidence — pre-commit

### Test-first evidence

| Stage | Command | Result |
|---|---|---|
| RED | `tsx --test packages/testing/src/identity-session.test.ts` before `apps/api/src/identity/session.ts` existed | Genuine `ERR_MODULE_NOT_FOUND` for the authorized session boundary; exit 1 |
| Focused GREEN | `tsx --test packages/testing/src/identity-session.test.ts` with `VQ_TEST_DATABASE_URL` targeting `vibequest_s02_2_test` | 8 passed, 0 failed |
| Full suite | `C:\Program Files\nodejs\npm.cmd test` with isolated DB variables | 36 passed, 0 failed |
| Migration safety subset | `tsx --test --test-name-pattern='database configuration|unavailable database|duplicate and out-of-order|migration authority|modified applied|failed migrations' packages/testing/src/database-foundation.test.ts` | 8 passed, 0 failed |
| Typecheck | `C:\Program Files\nodejs\npm.cmd run typecheck` | Passed |
| Client typecheck | `C:\Program Files\nodejs\npm.cmd run typecheck:client` | Passed |
| Build | `C:\Program Files\nodejs\npm.cmd run build` | Client, API, and Worker builds passed |
| Formatting | `C:\Program Files\nodejs\npm.cmd run format:check` | Passed |
| Config lint | `C:\Program Files\nodejs\npm.cmd run lint:config` | Passed |
| Diff hygiene | `git diff --check` | Passed |

### Database evidence

- `vibequest_s02_2_test` authenticated successfully as `vibequest_app` and reported PostGIS available.
- `CREATE EXTENSION IF NOT EXISTS postgis` returned successfully before migration execution.
- The current checkout’s `0002_d01_identity_sessions` migration created `vq_d01_users` and `vq_d01_sessions` in the isolated target.
- Migration rerun, checksum rejection, lock serialization, rollback, and cleanup checks passed in the migration subset.
- The existing `missing PostGIS` test was not included in the subset because no separate non-PostGIS database is configured; the full database file reports that environment limitation. No non-PostGIS database was created or modified.
- Migration probe rows created by the safety suite were removed only from the isolated `vibequest_s02_2_test` ledger after verification. No shared `vibequest_m1_test` rows were touched.

### Scope result

The authorized S02-2 slice is **IMPLEMENTED and VERIFIED locally** before commit: database-backed `/me`, idempotent session revoke, safe failure envelopes, token hashing/non-disclosure, expiry/revocation handling, and API shutdown cleanup. No Telegram deployment, Redis, media, frontend, Railway, staging, or production mutation occurred.

Implementation commit: `df2fe90a5ed04a76017e6b587b184b1085f81526`.

## S02-2 staging verification — 2026-11-02

### Reconciliation and scope

- Repository: `funmarket/VibeQuestGuardians`
- Branch: `vibefoundation`
- Source commit deployed: `bb0ec37a4435995e9eec408adfd2cec631f38dbd`
- Railway project: `VibeQuest` (`6aed68eb-cb62-4d2e-8606-900b57b6c389`)
- Railway environment: `staging` (`fd6553dc-5a72-4b28-b0ae-ad1d938dd468`)
- Services in scope: `staging-api`, `staging-worker`, `staging-client`, and `staging-postgis`
- Production environment and production `Postgres` were not changed.
- No source, schema, Redis, media, Telegram, or client changes were made in this staging task.

### Deployment evidence

| Requirement | Exact evidence | Result | Limitation |
|---|---|---|---|
| Exact source deployed | Railway deployment `d6069876-4fc5-4747-a876-5589fac92082` was connected to `vibefoundation` at `bb0ec37`; build completed successfully | VERIFIED | A later staging-only variable redeploy is recorded below |
| Migration authority | Deployment `d6069876-4fc5-4747-a876-5589fac92082` deploy log: `migration target=vibequest_staging postgis=3.5.2 ledger=2` | VERIFIED | Direct SQL catalog inspection was unavailable through the Railway connector |
| Runtime identity | Deployment `4e0e6f0b-bb48-421b-ab98-df96a1121864` completed `SUCCESS`; `/health/ready` and `/health/identity` report full commit `bb0ec37a4435995e9eec408adfd2cec631f38dbd`, build `s02-2-staging-bb0ec37`, environment `staging`, serving revision `4e0e6f0b-bb48-421b-ab98-df96a1121864` | VERIFIED | None for the identity contract |
| Liveness | Browser check of `https://staging-api-staging-dc86.up.railway.app/health/live` returned `{"status":"alive"}` | VERIFIED | None |
| Readiness | Browser check of `/health/ready` returned `{"status":"ready"}` with the exact identity above | VERIFIED | None |
| Unauthenticated session boundary | Browser check of `/me` returned safe `401 AUTHORIZATION_ERROR` with `Authorization required` | VERIFIED | Only the no-credential negative path was exercised |
| Valid session, expiry, revoke, duplicate revoke, cleanup | A temporary TCP proxy was provisioned on the existing `staging-postgis` service at `reseau.proxy.rlwy.net:43012`, but Railway credentials were unavailable to the connector and the local Railway CLI was not authenticated; no disposable staging fixture was created | BLOCKED | The proxy was removed immediately; no public staging database endpoint remains |
| Service status | Environment status: `staging-api`, `staging-worker`, `staging-client`, and `staging-postgis` online; active staging API deployment `4e0e6f0b-bb48-421b-ab98-df96a1121864` successful | VERIFIED | Railway still reports 9 historical recent failures across API/client/worker; no active failure remained |
| Secrets/log safety | Railway variable names were inspected with values redacted; deploy logs showed no database URL, token, or raw session credential | VERIFIED | No raw secret was printed or committed |

### Corrective staging patch

The first metadata-only staging patch set `VQ_COMMIT` to the abbreviated value `bb0ec37`. The runtime identity contract correctly rejected that value because `VQ_COMMIT` must be a full 40-character hexadecimal SHA, and deployment `9a41f9d5-ce3d-4176-913f-8eb89aa08c04` repeatedly failed with `ConfigurationError: Required API configuration is invalid`. The corrective patch changed only staging variables:

- `VQ_COMMIT=bb0ec37a4435995e9eec408adfd2cec631f38dbd`
- `VQ_BUILD=s02-2-staging-bb0ec37`

The corrective deployment completed successfully as `4e0e6f0b-bb48-421b-ab98-df96a1121864`. This was an in-scope staging correction; no production variable or deployment was touched.

A temporary TCP proxy was then created only on the existing staging PostGIS service to enable the requested disposable-fixture proof. It became active at `reseau.proxy.rlwy.net:43012`, but the Railway connector intentionally redacted database credentials and the local Railway CLI returned `Unauthorized` because it was not logged in. The proxy was removed immediately and a follow-up list confirmed no TCP proxies remain on `staging-postgis`. No database connection, fixture insertion, schema change, or production access occurred.

### Acceptance status

S02-2 is **STAGING PARTIALLY VERIFIED**, not `STAGING ACCEPTED`. The source deployment, migration log, exact runtime identity, liveness, readiness, and unauthenticated HTTP authorization failure are verified. Valid-session resolution, expiry/revocation, idempotent revoke, fixture cleanup, and shutdown evidence remain blocked until a safe staging database access path is explicitly available. The next action is to provide a controlled staging-only database query path or an approved temporary access mechanism; do not mark S02-2 staging accepted before those checks pass.

## S02-2 staging-closure retry — 2026-11-03

The existing Railway target was re-reconciled before retry:

- Project `6aed68eb-cb62-4d2e-8606-900b57b6c389`, environment `fd6553dc-5a72-4b28-b0ae-ad1d938dd468`, and all four named staging services matched the packet.
- Active staging API deployment remained `4e0e6f0b-bb48-421b-ab98-df96a1121864` (`SUCCESS`); no staged changes were pending.
- The local checkout was clean on `vibefoundation` at documentation HEAD `9e56c50`; the deployed application source remains the required `bb0ec37a4435995e9eec408adfd2cec631f38dbd`.

### Access attempt and safety result

- A temporary TCP proxy was created only for the existing `staging-postgis` on port `5432`, first as `nozomi.proxy.rlwy.net:40625`.
- The local network sandbox rejected the connection before SQL execution (`EACCES`); no fixture was created.
- The Railway API service console was inspected. It had no `node`, `psql`, `curl`, or `wget` executable available; the submitted console probes therefore executed no SQL or HTTP checks.
- A protected local retry path was rejected before execution because the tool would record a live database credential in terminal input. No credential was written to a file or committed.
- The temporary TCP proxy was removed immediately, and a follow-up Railway listing confirmed: `No TCP proxies for staging-postgis in environment staging.`
- The temporary probe script was deleted. The local process that held the connection value in memory was closed.

### Retry status

This retry remains **BLOCKED**, not `STAGING ACCEPTED`. No valid-session, expiry, revoke, duplicate-revoke, or staging-fixture-cleanup proof was obtained. No database mutation occurred during the retry, and no production resource was touched. Completion requires a safe database access path that does not expose credentials in command arguments, terminal input, logs, or committed files.

## S02-2 staging acceptance closure — 2026-11-03

The Railway CLI was authenticated in the host environment as `funmarketmn@gmail.com`. The existing staging target was used without creating or changing any project, environment, application service, production resource, source commit, Redis resource, media resource, or Telegram resource.

### Direct staging evidence

| Acceptance item | Exact evidence | Result |
|---|---|---|
| Database access | Disposable connection through a temporary proxy on existing `staging-postgis:5432`; `SELECT 1` passed | VERIFIED |
| Valid session | One disposable D01 user/session; live `GET /me` returned `200` with the expected canonical principal | VERIFIED |
| Unknown token | Live `GET /me` returned `401` | VERIFIED |
| Expired session | Disposable session expired; live `GET /me` returned `401` | VERIFIED |
| First revoke | Live `POST /sessions/revoke` returned `204` | VERIFIED |
| Duplicate revoke | Repeated live `POST /sessions/revoke` returned `204` | VERIFIED |
| Revoked session | Live `GET /me` after revoke returned `401` | VERIFIED |
| Secret non-disclosure | Sanitized response-body assertion found no raw session token | VERIFIED |
| Fixture cleanup | Targeted disposable rows deleted; follow-up count was `0` | VERIFIED |
| Connection cleanup | Probe closed the PostgreSQL pool in `finally` | VERIFIED |

The first probe's cleanup assertion exposed a probe-only multi-statement SQL error. The probe was corrected to use separate parameterized deletes, the prior disposable row was removed by its unique test prefix, and the complete probe then passed. No application source was changed.

### Proxy and resource cleanup

- Temporary proxy was created only on the existing `staging-postgis` service at `zephyr.proxy.rlwy.net:33055`.
- The proxy was deleted after verification.
- Final Railway listing returned no TCP proxies for `staging-postgis` in staging.
- No production resource was touched.

### Final status

S02-2 is **STAGING ACCEPTED for the authorized D01 session boundary**. This covers deployed source commit `bb0ec37a4435995e9eec408adfd2cec631f38dbd`, active staging deployment `4e0e6f0b-bb48-421b-ab98-df96a1121864`, and the acceptance items above. It does not claim Telegram, Redis, media, or production acceptance; those remain later authorized work.

## S02-3 pre-implementation packet — 2026-11-03

### Milestone and authorized scope

- Milestone: S02, proposed slice `S02-3 — Web Host-Authority Integration and Five-Destination Shell`.
- Repository/ref/HEAD: `funmarket/VibeQuestGuardians`, `vibefoundation`, `20cf25b1f1c81539b7855958fbe4907ebab2776e`.
- Outcome: connect the existing Web client to the server-authoritative `/me` boundary and provide truthful guest/protected shell behavior with equal Home, Explore, Share, Vibe and Purse destinations; prepare only the non-deploying Telegram adapter seam.
- Domain owner/canonical writer: D01 Identity and Authorization; PostgreSQL-backed API session boundary remains the only identity authority. Client owns presentation and navigation only.

### Files allowed to change

- `apps/client/src/App.tsx`
- `apps/client/src/platform/host.ts`
- `apps/client/src/platform/identity.ts` (new only if the inspected client boundary requires it)
- `apps/client/src/styles/global.css`
- `apps/client/index.html` (only for client title/metadata required by the shell)
- `packages/testing/src/client-host-authority.test.ts` (new focused acceptance tests)
- `packages/testing/src/client-foundation.test.ts` (only for compatible test updates)
- `package.json` (only to register the focused test if required)
- `EXECUTION_PLAN.md`

Forbidden: API source, database migrations, Railway resources/configuration, Worker, Redis, media, Telegram deployment/linking/secrets, production, and unrelated documents.

### Interfaces, behavior matrix, tests and verification

- Consume the existing `/me` response shape and safe error envelope; do not invent credential issuance or storage.
- Red tests first: valid identity, missing/expired/failed `/me`, truthful guest/protected behavior, five equal destinations, Share not elevated, no duplicate `/me`, truthful Telegram seam, and no invented business success.
- Failure semantics: loading is distinct from authenticated, guest, expired/denied and unavailable; failed `/me` never promotes a guest; protected UI remains denied without server identity.
- No persistence/migration impact. No deployment impact until local gates pass.
- Verification: focused tests, full test suite, client/server typechecks, build, format/config checks, browser smoke and responsive checks where the available client runtime permits; then reconcile Railway before any existing-staging-only client deployment.
- Stop conditions: missing real session issuance/transport requiring a new credential design; API or database changes; new infrastructure; conflicting current source; unsafe or unavailable runtime proof; any file outside the allowlist.

## S02-3 implementation evidence — 2026-11-03

### Implementation status

S02-3 is **IMPLEMENTED** and locally verified for the bounded client slice. The implementation commit is the current branch HEAD recorded in the handoff report. No API, database, Worker, Railway, Redis, media, Telegram deployment/linking, or production files were changed.

### Changed files

- `apps/client/src/App.tsx` — server-session loading state, truthful identity messaging, equal five-destination shell, global notification/profile entries, and unavailable domain states.
- `apps/client/src/platform/host.ts` — explicit `server-session` identity authority on Web and Telegram host adapters.
- `apps/client/src/platform/identity.ts` — credentialed `/me` resolver, canonical-principal validation, truthful failure states, and one-request cache for client initialization.
- `apps/client/src/styles/global.css` — responsive mobile-first shell and equal navigation styling; Share heart remains an inline mark.
- `apps/client/index.html` — client title.
- `packages/testing/src/client-host-authority.test.ts` — focused S02-3 acceptance tests.
- `package.json` — focused test registration in the repository test command.
- `EXECUTION_PLAN.md` — this evidence record.

### Red/green evidence

| Evidence | Command | Result |
|---|---|---|
| RED | `node node_modules/tsx/dist/cli.mjs --test packages/testing/src/client-host-authority.test.ts` before implementation | 7 failed: missing `platform/identity.js`, missing five-destination shell, and missing Telegram authority marker |
| GREEN | same focused command after implementation | 7 passed, 0 failed |
| Client typecheck | `node node_modules/typescript/bin/tsc --noEmit -p apps/client/tsconfig.json` | exit 0 |
| Testing typecheck | `node node_modules/typescript/bin/tsc --noEmit -p packages/testing/tsconfig.json` | exit 0 |
| API build/typecheck | `node node_modules/typescript/bin/tsc -p apps/api/tsconfig.build.json` | exit 0 |
| Worker build/typecheck | `node node_modules/typescript/bin/tsc -p apps/worker/tsconfig.build.json` | exit 0 |
| Client build | `node C:\Users\GrowB\AppData\Local\Temp\vibequest-s02-1\node_modules\vite\dist\node\cli.js build` from `apps/client` | exit 0; Vite emitted client bundle |
| Formatting | Prettier `--check` over all changed allowlisted files | exit 0 |
| Config lint | `node node_modules/eslint/bin/eslint.js eslint.config.js` | exit 0 |
| Diff hygiene | `git diff --check` | exit 0; only expected line-ending warning |

### Full-suite limitation

The repository suite reached 35 passed tests before the existing database-backed `packages/testing/src/identity-session.test.ts` process failed at startup because `VQ_TEST_DATABASE_URL` was not set. The full suite is therefore **BLOCKED**, not fully verified. No database-backed test was skipped or represented as passing.

### Runtime and deployment boundaries

No staging or production deployment was authorized or performed for this disposable implementation checkout. Browser smoke against a configured API session was not run. Telegram signature verification, replay protection integration, and canonical account linking remain excluded as required by the packet.

## S02-3 fix round 1 evidence — 2026-11-03

The review of commit `329c86f89337681ba7680e829f60612b216ce099` identified an impossible default Web authentication path because the existing API requires a bearer token and this checkout contains no approved browser credential issuer, storage, or API-origin wiring. The fix round keeps that boundary truthful and fail-closed: it adds an explicit injectable API-origin/bearer transport, uses the existing `Authorization: Bearer` contract when a verified token provider is supplied, and renders `Unavailable` without making a fabricated credential request when no safe transport is available. No new credential storage or issuance was introduced.

### Fix-round red/green evidence

| Stage | Command | Result |
|---|---|---|
| RED | `node node_modules/tsx/dist/cli.mjs --test packages/testing/src/client-host-authority.test.ts` after adding fix-round acceptance cases | 5 failed, including missing explicit bearer transport, malformed-principal rejection, session controller, truthful controls/copy |
| GREEN | same focused command after implementation | 12 passed, 0 failed; includes browser Vite smoke for App unavailable state, navigation, and disabled global controls |
| Client/testing typechecks | `node node_modules/typescript/bin/tsc --noEmit -p apps/client/tsconfig.json`; `node node_modules/typescript/bin/tsc --noEmit -p packages/testing/tsconfig.json` | exit 0 |
| API/Worker builds | `node node_modules/typescript/bin/tsc -p apps/api/tsconfig.build.json`; `node node_modules/typescript/bin/tsc -p apps/worker/tsconfig.build.json` | exit 0 |
| Client build | Vite build from `apps/client` | exit 0 |
| Formatting/lint/diff | Prettier check, ESLint config check, `git diff --check` | passed |

### Remaining blocker

The separate API bearer contract is now explicit and tested, but the current allowed client composition has no safe source-truth credential issuer/storage or approved API-origin runtime configuration to supply it. The default App therefore remains truthfully unavailable rather than claiming authenticated Web integration. The repository full suite remains blocked at the existing database-backed session test when `VQ_TEST_DATABASE_URL` is unset; the fix-round focused suite and browser smoke pass.

## S02-3 existing staging client deployment — 2026-11-03

- Published branch: `vibefoundation` at `41f3cd18b1dad88c11c177a8f24265a3ee82f6da`.
- Existing Railway project/environment only: `VibeQuest` / `staging`.
- Service changed: `staging-client` only.
- Deployment: `281514e3-52fc-4b52-9ebd-1e7838e27719`, `SUCCESS`, serving the exact commit above.
- API, Worker, PostGIS, production, Redis, media and Telegram resources were not changed.
- HTTPS browser smoke returned title `VibeQuest`, no foundation placeholder, the five destinations, one primary navigation, no console errors, and responsive shell content. The browser interaction selected `Explore` successfully.
- The deployed client truthfully displays `Unavailable` because no approved Web bearer-token issuer/storage and API-origin runtime configuration exists yet. Authenticated Web acceptance is therefore **BLOCKED**, not claimed.

### Current S02-3 status

`STAGING DEPLOYED` for the truthful five-destination client shell. `STAGING ACCEPTED` is not permitted until the approved Web session-acquisition contract is implemented and live authenticated, expired, revoked and protected-action checks pass.
