export interface ProfileRecord {
  id: string;
  accountId: string;
  displayName: string | null;
  fixtureNamespace: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FixtureRecord {
  environment: string;
  namespace: string;
  recordType: string;
  recordId: string;
  ownerAccountId: string;
}

export function assertFixtureNamespace(namespace: string): void {
  if (!/^[a-z0-9][a-z0-9._-]{1,63}$/.test(namespace)) {
    throw new Error('Fixture namespace is invalid');
  }
}

export function assertFixtureEnvironment(environment: string): void {
  if (environment === 'production') {
    throw new Error('Development fixtures are not allowed in production');
  }
  if (!/^[a-z][a-z0-9._-]{1,31}$/.test(environment)) {
    throw new Error('Fixture environment is invalid');
  }
}
