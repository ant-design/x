import { render } from '@testing-library/react';
import React from 'react';
import useStreaming from '../hooks/useStreaming';
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
    input: '[ant design x](',
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
    output: '#',
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
    title: 'incomplete strong emphasis',
    input: '***strong emph**',
    output: '',
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
    output: '<divvvv',
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
    output: '',
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
  config?: Record<string, unknown>;
};

const TestComponent = ({
  input,
  config,
}: {
  input: string;
  config?: XMarkdownProps['streaming'];
}) => {
  const result = useStreaming(input, config || { hasNextChunk: true });
  return <div>{result}</div>;
};

describe('useStreaming', () => {
  testCases.forEach(({ title, input, output }: TestCase) => {
    it(`testcase: ${title}`, () => {
      const { container } = render(<TestComponent input={input} config={{ hasNextChunk: true }} />);
      expect(container.textContent).toBe(output);
    });
  });

  // it('should render empty content', () => {
  //   const { container } = render(<XMarkdown content="" />);
  //   expect(container.textContent).toBe('');
  // });

  // it('should render plain text directly', () => {
  //   const text = 'Hello world';
  //   const { container } = render(<XMarkdown content={text} />);
  //   expect(container.textContent).toBe(text);
  // });

  // it('should handle streaming with chunks', () => {
  //   const text = 'Hello world';
  //   const { container, rerender } = render(
  //     <XMarkdown content="Hello" streaming={{ hasNextChunk: true }} />,
  //   );

  //   expect(container.textContent).toBe('Hello');

  //   rerender(<XMarkdown content={text} streaming={{ hasNextChunk: false }} />);
  //   expect(container.textContent).toBe(text);
  // });

  // it('should handle multiple chunks streaming', () => {
  //   const { container, rerender } = render(
  //     <XMarkdown content="Hello" streaming={{ hasNextChunk: true }} />,
  //   );
  //   expect(container.textContent).toBe('Hello');

  //   rerender(<XMarkdown content="Hello world" streaming={{ hasNextChunk: true }} />);
  //   expect(container.textContent).toBe('Hello world');

  //   rerender(<XMarkdown content="Hello world!" streaming={{ hasNextChunk: false }} />);
  //   expect(container.textContent).toBe('Hello world!');
  // });

  // it('should handle nested markdown tokens', () => {
  //   const { container } = render(
  //     <XMarkdown content="**bold *italic***" streaming={{ hasNextChunk: false }} />,
  //   );
  //   expect(container.querySelector('strong')?.textContent).toBe('bold');
  //   expect(container.querySelector('em')?.textContent).toBe('italic');
  // });

  // it('should handle XML tags with components', () => {
  //   const components = {
  //     Custom: () => <span>custom</span>,
  //     Another: () => <div>another</div>,
  //   };
  //   const { container } = render(
  //     <XMarkdown
  //       content="<Custom /><Another />"
  //       streaming={{ hasNextChunk: false }}
  //       components={components}
  //     />,
  //   );
  //   expect(container.querySelector('span')?.textContent).toBe('custom');
  //   expect(container.querySelector('div')?.textContent).toBe('another');
  // });

  // it('should handle incomplete XML tags', () => {
  //   const { container, rerender } = render(
  //     <XMarkdown content="<div" streaming={{ hasNextChunk: true }} />,
  //   );
  //   expect(container.textContent).toBe('<div');

  //   rerender(<XMarkdown content="<div>" streaming={{ hasNextChunk: true }} />);
  //   expect(container.textContent).toBe('<div>');

  //   rerender(<XMarkdown content="<div>content</div>" streaming={{ hasNextChunk: false }} />);
  //   expect(container.textContent).toContain('content');
  // });

  // it('should handle thematic breaks', () => {
  //   const { container } = render(
  //     <XMarkdown content="---\ncontent" streaming={{ hasNextChunk: false }} />,
  //   );
  //   expect(container.textContent).toContain('content');
  // });

  // it('should handle code blocks', () => {
  //   const { container } = render(
  //     <XMarkdown content="```\ncode\n```" streaming={{ hasNextChunk: false }} />,
  //   );
  //   expect(container.querySelector('code')?.textContent).toContain('code');
  // });

  // it('should handle mixed content streaming', () => {
  //   const { container, rerender } = render(
  //     <XMarkdown content="# Heading\n" streaming={{ hasNextChunk: true }} />,
  //   );
  //   expect(container.querySelector('h1')?.textContent).toBe('Heading');

  //   rerender(<XMarkdown content="# Heading\n**bold** text" streaming={{ hasNextChunk: false }} />);
  //   expect(container.querySelector('h1')?.textContent).toBe('Heading');
  //   expect(container.querySelector('strong')?.textContent).toBe('bold');
  //   expect(container.textContent).toContain('text');
  // });

  // it('should handle edge cases with empty chunks', () => {
  //   const { container, rerender } = render(
  //     <XMarkdown content="" streaming={{ hasNextChunk: true }} />,
  //   );
  //   expect(container.textContent).toBe('');

  //   rerender(<XMarkdown content="content" streaming={{ hasNextChunk: false }} />);
  //   expect(container.textContent).toBe('content');
  // });

  // it('should handle markdown headings', () => {
  //   const { container } = render(<XMarkdown content="# Heading" />);
  //   expect(container.querySelector('h1')?.textContent).toBe('Heading');
  // });

  // it('should handle markdown emphasis', () => {
  //   const { container } = render(<XMarkdown content="*emphasis*" />);
  //   expect(container.querySelector('em')?.textContent).toBe('emphasis');
  // });

  // it('should handle markdown strong', () => {
  //   const { container } = render(<XMarkdown content="**strong**" />);
  //   expect(container.querySelector('strong')?.textContent).toBe('strong');
  // });

  // it('should handle markdown links', () => {
  //   const { container } = render(<XMarkdown content="[link](url)" />);
  //   const link = container.querySelector('a');
  //   expect(link?.textContent).toBe('link');
  //   expect(link?.getAttribute('href')).toBe('url');
  // });

  // it('should handle markdown images', () => {
  //   const { container } = render(<XMarkdown content="![alt](src)" />);
  //   const img = container.querySelector('img');
  //   expect(img?.getAttribute('src')).toBe('src');
  //   expect(img?.getAttribute('alt')).toBe('alt');
  // });

  // it('should handle markdown code', () => {
  //   const { container } = render(<XMarkdown content="`code`" />);
  //   expect(container.querySelector('code')?.textContent).toBe('code');
  // });

  // it('should handle custom components', () => {
  //   const components = { Custom: () => <div>custom</div> };
  //   const { container } = render(<XMarkdown content="<Custom />" components={components} />);
  //   expect(container.querySelector('div')?.textContent).toBe('custom');
  // });

  // it('should reset when content changes to empty', () => {
  //   const { container, rerender } = render(<XMarkdown content="Hello" />);
  //   expect(container.textContent).toBe('Hello');

  //   rerender(<XMarkdown content="" />);
  //   expect(container.textContent).toBe('');
  // });

  // it('should handle error when content is not string', () => {
  //   const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  //   // @ts-ignore
  //   render(<XMarkdown content={123} />);
  //   expect(consoleSpy).toHaveBeenCalledWith('X-Markdown: input must be string, not number.');
  //   consoleSpy.mockRestore();
  // });

  // it('should handle unsupported XML tags', () => {
  //   const { container } = render(
  //     <XMarkdown
  //       content="<unsupported>content</unsupported>"
  //       streaming={{ hasNextChunk: false }}
  //     />,
  //   );
  //   expect(container.textContent).toContain('content');
  // });

  // it('should handle complex nested structures', () => {
  //   const markdown = '### Heading\n\n**bold** and *italic* with [link](url)';
  //   const { container } = render(
  //     <XMarkdown content={markdown} streaming={{ hasNextChunk: false }} />,
  //   );
  //   expect(container.querySelector('h3')?.textContent).toBe('Heading');
  //   expect(container.querySelector('strong')?.textContent).toBe('bold');
  //   expect(container.querySelector('em')?.textContent).toBe('italic');
  //   expect(container.querySelector('a')?.textContent).toBe('link');
  // });

  // it('should handle multiple heading levels', () => {
  //   const markdown = '# H1\n## H2\n### H3\n#### H4\n##### H5\n###### H6';
  //   const { container } = render(
  //     <XMarkdown content={markdown} streaming={{ hasNextChunk: false }} />,
  //   );
  //   expect(container.querySelector('h1')?.textContent).toBe('H1');
  //   expect(container.querySelector('h2')?.textContent).toBe('H2');
  //   expect(container.querySelector('h3')?.textContent).toBe('H3');
  //   expect(container.querySelector('h4')?.textContent).toBe('H4');
  //   expect(container.querySelector('h5')?.textContent).toBe('H5');
  //   expect(container.querySelector('h6')?.textContent).toBe('H6');
  // });

  // it('should handle mixed emphasis symbols', () => {
  //   const { container } = render(
  //     <XMarkdown
  //       content="_italic_ and *italic* and __strong__ and **strong**"
  //       streaming={{ hasNextChunk: false }}
  //     />,
  //   );
  //   const ems = container.querySelectorAll('em');
  //   const strongs = container.querySelectorAll('strong');
  //   expect(ems[0]?.textContent).toBe('italic');
  //   expect(ems[1]?.textContent).toBe('italic');
  //   expect(strongs[0]?.textContent).toBe('strong');
  //   expect(strongs[1]?.textContent).toBe('strong');
  // });

  // it('should handle multi-line code blocks', () => {
  //   const code = '```\nline1\nline2\nline3\n```';
  //   const { container } = render(<XMarkdown content={code} streaming={{ hasNextChunk: false }} />);
  //   const codeBlock = container.querySelector('code');
  //   expect(codeBlock?.textContent).toContain('line1');
  //   expect(codeBlock?.textContent).toContain('line2');
  //   expect(codeBlock?.textContent).toContain('line3');
  // });

  // it('should handle self-closing XML tags', () => {
  //   const components = {
  //     Br: () => <br />,
  //   };
  //   const { container } = render(
  //     <XMarkdown content="<Br />" streaming={{ hasNextChunk: false }} components={components} />,
  //   );
  //   expect(container.querySelector('br')).toBeTruthy();
  // });

  // it('should handle lists', () => {
  //   const markdown = '- Item 1\n* Item 2\n+ Item 3';
  //   const { container } = render(
  //     <XMarkdown content={markdown} streaming={{ hasNextChunk: false }} />,
  //   );
  //   const items = container.querySelectorAll('li');
  //   expect(items.length).toBe(3);
  //   expect(items[0]?.textContent).toBe('Item 1');
  //   expect(items[1]?.textContent).toBe('Item 2');
  //   expect(items[2]?.textContent).toBe('Item 3');
  // });

  // it('should handle horizontal rules', () => {
  //   const markdown = '---\n***\n___';
  //   const { container } = render(
  //     <XMarkdown content={markdown} streaming={{ hasNextChunk: false }} />,
  //   );
  //   const hrs = container.querySelectorAll('hr');
  //   expect(hrs.length).toBe(3);
  // });

  // it('should handle nested links and images', () => {
  //   const markdown = '[![alt](src)](url)';
  //   const { container } = render(
  //     <XMarkdown content={markdown} streaming={{ hasNextChunk: false }} />,
  //   );
  //   const link = container.querySelector('a');
  //   const img = container.querySelector('img');
  //   expect(link?.getAttribute('href')).toBe('url');
  //   expect(img?.getAttribute('src')).toBe('src');
  //   expect(img?.getAttribute('alt')).toBe('alt');
  // });

  // it('should handle escaped characters', () => {
  //   const markdown = '\\*not italic\\* \\`not code\\` \\_not emphasis\\_';
  //   const { container } = render(
  //     <XMarkdown content={markdown} streaming={{ hasNextChunk: false }} />,
  //   );
  //   expect(container.querySelector('em')).toBeNull();
  //   expect(container.querySelector('code')).toBeNull();
  //   expect(container.querySelector('strong')).toBeNull();
  //   expect(container.textContent).toContain('*not italic*');
  //   expect(container.textContent).toContain('`not code`');
  //   expect(container.textContent).toContain('_not emphasis_');
  // });

  // it('should handle complex XML tag cases', () => {
  //   const components = {
  //     Custom: () => <span>custom</span>,
  //     Another: () => <div>another</div>,
  //   };
  //   const { container } = render(
  //     <XMarkdown
  //       content="<Custom attr='value' /><Another><child /></Another>"
  //       streaming={{ hasNextChunk: false }}
  //       components={components}
  //     />,
  //   );
  //   expect(container.querySelector('span')?.textContent).toBe('custom');
  //   expect(container.querySelector('div')?.textContent).toBe('another');
  // });

  // it('should handle mixed emphasis symbols nesting', () => {
  //   const { container } = render(
  //     <XMarkdown
  //       content="***triple*** **double** *single* __double__ _single_"
  //       streaming={{ hasNextChunk: false }}
  //     />,
  //   );
  //   const strongs = container.querySelectorAll('strong');
  //   const ems = container.querySelectorAll('em');
  //   expect(strongs.length).toBe(2);
  //   expect(ems.length).toBe(2);
  // });

  // it('should handle thematic breaks variations', () => {
  //   const markdown = '---\n***\n___\n- - -\n* * *\n_ _ _';
  //   const { container } = render(
  //     <XMarkdown content={markdown} streaming={{ hasNextChunk: false }} />,
  //   );
  //   const hrs = container.querySelectorAll('hr');
  //   expect(hrs.length).toBe(6);
  // });

  // it('should handle different list markers', () => {
  //   const markdown = '- Item 1\n* Item 2\n+ Item 3\n1. Item 4';
  //   const { container } = render(
  //     <XMarkdown content={markdown} streaming={{ hasNextChunk: false }} />,
  //   );
  //   const items = container.querySelectorAll('li');
  //   expect(items.length).toBe(4);
  // });

  // it('should handle self-closing XML tags with attributes', () => {
  //   const components = {
  //     Br: () => <br />,
  //     Img: () => <img src="test.jpg" alt="test" />,
  //   };
  //   const { container } = render(
  //     <XMarkdown
  //       content="<Br /><Img />"
  //       streaming={{ hasNextChunk: false }}
  //       components={components}
  //     />,
  //   );
  //   expect(container.querySelector('br')).toBeTruthy();
  //   expect(container.querySelector('img')).toBeTruthy();
  // });

  // it('should handle streaming with very small chunks', () => {
  //   const text = 'Hello world';
  //   const { container, rerender } = render(
  //     <XMarkdown content="H" streaming={{ hasNextChunk: true }} />,
  //   );
  //   expect(container.textContent).toBe('H');

  //   for (let i = 1; i < text.length; i++) {
  //     rerender(<XMarkdown content={text.slice(0, i + 1)} streaming={{ hasNextChunk: true }} />);
  //     expect(container.textContent).toBe(text.slice(0, i + 1));
  //   }

  //   rerender(<XMarkdown content={text} streaming={{ hasNextChunk: false }} />);
  //   expect(container.textContent).toBe(text);
  // });

  // it('should handle invalid XML tags gracefully', () => {
  //   const { container } = render(
  //     <XMarkdown
  //       content="<invalid>content</invalid><valid>content</valid>"
  //       streaming={{ hasNextChunk: false }}
  //     />,
  //   );
  //   expect(container.textContent).toContain('content');
  //   expect(container.querySelector('valid')).toBeNull();
  // });

  // it('should handle mixed content with incomplete markdown', () => {
  //   const { container } = render(
  //     <XMarkdown
  //       content="# Incomplete heading\n* Incomplete list\n`incomplete code"
  //       streaming={{ hasNextChunk: false }}
  //     />,
  //   );
  //   expect(container.querySelector('h1')?.textContent).toBe('Incomplete heading');
  //   expect(container.querySelector('li')?.textContent).toBe('Incomplete list');
  //   expect(container.querySelector('code')?.textContent).toBe('incomplete code');
  // });

  // it('should handle edge cases with empty streaming config', () => {
  //   const { container } = render(<XMarkdown content="Test content" streaming={undefined} />);
  //   expect(container.textContent).toBe('Test content');
  // });

  // it('should handle special characters in markdown', () => {
  //   const specialText = 'Special chars: & < > " \'';
  //   const { container } = render(
  //     <XMarkdown content={specialText} streaming={{ hasNextChunk: false }} />,
  //   );
  //   expect(container.textContent).toBe(specialText);
  // });

  // it('should handle streaming buffer state transitions', () => {
  //   const { container, rerender } = render(
  //     <XMarkdown content="**bold" streaming={{ hasNextChunk: true }} />,
  //   );
  //   expect(container.textContent).toBe('**bold');

  //   rerender(<XMarkdown content="**bold*" streaming={{ hasNextChunk: true }} />);
  //   expect(container.textContent).toBe('**bold*');

  //   rerender(<XMarkdown content="**bold**" streaming={{ hasNextChunk: false }} />);
  //   expect(container.querySelector('strong')?.textContent).toBe('bold');
  // });

  // it('should handle XML tag recognition boundaries', () => {
  //   const components = { Test: () => <span>test</span> };
  //   const { container, rerender } = render(
  //     <XMarkdown content="<Tes" streaming={{ hasNextChunk: true }} components={components} />,
  //   );
  //   expect(container.textContent).toBe('<Tes');

  //   rerender(
  //     <XMarkdown content="<Test" streaming={{ hasNextChunk: true }} components={components} />,
  //   );
  //   expect(container.textContent).toBe('<Test');

  //   rerender(
  //     <XMarkdown content="<Test>" streaming={{ hasNextChunk: false }} components={components} />,
  //   );
  //   expect(container.querySelector('span')?.textContent).toBe('test');
  // });

  // it('should handle emphasis count edge cases', () => {
  //   const { container, rerender } = render(
  //     <XMarkdown content="***" streaming={{ hasNextChunk: true }} />,
  //   );
  //   expect(container.textContent).toBe('***');

  //   rerender(<XMarkdown content="****" streaming={{ hasNextChunk: true }} />);
  //   expect(container.textContent).toBe('****');

  //   rerender(<XMarkdown content="*****" streaming={{ hasNextChunk: false }} />);
  //   expect(container.textContent).toBe('*****');
  // });

  // it('should handle backtick count edge cases', () => {
  //   const { container, rerender } = render(
  //     <XMarkdown content="``" streaming={{ hasNextChunk: true }} />,
  //   );
  //   expect(container.textContent).toBe('``');

  //   rerender(<XMarkdown content="```" streaming={{ hasNextChunk: true }} />);
  //   expect(container.textContent).toBe('```');

  //   rerender(<XMarkdown content="````" streaming={{ hasNextChunk: false }} />);
  //   expect(container.textContent).toBe('````');
  // });

  // it('should handle complex streaming with mixed tokens', () => {
  //   const components = { Test: () => <span>test</span> };
  //   const { container, rerender } = render(
  //     <XMarkdown content="# Hea" streaming={{ hasNextChunk: true }} components={components} />,
  //   );
  //   expect(container.textContent).toBe('# Hea');

  //   rerender(
  //     <XMarkdown
  //       content="# Heading\n**bold** <Test"
  //       streaming={{ hasNextChunk: true }}
  //       components={components}
  //     />,
  //   );
  //   expect(container.textContent).toContain('# Heading\n**bold** <Test');

  //   rerender(
  //     <XMarkdown
  //       content="# Heading\n**bold** <Test>"
  //       streaming={{ hasNextChunk: false }}
  //       components={components}
  //     />,
  //   );
  //   expect(container.querySelector('h1')?.textContent).toBe('Heading');
  //   expect(container.querySelector('strong')?.textContent).toBe('bold');
  //   expect(container.querySelector('span')?.textContent).toBe('test');
  // });

  // it('should reset buffer when content becomes empty', () => {
  //   const { container, rerender } = render(
  //     <XMarkdown content="**bold" streaming={{ hasNextChunk: true }} />,
  //   );
  //   expect(container.textContent).toBe('**bold');

  //   rerender(<XMarkdown content="" streaming={{ hasNextChunk: false }} />);
  //   expect(container.textContent).toBe('');

  //   rerender(<XMarkdown content="new content" streaming={{ hasNextChunk: false }} />);
  //   expect(container.textContent).toBe('new content');
  // });

  // it('should handle maximum XML tag length', () => {
  //   const components = {
  //     VeryLongTagName: () => <div>long</div>,
  //     Short: () => <span>short</span>,
  //   };
  //   const { container, rerender } = render(
  //     <XMarkdown
  //       content="<VeryLongTagN"
  //       streaming={{ hasNextChunk: true }}
  //       components={components}
  //     />,
  //   );
  //   expect(container.textContent).toBe('<VeryLongTagN');

  //   rerender(
  //     <XMarkdown
  //       content="<VeryLongTagName><Short"
  //       streaming={{ hasNextChunk: true }}
  //       components={components}
  //     />,
  //   );
  //   expect(container.textContent).toBe('<VeryLongTagName><Short');

  //   rerender(
  //     <XMarkdown
  //       content="<VeryLongTagName><Short />"
  //       streaming={{ hasNextChunk: false }}
  //       components={components}
  //     />,
  //   );
  //   expect(container.querySelector('div')?.textContent).toBe('long');
  //   expect(container.querySelector('span')?.textContent).toBe('short');
  // });

  // it('should recover from error states', () => {
  //   const { container, rerender } = render(
  //     <XMarkdown content="<invalid" streaming={{ hasNextChunk: true }} />,
  //   );
  //   expect(container.textContent).toBe('<invalid');

  //   rerender(
  //     <XMarkdown content="<invalid><valid>text</valid>" streaming={{ hasNextChunk: true }} />,
  //   );
  //   expect(container.textContent).toBe('<invalid><valid>text</valid>');

  //   rerender(<XMarkdown content="<valid>text</valid>" streaming={{ hasNextChunk: false }} />);
  //   expect(container.textContent).toContain('text');
  // });

  // it('should handle XML tags with attributes and children', () => {
  //   const components = {
  //     Test: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  //   };
  //   const { container } = render(
  //     <XMarkdown
  //       content="<Test attr='value'>child</Test>"
  //       streaming={{ hasNextChunk: false }}
  //       components={components as any}
  //     />,
  //   );
  //   expect(container.querySelector('div')?.textContent).toBe('child');
  // });

  // it('should handle XML tags with namespace', () => {
  //   const components = {
  //     'ns:Test': () => <div>namespace</div>,
  //   };
  //   const { container } = render(
  //     <XMarkdown
  //       content="<ns:Test />"
  //       streaming={{ hasNextChunk: false }}
  //       components={components}
  //     />,
  //   );
  //   expect(container.querySelector('div')?.textContent).toBe('namespace');
  // });

  // it('should handle buffer flush on streaming end', () => {
  //   const { container, rerender } = render(
  //     <XMarkdown content="**bold" streaming={{ hasNextChunk: true }} />,
  //   );
  //   expect(container.textContent).toBe('**bold');

  //   rerender(<XMarkdown content="**bold**" streaming={{ hasNextChunk: false }} />);
  //   expect(container.querySelector('strong')?.textContent).toBe('bold');
  // });

  // it('should handle performance optimization cases', () => {
  //   const { container, rerender } = render(
  //     <XMarkdown content="Same content" streaming={{ hasNextChunk: true }} />,
  //   );
  //   const firstRender = container.textContent;

  //   rerender(<XMarkdown content="Same content" streaming={{ hasNextChunk: false }} />);
  //   expect(container.textContent).toBe(firstRender);
  // });

  // it('should handle very long XML tag names', () => {
  //   const components = {
  //     VeryVeryVeryLongComponentName: () => <div>long</div>,
  //   };
  //   const { container } = render(
  //     <XMarkdown
  //       content="<VeryVeryVeryLongComponentName />"
  //       streaming={{ hasNextChunk: false }}
  //       components={components}
  //     />,
  //   );
  //   expect(container.querySelector('div')?.textContent).toBe('long');
  // });

  // it('should handle XML comments', () => {
  //   const { container } = render(
  //     <XMarkdown content="<!-- comment -->content" streaming={{ hasNextChunk: false }} />,
  //   );
  //   expect(container.textContent).toBe('content');
  // });

  // it('should handle CDATA sections', () => {
  //   const { container } = render(
  //     <XMarkdown content="<not-a-tag>" streaming={{ hasNextChunk: false }} />,
  //   );
  //   expect(container.textContent).toContain('<not-a-tag>');
  // });

  // it('should handle XML processing instructions', () => {
  //   const { container } = render(
  //     <XMarkdown content="<?xml version='1.0'?><test />" streaming={{ hasNextChunk: false }} />,
  //   );
  //   expect(container.textContent).toBe('');
  // });

  // it('should handle XML doctype declarations', () => {
  //   const { container } = render(
  //     <XMarkdown content="<!DOCTYPE html><test />" streaming={{ hasNextChunk: false }} />,
  //   );
  //   expect(container.textContent).toBe('');
  // });

  // it('should handle buffer management with large chunks', () => {
  //   const largeText = 'a'.repeat(5000);
  //   const { container } = render(
  //     <XMarkdown content={largeText} streaming={{ hasNextChunk: false }} />,
  //   );
  //   expect(container.textContent).toBe(largeText);
  // });

  // it('should handle error when streaming config is invalid', () => {
  //   const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  //   // @ts-ignore
  //   render(<XMarkdown content="test" streaming="invalid" />);
  //   expect(consoleSpy).toHaveBeenCalled();
  //   consoleSpy.mockRestore();
  // });

  // it('should handle deep nested markdown', () => {
  //   const markdown = '**_***_*emphasis*_**_**';
  //   const { container } = render(
  //     <XMarkdown content={markdown} streaming={{ hasNextChunk: false }} />,
  //   );
  //   const strongs = container.querySelectorAll('strong');
  //   const ems = container.querySelectorAll('em');
  //   expect(strongs.length).toBeGreaterThan(0);
  //   expect(ems.length).toBeGreaterThan(0);
  // });

  // it('should handle buffer overflow scenarios', () => {
  //   const longText = 'a'.repeat(10000);
  //   const { container } = render(
  //     <XMarkdown content={longText} streaming={{ hasNextChunk: false }} />,
  //   );
  //   expect(container.textContent).toBe(longText);
  // });

  // it('should handle XML tags with special characters', () => {
  //   const components = {
  //     'Test-Component': () => <span>test</span>,
  //     'Component@2': () => <div>special</div>,
  //   };
  //   const { container } = render(
  //     <XMarkdown
  //       content="<Test-Component /><Component@2 />"
  //       streaming={{ hasNextChunk: false }}
  //       components={components}
  //     />,
  //   );
  //   expect(container.querySelector('span')?.textContent).toBe('test');
  //   expect(container.querySelector('div')?.textContent).toBe('special');
  // });

  // it('should handle emphasis symbol overflow', () => {
  //   const { container, rerender } = render(
  //     <XMarkdown content="******" streaming={{ hasNextChunk: true }} />,
  //   );
  //   expect(container.textContent).toBe('******');

  //   rerender(<XMarkdown content="*******" streaming={{ hasNextChunk: false }} />);
  //   expect(container.textContent).toBe('*******');
  // });

  // it('should handle incomplete code blocks', () => {
  //   const { container, rerender } = render(
  //     <XMarkdown content="```\ncode" streaming={{ hasNextChunk: true }} />,
  //   );
  //   expect(container.querySelector('code')?.textContent).toContain('code');

  //   rerender(<XMarkdown content="```\ncode\n``" streaming={{ hasNextChunk: true }} />);
  //   expect(container.querySelector('code')?.textContent).toContain('code');

  //   rerender(<XMarkdown content="```\ncode\n```" streaming={{ hasNextChunk: false }} />);
  //   expect(container.querySelector('code')?.textContent).toContain('code');
  // });

  // it('should handle mixed streaming with XML and markdown', () => {
  //   const components = { Test: () => <span>test</span> };
  //   const { container, rerender } = render(
  //     <XMarkdown
  //       content="# Head<Test"
  //       streaming={{ hasNextChunk: true }}
  //       components={components}
  //     />,
  //   );
  //   expect(container.textContent).toBe('# Head<Test');

  //   rerender(
  //     <XMarkdown
  //       content="# Heading\n<Test>**bold**"
  //       streaming={{ hasNextChunk: true }}
  //       components={components}
  //     />,
  //   );
  //   expect(container.textContent).toContain('# Heading\n<Test>**bold**');

  //   rerender(
  //     <XMarkdown
  //       content="# Heading\n<Test>**bold**</Test>"
  //       streaming={{ hasNextChunk: false }}
  //       components={components}
  //     />,
  //   );
  //   expect(container.querySelector('h1')?.textContent).toBe('Heading');
  //   expect(container.querySelector('strong')?.textContent).toBe('bold');
  //   expect(container.querySelector('span')?.textContent).toBe('test');
  // });

  // it('should handle streaming with line breaks and whitespace', () => {
  //   const text = '  Hello  \n  World  ';
  //   const { container, rerender } = render(
  //     <XMarkdown content="  Hello" streaming={{ hasNextChunk: true }} />,
  //   );
  //   expect(container.textContent).toBe('  Hello');

  //   rerender(<XMarkdown content="  Hello  \n  World" streaming={{ hasNextChunk: true }} />);
  //   expect(container.textContent).toBe('  Hello  \n  World');

  //   rerender(<XMarkdown content={text} streaming={{ hasNextChunk: false }} />);
  //   expect(container.textContent).toBe(text);
  // });
});
