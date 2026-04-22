/**
 * Card.v0.9.ts 测试用例
 * 覆盖 resolvePropsV09, resolveActionContextV09, extractDataUpdatesV09, applyDataModelUpdateV09
 */
import {
  resolvePropsV09,
  resolveActionContextV09,
  extractDataUpdatesV09,
  applyDataModelUpdateV09,
} from '../Card.v0.9';

describe('resolvePropsV09', () => {
  it('should resolve path values from dataModel', () => {
    const props = {
      name: { path: '/user/name' },
    };
    const dataModel = { user: { name: 'Alice' } };
    const result = resolvePropsV09(props, dataModel);
    expect(result.name).toBe('Alice');
  });

  it('should resolve string path values', () => {
    const props = {
      name: '/user/name',
    };
    const dataModel = { user: { name: 'Bob' } };
    const result = resolvePropsV09(props, dataModel);
    expect(result.name).toBe('Bob');
  });

  it('should keep literal values unchanged', () => {
    const props = {
      count: 42,
      enabled: true,
      text: 'hello',
    };
    const result = resolvePropsV09(props, {});
    expect(result.count).toBe(42);
    expect(result.enabled).toBe(true);
    expect(result.text).toBe('hello');
  });

  it('should resolve array values recursively', () => {
    const props = {
      items: [{ path: '/a' }, 'literal'],
    };
    const dataModel = { a: 'value' };
    const result = resolvePropsV09(props, dataModel);
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
    const result = resolvePropsV09(props, dataModel);
    expect(result.config.nested).toBe('Alice');
    expect(result.config.value).toBe('static');
  });

  it('should preserve { path } in action.event.context', () => {
    const props = {
      action: {
        event: {
          name: 'submit',
          context: {
            userName: { path: '/user/name' },
          },
        },
      },
    };
    const dataModel = { user: { name: 'Alice' } };
    const result = resolvePropsV09(props, dataModel);
    // context 中的 { path } 应该被保留（是写入目标）
    expect(result.action.event.context.userName).toEqual({ path: '/user/name' });
  });

  it('should resolve undefined path values', () => {
    const props = {
      missing: { path: '/not/exist' },
    };
    const result = resolvePropsV09(props, {});
    expect(result.missing).toBeUndefined();
  });

  it('should handle null values', () => {
    const props = {
      value: null,
    };
    const result = resolvePropsV09(props, {});
    expect(result.value).toBeNull();
  });

  it('should preserve { path } when inside action.event', () => {
    const props = {
      action: {
        event: {
          name: 'click',
          context: {
            userId: { path: '/user/id' },
            timestamp: 12345,
          },
        },
      },
    };
    const dataModel = { user: { id: 'user123' } };
    const result = resolvePropsV09(props, dataModel);
    // path 应该被保留
    expect(result.action.event.context.userId).toEqual({ path: '/user/id' });
    // 字面值保持不变
    expect(result.action.event.context.timestamp).toBe(12345);
  });
});

describe('resolveActionContextV09', () => {
  it('should return undefined for non-object context', () => {
    expect(resolveActionContextV09({ event: { context: [] } }, {})).toBeUndefined();
    expect(resolveActionContextV09({ event: { context: 'string' } }, {})).toBeUndefined();
    expect(resolveActionContextV09({ event: { context: null } }, {})).toBeUndefined();
    expect(resolveActionContextV09({ event: {} }, {})).toBeUndefined();
    expect(resolveActionContextV09({}, {})).toBeUndefined();
  });

  it('should resolve path values from dataModel', () => {
    const action = {
      event: {
        context: {
          userName: { path: '/user/name' },
        },
      },
    };
    const dataModel = { user: { name: 'Alice' } };
    const result = resolveActionContextV09(action, dataModel);
    expect(result).toEqual({ userName: 'Alice' });
  });

  it('should use literal values directly', () => {
    const action = {
      event: {
        context: {
          count: 42,
          text: 'hello',
          enabled: true,
        },
      },
    };
    const result = resolveActionContextV09(action, {});
    expect(result).toEqual({
      count: 42,
      text: 'hello',
      enabled: true,
    });
  });

  it('should handle multiple context keys', () => {
    const action = {
      event: {
        context: {
          name: { path: '/user/name' },
          age: 25,
          active: true,
        },
      },
    };
    const dataModel = { user: { name: 'Bob' } };
    const result = resolveActionContextV09(action, dataModel);
    expect(result).toEqual({
      name: 'Bob',
      age: 25,
      active: true,
    });
  });

  it('should handle empty context object', () => {
    const action = {
      event: {
        context: {},
      },
    };
    const result = resolveActionContextV09(action, {});
    expect(result).toEqual({});
  });
});

describe('extractDataUpdatesV09', () => {
  it('should return empty array for non-object context', () => {
    expect(extractDataUpdatesV09({ event: { context: [] } }, {})).toEqual([]);
    expect(extractDataUpdatesV09({ event: { context: null } }, {})).toEqual([]);
    expect(extractDataUpdatesV09({ event: {} }, {})).toEqual([]);
    expect(extractDataUpdatesV09({}, {})).toEqual([]);
  });

  it('should extract updates from path bindings', () => {
    const action = {
      event: {
        context: {
          userName: { path: '/user/name' },
        },
      },
    };
    const componentContext = { userName: 'Alice' };
    const result = extractDataUpdatesV09(action, componentContext);
    expect(result).toEqual([{ path: '/user/name', value: 'Alice' }]);
  });

  it('should skip non-path values', () => {
    const action = {
      event: {
        context: {
          name: 'literal',
          age: { path: '/user/age' },
        },
      },
    };
    const componentContext = { name: 'test', age: 25 };
    const result = extractDataUpdatesV09(action, componentContext);
    expect(result).toEqual([{ path: '/user/age', value: 25 }]);
  });

  it('should skip when componentContext does not have key', () => {
    const action = {
      event: {
        context: {
          userName: { path: '/user/name' },
        },
      },
    };
    const componentContext = { otherKey: 'value' };
    const result = extractDataUpdatesV09(action, componentContext);
    expect(result).toEqual([]);
  });

  it('should skip when value is undefined', () => {
    const action = {
      event: {
        context: {
          userName: { path: '/user/name' },
        },
      },
    };
    const componentContext = { userName: undefined };
    const result = extractDataUpdatesV09(action, componentContext);
    expect(result).toEqual([]);
  });

  it('should handle multiple updates', () => {
    const action = {
      event: {
        context: {
          name: { path: '/user/name' },
          email: { path: '/user/email' },
          literal: 'ignored',
        },
      },
    };
    const componentContext = { name: 'Alice', email: 'alice@example.com', literal: 'value' };
    const result = extractDataUpdatesV09(action, componentContext);
    expect(result).toEqual([
      { path: '/user/name', value: 'Alice' },
      { path: '/user/email', value: 'alice@example.com' },
    ]);
  });
});

describe('applyDataModelUpdateV09', () => {
  it('should set value at path', () => {
    const prev = {};
    const result = applyDataModelUpdateV09(prev, '/user/name', 'Alice');
    expect((result as any).user.name).toBe('Alice');
  });

  it('should preserve existing data', () => {
    const prev = { existing: 'value' };
    const result = applyDataModelUpdateV09(prev, '/new/key', 'test');
    expect(result.existing).toBe('value');
    expect((result as any).new.key).toBe('test');
  });

  it('should override existing path', () => {
    const prev = { user: { name: 'Bob' } };
    const result = applyDataModelUpdateV09(prev, '/user/name', 'Alice');
    expect((result as any).user.name).toBe('Alice');
  });

  it('should be immutable', () => {
    const prev = { user: { name: 'Bob' } };
    applyDataModelUpdateV09(prev, '/user/name', 'Alice');
    expect((prev as any).user.name).toBe('Bob');
  });

  it('should handle nested paths', () => {
    const prev = {};
    const result = applyDataModelUpdateV09(prev, '/a/b/c/d', 'deep');
    expect((result as any).a.b.c.d).toBe('deep');
  });

  it('should handle null value', () => {
    const prev = {};
    const result = applyDataModelUpdateV09(prev, '/key', null);
    expect(result.key).toBeNull();
  });

  it('should handle object value', () => {
    const prev = {};
    const result = applyDataModelUpdateV09(prev, '/data', { nested: 'value' });
    expect((result as any).data.nested).toBe('value');
  });

  it('should handle array value', () => {
    const prev = {};
    const result = applyDataModelUpdateV09(prev, '/items', [1, 2, 3]);
    expect((result as any).items).toEqual([1, 2, 3]);
  });
});
