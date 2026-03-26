/**
 * Box.tsx 和 Card.tsx 集成测试用例
 * 覆盖 Box, Card, NodeRenderer 组件的各种场景
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Box from '../Box';
import Card from '../Card';
import type { A2UICommand_v0_9 } from '../types/command_v0.9';
import type { XAgentCommand_v0_8 } from '../types/command_v0.8';
import { registerCatalog, clearCatalogCache } from '../catalog';

// Mock console
const originalConsole = { ...console };
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
  mockFetch.mockClear();
});

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// 简单测试组件
const TestText: React.FC<{
  text?: string;
  onAction?: (name: string, context: Record<string, any>) => void;
}> = ({ text, onAction }) => (
  <div data-testid="test-text" onClick={() => onAction?.('click', { value: 'clicked' })}>
    {text}
  </div>
);

const TestContainer: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div data-testid="test-container">{children}</div>
);

describe('Box Component', () => {
  describe('v0.8', () => {
    it('should render children without commands', () => {
      render(
        <Box>
          <div data-testid="child">Child</div>
        </Box>,
      );
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('should render Card children', () => {
      render(
        <Box>
          <Card id="test-card" />
        </Box>,
      );
      // Card 应该被渲染，但内容为空（没有 commands）
    });

    it('should provide context with v0.8 default version', () => {
      const TestComponent = () => {
        const context = React.useContext(require('../Context').default) as {
          commandVersion?: string;
        };
        return <div data-testid="version">{context.commandVersion}</div>;
      };

      render(
        <Box>
          <TestComponent />
        </Box>,
      );
      expect(screen.getByTestId('version').textContent).toBe('v0.8');
    });

    it('should handle surfaceUpdate command', async () => {
      const commands: XAgentCommand_v0_8[] = [
        {
          surfaceUpdate: {
            surfaceId: 'card1',
            components: [
              {
                id: 'root',
                component: {
                  TestContainer: {
                    children: ['text1'],
                  },
                },
              },
              {
                id: 'text1',
                component: {
                  TestText: {
                    text: 'Hello World',
                  },
                },
              },
            ],
          },
        },
      ];

      const components = {
        TestContainer,
        TestText,
      };

      render(
        <Box commands={commands} components={components}>
          <Card id="card1" />
        </Box>,
      );

      // v0.8 需要 beginRendering 才会渲染
      // 没有 beginRendering，不应该渲染内容
    });

    it('should handle beginRendering command', async () => {
      const commands: XAgentCommand_v0_8[] = [
        {
          beginRendering: {
            surfaceId: 'card1',
            root: 'root',
          },
        },
      ];

      render(
        <Box commands={commands}>
          <Card id="card1" />
        </Box>,
      );

      // 没有 surfaceUpdate，root 不存在
    });

    it('should handle dataModelUpdate command', async () => {
      const TestComponent: React.FC<{ value?: string }> = ({ value }) => (
        <div data-testid="data-value">{value || 'empty'}</div>
      );

      // 先通过 surfaceUpdate 设置组件
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
                        value: { path: '/data/field' },
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

      // 更新 dataModel
      rerender(
        <Box
          commands={[
            {
              beginRendering: { surfaceId: 'card1', root: 'root' },
            },
          ]}
          components={{ TestComponent }}
        >
          <Card id="card1" />
        </Box>,
      );
    });

    it('should handle deleteSurface command', async () => {
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
                      TestContainer: {},
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
          components={{ TestContainer }}
        >
          <Card id="card1" />
        </Box>,
      );

      expect(screen.getByTestId('test-container')).toBeInTheDocument();

      // 删除 surface
      rerender(
        <Box
          commands={[
            {
              deleteSurface: {
                surfaceId: 'card1',
              },
            },
          ]}
          components={{ TestContainer }}
        >
          <Card id="card1" />
        </Box>,
      );

      expect(screen.queryByTestId('test-container')).not.toBeInTheDocument();
    });
  });

  describe('v0.9', () => {
    it('should detect v0.9 version from commands', () => {
      const TestComponent = () => {
        const context = React.useContext(require('../Context').default) as {
          commandVersion?: string;
        };
        return <div data-testid="version">{context.commandVersion}</div>;
      };

      const commands: A2UICommand_v0_9[] = [
        {
          version: 'v0.9',
          updateComponents: {
            surfaceId: 'card1',
            components: [],
          },
        },
      ];

      render(
        <Box commands={commands}>
          <TestComponent />
        </Box>,
      );
      expect(screen.getByTestId('version').textContent).toBe('v0.9');
    });

    it('should handle updateComponents command', async () => {
      const commands: A2UICommand_v0_9[] = [
        {
          version: 'v0.9',
          updateComponents: {
            surfaceId: 'card1',
            components: [
              {
                id: 'root',
                component: 'TestContainer',
                children: ['text1'],
              },
              {
                id: 'text1',
                component: 'TestText',
                text: 'Hello v0.9',
              },
            ],
          },
        },
      ];

      render(
        <Box commands={commands} components={{ TestContainer, TestText }}>
          <Card id="card1" />
        </Box>,
      );

      expect(screen.getByTestId('test-container')).toBeInTheDocument();
      expect(screen.getByText('Hello v0.9')).toBeInTheDocument();
    });

    it('should handle updateDataModel command', async () => {
      const TestComponent: React.FC<{ value?: string }> = ({ value }) => (
        <div data-testid="data-value">{value || 'empty'}</div>
      );

      // 先渲染组件
      const { rerender } = render(
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
                    value: { path: '/data/field' },
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

      // 初始应该显示 empty（因为 dataModel 中没有值）
      expect(screen.getByTestId('data-value').textContent).toBe('empty');

      // 更新 dataModel
      rerender(
        <Box
          commands={[
            {
              version: 'v0.9',
              updateDataModel: {
                surfaceId: 'card1',
                path: '/data/field',
                value: 'updated value',
              },
            },
          ]}
          components={{ TestComponent }}
        >
          <Card id="card1" />
        </Box>,
      );

      // 注意：由于 React 的状态更新机制，这里可能需要 waitFor
    });

    it('should handle deleteSurface command in v0.9', async () => {
      const { rerender } = render(
        <Box
          commands={[
            {
              version: 'v0.9',
              updateComponents: {
                surfaceId: 'card1',
                components: [
                  {
                    id: 'root',
                    component: 'TestContainer',
                  },
                ],
              },
            },
          ]}
          components={{ TestContainer }}
        >
          <Card id="card1" />
        </Box>,
      );

      expect(screen.getByTestId('test-container')).toBeInTheDocument();

      rerender(
        <Box
          commands={[
            {
              version: 'v0.9',
              deleteSurface: {
                surfaceId: 'card1',
              },
            },
          ]}
          components={{ TestContainer }}
        >
          <Card id="card1" />
        </Box>,
      );

      expect(screen.queryByTestId('test-container')).not.toBeInTheDocument();
    });

    it('should handle createSurface command', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            $id: 'test-catalog',
            components: {
              TestContainer: { type: 'object' },
            },
          }),
      });

      render(
        <Box
          commands={[
            {
              version: 'v0.9',
              createSurface: {
                surfaceId: 'card1',
                catalogId: 'https://example.com/catalog.json',
              },
            },
          ]}
          components={{ TestContainer }}
        >
          <Card id="card1" />
        </Box>,
      );

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('https://example.com/catalog.json');
      });
    });

    it('should handle createSurface with local catalog', async () => {
      // 在测试前注册 catalog
      const localCatalogId = 'local://my-catalog-2';
      registerCatalog({
        $id: localCatalogId,
        components: {
          TestContainer: { type: 'object' },
        },
      });

      // 先创建一个 Box，触发 createSurface
      render(
        <Box
          commands={[
            {
              version: 'v0.9',
              createSurface: {
                surfaceId: 'card1',
                catalogId: localCatalogId,
              },
            },
          ]}
          components={{ TestContainer }}
        >
          <Card id="card1" />
        </Box>,
      );

      // 等待 catalog 加载
      await waitFor(() => {
        // 由于已经在缓存中，fetch 不应该被调用
        expect(mockFetch).not.toHaveBeenCalled();
      });
    });
  });

  describe('onAction callback', () => {
    it('should call onAction when component triggers action', async () => {
      const onAction = jest.fn();

      const ClickableComponent: React.FC<{ onAction?: (name: string, ctx: any) => void }> = ({
        onAction: componentOnAction,
      }) => (
        <button
          type="button"
          data-testid="click-btn"
          onClick={() => componentOnAction?.('click', { value: 'clicked' })}
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

      const btn = screen.getByTestId('click-btn');
      btn.click();

      await waitFor(() => {
        expect(onAction).toHaveBeenCalled();
      });
    });

    it('should pass action name and surfaceId in callback', async () => {
      const onAction = jest.fn();

      const ActionComponent: React.FC<{ onAction?: (name: string, ctx: any) => void }> = ({
        onAction: componentOnAction,
      }) => (
        <button
          type="button"
          data-testid="action-btn"
          onClick={() => componentOnAction?.('submit', { formData: 'test' })}
        >
          Submit
        </button>
      );

      render(
        <Box
          commands={[
            {
              version: 'v0.9',
              updateComponents: {
                surfaceId: 'test-surface',
                components: [
                  {
                    id: 'root',
                    component: 'ActionComponent',
                  },
                ],
              },
            },
          ]}
          components={{ ActionComponent }}
          onAction={onAction}
        >
          <Card id="test-surface" />
        </Box>,
      );

      screen.getByTestId('action-btn').click();

      await waitFor(() => {
        expect(onAction).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'submit',
            surfaceId: 'test-surface',
          }),
        );
      });
    });
  });

  describe('catalog validation', () => {
    it('should validate component against catalog in development', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      registerCatalog({
        $id: 'validation-catalog',
        components: {
          ValidComponent: {
            type: 'object',
            required: ['requiredField'],
            properties: {
              requiredField: { type: 'string' },
            },
          },
        },
      });

      const ValidComponent: React.FC<{ requiredField?: string }> = ({ requiredField }) => (
        <div data-testid="valid-component">{requiredField}</div>
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
                    component: 'ValidComponent',
                    // 缺少 requiredField
                  },
                ],
              },
            },
          ]}
          components={{ ValidComponent }}
        >
          <Card id="card1" />
        </Box>,
      );

      // 应该有警告输出
      await waitFor(() => {
        expect(console.warn).toHaveBeenCalled();
      });

      process.env.NODE_ENV = originalEnv;
    });

    it('should warn when component not registered but in catalog', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      registerCatalog({
        $id: 'missing-component-catalog',
        components: {
          MissingComponent: { type: 'object' },
        },
      });

      render(
        <Box
          commands={[
            {
              version: 'v0.9',
              createSurface: {
                surfaceId: 'card1',
                catalogId: 'missing-component-catalog',
              },
            },
            {
              version: 'v0.9',
              updateComponents: {
                surfaceId: 'card1',
                components: [
                  {
                    id: 'root',
                    component: 'MissingComponent',
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
        expect(console.warn).toHaveBeenCalled();
      });

      process.env.NODE_ENV = originalEnv;
    });

    it('should error when component not in catalog and not registered', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      // 首先创建一个带有 catalog 的 surface
      registerCatalog({
        $id: 'error-test-catalog',
        components: {
          // 空的 catalog，不包含 UnknownComponent
        },
      });

      const { rerender } = render(
        <Box
          commands={[
            {
              version: 'v0.9',
              createSurface: {
                surfaceId: 'card1',
                catalogId: 'error-test-catalog',
              },
            },
          ]}
          components={{}}
        >
          <Card id="card1" />
        </Box>,
      );

      // 等待 catalog 加载完成
      await waitFor(() => {
        expect(console.log).toHaveBeenCalledWith(
          'Box: catalog loaded',
          'error-test-catalog',
          expect.any(Object),
        );
      });

      // 然后发送 updateComponents 命令
      rerender(
        <Box
          commands={[
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
        expect(console.error).toHaveBeenCalled();
      });

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('multiple cards', () => {
    it('should render multiple cards independently', async () => {
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
                    component: 'TestText',
                    text: 'Card 1',
                  },
                ],
              },
            },
          ]}
          components={{ TestText }}
        >
          <Card id="card1" />
          <Card id="card2" />
        </Box>,
      );

      // card1 应该渲染内容
      expect(screen.getByText('Card 1')).toBeInTheDocument();
      // card2 没有收到命令，不应该渲染
    });

    it('should handle different cards with different commands', async () => {
      const { rerender } = render(
        <Box
          commands={[
            {
              version: 'v0.9',
              updateComponents: {
                surfaceId: 'card1',
                components: [
                  {
                    id: 'root',
                    component: 'TestText',
                    text: 'Card 1',
                  },
                ],
              },
            },
          ]}
          components={{ TestText }}
        >
          <Card id="card1" />
          <Card id="card2" />
        </Box>,
      );

      expect(screen.getByText('Card 1')).toBeInTheDocument();

      // 更新 card2
      rerender(
        <Box
          commands={[
            {
              version: 'v0.9',
              updateComponents: {
                surfaceId: 'card2',
                components: [
                  {
                    id: 'root',
                    component: 'TestText',
                    text: 'Card 2',
                  },
                ],
              },
            },
          ]}
          components={{ TestText }}
        >
          <Card id="card1" />
          <Card id="card2" />
        </Box>,
      );

      // card1 内容应该保留（被缓存在 transformer 中）
      // card2 应该渲染新内容
    });
  });

  describe('data binding', () => {
    it('should resolve data binding in v0.9', async () => {
      const DataComponent: React.FC<{ value?: string }> = ({ value }) => (
        <div data-testid="bound-value">{value || 'no value'}</div>
      );

      const { rerender } = render(
        <Box
          commands={[
            {
              version: 'v0.9',
              updateComponents: {
                surfaceId: 'card1',
                components: [
                  {
                    id: 'root',
                    component: 'DataComponent',
                    value: { path: '/user/name' },
                  },
                ],
              },
            },
          ]}
          components={{ DataComponent }}
        >
          <Card id="card1" />
        </Box>,
      );

      // 初始没有值
      expect(screen.getByTestId('bound-value').textContent).toBe('no value');

      // 更新 dataModel
      rerender(
        <Box
          commands={[
            {
              version: 'v0.9',
              updateDataModel: {
                surfaceId: 'card1',
                path: '/user/name',
                value: 'Alice',
              },
            },
          ]}
          components={{ DataComponent }}
        >
          <Card id="card1" />
        </Box>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('bound-value').textContent).toBe('Alice');
      });
    });
  });
});
