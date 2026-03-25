/**
 * Box.tsx 和 components.ts 覆盖率补充测试用例
 * 覆盖：Box loadCatalog 错误处理、components transform 空数组分支、explicitList 分支
 */
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Box from '../Box';
import Card from '../Card';
import { registerCatalog, clearCatalogCache } from '../catalog';
import { createComponentTransformer } from '../format/components';
import type { ComponentWrapper_v0_8 } from '../types/command_v0.8';

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock console
const originalConsole = { ...console };
beforeEach(() => {
  console.log = jest.fn();
  console.warn = jest.fn();
  console.error = jest.fn();
  mockFetch.mockClear();
});

afterEach(() => {
  console.log = originalConsole.log;
  console.warn = originalConsole.warn;
  console.error = originalConsole.error;
  clearCatalogCache();
});

describe('Box.tsx coverage', () => {
  describe('createSurface without catalogId', () => {
    it('should handle createSurface without catalogId', async () => {
      // 测试覆盖 Box.tsx 行 34: catalogId 为 falsy 的分支
      render(
        <Box
          commands={{
            version: 'v0.9',
            createSurface: {
              surfaceId: 'card1',
              catalogId: '', // 空 catalogId 测试 falsy 分支
            },
          }}
          components={{}}
        >
          <Card id="card1" />
        </Box>,
      );

      // 应该打印 createSurface 命令日志
      expect(console.log).toHaveBeenCalledWith('Box: createSurface command received (v0.9)', {
        surfaceId: 'card1',
        catalogId: '',
      });
    });
  });

  describe('loadCatalog error handling', () => {
    it('should handle catalog load failure', async () => {
      // 测试覆盖 Box.tsx 行 53: loadCatalog 失败时的错误处理
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      render(
        <Box
          commands={{
            version: 'v0.9',
            createSurface: {
              surfaceId: 'card1',
              catalogId: 'https://example.com/fail-catalog.json',
            },
          }}
          components={{}}
        >
          <Card id="card1" />
        </Box>,
      );

      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith(
          expect.stringContaining('Failed to load catalog'),
          expect.any(Error),
        );
      });
    });

    it('should skip setting catalog if already cached', async () => {
      // 测试覆盖 Box.tsx 行 47: catalog 已缓存时跳过 setCatalogMap
      const catalogUrl = 'https://example.com/cached-catalog.json';

      // 先注册 catalog 到缓存
      registerCatalog({
        $id: catalogUrl,
        components: {
          TestComponent: { type: 'object' },
        },
      });

      const TestComponent: React.FC = () => <div data-testid="test">Test</div>;

      // 第一次渲染，catalog 已在缓存中
      const { rerender } = render(
        <Box
          commands={{
            version: 'v0.9',
            createSurface: {
              surfaceId: 'card1',
              catalogId: catalogUrl,
            },
          }}
          components={{ TestComponent }}
        >
          <Card id="card1" />
        </Box>,
      );

      // 等待 catalog 加载
      await waitFor(() => {
        expect(console.log).toHaveBeenCalledWith(
          'Box: catalog loaded',
          catalogUrl,
          expect.any(Object),
        );
      });

      // 清除 console.log mock
      (console.log as jest.Mock).mockClear();

      // 重新渲染相同的命令，catalog 已缓存
      // 这会触发 setCatalogMap 回调中的 prev.has(catalogId) 分支
      rerender(
        <Box
          commands={{
            version: 'v0.9',
            createSurface: {
              surfaceId: 'card1',
              catalogId: catalogUrl,
            },
          }}
          components={{ TestComponent }}
        >
          <Card id="card1" />
        </Box>,
      );

      // 由于 catalog 已缓存，不应该再调用 fetch
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should return prev map when catalogId already exists', async () => {
      // 专门测试 Box.tsx 行 46-48: prev.has(catalogId) 返回 true 的分支
      const catalogUrl = 'https://example.com/duplicate-catalog.json';

      registerCatalog({
        $id: catalogUrl,
        components: {
          TestComponent: { type: 'object' },
        },
      });

      const TestComponent: React.FC = () => <div data-testid="test">Test</div>;

      // 使用 act 来确保状态更新完成
      const { rerender } = render(
        <Box
          commands={{
            version: 'v0.9',
            createSurface: {
              surfaceId: 'card1',
              catalogId: catalogUrl,
            },
          }}
          components={{ TestComponent }}
        >
          <Card id="card1" />
        </Box>,
      );

      // 等待第一次加载完成
      await waitFor(() => {
        expect(console.log).toHaveBeenCalledWith(
          'Box: catalog loaded',
          catalogUrl,
          expect.any(Object),
        );
      });

      // 清空 mock
      (console.log as jest.Mock).mockClear();

      // 再次触发相同的 createSurface 命令
      // 由于 useEffect 的依赖数组是 [commands]，当 commands 对象引用改变时会重新执行
      // 但此时 catalogMap 中已经有了该 catalogId，所以会走 prev.has(catalogId) 分支
      rerender(
        <Box
          commands={{
            version: 'v0.9',
            createSurface: {
              surfaceId: 'card1',
              catalogId: catalogUrl,
            },
          }}
          components={{ TestComponent }}
        >
          <Card id="card1" />
        </Box>,
      );

      // 等待 useEffect 执行
      await waitFor(() => {
        // 由于已经加载过，应该再次打印 catalog loaded 日志
        expect(console.log).toHaveBeenCalledWith(
          'Box: catalog loaded',
          catalogUrl,
          expect.any(Object),
        );
      });
    });
  });
});

describe('components.ts coverage', () => {
  describe('transform with empty components', () => {
    it('should return null when components array is empty', () => {
      // 测试覆盖行 112-113: 空数组时返回缓存的 root 或 null
      const transformer = createComponentTransformer();

      // 初始空数组应返回 null
      const result1 = transformer.transform([], 'v0.9');
      expect(result1).toBeNull();

      // 先添加一些组件
      transformer.transform(
        [
          {
            id: 'root',
            component: 'Container',
          },
        ],
        'v0.9',
      );

      // 再用空数组调用，应该返回缓存的 root
      const result2 = transformer.transform([], 'v0.9');
      expect(result2).not.toBeNull();
      expect(result2!.type).toBe('Container');
    });

    it('should return null for undefined/null components', () => {
      const transformer = createComponentTransformer();

      // @ts-ignore - 测试边界情况
      const result = transformer.transform(null, 'v0.9');
      expect(result).toBeNull();
    });

    it('should return cached root for non-array input', () => {
      const transformer = createComponentTransformer();

      // 先添加组件
      transformer.transform(
        [
          {
            id: 'root',
            component: 'Test',
          },
        ],
        'v0.9',
      );

      // @ts-ignore - 测试边界情况
      const result = transformer.transform('not-an-array', 'v0.9');
      expect(result).not.toBeNull();
    });
  });

  describe('explicitList children parsing', () => {
    it('should parse explicitList children in v0.8', () => {
      // 测试覆盖行 50: isExplicitList 分支
      const transformer = createComponentTransformer();

      const components: ComponentWrapper_v0_8[] = [
        {
          id: 'root',
          component: {
            Container: {
              children: {
                explicitList: ['child1', 'child2'],
              },
            },
          },
        },
        {
          id: 'child1',
          component: {
            Text: { text: 'Child 1' },
          },
        },
        {
          id: 'child2',
          component: {
            Text: { text: 'Child 2' },
          },
        },
      ];

      const result = transformer.transform(components, 'v0.8');
      expect(result).not.toBeNull();
      expect(result!.type).toBe('Container');
      expect(result!.children).toEqual(['child1', 'child2']);

      // 验证子节点
      const child1 = transformer.getById('child1');
      expect(child1).toBeDefined();
      expect(child1!.type).toBe('Text');
    });

    it('should parse array children in v0.8 (not explicitList)', () => {
      // 测试覆盖行 51-52: children 是数组但不是 explicitList 的分支
      const transformer = createComponentTransformer();

      const components: ComponentWrapper_v0_8[] = [
        {
          id: 'root',
          component: {
            Container: {
              // 普通数组形式，不是 explicitList
              children: ['child1'],
            },
          },
        },
        {
          id: 'child1',
          component: {
            Text: { text: 'Child 1' },
          },
        },
      ];

      const result = transformer.transform(components, 'v0.8');
      expect(result).not.toBeNull();
      expect(result!.type).toBe('Container');
      expect(result!.children).toEqual(['child1']);
    });

    it('should handle non-array, non-explicitList children in v0.8', () => {
      // 测试覆盖行 51 的 false 分支: children 存在但既不是 explicitList 也不是数组
      const transformer = createComponentTransformer();

      const components: ComponentWrapper_v0_8[] = [
        {
          id: 'root',
          component: {
            Container: {
              // children 是一个对象但不是 explicitList，也不是数组
              // 这种情况下 children 会被跳过
              children: { someOtherProperty: 'value' } as any,
            },
          },
        },
      ];

      const result = transformer.transform(components, 'v0.8');
      expect(result).not.toBeNull();
      expect(result!.type).toBe('Container');
      // children 应该是 undefined，因为不是 explicitList 也不是数组
      expect(result!.children).toBeUndefined();
    });

    it('should handle child property instead of children', () => {
      // 测试覆盖行 54-55: 使用 child 而不是 children
      const transformer = createComponentTransformer();

      const components: ComponentWrapper_v0_8[] = [
        {
          id: 'root',
          component: {
            Container: {
              child: 'singleChild',
            },
          },
        },
        {
          id: 'singleChild',
          component: {
            Text: { text: 'Single Child' },
          },
        },
      ];

      const result = transformer.transform(components, 'v0.8');
      expect(result).not.toBeNull();
      expect(result!.type).toBe('Container');
      expect(result!.children).toEqual(['singleChild']);
    });
  });

  describe('transform with default version', () => {
    it('should default to v0.8 when version not specified', () => {
      const transformer = createComponentTransformer();

      const components: ComponentWrapper_v0_8[] = [
        {
          id: 'root',
          component: {
            Test: { value: 'test' },
          },
        },
      ];

      // @ts-ignore - 测试默认版本
      const result = transformer.transform(components);
      expect(result).not.toBeNull();
      expect(result!.type).toBe('Test');
    });
  });
});
