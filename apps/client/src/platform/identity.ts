import {
  IdentityContractError,
  parseCanonicalPrincipal,
  type CanonicalPrincipal,
} from '../../../../packages/contracts/src/identity-host.js';

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

export interface SessionTransport {
  request: () => Promise<Response>;
}

export interface BearerSessionTransportOptions {
  apiOrigin: string;
  getBearerToken: () => string | undefined;
  fetcher?: SessionFetcher;
}

export class SessionTransportUnavailableError extends Error {
  constructor() {
    super('A verified bearer-session transport is unavailable');
    this.name = 'SessionTransportUnavailableError';
  }
}

function normalizeApiOrigin(apiOrigin: string): string {
  let parsed: URL;
  try {
    parsed = new URL(apiOrigin);
  } catch {
    throw new TypeError('API origin must be an absolute URL');
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new TypeError('API origin must use HTTP or HTTPS');
  }
  return parsed.toString().replace(/\/$/, '');
}

export function createBearerSessionTransport(
  options: BearerSessionTransportOptions,
): SessionTransport {
  const apiOrigin = normalizeApiOrigin(options.apiOrigin);
  const fetcher = options.fetcher ?? fetch;

  return {
    request: () => {
      const token = options.getBearerToken();
      const headers = new Headers({ Accept: 'application/json' });
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return fetcher(`${apiOrigin}/me`, {
        credentials: 'omit',
        headers,
      });
    },
  };
}

export function createUnavailableSessionTransport(): SessionTransport {
  return {
    async request() {
      throw new SessionTransportUnavailableError();
    },
  };
}

export async function resolveSession(
  transport: SessionTransport,
  options: { previous?: SessionStatus } = {},
): Promise<ClientSession> {
  try {
    const response = await transport.request();

    if (response.status === 401) {
      return options.previous === 'authenticated'
        ? { status: 'expired' }
        : { status: 'guest' };
    }
    if (response.status === 403) return { status: 'denied' };
    if (response.status >= 500) return { status: 'unavailable' };
    if (!response.ok) return { status: 'denied' };

    const payload: unknown = await response.json();
    try {
      return {
        status: 'authenticated',
        principal: parseCanonicalPrincipal(payload),
      };
    } catch (error) {
      if (error instanceof IdentityContractError) return { status: 'denied' };
      return { status: 'denied' };
    }
  } catch (error) {
    return error instanceof SessionTransportUnavailableError
      ? { status: 'unavailable' }
      : { status: 'offline' };
  }
}

export function createSessionController(transport: SessionTransport): {
  load: (previous?: SessionStatus) => Promise<ClientSession>;
  refresh: (previous?: SessionStatus) => Promise<ClientSession>;
} {
  let inFlight: Promise<ClientSession> | undefined;

  const load = (previous?: SessionStatus): Promise<ClientSession> => {
    if (inFlight) return inFlight;
    inFlight = resolveSession(transport, { previous }).finally(() => {
      inFlight = undefined;
    });
    return inFlight;
  };

  return { load, refresh: load };
}
