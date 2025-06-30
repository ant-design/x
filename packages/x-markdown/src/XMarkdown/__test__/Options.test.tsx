import { render } from '@testing-library/react';
import React from 'react';
import XMarkdown, { Token } from '../../index';

describe('Options', () => {
  it('custom component', () => {
    const content = `<Line>custom line content</Line>`;
    const customLine = (props: any) => {
      return <div data-testid="custom-line">{props.children}</div>;
    };
    const { getByTestId } = render(
      <XMarkdown
        content={content}
        components={{
          Line: customLine,
        }}
      />,
    );
    const lineElement = getByTestId('custom-line');
    expect(lineElement).toBeInTheDocument();
  });
  it('content has not matched component', () => {
    const content = `<Line1>custom line content</Line1>`;
    const result = '<p>custom line content</p>';
    const { container } = render(
      <XMarkdown
        content={content}
        components={{
          Line: (props: any) => {
            return <div data-testid="custom-line">{props.children}</div>;
          },
        }}
      />,
    );
    expect((container.firstChild as HTMLElement)?.innerHTML).toBe(result);
  });
  it('should handle unknown plugin name with proper error', () => {
    // Arrange
    const invalidPlugin = {
      name: '', // 故意留空名称
      level: 'inline' as const,
      tokenizer: (src: string) => {
        const match = src.match(/^$$\^(\d+)$$/);
        return match
          ? {
              type: 'footnote',
              raw: match[0],
              text: match[1],
              renderType: 'component',
            }
          : undefined;
      },
      renderer: () => {
        throw new Error('Renderer not implemented');
      },
    };

    const { container } = render(
      <XMarkdown content="[1](@ref)" plugins={[{ extensions: [invalidPlugin] }]} />,
    );

    expect((container.firstChild as HTMLElement)?.innerHTML).toBe('<p><a href="@ref">1</a></p>');
  });

  it('should handle unknown plugin level', () => {
    // Arrange
    const invalidPlugin = {
      name: 'test', // 故意留空名称
      level: 'unknown' as const,
      tokenizer: (src: string) => {
        const match = src.match(/^$$\^(\d+)$$/);
        return match
          ? {
              type: 'footnote',
              raw: match[0],
              text: match[1],
              renderType: 'component',
            }
          : undefined;
      },
      renderer: () => {
        throw new Error('Renderer not implemented');
      },
      childTokens: ['dt', 'dd'],
    };

    const { container } = render(
      <XMarkdown content="[1](@ref)" plugins={[{ extensions: [invalidPlugin] }]} />,
    );

    expect((container.firstChild as HTMLElement)?.innerHTML).toBe('<p><a href="@ref">1</a></p>');
  });

  it('custom plugins', () => {
    const plugin = {
      name: 'footnote',
      level: 'inline' as const,
      start() {
        return undefined;
      },
      tokenizer(src: string) {
        const match = src.match(/^\[\^(\d+)\]/);
        if (match) {
          const content = match[0].trim();
          return {
            type: 'footnote',
            raw: content,
            text: content?.replace(/^\[\^(\d+)\]/g, '$1'),
            renderType: 'component',
          };
        }
      },
      renderer() {
        throw new Error('Block Component Error');
      },
    };
    const { container } = render(
      <XMarkdown content={'test'} plugins={[{ extensions: [plugin] }]} />,
    );
    expect((container.firstChild as HTMLElement)?.innerHTML).toBe('<p>test</p>');
  });

  it('repeat renderer', () => {
    const extensions = [
      {
        level: 'inline' as const,
        name: 'test',
        tokenizer(src: string) {
          const match = src.match(/^\[\^(\d+)\]/);
          if (match) {
            const content = match[0].trim();
            return {
              type: 'footnote',
              raw: content,
              text: content?.replace(/^\[\^(\d+)\]/g, '$1'),
              renderType: 'component',
            };
          }
        },
        renderer: {
          heading() {
            return false;
          },
        },
      },
      {
        level: 'inline' as const,
        name: 'test',
        tokenizer(src: string) {
          const match = src.match(/^\[\^(\d+)\]/);
          if (match) {
            const content = match[0].trim();
            return {
              type: 'footnote',
              raw: content,
              text: content?.replace(/^\[\^(\d+)\]/g, '$1'),
              renderType: 'component',
            };
          }
        },
        renderer: {
          heading(props: Token) {
            if (props.depth === 1) {
              return <h2>{props.raw}</h2>;
            }
          },
        },
      },
    ];

    const { container } = render(<XMarkdown content="# heading" plugins={[{ extensions }]} />);
    expect((container.firstChild as HTMLElement)?.innerHTML).toBe('<h1>heading</h1>');
  });
});
