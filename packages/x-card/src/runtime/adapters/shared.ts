import type {
  SurfaceInput,
  SurfaceNodeInput,
  SurfaceOperation,
  SurfaceTransaction,
} from '../types';

export class SurfaceAdapterError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SurfaceAdapterError';
  }
}

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

export const requireRecord = (value: unknown, label: string): Record<string, unknown> => {
  if (!isRecord(value)) throw new SurfaceAdapterError(`${label} must be an object.`);
  return value;
};

export const requireString = (value: unknown, label: string): string => {
  if (typeof value !== 'string' || value === '') {
    throw new SurfaceAdapterError(`${label} must be a non-empty string.`);
  }
  return value;
};

export const readChildren = (
  child: unknown,
  children: unknown,
  label: string,
): readonly string[] => {
  if (children !== undefined) {
    if (!Array.isArray(children) || children.some((item) => typeof item !== 'string' || !item)) {
      throw new SurfaceAdapterError(`${label}.children must be an array of non-empty strings.`);
    }
    return children;
  }
  if (child === undefined) return [];
  return [requireString(child, `${label}.child`)];
};

export const createTransaction = (
  input: SurfaceInput,
  surfaceId: string,
  operations: readonly SurfaceOperation[],
): SurfaceTransaction => ({
  transactionId:
    input.eventId ?? `${input.protocol}:${input.version}:${input.sequence ?? 'unsequenced'}`,
  surfaceId,
  source: {
    protocol: input.protocol,
    version: input.version.replace(/^v/, ''),
    eventId: input.eventId,
    sequence: input.sequence,
  },
  operations,
});

export const createNode = (
  id: string,
  type: string,
  source: Record<string, unknown>,
  children: readonly string[],
  structuralKeys: readonly string[],
): SurfaceNodeInput => {
  const props: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(source)) {
    if (!structuralKeys.includes(key)) props[key] = value;
  }
  return { id, type, props, children };
};
