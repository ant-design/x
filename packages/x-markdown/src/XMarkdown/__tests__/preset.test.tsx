import { act, render, renderHook } from '@testing-library/react';
import React, { useEffect } from 'react';
import XMarkdown, { arePropsEqualIgnoringDomNode, useStreaming } from '../../index';
import type { ComponentProps } from '../interface';

describe('streaming boolean preset', () => {
  it('streaming={true} streams with completion and sections, without a tail cursor', () => {
    const { container } = render(<XMarkdown content="a **b" streaming />);
    // incompleteMarkdown: 'complete' → the open emphasis renders as bold…
    expect(container.querySelector('strong')?.textContent).toContain('b');
    // …and the tail cursor stays a per-app choice (object form, `tail: true`).
    expect(container.querySelector('.xmd-tail')).toBeNull();
    const withTail = render(<XMarkdown content="a **b" streaming={{ hasNextChunk: true, tail: true }} />);
    expect(withTail.container.querySelector('.xmd-tail')?.textContent).toBe('▋');
  });

  it('streaming={false} renders the final content at once, like no streaming at all', () => {
    const { container } = render(<XMarkdown content="a **b" streaming={false} />);
    const plain = render(<XMarkdown content="a **b" />);
    expect(container.innerHTML).toBe(plain.container.innerHTML);
    expect(container.innerHTML).toContain('a **b');
    expect(container.querySelector('.xmd-tail')).toBeNull();
  });

  it('keeps mounted custom components across the true → false transition', () => {
    const section = (i: number) =>
      `## Section ${i}\n\n${'Lorem ipsum dolor sit amet. '.repeat(8)}\n\n\`\`\`js\nconst s${i} = ${i};\n\`\`\`\n\n`;
    const doc = section(0) + section(1) + section(2);
    let mounts = 0;
    const code = ({ children }: ComponentProps) => {
      useEffect(() => {
        mounts += 1;
      }, []);
      return <code>{children}</code>;
    };
    const components = { code };
    const { container, rerender } = render(
      <XMarkdown content={doc} streaming components={components} />,
    );
    expect(mounts).toBe(3);
    act(() => {
      rerender(<XMarkdown content={doc} streaming={false} components={components} />);
    });
    expect(mounts).toBe(3);
    const plain = render(<XMarkdown content={doc} components={components} />);
    expect(container.innerHTML).toBe(plain.container.innerHTML);
  });

  it('is accepted by the public useStreaming hook as well', () => {
    const { result } = renderHook(() => useStreaming('see **bold', { streaming: true }));
    expect(result.current).toBe('see **bold**');
    const off = renderHook(() => useStreaming('see **bold', { streaming: false }));
    expect(off.result.current).toBe('see **bold');
  });

  it('leaves the object form untouched', () => {
    const { container } = render(
      <XMarkdown content="a **b" streaming={{ hasNextChunk: true }} />,
    );
    // Placeholder mode by default: the open emphasis is held back.
    expect(container.innerHTML).not.toContain('<strong>');
    expect(container.querySelector('.xmd-tail')).toBeNull();
  });
});

describe('arePropsEqualIgnoringDomNode', () => {
  it('ignores domNode and shallow-compares everything else', () => {
    const a = { children: 'x', lang: 'js', streamStatus: 'done', domNode: {} };
    const b = { children: 'x', lang: 'js', streamStatus: 'done', domNode: {} };
    expect(arePropsEqualIgnoringDomNode(a, b)).toBe(true);
    expect(arePropsEqualIgnoringDomNode(a, { ...b, children: 'y' })).toBe(false);
    expect(arePropsEqualIgnoringDomNode(a, { ...b, streamStatus: 'loading' })).toBe(false);
    expect(arePropsEqualIgnoringDomNode(a, { ...b, extra: 1 })).toBe(false);
    const { lang: _lang, ...withoutLang } = b;
    expect(arePropsEqualIgnoringDomNode(a, { ...withoutLang, other: 'js' })).toBe(false);
    expect(arePropsEqualIgnoringDomNode(a, { ...b, children: ['x'] })).toBe(false);
  });

  it('stops finished code components from re-rendering on every chunk', () => {
    const doc = Array.from(
      { length: 4 },
      (_, i) => `Paragraph ${i}.\n\n\`\`\`js\nconst s${i} = ${i};\n\`\`\`\n\n`,
    ).join('');

    const streamWith = (components: NonNullable<React.ComponentProps<typeof XMarkdown>['components']>) => {
      const streaming = { hasNextChunk: true };
      const { rerender } = render(<XMarkdown content="" streaming={streaming} components={components} />);
      for (let i = 10; i < doc.length; i += 10) {
        act(() => {
          rerender(<XMarkdown content={doc.slice(0, i)} streaming={streaming} components={components} />);
        });
      }
      act(() => {
        rerender(<XMarkdown content={doc} streaming={streaming} components={components} />);
      });
    };

    let plainRenders = 0;
    const Plain = (props: ComponentProps) => {
      plainRenders += 1;
      return <code>{props.children}</code>;
    };
    streamWith({ code: Plain });

    let memoRenders = 0;
    const Memo = React.memo((props: ComponentProps) => {
      memoRenders += 1;
      return <code>{props.children}</code>;
    }, arePropsEqualIgnoringDomNode);
    streamWith({ code: Memo });

    expect(plainRenders).toBeGreaterThan(30);
    // Each block still renders while its own text is streaming in, then stops.
    expect(memoRenders * 2).toBeLessThan(plainRenders);
  });
});
