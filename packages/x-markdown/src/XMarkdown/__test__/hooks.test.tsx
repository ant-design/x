import { render, renderHook } from '@testing-library/react';
import React from 'react';
import { useAnimation, useStreaming } from '../hooks';
import { XMarkdownProps } from '../interface';

const testCases = [
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
    title: 'incomplete image',
    input: '![alt text](https',
    output: '<incomplete-image />',
    config: { hasNextChunk: true },
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
    output: '![',
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
    output: '',
  },
  {
    title: 'heading3',
    input: '###',
    output: '',
  },
  {
    title: 'heading with space',
    input: '# ',
    output: '# ',
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
    output: '',
  },
  {
    title: 'complete Html',
    input: '<div></div>',
    output: '<div></div>',
  },
  {
    title: 'invalid Html',
    input: '<divvvv',
    output: '',
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
    output: '',
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
    title: 'incomplete hr -',
    input: '--',
    output: '',
  },
  {
    title: 'complete hr -',
    input: '---\n',
    output: '---\n',
  },
  {
    title: 'incomplete hr =',
    input: '==',
    output: '',
  },
  {
    title: 'complete hr =',
    input: '===\n',
    output: '===\n',
  },
];

const placeholderMapTestCases = [
  {
    title: 'incomplete link with custom component',
    input: '[ant design x](https',
    output: 'incomplete-link',
    config: { hasNextChunk: true },
  },
  {
    title: 'incomplete image with custom component',
    input: '![alt text](https',
    output: 'incomplete-image',
    config: { hasNextChunk: true },
  },
  {
    title: 'incomplete link with custom component',
    input: '[ant design x](https',
    output: 'custom-link-placeholder',
    config: {
      hasNextChunk: true,
      incompleteMarkdownComponentMap: { link: 'custom-link-placeholder' },
    },
  },
  {
    title: 'incomplete image with custom component',
    input: '![alt text](https',
    output: 'custom-image-placeholder',
    config: {
      hasNextChunk: true,
      incompleteMarkdownComponentMap: { image: 'custom-image-placeholder' },
    },
  },
  {
    title: 'incomplete link and image with custom components',
    input: '[link](https',
    output: 'custom-link-placeholder',
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
];

const fencedCodeTestCases = [
  {
    title: 'incomplete link in fenced code block should not be replaced',
    input: '```markdown\nThis is a [link](https://example.com that is incomplete\n```',
    output: '```markdown\nThis is a [link](https://example.com that is incomplete\n```',
    config: { hasNextChunk: true },
  },
  {
    title: 'incomplete image in fenced code block should not be replaced',
    input: '```markdown\n![alt text](https://example.com/image.jpg\n```',
    output: '```markdown\n![alt text](https://example.com/image.jpg\n```',
    config: { hasNextChunk: true },
  },
  {
    title: 'incomplete link and image in fenced code block should not be replaced',
    input: '```\n[link](https://example.com and ![img](src.png\n```',
    output: '```\n[link](https://example.com and ![img](src.png\n```',
    config: { hasNextChunk: true },
  },
  {
    title: 'incomplete link outside fenced code block should be replaced',
    input: 'Here is a [link](https://example.com',
    output: 'Here is a <incomplete-link />',
    config: { hasNextChunk: true },
  },
  {
    title: 'complete fenced code block with incomplete markdown inside',
    input:
      '```js\nconst link = "[incomplete](https://example.com";\nconst img = "![alt](https://example.com/image.jpg";\n```',
    output:
      '```js\nconst link = "[incomplete](https://example.com";\nconst img = "![alt](https://example.com/image.jpg";\n```',
    config: { hasNextChunk: true },
  },
  {
    title: 'incomplete fenced code block should not process content',
    input: '```markdown\nSome content with [incomplete link](https://example',
    output: '```markdown\nSome content with [incomplete link](https://example',
    config: { hasNextChunk: true },
  },
  {
    title: 'multiple fenced code blocks',
    input:
      '```js\nconsole.log("[link](https://example.com");\n```\n\nSome text\n\n```python\n# ![image](https://example.com/image.jpg\nprint("hello")\n```',
    output:
      '```js\nconsole.log("[link](https://example.com");\n```\n\nSome text\n\n```python\n# ![image](https://example.com/image.jpg\nprint("hello")\n```',
    config: { hasNextChunk: true },
  },
];

const streamingStateTestCases = [
  {
    title: 'streaming state reset when input changes completely',
    input: 'Hello world',
    output: 'Hello world',
    config: { hasNextChunk: true },
  },
  {
    title: 'streaming state continues when input extends',
    input: '[incomplete link](https://example',
    output: '<incomplete-link />',
    config: { hasNextChunk: true },
  },
  {
    title: 'empty input should reset state',
    input: '',
    output: '',
    config: { hasNextChunk: true },
  },
  {
    title: 'streaming with hasNextChunk false should show full content',
    input: '[incomplete link](https://example',
    output: '[incomplete link](https://example',
    config: { hasNextChunk: false },
  },
];

const complexMarkdownTestCases = [
  {
    title: 'mixed markdown elements with incomplete parts',
    input: '# Heading\n\nThis is a paragraph with [incomplete link](https://example',
    output: '# Heading\n\nThis is a paragraph with [incomplete link](https://example',
    config: { hasNextChunk: true },
  },
  {
    title: 'nested markdown structures',
    input: '## Subheading\n\nText with *italic* and **bold** and ***both***.',
    output: '## Subheading\n\nText with *italic* and **bold** and ***both***.',
    config: { hasNextChunk: true },
  },
];

const edgeCaseTestCases = [
  {
    title: 'very long incomplete link',
    input:
      '[very long link text that goes on and on](https://very-long-url-that-continues-forever-and-ever-until-it-becomes-unbearably-long',
    output: '<incomplete-link />',
    config: { hasNextChunk: true },
  },
  {
    title: 'multiple incomplete elements in sequence',
    input: '[link1](https://example1',
    output: '<incomplete-link />',
    config: { hasNextChunk: true },
  },
  {
    title: 'incomplete elements at line breaks',
    input: 'Text before\n[link](https://example',
    output: 'Text before\n<incomplete-link />',
    config: { hasNextChunk: true },
  },
  {
    title: 'special characters in incomplete elements',
    input: '[link with special chars: !@#$%^&*()](https://example.com/path?param=value&other=test',
    output: '<incomplete-link />',
    config: { hasNextChunk: true },
  },
  {
    title: 'unicode characters in markdown',
    input: '[中文链接](https://例子.测试',
    output: '<incomplete-link />',
    config: { hasNextChunk: true },
  },
];

type TestCase = {
  title: string;
  input: any;
  output: string;
  config?: XMarkdownProps['streaming'];
};

const TestComponent = ({
  input,
  config,
}: {
  input: string;
  config?: XMarkdownProps['streaming'];
}) => {
  const result = useStreaming(input, config);
  return <div>{result}</div>;
};

describe('XMarkdown hooks', () => {
  testCases.forEach(({ title, input, output, config }: TestCase) => {
    it(`useStreaming testcase: ${title}`, () => {
      const { container } = render(
        <TestComponent input={input} config={config || { hasNextChunk: true }} />,
      );
      expect(container.textContent).toBe(output);
    });
  });

  placeholderMapTestCases.forEach(({ title, input, output, config }) => {
    it(`useStreaming incompleteMarkdownComponentMap testcase: ${title}`, () => {
      const { container } = render(
        <TestComponent input={input} config={config || { hasNextChunk: true }} />,
      );
      expect(container.textContent).toContain(output);
    });
  });

  fencedCodeTestCases.forEach(({ title, input, output, config }) => {
    it(`useStreaming fenced code block testcase: ${title}`, () => {
      const { container } = render(
        <TestComponent input={input} config={config || { hasNextChunk: true }} />,
      );
      expect(container.textContent).toBe(output);
    });
  });

  streamingStateTestCases.forEach(({ title, input, output, config }) => {
    it(`useStreaming streaming state testcase: ${title}`, () => {
      const { container } = render(
        <TestComponent input={input} config={config || { hasNextChunk: true }} />,
      );
      expect(container.textContent).toBe(output);
    });
  });

  complexMarkdownTestCases.forEach(({ title, input, output, config }) => {
    it(`useStreaming complex markdown testcase: ${title}`, () => {
      const { container } = render(
        <TestComponent input={input} config={config || { hasNextChunk: true }} />,
      );
      expect(container.textContent).toBe(output);
    });
  });

  edgeCaseTestCases.forEach(({ title, input, output, config }) => {
    it(`useStreaming edge case testcase: ${title}`, () => {
      const { container } = render(
        <TestComponent input={input} config={config || { hasNextChunk: true }} />,
      );
      expect(container.textContent).toBe(output);
    });
  });

  it('useAnimation should return empty object when streaming is not enabled', () => {
    const { result } = renderHook(() => useAnimation(undefined));
    expect(result.current).toEqual({});
  });

  it('useAnimation should return empty object when enableAnimation is false', () => {
    const { result } = renderHook(() => useAnimation({ enableAnimation: false }));
    expect(result.current).toEqual({});
  });

  it('useAnimation should memoize components based on animationConfig', () => {
    const animationConfig = { fadeDuration: 1000 };
    const { result, rerender } = renderHook(
      ({ config }) => useAnimation({ enableAnimation: true, animationConfig: config }),
      { initialProps: { config: animationConfig } },
    );

    const firstResult = result.current;
    rerender({ config: { ...animationConfig } }); // Same config
    expect(result.current).toBe(firstResult);

    rerender({ config: { fadeDuration: 2000 } }); // Different config
    expect(result.current).not.toBe(firstResult);
  });

  it('should handle streaming chunk by chunk', () => {
    const { result, rerender } = renderHook(({ input, config }) => useStreaming(input, config), {
      initialProps: {
        input: 'Hello',
        config: { hasNextChunk: true },
      },
    });

    expect(result.current).toBe('Hello');

    // Simulate streaming more content
    rerender({
      input: 'Hello world',
      config: { hasNextChunk: true },
    });
    expect(result.current).toBe('Hello world');

    // Simulate streaming incomplete markdown
    rerender({
      input: 'Hello world with [incomplete link](https://example',
      config: { hasNextChunk: true },
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
    rerender({
      input: 'Completely different',
      config: { hasNextChunk: true },
    });
    expect(result.current).toBe('Completely different');
  });

  it('should handle non-string input gracefully', () => {
    const { result } = renderHook(() => useStreaming(null as any, { hasNextChunk: true }));
    expect(result.current).toBe('');

    const { result: result2 } = renderHook(() =>
      useStreaming(undefined as any, { hasNextChunk: true }),
    );
    expect(result2.current).toBe('');

    const { result: result3 } = renderHook(() => useStreaming(123 as any, { hasNextChunk: true }));
    expect(result3.current).toBe('');
  });
});
