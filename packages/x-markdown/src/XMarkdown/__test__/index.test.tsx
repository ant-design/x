import { render } from '@testing-library/react';
import React from 'react';
import XMarkdown, { Token } from '../../index';

const testCases = [
  {
    title: 'Render basic text',
    markdown: 'Hello world!',
    html: '<div class="xmarkdown-p">Hello world!</div>',
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
    html: '<div class="xmarkdown-p">this is <code>codespan</code></div>',
  },
  {
    title: 'Render code block',
    markdown: "```javascript\nconsole.log('hello');\n```",
    html: '<pre><code class="language-javascript" lang="javascript">console.log(\'hello\');</code></pre>',
  },
  {
    title: 'Render link',
    markdown: '[Google](https://www.google.com)',
    html: '<div class="xmarkdown-p"><a href="https://www.google.com">Google</a></div>',
  },
  {
    title: 'Render link with title',
    markdown: '[Google]: https://www.google.com "google"\n[Google]',
    html: '<div class="xmarkdown-p"><a href="https://www.google.com" title="google">Google</a></div>',
  },
  {
    title: 'Render image',
    markdown: '![logo](https://example.com/logo.png)',
    html: '<div class="xmarkdown-p"><img alt="logo" src="https://example.com/logo.png"></div>',
  },
  {
    title: 'Render bold and italic',
    markdown: 'This is **bold** and *italic* text',
    html: '<div class="xmarkdown-p">This is <strong>bold</strong> and <em>italic</em> text</div>',
  },
  {
    title: 'Render blockquote',
    markdown: '> This is a quote',
    html: '<blockquote><div class="xmarkdown-p">This is a quote</div></blockquote>',
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
    html: '<h1>Title</h1><div class="xmarkdown-p">This is a <a href="https://example.com">link</a> and <strong>bold</strong> text</div><ul><li>List item 1</li><li>List item 2</li></ul>',
  },
  {
    title: 'Render del',
    markdown: '~del~',
    html: '<div class="xmarkdown-p"><del>del</del></div>',
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
    html: '<div class="xmarkdown-p">&gt;</div>',
  },
  {
    title: 'Render br',
    markdown: 'br: <br>',
    html: '<div class="xmarkdown-p">br: <br></div>',
  },
  {
    title: 'Render Html',
    markdown: '<div>hello</div>',
    html: '<div>hello</div>',
  },
  {
    title: 'Render Html',
    markdown: 'inline: <span>hello</span>',
    html: '<div class="xmarkdown-p">inline: <span>hello</span></div>',
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
      const { container } = render(<XMarkdown content={markdown} options={options} />);

      expect((container.firstChild as HTMLElement)?.innerHTML).toBe(html);
    });
  });

  it(`render custom components`, () => {
    const markdown = `custom component <Line>This is Line</Line>`;
    const html = `<div class=\"xmarkdown-p\">custom component <span>change Line to span</span></div>`;
    const { container } = render(
      <XMarkdown
        content={markdown}
        components={{
          Line: () => {
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
    const { container } = render(<XMarkdown content="# heading" walkTokens={walkTokens} />);

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
