# VibeQuestGuardians — VibeQuest

**Project stage:** product reconstruction and design review. **This repository is not yet proof of a complete, production-ready application.**

VibeQuestGuardians is the clean new implementation project for **VibeQuest**, a location-aware discovery and social-experience product. The historical VibeQuest application is a **reference for the intended experience and user journeys**, not a codebase to copy wholesale or proof that every historic capability functioned securely or in production.

The product combines place discovery, user-created Trails, Guardians and Local Legends, activities and organizer-created events, social content and communities, messaging and live experiences, matching, challenges, recognition, VQ rewards, marketplace and commercial capabilities, with a consistent guest-first experience across Web and Telegram.

## Product vision and navigation

The directed primary navigation is **Home → Explore → Share (elevated central heart) → Vibe → Purse**. Public places, Trails, advertising and other public content should be discoverable without requiring sign-in; actions that change private or shared business state require appropriate server-verified identity and permission. One canonical product experience will serve browser and Telegram through separately deployed frontend-serving instances, with shared authoritative identity/API/database contracts.

The design must preserve approved historical interactions while replacing simulations and unsafe shortcuts with genuine, verifiable functionality. In particular, no fabricated location/camera proof, browser-only account authority, synthetic notification delivery, fake wallet transactions or client-controlled rewards may be used as production evidence.

## Scope and product invariants

- **28 business domains** are included in the intended *complete initial application*; no domain is silently deferred. The domain register is a **candidate pending its stated final acceptance gates**, not an approved physical service/schema topology.
- **VibeCheck expires after 180 seconds** and **VibeFlash after 33 seconds**, measured authoritatively by the server. Their remaining eligibility, proof and cooldown policies are not all decided.
- **VQ** is the only in-app reward unit, distinct from reputation and real-money billing; administrators govern eligible awards. Do not introduce the old Points balance or an implied cryptocurrency.
- **Ticketing** is independent from Events and Guardian Reservations and may support tickets not associated with a published Event. Events and user-created Activities are separate.
- Global Media owns file processing and delivery; feature domains own attachment meaning and authorization. Geo owns location evidence; Search/Discovery is a read projection. Each authoritative business fact has one canonical writer.
- Interface defaults respect device/host language, appearance and accessibility where supported, with user overrides. Notifications belong in the top app bar and personal settings in the profile menu.

## Repository and release policy

| Item | Role |
| --- | --- |
| [`main`](https://github.com/funmarket/VibeQuestGuardians/tree/main) | Stable/release branch; promotion requires explicit Product Owner authorization and release acceptance |
| [`vibefoundation`](https://github.com/funmarket/VibeQuestGuardians/tree/vibefoundation) | Integration branch for approved design and authorized implementation |
| [`AGENTS.md`](AGENTS.md) | Mandatory ChatGPT agent operating, evidence, ownership and release-safety rules |
| [`docs/product-design/`](docs/product-design/) | Project evidence, current product decisions and approved/reviewing governing documents |

**Do not** merge to `main`, install a database schema, deploy, or change external services merely because a documentation file exists or a prior agent claimed success. Read the current branch, commit, source and approval statuses first.

## Document index and authority

| Document | Role and current status |
| --- | --- |
| [`AGENTS.md`](AGENTS.md) | Published mandatory agent instructions |
| [`00_SOURCE_BASELINE.md`](docs/product-design/00_SOURCE_BASELINE.md) | Historical source/evidence baseline; labeled draft for Product Owner review |
| [`01_PRODUCT_DECISIONS_AND_IDEAS.md`](docs/product-design/01_PRODUCT_DECISIONS_AND_IDEAS.md) | Living decisions and open-policy register; not a finished requirements specification |
| [`02_DOMAIN_OWNERSHIP_FINAL_LEAN.md`](docs/product-design/02_DOMAIN_OWNERSHIP_FINAL_LEAN.md) | 28-domain final **candidate**, awaiting its own approval and 215-feature cross-check |
| `Requirements.md` | Planned complete user journeys, functional and nonfunctional requirements, feature traceability and acceptance tests; **not yet published in this directory** |
| `Structure.md` | Planned architecture and domain interaction contracts; **not yet published** |
| `Database.md` | Planned canonical entity/schema and migration design; **not yet published** |
| Master Build Plan | Planned authorized dependency-ordered implementation and release sequence; **not yet published** |

**Historical 215-feature register:** the preserved 215 IDs are source-reconstruction coverage, *not* 215 verified deployed implementations and not the full new-product scope. The local review CSV and QA/extraction documents should not be described as approved GitHub source until the complete semantic review and explicit publication approval occur.

## Historical source boundaries

- **New implementation authority:** [`funmarket/VibeQuestGuardians`](https://github.com/funmarket/VibeQuestGuardians), exact current ref and approved requirements.
- **Old reconstruction/reference only:** [`funmarket/VibeQuest`](https://github.com/funmarket/VibeQuest), legacy ZIPs, Gemini/Manus files, earlier reports and source registers. Preserve valuable product knowledge while checking source, execution paths and mock behavior.
- Old Web/API revisions diverged, and an attempted API deployment failed readiness while the previous API kept serving. The *specific root cause was not proven*. The new project requires target-environment migration inventory, cross-version API/DB compatibility, real readiness, controlled rollout and evidence that the desired revision is serving. See [`AGENTS.md`](AGENTS.md).

## Working on this project

1. Read [`AGENTS.md`](AGENTS.md) in full and establish the exact repository, branch, commit, requested action and authorization boundary.
2. Read existing product-design files and identify their individual acceptance status; an existing file with `FINAL` in its name is not automatically approved.
3. Inspect all relevant source/reference files and trace behaviors before drafting requirements, mapping ownership or implementing.
4. Work one approved semantic outcome at a time and complete **Inspect → Implement (if authorized) → Verify → Reconcile → Close → Report**. Correct in-scope mistakes without unnecessary extra approvals, but stop on material drift or new unapproved effects.
5. Verify real output files, semantic ownership, tests and actual runtime evidence as appropriate. Do not claim a feature is delivered merely because a file, route, migration or green CI exists.
6. Submit complete governing-document candidates for Product Owner review before authoritative publication. Existing approvals remain valid within their recorded scope.

## Setup, local development and deployment

**Not documented as executable yet.** The new repository currently serves as a controlled design/documentation baseline. This README intentionally does not invent install commands, package managers, environment variable names, API URLs, database credentials, service topology or deployment instructions from the historical app. Add these only after the new code and approved architecture exist and the commands have been checked against the exact repository state.

## What remains open

The governing product requirements, 215-record semantic cross-check, outstanding genuine policy choices (including Handshake/Guardian/booking and financial boundaries), final architecture, database and release plan still require completion/acceptance. Those are **not permission to defer source-inspectable engineering work** or quietly exclude any of the 28 domains. See the living decision register for the current owner-policy questions.

**Status rule:** this README is a navigation and truth-in-status overview, not evidence of launch readiness or blanket Product Owner approval of other documents.
