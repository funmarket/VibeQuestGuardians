# VibeQuestGuardians — Living Agent Execution Plan

> **For agentic workers:** Read `AGENTS.md` first. Then read this plan and the governing documents listed below. Use this document as the operational continuation guide, not as permission to make unbounded changes. Implement only an explicitly authorized milestone and update the progress/evidence sections before handoff.

**Goal:** Build the complete VibeQuestGuardians product from the approved documentation baseline into a real, production-ready system with truthful behavior, clean domain ownership, durable persistence, secure runtime boundaries, staging acceptance, and release evidence.

**Architecture:** The product uses separate Client, API, and Worker runtime boundaries. The API may initially host isolated domain modules in one deployable, but no domain may become a god service, universal repository, second writer, or monolithic script. PostgreSQL + PostGIS is the intended authoritative transactional/spatial platform; migrations, readiness, exact serving identity, and isolated staging are release requirements.

**Tech Stack:** Select exact libraries and providers during the authorized slice from the approved architecture and current repository evidence. PostgreSQL + PostGIS is directed. Web and Telegram are one product; Telegram is a host adapter. Do not copy technology choices from historical VibeQuest, Hooma, Railway references, or Gemini files without a separate approved decision.

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
| Product stage | `S01 IMPLEMENTED; STAGING NOT ACCEPTED` | Source substrate and CI exist; no business domain is implemented |
| Client | S01 technical shell exists | No product feature surface is enabled |
| API | S01 runtime exists with liveness/readiness | Runtime acceptance remains evidence-based |
| Worker | S01 separate runtime exists with liveness/readiness | Durable job behavior belongs to later milestones |
| Physical database | CI-installed S01 PostGIS substrate | Only CI evidence exists; no staging database accepted |
| Migrations | CI migration runner passed | S01 migration is PostGIS-only; staging installation remains open |
| Staging | Not accepted | Must be isolated, persistent, production-shaped |
| Production | Not accepted | Requires S18 gates and explicit release authorization |
| Gemini reference | External local reference only | UX/interaction evidence; no implementation authority |
| Historical repositories | Reference only | No blind code/schema/infrastructure transplant |

**Current next permissible action:** obtain explicit implementation authorization for S01 with bounded source and runtime scope.

## 4. Progress board

Update this table only with evidence. Add commit SHA, test/run links, or runtime evidence to the Evidence column; do not write “done” without proof.

| Milestone | Name | Status | Dependencies | Owner/agent | Last update | Evidence |
|---|---|---|---|---|---|---|
| S01 | Engineering substrate, CI, migration, readiness, staging path | IMPLEMENTED | Commit `1fd4ea14a27f260ae7f0f0be8b0020e2c30ed8ac`; CI run `41317527803` | Codex | CI green; staging not accepted |
| S02 | D01 identity, authorization, shell, Web/Telegram host authority | PLANNED | S01 | Unassigned |  |  |
| S03 | D13 media and device capabilities | PLANNED | S01–S02 | Unassigned |  |  |
| S04 | D02 profiles, D03 social graph, D09 business authority | PLANNED | S02–S03 | Unassigned |  |  |
| S05 | D14 messaging, D23 notifications, D21 report/case core | PLANNED | S01–S04 | Unassigned |  |  |
| S06 | D20 VQ ledger | PLANNED | S01–S02 | Unassigned |  |  |
| S07 | D04 geo/presence and provider adapters | PLANNED | S01–S03 | Unassigned |  |  |
| S08 | D05 Places, validation, check-in, confidence | PLANNED | S03, S06, S07 | Unassigned |  |  |
| S09 | D06 Trails | PLANNED | S03, S08 | Unassigned |  |  |
| S10 | D07 Guardians, D08 Tours, D19 recognition, D22 Handshakes, D25 entitlements | PLANNED | S02–S10 dependencies in Master Plan | Unassigned |  |  |
| S11 | D12 content, D16 communities, D15 live rooms | PLANNED | S03–S05 | Unassigned |  |  |
| S12 | D17 matching, D18 challenges, confirmed Vibes | PLANNED | S05, S06, S10, S11 | Unassigned |  |  |
| S13 | D10 activities, D11 events, D28 ticketing | PLANNED | S03, S05, S06, S08, S10 | Unassigned |  |  |
| S14 | D26 Marketplace, D27 payment boundary, Purse, reviews | PLANNED | S05, S06, S10 | Unassigned |  |  |
| S15 | Admin completeness, Trust & Safety, business, advertising, operations | PLANNED | S02, S04–S14 | Unassigned |  |  |
| S16 | Full Home/Explore/Share/Vibe/Purse composition | PLANNED | S01–S15 | Unassigned |  |  |
| S17 | Web/Telegram parity and device acceptance | PLANNED | S01–S16 | Unassigned |  |  |
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

Before S02 can reach VERIFIED, tests and staging evidence must demonstrate:

- browser system locale detection and explicit language override;
- EN/FR/AR rendering and RTL layout where applicable;
- browser system light/dark preference and explicit theme override;
- Telegram host theme/language signals through the host adapter, with a truthful unavailable path;
- system-default text sizing and explicit larger text settings without clipping or inaccessible controls;
- persistence of D02 preferences across reload and Web/Telegram sessions for the same account;
- denial/failure handling when preference persistence is unavailable;
- no localStorage/Firebase/Telegram host value is used as the canonical account preference;
- no product business state is fabricated to demonstrate a preference.

S01 must establish the shared preference interfaces, design tokens, host-adapter seams, and accessibility test harness without pretending to complete D02. S02 implements and verifies the real D02 preference behavior.

## 5. Milestone contract

Each milestone is a complete, bounded deliverable. A milestone may be split into independently reviewable tasks, but no task may create fake business behavior or claim a domain is available before the milestone gate passes.


**S01 implementation update — 2026-11-01**

- Implemented in GitHub commit `1fd4ea14a27f260ae7f0f0be8b0020e2c30ed8ac`.
- CI run `41317527803` passed migration, typecheck, tests, lint and the bounded root-config format gate.
- The source substrate includes Client/API/Worker boundaries, shared contracts, runtime-health, isolated-test helper, PostGIS migration authority, readiness endpoints, and host-preference seams.
- S01 is not `VERIFIED` or staging-accepted: no staging environment has been installed or exercised, and the current format gate does not yet cover all source files.


**S01 hardening update — 2026-11-01**

- Readiness now requires a non-empty PostGIS result and a non-empty migration ledger, covered by a red-green CI test cycle.
- Migration status no longer exits before advisory-lock release, client release, and pool shutdown.
- CI now runs `db:validate`, `db:migrate`, and `db:status` before the full check.
- S01 remains `IMPLEMENTED`, not `VERIFIED`: full-source formatting is still not enforced, and staging has not been installed or accepted.

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
| DEC-006 | 2026-11-01 | Language, theme, text-size, accessibility and host preference behavior use D02 ownership with system/Telegram detection and explicit-user override precedence. | Product Owner direction; this plan section 4A | S01–S02, S17 | Shared tokens/adapters first; real persistence and parity evidence before S02 acceptance. | LOCKED |

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
