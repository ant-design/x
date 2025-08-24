import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Mermaid from '../index';
import React from 'react';

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
jest.mock('antd', () => {
  const actual = jest.requireActual('antd');
  return {
    ...actual,
    message: {
      success: jest.fn(),
    },
  };
});

const mermaidContent = 'graph TD; A-->B;';

describe('Mermaid Plugin', () => {
  const mockMermaid = require('mermaid');
  const mockParse = mockMermaid.parse as jest.Mock;
  const mockRender = mockMermaid.render as jest.Mock;

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
        expect(mockParse).toHaveBeenCalledWith('graph TD; A-->B;', { suppressErrors: true });
        expect(mockRender).toHaveBeenCalled();
      });

      expect(container.querySelector('.ant-mermaid')).toBeInTheDocument();
    });

    it('should handle invalid mermaid syntax', async () => {
      mockParse.mockResolvedValue(false);
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      render(<Mermaid>invalid syntax</Mermaid>);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Mermaid render failed'));
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

      const codeButton = screen.getByText('代码');
      fireEvent.click(codeButton);

      expect(screen.getByTestId('syntax-highlighter')).toBeInTheDocument();
      expect(screen.getByText('graph TD; A-->B;')).toBeInTheDocument();
    });

    it('should render code view with proper styling', async () => {
      render(<Mermaid>{mermaidContent}</Mermaid>);

      const codeButton = screen.getByText('代码');
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

      const copyButton = screen.getByRole('button', { name: 'copy' });
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(mockClipboard.writeText).toHaveBeenCalledWith('graph TD; A-->B;');
      });
    });

    it('should show success message when copy succeeds', async () => {
      const mockClipboard = {
        writeText: jest.fn().mockResolvedValue(undefined),
      };
      Object.defineProperty(navigator, 'clipboard', {
        writable: true,
        value: mockClipboard,
      });
      const { message } = require('antd');

      render(<Mermaid>{mermaidContent}</Mermaid>);

      const copyButton = screen.getByRole('button', { name: 'copy' });
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(message.success).toHaveBeenCalledWith('复制成功');
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
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      render(<Mermaid>{mermaidContent}</Mermaid>);

      const copyButton = screen.getByRole('button', { name: 'copy' });
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Failed to copy code:', expect.any(Error));
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Zoom and Interaction', () => {
    it('should show zoom controls only in image mode', () => {
      render(<Mermaid>{mermaidContent}</Mermaid>);

      expect(screen.getByRole('button', { name: 'zoom-in' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'zoom-out' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '重置' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'download' })).toBeInTheDocument();

      const codeButton = screen.getByText('代码');
      fireEvent.click(codeButton);

      expect(screen.queryByRole('button', { name: 'zoom-in' })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'zoom-out' })).not.toBeInTheDocument();
    });

    it('should handle zoom in/out', () => {
      render(<Mermaid>{mermaidContent}</Mermaid>);

      const zoomInButton = screen.getByRole('button', { name: 'zoom-in' });
      const zoomOutButton = screen.getByRole('button', { name: 'zoom-out' });

      fireEvent.click(zoomInButton);
      fireEvent.click(zoomOutButton);
    });

    it('should handle reset functionality', () => {
      render(<Mermaid>{mermaidContent}</Mermaid>);

      const resetButton = screen.getByRole('button', { name: '重置' });
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

      expect(screen.getByText('代码')).toBeInTheDocument();
      expect(screen.getByText('图片')).toBeInTheDocument();
    });
  });

  describe('RTL Support', () => {
    it('should handle RTL direction', () => {
      jest.spyOn(require('../../hooks/use-x-provider-context'), 'default').mockReturnValue({
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
        expect(mockParse).toHaveBeenCalled();
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

  describe('Error Handling', () => {
    it('should handle mermaid render errors', async () => {
      mockRender.mockRejectedValue(new Error('Render error'));
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      render(<Mermaid>{mermaidContent}</Mermaid>);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          expect.stringContaining('Mermaid render failed: Error: Render error'),
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
      jest.spyOn(require('../../hooks/use-x-provider-context'), 'default').mockReturnValue({
        getPrefixCls: (prefix: string) => `ant-${prefix}`,
        direction: 'rtl',
      });

      const { container: rtlContainer } = render(<Mermaid>{mermaidContent}</Mermaid>);
      expect(rtlContainer.querySelector('.ant-mermaid-rtl')).toBeInTheDocument();
    });

    it('should apply custom styles through styles prop', () => {
      const customStyles = {
        root: { backgroundColor: 'red' },
        header: { padding: '20px' },
        graph: { border: '2px solid blue' },
        code: { fontSize: '16px' },
      };

      const { container } = render(<Mermaid styles={customStyles}>{mermaidContent}</Mermaid>);

      const root = container.querySelector('.ant-mermaid');
      const header = container.querySelector('.ant-mermaid-header');
      const graph = container.querySelector('.ant-mermaid-graph');

      expect(root).toBeInTheDocument();
      expect(header).toBeInTheDocument();
      expect(graph).toBeInTheDocument();
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

      const downloadButton = screen.getByRole('button', { name: 'download' });
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

      const downloadButton = screen.getByRole('button', { name: 'download' });
      fireEvent.click(downloadButton);

      // Should not throw and should return early
      expect(mockQuerySelector).toHaveBeenCalledWith('svg');
    });
  });
});
