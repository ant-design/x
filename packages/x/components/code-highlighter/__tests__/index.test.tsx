import { render, waitFor } from '@testing-library/react';
import React from 'react';
import CodeHighlighter from '../index';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useId: () => 'mock-id-123',
}));

// Mock mermaid to avoid Jest transform issues with ES6+ syntax
jest.mock('mermaid', () => ({
  initialize: jest.fn(),
  render: jest.fn().mockResolvedValue({ svg: '<svg></svg>' }),
}));

// Mock the mermaid component to avoid issues
jest.mock('../../mermaid', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-mermaid">Mermaid Diagram</div>,
}));

// Mock react-syntax-highlighter
jest.mock('react-syntax-highlighter/dist/esm/languages/prism/typescript', () => ({
  __esModule: true,
  default: () => null,
}));

// Spy on console.warn
const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

describe('CodeHighlighter', () => {
  beforeEach(() => {
    consoleWarnSpy.mockClear();
  });

  afterAll(() => {
    consoleWarnSpy.mockRestore();
  });

  it('render normal code', async () => {
    const { container } = render(
      <CodeHighlighter lang="javascript">{`console.log("javascript");`}</CodeHighlighter>,
    );
    await waitFor(() => {
      expect(container.querySelector('pre')).toBeInTheDocument();
    });
    expect(container.querySelector('code')).toBeInTheDocument();
    expect(container.textContent).toContain('console.log("javascript");');
  });

  it('render normal code with header', async () => {
    const { container } = render(
      <CodeHighlighter lang="javascript">{`console.log("javascript");`}</CodeHighlighter>,
    );
    await waitFor(() => {
      expect(container.querySelector('.ant-codeHighlighter-header')).toBeInTheDocument();
    });
    expect(container.querySelector('.ant-codeHighlighter-header')?.textContent).toContain(
      'javascript',
    );
  });

  it('render normal code with custom header class', async () => {
    const { container } = render(
      <CodeHighlighter lang="javascript" classNames={{ header: 'customHeader' }}>
        {`console.log("javascript");`}
      </CodeHighlighter>,
    );
    await waitFor(() => {
      expect(container.querySelector('.customHeader')).toBeInTheDocument();
    });
  });

  it('render normal code with custom headerTitle class', async () => {
    const { container } = render(
      <CodeHighlighter lang="javascript" classNames={{ headerTitle: 'customHeaderTitle' }}>
        {`console.log("javascript");`}
      </CodeHighlighter>,
    );
    await waitFor(() => {
      expect(container.querySelector('.customHeaderTitle')).toBeInTheDocument();
    });
    expect(container.querySelector('.customHeaderTitle')?.textContent).toContain('javascript');
  });

  it('render normal code with custom headerTitle style', async () => {
    const { container } = render(
      <CodeHighlighter lang="javascript" styles={{ headerTitle: { color: 'red' } }}>
        {`console.log("javascript");`}
      </CodeHighlighter>,
    );
    await waitFor(() => {
      expect(container.querySelector('.ant-codeHighlighter-header-title')).toBeInTheDocument();
    });
    const headerTitle = container.querySelector('.ant-codeHighlighter-header-title') as HTMLElement;
    expect(headerTitle.style.color).toBe('red');
  });

  it('render normal code with custom header style', async () => {
    const { container } = render(
      <CodeHighlighter lang="javascript" styles={{ header: { padding: '10px' } }}>
        {`console.log("javascript");`}
      </CodeHighlighter>,
    );
    await waitFor(() => {
      expect(container.querySelector('.ant-codeHighlighter-header')).toBeInTheDocument();
    });
    const header = container.querySelector('.ant-codeHighlighter-header') as HTMLElement;
    expect(header.style.padding).toBe('10px');
  });

  it('render normal code with custom code style', async () => {
    const { container } = render(
      <CodeHighlighter lang="javascript" styles={{ code: { padding: '20px' } }}>
        {`console.log("javascript");`}
      </CodeHighlighter>,
    );
    await waitFor(() => {
      expect(container.querySelector('.ant-codeHighlighter-code')).toBeInTheDocument();
    });
    const code = container.querySelector('.ant-codeHighlighter-code') as HTMLElement;
    expect(code.style.padding).toBe('20px');
  });

  it('render normal code with custom code class', async () => {
    const { container } = render(
      <CodeHighlighter lang="javascript" classNames={{ code: 'customCodeClass' }}>
        {`console.log("javascript");`}
      </CodeHighlighter>,
    );
    await waitFor(() => {
      expect(container.querySelector('.customCodeClass')).toBeInTheDocument();
    });
  });

  it('render normal code with custom header', async () => {
    const { container } = render(
      <CodeHighlighter
        lang="javascript"
        header={<div className="myCustomClass">custom header</div>}
      >
        {`console.log("javascript");`}
      </CodeHighlighter>,
    );
    await waitFor(() => {
      expect(container.querySelector('.myCustomClass')).toBeInTheDocument();
    });
    expect(container.querySelector('.myCustomClass')?.textContent).toContain('custom header');
  });

  it('render normal code with no header', async () => {
    const { container } = render(
      <CodeHighlighter lang="javascript" header={null}>
        {`console.log("javascript");`}
      </CodeHighlighter>,
    );
    await waitFor(() => {
      expect(container.firstChild).toBeInTheDocument();
    });
    expect(container.querySelector('.ant-codeHighlighter-header')).toBeNull();
  });

  it('render normal code with no children', () => {
    const { container } = render(<CodeHighlighter lang="javascript">{''}</CodeHighlighter>);
    expect(container.firstChild).toBe(null);
  });

  it('mermaid code is render as text', async () => {
    const { container } = render(
      <CodeHighlighter lang="mermaid">{`graph TD; A-->B;`}</CodeHighlighter>,
    );
    await waitFor(() => {
      expect(container.querySelector('pre')).toBeInTheDocument();
    });
    expect(container.textContent).toContain('graph TD; A-->B;');
  });

  it('should handle undefined lang', () => {
    const { container } = render(<CodeHighlighter lang="">{`plain text`}</CodeHighlighter>);
    expect(container.querySelector('code')).toBeInTheDocument();
    expect(container.textContent).toContain('plain text');
  });

  it('should apply custom styles', async () => {
    const { container } = render(
      <CodeHighlighter
        lang="javascript"
        styles={{ root: { backgroundColor: 'red' }, header: { color: 'blue' } }}
      >
        {`console.log("test");`}
      </CodeHighlighter>,
    );
    await waitFor(() => {
      expect(container.firstChild).toBeInTheDocument();
    });
    const root = container.firstChild as HTMLElement;
    expect(root.style.backgroundColor).toBe('red');
  });

  it('should forward ref correctly', async () => {
    const ref = React.createRef<HTMLDivElement>();
    const { container } = render(
      <CodeHighlighter ref={ref} lang="javascript">
        {`console.log("test");`}
      </CodeHighlighter>,
    );
    await waitFor(() => {
      expect(ref.current).toBe(container.firstChild);
    });
  });

  it('should handle trailing newline', async () => {
    const { container } = render(
      <CodeHighlighter lang="javascript">{`console.log("test");\n`}</CodeHighlighter>,
    );
    await waitFor(() => {
      expect(container.textContent).toContain('console.log');
    });
    // The trailing newline should be removed
    expect(container.textContent).not.toMatch(/\n$/);
  });

  it('should pass highlightProps to SyntaxHighlighter', async () => {
    const { container } = render(
      <CodeHighlighter
        lang="javascript"
        highlightProps={{ showLineNumbers: true, startingLineNumber: 5 }}
      >
        {`console.log("test");`}
      </CodeHighlighter>,
    );
    await waitFor(() => {
      expect(container.querySelector('pre')).toBeInTheDocument();
    });
  });

  it('should apply custom className', async () => {
    const { container } = render(
      <CodeHighlighter lang="javascript" className="myCustomClass">
        {`console.log("test");`}
      </CodeHighlighter>,
    );
    await waitFor(() => {
      expect(container.querySelector('.myCustomClass')).toBeInTheDocument();
    });
  });

  it('should apply custom prefixCls', async () => {
    const { container } = render(
      <CodeHighlighter lang="javascript" prefixCls="custom">
        {`console.log("test");`}
      </CodeHighlighter>,
    );
    await waitFor(
      () => {
        // Check that the custom prefix is used for the root and code container class
        expect(container.querySelector('.custom')).toBeInTheDocument();
        expect(container.querySelector('.custom-code')).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  it('should spread restProps to container', async () => {
    const { container } = render(
      <CodeHighlighter lang="javascript" data-testid="code-highlighter-test">
        {`console.log("test");`}
      </CodeHighlighter>,
    );
    await waitFor(() => {
      expect(container.querySelector('[data-testid="code-highlighter-test"]')).toBeInTheDocument();
    });
  });

  describe('prismLightMode', () => {
    it('should render code with prismLightMode enabled (default)', async () => {
      const { container } = render(
        <CodeHighlighter lang="javascript" prismLightMode>
          {`console.log("test");`}
        </CodeHighlighter>,
      );
      await waitFor(() => {
        expect(container.querySelector('code')).toBeInTheDocument();
      });
      expect(container.textContent).toContain('console.log("test");');
    });

    it('should render code with prismLightMode disabled (full Prism)', async () => {
      const { container } = render(
        <CodeHighlighter lang="javascript" prismLightMode={false}>
          {`console.log("test");`}
        </CodeHighlighter>,
      );
      await waitFor(() => {
        expect(container.querySelector('code')).toBeInTheDocument();
      });
      expect(container.textContent).toContain('console.log("test");');
    });

    it('should work with prismLightMode and header=null', async () => {
      const { container } = render(
        <CodeHighlighter lang="javascript" prismLightMode header={null}>
          {`console.log("test");`}
        </CodeHighlighter>,
      );
      await waitFor(() => {
        expect(container.querySelector('code')).toBeInTheDocument();
      });
      expect(container.querySelector('.ant-codeHighlighter-header')).toBeNull();
    });

    it('should work with prismLightMode and custom classNames', async () => {
      const { container } = render(
        <CodeHighlighter lang="javascript" prismLightMode classNames={{ code: 'customCodeClass' }}>
          {`console.log("test");`}
        </CodeHighlighter>,
      );
      await waitFor(() => {
        expect(container.querySelector('.customCodeClass')).toBeInTheDocument();
      });
    });

    it('should work with prismLightMode and custom styles', async () => {
      const { container } = render(
        <CodeHighlighter
          lang="javascript"
          prismLightMode
          styles={{ root: { backgroundColor: 'blue' } }}
        >
          {`console.log("test");`}
        </CodeHighlighter>,
      );
      await waitFor(() => {
        expect(container.firstChild).toBeInTheDocument();
      });
      const root = container.firstChild as HTMLElement;
      expect(root.style.backgroundColor).toBe('blue');
    });

    it('should use SyntaxHighlighter directly when prismLightMode=true and no lang (no Suspense)', () => {
      const { container } = render(
        <CodeHighlighter lang="" prismLightMode>
          {`plain code`}
        </CodeHighlighter>,
      );
      // Should render plain code without highlighting
      expect(container.querySelector('code')).toBeInTheDocument();
      expect(container.textContent).toContain('plain code');
    });

    it('should render plain code when no lang (early return before FullPrismHighlighter)', async () => {
      const { container } = render(
        <CodeHighlighter lang="" prismLightMode={false}>
          {`plain code`}
        </CodeHighlighter>,
      );
      // Should early return with plain <code> element (no highlighting)
      // Verify it's the early return path (bare code element)
      expect(container.querySelector('.ant-codeHighlighter')).toBeNull();
    });

    it('should render Suspense fallback when prismLightMode=true with lang', async () => {
      const { container } = render(
        <CodeHighlighter lang="javascript" prismLightMode>
          {`console.log("async load");`}
        </CodeHighlighter>,
      );
      // Initially shows fallback, then loads
      await waitFor(() => {
        expect(container.textContent).toContain('console.log("async load");');
      });
    });

    it('should render Suspense fallback when prismLightMode=false', async () => {
      const { container } = render(
        <CodeHighlighter lang="javascript" prismLightMode={false}>
          {`console.log("full prism");`}
        </CodeHighlighter>,
      );
      // Full Prism loads asynchronously
      await waitFor(() => {
        expect(container.textContent).toContain('console.log("full prism");');
      });
    });
  });

  describe('RTL support', () => {
    it('should render with RTL direction', async () => {
      // Mock XProvider context with RTL direction
      const { container } = render(
        <CodeHighlighter lang="javascript" data-direction="rtl">
          {`console.log("test");`}
        </CodeHighlighter>,
      );
      await waitFor(() => {
        expect(container.querySelector('.ant-codeHighlighter')).toBeInTheDocument();
      });
    });
  });

  describe('edge cases', () => {
    it('should handle empty code with lang', () => {
      const { container } = render(<CodeHighlighter lang="javascript">{''}</CodeHighlighter>);
      expect(container.firstChild).toBe(null);
    });

    it('should handle code with only whitespace', async () => {
      const { container } = render(<CodeHighlighter lang="javascript">{'   '}</CodeHighlighter>);
      await waitFor(() => {
        expect(container.querySelector('code')).toBeInTheDocument();
      });
    });

    it('should handle code with multiple newlines', async () => {
      const { container } = render(
        <CodeHighlighter lang="javascript">{`line1\n\nline3\n`}</CodeHighlighter>,
      );
      await waitFor(() => {
        expect(container.textContent).toContain('line1');
      });
      expect(container.textContent).toContain('line3');
    });

    it('should handle special characters in code', async () => {
      const { container } = render(
        <CodeHighlighter lang="javascript">
          {`const str = "Hello\\nWorld"; console.log('${'<div>'}');`}
        </CodeHighlighter>,
      );
      await waitFor(() => {
        expect(container.textContent).toContain('const str =');
      });
    });
  });

  describe('displayName', () => {
    it('should have displayName in development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      // Re-import to get the displayName set
      const { default: CodeHighlighterDev } = require('../index');
      expect(CodeHighlighterDev.displayName).toBe('CodeHighlighter');
      process.env.NODE_ENV = originalEnv;
    });
  });
});
