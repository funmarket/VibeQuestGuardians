# VibeQuestGuardians — VibeQuest

**Project stage: PRE-S01 APPROVED GOVERNING-DOCUMENT BASELINE.**

VibeQuestGuardians is the clean new implementation project for **VibeQuest**, a mobile-first local exploration, cultural Trails, Guardian, community, social, challenge, VQ, Marketplace, and local-commerce product. The Product Owner-approved governing set defines the complete target product and engineering boundaries. The application itself is not yet complete, S01 does not begin automatically, and neither staging nor production is accepted merely because the governing documents are approved.

> **Approved governing documents ≠ implemented application ≠ staging acceptance ≠ production acceptance.**

## Product and architecture invariants

- The complete initial product contains **D01–D28**. There is **no D29**. The 28 logical domains do not imply 28 services, databases, schemas, deployments, packages, or migrations.
- One authoritative writer owns each business invariant; cross-domain journeys use explicit owner-authorized contracts/orchestration rather than duplicate writers.
- The approved target is a clean domain-oriented system with separate Client, API and Worker runtime boundaries, explicit domain ownership, composition roots, one migration authority, readiness checks, exact deployment identity and isolated persistent staging. It is not a monolithic script, god service, universal repository, or second business writer. The API may initially host isolated domain modules in one deployable; the 28 logical domains are not 28 required microservices.
- PostgreSQL + PostGIS is the intended authoritative transactional/spatial platform; physical schema and migrations are implemented incrementally when authorized.
- Web and Telegram are one product with one canonical backend, identity, and data model. Telegram host APIs are adapters, not a separate business system.
- Root navigation is **Home / Explore / Share / Vibe / Purse**, all equal-sized. Share may retain heart imagery but is not elevated, oversized, floating, or a larger central action.
- Guest-first public discovery remains supported; protected actions require server-verified identity and authorization.
- Admin Control Room is a first-class orchestration surface, begins with the S02 shell/scoped authorization, grows with owner-domain panels, reaches integrated completeness in S15, and is **not D29**, direct SQL, or a second business writer.
- D20 is the sole canonical VQ writer. VQ is internal and noncrypto; recognition/reputation and fiat boundaries are separate.
- Ticketing D28 is independent of Events and Guardian reservations. Activities and Events remain distinct.
- D13 owns media assets; consumer domains own attachment authorization. D04 owns geographic evidence; D05 owns Places; D23 owns notification delivery rather than originating business actions.

## Current settled product rules

- **VibeCheck = 180 seconds** and **VibeFlash = 33 seconds**, server-authoritative and separate. Neither has a geographic/proximity participation gate.
- A qualifying reciprocal completed VibeCheck may establish exactly one idempotent confirmed D17 Vibe. Invitation acceptance alone, one-sided participation, expiry, follow, mutual follow, compatibility score, or ordinary VibeFlash participation does not.
- A qualifying accepted source agreement creates exactly one idempotent D22 Handshake. For Guardian/Legend/Tour service flows, real provider acceptance is the trigger. Handshake is **ACTIVE → EXPIRED** after exactly 24 hours, with no cancellation state. Underlying booking/deal cancellation does not revoke, reset, delete, or extend the issued Handshake.
- D22 owns Handshake identity/lifecycle/review-eligibility proof; D19 owns Guardian/provider reputation-review content; D26 owns Marketplace product/deal-item review content.
- D05 Place confidence is Admin-configurable, versioned, auditable, and D05-owned. Exact active formula/parameters are implementation/configuration work, not an open Product Owner policy gate.
- Marketplace VQ is direct buyer/user → seller/provider through D20. Ordinary Marketplace has no default escrow, Marketplace commission, platform delivery guarantee, automatic refund, authenticity proof, handover proof, or fiat-settlement proof.
- D27 is a future-only platform-fiat/payment boundary for launch unless separately authorized.
- Current Geo rules include **5 m** maximum Place check-in distance, **23 km** applicable Secrets / Find Hub / nearby-feed discovery scope, and **2 hours** maximum Find Hub temporary-position retention. These are separate from Secret claim radius, Validate approach radius, individual geofences, and challenge eligibility.

## Governing authority

Use this order:

1. latest explicit Product Owner decision
2. approved `Master Plan.md`
3. approved `Requirements.md`
4. approved `structure.md`
5. approved `Database.md`
6. historical/reference/think-tank material

`AGENTS.md` is mandatory execution/evidence/release discipline; it does not outrank the Product Owner or the approved Master Plan as product-policy authority.

### Governing document index

| Document | Role |
| --- | --- |
| [`Master Plan.md`](Master%20Plan.md) | Product Owner-approved controlling implementation/sequencing/operations/acceptance authority |
| [`Requirements.md`](Requirements.md) | Product Owner-approved product-behavior baseline |
| [`structure.md`](structure.md) | Product Owner-approved architecture/module/ownership baseline |
| [`Database.md`](Database.md) | Product Owner-approved conceptual persistence/invariant baseline |
| [`EXECUTION_PLAN.md`](EXECUTION_PLAN.md) | Canonical phase sequence, agent authorization, no-mock rules, acceptance and handoff contract |
| [`AGENTS.md`](AGENTS.md) | Mandatory execution/evidence/release discipline |

### `docs/product-design/*`

[`docs/product-design/`](docs/product-design/) is **think-tank/reference material only** for research, ideas, source reconstruction, historical analysis, experiments, and supporting evidence. It is not governing product authority, canonical domain authority, architecture authority, persistence authority, implementation authority, or release authority.

Do not treat a separate product-design “domain ownership register,” `02_DOMAIN_OWNERSHIP_FINAL_LEAN.md`, or another product-design decisions file as governing implementation authority. The approved D01–D28 ownership model is embedded directly in the governing set.

## Repository branches

| Branch | Role |
| --- | --- |
| [`main`](https://github.com/funmarket/VibeQuestGuardians/tree/main) | Stable/release branch; promotion requires explicit Product Owner release authorization and passed gates |
| [`vibefoundation`](https://github.com/funmarket/VibeQuestGuardians/tree/vibefoundation) | Integration branch for approved governing documents and separately authorized implementation work |

Branch names describe intended roles; they are not proof of protection settings, deployed state, or release acceptance.

## Historical/reference firewall

The old `funmarket/VibeQuest` repository, `phase-0-foundation`, legacy ZIPs, Gemini, Manus, old Railway state, legacy schemas/migrations, and old deployment definitions are reference evidence only. They may inform intended UX, interaction reconstruction, visual behavior, product intent, and failure prevention.

They must not be transplanted as current source code, components, hooks, services, API routes, repositories, schemas, migrations, authentication/session implementation, folder topology, dependencies, deployment configuration, or infrastructure definitions.

S01 specifically prohibits bootstrap/import of legacy **code, schemas, migrations, and infrastructure definitions**. This is not a blanket rule that historical application data can never be migrated; any such future migration would require separate explicit authority, design, privacy/security review, and verification.

HOOMA is a separate project and must never be mixed with VibeQuestGuardians repositories, accounts, schemas, infrastructure, evidence, or decisions.

## S01 — next engineering slice, not yet automatic

When explicitly authorized, S01 establishes the permanent engineering substrate:

- repository/workspace foundation
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
- exact revision/deployment observability

S01 completes **no business domain**. It must not add fake endpoints, mock responses, placeholder product features, fake business state, or speculative all-domain physical schema. A real client shell may be created only when its behavior is genuinely implemented and verified; otherwise the capability remains absent, not simulated.

## Exactly three current Product Owner policy gates

Only these remain open:

1. **Secret bounty-claim proximity**
2. **Validate approach-notification radius**
3. **VibeFlash scheduling/automation**

Historical Secret 50 m and Validate 200 m values are references only until those two corresponding gates are decided.

Handshake cancellation/review policy, Marketplace escrow/refund/VQ policy, D05 confidence ownership/formula policy, general Guardian booking policy, general finance boundaries, API performance numbers, stronger Admin-grant approval, and the historical 5 km/10 km feed radii are **not** current open Product Owner gates.

## Implementation and release truth

Source is not runtime proof. In particular:

- a source migration file is not proof that migration is installed
- a schema document is not proof of a live database
- a route/handler is not proof of a durable business write
- CI is not proof of deployment
- deployment is not proof of the intended serving revision
- browser preview is not proof of Web/Telegram device acceptance

Historical evidence showed divergent Web/API revisions, a newer API deployment failing readiness, and an older successful API revision continuing to serve. Database/migration incompatibility was suspected but not proven as the definitive root cause. Future release work must verify exact source/deploy revisions, installed migration/schema/PostGIS state, compatibility, migration ordering, dependency-aware readiness, and actual serving runtime before claiming release acceptance.

## Working on the project

1. Read [`AGENTS.md`](AGENTS.md) in full.
2. Read the current approved governing documents relevant to the task.
3. Verify the exact repository/branch/HEAD before consequential source changes.
4. Keep facts, rules, and authorization separate.
5. Work one bounded authorized semantic outcome at a time.
6. Use **INSPECT → IMPLEMENT (if authorized) → VERIFY → RECONCILE → CLOSE → REPORT**.
7. Do not reopen settled Product Owner decisions without new evidence or an explicit revision.
8. Do not infer repository, database, deployment, or production mutation authority from document approval.

## Setup, local development, and deployment

**No executable setup/deployment commands are documented here yet.** Add them only after the corresponding repository implementation actually exists and the commands have been verified against the exact current source and environment. Do not copy commands, environment names, provider configuration, or deployment assumptions from the historical application.

**Status rule:** this README is a concise navigation and truth-in-status guide. It is not a replacement for the governing documents and is not evidence that the application, staging environment, database, or production release is complete.
