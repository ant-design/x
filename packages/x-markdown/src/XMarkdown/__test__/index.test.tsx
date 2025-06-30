import { render } from '@testing-library/react';
import React from 'react';
import XMarkdown, { Token } from '../../index';

const testCases = [
  {
    title: 'Render basic text',
    markdown: 'Hello world!',
    html: '<p>Hello world!</p>',
  },
  {
    title: 'Render heading1',
    markdown: '# Heading 1',
    html: '<h1>Heading 1</h1>',
  },
  {
    title: 'Render heading2',
    markdown: '## Heading 2',
    html: '<h2>Heading 2</h2>',
  },
  {
    title: 'Render heading6',
    markdown: '###### Heading 6',
    html: '<h6>Heading 6</h6>',
  },
  {
    title: 'Render unordered list',
    markdown: '- Item 1\n- Item 2\n- Item 3',
    html: '<ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>',
  },
  {
    title: 'Render ordered list',
    markdown: '1. First\n2. Second\n3. Third',
    html: '<ol start="1"><li>First</li><li>Second</li><li>Third</li></ol>',
  },
  {
    title: 'Render code span',
    markdown: 'this is `codespan`',
    html: '<p>this is <code>codespan</code></p>',
  },
  {
    title: 'Render code block',
    markdown: "```javascript\nconsole.log('hello');\n```",
    html: '<pre><code class="language-javascript">console.log(\'hello\');</code></pre>',
  },
  {
    title: 'Render link',
    markdown: '[Google](https://www.google.com)',
    html: '<p><a href="https://www.google.com">Google</a></p>',
  },
  {
    title: 'Render link with title',
    markdown: '[Google]: https://www.google.com "google"\n[Google]',
    html: '<p><a href="https://www.google.com" title="google">Google</a></p>',
  },
  {
    title: 'Render image',
    markdown: '![logo](https://example.com/logo.png)',
    html: '<p><img alt="logo" src="https://example.com/logo.png"></p>',
  },
  {
    title: 'Render bold and italic',
    markdown: 'This is **bold** and *italic* text',
    html: '<p>This is <strong>bold</strong> and <em>italic</em> text</p>',
  },
  {
    title: 'Render blockquote',
    markdown: '> This is a quote',
    html: '<blockquote><p>This is a quote</p></blockquote>',
  },
  {
    title: 'Render horizontal rule',
    markdown: '---',
    html: '<hr>',
  },
  {
    title: 'Render mixed formats',
    markdown:
      '# Title\n\nThis is a [link](https://example.com) and **bold** text\n\n- List item 1\n- List item 2',
    html: '<h1>Title</h1><p>This is a <a href="https://example.com">link</a> and <strong>bold</strong> text</p><ul><li>List item 1</li><li>List item 2</li></ul>',
  },
  {
    title: 'Render del',
    markdown: '~del~',
    html: '<p><del>del</del></p>',
  },
  {
    title: 'Render table',
    markdown: `| Month    | Savings |
  | -------- | ------- |
  | January  | $250    |
  | February | $80     |
  | March    | $420    |`,
    html: '<table><thead><tr><th>Month</th><th>Savings</th></tr></thead><tbody><tr><td>January</td><td>$250</td></tr><tr><td>February</td><td>$80</td></tr><tr><td>March</td><td>$420</td></tr></tbody></table>',
  },
  {
    title: 'Render checkbox',
    markdown: '- [ ] checkbox',
    html: '<ul><li><input disabled="" type="checkbox">checkbox</li></ul>',
  },
  {
    title: 'Render escape',
    markdown: '\\>',
    html: '<p>&gt;</p>',
  },
  {
    title: 'Render br',
    markdown: 'Hello\nWorld!\n',
    html: '<p>Hello<br>World!</p>',
    options: { breaks: true },
  },
  {
    title: 'Render Html',
    markdown: '<div>hello</div>',
    html: '<div>hello</div>',
  },
  {
    title: 'Render Html',
    markdown: 'inline: <span>hello</span>',
    html: '<p>inline: <span></span>hello</p>',
  },
];

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

  testCases.forEach(({ markdown, title, html, options }: ITestCase) => {
    it(`common markdown case: ${title}`, () => {
      const { container } = render(<XMarkdown content={markdown} config={options} />);

      expect((container.firstChild as HTMLElement)?.innerHTML).toBe(html);
    });
  });

  it('walkToken', () => {
    const walkTokens = (token: Token) => {
      if (token.type === 'heading') {
        token.depth++;
      }
    };
    const { container } = render(<XMarkdown content="# heading" plugins={[{ walkTokens }]} />);

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
});
