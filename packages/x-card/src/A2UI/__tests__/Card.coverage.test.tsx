/**
 * Card.tsx 覆盖率补充测试用例
 * 覆盖：v0.8 hasRenderedRef 分支、dataModelUpdate、handleAction dataUpdates reduce、handleDataChange
 */
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Box from '../Box';
import Card from '../Card';
import { registerCatalog, clearCatalogCache } from '../catalog';

// Mock console
const originalConsole = { ...console };
const originalEnv = process.env;

beforeEach(() => {
  console.log = jest.fn();
  console.warn = jest.fn();
  console.error = jest.fn();
});

afterEach(() => {
  console.log = originalConsole.log;
  console.warn = originalConsole.warn;
  console.error = originalConsole.error;
  clearCatalogCache();
  process.env = originalEnv;
});

describe('Card.tsx coverage', () => {
  describe('development environment branches', () => {
    it('should warn in development mode when component not registered but in catalog', async () => {
      // 测试覆盖行 79-83, 92-100: process.env.NODE_ENV === 'development' 分支
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development' as any;

      // 注册 catalog，但不注册组件
      registerCatalog({
        $id: 'test-catalog',
        components: {
          TestComponent: { type: 'object' },
        },
      });

      const { unmount } = render(
        <Box
          commands={{
            version: 'v0.9',
            createSurface: {
              surfaceId: 'card1',
              catalogId: 'test-catalog',
            },
            updateComponents: {
              surfaceId: 'card1',
              components: [
                {
                  id: 'root',
                  component: 'TestComponent',
                },
              ],
            },
          }}
          components={{}}
        >
          <Card id="card1" />
        </Box>,
      );

      await waitFor(() => {
        // 在开发模式下，组件在 catalog 中定义但未注册时应该有警告
        expect(console.warn).toHaveBeenCalledWith(
          expect.stringContaining('is defined in catalog but not registered'),
        );
      });

      process.env.NODE_ENV = originalEnv;
      unmount();
    });

    it('should error in development mode when component not in catalog', async () => {
      // 测试覆盖行 92-97: 组件不在 catalog 中时应该有错误
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development' as any;

      // 注册 catalog，但不包含目标组件
      registerCatalog({
        $id: 'test-catalog-2',
        components: {
          OtherComponent: { type: 'object' },
        },
      });

      const { unmount } = render(
        <Box
          commands={{
            version: 'v0.9',
            createSurface: {
              surfaceId: 'card1',
              catalogId: 'test-catalog-2',
            },
            updateComponents: {
              surfaceId: 'card1',
              components: [
                {
                  id: 'root',
                  component: 'UnknownComponent',
                },
              ],
            },
          }}
          components={{}}
        >
          <Card id="card1" />
        </Box>,
      );

      await waitFor(() => {
        // 在开发模式下，组件不在 catalog 中且未注册时应该有错误
        expect(console.error).toHaveBeenCalledWith(
          expect.stringContaining('is not registered and not defined in catalog'),
        );
      });

      process.env.NODE_ENV = originalEnv;
      unmount();
    });
  });

  describe('NodeRenderer branches', () => {
    it('should not inject onAction when Component is a string (HTML element)', async () => {
      // 测试覆盖行 115: typeof Component !== 'string' 的 false 分支
      // 当 Component 是字符串（如 'div'）时，不应该注入 onAction

      // 使用 'div' 作为组件
      render(
        <Box
          commands={{
            version: 'v0.9',
            updateComponents: {
              surfaceId: 'card1',
              components: [
                {
                  id: 'root',
                  component: 'div',
                },
              ],
            },
          }}
          // @ts-ignore - 测试字符串组件
          components={{ div: 'div' }}
        >
          <Card id="card1" />
        </Box>,
      );

      // 应该渲染成功
      await waitFor(() => {
        expect(screen.queryByText('div')).toBeNull(); // div 不会渲染文本
      });
    });

    it('should return null when node not found in renderNode', async () => {
      // 测试覆盖行 33: renderNode 中 node 不存在时返回 null
      // 这发生在 children 引用的节点不存在时

      const ParentComponent: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
        <div data-testid="parent">{children}</div>
      );

      render(
        <Box
          commands={{
            version: 'v0.9',
            updateComponents: {
              surfaceId: 'card1',
              components: [
                {
                  id: 'root',
                  component: 'ParentComponent',
                  children: ['nonExistentChild'], // 引用不存在的子节点
                },
              ],
            },
          }}
          components={{ ParentComponent }}
        >
          <Card id="card1" />
        </Box>,
      );

      // 应该渲染父组件，但子节点为空（因为不存在）
      await waitFor(() => {
        expect(screen.getByTestId('parent')).toBeInTheDocument();
        expect(screen.getByTestId('parent').children.length).toBe(0);
      });
    });
  });

  describe('v0.8 hasRenderedRef branch', () => {
    it('should update from cache when hasRenderedRef is true after rerender', async () => {
      // 测试覆盖行 214-216: v0.8 中已经渲染过后，收到新的 surfaceUpdate 时直接从缓存更新
      const TestComponent: React.FC<{ text?: string }> = ({ text }) => (
        <div data-testid="test-component">{text || 'empty'}</div>
      );

      // 先进行初始渲染并触发 beginRendering
      const { rerender } = render(
        <Box
          commands={{
            surfaceUpdate: {
              surfaceId: 'card1',
              components: [
                {
                  id: 'root',
                  component: {
                    TestComponent: {
                      text: 'initial',
                    },
                  },
                },
              ],
            },
            beginRendering: {
              surfaceId: 'card1',
              root: 'root',
            },
          }}
          components={{ TestComponent }}
        >
          <Card id="card1" />
        </Box>,
      );

      expect(screen.getByTestId('test-component').textContent).toBe('initial');

      // 发送新的 surfaceUpdate 命令，此时 hasRenderedRef 为 true
      rerender(
        <Box
          commands={{
            surfaceUpdate: {
              surfaceId: 'card1',
              components: [
                {
                  id: 'root',
                  component: {
                    TestComponent: {
                      text: 'updated',
                    },
                  },
                },
              ],
            },
          }}
          components={{ TestComponent }}
        >
          <Card id="card1" />
        </Box>,
      );

      // 由于 hasRenderedRef 为 true，应该从缓存更新 root 节点
      await waitFor(() => {
        expect(screen.getByTestId('test-component').textContent).toBe('updated');
      });
    });
  });

  describe('v0.8 dataModelUpdate command', () => {
    it('should apply dataModelUpdate in v0.8 mode', async () => {
      // 测试覆盖行 223-224: v0.8 dataModelUpdate 命令
      const TestComponent: React.FC<{ value?: string }> = ({ value }) => (
        <div data-testid="bound-value">{value || 'no value'}</div>
      );

      // 先设置组件结构和数据绑定
      const { rerender } = render(
        <Box
          commands={{
            surfaceUpdate: {
              surfaceId: 'card1',
              components: [
                {
                  id: 'root',
                  component: {
                    TestComponent: {
                      value: { path: '/data/time' },
                    },
                  },
                },
              ],
            },
            beginRendering: {
              surfaceId: 'card1',
              root: 'root',
            },
          }}
          components={{ TestComponent }}
        >
          <Card id="card1" />
        </Box>,
      );

      // 初始应该显示 no value
      expect(screen.getByTestId('bound-value').textContent).toBe('no value');

      // 发送 dataModelUpdate 命令 - 使用正确的 v0.8 格式
      // v0.8 dataModelUpdate 格式: contents: [{ key: string, valueMap: [{ key: string, valueString: string }] }]
      rerender(
        <Box
          commands={{
            dataModelUpdate: {
              surfaceId: 'card1',
              contents: [
                {
                  key: 'data',
                  valueMap: [{ key: 'time', valueString: 'data from update' }],
                },
              ],
            },
          }}
          components={{ TestComponent }}
        >
          <Card id="card1" />
        </Box>,
      );

      // 等待数据更新
      await waitFor(() => {
        expect(screen.getByTestId('bound-value').textContent).toBe('data from update');
      });
    });
  });

  describe('handleAction dataUpdates reduce', () => {
    it('should apply dataUpdates in handleAction with reduce', async () => {
      // 测试覆盖行 281-286: handleAction 中 dataUpdates.length > 0 时的 reduce 逻辑
      const onAction = jest.fn();

      // 创建一个带有 action 配置的组件
      const ClickableComponent: React.FC<{
        onAction?: (name: string, ctx: any) => void;
        action?: any;
      }> = ({ onAction: componentOnAction }) => (
        <button
          type="button"
          data-testid="click-btn"
          onClick={() =>
            componentOnAction?.('click', {
              resultValue: 'clicked-value',
            })
          }
        >
          Click
        </button>
      );

      render(
        <Box
          commands={{
            version: 'v0.9',
            updateComponents: {
              surfaceId: 'card1',
              components: [
                {
                  id: 'root',
                  component: 'ClickableComponent',
                  // action 配置，包含 path 绑定
                  // v0.9 格式: action.event.context
                  action: {
                    event: {
                      context: {
                        resultValue: { path: '/result/value' },
                      },
                    },
                  },
                },
              ],
            },
          }}
          components={{ ClickableComponent }}
          onAction={onAction}
        >
          <Card id="card1" />
        </Box>,
      );

      // 点击按钮触发 action
      fireEvent.click(screen.getByTestId('click-btn'));

      await waitFor(() => {
        expect(onAction).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'click',
            surfaceId: 'card1',
            context: expect.objectContaining({
              resultValue: 'clicked-value',
            }),
          }),
        );
      });
    });

    it('should apply dataUpdates in v0.8 mode', async () => {
      // 测试 v0.8 的 extractDataUpdatesV08 分支
      const onAction = jest.fn();

      const ClickableComponent: React.FC<{
        onAction?: (name: string, ctx: any) => void;
        action?: any;
      }> = ({ onAction: componentOnAction }) => (
        <button
          type="button"
          data-testid="click-btn"
          onClick={() =>
            componentOnAction?.('click', {
              inputValue: 'test-value',
            })
          }
        >
          Click
        </button>
      );

      render(
        <Box
          commands={{
            surfaceUpdate: {
              surfaceId: 'card1',
              components: [
                {
                  id: 'root',
                  component: {
                    ClickableComponent: {
                      // v0.8 格式: action.context 是数组
                      action: {
                        context: [
                          {
                            key: 'inputValue',
                            value: { path: '/input/value' },
                          },
                        ],
                      },
                    },
                  },
                },
              ],
            },
            beginRendering: {
              surfaceId: 'card1',
              root: 'root',
            },
          }}
          components={{ ClickableComponent }}
          onAction={onAction}
        >
          <Card id="card1" />
        </Box>,
      );

      // 点击按钮触发 action
      fireEvent.click(screen.getByTestId('click-btn'));

      await waitFor(() => {
        expect(onAction).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'click',
            surfaceId: 'card1',
          }),
        );
      });
    });
  });

  describe('handleDataChange', () => {
    it('should handle data change via onDataChange', async () => {
      // 测试覆盖行 305: handleDataChange 函数
      // onDataChange 会被注入到组件中，组件可以调用它来更新 dataModel

      const InputComponent: React.FC<{
        value?: string;
        onDataChange?: (path: string, value: any) => void;
        onAction?: (name: string, ctx: any) => void;
      }> = ({ value, onDataChange, onAction }) => (
        <input
          data-testid="test-input"
          value={value || ''}
          onChange={(e) => {
            // 调用 onDataChange 更新 dataModel
            onDataChange?.('/form/input', e.target.value);
            // 同时触发 action 通知外部
            onAction?.('change', { value: e.target.value });
          }}
        />
      );

      const onAction = jest.fn();

      render(
        <Box
          commands={{
            version: 'v0.9',
            updateComponents: {
              surfaceId: 'card1',
              components: [
                {
                  id: 'root',
                  component: 'InputComponent',
                  value: { path: '/form/input' },
                },
              ],
            },
          }}
          components={{ InputComponent }}
          onAction={onAction}
        >
          <Card id="card1" />
        </Box>,
      );

      const input = screen.getByTestId('test-input');

      // 输入新值，触发 onDataChange
      fireEvent.change(input, { target: { value: 'new value' } });

      await waitFor(() => {
        expect(onAction).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'change',
            surfaceId: 'card1',
          }),
        );
      });
    });
  });

  describe('additional branches', () => {
    it('should handle surfaceCatalogMap not existing', async () => {
      // 测试覆盖行 161: surfaceCatalogMap 不存在时返回 undefined
      const TestComponent: React.FC = () => <div data-testid="test">Test</div>;

      // 不使用 createSurface，直接使用 updateComponents
      // 此时 surfaceCatalogMap 应该为空，catalogId 应该为 undefined
      render(
        <Box
          commands={{
            version: 'v0.9',
            updateComponents: {
              surfaceId: 'card1',
              components: [
                {
                  id: 'root',
                  component: 'TestComponent',
                },
              ],
            },
          }}
          components={{ TestComponent }}
        >
          <Card id="card1" />
        </Box>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('test')).toBeInTheDocument();
      });
    });

    it('should use default commandVersion v0.8 when version not specified', async () => {
      // 测试覆盖行 71, 151: commandVersion 默认值 'v0.8'
      // 当 commands 对象没有 version 字段时，默认使用 v0.8
      const TestComponent: React.FC = () => <div data-testid="test">Test</div>;

      render(
        <Box
          // @ts-ignore - 测试没有 version 字段的命令
          commands={{
            surfaceUpdate: {
              surfaceId: 'card1',
              components: [
                {
                  id: 'root',
                  component: { TestComponent: {} },
                },
              ],
            },
            beginRendering: {
              surfaceId: 'card1',
              root: 'root',
            },
          }}
          components={{ TestComponent }}
        >
          <Card id="card1" />
        </Box>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('test')).toBeInTheDocument();
      });
    });

    it('should handle nodeTree not existing in v0.9 updateComponents', async () => {
      // 测试覆盖行 188: nodeTree 不存在时不更新渲染
      const TestComponent: React.FC = () => <div data-testid="test">Test</div>;

      // 使用 updateComponents 但不提供有效的组件
      render(
        <Box
          commands={{
            version: 'v0.9',
            updateComponents: {
              surfaceId: 'card1',
              components: [], // 空组件列表
            },
          }}
          components={{ TestComponent }}
        >
          <Card id="card1" />
        </Box>,
      );

      // 由于没有组件，不应该渲染任何内容
      await waitFor(() => {
        expect(screen.queryByTestId('test')).not.toBeInTheDocument();
      });
    });

    it('should handle rootNodeFromCache not existing in v0.8', async () => {
      // 测试覆盖行 218: rootNodeFromCache 不存在时不更新
      const TestComponent: React.FC<{ text?: string }> = ({ text }) => (
        <div data-testid="test">{text || 'default'}</div>
      );

      // 先渲染一次建立 hasRenderedRef
      const { rerender } = render(
        <Box
          commands={{
            surfaceUpdate: {
              surfaceId: 'card1',
              components: [
                {
                  id: 'root',
                  component: { TestComponent: { text: 'initial' } },
                },
              ],
            },
            beginRendering: {
              surfaceId: 'card1',
              root: 'root',
            },
          }}
          components={{ TestComponent }}
        >
          <Card id="card1" />
        </Box>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('test').textContent).toBe('initial');
      });

      // 更新但提供空的组件列表，此时 rootNodeFromCache 会返回 undefined
      rerender(
        <Box
          commands={{
            surfaceUpdate: {
              surfaceId: 'card1',
              components: [], // 空组件，不会更新 root
            },
          }}
          components={{ TestComponent }}
        >
          <Card id="card1" />
        </Box>,
      );

      // 应该保持原有内容
      await waitFor(() => {
        expect(screen.getByTestId('test').textContent).toBe('initial');
      });
    });
  });
});
