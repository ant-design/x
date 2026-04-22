/**
 * Card.v0.8.ts 测试用例
 * 覆盖 isLiteralStringObject, resolvePropsV08, resolveActionContextV08, extractDataUpdatesV08, applyDataModelUpdateV08
 */
import {
  isLiteralStringObject,
  resolvePropsV08,
  resolveActionContextV08,
  extractDataUpdatesV08,
  applyDataModelUpdateV08,
} from '../Card.v0.8';

describe('isLiteralStringObject', () => {
  it('should return true for { literalString: string }', () => {
    expect(isLiteralStringObject({ literalString: 'hello' })).toBe(true);
  });

  it('should return false for null', () => {
    expect(isLiteralStringObject(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isLiteralStringObject(undefined)).toBe(false);
  });

  it('should return false for string', () => {
    expect(isLiteralStringObject('hello')).toBe(false);
  });

  it('should return false for object without literalString', () => {
    expect(isLiteralStringObject({ path: '/name' })).toBe(false);
  });

  it('should return false for object with non-string literalString', () => {
    expect(isLiteralStringObject({ literalString: 123 })).toBe(false);
  });

  it('should return true for object with extra fields', () => {
    expect(isLiteralStringObject({ literalString: 'hello', extra: 'value' })).toBe(true);
  });
});

describe('resolvePropsV08', () => {
  it('should resolve literal string values', () => {
    const props = {
      text: { literalString: 'Hello World' },
    };
    const result = resolvePropsV08(props, {});
    expect(result.text).toBe('Hello World');
  });

  it('should resolve path values from dataModel', () => {
    const props = {
      name: { path: '/user/name' },
    };
    const dataModel = { user: { name: 'Alice' } };
    const result = resolvePropsV08(props, dataModel);
    expect(result.name).toBe('Alice');
  });

  it('should resolve string path values', () => {
    const props = {
      name: '/user/name',
    };
    const dataModel = { user: { name: 'Bob' } };
    const result = resolvePropsV08(props, dataModel);
    expect(result.name).toBe('Bob');
  });

  it('should keep literal values unchanged', () => {
    const props = {
      count: 42,
      enabled: true,
      text: 'hello',
    };
    const result = resolvePropsV08(props, {});
    expect(result.count).toBe(42);
    expect(result.enabled).toBe(true);
    expect(result.text).toBe('hello');
  });

  it('should resolve array values recursively', () => {
    const props = {
      items: [{ path: '/a' }, { literalString: 'literal' }],
    };
    const dataModel = { a: 'value' };
    const result = resolvePropsV08(props, dataModel);
    expect(result.items[0]).toBe('value');
    expect(result.items[1]).toBe('literal');
  });

  it('should resolve nested object values recursively', () => {
    const props = {
      config: {
        nested: { path: '/user/name' },
        value: 'static',
      },
    };
    const dataModel = { user: { name: 'Alice' } };
    const result = resolvePropsV08(props, dataModel);
    expect(result.config.nested).toBe('Alice');
    expect(result.config.value).toBe('static');
  });

  it('should preserve { path } in action.context items', () => {
    const props = {
      action: {
        context: [{ key: 'userName', value: { path: '/user/name' } }],
      },
    };
    const dataModel = { user: { name: 'Alice' } };
    const result = resolvePropsV08(props, dataModel);
    // context 中的 { path } 应该被保留（是写入目标）
    expect(result.action.context[0].value).toEqual({ path: '/user/name' });
  });

  it('should resolve undefined path values', () => {
    const props = {
      missing: { path: '/not/exist' },
    };
    const result = resolvePropsV08(props, {});
    expect(result.missing).toBeUndefined();
  });
});

describe('resolveActionContextV08', () => {
  it('should return undefined for non-array context', () => {
    expect(resolveActionContextV08({ context: {} }, {})).toBeUndefined();
    expect(resolveActionContextV08({ context: null }, {})).toBeUndefined();
    expect(resolveActionContextV08({ context: 'string' }, {})).toBeUndefined();
    expect(resolveActionContextV08({}, {})).toBeUndefined();
  });

  it('should resolve path values from dataModel', () => {
    const action = {
      context: [{ key: 'userName', value: { path: '/user/name' } }],
    };
    const dataModel = { user: { name: 'Alice' } };
    const result = resolveActionContextV08(action, dataModel);
    expect(result).toEqual({ userName: 'Alice' });
  });

  it('should resolve literalString values', () => {
    const action = {
      context: [{ key: 'greeting', value: { literalString: 'Hello' } }],
    };
    const result = resolveActionContextV08(action, {});
    expect(result).toEqual({ greeting: 'Hello' });
  });

  it('should use literal values directly', () => {
    const action = {
      context: [{ key: 'count', value: 42 }],
    };
    const result = resolveActionContextV08(action, {});
    expect(result).toEqual({ count: 42 });
  });

  it('should skip invalid context items', () => {
    const action = {
      context: [{ key: 'valid', value: 'test' }, { invalid: 'item' }, null, 'string'],
    };
    const result = resolveActionContextV08(action, {});
    expect(result).toEqual({ valid: 'test' });
  });

  it('should return undefined for empty resolved object', () => {
    const action = {
      context: [{ invalid: 'item' }],
    };
    const result = resolveActionContextV08(action, {});
    expect(result).toBeUndefined();
  });

  it('should handle multiple context items', () => {
    const action = {
      context: [
        { key: 'name', value: { path: '/user/name' } },
        { key: 'age', value: { literalString: '25' } },
        { key: 'active', value: true },
      ],
    };
    const dataModel = { user: { name: 'Bob' } };
    const result = resolveActionContextV08(action, dataModel);
    expect(result).toEqual({
      name: 'Bob',
      age: '25',
      active: true,
    });
  });
});

describe('extractDataUpdatesV08', () => {
  it('should return empty array for non-array context', () => {
    expect(extractDataUpdatesV08({ context: {} }, {})).toEqual([]);
    expect(extractDataUpdatesV08({ context: null }, {})).toEqual([]);
    expect(extractDataUpdatesV08({}, {})).toEqual([]);
  });

  it('should extract updates from path bindings', () => {
    const action = {
      context: [{ key: 'userName', value: { path: '/user/name' } }],
    };
    const componentContext = { userName: 'Alice' };
    const result = extractDataUpdatesV08(action, componentContext);
    expect(result).toEqual([{ path: '/user/name', value: 'Alice' }]);
  });

  it('should skip non-path values', () => {
    const action = {
      context: [
        { key: 'name', value: 'literal' },
        { key: 'age', value: { path: '/user/age' } },
      ],
    };
    const componentContext = { name: 'test', age: 25 };
    const result = extractDataUpdatesV08(action, componentContext);
    expect(result).toEqual([{ path: '/user/age', value: 25 }]);
  });

  it('should skip when componentContext does not have key', () => {
    const action = {
      context: [{ key: 'userName', value: { path: '/user/name' } }],
    };
    const componentContext = { otherKey: 'value' };
    const result = extractDataUpdatesV08(action, componentContext);
    expect(result).toEqual([]);
  });

  it('should skip when value is undefined', () => {
    const action = {
      context: [{ key: 'userName', value: { path: '/user/name' } }],
    };
    const componentContext = { userName: undefined };
    const result = extractDataUpdatesV08(action, componentContext);
    expect(result).toEqual([]);
  });

  it('should handle multiple updates', () => {
    const action = {
      context: [
        { key: 'name', value: { path: '/user/name' } },
        { key: 'email', value: { path: '/user/email' } },
      ],
    };
    const componentContext = { name: 'Alice', email: 'alice@example.com' };
    const result = extractDataUpdatesV08(action, componentContext);
    expect(result).toEqual([
      { path: '/user/name', value: 'Alice' },
      { path: '/user/email', value: 'alice@example.com' },
    ]);
  });

  it('should skip invalid context items', () => {
    const action = {
      context: [{ key: 'valid', value: { path: '/valid' } }, { invalid: 'item' }, null],
    };
    const componentContext = { valid: 'test' };
    const result = extractDataUpdatesV08(action, componentContext);
    expect(result).toEqual([{ path: '/valid', value: 'test' }]);
  });
});

describe('applyDataModelUpdateV08', () => {
  it('should apply single content item', () => {
    const prev = { existing: 'value' };
    const contents = [
      {
        key: 'res',
        valueMap: [{ key: 'time', valueString: '2024-01-01' }],
      },
    ];
    const result = applyDataModelUpdateV08(prev, contents);
    expect(result.res).toEqual({ time: '2024-01-01' });
    expect(result.existing).toBe('value');
  });

  it('should apply multiple content items', () => {
    const prev = {};
    const contents = [
      {
        key: 'user',
        valueMap: [
          { key: 'name', valueString: 'Alice' },
          { key: 'age', valueString: '25' },
        ],
      },
      {
        key: 'settings',
        valueMap: [{ key: 'theme', valueString: 'dark' }],
      },
    ];
    const result = applyDataModelUpdateV08(prev, contents);
    expect(result.user).toEqual({ name: 'Alice', age: '25' });
    expect(result.settings).toEqual({ theme: 'dark' });
  });

  it('should override existing keys', () => {
    const prev = { user: { oldKey: 'oldValue' } };
    const contents = [
      {
        key: 'user',
        valueMap: [{ key: 'newKey', valueString: 'newValue' }],
      },
    ];
    const result = applyDataModelUpdateV08(prev, contents);
    expect(result.user).toEqual({ newKey: 'newValue' });
  });

  it('should handle empty contents', () => {
    const prev = { existing: 'value' };
    const result = applyDataModelUpdateV08(prev, []);
    expect(result).toEqual({ existing: 'value' });
  });

  it('should be immutable', () => {
    const prev = { existing: 'value' };
    const contents = [
      {
        key: 'new',
        valueMap: [{ key: 'data', valueString: 'test' }],
      },
    ];
    const result = applyDataModelUpdateV08(prev, contents);
    expect(prev).toEqual({ existing: 'value' });
    expect(result.new).toBeDefined();
  });
});
