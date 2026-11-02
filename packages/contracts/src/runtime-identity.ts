export interface RuntimeIdentity {
  repository: string;
  ref: string;
  commit: string;
  build: string;
  servingRevision: string;
  environment: string;
}

function requiredString(value: unknown, field: keyof RuntimeIdentity): string {
  if (typeof value !== 'string' || value.length === 0 || /\s/.test(value)) {
    throw new Error(`Invalid runtime identity field: ${field}`);
  }
  return value;
}

export function parseRuntimeIdentity(input: unknown): RuntimeIdentity {
  if (typeof input !== 'object' || input === null) {
    throw new Error('Invalid runtime identity');
  }

  const value = input as Record<string, unknown>;
  const repository = requiredString(value.repository, 'repository');
  const ref = requiredString(value.ref, 'ref');
  const commit = requiredString(value.commit, 'commit');
  const build = requiredString(value.build, 'build');
  const servingRevision = requiredString(
    value.servingRevision,
    'servingRevision',
  );
  const environment = requiredString(value.environment, 'environment');

  if (!/^[^/\s]+\/[^/\s]+$/.test(repository)) {
    throw new Error('Invalid runtime identity repository');
  }
  if (!/^[0-9a-f]{40}$/i.test(commit)) {
    throw new Error('Invalid runtime identity commit');
  }

  return { repository, ref, commit, build, servingRevision, environment };
}
