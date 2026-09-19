import { act, render, renderHook } from '@testing-library/react';
import React, { useEffect } from 'react';
import XMarkdown from '../../index';
import { useStreamingCore } from '../hooks';
import type { ComponentProps, StreamingOption, XMarkdownProps } from '../interface';

/**
 * `streaming.incremental` must never change what ends up on the page: at every
 * point of the stream, rendering the sections must produce exactly the markup
 * that rendering the whole output at once produces. The corpora below are
 * built around the constructs that could break that promise.
 */

const noMin = { minSectionChars: 0 };

const corpora: Record<string, string> = {
  headingsAndBlocks: [
    '# Title',
    '',
    'Intro with **bold**, *em*, `code`, [link](https://x.ant.design) and 😀 emoji.',
    '',
    '## Code',
    '',
    '```js',
    '# not a heading inside a fence',
    'const a = 1;',
    '```',
    '',
    '~~~',
    '# not a heading inside a tilde fence',
    '~~~',
    '',
    '## Table',
    '',
    '| a | b |',
    '| - | - |',
    '| 1 | 2 |',
    '',
    '## Lists',
    '',
    '- one',
    '',
    '- two (loose list across a blank line)',
    '',
    '1. first',
    '2. second',
    '',
    '> quote',
    '> # not a heading, it is quoted',
    '',
    '### Trailing',
    '',
    'Last paragraph.',
  ].join('\n'),

  headingWithoutBlankLineBefore: [
    '# A',
    '',
    'para',
    '## B directly after a paragraph',
    '',
    'more',
    '',
    '  ## indented heading (not split on)',
    '',
    'Setext',
    '======',
    '',
    'end',
  ].join('\n'),

  rawBlocks: [
    '# A',
    '',
    '<pre>',
    '',
    '# inside pre',
    '',
    '</pre>',
    '',
    '## B',
    '',
    '<!--',
    '',
    '# inside a comment',
    '',
    '-->',
    '',
    '## C',
    '',
    '$$',
    '',
    '# inside math',
    '',
    '$$',
    '',
    '## D',
    '',
    '<script>',
    '',
    '# inside script',
    '',
    '</script>',
    '',
    'end',
  ].join('\n'),

  referenceDefinitionAfterUse: [
    '# A',
    '',
    'See [the docs][docs] and the footnote[^1].',
    '',
    '## B',
    '',
    '[docs]: https://x.ant.design',
    '',
    '[^1]: footnote text',
    '',
    '## C',
    '',
    'end',
  ].join('\n'),

  crlf: '# A\r\n\r\npara\r\n\r\n## B\r\n\r\n```\r\n# fenced\r\n```\r\n\r\n## C\r\n\r\nend',

  // No blank line between a table (or paragraph) and the next heading: the
  // heading still interrupts the previous block, so it is still a boundary.
  tableThenHeading: Array.from({ length: 4 }, (_, i) =>
    [
      `## 第 ${i} 节`,
      '',
      `第 ${i} 段，含 **加粗**、\`code\` 和[链接](https://x.ant.design)。`,
      '',
      '```ts',
      `const s${i} = ${i}; // # not a heading`,
      '```',
      '',
      '| a | b |',
      '| - | - |',
      `| ${i} | ${i * 2} |`,
      `| ${i + 1} | ${i * 2 + 1} |`,
      // GFM: a line without pipes right after the rows is still a row.
      `row without pipes ${i}`,
      '',
    ].join('\n'),
  ).join(''),

  indentedFences: [
    '# A',
    '',
    ' ```',
    '# inside a fence indented by one space',
    ' ```',
    '',
    '## B',
    '',
    '   ~~~',
    '',
    '# inside a fence indented by three spaces',
    '',
    '   ~~~',
    '',
    '## C',
    '',
    'end',
  ].join('\n'),

  htmlBlocks: [
    '# A',
    '',
    '<div class="card">',
    '## not a heading, html block text',
    '</div>',
    '',
    '## B',
    '',
    '<my-card>',
    '',
    '## C inside an open custom tag',
    '',
    '</my-card>',
    '',
    '## D',
    '',
    'end',
  ].join('\n'),
};

const renderBoth = (
  streamingExtra: Partial<StreamingOption> = {},
  components?: XMarkdownProps['components'],
) => {
  const whole = render(
    <XMarkdown
      content=""
      streaming={{ hasNextChunk: true, ...streamingExtra }}
      components={components}
    />,
  );
  const sectioned = render(
    <XMarkdown
      content=""
      streaming={{ hasNextChunk: true, incremental: noMin, ...streamingExtra }}
      components={components}
    />,
  );
  const update = (content: string, hasNextChunk: boolean) => {
    act(() => {
      whole.rerender(
        <XMarkdown
          content={content}
          streaming={{ hasNextChunk, ...streamingExtra }}
          components={components}
        />,
      );
      sectioned.rerender(
        <XMarkdown
          content={content}
          streaming={{ hasNextChunk, incremental: noMin, ...streamingExtra }}
          components={components}
        />,
      );
    });
    return { whole: whole.container.innerHTML, sectioned: sectioned.container.innerHTML };
  };
  return { update };
};

describe('streaming.incremental', () => {
  describe('sections are a lossless partition of the output', () => {
    for (const [name, text] of Object.entries(corpora)) {
      it(`${name}`, () => {
        const { result, rerender } = renderHook(
          ({ input, hasNextChunk }: { input: string; hasNextChunk: boolean }) =>
            useStreamingCore(input, { streaming: { hasNextChunk, incremental: noMin } }),
          { initialProps: { input: '', hasNextChunk: true } },
        );
        let sawSections = false;
        for (let i = 1; i <= text.length; i++) {
          act(() => {
            rerender({ input: text.slice(0, i), hasNextChunk: true });
          });
          const { output, sections } = result.current;
          if (sections) {
            sawSections = true;
            expect(sections.length).toBeGreaterThan(1);
            expect(sections.join('')).toBe(output);
            // Every boundary sits right before a column-0 ATX heading.
            for (const section of sections.slice(1)) {
              expect(section).toMatch(/^#{1,6}[ \t]/);
            }
          }
        }
        act(() => {
          rerender({ input: text, hasNextChunk: false });
        });
        expect(result.current.output).toBe(text);
        if (result.current.sections) {
          expect(result.current.sections.join('')).toBe(text);
        }
        if (name === 'referenceDefinitionAfterUse') {
          // Splits until the definition shows up, then every boundary is dropped.
          expect(sawSections).toBe(true);
          expect(result.current.sections).toBeNull();
        } else {
          expect(sawSections).toBe(true);
        }
      });
    }
  });

  describe('rendered markup equals the whole-document render at every step', () => {
    for (const [name, text] of Object.entries(corpora)) {
      it(`${name}`, () => {
        const { update } = renderBoth();
        for (let i = 1; i <= text.length; i++) {
          const { whole, sectioned } = update(text.slice(0, i), true);
          expect(sectioned).toBe(whole);
        }
        const done = update(text, false);
        expect(done.sectioned).toBe(done.whole);
        // …and both equal a plain non-streaming render of the final text.
        const plain = render(<XMarkdown content={text} />);
        expect(done.sectioned).toBe(plain.container.innerHTML);
      });
    }

    it('with custom components, a tail and a code component', () => {
      const text = corpora.headingsAndBlocks;
      const components = {
        code: ({ children, lang, block }: ComponentProps) => (
          <code data-test-lang={lang} data-test-block={String(block)}>
            {children}
          </code>
        ),
        h2: ({ children }: ComponentProps) => <h2 data-custom="1">{children}</h2>,
      };
      const { update } = renderBoth({ tail: true }, components);
      for (let i = 1; i <= text.length; i += 3) {
        const { whole, sectioned } = update(text.slice(0, i), true);
        expect(sectioned).toBe(whole);
      }
      const done = update(text, false);
      expect(done.sectioned).toBe(done.whole);
    });
  });

  describe('boundary guards', () => {
    const sectionsFor = (
      text: string,
      streaming: StreamingOption = {},
      components?: XMarkdownProps['components'],
    ) => {
      const { result, rerender } = renderHook(
        ({ input }: { input: string }) =>
          useStreamingCore(input, {
            streaming: { hasNextChunk: true, incremental: noMin, ...streaming },
            components,
          }),
        { initialProps: { input: '' } },
      );
      act(() => {
        rerender({ input: text });
      });
      return result.current.sections;
    };

    it('splits before a top-level heading that follows a blank line', () => {
      expect(sectionsFor('# A\n\npara\n\n## B\n\nmore\n\n')).toEqual([
        '# A\n\npara\n\n',
        '## B\n\nmore\n\n',
      ]);
    });

    it('splits on a heading directly after a paragraph line (a heading interrupts a paragraph)', () => {
      expect(sectionsFor('# A\n\npara\n## B\n\nmore\n\n')).toEqual(['# A\n\npara\n', '## B\n\nmore\n\n']);
    });

    it('does not split on an indented heading or a setext heading', () => {
      expect(sectionsFor('# A\n\npara\n\n   ## B\n\nmore\n\n')).toBeNull();
      expect(sectionsFor('# A\n\npara\n\nB\n---\n\nmore\n\n')).toBeNull();
    });

    it('does not split inside an HTML block until its blank line', () => {
      expect(sectionsFor('# A\n\n<div>\n## B\n</div>\n\n## C\n\n')).toEqual([
        '# A\n\n<div>\n## B\n</div>\n\n',
        '## C\n\n',
      ]);
      expect(sectionsFor('# A\n\n<div>\n\n## B\n\n</div>\n\n')).toHaveLength(2);
    });

    it('does not split on # lines inside fenced code, indented fences included', () => {
      expect(sectionsFor('# A\n\n```\n\n# fenced\n\n```\n\n')).toBeNull();
      expect(sectionsFor('# A\n\n~~~\n\n# fenced\n\n~~~\n\n')).toBeNull();
      expect(sectionsFor('# A\n\n ```\n# fenced\n ```\n\n')).toBeNull();
      expect(sectionsFor('# A\n\n   ```\n\n# fenced\n\n   ```\n\n')).toBeNull();
      // Four spaces is indented code, not a fence: the `#` line after it is a heading.
      expect(sectionsFor('# A\n\n    ```\n\n# heading\n\n')).toHaveLength(2);
    });

    it('does not split on # lines inside <pre>, <script>, comments and $$ math', () => {
      expect(sectionsFor('# A\n\n<pre>\n\n# x\n\n</pre>\n\n')).toBeNull();
      expect(sectionsFor('# A\n\n<SCRIPT>\n\n# x\n\n</SCRIPT>\n\n')).toBeNull();
      expect(sectionsFor('# A\n\n<!--\n\n# x\n\n-->\n\n')).toBeNull();
      expect(sectionsFor('# A\n\n$$\n\n# x\n\n$$\n\n')).toBeNull();
      expect(sectionsFor('# A\n\n\\[\n\n# x\n\n\\]\n\n')).toBeNull();
      // …but splits again once the raw block has closed.
      expect(sectionsFor('# A\n\n<pre>\n\n# x\n\n</pre>\n\n## B\n\n')).toEqual([
        '# A\n\n<pre>\n\n# x\n\n</pre>\n\n',
        '## B\n\n',
      ]);
    });

    it('drops all boundaries once a reference or footnote definition appears', () => {
      const { result, rerender } = renderHook(
        ({ input }: { input: string }) =>
          useStreamingCore(input, { streaming: { hasNextChunk: true, incremental: noMin } }),
        { initialProps: { input: '' } },
      );
      act(() => {
        rerender({ input: '# A\n\n[docs]\n\n## B\n\n' });
      });
      expect(result.current.sections).toHaveLength(2);
      act(() => {
        rerender({ input: '# A\n\n[docs]\n\n## B\n\n[docs]: https://x\n\n## C\n\n' });
      });
      expect(result.current.sections).toBeNull();
    });

    it('does not split while a custom component tag is still open', () => {
      const components = { 'my-card': () => null };
      expect(sectionsFor('# A\n\n<my-card>\n\n## B\n\n</my-card>\n\n', {}, components)).toBeNull();
      expect(
        sectionsFor('# A\n\n<my-card>\n\n## B\n\n</my-card>\n\n## C\n\n', {}, components),
      ).toEqual(['# A\n\n<my-card>\n\n## B\n\n</my-card>\n\n', '## C\n\n']);
      // The same text without the component registered is plain HTML and splits.
      expect(sectionsFor('# A\n\n<my-card>\n\n## B\n\n</my-card>\n\n')).toHaveLength(2);
    });

    it('merges sections shorter than minSectionChars into the next one', () => {
      const text = '# A\n\npara\n\n## B\n\nmore\n\n## C\n\nend\n\n';
      expect(sectionsFor(text, { incremental: true })).toBeNull();
      expect(sectionsFor(text, { incremental: { minSectionChars: 12 } })).toEqual([
        '# A\n\npara\n\n## B\n\nmore\n\n',
        '## C\n\nend\n\n',
      ]);
    });

    it('ends the pending table at a heading so the boundary is usable at once', () => {
      // GFM breaks a table at a blank line or at the start of another block.
      // The table token follows: a heading line right after the rows commits
      // the table, so the boundary before the heading is usable immediately.
      expect(sectionsFor('# A\n\n| a |\n| - |\n| 1 |\n## B\n')).toEqual([
        '# A\n\n| a |\n| - |\n| 1 |\n',
        '## B\n',
      ]);
      // A line without pipes is still a row (GFM), not the end of the table.
      expect(sectionsFor('# A\n\n| a |\n| - |\n| 1 |\nrow\n## B\n')).toEqual([
        '# A\n\n| a |\n| - |\n| 1 |\nrow\n',
        '## B\n',
      ]);
    });

    it('is off unless incremental is set, and off for a non-streaming render', () => {
      const text = '# A\n\npara\n\n## B\n\nmore\n\n';
      expect(sectionsFor(text, { incremental: undefined })).toBeNull();
      const { result } = renderHook(() =>
        useStreamingCore(text, { streaming: { hasNextChunk: false, incremental: noMin } }),
      );
      expect(result.current).toEqual({ output: text, sections: null });
    });
  });

  describe('work skipped for finished sections', () => {
    const doc = Array.from({ length: 6 }, (_, i) =>
      [`## Section ${i}`, '', `Paragraph ${i}.`, '', '```js', `const s${i} = ${i};`, '```', ''].join(
        '\n',
      ),
    ).join('\n');

    const streamIn = (incremental: boolean, onRender: (children: string) => void) => {
      const code = ({ children }: ComponentProps) => {
        onRender(String(children));
        return <code>{children}</code>;
      };
      // Like every memo in XMarkdown, sections rely on `components` (and
      // `config`, `streaming`, …) keeping the same identity across renders.
      const components = { code };
      const streaming = incremental
        ? { hasNextChunk: true, incremental: noMin }
        : { hasNextChunk: true };
      const { rerender } = render(
        <XMarkdown content="" streaming={streaming} components={components} />,
      );
      for (let i = 10; i < doc.length; i += 10) {
        act(() => {
          rerender(
            <XMarkdown content={doc.slice(0, i)} streaming={streaming} components={components} />,
          );
        });
      }
      act(() => {
        rerender(<XMarkdown content={doc} streaming={streaming} components={components} />);
      });
    };

    it('does not re-render custom components in earlier sections', () => {
      const count = (incremental: boolean) => {
        const renders: Record<string, number> = {};
        streamIn(incremental, (children) => {
          renders[children] = (renders[children] ?? 0) + 1;
        });
        return renders;
      };
      const whole = count(false);
      const sectioned = count(true);
      // Without sections the first code block re-renders on every chunk of the
      // whole document; with sections it stops once its section has closed.
      expect(whole['const s0 = 0;\n']).toBeGreaterThan(20);
      expect(sectioned['const s0 = 0;\n']).toBeLessThan(6);
      const total = (r: Record<string, number>) => Object.values(r).reduce((a, b) => a + b, 0);
      expect(total(sectioned) * 3).toBeLessThan(total(whole));
    });

    it('keeps sections after the stream ends so custom components are not remounted', () => {
      let mounts = 0;
      const code = ({ children }: ComponentProps) => {
        useEffect(() => {
          mounts += 1;
        }, []);
        return <code>{children}</code>;
      };
      const streaming = { hasNextChunk: true, incremental: noMin };
      const { rerender, container } = render(
        <XMarkdown content={doc} streaming={streaming} components={{ code }} />,
      );
      expect(mounts).toBe(6);
      act(() => {
        rerender(
          <XMarkdown
            content={doc}
            streaming={{ hasNextChunk: false, incremental: noMin }}
            components={{ code }}
          />,
        );
      });
      expect(mounts).toBe(6);
      const plain = render(<XMarkdown content={doc} components={{ code }} />);
      expect(container.innerHTML).toBe(plain.container.innerHTML);
    });
  });
});
