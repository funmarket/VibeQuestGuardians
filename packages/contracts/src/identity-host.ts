export type HostKind = 'web' | 'telegram';

export type IdentityErrorCode =
  | 'MISSING_CONTEXT'
  | 'INVALID_CONTEXT'
  | 'EXPIRED_SESSION'
  | 'REVOKED_SESSION'
  | 'REPLAYED_CONTEXT'
  | 'DUPLICATE_LINK'
  | 'UNAUTHORIZED';

export class IdentityContractError extends Error {
  constructor(
    public readonly code: IdentityErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'IdentityContractError';
  }
}

export interface CanonicalPrincipal {
  accountId: string;
  sessionId: string;
  host: HostKind;
  capabilities: string[];
}

interface VerifiedSessionAssertion {
  status: 'verified';
  method: 'session';
}

interface VerifiedTelegramAssertion {
  status: 'verified';
  method: 'telegram-init-data';
}

export interface WebHostContextAssertion {
  kind: 'web';
  principal: unknown;
  sessionId: string;
  verification: VerifiedSessionAssertion;
}

export interface TelegramHostContextAssertion {
  kind: 'telegram';
  principal: unknown;
  initData: string;
  replayKey: string;
  verification: VerifiedTelegramAssertion;
}

export type HostContextAssertion =
  WebHostContextAssertion | TelegramHostContextAssertion;

export interface SessionState {
  expiresAt: number;
  revokedAt: number | null;
}

export interface ReplayGuard {
  claim: (key: string) => boolean | Promise<boolean>;
}

export interface ProviderLinkRegistry {
  isLinked: (provider: string, subject: string) => boolean | Promise<boolean>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function requiredString(
  value: unknown,
  code: IdentityErrorCode,
  field: string,
): string {
  if (typeof value !== 'string' || value.length === 0 || /\s/.test(value)) {
    throw new IdentityContractError(code, `${field} is required`);
  }
  return value;
}

function invalidContext(message: string): never {
  throw new IdentityContractError('INVALID_CONTEXT', message);
}

export function parseCanonicalPrincipal(input: unknown): CanonicalPrincipal {
  if (input === undefined || input === null) {
    throw new IdentityContractError(
      'MISSING_CONTEXT',
      'Canonical principal is required',
    );
  }
  if (!isRecord(input)) {
    return invalidContext('Canonical principal must be an object');
  }

  const accountId = requiredString(
    input.accountId,
    'INVALID_CONTEXT',
    'accountId',
  );
  const sessionId = requiredString(
    input.sessionId,
    'INVALID_CONTEXT',
    'sessionId',
  );
  const host = input.host;
  if (host !== 'web' && host !== 'telegram') {
    return invalidContext('Canonical principal host is invalid');
  }
  if (
    !Array.isArray(input.capabilities) ||
    input.capabilities.some(
      (capability) =>
        typeof capability !== 'string' ||
        capability.length === 0 ||
        /\s/.test(capability),
    )
  ) {
    return invalidContext('Canonical principal capabilities are invalid');
  }

  return {
    accountId,
    sessionId,
    host,
    capabilities: [...new Set(input.capabilities)],
  };
}

function requireVerifiedAssertion(
  input: unknown,
  expectedMethod:
    VerifiedSessionAssertion['method'] | VerifiedTelegramAssertion['method'],
): void {
  if (!isRecord(input)) {
    return invalidContext('Host verification is required');
  }
  if (input.status !== 'verified' || input.method !== expectedMethod) {
    return invalidContext('Host verification is invalid');
  }
}

export function resolveHostPrincipal(input: unknown): CanonicalPrincipal {
  if (input === undefined || input === null) {
    throw new IdentityContractError(
      'MISSING_CONTEXT',
      'Host context is required',
    );
  }
  if (!isRecord(input)) {
    return invalidContext('Host context must be an object');
  }

  const principal = parseCanonicalPrincipal(input.principal);
  if (input.kind === 'web') {
    requireVerifiedAssertion(input.verification, 'session');
    const sessionId = requiredString(
      input.sessionId,
      'INVALID_CONTEXT',
      'sessionId',
    );
    if (principal.host !== 'web' || principal.sessionId !== sessionId) {
      return invalidContext('Web host does not match the canonical principal');
    }
    return principal;
  }

  if (input.kind === 'telegram') {
    requireVerifiedAssertion(input.verification, 'telegram-init-data');
    const initData = requiredString(
      input.initData,
      'INVALID_CONTEXT',
      'initData',
    );
    const replayKey = requiredString(
      input.replayKey,
      'INVALID_CONTEXT',
      'replayKey',
    );
    if (principal.host !== 'telegram') {
      return invalidContext(
        'Telegram host does not match the canonical principal',
      );
    }
    void initData;
    void replayKey;
    return principal;
  }

  return invalidContext('Host kind is invalid');
}

export function assertSessionActive(
  session: SessionState,
  now = Date.now(),
): void {
  if (
    !Number.isFinite(session.expiresAt) ||
    session.expiresAt <= 0 ||
    (session.revokedAt !== null && !Number.isFinite(session.revokedAt))
  ) {
    return invalidContext('Session state is invalid');
  }
  if (session.revokedAt !== null && session.revokedAt <= now) {
    throw new IdentityContractError('REVOKED_SESSION', 'Session is revoked');
  }
  if (session.expiresAt <= now) {
    throw new IdentityContractError('EXPIRED_SESSION', 'Session is expired');
  }
}

export function assertCapability(
  principal: CanonicalPrincipal,
  capability: string,
): void {
  if (!principal.capabilities.includes(capability)) {
    throw new IdentityContractError(
      'UNAUTHORIZED',
      'Required capability is missing',
    );
  }
}

export async function assertNotReplayed(
  replayKey: string,
  guard: ReplayGuard,
): Promise<void> {
  requiredString(replayKey, 'INVALID_CONTEXT', 'replayKey');
  if (!(await guard.claim(replayKey))) {
    throw new IdentityContractError(
      'REPLAYED_CONTEXT',
      'Host context has already been used',
    );
  }
}

export async function assertProviderLinkAvailable(
  provider: string,
  subject: string,
  registry: ProviderLinkRegistry,
): Promise<void> {
  requiredString(provider, 'INVALID_CONTEXT', 'provider');
  requiredString(subject, 'INVALID_CONTEXT', 'subject');
  if (await registry.isLinked(provider, subject)) {
    throw new IdentityContractError(
      'DUPLICATE_LINK',
      'Provider link already exists',
    );
  }
}
