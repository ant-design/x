import { render } from '@testing-library/react';
import React from 'react';
import { useStreaming } from '../hooks';
import { XMarkdownProps } from '../interface';

const testCases = [
  {
    title: 'not string',
    input: {},
    output: '',
  },
  {
    title: 'complete link',
    input: '[ant design x](https://x.ant.design/index-cn)',
    output: '[ant design x](https://x.ant.design/index-cn)',
  },
  {
    title: 'incomplete link',
    input: '[ant design x](https',
    output: '',
  },
  {
    title: 'not support link reference definitions',
    input: '[foo]: /url "title"',
    output: '[foo]: /url "title"',
  },
  {
    title: 'incomplete link nested image',
    input:
      '[![version](https://camo.githubusercontent.com/c6d467fb550578b3f321c1012e289f20e038b92dcdfc35f2b8147ca6572878ad/68747470733a2f2f696d672e736869656c64732e696f2f747769747465722f666f6c6c6f772f416e7444657369676e55492e7376673f6c6162656c3d416e7425323044657369676e)](https://github.com/ant-design/x',
    output: '',
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
    output: '',
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
    title: 'incomplete emphasis',
    input: '*emphasis',
    output: '',
  },
  {
    title: 'incomplete emphasis with \n',
    input: '*emphasis\n',
    output: '*emphasis\n',
  },
  {
    title: 'complete emphasis',
    input: '*emphasis*',
    output: '*emphasis*',
  },
  {
    title: 'incomplete strong',
    input: '**strong',
    output: '',
  },
  {
    title: 'complete strong',
    input: '**strong**',
    output: '**strong**',
  },
  {
    title: 'incomplete strong with \n',
    input: '**strong\n',
    output: '**strong\n',
  },
  {
    title: 'incomplete strong emphasis',
    input: '***strong emph**',
    output: '',
  },
  {
    title: 'incomplete strong emphasis and hasNext is false',
    input: '***strong emph**',
    output: '***strong emph**',
    config: { hasNextChunk: false },
  },
  {
    title: 'complete strong emphasis',
    input: '***strong emph***',
    output: '***strong emph***',
  },
  {
    title: '* is hr',
    input: '***\n',
    output: '***\n',
  },
  {
    title: 'more than 3 ***',
    input: '****Test',
    output: '****Test',
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
    output: '',
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
    output: '```js\ncode\n',
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
});
