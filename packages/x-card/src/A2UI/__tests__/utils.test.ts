/**
 * utils.ts 测试用例
 * 覆盖 getValueByPath, setValueByPath, isPathValue, isPathObject, validateComponentAgainstCatalog
 */
import {
  getValueByPath,
  setValueByPath,
  isPathValue,
  isPathObject,
  validateComponentAgainstCatalog,
} from '../utils';

describe('getValueByPath', () => {
  it('should get top-level value', () => {
    const obj = { name: 'Alice' };
    expect(getValueByPath(obj, '/name')).toBe('Alice');
  });

  it('should get nested value', () => {
    const obj = { booking: { date: '2024-01-01' } };
    expect(getValueByPath(obj, '/booking/date')).toBe('2024-01-01');
  });

  it('should get deeply nested value', () => {
    const obj = { a: { b: { c: 42 } } };
    expect(getValueByPath(obj, '/a/b/c')).toBe(42);
  });

  it('should return undefined for missing path', () => {
    const obj = { name: 'Alice' };
    expect(getValueByPath(obj, '/missing')).toBeUndefined();
  });

  it('should return undefined for nested missing path', () => {
    const obj = { a: {} };
    expect(getValueByPath(obj, '/a/b/c')).toBeUndefined();
  });

  it('should handle path without leading slash', () => {
    const obj = { name: 'Alice' };
    expect(getValueByPath(obj, 'name')).toBe('Alice');
  });

  it('should return null value correctly', () => {
    const obj = { value: null };
    expect(getValueByPath(obj, '/value')).toBeNull();
  });

  it('should return false value correctly', () => {
    const obj = { flag: false };
    expect(getValueByPath(obj, '/flag')).toBe(false);
  });

  it('should return 0 value correctly', () => {
    const obj = { count: 0 };
    expect(getValueByPath(obj, '/count')).toBe(0);
  });
});

describe('setValueByPath', () => {
  it('should set top-level value', () => {
    const obj = { name: 'Alice' };
    const result = setValueByPath(obj, '/name', 'Bob');
    expect(result.name).toBe('Bob');
  });

  it('should set nested value', () => {
    const obj = { booking: { date: '2024-01-01' } };
    const result = setValueByPath(obj, '/booking/date', '2024-12-31');
    expect(result.booking.date).toBe('2024-12-31');
  });

  it('should create nested path if not exists', () => {
    const obj = {};
    const result = setValueByPath(obj, '/a/b/c', 'value');
    expect((result as any).a.b.c).toBe('value');
  });

  it('should be immutable (not mutate original)', () => {
    const obj = { name: 'Alice' };
    const result = setValueByPath(obj, '/name', 'Bob');
    expect(obj.name).toBe('Alice');
    expect(result.name).toBe('Bob');
  });

  it('should handle path without leading slash', () => {
    const obj = { name: 'Alice' };
    const result = setValueByPath(obj, 'name', 'Bob');
    expect(result.name).toBe('Bob');
  });

  it('should preserve other keys', () => {
    const obj = { name: 'Alice', age: 30 };
    const result = setValueByPath(obj, '/name', 'Bob');
    expect(result.age).toBe(30);
  });

  it('should set null value', () => {
    const obj = { name: 'Alice' };
    const result = setValueByPath(obj, '/name', null);
    expect(result.name).toBeNull();
  });

  it('should handle deeply nested existing path', () => {
    const obj = { a: { b: { c: 1, d: 2 } } };
    const result = setValueByPath(obj, '/a/b/c', 99);
    expect((result as any).a.b.c).toBe(99);
    expect((result as any).a.b.d).toBe(2);
  });
});

describe('isPathValue', () => {
  it('should return true for string starting with /', () => {
    expect(isPathValue('/user/name')).toBe(true);
  });

  it('should return true for simple path', () => {
    expect(isPathValue('/name')).toBe(true);
  });

  it('should return false for string not starting with /', () => {
    expect(isPathValue('name')).toBe(false);
  });

  it('should return false for empty string', () => {
    expect(isPathValue('')).toBe(false);
  });

  it('should return false for number', () => {
    expect(isPathValue(42)).toBe(false);
  });

  it('should return false for null', () => {
    expect(isPathValue(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isPathValue(undefined)).toBe(false);
  });

  it('should return false for object', () => {
    expect(isPathValue({ path: '/name' })).toBe(false);
  });

  it('should return false for boolean', () => {
    expect(isPathValue(true)).toBe(false);
  });
});

describe('isPathObject', () => {
  it('should return true for { path: string }', () => {
    expect(isPathObject({ path: '/user/name' })).toBe(true);
  });

  it('should return true for path object with other fields', () => {
    expect(isPathObject({ path: '/name', extra: 'value' })).toBe(true);
  });

  it('should return false for null', () => {
    expect(isPathObject(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isPathObject(undefined)).toBe(false);
  });

  it('should return false for string', () => {
    expect(isPathObject('/name')).toBe(false);
  });

  it('should return false for object without path', () => {
    expect(isPathObject({ name: 'Alice' })).toBe(false);
  });

  it('should return false for object with non-string path', () => {
    expect(isPathObject({ path: 42 })).toBe(false);
  });

  it('should return false for array', () => {
    expect(isPathObject(['/name'])).toBe(false);
  });

  it('should return false for number', () => {
    expect(isPathObject(42)).toBe(false);
  });
});

describe('validateComponentAgainstCatalog', () => {
  it('should return valid when no catalog', () => {
    const result = validateComponentAgainstCatalog(undefined, 'Button', { label: 'Click' });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should return valid when catalog has no components', () => {
    const result = validateComponentAgainstCatalog({}, 'Button', { label: 'Click' });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should return invalid when component not in catalog', () => {
    const catalog = { components: { Input: { type: 'object' as const } } };
    const result = validateComponentAgainstCatalog(catalog, 'Button', {});
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toContain('Button');
  });

  it('should return valid when component in catalog with no required fields', () => {
    const catalog = {
      components: {
        Button: { type: 'object' as const, properties: { label: { type: 'string' } } },
      },
    };
    const result = validateComponentAgainstCatalog(catalog, 'Button', { label: 'Click' });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should return errors for missing required fields', () => {
    const catalog = {
      components: {
        Button: {
          type: 'object' as const,
          required: ['label'],
          properties: { label: { type: 'string' } },
        },
      },
    };
    const result = validateComponentAgainstCatalog(catalog, 'Button', {});
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('label'))).toBe(true);
  });

  it('should return errors for undefined props not in schema', () => {
    const catalog = {
      components: {
        Button: {
          type: 'object' as const,
          properties: { label: { type: 'string' } },
        },
      },
    };
    const result = validateComponentAgainstCatalog(catalog, 'Button', {
      label: 'Click',
      unknownProp: 'value',
    });
    expect(result.errors.some((e) => e.includes('unknownProp'))).toBe(true);
  });

  it('should ignore id, children, component fields in prop validation', () => {
    const catalog = {
      components: {
        Button: {
          type: 'object' as const,
          properties: { label: { type: 'string' } },
        },
      },
    };
    const result = validateComponentAgainstCatalog(catalog, 'Button', {
      label: 'Click',
      id: 'btn1',
      children: [],
      component: 'Button',
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should handle multiple required fields', () => {
    const catalog = {
      components: {
        Form: {
          type: 'object' as const,
          required: ['title', 'onSubmit'],
          properties: {
            title: { type: 'string' },
            onSubmit: { type: 'object' },
          },
        },
      },
    };
    const result = validateComponentAgainstCatalog(catalog, 'Form', {});
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(2);
  });

  it('should return valid when all required fields present', () => {
    const catalog = {
      components: {
        Button: {
          type: 'object' as const,
          required: ['label'],
          properties: { label: { type: 'string' } },
        },
      },
    };
    const result = validateComponentAgainstCatalog(catalog, 'Button', { label: 'Click' });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should handle component with no properties defined', () => {
    const catalog = {
      components: {
        Button: { type: 'object' as const },
      },
    };
    const result = validateComponentAgainstCatalog(catalog, 'Button', { label: 'Click' });
    expect(result.valid).toBe(true);
  });
});
