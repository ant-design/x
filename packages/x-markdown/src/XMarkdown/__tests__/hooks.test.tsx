import { act, render, renderHook } from '@testing-library/react';
import React from 'react';
import XMarkdownProbe from '../../index';
import { useStreaming } from '../hooks';
import type { XMarkdownProps } from '../interface';

// 流处理功能测试 - 基础测试用例
const streamingTestCases = [
  {
    title: 'incomplete link with streaming enabled',
    input: '[incomplete link](https://example',
    output: '',
  },
  {
    title: 'incomplete image only start should not show',
    input: '!',
    output: '', // 实际实现会过滤掉不完整的图片
  },
  {
    title: 'incomplete image with streaming enabled',
    input: '![alt text](https://example',
    output: '', // 实际实现会过滤掉不完整的图片
  },
  {
    title: 'complete link should not use placeholders',
    input: '[ant design x](https://x.ant.design)',
    output: '[ant design x](https://x.ant.design)',
  },
  {
    title: 'incomplete list -',
    input: '-',
    output: '', // 实际实现会过滤掉不完整的列表
  },
  {
    title: 'incomplete list - with complete bold',
    input: '- **text**',
    output: '- **text**',
  },
  {
    title: 'setext heading',
    input: 'text \n- ',
    output: 'text \n', // 实际实现会过滤掉不完整的setext heading
  },
  {
    title: 'not list ',
    input: '+123',
    output: '+123',
  },
  {
    title: 'incomplete list +',
    input: '+',
    output: '', // 实际实现会过滤掉不完整的列表
  },
  {
    title: 'incomplete list * with space',
    input: '-    ',
    output: '-    ', // 实际实现会保留带空格的列表标记
  },
  {
    title: 'complete list *',
    input: '* list',
    output: '* list',
  },
  {
    title: 'complete list - with complete bold',
    input: '- **bold**',
    output: '- **bold**',
  },
  {
    title: 'inValid heading',
    input: '#######',
    output: '#######',
  },
  {
    title: 'inValid heading no space',
    input: '###Heading',
    output: '###Heading',
  },
  {
    title: 'valid heading ',
    input: '### Heading',
    output: '### Heading',
  },
  {
    title: 'incomplete table - only header',
    input: '| Header 1 | Header 2 |',
    output: '', // 实际实现会过滤掉不完整的表格
  },
  {
    title: 'incomplete table - only header with title',
    input: 'table \n | Header 1 | Header 2 |',
    output: 'table \n ', // 实际实现会过滤掉不完整的表格
  },
  {
    title: 'incomplete table - header and separator',
    input: '| Header 1 | Header 2 |\n| --- | --- |',
    output: '', // 实际实现会过滤掉不完整的表格
  },
  {
    title: 'complete table',
    input: '| Header 1 | Header 2 |\n| --- | --- |\n| Cell 1 | Cell 2 |',
    output: '| Header 1 | Header 2 |\n| --- | --- |\n| Cell 1 | Cell 2 |',
  },
  {
    title: 'malformed table - no closing pipe',
    input: '| Header 1 | Header 2 \n',
    output: '| Header 1 | Header 2 \n',
  },
  {
    title: 'table with incomplete separator',
    input: '| Header 1 | Header 2 |\n| --- |',
    output: '', // 实际实现会过滤掉不完整的表格
  },
  {
    title: 'table with left align separator',
    input: '| Header 1 | Header 2 |\n| :--- |',
    output: '', // 实际实现会过滤掉不完整的表格
  },
  {
    title: 'table with right align separator',
    input: '| Header 1 | Header 2 |\n| ---: |',
    output: '', // 实际实现会过滤掉不完整的表格
  },
  {
    title: 'table with center separator',
    input: '| Header 1 | Header 2 |\n| :---: |',
    output: '', // 实际实现会过滤掉不完整的表格
  },
  {
    title: 'incomplete Html - open tag',
    input: '<div ',
    output: '', // 实际实现会过滤掉不完整的HTML
  },
  {
    title: 'incomplete Html - close tag',
    input: '</div ',
    output: '', // 实际实现会过滤掉不完整的HTML
  },
  {
    title: 'incomplete Html - self close tag',
    input: '<img src="" / ',
    output: '', // 实际实现会过滤掉不完整的HTML
  },
  {
    title: 'complete Html - open tag',
    input: '<div>Div</div> ',
    output: '<div>Div</div> ',
  },
  {
    title: 'complete Html - self close tag',
    input: '<br />',
    output: '<br />',
  },
  {
    title: 'complete Html - nested tags',
    input: '<div><span>text</span></div>',
    output: '<div><span>text</span></div>',
  },
  {
    title: 'incomplete inline code with streaming enabled',
    input: '`console.log("hello")',
    output: '', // 实际实现会过滤掉不完整的行内代码
  },
  {
    title: 'complete inline code should not use placeholders',
    input: '`const x = 42;`',
    output: '`const x = 42;`',
  },
  {
    title: 'incomplete inline code - single backtick',
    input: '`',
    output: '', // 实际实现会过滤掉不完整的行内代码
    config: { streaming: { hasNextChunk: true } },
  },
  {
    title: 'incomplete inline code - max length',
    input: `\`${'a'.repeat(300)}`,
    output: '', // 实际实现会过滤掉不完整的行内代码
  },
  {
    title: 'incomplete list with inline-code - single backtick',
    input: '- `',
    output: '- ', // list 已完成并提交，当前 token 为 inline-code（未完成且无组件时不展示）
  },
  {
    title: 'incomplete list with inline-code - partial content',
    input: '- `code',
    output: '- ', // list 已完成并提交，当前 token 为 inline-code（未完成且无组件时不展示）
  },
  {
    title: 'complete list with inline-code',
    input: '- `code`',
    output: '- `code`',
  },
  {
    title: 'complete list with inline-code and text',
    input: '- item with `code`',
    output: '- item with `code`',
  },
  {
    title: 'incomplete list with inline-code - text before backtick',
    input: '- item text `',
    output: '- item text ', // incomplete inline-code should be filtered
  },
  {
    title: 'incomplete list with inline-code and bold combination',
    input: '- **bold** and `code',
    output: '- **bold** and ', // complete bold is kept, incomplete inline-code is filtered
  },
  {
    title: 'complete list with inline-code and bold',
    input: '- **bold** and `code`',
    output: '- **bold** and `code`',
  },
];

// 流处理功能测试 - 带自定义组件映射的测试用例
const streamingTestCasesWithComponents = [
  {
    tokenType: 'link',
    title: 'incomplete link with custom component mapping',
    input: '[incomplete link](https://example',
  },
  {
    tokenType: 'image',
    title: 'incomplete image with custom component mapping',
    input: '![alt text](https://example',
  },
  {
    tokenType: 'table',
    title: 'incomplete table with custom component mapping',
    input: '| Header 1 | Header 2 |',
  },
  {
    tokenType: 'html',
    title: 'incomplete html with custom component mapping',
    input: '<div class="test"',
  },
  {
    tokenType: 'inline-code',
    title: 'incomplete inline code with custom component mapping',
    input: '`console.log("hello")',
  },
];

// 代码块测试 - 基于实际行为
const fencedCodeTestCases = [
  {
    title: 'incomplete link in fenced code block should not be replaced',
    input: '```markdown\nThis is a [link](https://example.com that is incomplete\n```',
    output: '```markdown\nThis is a [link](https://example.com that is incomplete\n```',
  },
  {
    title: 'fenced code block with tilde fences',
    input: '~~~json\n{"key": "value"}\n~~~',
    output: '~~~json\n{"key": "value"}\n~~~',
    config: { streaming: { hasNextChunk: true } },
  },
  {
    title: 'incomplete fenced code block - missing closing fence',
    input: '```javascript\nconsole.log("hello");',
    output: '```javascript\nconsole.log("hello");',
  },
  {
    title: 'fenced code block with trailing spaces after closing fence',
    input: '```css\nbody { margin: 0; }\n```   ',
    output: '```css\nbody { margin: 0; }\n```   ',
    config: { streaming: { hasNextChunk: true } },
  },
  {
    title: 'streaming mode with fenced code block and incomplete content after',
    input: '```typescript\ninterface Test {\n  name: string;\n}\n```\n\nThis is [incomplete',
    output: '```typescript\ninterface Test {\n  name: string;\n}\n```\n\nThis is ',
    config: { streaming: { hasNextChunk: true } },
  },
];

// 错误处理测试
const errorHandlingTestCases = [
  {
    title: 'null input',
    input: null,
    output: '',
    config: { streaming: { hasNextChunk: true } },
  },
  {
    title: 'undefined input',
    input: undefined,
    output: '',
    config: { streaming: { hasNextChunk: true } },
  },
  {
    title: 'number input',
    input: 123,
    output: '',
    config: { streaming: { hasNextChunk: true } },
  },
  {
    title: 'boolean input',
    input: true,
    output: '',
    config: { streaming: { hasNextChunk: true } },
  },
  {
    title: 'object input',
    input: { text: 'test' },
    output: '',
    config: { streaming: { hasNextChunk: true } },
  },
];

type TestCase = {
  title: string;
  input: any;
  output: string;
  config?: {
    streaming: XMarkdownProps['streaming'];
    components?: XMarkdownProps['components'];
  };
};

const TestComponent = ({ input, config }: { input: any; config?: TestCase['config'] }) => {
  const result = useStreaming(input, config);
  return <div>{result}</div>;
};

describe('XMarkdown hooks', () => {
  describe('useStreaming streaming functionality', () => {
    streamingTestCases.forEach(({ title, input, output, config }) => {
      it(`should handle ${title}`, () => {
        const { container } = render(
          <TestComponent input={input} config={config ?? { streaming: { hasNextChunk: true } }} />,
        );
        expect(container.textContent).toBe(output);
      });
    });
  });

  describe('useStreaming streaming functionality with components mapping', () => {
    streamingTestCasesWithComponents.forEach(({ title, input, tokenType }) => {
      it(`should handle ${title}`, () => {
        const defaultTokenMap: Record<string, string> = {
          link: 'incomplete-link',
          image: 'incomplete-image',
          table: 'incomplete-table',
          html: 'incomplete-html',
          'inline-code': 'incomplete-inline-code',
        };

        const { container } = render(
          <TestComponent
            input={input}
            config={{
              streaming: { hasNextChunk: true },
              components: {
                'incomplete-link': () => null,
                'incomplete-image': () => null,
                'incomplete-table': () => null,
                'incomplete-html': () => null,
                'incomplete-inline-code': () => null,
              },
            }}
          />,
        );

        const output = `<${defaultTokenMap[tokenType]} data-raw="${encodeURIComponent(input)}" />`;
        expect(container.textContent).toBe(output);
      });

      it(`should handle ${title} with custom component`, () => {
        const customTokenMap: Record<string, string> = {
          link: 'unfinished-link',
          image: 'unfinished-image',
          table: 'unfinished-table',
          html: 'unfinished-html',
          'inline-code': 'unfinished-inline-code',
        };

        const { container } = render(
          <TestComponent
            input={input}
            config={{
              streaming: {
                hasNextChunk: true,
                incompleteMarkdownComponentMap: customTokenMap,
              },
              components: {
                'unfinished-link': () => null,
                'unfinished-image': () => null,
                'unfinished-table': () => null,
                'unfinished-html': () => null,
                'unfinished-inline-code': () => null,
              },
            }}
          />,
        );

        const output = `<${customTokenMap[tokenType]} data-raw="${encodeURIComponent(input)}" />`;
        expect(container.textContent).toBe(output);
      });
    });
  });

  describe('useStreaming fenced code blocks', () => {
    fencedCodeTestCases.forEach(({ title, input, output, config }) => {
      it(`should handle ${title}`, () => {
        const { container } = render(
          <TestComponent input={input} config={config ?? { streaming: { hasNextChunk: true } }} />,
        );
        expect(container.textContent).toBe(output);
      });
    });
  });

  describe('useStreaming error handling', () => {
    errorHandlingTestCases.forEach(({ title, input, config }) => {
      it(`should handle ${title}`, () => {
        const { container } = render(
          <TestComponent input={input} config={config ?? { streaming: { hasNextChunk: true } }} />,
        );
        expect(container.textContent).toBe('');
      });
    });
  });

  describe('useStreaming streaming behavior', () => {
    it('should handle streaming chunk by chunk', () => {
      const { result, rerender } = renderHook(({ input, config }) => useStreaming(input, config), {
        initialProps: {
          input: 'Hello',
          config: { streaming: { hasNextChunk: true } },
        },
      });

      expect(result.current).toBe('Hello');

      // Simulate streaming more content
      act(() => {
        rerender({
          input: 'Hello world',
          config: { streaming: { hasNextChunk: true } },
        });
      });
      expect(result.current).toBe('Hello world');

      // Simulate streaming incomplete markdown - incomplete link will be filtered out
      act(() => {
        rerender({
          input: 'Hello world with [incomplete link](https://example',
          config: { streaming: { hasNextChunk: true } },
        });
      });
      expect(result.current).toBe('Hello world with ');
    });

    it('should reset state when input is completely different', () => {
      const { result, rerender } = renderHook(({ input, config }) => useStreaming(input, config), {
        initialProps: {
          input: 'First content',
          config: { streaming: { hasNextChunk: true } },
        },
      });

      expect(result.current).toBe('First content');

      // Completely different input should reset state
      act(() => {
        rerender({
          input: 'Completely different',
          config: { streaming: { hasNextChunk: false } },
        });
      });
      expect(result.current).toBe('Completely different');
    });

    it('should handle streaming state transitions', () => {
      const { result, rerender } = renderHook(({ input, config }) => useStreaming(input, config), {
        initialProps: {
          input: 'Start',
          config: { streaming: { hasNextChunk: true } },
        },
      });

      expect(result.current).toBe('Start');

      // Add incomplete link - incomplete link will be filtered out
      act(() => {
        rerender({
          input: 'Start with [link](https://example',
          config: { streaming: { hasNextChunk: true } },
        });
      });
      expect(result.current).toBe('Start with ');

      // Complete the link
      act(() => {
        rerender({
          input: 'Start with [link](https://example.com)',
          config: { streaming: { hasNextChunk: false } },
        });
      });
      expect(result.current).toBe('Start with [link](https://example.com)');
    });
  });

  describe('useStreaming memory management', () => {
    it('should handle component unmounting without memory leaks', () => {
      const { result, unmount } = renderHook(({ input, config }) => useStreaming(input, config), {
        initialProps: {
          input: 'Test content',
          config: { streaming: { hasNextChunk: true } },
        },
      });

      expect(result.current).toBe('Test content');

      // Unmount should not cause errors
      expect(() => {
        unmount();
      }).not.toThrow();
    });
  });

  describe('useStreaming performance optimization', () => {
    it('should memoize recognizers array', () => {
      const { result, rerender } = renderHook(({ input, config }) => useStreaming(input, config), {
        initialProps: {
          input: 'test',
          config: { streaming: { hasNextChunk: true } },
        },
      });

      const firstResult = result.current;

      // Re-render with same config should not change result
      rerender({
        input: 'test',
        config: { streaming: { hasNextChunk: true } },
      });

      expect(result.current).toBe(firstResult);
    });
  });

  describe('useStreaming integration tests', () => {
    it('should handle real-world streaming scenarios', () => {
      const { result, rerender } = renderHook(({ input, config }) => useStreaming(input, config), {
        initialProps: {
          input: '',
          config: { streaming: { hasNextChunk: true } },
        },
      });

      // Simulate real streaming
      const streamingContent = [
        '#',
        '# Welcome',
        '# Welcome to',
        '# Welcome to our',
        '# Welcome to our [documentation](https://example',
        '# Welcome to our [documentation](https://example.com)',
      ];

      streamingContent.forEach((content, index) => {
        act(() => {
          rerender({
            input: content,
            config: { streaming: { hasNextChunk: index < streamingContent.length - 1 } },
          });
        });
      });

      expect(result.current).toBe('# Welcome to our [documentation](https://example.com)');
    });

    it('should handle malformed markdown gracefully', () => {
      const malformedCases = [
        '[[[nested brackets]]]',
        '(((())))nested parentheses',
        '**unclosed bold **text',
        '_unclosed italic_ text',
        '```unclosed code block',
        '| table without closing |',
      ];

      malformedCases.forEach((malformed) => {
        const { result } = renderHook(() =>
          useStreaming(malformed, { streaming: { hasNextChunk: true } }),
        );
        expect(result.current).toBeDefined();
        expect(typeof result.current).toBe('string');
      });
    });
  });

  describe('useStreaming streaming execution with character-by-character rendering', () => {
    it('should handle streaming table content character by character', async () => {
      const tableText =
        '| 模块 | 当前值 | 可修改项 |\n|---|---|---|\n| 支持保单豁免 | ❗不支持 |  🔲 可改为支持 |';
      const { result, rerender } = renderHook(({ input, config }) => useStreaming(input, config), {
        initialProps: {
          input: '',
          config: { streaming: { hasNextChunk: true } },
        },
      });

      // Stream character by character
      for (let i = 0; i <= tableText.length; i++) {
        const partialText = tableText.slice(0, i);

        act(() => {
          rerender({
            input: partialText,
            config: { streaming: { hasNextChunk: i < tableText.length } },
          });
        });

        if (i < tableText.length) {
          await new Promise((resolve) => setTimeout(resolve, 10));
        }
      }

      // Verify final table is rendered correctly
      expect(result.current).toBe(tableText);
    });

    it('should handle streaming fenced code blocks character by character with fence end logic', async () => {
      const codeBlockText =
        '```javascript\nconsole.log("streaming test");\nconsole.log("fence end logic");\n```';
      const { result, rerender } = renderHook(({ input, config }) => useStreaming(input, config), {
        initialProps: {
          input: '',
          config: { streaming: { hasNextChunk: true } },
        },
      });

      // Stream character by character to test fence end detection
      for (let i = 0; i <= codeBlockText.length; i++) {
        const partialText = codeBlockText.slice(0, i);

        act(() => {
          rerender({
            input: partialText,
            config: { streaming: { hasNextChunk: i < codeBlockText.length } },
          });
        });

        if (i < codeBlockText.length) {
          await new Promise((resolve) => setTimeout(resolve, 5));
        }
      }

      // Verify complete code block is preserved
      expect(result.current).toBe(codeBlockText);
    });

    it('should handle streaming fenced code blocks with incomplete closing in non-final chunk', async () => {
      const incompleteCodeBlock = '```python\ndef test():\n    return "incomplete"\n``';
      const { result, rerender } = renderHook(({ input, config }) => useStreaming(input, config), {
        initialProps: {
          input: '',
          config: { streaming: { hasNextChunk: true } },
        },
      });

      // Stream incomplete code block (missing final backtick)
      act(() => {
        rerender({
          input: incompleteCodeBlock,
          config: { streaming: { hasNextChunk: true } }, // Not final chunk
        });
      });

      // Should preserve the incomplete code block since it's not the final chunk
      expect(result.current).toBe(incompleteCodeBlock);

      // Complete the code block
      act(() => {
        rerender({
          input: `${incompleteCodeBlock}\``,
          config: { streaming: { hasNextChunk: false } }, // Final chunk
        });
      });

      expect(result.current).toBe(`${incompleteCodeBlock}\``);
    });
  });

  describe('useStreaming edge cases and additional coverage', () => {
    it('should handle empty string input', () => {
      const { result } = renderHook(() => useStreaming('', { streaming: { hasNextChunk: true } }));
      expect(result.current).toBe('');
    });

    it('should handle streaming disabled', () => {
      const { result } = renderHook(() =>
        useStreaming('[incomplete link](https://example', { streaming: { hasNextChunk: false } }),
      );
      expect(result.current).toBe('[incomplete link](https://example');
    });

    it('should handle custom components mapping', () => {
      const { result } = renderHook(() =>
        useStreaming('[test](https://example', {
          streaming: {
            hasNextChunk: false,
            incompleteMarkdownComponentMap: {
              link: 'custom-link',
              image: 'custom-image',
              table: 'custom-table',
              html: 'custom-html',
            },
          },
        }),
      );
      expect(result.current).toBe('[test](https://example');
    });

    it('should handle streaming with custom components enabled', () => {
      const { result, rerender } = renderHook(({ input, config }) => useStreaming(input, config), {
        initialProps: {
          input: '[link](https://example',
          config: {
            streaming: {
              hasNextChunk: true,
              incompleteMarkdownComponentMap: { link: 'custom-link-component' },
            },
          },
        },
      });

      expect(result.current).toBe(''); // 实际实现会过滤掉不完整的链接，因为没有提供components

      // Complete the link
      act(() => {
        rerender({
          input: '[link](https://example.com)',
          config: {
            streaming: {
              hasNextChunk: false,
              incompleteMarkdownComponentMap: { link: 'custom-link-component' },
            },
          },
        });
      });
      expect(result.current).toBe('[link](https://example.com)');
    });

    it('should handle complex streaming scenarios', () => {
      const { result, rerender } = renderHook(({ input, config }) => useStreaming(input, config), {
        initialProps: {
          input: '# Title\n\nSome text',
          config: { streaming: { hasNextChunk: true } },
        },
      });

      expect(result.current).toBe('# Title\n\nSome text');

      // Add incomplete elements - incomplete links and images will be filtered out
      act(() => {
        rerender({
          input: '# Title\n\nSome text with [link](https://example and ![image](https://test',
          config: { streaming: { hasNextChunk: true } },
        });
      });
      expect(result.current).toBe('# Title\n\nSome text with ');
    });
  });

  describe('useStreaming URIError handling', () => {
    it('should handle URIError with invalid Unicode characters', () => {
      const { result } = renderHook(() =>
        useStreaming('[test](https://example.com)\uD800\uDFFF', {
          streaming: {
            hasNextChunk: true,
            incompleteMarkdownComponentMap: { link: 'incomplete-link' },
          },
          components: {
            'incomplete-link': () => null,
          },
        }),
      );

      expect(result.current).toBeDefined();
      expect(typeof result.current).toBe('string');
    });

    it('should handle lone surrogate pairs', () => {
      const { result } = renderHook(() =>
        useStreaming('[test](https://example.com)\uD800', {
          streaming: {
            hasNextChunk: true,
            incompleteMarkdownComponentMap: { link: 'incomplete-link' },
          },
          components: {
            'incomplete-link': () => null,
          },
        }),
      );

      expect(result.current).toBeDefined();
    });

    it('should handle invalid surrogate pairs', () => {
      const { result } = renderHook(() =>
        useStreaming('[test](https://example.com)\uDFFF\uD800', {
          streaming: {
            hasNextChunk: true,
            incompleteMarkdownComponentMap: { link: 'incomplete-link' },
          },
          components: {
            'incomplete-link': () => null,
          },
        }),
      );

      expect(result.current).toBeDefined();
    });

    it('should handle mixed valid and invalid Unicode', () => {
      const { result } = renderHook(() =>
        useStreaming('[test](https://example.com)正常文本\uD800\uDFFF更多文本', {
          streaming: {
            hasNextChunk: true,
            incompleteMarkdownComponentMap: { link: 'incomplete-link' },
          },
          components: {
            'incomplete-link': () => null,
          },
        }),
      );

      expect(result.current).toBeDefined();
    });

    it('should handle empty string with invalid Unicode', () => {
      const { result } = renderHook(() =>
        useStreaming('\uD800\uDFFF', {
          streaming: {
            hasNextChunk: true,
            incompleteMarkdownComponentMap: { link: 'incomplete-link' },
          },
          components: {
            'incomplete-link': () => null,
          },
        }),
      );

      expect(result.current).toBeDefined();
      expect(typeof result.current).toBe('string');
    });

    it('should handle only invalid Unicode characters', () => {
      const { result } = renderHook(() =>
        useStreaming('\uD800\uDFFF\uD800\uDFFF', {
          streaming: {
            hasNextChunk: true,
            incompleteMarkdownComponentMap: { link: 'incomplete-link' },
          },
          components: {
            'incomplete-link': () => null,
          },
        }),
      );

      expect(result.current).toBeDefined();
      expect(typeof result.current).toBe('string');
    });

    it('should handle incomplete markdown with invalid Unicode', () => {
      const { result } = renderHook(() =>
        useStreaming('[incomplete link](https://example\uD800\uDFFF', {
          streaming: {
            hasNextChunk: true,
            incompleteMarkdownComponentMap: { link: 'incomplete-link' },
          },
          components: {
            'incomplete-link': () => null,
          },
        }),
      );

      expect(result.current).toBeDefined();
      expect(result.current).toContain('incomplete-link');
    });

    it('should handle lone high surrogate at end of incomplete markdown', () => {
      const { result } = renderHook(() =>
        useStreaming('[incomplete link](https://example.com\uD800', {
          streaming: {
            hasNextChunk: true,
            incompleteMarkdownComponentMap: { link: 'incomplete-link' },
          },
          components: {
            'incomplete-link': () => null,
          },
        }),
      );

      expect(result.current).toBeDefined();
      expect(result.current).toContain('incomplete-link');
    });

    it('should handle lone low surrogate at end of incomplete markdown', () => {
      const { result } = renderHook(() =>
        useStreaming('[incomplete link](https://example.com\uDFFF', {
          streaming: {
            hasNextChunk: true,
            incompleteMarkdownComponentMap: { link: 'incomplete-link' },
          },
          components: {
            'incomplete-link': () => null,
          },
        }),
      );

      expect(result.current).toBeDefined();
      expect(result.current).toContain('incomplete-link');
    });

    it('should handle multiple consecutive lone surrogates', () => {
      const { result } = renderHook(() =>
        useStreaming('[incomplete link](https://example.com\uD800\uD800\uDFFF\uDFFF', {
          streaming: {
            hasNextChunk: true,
            incompleteMarkdownComponentMap: { link: 'incomplete-link' },
          },
          components: {
            'incomplete-link': () => null,
          },
        }),
      );

      expect(result.current).toBeDefined();
      expect(result.current).toContain('incomplete-link');
    });

    it('should handle incomplete markdown with only lone high surrogate', () => {
      const { result } = renderHook(() =>
        useStreaming('\uD800', {
          streaming: {
            hasNextChunk: true,
            incompleteMarkdownComponentMap: { link: 'incomplete-link' },
          },
          components: {
            'incomplete-link': () => null,
          },
        }),
      );

      expect(result.current).toBeDefined();
      expect(typeof result.current).toBe('string');
    });

    it('should handle incomplete markdown with only lone low surrogate', () => {
      const { result } = renderHook(() =>
        useStreaming('\uDFFF', {
          streaming: {
            hasNextChunk: true,
            incompleteMarkdownComponentMap: { link: 'incomplete-link' },
          },
          components: {
            'incomplete-link': () => null,
          },
        }),
      );

      expect(result.current).toBeDefined();
      expect(typeof result.current).toBe('string');
    });
  });

  describe('useStreaming cache reset and state management', () => {
    it('should reset cache when input does not continue from previous state', () => {
      const { result, rerender } = renderHook(({ input, config }) => useStreaming(input, config), {
        initialProps: {
          input: 'Hello world',
          config: { streaming: { hasNextChunk: true } },
        },
      });

      expect(result.current).toBe('Hello world');

      // 输入完全不连续，应该重置缓存
      act(() => {
        rerender({
          input: 'Completely new content',
          config: { streaming: { hasNextChunk: true } },
        });
      });
      expect(result.current).toBe('Completely new content');
    });

    it('should maintain cache when input continues from previous state', () => {
      const { result, rerender } = renderHook(({ input, config }) => useStreaming(input, config), {
        initialProps: {
          input: 'Hello',
          config: { streaming: { hasNextChunk: true } },
        },
      });

      expect(result.current).toBe('Hello');

      // 输入是之前内容的延续，应该保持缓存
      act(() => {
        rerender({
          input: 'Hello world',
          config: { streaming: { hasNextChunk: true } },
        });
      });
      expect(result.current).toBe('Hello world');
    });

    it('should handle rapid input changes with cache reset', () => {
      const { result, rerender } = renderHook(({ input, config }) => useStreaming(input, config), {
        initialProps: {
          input: 'First content',
          config: { streaming: { hasNextChunk: true } },
        },
      });

      expect(result.current).toBe('First content');

      // 快速切换到不相关的输入
      act(() => {
        rerender({
          input: 'First \n\n content',
          config: { streaming: { hasNextChunk: true } },
        });
      });
      expect(result.current).toBe('First \n\n content');

      // 再次快速切换
      act(() => {
        rerender({
          input: 'Third completely different',
          config: { streaming: { hasNextChunk: true } },
        });
      });
      expect(result.current).toBe('Third completely different');
    });

    it('should handle partial prefix matching edge cases', () => {
      const { result, rerender } = renderHook(({ input, config }) => useStreaming(input, config), {
        initialProps: {
          input: 'Hello',
          config: { streaming: { hasNextChunk: true } },
        },
      });

      expect(result.current).toBe('Hello');

      // 测试部分匹配的情况
      act(() => {
        rerender({
          input: 'Hell', // 比之前的短，应该重置
          config: { streaming: { hasNextChunk: true } },
        });
      });
      expect(result.current).toBe('Hell');
    });

    it('should handle empty string transitions correctly', () => {
      const { result, rerender } = renderHook(({ input, config }) => useStreaming(input, config), {
        initialProps: {
          input: 'Some content',
          config: { streaming: { hasNextChunk: true } },
        },
      });

      expect(result.current).toBe('Some content');

      // 切换到空字符串
      act(() => {
        rerender({
          input: '',
          config: { streaming: { hasNextChunk: true } },
        });
      });
      expect(result.current).toBe('');
    });

    it('should handle streaming state transitions with incomplete elements', () => {
      const { result, rerender } = renderHook(({ input, config }) => useStreaming(input, config), {
        initialProps: {
          input: 'Start with ',
          config: { streaming: { hasNextChunk: true } },
        },
      });

      expect(result.current).toBe('Start with ');

      // 添加不完整的链接，应该被过滤
      act(() => {
        rerender({
          input: 'Start with [incomplete',
          config: { streaming: { hasNextChunk: true } },
        });
      });
      expect(result.current).toBe('Start with ');

      // 完全改变输入，应该重置并显示新内容
      act(() => {
        rerender({
          input: 'New content completely',
          config: { streaming: { hasNextChunk: true } },
        });
      });
      expect(result.current).toBe('New content completely');
    });
  });

  describe('useStreaming long single-line content (base64 images)', () => {
    it('should stream a large base64 image without quadratic slowdown', () => {
      const base64 = 'A'.repeat(300_000);
      const full = `Here is an image:\n\n![chart](data:image/png;base64,${base64})\n\nDone.`;
      const chunkSize = 1000;

      const { result, rerender } = renderHook(({ input, config }) => useStreaming(input, config), {
        initialProps: {
          input: '',
          config: { streaming: { hasNextChunk: true } },
        },
      });

      const start = performance.now();
      for (let end = chunkSize; end < full.length + chunkSize; end += chunkSize) {
        act(() => {
          rerender({
            input: full.slice(0, end),
            config: { streaming: { hasNextChunk: true } },
          });
        });
      }
      const elapsed = performance.now() - start;

      expect(result.current).toBe(full);
      expect(elapsed).toBeLessThan(3000);
    }, 120_000);

    it('should keep fence state correct when a code block follows long content', () => {
      const base64 = 'B'.repeat(20_000);
      const full = `![img](data:image/png;base64,${base64})\n\n\`\`\`js\nconst a = 1;\n`;

      const { result, rerender } = renderHook(({ input, config }) => useStreaming(input, config), {
        initialProps: {
          input: full.slice(0, 100),
          config: { streaming: { hasNextChunk: true } },
        },
      });

      act(() => {
        rerender({ input: full, config: { streaming: { hasNextChunk: true } } });
      });

      // Inside an open fence every char is committed as-is (no token recognition)
      expect(result.current).toBe(full);
    });
  });

  describe('useStreaming incremental table state', () => {
    /** Feed one character at a time, staying in streaming mode, and keep every output. */
    const stream = (text: string) => {
      const outputs: string[] = [];
      const { result, rerender } = renderHook(
        ({ input }: { input: string }) => useStreaming(input, { streaming: { hasNextChunk: true } }),
        { initialProps: { input: '' } },
      );

      for (let i = 1; i <= text.length; i++) {
        act(() => {
          rerender({ input: text.slice(0, i) });
        });
        outputs.push(result.current);
      }

      // Indexed by prefix so each assertion names the state it pins.
      return { outputs, at: (prefix: string) => outputs[prefix.length - 1] };
    };

    it('should hold a table back until its delimiter row is terminated', () => {
      const text = '| H1 | H2 |\n| --- | --- |\n| a | b |\n\nnext paragraph';
      const { outputs, at } = stream(text);

      // Header only, and header plus an unterminated delimiter row, are both
      // still incomplete, so nothing is emitted yet.
      expect(at('| H1 | H2 |')).toBe('');
      expect(at('| H1 | H2 |\n| --- | --- |')).toBe('');
      // Once the delimiter row ends the table has more than two lines and is
      // emitted as-is rather than replaced by a placeholder.
      expect(at('| H1 | H2 |\n| --- | --- |\n')).toBe('| H1 | H2 |\n| --- | --- |\n');
      // The blank line releases the token; the paragraph after it streams normally.
      expect(outputs[outputs.length - 1]).toBe(text);
    });

    it('should start a fresh table after the previous one ended', () => {
      const text =
        '| H1 | H2 |\n| --- | --- |\n| a | b |\n\n| H3 | H4 |\n| --- | --- |\n| c | d |';
      const { outputs, at } = stream(text);
      const firstTable = '| H1 | H2 |\n| --- | --- |\n| a | b |\n\n';

      // The second table's header is held back on its own, which only works if
      // the state was reset when the first table committed.
      expect(at(`${firstTable}| H3 | H4 |`)).toBe(firstTable);
      expect(outputs[outputs.length - 1]).toBe(text);
    });

    it('should not treat a pipe table inside a fenced code block as a table', () => {
      const text = '```\n| H1 | H2 |\n| --- | --- |\n| a | b |\n```\n';
      const { outputs, at } = stream(text);

      // Inside a fence every character is committed as-is, so nothing is held back.
      expect(at('```\n| H1 | H2 |')).toBe('```\n| H1 | H2 |');
      expect(outputs[outputs.length - 1]).toBe(text);
    });

    it('should keep the delimiter verdict frozen once that row is terminated', () => {
      const text = '| H1 | H2 |\n| --- | --- |\n| a-b | c---d |\n| --- | --- |\n\n';
      const { outputs, at } = stream(text);
      const upToSecondDelimiter = '| H1 | H2 |\n| --- | --- |\n| a-b | c---d |\n| --- | --- |';

      // A later row full of pipes and dashes must not re-open the verdict.
      expect(at(upToSecondDelimiter)).toBe(upToSecondDelimiter);
      expect(outputs[outputs.length - 1]).toBe(text);
    });

    it('should commit immediately once the delimiter row is known to be invalid', () => {
      const text = '| H1 | H2 |\n| xx | yy |\n';
      const { outputs, at } = stream(text);

      expect(at('| H1 | H2 |')).toBe('');
      // `| x` cannot be a delimiter row, so the table token is given up and the
      // text flows through from that character on.
      expect(at('| H1 | H2 |\n| x')).toBe('| H1 | H2 |\n| x');
      // The trailing `| yy |` opens a new pending table, so it is still held
      // back while the stream is open.
      expect(outputs[outputs.length - 1]).toBe('| H1 | H2 |\n| xx ');
    });

    it('should stay linear on a long table', () => {
      // The table token is held until its terminating blank line, so a full
      // re-scan of the pending buffer per character would be O(N²) here — the
      // same trap the fenced-code-block state already avoids.
      const rows = Array.from({ length: 2000 }, (_, i) => `| key${i} | value${i} |`).join('\n');
      const full = `| H1 | H2 |\n| --- | --- |\n${rows}\n\ntail`;

      const { result, rerender } = renderHook(({ input, config }) => useStreaming(input, config), {
        initialProps: {
          input: full.slice(0, 100),
          config: { streaming: { hasNextChunk: true } },
        },
      });

      act(() => {
        rerender({ input: full, config: { streaming: { hasNextChunk: true } } });
      });

      expect(result.current).toBe(full);
    });
  });

  describe("useStreaming incompleteMarkdown: 'complete'", () => {
    const streamWith = (
      text: string,
      streaming: NonNullable<XMarkdownProps['streaming']>,
      components?: XMarkdownProps['components'],
    ) => {
      const outputs: string[] = [];
      const { result, rerender } = renderHook(
        ({ input }: { input: string }) =>
          useStreaming(input, { streaming: { hasNextChunk: true, ...streaming }, components }),
        { initialProps: { input: '' } },
      );
      for (let i = 1; i <= text.length; i++) {
        act(() => {
          rerender({ input: text.slice(0, i) });
        });
        outputs.push(result.current);
      }
      return { outputs, at: (prefix: string) => outputs[prefix.length - 1] };
    };
    const complete = (text: string, components?: XMarkdownProps['components']) =>
      streamWith(text, { incompleteMarkdown: 'complete' }, components);

    it('closes emphasis that is still open, keeping trailing whitespace outside', () => {
      const { at } = complete('see **bold and more** end');
      expect(at('see **bold')).toBe('see **bold**');
      expect(at('see **bold and ')).toBe('see **bold and** ');
      expect(at('see **bold and more**')).toBe('see **bold and more**');
      expect(at('see **')).toBe('see ');
      expect(complete('a *em').at('a *em')).toBe('a *em*');
      expect(complete('a ___x').at('a ___x')).toBe('a ___x___');
    });

    it('closes inline code that is still open', () => {
      const { at } = complete('run `npm i` now');
      expect(at('run `npm')).toBe('run `npm`');
      expect(at('run `')).toBe('run ');
      expect(at('run `npm i`')).toBe('run `npm i`');
    });

    it('shows the text of a link that is still open', () => {
      const { at } = complete('see [docs](https://x.ant.design) now');
      expect(at('see [do')).toBe('see do');
      expect(at('see [docs](https://x')).toBe('see docs');
      expect(at('see [')).toBe('see ');
      expect(at('see [docs](https://x.ant.design)')).toBe('see [docs](https://x.ant.design)');
    });

    it('completes emphasis inside a list item that is still open', () => {
      const { at } = complete('- **bo');
      expect(at('- ')).toBe('');
      expect(at('- **bo')).toBe('- **bo**');
    });

    it('still holds back images, html and single-row tables', () => {
      expect(complete('![alt](https://x').at('![alt](https://x')).toBe('');
      expect(complete('<div class="a').at('<div class="a')).toBe('');
      expect(complete('| a | b |').at('| a | b |')).toBe('');
      // …while a table with a terminated delimiter row flows through as before.
      expect(complete('| a |\n| - |\n| 1 ').at('| a |\n| - |\n| 1 ')).toBe('| a |\n| - |\n| 1 ');
    });

    it('lets an explicit incompleteMarkdownComponentMap entry win over completion', () => {
      const components = { 'my-emphasis': () => null };
      const { at } = streamWith(
        'see **bold',
        { incompleteMarkdown: 'complete', incompleteMarkdownComponentMap: { emphasis: 'my-emphasis' } },
        components,
      );
      expect(at('see **bold')).toBe('see <my-emphasis data-raw="**bold" />');
      // A token without an entry is still completed.
      expect(complete('run `npm', components).at('run `npm')).toBe('run `npm`');
    });

    it('leaves placeholder mode untouched by default', () => {
      expect(streamWith('see **bold', {}).at('see **bold')).toBe('see ');
      expect(streamWith('see **bold', { incompleteMarkdown: 'placeholder' }).at('see **bold')).toBe(
        'see ',
      );
    });

    it('renders the completed token', () => {
      const { container } = render(
        <XMarkdownProbe content="a **b" streaming={{ hasNextChunk: true, incompleteMarkdown: 'complete' }} />,
      );
      expect(container.innerHTML).toContain('<strong>b</strong>');
    });
  });

  describe('useStreaming synchronous output', () => {
    const streamingConfig = { streaming: { hasNextChunk: true } };

    it('should expose the processed output in the same render the chunk arrives in', () => {
      // Recording every render (not just the settled value) proves there is no
      // intermediate frame that still shows the previous chunk.
      const frames: string[] = [];
      const Probe = ({ input }: { input: string }) => {
        frames.push(useStreaming(input, streamingConfig));
        return null;
      };

      const { rerender } = render(<Probe input="Hello" />);
      act(() => {
        rerender(<Probe input="Hello [link](https://x" />);
      });
      act(() => {
        rerender(<Probe input="Hello [link](https://x.ant.design)" />);
      });

      expect(frames).toEqual(['Hello', 'Hello ', 'Hello [link](https://x.ant.design)']);
    });

    it('should produce the same output under StrictMode double rendering', () => {
      const text = 'a **bold** `code` [l](https://x) | h |\n| - |\n| c |\n\nend';

      const collect = (strict: boolean) => {
        const outputs: string[] = [];
        const Probe = ({ input }: { input: string }) => {
          outputs.push(useStreaming(input, streamingConfig));
          return null;
        };
        const wrap = (node: React.ReactElement) =>
          strict ? <React.StrictMode>{node}</React.StrictMode> : node;
        const { rerender } = render(wrap(<Probe input="" />));
        for (let i = 1; i <= text.length; i++) {
          act(() => {
            rerender(wrap(<Probe input={text.slice(0, i)} />));
          });
        }
        // Under StrictMode each commit renders twice; only the last value per
        // commit is observable, and it must match the non-strict run.
        return outputs;
      };

      const plain = collect(false);
      const strict = collect(true);
      expect(new Set(strict)).toEqual(new Set(plain));
      expect(strict[strict.length - 1]).toBe(plain[plain.length - 1]);
    });
  });
});
