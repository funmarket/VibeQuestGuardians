# VibeQuestGuardians — Structure and Domain Ownership

**Document ID:** VQ-STRUC-002  
**Repository:** `funmarket/VibeQuestGuardians`  
**Branch:** `vibefoundation`  
**Status:** Product Owner architecture and ownership contract  
**Authority:** The latest explicit Product Owner direction and `Master Plan.md` control this document. `Requirements.md` defines product behavior. `Database.md` defines conceptual persistence. Neither reference material nor an implementation agent may silently change these boundaries.

## 1. Purpose and non-negotiable interpretation

This file defines how the application is organized and where each business fact is owned. It is not a product feature list, executable schema, deployment script, or permission to mutate the repository or infrastructure.

The target is a clean domain-oriented system with:

1. separate application/runtime boundaries;
2. one explicit owner for every canonical business fact;
3. explicit composition and narrow cross-domain contracts;
4. a separately runnable Worker for durable asynchronous work;
5. one migration authority and an auditable migration ledger;
6. liveness and dependency-aware readiness checks;
7. exact source/build/deployment identity at every release gate; and
8. an isolated, persistent, production-shaped staging path.

**No monolithic script, god service, universal repository, universal controller, shared mutable domain store, or second business writer is permitted.**

The 28 logical domains are not 28 required microservices. They are ownership boundaries. An implementation may place several well-isolated domain modules in one API deployable initially, but it must preserve independent ownership, interfaces, tests, and extraction seams. “One API deployable” must never become “one module that owns everything.”

## 2. Authority and source separation

Use these sources in this order:

1. latest explicit Product Owner direction;
2. `Master Plan.md`;
3. this `structure.md`;
4. `Requirements.md`;
5. `Database.md`;
6. historical repositories, ZIPs, design documents, and think-tank material.

The old VibeQuest repository and the Gemini ZIP may inform user-visible behavior, engineering lessons, or bounded algorithms. They are not implementation, schema, identity, payment, deployment, or domain-ownership authorities. Do not transplant their code, migrations, schemas, localStorage authority, mock users, fake coordinates, fake media, fake messaging, or simulated transactions.

Document approval does not authorize implementation, database mutation, deployment, migration, release, or production acceptance. Every such action needs bounded authorization.

## 3. Runtime topology

The system has explicit application/runtime boundaries:

```text
apps/client
  Responsive Web + Telegram Mini App host adaptation
  No direct database access and no business authority

apps/api
  Authenticated HTTP/realtime boundary
  Explicit domain modules, application use-cases, owner repositories and read projections

apps/worker
  Separately runnable durable jobs
  Outbox delivery, retries, deadlines, cleanup, projections and other authorized asynchronous work

PostgreSQL + PostGIS
  Authoritative transactional and spatial persistence

Object storage
  Media bytes behind D13-owned lifecycle and access contracts

External providers
  Replaceable adapters for tiles, geocoding, POI discovery, navigation, notifications and other approved integrations
```

### 3.1 Client boundary

The client is one product with two hosts:

- browser Web;
- Telegram Mini App.

Telegram is a host adapter. It does not create a second user directory, wallet, ledger, database, business workflow, or authorization authority. Telegram launch data is verified by the API and linked to the canonical D01 identity.

The client owns presentation, local interaction state, typed API access, host/device adapters and truthful capability states. It never mints business success, VQ, bookings, messages, location proof, media proof, tickets, or payment proof.

### 3.2 API boundary

The API is the synchronous authority boundary. It owns HTTP/realtime composition, authentication middleware, request validation, transaction coordination and invocation of domain application contracts.

The API must not become a god service. Each domain module has its own application commands/queries, domain rules, persistence adapters and tests. Foreign domains are accessed only through explicit capability ports, commands, events, or authorized read projections. A domain may not import another domain’s infrastructure implementation or write another domain’s tables.

### 3.3 Worker boundary

The Worker is a separate process and deployable boundary. It handles only durable asynchronous work authorized by an owning domain or platform contract:

- transactional-outbox delivery;
- notification attempts and retry/backoff;
- deadlines and expiry;
- media processing and retention cleanup;
- geofence/projection jobs;
- reconciliation and other explicitly owned scheduled work.

Critical truth is committed transactionally before a job is published. Worker execution is idempotent, lease-aware, retryable and observable. A client timer, process memory, Redis key, or job attempt is never the canonical source of business state.

The API must not hide durable schedulers or cleanup loops inside request-serving startup when the work belongs to the Worker.

### 3.4 Admin boundary

Admin Control Room is a privileged application surface, not D29 and not a direct SQL console. It composes owner-domain commands, authorized projections and privileged audit views. D01 owns Admin identity/capability associations. D21 owns Trust & Safety cases and sanctions. Other business facts remain owned by D01–D28.

Admin must not maintain shadow business tables or perform unrestricted second-writer mutations.

## 4. Domain ownership contract

Every canonical business fact has exactly one owner and one canonical writer. Read models, dashboards, search indexes, audit records and notifications may reference facts but may not silently become alternate sources of truth.

| ID | Owner | Canonical responsibility |
|---|---|---|
| D01 | Identity | accounts, sessions, credentials, Telegram links, recovery, Admin capabilities |
| D02 | Profiles | public profile, preferences, privacy and accessibility settings |
| D03 | Social Graph | follow and block relationships |
| D04 | Geo Presence | consented location evidence, freshness, geofences and proximity assertions |
| D05 | Places | Places, check-ins, validation observations and confidence results/policy |
| D06 | Trails | itineraries, stops, order, lineage, edits and published versions |
| D07 | Guardians | Guardian/Legend/Pro eligibility, qualifications, offers and capacity policy |
| D08 | Tours and Reservations | Tour offers, slots, requests, acceptance, decline, cancellation and engagements |
| D09 | Businesses and Organizations | verified organizations, branches and operator authority |
| D10 | Activities | activities, schedules, participation and eligibility |
| D11 | Events | organizer events and RSVP, independent of ticket inventory |
| D12 | Social Content | posts, Vibes, Gossip, reactions, comments and visibility |
| D13 | Global Media | media assets, verification metadata, variants, access and retention |
| D14 | Messaging | conversations, messages, receipts and read state |
| D15 | Live Rooms | room sessions and participant/speaker state |
| D16 | Communities | communities, membership, invitations and roles |
| D17 | Matching | Drift, Pulls, bilateral confirmation and confirmed Vibes |
| D18 | Challenges | VibeCheck/VibeFlash challenges, deadlines, responses and Mosaic eligibility |
| D19 | Recognition | badges, Passport recognition, reputation and Guardian/provider review content |
| D20 | VQ Ledger | reward rules, grants, transfers, immutable postings and corrections |
| D21 | Trust and Safety | reports, cases, decisions, strikes, restrictions, bans and appeals |
| D22 | Handshakes | qualifying agreement identity, issuance, expiry and review-eligibility proof |
| D23 | Notifications | notification inbox, preferences, delivery attempts and deduplication |
| D24 | Advertising | campaigns, sponsorships, placements and impression accounting |
| D25 | Subscriptions | plans, subscriptions and access entitlements |
| D26 | Marketplace | listings, offers, negotiation, deal state and Marketplace review content |
| D27 | Payments and Billing | future/authorized real-money payment boundary and reconciliation |
| D28 | Ticketing | ticket inventory, issuance, validation and admission |

There is no D29. Cross-cutting audit, operations, configuration, outbox, read-model and observability records are infrastructure or projections; they do not own the underlying business fact.

## 5. Cross-domain interaction rules

A cross-domain journey must name:

- the initiating owner;
- the consuming capability;
- the command/query/event contract;
- authorization and privacy requirements;
- transaction/idempotency behavior;
- failure and retry behavior; and
- the canonical writer.

Examples:

- D05 uses authorized D04 location evidence; D04 does not write Place truth.
- D20 evaluates and posts VQ; no other domain updates balances.
- D22 issues a Handshake after the qualifying owner reports the real accepted agreement; D22 does not own review content.
- D23 delivers notifications; it does not create the source event.
- D14 authorizes a conversation only from an explicit source-context contract; it does not fabricate a Vibe, booking, Community, Event or Marketplace deal.
- Admin invokes owner-domain commands; it does not bypass them with SQL.

Foreign infrastructure imports, direct foreign-table writes, duplicated business models, and “temporary” shadow writers are architecture failures, not shortcuts.

## 6. Repository organization

The exact framework may be chosen during S01, but ownership must remain visible:

```text
/
  AGENTS.md
  Master Plan.md
  structure.md
  Requirements.md
  Database.md
  apps/
    client/                 # Web + Telegram host adaptation
    api/
      src/
        bootstrap/          # composition root only
        modules/
          <domain>/
            application/    # commands, queries, ports
            domain/         # pure rules and invariants
            infrastructure/# owner repositories/adapters
            http/           # owner routes/controllers
        projections/        # authorized read models only
        platform/           # config, auth middleware, logging, SQL boundary
    worker/
      src/
        bootstrap/          # Worker composition root
        jobs/               # durable handlers grouped by owner
        outbox/             # claim, lease, retry and delivery mechanics
  packages/
    contracts/              # versioned API/event/error contracts
    testing/                # test helpers and explicit test fixtures only
    design-system/          # UI primitives/tokens, if needed
  database/
    migrations/             # versioned authoritative migrations
    seeds/                  # test/reference data only; never hidden production truth
  docs/
    architecture/
    operations/
    ux-parity/
  .github/workflows/
```

The composition roots are the only places allowed to assemble concrete infrastructure implementations. They wire interfaces; they do not contain business rules.

## 7. Persistence and migration authority

PostgreSQL + PostGIS is the intended authoritative transactional/spatial platform. Physical schema is implemented incrementally from `Database.md` invariants; no speculative all-domain schema is required for S01.

One migration mechanism and one migration authority must be selected. It must:

- run migrations in a controlled order;
- record version, checksum, execution time and result;
- use locking/serialization;
- fail closed on modified applied migrations;
- support expand/contract compatibility;
- expose the installed migration ledger at readiness/operations gates; and
- be run by the designated release/pre-deploy authority, not by every API replica.

The Worker and API must never race to mutate the schema. A migration file in Git is not proof that it is installed.

## 8. Health, readiness and exact identity

Every deployable exposes:

- liveness: process is running and able to answer;
- readiness: required dependencies, configuration, migration compatibility and serving state are valid;
- exact identity: repository, branch/ref, commit SHA, build artifact/revision and environment.

A readiness failure must return a failure status and must not be hidden by a green process or stale deployment. Liveness and readiness are separate checks.

At release gates, verify the actual serving revision—not merely the build log or deployment record—and verify the installed migration ledger, required extensions such as PostGIS, configuration shape, Worker compatibility and representative authorized probes.

## 9. Isolated staging

Staging is a persistent, production-shaped environment isolated from production credentials, users, media, payments and business data. It must include the same runtime boundaries required by the slice:

- client;
- API;
- Worker;
- staging PostgreSQL/PostGIS;
- object storage/media boundary where applicable;
- approved external adapters or explicit test doubles at their adapter boundary.

Staging must deploy from an exact known artifact and expose its serving revision, readiness state and installed migrations. Staging acceptance is not production acceptance.

## 10. Product composition constraints

Home, Explore, Share, Vibe and Purse are five equal root destinations. Guest discovery remains read-only until a protected action requires identity. The client must preserve real permission states and real failure states.

The product must not claim completion from screens, placeholders, seeded interactions, mock accounts, localStorage authority, fabricated coordinates, synthetic camera proof, canned messages, client-minted VQ, pretend payment, fake ticket success, or optimistic success after failed persistence.

## 11. S01 boundary

S01 establishes the engineering substrate only:

- repository/workspace and CI contract;
- client, API and Worker boundaries;
- shared contracts/testing;
- migration mechanism and isolated test database;
- PostgreSQL/PostGIS gate;
- configuration;
- liveness/readiness;
- exact identity observability;
- persistent staging path.

S01 completes no business domain. Five-tab scaffolding is allowed only as explicit unavailable-state navigation. No speculative business records or fake progress may be added.

## 12. Acceptance vocabulary

Use the Master Plan vocabulary only:

`PLANNED`, `READY`, `IN PROGRESS`, `IMPLEMENTED`, `VERIFIED`, `STAGING ACCEPTED`, `PRODUCTION ACCEPTED`, `BLOCKED`.

A green build, route, migration file, screen, or deployment record is not acceptance by itself.
