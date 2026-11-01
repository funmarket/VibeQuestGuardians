# S01-1 Toolchain and Workspace Packet

**Milestone:** S01  
**Task:** S01-1 — reproducible toolchain and empty workspace topology  
**Status:** READY FOR EXPLICIT TASK AUTHORIZATION  
**Repository/branch/HEAD inspected:** funmarket/VibeQuestGuardians / vibefoundation / 4668700a6fcd8d8125431abda74e2c4199969c32  
**Authority:** Product Owner authorization to select and record the S01 technical stack; S01 Technical Decisions.  
**Predecessor:** S01 Implementation Packet.

## Authorized scope

Create only reproducible workspace and quality configuration. This is configuration-only work; it creates no application behavior, database connection, HTTP route, migration, CI workflow, Railway resource, or product UI.

### Exact allowed paths

- .devcontainer/devcontainer.json
- .gitignore
- .npmrc
- .nvmrc
- .prettierignore
- .prettierrc.json
- eslint.config.js
- package.json
- package-lock.json
- tsconfig.base.json
- apps/api/package.json
- apps/api/tsconfig.json
- apps/client/package.json
- apps/client/tsconfig.json
- apps/client/vite.config.ts
- apps/worker/package.json
- apps/worker/tsconfig.json
- packages/contracts/package.json
- packages/contracts/tsconfig.json
- packages/platform-runtime/package.json
- packages/platform-runtime/tsconfig.json
- packages/testing/package.json
- packages/testing/tsconfig.json
- packages/design-system/package.json
- packages/design-system/tsconfig.json

### Explicitly forbidden

- Any src/ application/package source file.
- .github/workflows/.
- database/.
- Railway configuration, service, variable, project, environment, deployment, or migration execution.
- Master Plan.md, Requirements.md, structure.md, Database.md.
- Product routes, product UI, auth/session code, data fixtures, mock backend, fake data, or placeholder capability.

## Ownership and contracts

| Path group | Owner | Responsibility | Must not contain |
|---|---|---|---|
| Root configuration | Platform tooling | Reproducible Node 26/npm workspace, formatting, lint configuration, lockfile policy | Domain logic or provider credentials |
| apps/client configuration | Client boundary | Independent React/Vite build boundary | Product UI or backend access |
| apps/api configuration | API boundary | Independent Fastify build boundary | Routes, migration code, domain logic |
| apps/worker configuration | Worker boundary | Independent Worker build boundary | Job handlers, schema mutation |
| packages/contracts configuration | Contract boundary | Future versioned schema package boundary | Executable readiness logic |
| packages/platform-runtime configuration | Platform runtime boundary | Future pure runtime evaluator boundary | Contract duplication or database connection construction |
| packages/testing configuration | Test boundary | Future explicit test-helper boundary | Production seeds |
| packages/design-system configuration | Client design foundation | Future tokens/accessibility primitive boundary | Product screens |

## Package resolution policy

- Use Node.js 26.x only, recorded in .nvmrc and root engines.
- Use npm workspaces and a committed package-lock.json.
- Resolve runtime and dev dependencies with npm install --save-exact; record exact versions in package.json and lockfile.
- Use npm ci for all subsequent installs.
- Do not add a dependency merely because a historical attempt used it.
- Required package families are restricted to: TypeScript, ESLint, Prettier, Fastify, React, React DOM, Vite, Vitest, pg, and the smallest necessary type packages. Any additional dependency requires a decision-log entry.

## Behavior matrix

| Case | Expected behavior | Proof |
|---|---|---|
| Valid Node/npm environment | Frozen installation is reproducible from the committed lockfile. | Remote Codespaces/devcontainer run of npm ci. |
| Wrong Node major | Installation/check command fails with an explicit engine mismatch. | Remote environment command evidence. |
| Untracked dependency change | npm ci rejects mismatch between manifest and lockfile. | Focused remote command evidence. |
| Formatter/linter configuration absent or invalid | Dedicated config command fails rather than silently skipping files. | Focused remote command evidence. |
| Empty workspace | No app/package source, route, migration, or product behavior is present. | Tree inspection. |
| Repeated install | No lockfile drift. | Clean-tree check after second npm ci. |
| CI unavailable | Task remains IMPLEMENTED at most; it cannot claim CI or S01 verification. | Evidence ledger. |

## Tests and expected red evidence

This task is configuration-only and is exempt from production behavior TDD. It must not introduce production behavior.

Before the next source-bearing task, S01-2 must create and observe failing tests for:

1. runtime configuration validation;
2. canonical runtime-identity contract;
3. versioned error-envelope contract;
4. no duplicate readiness/identity type definition.

## Remote verification design

The non-local development verifier is a GitHub Codespace opened from .devcontainer/devcontainer.json.

Required observed commands after S01-1 implementation:

~~~text
node --version                  # expected v26.x
npm --version                   # recorded in evidence
npm ci                          # expected success
npm ci                          # expected second success with no lockfile drift
npm run format:check            # expected success across all tracked files
npm run lint:config             # expected success; no silent empty-file bypass
git diff --exit-code            # expected success after second install
~~~

CI is not part of S01-1 and is not a substitute for this remote verification.

## Cleanup, retry, and stop conditions

- No database, network service, migration, worker, API, or browser process is created.
- A failed dependency resolution stops the task; do not substitute a different package/version without recording a new decision.
- A lockfile or format/lint failure stops the task; do not weaken the command.
- If Codespaces/devcontainer verification is unavailable, record BLOCKED; do not claim S01-1 verified from GitHub Actions alone.
- After a successful S01-1, update EXECUTION_PLAN.md with exact commit, commands, environment, and results. The next permissible task is S01-2 only after its own packet is approved.

## No-fake confirmation

S01-1 cannot create a mock backend, fake API, fake user, seed business authority, synthetic device/provider state, localStorage authority, placeholder product feature, or partial domain implementation.
