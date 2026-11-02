export const ERROR_ENVELOPE_VERSION = 1 as const;

export type ErrorCategory =
  | 'VALIDATION_ERROR'
  | 'AUTHORIZATION_ERROR'
  | 'DEPENDENCY_ERROR'
  | 'DUPLICATE_REQUEST'
  | 'INTERNAL_ERROR';

export interface ErrorEnvelope {
  version: typeof ERROR_ENVELOPE_VERSION;
  error: {
    category: ErrorCategory;
    message: string;
    status: number;
  };
}

const publicMessages = new Set([
  'Request validation failed',
  'Authorization required',
  'Required dependency unavailable',
  'Duplicate request',
  'Unexpected server error',
]);

export function createErrorEnvelope(
  category: ErrorCategory,
  message: string,
  status: number,
  _details?: unknown,
): ErrorEnvelope {
  if (!publicMessages.has(message)) {
    throw new Error('Error message is not an approved public message');
  }
  if (!Number.isInteger(status) || status < 400 || status > 599) {
    throw new Error('Error status must be an HTTP failure status');
  }
  return {
    version: ERROR_ENVELOPE_VERSION,
    error: { category, message, status },
  };
}

export function errorResponse(
  category: ErrorCategory,
  message: string,
  status: number,
): ErrorEnvelope {
  return createErrorEnvelope(category, message, status);
}
