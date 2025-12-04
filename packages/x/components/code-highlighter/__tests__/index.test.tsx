import { render } from '@testing-library/react';
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

describe('CodeHighlighter', () => {
  it('render normal code', () => {
    const { container } = render(
      <CodeHighlighter lang="javascript">{`console.log("javascript");`}</CodeHighlighter>,
    );
    expect(container.querySelector('pre')).toBeInTheDocument();
    expect(container.querySelector('code')).toBeInTheDocument();
    expect(container.textContent).toContain('console.log("javascript");');
  });

  it('render normal code with header', () => {
    const { container } = render(
      <CodeHighlighter lang="javascript">{`console.log("javascript");`}</CodeHighlighter>,
    );
    expect(container.querySelector('.ant-codeHighlighter-header')).toBeInTheDocument();
    expect(container.querySelector('.ant-codeHighlighter-header')?.textContent).toContain(
      'javascript',
    );
  });

  it('render normal code with custom header class', () => {
    const { container } = render(
      <CodeHighlighter lang="javascript" classNames={{ header: 'customHeader' }}>
        {`console.log("javascript");`}
      </CodeHighlighter>,
    );
    expect(container.querySelector('.customHeader')).toBeInTheDocument();
  });

  it('render normal code with custom header', () => {
    const { container } = render(
      <CodeHighlighter
        lang="javascript"
        header={<div className="myCustomClass">custom header</div>}
      >
        {`console.log("javascript");`}
      </CodeHighlighter>,
    );
    expect(container.querySelector('.myCustomClass')).toBeInTheDocument();
    expect(container.querySelector('.myCustomClass')?.textContent).toContain('custom header');
  });

  it('render normal code with no header', () => {
    const { container } = render(
      <CodeHighlighter lang="javascript" header={null}>
        {`console.log("javascript");`}
      </CodeHighlighter>,
    );
    expect(container.querySelector('.ant-codeHighlighter-header')).toBeNull();
  });

  it('render normal code with no children', () => {
    const { container } = render(<CodeHighlighter lang="javascript">{''}</CodeHighlighter>);
    expect(container.querySelector('code')).toBeNull();
  });

  it('mermaid code is render as text', () => {
    const { container } = render(
      <CodeHighlighter lang="mermaid">{`graph TD; A-->B;`}</CodeHighlighter>,
    );
    expect(container.querySelector('pre')).toBeInTheDocument();
    expect(container.textContent).toContain('graph TD; A-->B;');
  });

  it('should handle undefined lang', () => {
    const { container } = render(<CodeHighlighter lang="">{`plain text`}</CodeHighlighter>);
    expect(container.querySelector('code')).toBeInTheDocument();
    expect(container.textContent).toContain('plain text');
  });

  it('should apply custom styles', () => {
    const { container } = render(
      <CodeHighlighter
        lang="javascript"
        styles={{ root: { backgroundColor: 'red' }, header: { color: 'blue' } }}
      >
        {`console.log("test");`}
      </CodeHighlighter>,
    );
    const root = container.firstChild as HTMLElement;
    expect(root.style.backgroundColor).toBe('red');
  });

  it('should forward ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    const { container } = render(
      <CodeHighlighter ref={ref} lang="javascript">
        {`console.log("test");`}
      </CodeHighlighter>,
    );
    expect(ref.current).toBe(container.firstChild);
  });
});
