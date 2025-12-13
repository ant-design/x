import { render } from '@testing-library/react';
import React from 'react';
import XMarkdown, { Token } from '../../index';

const testCases = [
  {
    title: 'Render basic text',
    markdown: 'Hello world!',
    html: '<p>Hello world!</p>\n',
  },
  {
    title: 'Render heading1',
    markdown: '# Heading 1',
    html: '<h1>Heading 1</h1>\n',
  },
  {
    title: 'Render heading2',
    markdown: '## Heading 2',
    html: '<h2>Heading 2</h2>\n',
  },
  {
    title: 'Render heading6',
    markdown: '###### Heading 6',
    html: '<h6>Heading 6</h6>\n',
  },
  {
    title: 'Render unordered list',
    markdown: '- Item 1\n- Item 2\n- Item 3',
    html: '<ul>\n<li>Item 1</li>\n<li>Item 2</li>\n<li>Item 3</li>\n</ul>\n',
  },
  {
    title: 'Render ordered list',
    markdown: '1. First\n2. Second\n3. Third',
    html: '<ol>\n<li>First</li>\n<li>Second</li>\n<li>Third</li>\n</ol>\n',
  },
  {
    title: 'Render code span',
    markdown: 'this is `codespan`',
    html: '<p>this is <code>codespan</code></p>\n',
  },
  {
    title: 'Render code block',
    markdown: '```javascript\nconsole.log(`hello`);\n```\n',
    html: '<pre><code data-block="true" data-state="done" class="language-javascript">console.log(`hello`);\n</code></pre>\n',
  },
  {
    title: 'Render link',
    markdown: '[Google](https://www.google.com)',
    html: '<p><a href="https://www.google.com">Google</a></p>\n',
  },
  {
    title: 'Render link with title',
    markdown: '[Google]: https://www.google.com "google"\n[Google]',
    html: '<p><a href="https://www.google.com" title="google">Google</a></p>\n',
  },
  {
    title: 'Render image',
    markdown: '![logo](https://example.com/logo.png)',
    html: '<p><img alt="logo" src="https://example.com/logo.png"></p>\n',
  },
  {
    title: 'Render bold and italic',
    markdown: 'This is **bold** and *italic* text',
    html: '<p>This is <strong>bold</strong> and <em>italic</em> text</p>\n',
  },
  {
    title: 'Render blockquote',
    markdown: '> This is a quote',
    html: '<blockquote>\n<p>This is a quote</p>\n</blockquote>\n',
  },
  {
    title: 'Render horizontal rule',
    markdown: '---',
    html: '<hr>\n',
  },
  {
    title: 'Render mixed formats',
    markdown:
      '# Title\n\nThis is a [link](https://example.com) and **bold** text\n\n- List item 1\n- List item 2',
    html: '<h1>Title</h1>\n<p>This is a <a href="https://example.com">link</a> and <strong>bold</strong> text</p>\n<ul>\n<li>List item 1</li>\n<li>List item 2</li>\n</ul>\n',
  },
  {
    title: 'Render del',
    markdown: '~del~',
    html: '<p><del>del</del></p>\n',
  },
  {
    title: 'Render table',
    markdown: `| Month    | Savings |
  | -------- | ------- |
  | January  | $250    |
  | February | $80     |
  | March    | $420    |`,
    html: '<table><thead><tr><th>Month</th><th>Savings</th></tr></thead><tbody><tr><td>January</td><td>$250</td></tr><tr><td>February</td><td>$80</td></tr><tr><td>March</td><td>$420</td></tr></tbody></table>\n',
  },
  {
    title: 'Render checkbox',
    markdown: '- [ ] checkbox',
    html: '<ul>\n<li><input disabled="" type="checkbox"> checkbox</li>\n</ul>\n',
  },
  {
    title: 'Render escape',
    markdown: '\\>',
    html: '<p>&gt;</p>\n',
  },
  {
    title: 'Render br',
    markdown: 'br: <br>',
    html: '<p>br: <br></p>\n',
  },
  {
    title: 'Render Html',
    markdown: '<div>hello</div>',
    html: '<div>hello</div>',
  },
  {
    title: 'Render Html',
    markdown: 'inline: <span>hello</span>',
    html: '<p>inline: <span>hello</span></p>\n',
  },
];

const CustomParagraph = (props: React.PropsWithChildren) => <p>{props.children}</p>;

type ITestCase = {
  markdown: string;
  html: string;
  title: string;
  options?: any;
};

describe('XMarkdown', () => {
  it('content should be string', () => {
    const { container } = render(<XMarkdown content={undefined} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('children should be string', () => {
    const { container } = render(<XMarkdown>{undefined}</XMarkdown>);
    expect(container).toBeEmptyDOMElement();
  });

  testCases.forEach(({ markdown, title, html }: ITestCase) => {
    it(`common markdown case: ${title}`, () => {
      const { container } = render(<XMarkdown content={markdown} />);

      expect((container.firstChild as HTMLElement)?.innerHTML).toBe(html);
    });
  });

  it(`render custom components`, () => {
    const markdown = `custom component <custom-component>This is Line</custom-component>`;
    const html = `<p>custom component <span>change Line to span</span></p>\n`;
    const { container } = render(
      <XMarkdown
        content={markdown}
        components={{
          'custom-component': () => {
            return <span>change Line to span</span>;
          },
        }}
      />,
    );

    expect((container.firstChild as HTMLElement)?.innerHTML).toBe(html);
  });

  it('walkToken', () => {
    const walkTokens = (token: Token) => {
      if (token.type === 'heading') {
        token.depth++;
      }
    };
    const { container } = render(<XMarkdown content="# heading" config={{ walkTokens }} />);

    expect(container.querySelector('h2')).toBeInTheDocument();
  });

  it('custom className', () => {
    const { container } = render(<XMarkdown content="Test" className="custom-class" />);

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('custom style', () => {
    const testStyle = { backgroundColor: 'red' };
    const { container } = render(<XMarkdown content="Test" style={testStyle} />);

    expect(container.firstChild).toHaveStyle(testStyle);
  });

  it('should render paragraphs with custom tag when paragraphTag is provided', () => {
    const { container } = render(<XMarkdown content="This is a paragraph." paragraphTag="div" />);

    // XMarkdown wraps content in a div with class "ant-x-markdown"
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('x-markdown');
    expect(wrapper.innerHTML).toBe('<div>This is a paragraph.</div>\n');
  });

  it('support checkbox is checked', () => {
    const { container } = render(<XMarkdown content="- [x] checkbox" />);
    expect(container).toMatchSnapshot();
  });

  it('support checkbox not checked', () => {
    const { container } = render(<XMarkdown content="- [ ] checkbox" />);
    expect(container).toMatchSnapshot();
  });

  describe('openLinksInNewTab', () => {
    it('should add target="_blank" and rel="noopener noreferrer" to links with title when openLinksInNewTab is true', () => {
      const { container } = render(
        <XMarkdown content='[Google](https://www.google.com "Google Search")' openLinksInNewTab />,
      );

      const link = container.querySelector('a');
      expect(link).toHaveAttribute('href', 'https://www.google.com');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      expect(link).toHaveAttribute('title', 'Google Search');
      expect(link).toHaveTextContent('Google');
    });

    it('should not add target="_blank" when openLinksInNewTab is false', () => {
      const { container } = render(
        <XMarkdown content="[Google](https://www.google.com)" openLinksInNewTab={false} />,
      );

      const link = container.querySelector('a');
      expect(link).toHaveAttribute('href', 'https://www.google.com');
      expect(link).not.toHaveAttribute('target');
      expect(link).not.toHaveAttribute('rel');
      expect(link).toHaveTextContent('Google');
    });

    it('should not add target="_blank" when openLinksInNewTab is not provided', () => {
      const { container } = render(<XMarkdown content="[Google](https://www.google.com)" />);

      const link = container.querySelector('a');
      expect(link).toHaveAttribute('href', 'https://www.google.com');
      expect(link).not.toHaveAttribute('target');
      expect(link).not.toHaveAttribute('rel');
      expect(link).toHaveTextContent('Google');
    });
  });

  describe('animation', () => {
    it('parent is not custom components', () => {
      const { container } = render(
        <XMarkdown content="This is Text." streaming={{ enableAnimation: true }} />,
      );
      expect(container).toMatchSnapshot();
    });

    it('parent is custom components', () => {
      const { container } = render(
        <XMarkdown
          content="This is Text."
          components={{ p: CustomParagraph }}
          streaming={{ enableAnimation: true }}
        />,
      );
      expect(container).toMatchSnapshot();
    });
  });
});

describe('custom code component props', () => {
  const CodeComponent = jest.fn(() => null);

  beforeEach(() => {
    CodeComponent.mockClear();
  });

  const codeTestCases = [
    {
      title: 'should pass block=false and streamStatus=done for inline code',
      markdown: 'Inline `code` here',
      block: false,
      streamStatus: 'done',
    },
    {
      title: 'should pass block=false and streamStatus=loading for finished inline code',
      markdown: '``` inline code ```',
      block: false,
      streamStatus: 'done',
    },
    {
      title:
        'should pass block=true and streamStatus=loading for unfinished fenced code blocks start ```',
      markdown: '   ```',
      block: true,
      streamStatus: 'loading',
    },
    {
      title:
        'should pass block=true and streamStatus=loading for unfinished fenced code blocks with ```',
      markdown: '```js\nconsole.log(`log`);',
      block: true,
      streamStatus: 'loading',
    },
    {
      title:
        'should pass block=true and streamStatus=loading for unfinished fenced code blocks with ```',
      markdown: '```js\nconsole.log(`log`);\n```',
      block: true,
      streamStatus: 'done',
    },
    {
      title:
        'should pass block=true and streamStatus=done for finished fenced code blocks with ```',
      markdown: 'start text\n```js\n console.log(`log`);\n```\n end text',
      block: true,
      streamStatus: 'done',
    },
    {
      title:
        'should pass block=true and streamStatus=done for finished fenced code blocks with ```\n\n',
      markdown: 'start text\n```js\n console.log(`log`);\n```\n\n end text',
      block: true,
      streamStatus: 'done',
    },
    {
      title:
        'should pass block=true and streamStatus=loading for unfinished fenced code blocks start ~~~',
      markdown: '~~~',
      block: true,
      streamStatus: 'loading',
    },
    {
      title:
        'should pass block=true and streamStatus=loading for unfinished fenced code blocks with ~~~',
      markdown: '~~~js\nconsole.log(`log`);',
      block: true,
      streamStatus: 'loading',
    },
    {
      title:
        'should pass block=true and streamStatus=done for finished fenced code blocks with ~~~',
      markdown: 'start text\n ~~~js\n console.log(`log`);\n~~~\n end text',
      block: true,
      streamStatus: 'done',
    },
    {
      title:
        'should pass block=true and streamStatus=done for finished fenced code blocks with ~~~\n\n',
      markdown: 'start text\n\n ~~~js\n console.log(`log`);\n~~~\n\n end text',
      block: true,
      streamStatus: 'done',
    },
    {
      title: 'should pass block=true and streamStatus=done for indented code blocks',
      markdown: '    console.log(`log`);',
      block: true,
      streamStatus: 'done',
    },
  ];

  codeTestCases.forEach(({ title, markdown, block, streamStatus }) => {
    it(title, () => {
      render(<XMarkdown content={markdown} components={{ code: CodeComponent }} />);
      expect(CodeComponent).toHaveBeenCalledWith(
        expect.objectContaining({ block, streamStatus }),
        undefined,
      );
    });
  });
});

describe('extensions', () => {
  it('user extension should be called before default extension', () => {});

  it('should use default link renderer when user renderer returns false', () => {
    const { container } = render(
      <XMarkdown
        content="[Google](https://google.com)"
        openLinksInNewTab
        config={{
          renderer: {
            link() {
              return false as any;
            },
          },
        }}
      />,
    );
    const link = container.querySelector('a');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://google.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link).toHaveTextContent('Google');
  });

  it('should use user link renderer when it returns non-false', () => {
    const { container } = render(
      <XMarkdown
        content="[Google](https://google.com)"
        config={{
          renderer: {
            link({ href, text }) {
              return `<a href="${href}" class="custom-link">${text}</a>`;
            },
          },
        }}
      />,
    );
    const link = container.querySelector('a');
    expect(link).toBeInTheDocument();
    expect(link).toHaveClass('custom-link');
    expect(link).not.toHaveAttribute('target');
    expect(link).not.toHaveAttribute('rel');
    expect(link).toHaveTextContent('Google');
  });

  it('should use default paragraph renderer when user renderer returns false', () => {
    const { container } = render(
      <XMarkdown
        content="Hello"
        paragraphTag="div"
        config={{
          renderer: {
            paragraph() {
              return false as any;
            },
          },
        }}
      />,
    );
    expect(container.querySelector('div')).toHaveTextContent('Hello');
  });

  it('should use user paragraph renderer when it returns non-false', () => {
    const { container } = render(
      <XMarkdown
        content="Hello"
        config={{
          renderer: {
            paragraph({ text }) {
              return `<section>${text}</section>`;
            },
          },
        }}
      />,
    );
    expect(container.querySelector('section')).toHaveTextContent('Hello');
  });

  it('should use default code renderer when user renderer returns false', async () => {
    const content = `\`\`\`javascript
console.log("javascript");
\`\`\`\n`;
    const { container } = render(
      <XMarkdown
        content={content}
        config={{
          renderer: {
            code() {
              return false as any;
            },
          },
        }}
      />,
    );
    const codeElement = container.querySelector('code');
    expect(codeElement).toBeInTheDocument();
    expect(codeElement).toHaveAttribute('data-block', 'true');
    expect(codeElement).toHaveAttribute('data-state', 'done');
  });

  it('should use user code renderer when it returns non-false', () => {
    const content = `\`\`\`js
console.log(1);
\`\`\``;
    const { container } = render(
      <XMarkdown
        content={content}
        config={{
          renderer: {
            code({ lang, text }) {
              return `<pre><code class="lang-${lang}">${text.trim()}</code></pre>`;
            },
          },
        }}
      />,
    );
    const code = container.querySelector('pre code');
    expect(code).toHaveClass('lang-js');
    expect(code).toHaveTextContent('console.log(1);');
    expect(code).not.toHaveAttribute('data-block');
    expect(code).not.toHaveAttribute('data-state');
  });
});
