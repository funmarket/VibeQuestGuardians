export interface CanonicalPrincipal {
  accountId: string;
  sessionId: string;
  host: 'web' | 'telegram';
  capabilities: string[];
}

export type SessionStatus =
  | 'loading'
  | 'authenticated'
  | 'guest'
  | 'expired'
  | 'denied'
  | 'offline'
  | 'unavailable';

export type ClientSession =
  | {
      status:
        'loading' | 'guest' | 'expired' | 'denied' | 'offline' | 'unavailable';
    }
  | { status: 'authenticated'; principal: CanonicalPrincipal };

export type SessionFetcher = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

function isPrincipal(value: unknown): value is CanonicalPrincipal {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.accountId === 'string' &&
    candidate.accountId.length > 0 &&
    typeof candidate.sessionId === 'string' &&
    candidate.sessionId.length > 0 &&
    (candidate.host === 'web' || candidate.host === 'telegram') &&
    Array.isArray(candidate.capabilities) &&
    candidate.capabilities.every(
      (capability) => typeof capability === 'string' && capability.length > 0,
    )
  );
}

export async function resolveSession(
  fetcher: SessionFetcher,
  options: { previous?: SessionStatus } = {},
): Promise<ClientSession> {
  try {
    const response = await fetcher('/me', {
      credentials: 'include',
      headers: { Accept: 'application/json' },
    });

    if (response.status === 401) {
      return options.previous === 'authenticated'
        ? { status: 'expired' }
        : { status: 'guest' };
    }
    if (response.status === 403) return { status: 'denied' };
    if (response.status >= 500) return { status: 'unavailable' };
    if (!response.ok) return { status: 'denied' };

    const payload: unknown = await response.json();
    return isPrincipal(payload)
      ? { status: 'authenticated', principal: payload }
      : { status: 'denied' };
  } catch {
    return { status: 'offline' };
  }
}

let sessionRequest: Promise<ClientSession> | undefined;

export function loadSessionOnce(
  fetcher: SessionFetcher = fetch,
): Promise<ClientSession> {
  sessionRequest ??= resolveSession(fetcher);
  return sessionRequest;
}

export function resetSessionRequestForTests(): void {
  sessionRequest = undefined;
}
