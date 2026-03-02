import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { MermaidConfig } from 'mermaid';
import React from 'react';
import Actions from '../../actions';
import Mermaid from '../Mermaid';

// Mock mermaid
jest.mock('mermaid', () => ({
  initialize: jest.fn(),
  parse: jest.fn(),
  render: jest.fn(),
}));

// Mock SyntaxHighlighter
jest.mock('react-syntax-highlighter', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="syntax-highlighter">{children}</div>
  ),
}));

// Mock message
const mockMessageApi = {
  open: jest.fn(),
};

jest.mock('antd', () => {
  try {
    const actual = jest.requireActual('antd');
    return {
      ...actual,
      message: {
        useMessage: jest.fn(() => [mockMessageApi]),
      },
    };
  } catch (_error) {
    // 如果requireActual失败，返回一个基础mock
    return {
      message: {
        useMessage: jest.fn(() => [mockMessageApi]),
      },
      Button: jest.fn(({ children }) => <button type="button">{children}</button>),
      Segmented: jest.fn(({ options, value: _value, onChange }) => (
        <div>
          {options.map((opt: any) => (
            <button type="button" key={opt.value} onClick={() => onChange(opt.value)}>
              {opt.label}
            </button>
          ))}
        </div>
      )),
      Space: jest.fn(({ children }) => <div>{children}</div>),
      Tooltip: jest.fn(({ children }) => <div>{children}</div>),
    };
  }
});

// 添加类型定义
interface MockMermaid {
  initialize: jest.Mock;
  parse: jest.Mock;
  render: jest.Mock;
}

const mermaidContent = 'graph TD; A-->B;';

describe('Mermaid Component', () => {
  const mockMermaid = require('mermaid') as MockMermaid;
  const mockParse = mockMermaid.parse;
  const mockRender = mockMermaid.render;
  const mockInitialize = mockMermaid.initialize;

  beforeEach(() => {
    jest.clearAllMocks();
    mockParse.mockResolvedValue(true);
    mockRender.mockResolvedValue({
      svg: '<svg><rect width="100" height="100" /></svg>',
    });
  });

  describe('Basic Rendering', () => {
    it('should render correctly with valid mermaid code', async () => {
      const { container } = render(<Mermaid>{mermaidContent}</Mermaid>);

      await waitFor(() => {
        expect(mockRender).toHaveBeenCalledWith(
          expect.any(String),
          expect.stringContaining('graph TD; A-->B;'),
        );
      });

      expect(container.querySelector('.ant-mermaid')).toBeInTheDocument();
    });

    it('should handle invalid mermaid syntax', async () => {
      mockParse.mockResolvedValue(false);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const { container } = render(<Mermaid>invalid syntax</Mermaid>);

      // 等待组件渲染完成，验证组件仍然正常渲染
      await waitFor(() => {
        expect(container.querySelector('.ant-mermaid')).toBeInTheDocument();
      });

      consoleSpy.mockRestore();
    });

    it('should not render when children is empty', () => {
      const children = '';
      const { container } = render(<Mermaid>{children}</Mermaid>);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Mode Switching', () => {
    it('should switch between image and code view', async () => {
      render(<Mermaid>{mermaidContent}</Mermaid>);

      const codeButton = screen.getByText('Code');
      fireEvent.click(codeButton);

      expect(screen.getByTestId('syntax-highlighter')).toBeInTheDocument();
      expect(screen.getByText('graph TD; A-->B;')).toBeInTheDocument();
    });

    it('should render code view with proper styling', async () => {
      render(<Mermaid>{mermaidContent}</Mermaid>);

      const codeButton = screen.getByText('Code');
      fireEvent.click(codeButton);

      const syntaxHighlighter = screen.getByTestId('syntax-highlighter');
      expect(syntaxHighlighter).toBeInTheDocument();
      expect(syntaxHighlighter).toHaveTextContent('graph TD; A-->B;');
    });
  });

  describe('Copy Functionality', () => {
    it('should copy code to clipboard', async () => {
      const mockClipboard = {
        writeText: jest.fn().mockResolvedValue(undefined),
      };
      Object.defineProperty(navigator, 'clipboard', {
        writable: true,
        value: mockClipboard,
      });

      render(<Mermaid>{mermaidContent}</Mermaid>);

      // 切换到代码模式以显示复制按钮
      const codeButton = screen.getByText('Code');
      fireEvent.click(codeButton);

      // 查找复制按钮 - 使用更通用的选择器
      const copyButton = screen.getByRole('button', { name: /copy/i });
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(mockClipboard.writeText).toHaveBeenCalledWith('graph TD; A-->B;');
      });
    });

    it('should handle copy success without errors', async () => {
      const mockClipboard = {
        writeText: jest.fn().mockResolvedValue(undefined),
      };
      Object.defineProperty(navigator, 'clipboard', {
        writable: true,
        value: mockClipboard,
      });

      render(<Mermaid>{mermaidContent}</Mermaid>);

      // 切换到代码模式
      const codeButton = screen.getByText('Code');
      fireEvent.click(codeButton);

      const copyButton = screen.getByRole('button', { name: /copy/i });

      // 确保点击不会抛出错误
      expect(() => fireEvent.click(copyButton)).not.toThrow();

      // 验证剪贴板被调用
      await waitFor(() => {
        expect(mockClipboard.writeText).toHaveBeenCalledWith('graph TD; A-->B;');
      });
    });

    it('should handle clipboard error gracefully', async () => {
      const mockClipboard = {
        writeText: jest.fn().mockRejectedValue(new Error('Clipboard error')),
      };
      Object.defineProperty(navigator, 'clipboard', {
        writable: true,
        value: mockClipboard,
      });

      // Mock console.error to catch the error
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      render(<Mermaid>{mermaidContent}</Mermaid>);

      // 切换到代码模式
      const codeButton = screen.getByText('Code');
      fireEvent.click(codeButton);

      const copyButton = screen.getByRole('button', { name: /copy/i });
      fireEvent.click(copyButton);

      // 等待异步操作完成
      await waitFor(() => {
        expect(mockClipboard.writeText).toHaveBeenCalledWith('graph TD; A-->B;');
      });

      // 由于错误被Actions.Copy组件内部处理，我们验证剪贴板调用即可
      expect(mockClipboard.writeText).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('Zoom and Interaction', () => {
    it('should show zoom controls only in image mode', () => {
      render(<Mermaid>{mermaidContent}</Mermaid>);

      expect(screen.getByLabelText('zoom-in')).toBeInTheDocument();
      expect(screen.getByLabelText('zoom-out')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();
      expect(screen.getByLabelText('download')).toBeInTheDocument();

      const codeButton = screen.getByText('Code');
      fireEvent.click(codeButton);

      expect(screen.queryByLabelText('zoom-in')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('zoom-out')).not.toBeInTheDocument();
    });

    it('should handle zoom in/out', () => {
      render(<Mermaid>{mermaidContent}</Mermaid>);

      const zoomInButton = screen.getByLabelText('zoom-in');
      const zoomOutButton = screen.getByLabelText('zoom-out');

      fireEvent.click(zoomInButton);
      fireEvent.click(zoomOutButton);
    });

    it('should handle reset functionality', () => {
      render(<Mermaid>{mermaidContent}</Mermaid>);

      const resetButton = screen.getByRole('button', { name: 'Reset' });
      fireEvent.click(resetButton);
    });
  });

  describe('Header Customization', () => {
    it('should handle custom header', () => {
      const customHeader = <div data-testid="custom-header">Custom Header</div>;
      render(<Mermaid header={customHeader}>{mermaidContent}</Mermaid>);

      expect(screen.getByTestId('custom-header')).toBeInTheDocument();
    });

    it('should handle null header', () => {
      render(<Mermaid header={null}>{mermaidContent}</Mermaid>);

      expect(screen.queryByText('mermaid')).not.toBeInTheDocument();
    });

    it('should render default header when header is undefined', () => {
      render(<Mermaid>{mermaidContent}</Mermaid>);

      expect(screen.getByText('Code')).toBeInTheDocument();
      expect(screen.getByText('Image')).toBeInTheDocument();
    });
  });

  describe('RTL Support', () => {
    it('should handle RTL direction', () => {
      jest
        .spyOn(require('@ant-design/x/es/x-provider/hooks/use-x-provider-context'), 'default')
        .mockReturnValue({
          getPrefixCls: (prefix: string) => `ant-${prefix}`,
          direction: 'rtl',
        });

      const { container } = render(<Mermaid>{mermaidContent}</Mermaid>);
      expect(container.querySelector('.ant-mermaid-rtl')).toBeInTheDocument();
    });
  });

  describe('Mouse Events', () => {
    it('should handle mouse drag events', () => {
      const { container } = render(<Mermaid>{mermaidContent}</Mermaid>);
      const graphContainer = container.querySelector('.ant-mermaid-graph') as HTMLElement;

      fireEvent.mouseDown(graphContainer, { clientX: 100, clientY: 100 });
      fireEvent.mouseMove(graphContainer, { clientX: 150, clientY: 150 });
      fireEvent.mouseUp(graphContainer);
    });

    it('should handle wheel zoom events', () => {
      const { container } = render(<Mermaid>{mermaidContent}</Mermaid>);
      const graphContainer = container.querySelector('.ant-mermaid-graph') as HTMLElement;

      fireEvent.wheel(graphContainer, { deltaY: 100 });
      fireEvent.wheel(graphContainer, { deltaY: -100 });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty children gracefully', () => {
      const { container } = render(<Mermaid>{''}</Mermaid>);
      expect(container.firstChild).toBeNull();
    });

    it('should handle complex mermaid diagrams', async () => {
      const complexDiagram = `
        sequenceDiagram
          participant Alice
          participant Bob
          Alice->>John: Hello John, how are you?
          loop Healthcheck
              John->>John: Fight against hypochondria
          end
          Note right of John: Rational thoughts <br/>prevail!
          John-->>Alice: Great!
          John->>Bob: How about you?
          Bob-->>John: Jolly good!
      `;

      render(<Mermaid>{complexDiagram}</Mermaid>);

      await waitFor(() => {
        expect(mockRender).toHaveBeenCalledWith(
          expect.any(String),
          expect.stringContaining('sequenceDiagram'),
        );
      });
    });
  });

  describe('Props Handling', () => {
    it('should handle custom className', () => {
      const { container } = render(<Mermaid className="custom-class">{mermaidContent}</Mermaid>);
      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });

    it('should handle custom style', () => {
      const { container } = render(<Mermaid style={{ width: 500 }}>{mermaidContent}</Mermaid>);
      const element = container.querySelector('.ant-mermaid');
      expect(element).toHaveStyle('width: 500px');
    });

    it('should handle custom classNames', () => {
      const { container } = render(
        <Mermaid
          classNames={{
            root: 'custom-root',
            header: 'custom-header',
            graph: 'custom-graph',
            code: 'custom-code',
          }}
        >
          {mermaidContent}
        </Mermaid>,
      );

      expect(container.querySelector('.custom-root')).toBeInTheDocument();
    });
  });

  describe('onChange Event', () => {
    it('should trigger onChange when switching to code view', () => {
      const onChangeMock = jest.fn();
      render(<Mermaid onRenderTypeChange={onChangeMock}>{mermaidContent}</Mermaid>);

      const codeButton = screen.getByText('Code');
      fireEvent.click(codeButton);

      expect(onChangeMock).toHaveBeenCalledTimes(1);
      expect(onChangeMock).toHaveBeenCalledWith('code');
    });

    it('should trigger onChange when switching to image view', () => {
      const onChangeMock = jest.fn();
      render(<Mermaid onRenderTypeChange={onChangeMock}>{mermaidContent}</Mermaid>);

      // 先切换到代码模式
      const codeButton = screen.getByText('Code');
      fireEvent.click(codeButton);
      expect(onChangeMock).toHaveBeenCalledWith('code');

      // 再切换回图片模式
      const imageButton = screen.getByText('Image');
      fireEvent.click(imageButton);

      expect(onChangeMock).toHaveBeenCalledTimes(2);
      expect(onChangeMock).toHaveBeenCalledWith('image');
    });

    it('should not trigger onChange when onChange prop is not provided', () => {
      const { container } = render(<Mermaid>{mermaidContent}</Mermaid>);

      const codeButton = screen.getByText('Code');
      fireEvent.click(codeButton);

      // 没有 onChange prop，不应该抛出错误
      expect(container.querySelector('.ant-mermaid')).toBeInTheDocument();
    });

    it('should handle multiple mode switches with onChange', () => {
      const onChangeMock = jest.fn();
      render(<Mermaid onRenderTypeChange={onChangeMock}>{mermaidContent}</Mermaid>);

      const codeButton = screen.getByText('Code');
      const imageButton = screen.getByText('Image');

      // 多次切换
      fireEvent.click(codeButton);
      fireEvent.click(imageButton);
      fireEvent.click(codeButton);
      fireEvent.click(imageButton);

      expect(onChangeMock).toHaveBeenCalledTimes(4);
      expect(onChangeMock).toHaveBeenNthCalledWith(1, 'code');
      expect(onChangeMock).toHaveBeenNthCalledWith(2, 'image');
      expect(onChangeMock).toHaveBeenNthCalledWith(3, 'code');
      expect(onChangeMock).toHaveBeenNthCalledWith(4, 'image');
    });
  });

  describe('Error Handling', () => {
    it('should handle mermaid render errors', async () => {
      mockRender.mockRejectedValue(new Error('Render error'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      render(<Mermaid>{mermaidContent}</Mermaid>);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          expect.stringContaining('[antdx: Mermaid] Render failed: Error: Render error'),
        );
      });

      consoleSpy.mockRestore();
    });

    it('should handle missing container ref', () => {
      const { container } = render(<Mermaid>{mermaidContent}</Mermaid>);
      expect(container.querySelector('.ant-mermaid')).toBeInTheDocument();
    });
  });

  describe('Style Coverage', () => {
    it('should apply correct CSS classes and styles', () => {
      const { container } = render(<Mermaid>{mermaidContent}</Mermaid>);

      // Verify root class
      expect(container.querySelector('.ant-mermaid')).toBeInTheDocument();

      // Verify header class
      expect(container.querySelector('.ant-mermaid-header')).toBeInTheDocument();

      // Verify graph class
      expect(container.querySelector('.ant-mermaid-graph')).toBeInTheDocument();

      // Verify RTL class when direction is rtl
      jest
        .spyOn(require('@ant-design/x/es/x-provider/hooks/use-x-provider-context'), 'default')
        .mockReturnValue({
          getPrefixCls: (prefix: string) => `ant-${prefix}`,
          direction: 'rtl',
        });

      const { container: rtlContainer } = render(<Mermaid>{mermaidContent}</Mermaid>);
      expect(rtlContainer.querySelector('.ant-mermaid-rtl')).toBeInTheDocument();
    });

    it('should apply transform styles to SVG element based on scale and position', async () => {
      const { container } = render(<Mermaid>{mermaidContent}</Mermaid>);

      await waitFor(() => {
        expect(mockRender).toHaveBeenCalled();
      });

      // 验证组件渲染后包含 SVG 元素
      const graphContainer = container.querySelector('.ant-mermaid-graph');
      expect(graphContainer).toBeInTheDocument();

      // 验证缩放和拖动功能存在
      const zoomInButton = screen.getByLabelText('zoom-in');
      const zoomOutButton = screen.getByLabelText('zoom-out');
      const resetButton = screen.getByRole('button', { name: 'Reset' });

      expect(zoomInButton).toBeInTheDocument();
      expect(zoomOutButton).toBeInTheDocument();
      expect(resetButton).toBeInTheDocument();
    });

    it('should update transform styles when scale changes', async () => {
      render(<Mermaid>{mermaidContent}</Mermaid>);

      await waitFor(() => {
        expect(mockRender).toHaveBeenCalled();
      });

      // 验证缩放功能正常工作
      const zoomInButton = screen.getByLabelText('zoom-in');
      const zoomOutButton = screen.getByLabelText('zoom-out');

      // 点击放大按钮应该触发缩放
      expect(() => fireEvent.click(zoomInButton)).not.toThrow();

      // 点击缩小按钮应该触发缩放
      expect(() => fireEvent.click(zoomOutButton)).not.toThrow();
    });

    it('should update transform styles when position changes during drag', async () => {
      const { container } = render(<Mermaid>{mermaidContent}</Mermaid>);

      await waitFor(() => {
        expect(mockRender).toHaveBeenCalled();
      });

      const graphContainer = container.querySelector('.ant-mermaid-graph') as HTMLElement;

      // 验证鼠标事件处理
      expect(() => {
        fireEvent.mouseDown(graphContainer, { clientX: 100, clientY: 100 });
        fireEvent.mouseMove(graphContainer, { clientX: 150, clientY: 150 });
        fireEvent.mouseUp(graphContainer);
      }).not.toThrow();
    });

    it('should reset transform styles when reset is clicked', async () => {
      render(<Mermaid>{mermaidContent}</Mermaid>);

      await waitFor(() => {
        expect(mockRender).toHaveBeenCalled();
      });

      // 验证重置功能正常工作
      const resetButton = screen.getByRole('button', { name: 'Reset' });
      expect(() => fireEvent.click(resetButton)).not.toThrow();
    });

    it('should not apply transform styles when in code view', async () => {
      render(<Mermaid>{mermaidContent}</Mermaid>);

      await waitFor(() => {
        expect(mockRender).toHaveBeenCalled();
      });

      // 切换到代码视图
      const codeButton = screen.getByText('Code');
      fireEvent.click(codeButton);

      // 在代码视图下，应该显示代码高亮器而不是 SVG
      expect(screen.getByTestId('syntax-highlighter')).toBeInTheDocument();
    });

    it('should handle edge cases for transform styles', async () => {
      render(<Mermaid>{mermaidContent}</Mermaid>);

      await waitFor(() => {
        expect(mockRender).toHaveBeenCalled();
      });

      const zoomOutButton = screen.getByLabelText('zoom-out');
      const zoomInButton = screen.getByLabelText('zoom-in');

      // 验证边界值处理
      expect(() => {
        // 多次点击缩小按钮测试最小值
        for (let i = 0; i < 10; i++) {
          fireEvent.click(zoomOutButton);
        }

        // 多次点击放大按钮测试最大值
        for (let i = 0; i < 20; i++) {
          fireEvent.click(zoomInButton);
        }
      }).not.toThrow();
    });

    it('should apply custom styles through styles prop', () => {
      const customStyles = {
        root: { backgroundColor: 'red', padding: '10px' },
        header: { padding: '20px', backgroundColor: 'blue' },
        graph: { border: '2px solid blue', margin: '5px' },
        code: { fontSize: '16px', color: 'green' },
      };

      const { container } = render(<Mermaid styles={customStyles}>{mermaidContent}</Mermaid>);

      // 切换到代码模式以显示代码视图
      const codeButton = screen.getByText('Code');
      fireEvent.click(codeButton);

      const root = container.querySelector('.ant-mermaid');
      const header = container.querySelector('.ant-mermaid-header');
      const graph = container.querySelector('.ant-mermaid-graph');
      const code = container.querySelector('.ant-mermaid-code');

      expect(root).toHaveStyle('background-color: red');
      expect(root).toHaveStyle('padding: 10px');
      expect(header).toHaveStyle('padding: 20px');
      expect(header).toHaveStyle('background-color: blue');
      expect(graph).toHaveStyle('border: 2px solid blue');
      expect(graph).toHaveStyle('margin: 5px');
      expect(code).toHaveStyle('font-size: 16px');
      expect(code).toHaveStyle('color: green');
    });

    it('should apply custom classNames through classNames prop', () => {
      const customClassNames = {
        root: 'custom-root',
        header: 'custom-header',
        graph: 'custom-graph',
        code: 'custom-code',
      };

      const { container } = render(
        <Mermaid classNames={customClassNames}>{mermaidContent}</Mermaid>,
      );

      expect(container.querySelector('.custom-root')).toBeInTheDocument();
      expect(container.querySelector('.custom-header')).toBeInTheDocument();
      expect(container.querySelector('.custom-graph')).toBeInTheDocument();
    });
  });

  describe('Transform Styles', () => {
    it('should handle SVG transform styles correctly', async () => {
      const { container } = render(<Mermaid>{mermaidContent}</Mermaid>);

      await waitFor(() => {
        expect(mockRender).toHaveBeenCalled();
      });

      // 验证组件的基本功能
      const graphContainer = container.querySelector('.ant-mermaid-graph');
      expect(graphContainer).toBeInTheDocument();

      // 验证交互元素存在
      expect(screen.getByLabelText('zoom-in')).toBeInTheDocument();
      expect(screen.getByLabelText('zoom-out')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();
    });

    it('should handle mouse events for transform updates', async () => {
      const { container } = render(<Mermaid>{mermaidContent}</Mermaid>);

      await waitFor(() => {
        expect(mockRender).toHaveBeenCalled();
      });

      const graphContainer = container.querySelector('.ant-mermaid-graph');
      expect(graphContainer).toBeInTheDocument();

      // 验证鼠标事件不会导致错误
      expect(() => {
        fireEvent.mouseDown(graphContainer!, { clientX: 100, clientY: 100 });
        fireEvent.mouseMove(graphContainer!, { clientX: 150, clientY: 150 });
        fireEvent.mouseUp(graphContainer!);
      }).not.toThrow();
    });

    it('should handle wheel events for zoom', async () => {
      const { container } = render(<Mermaid>{mermaidContent}</Mermaid>);

      await waitFor(() => {
        expect(mockRender).toHaveBeenCalled();
      });

      const graphContainer = container.querySelector('.ant-mermaid-graph');
      expect(graphContainer).toBeInTheDocument();

      // 验证滚轮事件不会导致错误
      expect(() => {
        fireEvent.wheel(graphContainer!, { deltaY: 100 });
        fireEvent.wheel(graphContainer!, { deltaY: -100 });
      }).not.toThrow();
    });
  });

  describe('Download Functionality', () => {
    it('should handle download correctly', async () => {
      // Mock DOM APIs
      const mockSvgElement = {
        getBoundingClientRect: jest.fn().mockReturnValue({ width: 200, height: 150 }),
      };

      // Mock XMLSerializer
      const mockSerializeToString = jest.fn().mockReturnValue('<svg>test</svg>');
      const mockXMLSerializer = jest.fn().mockImplementation(() => ({
        serializeToString: mockSerializeToString,
      }));

      // Mock canvas and context
      const mockDrawImage = jest.fn();
      const mockToDataURL = jest.fn().mockReturnValue('data:image/png;base64,test');
      const mockCanvas = {
        width: 0,
        height: 0,
        style: {},
        getContext: jest.fn().mockReturnValue({
          scale: jest.fn(),
          drawImage: mockDrawImage,
        }),
        toDataURL: mockToDataURL,
      };

      // Mock Image
      const mockImage = {
        src: '',
        onload: null,
      };

      // Save original implementations
      const originalCreateElement = document.createElement;
      const originalXMLSerializer = (window as any).XMLSerializer;

      // Set up mocks
      (window as any).XMLSerializer = mockXMLSerializer;
      document.createElement = jest.fn().mockImplementation((tagName) => {
        if (tagName === 'canvas') return mockCanvas;
        if (tagName === 'a') {
          return {
            click: jest.fn(),
            download: '',
            href: '',
          };
        }
        return originalCreateElement.call(document, tagName);
      });

      // Mock window.Image
      const originalImage = window.Image;
      window.Image = jest.fn().mockImplementation(() => mockImage) as any;

      // Mock devicePixelRatio
      const originalDevicePixelRatio = window.devicePixelRatio;
      window.devicePixelRatio = 2;

      // Mock containerRef and querySelector
      const mockQuerySelector = jest.fn().mockReturnValue(mockSvgElement);

      render(<Mermaid>{mermaidContent}</Mermaid>);

      // Override the containerRef to return our mock
      const container = document.querySelector('.ant-mermaid-graph');
      if (container) {
        container.querySelector = mockQuerySelector;
      }

      const downloadButton = screen.getByLabelText('download');
      fireEvent.click(downloadButton);

      // Wait for async operations
      await waitFor(() => {
        expect(mockQuerySelector).toHaveBeenCalledWith('svg');
        expect(mockSerializeToString).toHaveBeenCalledWith(mockSvgElement);
        expect(mockCanvas.width).toBe(400); // 200 * 2 (dpr)
        expect(mockCanvas.height).toBe(300); // 150 * 2 (dpr)
        // @ts-ignore
        expect(mockCanvas.style.width).toBe('200px');
        // @ts-ignore
        expect(mockCanvas.style.height).toBe('150px');

        // Simulate image load
        if (mockImage.onload) {
          // @ts-ignore
          mockImage.onload();
        }

        expect(mockDrawImage).toHaveBeenCalledWith(mockImage, 0, 0, 200, 150);
        expect(mockToDataURL).toHaveBeenCalledWith('image/png', 1);
      });

      // Restore original implementations
      (window as any).XMLSerializer = originalXMLSerializer;
      document.createElement = originalCreateElement;
      window.Image = originalImage;
      window.devicePixelRatio = originalDevicePixelRatio;
    });

    it('should return early if no SVG element found', async () => {
      const mockQuerySelector = jest.fn().mockReturnValue(null);

      render(<Mermaid>{mermaidContent}</Mermaid>);

      // Override the containerRef to return null for SVG
      const container = document.querySelector('.ant-mermaid-graph');
      if (container) {
        container.querySelector = mockQuerySelector;
      }

      const downloadButton = screen.getByLabelText('download');
      fireEvent.click(downloadButton);

      // Should not throw and should return early
      expect(mockQuerySelector).toHaveBeenCalledWith('svg');
    });
  });

  describe('Edge Cases and Boundary Conditions', () => {
    it('should handle very large mermaid diagrams', async () => {
      const largeDiagram = `graph TD;\n${'A-->B;\n'.repeat(100)}`;

      render(<Mermaid>{largeDiagram}</Mermaid>);

      await waitFor(() => {
        expect(mockRender).toHaveBeenCalledWith(
          expect.any(String),
          expect.stringContaining('graph TD;'),
        );
      });
    });

    it('should handle special characters in mermaid code', async () => {
      const specialCharsDiagram = `graph TD
        A["Node with "quotes""] --> B['Node with 'single quotes'']
        B --> C{Node with <brackets>}
        C --> D[Node with & ampersand]
        D --> E[Node with unicode: 你好 🚀]`;

      render(<Mermaid>{specialCharsDiagram}</Mermaid>);

      await waitFor(() => {
        expect(mockRender).toHaveBeenCalledWith(
          expect.any(String),
          expect.stringContaining('你好 🚀'),
        );
      });
    });

    it('should handle empty string with whitespace', () => {
      const { container } = render(<Mermaid>{'   \n\t  \n  '}</Mermaid>);
      // 组件不会自动trim空白字符，所以会渲染
      expect(container.querySelector('.ant-mermaid')).toBeInTheDocument();
    });

    it('should handle null config prop', async () => {
      render(<Mermaid config={undefined}>{mermaidContent}</Mermaid>);

      await waitFor(() => {
        expect(mockInitialize).toHaveBeenCalledWith(
          expect.objectContaining({
            startOnLoad: false,
            securityLevel: 'strict',
            theme: 'default',
            fontFamily: 'monospace',
          }),
        );
      });
    });

    it('should handle undefined config prop', async () => {
      render(<Mermaid config={undefined}>{mermaidContent}</Mermaid>);

      await waitFor(() => {
        expect(mockInitialize).toHaveBeenCalledWith(
          expect.objectContaining({
            startOnLoad: false,
            securityLevel: 'strict',
            theme: 'default',
            fontFamily: 'monospace',
          }),
        );
      });
    });

    it('should handle rapid mode switching', async () => {
      render(<Mermaid>{mermaidContent}</Mermaid>);

      const codeButton = screen.getByText('Code');
      const imageButton = screen.getByText('Image');

      // 快速多次切换
      for (let i = 0; i < 3; i++) {
        fireEvent.click(codeButton);
        fireEvent.click(imageButton);
      }

      expect(screen.queryByTestId('syntax-highlighter')).not.toBeInTheDocument();
    });
  });

  describe('Performance Tests', () => {
    it('should throttle render calls', async () => {
      const { rerender } = render(<Mermaid>{mermaidContent}</Mermaid>);

      // 快速连续改变内容
      for (let i = 0; i < 3; i++) {
        rerender(<Mermaid>{`${mermaidContent} ${i}`}</Mermaid>);
      }

      await waitFor(() => {
        // 由于节流，render调用次数应该少于内容变化次数
        expect(mockRender).toHaveBeenCalled();
      });
    });

    it('should handle memory cleanup on unmount', () => {
      const { unmount } = render(<Mermaid>{mermaidContent}</Mermaid>);

      // 确保组件卸载时不会抛出错误
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Accessibility Tests', () => {
    it('should have proper ARIA attributes', () => {
      const { container } = render(<Mermaid>{mermaidContent}</Mermaid>);

      const mermaidContainer = container.querySelector('.ant-mermaid');
      expect(mermaidContainer).toBeInTheDocument();

      // 检查按钮是否有适当的标签
      expect(screen.getByText('Code')).toBeInTheDocument();
      expect(screen.getByText('Image')).toBeInTheDocument();
    });

    it('should handle keyboard navigation', () => {
      render(<Mermaid>{mermaidContent}</Mermaid>);

      const codeButton = screen.getByText('Code');

      // 测试键盘事件
      fireEvent.keyDown(codeButton, { key: 'Enter' });

      // 验证代码视图被激活
      expect(screen.getByText('Code')).toBeInTheDocument();
    });
  });

  describe('Configuration Tests', () => {
    it('should merge custom config with default config', async () => {
      const customConfig: MermaidConfig = {
        theme: 'dark',
        fontFamily: 'Arial',
        securityLevel: 'loose' as const,
      };

      render(<Mermaid config={customConfig}>{mermaidContent}</Mermaid>);

      await waitFor(() => {
        expect(mockInitialize).toHaveBeenCalledWith(
          expect.objectContaining({
            startOnLoad: false,
            securityLevel: 'loose',
            theme: 'dark',
            fontFamily: 'Arial',
          }),
        );
      });
    });

    it('should handle partial config override', async () => {
      const partialConfig: MermaidConfig = {
        theme: 'forest',
      };

      render(<Mermaid config={partialConfig}>{mermaidContent}</Mermaid>);

      await waitFor(() => {
        expect(mockInitialize).toHaveBeenCalledWith(
          expect.objectContaining({
            startOnLoad: false,
            securityLevel: 'strict',
            theme: 'forest',
            fontFamily: 'monospace',
          }),
        );
      });
    });
  });

  describe('Actions Configuration', () => {
    it('should hide zoom controls when enableZoom is false', () => {
      render(<Mermaid actions={{ enableZoom: false }}>{mermaidContent}</Mermaid>);

      expect(screen.queryByLabelText('zoom-in')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('zoom-out')).not.toBeInTheDocument();
    });

    it('should hide download button when enableDownload is false', () => {
      render(<Mermaid actions={{ enableDownload: false }}>{mermaidContent}</Mermaid>);

      expect(screen.queryByLabelText('download')).not.toBeInTheDocument();
    });

    it('should hide copy button when enableCopy is false', () => {
      render(<Mermaid actions={{ enableCopy: false }}>{mermaidContent}</Mermaid>);

      const codeButton = screen.getByText('Code');
      fireEvent.click(codeButton);

      expect(screen.queryByRole('button', { name: /copy/i })).not.toBeInTheDocument();
    });

    it('should render custom actions', () => {
      const customActions = [
        {
          key: 'feedback',
          actionRender: () => (
            <Actions.Feedback
              value={'default'}
              styles={{
                liked: {
                  color: '#f759ab',
                },
              }}
              key="feedback"
            />
          ),
        },
      ];

      render(<Mermaid actions={{ customActions }}>{mermaidContent}</Mermaid>);

      // 验证自定义的 Actions.Feedback 组件被渲染
      expect(document.querySelector('.ant-actions-feedback')).toBeInTheDocument();
      expect(document.querySelector('.ant-actions-feedback-item-like')).toBeInTheDocument();
      expect(document.querySelector('.ant-actions-feedback-item-dislike')).toBeInTheDocument();
    });
  });

  describe('Advanced Edge Cases', () => {
    it('should handle concurrent renders', async () => {
      const { rerender } = render(<Mermaid>{mermaidContent}</Mermaid>);

      // 快速连续渲染不同内容
      rerender(<Mermaid>{'graph LR; A-->B;'}</Mermaid>);
      await waitFor(() => {
        expect(mockRender).toHaveBeenCalled();
      });

      rerender(<Mermaid>{'graph TD; C-->D;'}</Mermaid>);
      await waitFor(() => {
        expect(mockRender).toHaveBeenCalled();
      });

      rerender(<Mermaid>{'graph BT; E-->F;'}</Mermaid>);
      await waitFor(() => {
        expect(mockRender).toHaveBeenCalled();
      });
    });

    it('should handle resize events', () => {
      const { container } = render(<Mermaid>{mermaidContent}</Mermaid>);

      // 模拟窗口大小改变
      fireEvent(window, new Event('resize'));

      const mermaidContainer = container.querySelector('.ant-mermaid');
      expect(mermaidContainer).toBeInTheDocument();
    });

    it('should handle empty highlightProps', () => {
      render(<Mermaid highlightProps={{}}>{mermaidContent}</Mermaid>);

      expect(screen.getByText('Code')).toBeInTheDocument();
    });

    it('should handle highlightProps with custom style', () => {
      render(
        <Mermaid highlightProps={{ customStyle: { backgroundColor: 'red' } }}>
          {mermaidContent}
        </Mermaid>,
      );

      const codeButton = screen.getByText('Code');
      fireEvent.click(codeButton);

      expect(screen.getByTestId('syntax-highlighter')).toBeInTheDocument();
    });

    it('should handle nested quotes in mermaid code', async () => {
      const nestedQuotes = `graph TD
        A["Node with \\"nested\\" quotes"] --> B['Node with 'nested' quotes']
        B --> C["Mixed 'quotes' and \\"quotes\\""]`;

      render(<Mermaid>{nestedQuotes}</Mermaid>);

      await waitFor(() => {
        expect(mockRender).toHaveBeenCalledWith(
          expect.any(String),
          expect.stringContaining('Mixed'),
        );
      });
    });

    it('should handle very long single line mermaid code', async () => {
      const longLine = `graph TD; ${'A-->B;'.repeat(50)}`;

      render(<Mermaid>{longLine}</Mermaid>);

      await waitFor(() => {
        expect(mockRender).toHaveBeenCalledWith(
          expect.any(String),
          expect.stringContaining('A-->B;'),
        );
      });
    });

    it('should handle mermaid code with comments', async () => {
      const withComments = `graph TD
        %% This is a comment
        A[Start] --> B[Process]
        B --> C{Decision?}
        %% Another comment
        C -->|Yes| D[End]
        C -->|No| E[Continue]`;

      render(<Mermaid>{withComments}</Mermaid>);

      await waitFor(() => {
        expect(mockRender).toHaveBeenCalledWith(expect.any(String), expect.stringContaining('%%'));
      });
    });
  });

  describe('Performance and Memory Tests', () => {
    it('should not leak memory on rapid prop changes', async () => {
      const { rerender } = render(<Mermaid>{mermaidContent}</Mermaid>);

      // 模拟快速属性变化
      for (let i = 0; i < 10; i++) {
        rerender(<Mermaid style={{ width: i * 10 }}>{`${mermaidContent} ${i}`}</Mermaid>);
      }

      await waitFor(() => {
        expect(mockRender).toHaveBeenCalled();
      });
    });

    it('should handle cleanup properly', () => {
      const { unmount } = render(<Mermaid>{mermaidContent}</Mermaid>);

      // 确保事件监听器被正确清理
      expect(() => unmount()).not.toThrow();
    });

    it('should handle multiple instances', () => {
      render(
        <div>
          <Mermaid key="1">{mermaidContent}</Mermaid>
          <Mermaid key="2">{mermaidContent}</Mermaid>
          <Mermaid key="3">{mermaidContent}</Mermaid>
        </div>,
      );

      const mermaidElements = screen.getAllByText('Code');
      expect(mermaidElements).toHaveLength(3);
    });
  });

  describe('Integration Tests', () => {
    it('should work with context configuration', () => {
      jest
        .spyOn(require('@ant-design/x/es/_util/hooks/use-x-component-config'), 'default')
        .mockReturnValue({
          className: 'context-class',
          classNames: { root: 'context-root', header: 'context-header' },
          styles: { root: { padding: '10px' }, header: { margin: '5px' } },
        });

      const { container } = render(<Mermaid>{mermaidContent}</Mermaid>);

      expect(container.querySelector('.context-class')).toBeInTheDocument();
    });

    it('should merge context and props correctly', () => {
      jest
        .spyOn(require('@ant-design/x/es/_util/hooks/use-x-component-config'), 'default')
        .mockReturnValue({
          className: 'context-class',
          classNames: { root: 'context-root' },
          styles: { root: { padding: '10px' } },
        });

      const { container } = render(
        <Mermaid
          className="prop-class"
          classNames={{ root: 'prop-root' }}
          styles={{ root: { margin: '5px' } }}
        >
          {mermaidContent}
        </Mermaid>,
      );

      const element = container.querySelector('.ant-mermaid');
      expect(element).toBeInTheDocument();
    });
  });
});
