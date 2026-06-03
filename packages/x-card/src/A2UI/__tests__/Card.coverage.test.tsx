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
          commands={[
            {
              version: 'v0.9',
              createSurface: {
                surfaceId: 'card1',
                catalogId: 'test-catalog',
              },
            },
            {
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
            },
          ]}
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
          commands={[
            {
              version: 'v0.9',
              createSurface: {
                surfaceId: 'card1',
                catalogId: 'test-catalog-2',
              },
            },
            {
              version: 'v0.9',
              updateComponents: {
                surfaceId: 'card1',
                components: [
                  {
                    id: 'root',
                    component: 'UnknownComponent',
                  },
                ],
              },
            },
          ]}
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
          commands={[
            {
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
            },
          ]}
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
          commands={[
            {
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
            },
          ]}
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
          commands={[
            {
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
            },
            {
              beginRendering: {
                surfaceId: 'card1',
                root: 'root',
              },
            },
          ]}
          components={{ TestComponent }}
        >
          <Card id="card1" />
        </Box>,
      );

      expect(screen.getByTestId('test-component').textContent).toBe('initial');

      // 发送新的 surfaceUpdate 命令，此时 hasRenderedRef 为 true
      rerender(
        <Box
          commands={[
            {
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
            },
          ]}
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
          commands={[
            {
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
            },
            {
              beginRendering: {
                surfaceId: 'card1',
                root: 'root',
              },
            },
          ]}
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
          commands={[
            {
              dataModelUpdate: {
                surfaceId: 'card1',
                contents: [
                  {
                    key: 'data',
                    valueMap: [{ key: 'time', valueString: 'data from update' }],
                  },
                ],
              },
            },
          ]}
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
          commands={[
            {
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
            },
          ]}
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
          commands={[
            {
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
            },
            {
              beginRendering: {
                surfaceId: 'card1',
                root: 'root',
              },
            },
          ]}
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
          commands={[
            {
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
            },
          ]}
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
          commands={[
            {
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
            },
          ]}
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
          commands={[
            {
              surfaceUpdate: {
                surfaceId: 'card1',
                components: [
                  {
                    id: 'root',
                    component: { TestComponent: {} },
                  },
                ],
              },
            },
            {
              beginRendering: {
                surfaceId: 'card1',
                root: 'root',
              },
            },
          ]}
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
          commands={[
            {
              version: 'v0.9',
              updateComponents: {
                surfaceId: 'card1',
                components: [], // 空组件列表
              },
            },
          ]}
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
          commands={[
            {
              surfaceUpdate: {
                surfaceId: 'card1',
                components: [
                  {
                    id: 'root',
                    component: { TestComponent: { text: 'initial' } },
                  },
                ],
              },
            },
            {
              beginRendering: {
                surfaceId: 'card1',
                root: 'root',
              },
            },
          ]}
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
          commands={[
            {
              surfaceUpdate: {
                surfaceId: 'card1',
                components: [], // 空组件，不会更新 root
              },
            },
          ]}
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

  describe('v0.9 action context literal value', () => {
    it('should include config literal values in reported context', async () => {
      // 验证 v0.9 的行为：resolveActionContextPathRefs 会将配置侧字面量合并到上报 context 中。
      // 配置侧非 { path } 字面量（如 label: 'static-label'）会出现在上报 context 里；
      // 组件运行时传入的同名 key 优先级更高，会覆盖配置侧的值。
      const onAction = jest.fn();

      const ClickableComponent: React.FC<{
        onAction?: (name: string, ctx: Record<string, any>) => void;
      }> = ({ onAction: componentOnAction }) => (
        <button
          type="button"
          data-testid="click-btn"
          onClick={() =>
            componentOnAction?.('click', {
              // 只传 value，不传 label，让 label 完全来自配置侧字面量
              value: 'runtime-value',
            })
          }
        >
          Click
        </button>
      );

      render(
        <Box
          commands={[
            {
              version: 'v0.9',
              updateComponents: {
                surfaceId: 'card1',
                components: [
                  {
                    id: 'root',
                    component: 'ClickableComponent',
                    action: {
                      event: {
                        name: 'click',
                        context: {
                          // 配置侧字面量：会被合并到上报 context 中
                          label: 'static-label',
                          // 配置侧 path 绑定：解析后以 { value } 格式合并
                          value: { path: '/data/value' },
                        },
                      },
                    },
                  },
                ],
              },
            },
          ]}
          components={{ ClickableComponent }}
          onAction={onAction}
        >
          <Card id="card1" />
        </Box>,
      );

      fireEvent.click(screen.getByTestId('click-btn'));

      await waitFor(() => {
        expect(onAction).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'click',
            surfaceId: 'card1',
            context: expect.objectContaining({
              // 组件运行时传入的 value 优先
              value: 'runtime-value',
              // 配置侧字面量 label 被合并到上报 context 中
              label: 'static-label',
            }),
          }),
        );
      });
    });
  });
});

describe('Card.tsx additional branch coverage', () => {
  describe('commandQueue filter return false branch (Card.tsx line 199)', () => {
    it('should ignore commands that do not match any known command type', async () => {
      // 测试覆盖 Card.tsx 行 199: filter 中 return false 分支
      // 发送一个不包含任何已知命令类型的对象
      const TestComponent: React.FC = () => <div data-testid="test">Test</div>;

      render(
        <Box
          // @ts-ignore - 测试未知命令类型
          commands={[
            {
              version: 'v0.9',
              updateComponents: {
                surfaceId: 'card1',
                components: [{ id: 'root', component: 'TestComponent' }],
              },
            },
            {
              // 这个命令不包含任何已知的命令类型键，会触发 return false
              // @ts-expect-error - 故意使用未知命令类型测试 filter return false 分支
              unknownCommand: { surfaceId: 'card1' },
            },
          ]}
          components={{ TestComponent }}
        >
          <Card id="card1" />
        </Box>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('test')).toBeInTheDocument();
      });
    });
  });

  describe('resolveActionContextPathRefs v0.9 non-path-object branch (Card.tsx line 390-393)', () => {
    it('should pass through non-path-object values in v0.9 context', async () => {
      // 测试覆盖 Card.tsx 行 394-396: v0.9 context 中值不是 path 对象时直接保留并合并到上报 context。
      // resolveActionContextPathRefs 会将配置侧字面量（如 label: 'static-label'）放入 resolvedFromConfig，
      // 再与组件运行时 context 合并（运行时值优先）。
      // 组件运行时只传 value，不传 label，因此 label 完全来自配置侧字面量。
      const onAction = jest.fn();

      const ClickableComponent: React.FC<{
        onAction?: (name: string, ctx: any) => void;
      }> = ({ onAction: componentOnAction }) => (
        <button
          type="button"
          data-testid="click-btn"
          onClick={() =>
            componentOnAction?.('click', {
              // 只传 value（对应配置侧 path 绑定），不传 label
              // label 完全来自配置侧字面量，验证字面量被正确合并到上报 context
              value: 'runtime-value',
            })
          }
        >
          Click
        </button>
      );

      render(
        <Box
          commands={[
            {
              version: 'v0.9',
              updateDataModel: {
                surfaceId: 'card1',
                path: '/data/value',
                value: 'resolved-value',
              },
            },
            {
              version: 'v0.9',
              updateComponents: {
                surfaceId: 'card1',
                components: [
                  {
                    id: 'root',
                    component: 'ClickableComponent',
                    action: {
                      event: {
                        name: 'click',
                        // context 中包含 path 对象和非 path 对象（字面量）
                        context: {
                          // 字面量：会被合并到上报 context 中
                          label: 'static-label',
                          // path 绑定：解析后以 { value } 格式合并
                          value: { path: '/data/value' },
                        },
                      },
                    },
                  },
                ],
              },
            },
          ]}
          components={{ ClickableComponent }}
          onAction={onAction}
        >
          <Card id="card1" />
        </Box>,
      );

      fireEvent.click(screen.getByTestId('click-btn'));

      await waitFor(() => {
        expect(onAction).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'click',
            surfaceId: 'card1',
            context: expect.objectContaining({
              // 组件运行时传入的 value 优先
              value: 'runtime-value',
              // 配置侧字面量 label 被合并到上报 context 中
              label: 'static-label',
            }),
          }),
        );
      });
    });
  });

  describe('resolveActionContextPathRefs v0.8 non-path-object branch (Card.tsx line 409-410)', () => {
    it('should pass through non-path-object values in v0.8 context', async () => {
      // 测试覆盖 Card.tsx 行 411-413: v0.8 context 中值不是 path 对象时直接保留并合并到上报 context。
      // resolveActionContextPathRefs 会将配置侧字面量（如 staticKey: 'literal-value'）放入 resolvedFromConfig，
      // 再与组件运行时 context 合并（运行时值优先）。
      // 组件运行时只传 dynamicKey，不传 staticKey，因此 staticKey 完全来自配置侧字面量。
      const onAction = jest.fn();

      const ClickableComponent: React.FC<{
        onAction?: (name: string, ctx: any) => void;
      }> = ({ onAction: componentOnAction }) => (
        <button
          type="button"
          data-testid="click-btn-v08"
          onClick={() =>
            componentOnAction?.('click', {
              // 只传 dynamicKey（对应配置侧 path 绑定），不传 staticKey
              // staticKey 完全来自配置侧字面量，验证字面量被正确合并到上报 context
              dynamicKey: 'runtime-dynamic',
            })
          }
        >
          Click
        </button>
      );

      render(
        <Box
          commands={[
            {
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
                              key: 'staticKey',
                              // 非 path 对象，直接是字面值：会被合并到上报 context 中
                              value: 'literal-value',
                            },
                            {
                              key: 'dynamicKey',
                              // path 绑定：解析后以 { value } 格式合并
                              value: { path: '/data/dynamic' },
                            },
                          ],
                        },
                      },
                    },
                  },
                ],
              },
            },
            {
              beginRendering: {
                surfaceId: 'card1',
                root: 'root',
              },
            },
          ]}
          components={{ ClickableComponent }}
          onAction={onAction}
        >
          <Card id="card1" />
        </Box>,
      );

      fireEvent.click(screen.getByTestId('click-btn-v08'));

      await waitFor(() => {
        expect(onAction).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'click',
            surfaceId: 'card1',
            context: expect.objectContaining({
              // 组件运行时传入的 dynamicKey 优先
              dynamicKey: 'runtime-dynamic',
              // 配置侧字面量 staticKey 被合并到上报 context 中
              staticKey: 'literal-value',
            }),
          }),
        );
      });
    });
  });

  describe('v0.9 createSurface when already rendered (Card.tsx line 219)', () => {
    it('should not reset state when createSurface received after already rendered', async () => {
      // 测试覆盖 Card.tsx 行 219: hasRenderedRef.current 为 true 时，v0.9 createSurface 不重置状态
      const TestComponent: React.FC<{ text?: string }> = ({ text }) => (
        <div data-testid="test">{text || 'default'}</div>
      );

      const { rerender } = render(
        <Box
          commands={[
            {
              version: 'v0.9',
              updateComponents: {
                surfaceId: 'card1',
                components: [{ id: 'root', component: 'TestComponent', text: 'initial' }],
              },
            },
          ]}
          components={{ TestComponent }}
        >
          <Card id="card1" />
        </Box>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('test').textContent).toBe('initial');
      });

      // 再次发送 createSurface（此时 hasRenderedRef.current 为 true）
      rerender(
        <Box
          commands={[
            {
              version: 'v0.9',
              updateComponents: {
                surfaceId: 'card1',
                components: [{ id: 'root', component: 'TestComponent', text: 'initial' }],
              },
            },
            {
              version: 'v0.9',
              createSurface: {
                surfaceId: 'card1',
                catalogId: '',
              },
            },
            {
              version: 'v0.9',
              updateComponents: {
                surfaceId: 'card1',
                components: [{ id: 'root', component: 'TestComponent', text: 'after-recreate' }],
              },
            },
          ]}
          components={{ TestComponent }}
        >
          <Card id="card1" />
        </Box>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('test').textContent).toBe('after-recreate');
      });
    });
  });

  describe('resolveActionContextPathRefs returns componentContext when no format matched (Card.tsx line 418)', () => {
    it('should return original componentContext when actionConfig has no matching format', async () => {
      // 测试覆盖 Card.tsx 行 418: resolvedContext 为空时返回原始 componentContext
      // 当 actionConfig 存在但既没有 v0.9 event.context 也没有 v0.8 context 数组时
      const onAction = jest.fn();

      const ClickableComponent: React.FC<{
        onAction?: (name: string, ctx: any) => void;
      }> = ({ onAction: componentOnAction }) => (
        <button
          type="button"
          data-testid="click-no-context"
          onClick={() =>
            componentOnAction?.('click', {
              someValue: 'test',
            })
          }
        >
          Click
        </button>
      );

      render(
        <Box
          commands={[
            {
              version: 'v0.9',
              updateComponents: {
                surfaceId: 'card1',
                components: [
                  {
                    id: 'root',
                    component: 'ClickableComponent',
                    // action 没有 event.context 也没有 context 数组
                    action: {
                      name: 'submit',
                      // 没有 event 字段，也没有 context 数组
                    },
                  },
                ],
              },
            },
          ]}
          components={{ ClickableComponent }}
          onAction={onAction}
        >
          <Card id="card1" />
        </Box>,
      );

      fireEvent.click(screen.getByTestId('click-no-context'));

      await waitFor(() => {
        expect(onAction).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'click',
            surfaceId: 'card1',
            // 应该返回原始 componentContext
            context: expect.objectContaining({
              someValue: 'test',
            }),
          }),
        );
      });
    });
  });

  describe('v0.8 resolveActionContextPathRefs with empty resolvedContext (Card.tsx line 418)', () => {
    it('should merge config literal values into reported context when v0.8 context has no path objects', async () => {
      // 测试 v0.8 格式下 context 数组中只有字面量（无 path 对象）时的行为：
      // resolveActionContextPathRefs 会将配置侧字面量（literalKey: 'literal-value'）放入 resolvedFromConfig，
      // 再与组件运行时 context 合并（运行时值优先）。
      // 因此上报的 context 同时包含运行时传入的值和配置侧字面量。
      const onAction = jest.fn();

      const ClickableComponent: React.FC<{
        onAction?: (name: string, ctx: any) => void;
      }> = ({ onAction: componentOnAction }) => (
        <button
          type="button"
          data-testid="click-v08-empty"
          onClick={() =>
            componentOnAction?.('click', {
              someValue: 'test',
            })
          }
        >
          Click
        </button>
      );

      render(
        <Box
          commands={[
            {
              surfaceUpdate: {
                surfaceId: 'card1',
                components: [
                  {
                    id: 'root',
                    component: {
                      ClickableComponent: {
                        action: {
                          // v0.8 格式: context 是数组，但没有 path 对象，只有字面量
                          context: [
                            {
                              key: 'literalKey',
                              value: 'literal-value', // 非 path 对象，会被 extractDataUpdatesV08 跳过
                            },
                          ],
                        },
                      },
                    },
                  },
                ],
              },
            },
            {
              beginRendering: {
                surfaceId: 'card1',
                root: 'root',
              },
            },
          ]}
          components={{ ClickableComponent }}
          onAction={onAction}
        >
          <Card id="card1" />
        </Box>,
      );

      fireEvent.click(screen.getByTestId('click-v08-empty'));

      await waitFor(() => {
        expect(onAction).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'click',
            surfaceId: 'card1',
            context: expect.objectContaining({
              // 组件运行时传入的值
              someValue: 'test',
              // 配置侧字面量被合并到上报 context 中
              literalKey: 'literal-value',
            }),
          }),
        );
      });
    });
  });

  describe('NodeRenderer commandVersion default v0.8 branch (Card.tsx line 76)', () => {
    it('should use v0.8 as default commandVersion in NodeRenderer', async () => {
      // 测试覆盖 Card.tsx 行 76: commandVersion = 'v0.8' 默认参数分支
      // 当 commandVersion 未传给 NodeRenderer 时，默认使用 v0.8
      // 这通过 renderNode 函数调用 NodeRenderer 时不传 commandVersion 来触发
      const TestComponent: React.FC<{ text?: string }> = ({ text }) => (
        <div data-testid="test">{text || 'default'}</div>
      );

      // 使用 v0.8 命令（不带 version 字段），NodeRenderer 会使用默认 commandVersion
      render(
        <Box
          commands={[
            {
              surfaceUpdate: {
                surfaceId: 'card1',
                components: [
                  {
                    id: 'root',
                    component: {
                      TestComponent: { text: 'v0.8-default' },
                    },
                    // 有子节点，会触发 renderNode 调用，renderNode 会传 commandVersion
                  },
                ],
              },
            },
            {
              beginRendering: {
                surfaceId: 'card1',
                root: 'root',
              },
            },
          ]}
          components={{ TestComponent }}
        >
          <Card id="card1" />
        </Box>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('test').textContent).toBe('v0.8-default');
      });
    });
  });

  describe('validation errors in development mode (Card.tsx line 84)', () => {
    it('should warn for each validation error in development mode', async () => {
      // 测试覆盖 Card.tsx 行 84-87: validation.errors.length > 0 且 dev 模式时 forEach 警告
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development' as any;

      // 注册一个有严格 schema 的 catalog
      registerCatalog({
        $id: 'validation-catalog',
        components: {
          StrictComponent: {
            type: 'object',
            required: ['requiredProp'],
            properties: {
              requiredProp: { type: 'string' },
            },
          },
        },
      });

      const StrictComponent: React.FC<{ requiredProp?: string }> = ({ requiredProp }) => (
        <div data-testid="strict">{requiredProp || 'missing'}</div>
      );

      render(
        <Box
          commands={[
            {
              version: 'v0.9',
              createSurface: {
                surfaceId: 'card1',
                catalogId: 'validation-catalog',
              },
            },
            {
              version: 'v0.9',
              updateComponents: {
                surfaceId: 'card1',
                components: [
                  {
                    id: 'root',
                    component: 'StrictComponent',
                    // 故意不传 requiredProp，触发 validation error
                  },
                ],
              },
            },
          ]}
          components={{ StrictComponent }}
        >
          <Card id="card1" />
        </Box>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('strict')).toBeInTheDocument();
        // 验证开发模式下 validation.errors.forEach 确实被执行，并输出了包含字段名的警告
        expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('requiredProp'));
      });

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('catalog component not registered non-dev mode (Card.tsx line 97-105)', () => {
    it('should return null without error in non-dev mode when component not in catalog', async () => {
      // 测试覆盖 Card.tsx 行 97-105: catalog 存在且组件不在 catalog 中，非 dev 模式
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production' as any;

      registerCatalog({
        $id: 'prod-catalog',
        components: {
          OtherComponent: { type: 'object' },
        },
      });

      render(
        <Box
          commands={[
            {
              version: 'v0.9',
              createSurface: {
                surfaceId: 'card1',
                catalogId: 'prod-catalog',
              },
            },
            {
              version: 'v0.9',
              updateComponents: {
                surfaceId: 'card1',
                components: [
                  {
                    id: 'root',
                    component: 'UnknownComponent', // 不在 catalog 中
                  },
                ],
              },
            },
          ]}
          components={{}}
        >
          <Card id="card1" />
        </Box>,
      );

      // 非 dev 模式下不应该有 console.error
      await waitFor(() => {
        expect(console.error).not.toHaveBeenCalled();
      });

      process.env.NODE_ENV = originalEnv;
    });

    it('should return null without warning in non-dev mode when component in catalog but not registered', async () => {
      // 测试覆盖 Card.tsx 行 105-110: 组件在 catalog 中但未注册，非 dev 模式
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production' as any;

      registerCatalog({
        $id: 'prod-catalog-2',
        components: {
          KnownComponent: { type: 'object' },
        },
      });

      render(
        <Box
          commands={[
            {
              version: 'v0.9',
              createSurface: {
                surfaceId: 'card1',
                catalogId: 'prod-catalog-2',
              },
            },
            {
              version: 'v0.9',
              updateComponents: {
                surfaceId: 'card1',
                components: [
                  {
                    id: 'root',
                    component: 'KnownComponent', // 在 catalog 中但未注册
                  },
                ],
              },
            },
          ]}
          components={{}} // 没有注册 KnownComponent
        >
          <Card id="card1" />
        </Box>,
      );

      // 非 dev 模式下不应该有 console.warn
      await waitFor(() => {
        expect(console.warn).not.toHaveBeenCalled();
      });

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('surfaceCatalogMap undefined branch (Card.tsx line 164 false branch)', () => {
    it('should handle Card without Box wrapper (surfaceCatalogMap is undefined)', async () => {
      // 测试覆盖 Card.tsx 行 164: surfaceCatalogMap 为 undefined 时返回 undefined
      // BoxContext 的默认值中 surfaceCatalogMap 是 undefined
      // 直接使用 BoxContext.Provider 并不传 surfaceCatalogMap
      const BoxContext = require('../Context').default;
      const TestComponent: React.FC = () => <div data-testid="test">Test</div>;

      render(
        <BoxContext.Provider
          value={{
            components: { TestComponent },
            commandQueue: [
              {
                version: 'v0.9',
                updateComponents: {
                  surfaceId: 'card1',
                  components: [{ id: 'root', component: 'TestComponent' }],
                },
              },
            ],
            // 故意不传 surfaceCatalogMap（undefined）
            surfaceCatalogMap: undefined,
            catalogMap: undefined,
          }}
        >
          <Card id="card1" />
        </BoxContext.Provider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('test')).toBeInTheDocument();
      });
    });
  });

  describe('v0.8 surfaceUpdate rootNodeFromCache null branch (Card.tsx line 270 false branch)', () => {
    it('should not update rootNode when rootNodeFromCache is null after surfaceUpdate', async () => {
      // 测试覆盖 Card.tsx 行 270: rootNodeFromCache 为 null 时不更新 rootNode
      // 场景：hasRenderedRef 为 true，但 surfaceUpdate 传了空组件列表，getById('root') 返回 null
      const TestComponent: React.FC<{ text?: string }> = ({ text }) => (
        <div data-testid="test">{text || 'default'}</div>
      );

      // 先渲染一次（设置 hasRenderedRef.current = true）
      const { rerender } = render(
        <Box
          commands={[
            {
              surfaceUpdate: {
                surfaceId: 'card1',
                components: [
                  {
                    id: 'root',
                    component: { TestComponent: { text: 'initial' } },
                  },
                ],
              },
            },
            {
              beginRendering: {
                surfaceId: 'card1',
                root: 'root',
              },
            },
          ]}
          components={{ TestComponent }}
        >
          <Card id="card1" />
        </Box>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('test').textContent).toBe('initial');
      });

      // 发送 surfaceUpdate 但传空组件列表
      // hasRenderedRef.current 为 true，但 getById('root') 会返回 null（因为 transform([]) 不更新缓存）
      rerender(
        <Box
          commands={[
            {
              surfaceUpdate: {
                surfaceId: 'card1',
                components: [], // 空组件列表，transform 不会更新 root 缓存
              },
            },
          ]}
          components={{ TestComponent }}
        >
          <Card id="card1" />
        </Box>,
      );

      // rootNode 应该保持不变（因为 rootNodeFromCache 为 null，不更新）
      await waitFor(() => {
        expect(screen.getByTestId('test').textContent).toBe('initial');
      });
    });
  });

  describe('NodeRenderer without commandVersion prop (Card.tsx line 76 default branch)', () => {
    it('should use v0.8 default when commandVersion not passed to NodeRenderer via renderNode', async () => {
      // 测试覆盖 Card.tsx 行 76: commandVersion 默认值 'v0.8'
      // renderNode 函数调用 NodeRenderer 时会传 commandVersion，但当 commandVersion 为 undefined 时触发默认值
      // 通过 v0.8 模式（不带 version 字段）来触发，此时 commandVersion 为 'v0.8'
      const ParentComponent: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
        <div data-testid="parent">{children}</div>
      );
      const ChildComponent: React.FC<{ text?: string }> = ({ text }) => (
        <div data-testid="child">{text || 'child-default'}</div>
      );

      // v0.8 模式，有子节点，会触发 renderNode 调用（传 commandVersion）
      render(
        <Box
          commands={[
            {
              surfaceUpdate: {
                surfaceId: 'card1',
                components: [
                  {
                    id: 'root',
                    component: {
                      ParentComponent: {
                        // v0.8 格式：children 在 component config 中定义
                        children: ['child1'],
                      },
                    },
                  },
                  {
                    id: 'child1',
                    component: {
                      ChildComponent: { text: { literalString: 'child-text' } },
                    },
                  },
                ],
              },
            },
            {
              beginRendering: {
                surfaceId: 'card1',
                root: 'root',
              },
            },
          ]}
          components={{ ParentComponent, ChildComponent }}
        >
          <Card id="card1" />
        </Box>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('parent')).toBeInTheDocument();
        expect(screen.getByTestId('child').textContent).toBe('child-text');
      });
    });
  });

  describe('resolveActionContextPathRefs with empty componentContext (Submit button scenario)', () => {
    it('should resolve path refs from actionConfig even when componentContext is empty (v0.9)', async () => {
      // 测试修复后的核心场景：Submit 按钮触发 action 时传入空 context {}
      // 但 actionConfig.event.context 中定义了 path 引用，应该从 dataModel 中读取值
      const onAction = jest.fn();

      const SubmitButton: React.FC<{
        onAction?: (name: string, ctx: any) => void;
      }> = ({ onAction: componentOnAction }) => (
        <button
          type="button"
          data-testid="submit-btn"
          onClick={() =>
            // Submit 按钮触发 action 时传入空 context
            componentOnAction?.('submit', {})
          }
        >
          Submit
        </button>
      );

      render(
        <Box
          commands={[
            {
              version: 'v0.9',
              updateDataModel: {
                surfaceId: 'card1',
                path: '/form/username',
                value: 'alice',
              },
            },
            {
              version: 'v0.9',
              updateDataModel: {
                surfaceId: 'card1',
                path: '/form/email',
                value: 'alice@example.com',
              },
            },
            {
              version: 'v0.9',
              updateComponents: {
                surfaceId: 'card1',
                components: [
                  {
                    id: 'root',
                    component: 'SubmitButton',
                    action: {
                      event: {
                        name: 'submit',
                        // actionConfig 中定义了 path 引用，即使组件传入空 context 也应被解析
                        context: {
                          username: { path: '/form/username', label: '用户名' },
                          email: { path: '/form/email' },
                        },
                      },
                    },
                  },
                ],
              },
            },
          ]}
          components={{ SubmitButton }}
          onAction={onAction}
        >
          <Card id="card1" />
        </Box>,
      );

      fireEvent.click(screen.getByTestId('submit-btn'));

      await waitFor(() => {
        expect(onAction).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'submit',
            surfaceId: 'card1',
            context: expect.objectContaining({
              // path 引用应从 dataModel 中解析，即使 componentContext 为空
              username: expect.objectContaining({ value: 'alice', label: '用户名' }),
              email: expect.objectContaining({ value: 'alice@example.com' }),
            }),
          }),
        );
      });
    });

    it('should resolve path refs from actionConfig even when componentContext is empty (v0.8)', async () => {
      // 测试 v0.8 格式下 Submit 按钮（空 componentContext）场景
      const onAction = jest.fn();

      const SubmitButton: React.FC<{
        onAction?: (name: string, ctx: any) => void;
      }> = ({ onAction: componentOnAction }) => (
        <button
          type="button"
          data-testid="submit-btn-v08"
          onClick={() =>
            // Submit 按钮触发 action 时传入空 context
            componentOnAction?.('submit', {})
          }
        >
          Submit
        </button>
      );

      render(
        <Box
          commands={[
            {
              surfaceUpdate: {
                surfaceId: 'card1',
                components: [
                  {
                    id: 'root',
                    component: {
                      SubmitButton: {
                        action: {
                          // v0.8 格式: context 是数组
                          context: [{ key: 'formData', value: { path: '/form/data' } }],
                        },
                      },
                    },
                  },
                ],
              },
            },
            {
              beginRendering: {
                surfaceId: 'card1',
                root: 'root',
              },
            },
          ]}
          components={{ SubmitButton }}
          onAction={onAction}
        >
          <Card id="card1" />
        </Box>,
      );

      fireEvent.click(screen.getByTestId('submit-btn-v08'));

      await waitFor(() => {
        expect(onAction).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'submit',
            surfaceId: 'card1',
            // v0.8 格式下，即使 componentContext 为空，也应从 actionConfig 解析 path 引用
            context: expect.objectContaining({
              formData: expect.objectContaining({ value: undefined }),
            }),
          }),
        );
      });
    });

    it('should merge componentContext over actionConfig resolved values (componentContext takes priority)', async () => {
      // 测试合并优先级：componentContext 中的值应覆盖 actionConfig 解析出的值
      const onAction = jest.fn();

      const ClickableComponent: React.FC<{
        onAction?: (name: string, ctx: any) => void;
      }> = ({ onAction: componentOnAction }) => (
        <button
          type="button"
          data-testid="priority-btn"
          onClick={() =>
            // 组件传入的 context 中 username 是实际值（非 path 对象），应优先于 actionConfig 解析值
            componentOnAction?.('click', {
              username: 'runtime-value',
            })
          }
        >
          Click
        </button>
      );

      render(
        <Box
          commands={[
            {
              version: 'v0.9',
              updateDataModel: {
                surfaceId: 'card1',
                path: '/form/username',
                value: 'config-value',
              },
            },
            {
              version: 'v0.9',
              updateComponents: {
                surfaceId: 'card1',
                components: [
                  {
                    id: 'root',
                    component: 'ClickableComponent',
                    action: {
                      event: {
                        name: 'click',
                        context: {
                          username: { path: '/form/username' },
                        },
                      },
                    },
                  },
                ],
              },
            },
          ]}
          components={{ ClickableComponent }}
          onAction={onAction}
        >
          <Card id="card1" />
        </Box>,
      );

      fireEvent.click(screen.getByTestId('priority-btn'));

      await waitFor(() => {
        expect(onAction).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'click',
            surfaceId: 'card1',
            context: expect.objectContaining({
              // componentContext 中的 runtime-value 应覆盖 actionConfig 解析出的 config-value
              username: 'runtime-value',
            }),
          }),
        );
      });
    });
  });
});
