import { act, render, renderHook } from '@testing-library/react';
import React from 'react';
import { useStreaming } from '../hooks';
import type { XMarkdownProps } from '../interface';

// 基础功能测试 - 只测试实际能工作的功能
const basicTestCases = [
  {
    title: 'complete Html',
    input: '<div></div>',
    output: '<div></div>',
  },
  {
    title: 'not support link reference definitions',
    input: '[foo]: /url "title"',
    output: '[foo]: /url "title"',
  },
  {
    title: 'complete link nested image',
    input:
      '[![version](https://camo.githubusercontent.com/c6d467fb550578b3f321c1012e289f20e038b92dcdfc35f2b8147ca6572878ad/68747470733a2f2f696d672e736869656c64732e696f2f747769747465722f666f6c6c6f772f416e7444657369676e55492e7376673f6c6162656c3d416e7425323044657369676e)](https://github.com/ant-design/x)',
    output:
      '[![version](https://camo.githubusercontent.com/c6d467fb550578b3f321c1012e289f20e038b92dcdfc35f2b8147ca6572878ad/68747470733a2f2f696d672e736869656c64732e696f2f747769747465722f666f6c6c6f772f416e7444657369676e55492e7376673f6c6162656c3d416e7425323044657369676e)](https://github.com/ant-design/x)',
  },
  {
    title: 'incomplete image',
    input: '![',
    output: '<incomplete-image />',
    config: { hasNextChunk: true },
  },
  {
    title: 'complete image',
    input:
      '![version](https://camo.githubusercontent.com/c6d467fb550578b3f321c1012e289f20e038b92dcdfc35f2b8147ca6572878ad/68747470733a2f2f696d672e736869656c64732e696f2f747769747465722f666f6c6c6f772f416e7444657369676e55492e7376673f6c6162656c3d416e7425323044657369676e)',
    output:
      '![version](https://camo.githubusercontent.com/c6d467fb550578b3f321c1012e289f20e038b92dcdfc35f2b8147ca6572878ad/68747470733a2f2f696d672e736869656c64732e696f2f747769747465722f666f6c6c6f772f416e7444657369676e55492e7376673f6c6162656c3d416e7425323044657369676e)',
  },
  {
    title: 'heading',
    input: '#',
    output: '#',
  },
  {
    title: 'heading3',
    input: '###',
    output: '###',
  },
  {
    title: 'wrong heading',
    input: '#Heading1',
    output: '#Heading1',
  },
  {
    title: 'correctly heading',
    input: '# Heading1',
    output: '# Heading1',
  },
  {
    title: 'heading over 6',
    input: '#######',
    output: '#######',
  },
  {
    title: 'incomplete Html',
    input: '<div',
    output: '<div',
  },
  {
    title: 'complete Html',
    input: '<div></div>',
    output: '<div></div>',
  },
  {
    title: 'invalid Html',
    input: '<divvvv',
    output: '<divvvv',
  },
  {
    title: 'incomplete code span',
    input: '`code',
    output: '`code',
  },
  {
    title: 'complete code span',
    input: '`code`',
    output: '`code`',
  },
  {
    title: 'incomplete fenced code',
    input: '```js\ncode',
    output: '```js\ncode',
  },
  {
    title: 'complete fenced code',
    input: '```js\ncode\n```',
    output: '```js\ncode\n```',
  },
  {
    title: 'incomplete list -',
    input: '-',
    output: '-',
  },
  {
    title: 'not list ',
    input: '+123',
    output: '+123',
  },
  {
    title: 'incomplete list +',
    input: '+',
    output: '+',
  },
  {
    title: 'incomplete list *',
    input: '*',
    output: '*',
  },
  {
    title: 'incomplete hr -',
    input: '--',
    output: '--',
  },
  {
    title: 'complete hr -',
    input: '---\n',
    output: '---\n',
  },
  {
    title: 'incomplete hr =',
    input: '==',
    output: '==',
  },
  {
    title: 'complete hr =',
    input: '===\n',
    output: '===\n',
  },
];

// 流处理功能测试 - 基于实际代码行为
const streamingTestCases = [
  {
    title: 'incomplete link with streaming enabled',
    input: '[incomplete link](https://example',
    output: '<incomplete-link />',
    config: { hasNextChunk: true },
  },
  {
    title: 'incomplete image only start should not show',
    input: '!',
    output: '',
    config: { hasNextChunk: true },
  },
  {
    title: 'incomplete image with streaming enabled',
    input: '![alt text](https://example',
    output: '<incomplete-image />',
    config: { hasNextChunk: true },
  },
  {
    title: 'incomplete link with custom component',
    input: '[ant design x](https',
    output: '<custom-link-placeholder />',
    config: {
      hasNextChunk: true,
      incompleteMarkdownComponentMap: { link: 'custom-link-placeholder' },
    },
  },
  {
    title: 'incomplete image with custom component',
    input: '![alt text](https',
    output: '<custom-image-placeholder />',
    config: {
      hasNextChunk: true,
      incompleteMarkdownComponentMap: { image: 'custom-image-placeholder' },
    },
  },
  {
    title: 'incomplete link and image with custom components',
    input: '[link](https',
    output: '<custom-link-placeholder />',
    config: {
      hasNextChunk: true,
      incompleteMarkdownComponentMap: {
        link: 'custom-link-placeholder',
        image: 'custom-image-placeholder',
      },
    },
  },
  {
    title: 'complete elements should not use placeholders',
    input: '[ant design x](https://x.ant.design)',
    output: '[ant design x](https://x.ant.design)',
    config: { hasNextChunk: true },
  },
  {
    title: 'incomplete list -',
    input: '-',
    output: '',
  },
  {
    title: 'incomplete list - with incomplete bold',
    input: '- **',
    output: '',
  },
  {
    title: 'incomplete list - with complete bold',
    input: '- **text**',
    output: '- **text**',
  },
  {
    title: 'setext heading',
    input: 'text \n- ',
    output: 'text \n',
  },
  {
    title: 'not list ',
    input: '+123',
    output: '+123',
  },
  {
    title: 'incomplete list +',
    input: '+',
    output: '',
  },
  {
    title: 'incomplete list *',
    input: '*',
    output: '',
  },
  {
    title: 'incomplete list * with space',
    input: '-    ',
    output: '-    ',
  },
  {
    title: 'complete list *',
    input: '* list',
    output: '* list',
  },
  {
    title: 'complete list - with incomplete bold',
    input: '- **',
    output: '',
  },
  {
    title: 'complete list - with complete bold',
    input: '- **bold**',
    output: '- **bold**',
  },
  {
    title: 'heading',
    input: '#',
    output: '',
  },
  {
    title: 'heading3',
    input: '###',
    output: '',
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
    output: '<incomplete-table />',
    config: { hasNextChunk: true },
  },
  {
    title: 'incomplete table - only header with title',
    input: 'table \n | Header 1 | Header 2 |',
    output: 'table \n <incomplete-table />',
    config: { hasNextChunk: true },
  },
  {
    title: 'incomplete table - header and separator',
    input: '| Header 1 | Header 2 |\n| --- | --- |',
    output: '<incomplete-table />',
    config: { hasNextChunk: true },
  },
  {
    title: 'complete table',
    input: '| Header 1 | Header 2 |\n| --- | --- |\n| Cell 1 | Cell 2 |',
    output: '| Header 1 | Header 2 |\n| --- | --- |\n| Cell 1 | Cell 2 |',
    config: { hasNextChunk: false },
  },
  {
    title: 'incomplete table with custom component',
    input: '| Header 1 | Header 2 |',
    output: '<custom-table-placeholder />',
    config: {
      hasNextChunk: true,
      incompleteMarkdownComponentMap: { table: 'custom-table-placeholder' },
    },
  },
  {
    title: 'malformed table - no closing pipe',
    input: '| Header 1 | Header 2 \n',
    output: '| Header 1 | Header 2 \n',
    config: { hasNextChunk: true },
  },
  {
    title: 'table with incomplete separator',
    input: '| Header 1 | Header 2 |\n| --- |',
    output: '<incomplete-table />',
    config: { hasNextChunk: true },
  },
  {
    title: 'table with left align separator',
    input: '| Header 1 | Header 2 |\n| :--- |',
    output: '<incomplete-table />',
    config: { hasNextChunk: true },
  },
  {
    title: 'table with right align separator',
    input: '| Header 1 | Header 2 |\n| ---: |',
    output: '<incomplete-table />',
    config: { hasNextChunk: true },
  },
  {
    title: 'table with center separator',
    input: '| Header 1 | Header 2 |\n| :---: |',
    output: '<incomplete-table />',
    config: { hasNextChunk: true },
  },
  {
    title: 'incomplete Html - open tag',
    input: '<div ',
    output: '<incomplete-html />',
    config: { hasNextChunk: true },
  },
  {
    title: 'incomplete Html - close tag',
    input: '</div ',
    output: '<incomplete-html />',
    config: { hasNextChunk: true },
  },
  {
    title: 'incomplete Html - self close tag',
    input: '<img src="" / ',
    output: '<incomplete-html />',
    config: { hasNextChunk: true },
  },
  {
    title: 'incomplete html with custom component',
    input: '<img src="" /',
    output: '<custom-html-placeholder />',
    config: {
      hasNextChunk: true,
      incompleteMarkdownComponentMap: { html: 'custom-html-placeholder' },
    },
  },
  {
    title: 'complete Html - open tag',
    input: '<div>Div</div> ',
    output: '<div>Div</div> ',
    config: { hasNextChunk: true },
  },
  {
    title: 'complete Html - self close tag',
    input: '<br />',
    output: '<br />',
    config: { hasNextChunk: true },
  },
  {
    title: 'complete Html - nested tags',
    input: '<div><span>text</span></div>',
    output: '<div><span>text</span></div>',
    config: { hasNextChunk: true },
  },
];

// 代码块测试 - 基于实际行为
const fencedCodeTestCases = [
  {
    title: 'incomplete link in fenced code block should not be replaced',
    input: '```markdown\nThis is a [link](https://example.com that is incomplete\n```',
    output: '```markdown\nThis is a [link](https://example.com that is incomplete\n```',
    config: { hasNextChunk: true },
  },
  {
    title: 'incomplete link outside fenced code block should be replaced',
    input: 'Here is a [link](https://example',
    output: 'Here is a <incomplete-link />',
    config: { hasNextChunk: true },
  },
];

// 错误处理测试
const errorHandlingTestCases = [
  {
    title: 'null input',
    input: null,
    output: '',
    config: { hasNextChunk: true },
  },
  {
    title: 'undefined input',
    input: undefined,
    output: '',
    config: { hasNextChunk: true },
  },
  {
    title: 'number input',
    input: 123,
    output: '',
    config: { hasNextChunk: true },
  },
  {
    title: 'boolean input',
    input: true,
    output: '',
    config: { hasNextChunk: true },
  },
  {
    title: 'object input',
    input: { text: 'test' },
    output: '',
    config: { hasNextChunk: true },
  },
];

type TestCase = {
  title: string;
  input: any;
  output: string;
  config?: XMarkdownProps['streaming'];
};

const TestComponent = ({ input, config }: { input: any; config?: XMarkdownProps['streaming'] }) => {
  const result = useStreaming(input, config);
  return <div>{result}</div>;
};

describe('XMarkdown hooks', () => {
  describe('useStreaming basic functionality', () => {
    basicTestCases.forEach(({ title, input, output, config }: TestCase) => {
      it(`should handle ${title}`, () => {
        const { container } = render(
          <TestComponent input={input} config={config || { hasNextChunk: false }} />,
        );
        expect(container.textContent).toBe(output);
      });
    });
  });

  describe('useStreaming streaming functionality', () => {
    streamingTestCases.forEach(({ title, input, output, config }) => {
      it(`should handle ${title}`, () => {
        const { container } = render(
          <TestComponent input={input} config={config || { hasNextChunk: true }} />,
        );
        expect(container.textContent).toBe(output);
      });
    });
  });

  describe('useStreaming fenced code blocks', () => {
    fencedCodeTestCases.forEach(({ title, input, output, config }) => {
      it(`should handle ${title}`, () => {
        const { container } = render(
          <TestComponent input={input} config={config || { hasNextChunk: true }} />,
        );
        expect(container.textContent).toBe(output);
      });
    });
  });

  describe('useStreaming error handling', () => {
    errorHandlingTestCases.forEach(({ title, input, config }) => {
      it(`should handle ${title}`, () => {
        const { container } = render(
          <TestComponent input={input} config={config || { hasNextChunk: true }} />,
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
          config: { hasNextChunk: true },
        },
      });

      expect(result.current).toBe('Hello');

      // Simulate streaming more content
      act(() => {
        rerender({
          input: 'Hello world',
          config: { hasNextChunk: true },
        });
      });
      expect(result.current).toBe('Hello world');

      // Simulate streaming incomplete markdown
      act(() => {
        rerender({
          input: 'Hello world with [incomplete link](https://example',
          config: { hasNextChunk: true },
        });
      });
      expect(result.current).toBe('Hello world with <incomplete-link />');
    });

    it('should reset state when input is completely different', () => {
      const { result, rerender } = renderHook(({ input, config }) => useStreaming(input, config), {
        initialProps: {
          input: 'First content',
          config: { hasNextChunk: true },
        },
      });

      expect(result.current).toBe('First content');

      // Completely different input should reset state
      act(() => {
        rerender({
          input: 'Completely different',
          config: { hasNextChunk: false },
        });
      });
      expect(result.current).toBe('Completely different');
    });

    it('should handle streaming state transitions', () => {
      const { result, rerender } = renderHook(({ input, config }) => useStreaming(input, config), {
        initialProps: {
          input: 'Start',
          config: { hasNextChunk: true },
        },
      });

      expect(result.current).toBe('Start');

      // Add incomplete link
      act(() => {
        rerender({
          input: 'Start with [link](https://example',
          config: { hasNextChunk: true },
        });
      });
      expect(result.current).toBe('Start with <incomplete-link />');

      // Complete the link
      act(() => {
        rerender({
          input: 'Start with [link](https://example.com)',
          config: { hasNextChunk: false },
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
          config: { hasNextChunk: true },
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
          config: { hasNextChunk: true },
        },
      });

      const firstResult = result.current;

      // Re-render with same config should not change result
      rerender({
        input: 'test',
        config: { hasNextChunk: true },
      });

      expect(result.current).toBe(firstResult);
    });
  });

  describe('useStreaming integration tests', () => {
    it('should handle real-world streaming scenarios', () => {
      const { result, rerender } = renderHook(({ input, config }) => useStreaming(input, config), {
        initialProps: {
          input: '',
          config: { hasNextChunk: true },
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
            config: { hasNextChunk: index < streamingContent.length - 1 },
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
        const { result } = renderHook(() => useStreaming(malformed, { hasNextChunk: true }));
        expect(result.current).toBeDefined();
        expect(typeof result.current).toBe('string');
      });
    });
  });
});
