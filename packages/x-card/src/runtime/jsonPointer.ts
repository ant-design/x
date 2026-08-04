const blockedKeys = new Set(['__proto__', 'prototype', 'constructor']);

export class JsonPointerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'JsonPointerError';
  }
}

export function escapeJsonPointerSegment(segment: string): string {
  return segment.replace(/~/g, '~0').replace(/\//g, '~1');
}

function parseJsonPointer(path: string): string[] {
  if (!path.startsWith('/') || path === '/') {
    throw new JsonPointerError(`Data path "${path}" must point to a non-root JSON Pointer.`);
  }

  return path
    .slice(1)
    .split('/')
    .map((segment) => {
      if (/~(?:[^01]|$)/.test(segment)) {
        throw new JsonPointerError(`Data path "${path}" contains an invalid escape sequence.`);
      }
      const decoded = segment.replace(/~1/g, '/').replace(/~0/g, '~');
      if (blockedKeys.has(decoded)) {
        throw new JsonPointerError(`Data path "${path}" contains a blocked key.`);
      }
      return decoded;
    });
}

const cloneContainer = (value: unknown): Record<string, unknown> | unknown[] => {
  if (Array.isArray(value)) return [...value];
  if (value && typeof value === 'object') return { ...(value as Record<string, unknown>) };
  return {};
};

export function setValueAtJsonPointer(
  value: Readonly<Record<string, unknown>>,
  path: string,
  nextValue: unknown,
): Readonly<Record<string, unknown>> {
  const segments = parseJsonPointer(path);
  const root = cloneContainer(value) as Record<string, unknown>;
  let target: Record<string, unknown> | unknown[] = root;
  let source: unknown = value;

  for (let index = 0; index < segments.length - 1; index += 1) {
    const segment = segments[index];
    const sourceChild =
      source && typeof source === 'object'
        ? (source as Record<string, unknown>)[segment]
        : undefined;
    const child = cloneContainer(sourceChild);
    (target as Record<string, unknown>)[segment] = child;
    target = child;
    source = sourceChild;
  }

  (target as Record<string, unknown>)[segments[segments.length - 1]] = nextValue;
  return root;
}
