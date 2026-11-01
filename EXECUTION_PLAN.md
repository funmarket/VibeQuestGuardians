# VibeQuestGuardians — Agent Execution Plan

**Document ID:** VQ-EXEC-001  
**Repository:** `funmarket/VibeQuestGuardians`  
**Branch:** `vibefoundation`  
**Status:** Execution-control plan for authorized implementation  
**Authority:** The latest explicit Product Owner direction and `Master Plan.md` control. This file operationalizes that authority for agents; it does not change product policy, domain ownership, persistence invariants, or acceptance vocabulary.

## 1. Purpose

This plan lets a new agent continue work from repository evidence without relying on chat history, memory, or undocumented handoff claims.

Every agent must be able to answer before acting:

- What exact repository, branch, and commit am I inspecting?
- Which governing documents control this task?
- Which exact slice and ownership boundary am I authorized to change?
- What is explicitly forbidden?
- What evidence proves the result?
- What is the next permissible action?

If those answers cannot be established from current source, the agent must stop and report `UNKNOWN` or `BLOCKED`.

## 2. Non-negotiable implementation rules

1. **No fake product behavior.** No mock backend, fake API, fake users, seeded production interactions, fabricated coordinates, simulated camera proof, canned messages, client-minted VQ, fake bookings, fake tickets, fake payments, fake notifications, fake confidence, or optimistic success after failed persistence.
2. **No placeholder product features.** Do not create a screen, route, handler, repository, table, or response that pretends a business capability exists when its authoritative behavior is not implemented and verified.
3. **No partial business implementation.** A business feature may be merged only when its authorized slice has complete owner-domain persistence, authorization, failure behavior, tests, and required runtime evidence. Incomplete work may remain unmerged in an explicitly labeled working branch or be discarded; it must not be presented as available functionality.
4. **S01 is substrate, not a partial product.** S01 may establish real Client/API/Worker infrastructure, contracts, migrations, CI, health/readiness and staging observability. It must not add fake domain data or incomplete business journeys.
5. **One canonical writer.** Each D01–D28 business fact has one owner. No Admin, read model, notification, Worker, page, or generic repository may become a second writer.
6. **No monolithic authority.** No god service, universal repository, universal controller, universal schema owner, monolithic script, or page-level business orchestration.
7. **Explicit composition.** Concrete adapters are wired only in composition roots. Domain modules use narrow capability ports and do not import foreign infrastructure.
8. **Real runtime boundaries.** Client, API and Worker are separately runnable boundaries. Telegram is a host adapter to the shared product, not a second backend.
9. **Migration discipline.** One designated migration authority runs migrations once per target database. API and Worker replicas never race to migrate. Applied migration checksums are verified.
10. **Evidence before status.** A green build is not feature acceptance. Source, installed database state, serving revision, readiness and user journey evidence must be reported separately.
11. **No unrelated cleanup.** Change only the authorized target. Stop on architectural drift, new policy, new owner, or missing authority.
12. **No silent continuation.** If a required external account, database, provider, or permission is unavailable, stop and report the blocker instead of substituting a mock.

## 3. Governing reading order

Before any implementation agent acts:

1. `AGENTS.md`
2. `Master Plan.md`
3. `EXECUTION_PLAN.md`
4. `Requirements.md`
5. `structure.md`
6. `Database.md`
7. relevant current source and tests
8. historical/reference sources only for bounded UX or failure evidence

Historical VibeQuest, Hooma, Railway references, and the Gemini ZIP never override the governing set and must not be transplanted.

## 4. Current baseline

Current repository stage:

**PRE-S01 APPROVED GOVERNING-DOCUMENT BASELINE**

Verified meaning:

- governing product, architecture, ownership and conceptual persistence documents exist;
- application implementation is not thereby complete;
- S01 has not automatically begun;
- staging and production are not accepted;
- repository/database/deployment mutations require bounded authorization.

The first implementation authorization must explicitly name S01 and its allowed targets.

## 5. Work authorization contract

Before editing, the agent must record in its task report:

- exact branch and HEAD;
- authorized slice;
- authorized files/packages/runtime resources;
- owning domains;
- forbidden files/actions;
- expected semantic outcome;
- verification commands and runtime checks;
- stop conditions.

An agent must not start a neighboring slice merely because it is convenient or related. Agents must not concurrently invent competing schemas for one canonical record.

## 6. Phase sequence

The phases follow the Master Plan. A phase may begin only when its dependencies and authorization are satisfied.

### S01 — Real engineering substrate

Establish:

- repository/workspace structure;
- separate Client, API and Worker runtimes;
- shared contracts and testing;
- PostgreSQL/PostGIS foundation;
- one migration authority and ledger;
- isolated test database;
- structured configuration and secret handling;
- CI architecture/type/lint/test/build gates;
- liveness and dependency-aware readiness;
- exact source/build/serving identity;
- isolated persistent production-shaped staging path.

S01 must not implement business domains, fake endpoints, sample production data, simulated success, or incomplete feature screens.

### S02 — D01 identity, authorization, shell and host authority

Implement real identity/session/recovery, Telegram launch verification and canonical account linking, guest/protected behavior, five equal navigation destinations, and permanent scoped Admin shell/authorization. No UI-only privilege.

### S03 — D13 media and device capabilities

Implement real media asset lifecycle, storage boundary, capture/upload/processing/retention, and truthful location/camera/microphone permission states. No synthetic proof.

### S04 — D02 profiles, D03 social graph, D09 business authority

Implement real profile/preferences/privacy, follow/block, organization/operator authority and their authorization contracts.

### S05 — D14 messaging, D23 notifications, D21 report/case core

Implement real persistence, authorization, delivery/retry/reconnect, notification inbox, report/case intake and scoped moderation foundation. Do not fabricate source-specific conversations before their source domains exist.

### S06 — D20 VQ ledger

Implement immutable postings, rules, grants, transfers where authorized, idempotency and compensating corrections. D20 is the only VQ writer.

### S07 — D04 geo/presence and provider adapters

Implement real device evidence, consent, freshness, spatial operations, Find Hub and replaceable provider boundaries. Do not use manual or fallback coordinates as proof.

### S08 — D05 Places/Validate/check-in/confidence

Implement real Place truth, observations, 5 m check-in rule, 23 km applicable discovery scope, versioned Admin-configurable confidence, and provenance.

### S09 — D06 Trails

Implement Trail authoring, stops/order, publication, adoption/remix, attribution, lineage, route/offline behavior and public discovery without duplicate ownership.

### S10 — D07 Guardians, D08 Tours/Reservations, D22 Handshakes, D19 recognition and D25 entitlements

Implement real eligibility, offers, reservations, provider acceptance, exact idempotent Handshake issuance, 24-hour ACTIVE→EXPIRED lifecycle and review ownership.

### S11 — D12 content, D16 communities and D15 live rooms

Implement real content, communities, membership/roles, moderation paths and live-room state.

### S12 — D17 matching, D18 VibeCheck/VibeFlash and confirmed Vibes

Implement real Pull/Drift/Vibe state, server-authoritative 180-second VibeCheck, 33-second VibeFlash, reciprocal completion rules and authorized D14 personal messaging.

### S13 — D10 activities, D11 events and D28 ticketing

Implement real activities/events/RSVP and independent ticket inventory, issuance, validation and admission.

### S14 — D26 Marketplace, D27 payment boundary, Purse and reviews

Implement real listings, negotiation, deal state, direct VQ transfer behavior, Marketplace review ownership and explicit future/payment boundary. No default escrow or platform guarantee.

### S15 — Admin completeness, Trust & Safety, business and advertising operations

Integrate scoped owner-domain commands, D21 cases/sanctions/appeals, D24 advertising, operational projections and privileged audit. No direct SQL business writes.

### S16 — Full destination composition

Compose Home, Explore, Share, Vibe and Purse from completed feature contracts without page-level monoliths or duplicate state. No UI composition may conceal incomplete backend behavior.

### S17 — Web/Telegram parity and device acceptance

Verify shared identity/data behavior, host adapters, permission states, responsive behavior, RTL/localization, browser and real Telegram flows.

### S18 — Production readiness and controlled release

Verify all launch-scope slices, migrations, backups/restore, security, observability, performance evidence, compatibility, rollback/forward-fix plan, exact artifact/serving revision and post-deploy authorized journeys.

## 7. Slice acceptance gate

A slice cannot be marked complete until applicable evidence exists for:

- owner and canonical writer;
- authoritative persistence and constraints;
- authorization/privacy denial;
- idempotency/concurrency;
- failure/retry behavior;
- Worker/outbox/deadline behavior;
- client truthful states;
- automated tests;
- isolated staging runtime;
- exact artifact, commit and serving revision;
- installed migration ledger and required extensions;
- representative Web and Telegram flows where applicable.

Use only:

`PLANNED`, `READY`, `IN PROGRESS`, `IMPLEMENTED`, `VERIFIED`, `STAGING ACCEPTED`, `PRODUCTION ACCEPTED`, `BLOCKED`.

## 8. Handoff protocol

Every agent handoff must include:

- exact repository/branch/commit inspected;
- files changed;
- owning domain and canonical writer;
- requirements/invariants implemented;
- tests/checks actually run;
- runtime/database/deployment evidence actually verified;
- known failures and unknowns;
- status using the approved vocabulary;
- one precise next permissible action;
- explicit statement that no mock/fake/placeholder authority was introduced.

A handoff is a locator, not proof. The next agent must re-read the current branch and verify the claims.

## 9. Stop conditions

Stop immediately when:

- the current branch changed unexpectedly;
- required authority is missing;
- a new Product Owner policy is needed;
- two documents or owners conflict materially;
- the task would require foreign-domain writes;
- a runtime/database/deployment claim cannot be directly verified;
- a provider or credential is unavailable;
- the only way to show progress would be a mock, placeholder or fake success.

Report `UNKNOWN` or `BLOCKED`; do not work around the condition with invented behavior.

## 10. Definition of project completion

The project is complete only when the Master Plan S18 production-readiness contract is directly evidenced. No agent may claim completion from documentation, a green CI run, an implemented subset, a deployment record, or a successful demo alone.
