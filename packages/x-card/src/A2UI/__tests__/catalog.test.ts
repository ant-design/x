/**
 * catalog.ts 测试用例
 * 覆盖 registerCatalog, loadCatalog, validateComponent, getComponentPropsSchema, clearCatalogCache
 */
import {
  registerCatalog,
  loadCatalog,
  validateComponent,
  getComponentPropsSchema,
  clearCatalogCache,
  type Catalog,
} from '../catalog';

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

beforeEach(() => {
  clearCatalogCache();
  mockFetch.mockReset();
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('registerCatalog', () => {
  it('should register catalog with $id', () => {
    const catalog: Catalog = {
      $id: 'test-catalog',
      components: { Button: { type: 'object' } },
    };
    registerCatalog(catalog);
    // 验证可以通过 loadCatalog 获取
    return loadCatalog('test-catalog').then((result) => {
      expect(result).toBe(catalog);
    });
  });

  it('should register catalog with catalogId', () => {
    const catalog: Catalog = {
      catalogId: 'my-catalog',
      components: { Input: { type: 'object' } },
    };
    registerCatalog(catalog);
    return loadCatalog('my-catalog').then((result) => {
      expect(result).toBe(catalog);
    });
  });

  it('should not register catalog without id', () => {
    const catalog: Catalog = {
      components: { Button: { type: 'object' } },
    };
    registerCatalog(catalog);
    // 没有 id，不应该被注册，fetch 会被调用
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: 'Not Found',
    });
    return loadCatalog('undefined-catalog').catch(() => {
      // 预期会失败
    });
  });
});

describe('loadCatalog', () => {
  it('should return cached catalog', async () => {
    const catalog: Catalog = {
      $id: 'cached-catalog',
      components: { Button: { type: 'object' } },
    };
    registerCatalog(catalog);
    const result = await loadCatalog('cached-catalog');
    expect(result).toBe(catalog);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('should return empty catalog for unregistered local:// schema', async () => {
    const result = await loadCatalog('local://my-catalog');
    expect(result.$id).toBe('local://my-catalog');
    expect(result.components).toEqual({});
    expect(console.warn).toHaveBeenCalled();
  });

  it('should fetch remote catalog', async () => {
    const remoteCatalog: Catalog = {
      $id: 'https://example.com/catalog.json',
      components: { Button: { type: 'object' } },
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(remoteCatalog),
    });

    const result = await loadCatalog('https://example.com/catalog.json');
    expect(result).toEqual(remoteCatalog);
    expect(mockFetch).toHaveBeenCalledWith('https://example.com/catalog.json');
  });

  it('should cache fetched remote catalog', async () => {
    const remoteCatalog: Catalog = {
      $id: 'https://example.com/catalog2.json',
      components: {},
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(remoteCatalog),
    });

    await loadCatalog('https://example.com/catalog2.json');
    // 第二次调用不应该再 fetch
    const result2 = await loadCatalog('https://example.com/catalog2.json');
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(result2).toEqual(remoteCatalog);
  });

  it('should throw error when fetch fails with non-ok response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: 'Not Found',
    });

    await expect(loadCatalog('https://example.com/bad-catalog.json')).rejects.toThrow();
    expect(console.error).toHaveBeenCalled();
  });

  it('should throw error when fetch throws', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(loadCatalog('https://example.com/error-catalog.json')).rejects.toThrow(
      'Network error',
    );
    expect(console.error).toHaveBeenCalled();
  });
});

describe('validateComponent', () => {
  it('should return false when component not in catalog', () => {
    const catalog: Catalog = {
      components: { Input: { type: 'object' } },
    };
    const result = validateComponent(catalog, 'Button', {});
    expect(result).toBe(false);
    expect(console.warn).toHaveBeenCalled();
  });

  it('should return true when component has no required fields', () => {
    const catalog: Catalog = {
      components: {
        Button: {
          type: 'object',
          properties: { label: { type: 'string' } },
        },
      },
    };
    const result = validateComponent(catalog, 'Button', { label: 'Click' });
    expect(result).toBe(true);
  });

  it('should return false when required field is missing', () => {
    const catalog: Catalog = {
      components: {
        Button: {
          type: 'object',
          required: ['label'],
          properties: { label: { type: 'string' } },
        },
      },
    };
    const result = validateComponent(catalog, 'Button', {});
    expect(result).toBe(false);
    expect(console.warn).toHaveBeenCalled();
  });

  it('should return true when all required fields present', () => {
    const catalog: Catalog = {
      components: {
        Button: {
          type: 'object',
          required: ['label'],
          properties: { label: { type: 'string' } },
        },
      },
    };
    const result = validateComponent(catalog, 'Button', { label: 'Click' });
    expect(result).toBe(true);
  });

  it('should handle catalog with no components', () => {
    const catalog: Catalog = {};
    const result = validateComponent(catalog, 'Button', {});
    expect(result).toBe(false);
  });
});

describe('getComponentPropsSchema', () => {
  it('should return properties for existing component', () => {
    const catalog: Catalog = {
      components: {
        Button: {
          type: 'object',
          properties: {
            label: { type: 'string' },
            disabled: { type: 'boolean' },
          },
        },
      },
    };
    const schema = getComponentPropsSchema(catalog, 'Button');
    expect(schema).toEqual({
      label: { type: 'string' },
      disabled: { type: 'boolean' },
    });
  });

  it('should return undefined for non-existing component', () => {
    const catalog: Catalog = {
      components: { Input: { type: 'object' } },
    };
    const schema = getComponentPropsSchema(catalog, 'Button');
    expect(schema).toBeUndefined();
  });

  it('should return undefined when catalog has no components', () => {
    const catalog: Catalog = {};
    const schema = getComponentPropsSchema(catalog, 'Button');
    expect(schema).toBeUndefined();
  });

  it('should return undefined when component has no properties', () => {
    const catalog: Catalog = {
      components: { Button: { type: 'object' } },
    };
    const schema = getComponentPropsSchema(catalog, 'Button');
    expect(schema).toBeUndefined();
  });
});

describe('clearCatalogCache', () => {
  it('should clear all cached catalogs', async () => {
    const catalog: Catalog = {
      $id: 'clear-test-catalog',
      components: {},
    };
    registerCatalog(catalog);

    clearCatalogCache();

    // 清除后，再次加载应该走 fetch
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ $id: 'clear-test-catalog', components: {} }),
    });

    await loadCatalog('clear-test-catalog');
    expect(mockFetch).toHaveBeenCalledWith('clear-test-catalog');
  });
});
