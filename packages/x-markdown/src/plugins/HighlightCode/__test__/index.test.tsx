import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import XMarkdown from '../../../XMarkdown';
import HighlightCode from '..';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useId: () => 'mock-id-123',
}));

describe('HighlightCode', () => {
  it('render normal code', () => {
    const content = `\`\`\`javascript
console.log("javascript");
\`\`\``;

    const { container } = render(
      <XMarkdown
        content={content}
        components={{
          code: (props: Record<string, any>) => {
            const { class: className, children } = props;
            const lang = className?.match(/language-(\w+)/)?.[1] || '';
            return <HighlightCode lang={lang}>{children}</HighlightCode>;
          },
        }}
      />,
    );
    expect(container.querySelector('pre')).toBeInTheDocument();
    expect(container.querySelector('code')).toBeInTheDocument();
    expect(container.textContent).toContain('console.log("javascript");');
  });

  it('render normal code with header', () => {
    const content = `\`\`\`javascript
console.log("javascript");
\`\`\``;

    const { container } = render(
      <XMarkdown
        content={content}
        components={{
          code: (props: Record<string, any>) => {
            const { class: className, children } = props;
            const lang = className?.match(/language-(\w+)/)?.[1] || '';
            return <HighlightCode lang={lang}>{children}</HighlightCode>;
          },
        }}
      />,
    );
    expect(container.querySelector('.ant-highlightCode-header')).toBeInTheDocument();
    expect(container.querySelector('.ant-highlightCode-header')?.textContent).toContain(
      'javascript',
    );
  });

  it('render normal code with custom header class', () => {
    const content = `\`\`\`javascript
console.log("javascript");
\`\`\``;

    const { container } = render(
      <XMarkdown
        content={content}
        components={{
          code: (props: Record<string, any>) => {
            const { class: className, children } = props;
            const lang = className?.match(/language-(\w+)/)?.[1] || '';
            return (
              <HighlightCode lang={lang} classNames={{ header: 'customHeader' }}>
                {children}
              </HighlightCode>
            );
          },
        }}
      />,
    );
    expect(container.querySelector('.customHeader')).toBeInTheDocument();
  });

  it('render normal code with custom header', () => {
    const content = `\`\`\`javascript
console.log("javascript");
\`\`\``;

    const { container } = render(
      <XMarkdown
        content={content}
        components={{
          code: (props: Record<string, any>) => {
            const { class: className, children } = props;
            const lang = className?.match(/language-(\w+)/)?.[1] || '';
            return (
              <HighlightCode
                lang={lang}
                header={<div className="myCustomClass">custom header</div>}
              >
                {children}
              </HighlightCode>
            );
          },
        }}
      />,
    );
    expect(container.querySelector('.myCustomClass')).toBeInTheDocument();
    expect(container.querySelector('.myCustomClass')?.textContent).toContain('custom header');
  });

  it('render normal code with no header', () => {
    const content = `\`\`\`javascript
console.log("javascript");
\`\`\``;

    const { container } = render(
      <XMarkdown
        content={content}
        components={{
          code: (props: Record<string, any>) => {
            const { class: className, children } = props;
            const lang = className?.match(/language-(\w+)/)?.[1] || '';
            return (
              <HighlightCode lang={lang} header={null}>
                {children}
              </HighlightCode>
            );
          },
        }}
      />,
    );
    expect(container.querySelector('.ant-highlightCode-header')).toBeNull();
  });

  it('render normal code with no children', () => {
    const { container } = render(<HighlightCode lang={'javascript'}>{''}</HighlightCode>);
    expect(container.querySelector('code')).toBeNull();
  });

  it('mermaid code is render as text', () => {
    const content = `\`\`\`mermaid
graph TD; A-->B;
\`\`\``;

    const { container } = render(
      <XMarkdown
        content={content}
        components={{
          code: (props: Record<string, any>) => {
            const { class: className, children } = props;
            const lang = className?.match(/language-(\w+)/)?.[1] || '';
            return <HighlightCode lang={lang}>{children}</HighlightCode>;
          },
        }}
      />,
    );
    expect(container.querySelector('pre')).toBeInTheDocument();
    expect(container.textContent).toContain('graph TD; A-->B;');
  });

  it('should handle undefined lang', () => {
    const content = `
    \`\`\`
plain text
\`\`\``;

    const { container } = render(
      <XMarkdown
        content={content}
        components={{
          code: (props: Record<string, any>) => {
            const { className, children } = props;
            const lang = className?.match(/language-(\w+)/)?.[1] || '';
            return <HighlightCode lang={lang}>{children}</HighlightCode>;
          },
        }}
      />,
    );
    expect(container.querySelector('pre')).toBeInTheDocument();
    expect(container.textContent).toContain('plain text');
  });

  it('should handle copy action click', async () => {
    const content = `\`\`\`javascript
console.log("test copy");
\`\`\``;
    const mockClipboard = {
      writeText: jest.fn().mockResolvedValue(undefined),
    };

    Object.defineProperty(navigator, 'clipboard', {
      writable: true,
      value: mockClipboard,
    });

    render(
      <XMarkdown
        content={content}
        components={{
          code: (props: Record<string, any>) => {
            const { class: className, children } = props;
            const lang = className?.match(/language-(\w+)/)?.[1] || '';
            return <HighlightCode lang={lang}>{children}</HighlightCode>;
          },
        }}
      />,
    );

    const copyButton = screen.getByRole('img', { name: 'copy' });
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(mockClipboard.writeText).toHaveBeenCalledWith('console.log("test copy");');
    });
  });
});
