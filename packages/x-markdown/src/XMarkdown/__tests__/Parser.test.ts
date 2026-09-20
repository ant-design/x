import Parser, { escapeHtml } from '../core/Parser';

describe('Parser', () => {
  it('should render paragraphs with custom tag when paragraphTag is provided', () => {
    const parser = new Parser({ paragraphTag: 'div' });
    const result = parser.parse('This is a paragraph.');
    expect(result).toBe('<div>This is a paragraph.</div>\n');
  });

  it('should render paragraphs with default p tag when paragraphTag is not provided', () => {
    const parser = new Parser();
    const result = parser.parse('This is a paragraph.');
    expect(result).toBe('<p>This is a paragraph.</p>\n');
  });

  it('should render multiple paragraphs with custom tag', () => {
    const parser = new Parser({ paragraphTag: 'section' });
    const result = parser.parse('This is the first paragraph.\n\nThis is the second paragraph.');
    expect(result).toBe(
      '<section>This is the first paragraph.</section>\n<section>This is the second paragraph.</section>\n',
    );
  });

  describe('openLinksInNewTab', () => {
    it('should add target="_blank" and rel="noopener noreferrer" to links when openLinksInNewTab is true', () => {
      const parser = new Parser({ openLinksInNewTab: true });
      const result = parser.parse('[Example](https://example.com)');
      expect(result).toBe(
        '<p><a href="https://example.com" target="_blank" rel="noopener noreferrer">Example</a></p>\n',
      );
    });

    it('should not add target and rel attributes when openLinksInNewTab is false', () => {
      const parser = new Parser({ openLinksInNewTab: false });
      const result = parser.parse('[Example](https://example.com)');
      expect(result).toBe('<p><a href="https://example.com">Example</a></p>\n');
    });

    it('should not add target and rel attributes when openLinksInNewTab is not provided', () => {
      const parser = new Parser();
      const result = parser.parse('[Example](https://example.com)');
      expect(result).toBe('<p><a href="https://example.com">Example</a></p>\n');
    });

    it('should handle links with title attribute when openLinksInNewTab is true', () => {
      const parser = new Parser({ openLinksInNewTab: true });
      const result = parser.parse('[Example](https://example.com "Example Title")');
      expect(result).toBe(
        '<p><a href="https://example.com" title="Example Title" target="_blank" rel="noopener noreferrer">Example</a></p>\n',
      );
    });

    it('should handle multiple links in content', () => {
      const parser = new Parser({ openLinksInNewTab: true });
      const result = parser.parse(
        '[Link1](https://example1.com) and [Link2](https://example2.com)',
      );
      expect(result).toBe(
        '<p><a href="https://example1.com" target="_blank" rel="noopener noreferrer">Link1</a> and <a href="https://example2.com" target="_blank" rel="noopener noreferrer">Link2</a></p>\n',
      );
    });

    it('should handle reference-style links', () => {
      const parser = new Parser({ openLinksInNewTab: true });
      const result = parser.parse('[Example][1]\n\n[1]: https://example.com');
      expect(result).toBe(
        '<p><a href="https://example.com" target="_blank" rel="noopener noreferrer">Example</a></p>\n',
      );
    });

    it('should work with custom marked config and openLinksInNewTab', () => {
      const parser = new Parser({
        markedConfig: { breaks: true },
        openLinksInNewTab: true,
      });
      const result = parser.parse('[Example](https://example.com)');
      expect(result).toBe(
        '<p><a href="https://example.com" target="_blank" rel="noopener noreferrer">Example</a></p>\n',
      );
    });
  });

  describe('protectCustomTagNewlines', () => {
    it('should protect newlines inside custom tags when protectCustomTagNewlines is true', () => {
      const parser = new Parser({
        protectCustomTagNewlines: true,
        components: { CustomComponent: 'div' },
      });
      const content = '<CustomComponent>First line\n\nSecond line</CustomComponent>';
      const result = parser.parse(content);
      expect(result).toContain('<CustomComponent>First line\n\nSecond line</CustomComponent>');
      expect(result).not.toMatch(/<CustomComponent>First line<\/p>\s*<p>Second line/);
    });

    it('should not protect newlines when protectCustomTagNewlines is false', () => {
      const parser = new Parser({
        protectCustomTagNewlines: false,
        components: { CustomComponent: 'div' },
      });
      const content = '<CustomComponent>First line\n\nSecond line</CustomComponent>';
      const result = parser.parse(content);
      expect(result).toContain('<p>');
    });

    it('should work normally when protectCustomTagNewlines is true but no custom components', () => {
      const parser = new Parser({
        protectCustomTagNewlines: true,
      });
      const result = parser.parse('This is a paragraph.\n\nThis is another paragraph.');
      expect(result).toBe('<p>This is a paragraph.</p>\n<p>This is another paragraph.</p>\n');
    });

    it('should handle multiple custom tags', () => {
      const parser = new Parser({
        protectCustomTagNewlines: true,
        components: { CustomComponent1: 'div', CustomComponent2: 'span' },
      });
      const content =
        '<CustomComponent1>First\n\nSecond</CustomComponent1> and <CustomComponent2>Third\n\nFourth</CustomComponent2>';
      const result = parser.parse(content);
      expect(result).toContain('<CustomComponent1>First\n\nSecond</CustomComponent1>');
      expect(result).toContain('<CustomComponent2>Third\n\nFourth</CustomComponent2>');
    });

    it('should only protect newlines in outermost custom tags', () => {
      const parser = new Parser({
        protectCustomTagNewlines: true,
        components: { Outer: 'div', Inner: 'span' },
      });
      const content = '<Outer>Outer start\n<Inner>Inner\n\ncontent</Inner>\n\nOuter end</Outer>';
      const result = parser.parse(content);
      expect(result).toContain(
        '<Outer>Outer start\n<Inner>Inner\n\ncontent</Inner>\n\nOuter end</Outer>',
      );
    });

    it('should handle custom tags with attributes', () => {
      const parser = new Parser({
        protectCustomTagNewlines: true,
        components: { CustomComponent: 'div' },
      });
      const content = '<CustomComponent class="test">First line\n\nSecond line</CustomComponent>';
      const result = parser.parse(content);
      expect(result).toContain('class="test"');
      expect(result).toContain('First line\n\nSecond line');
    });

    it('should handle self-closing custom tags', () => {
      const parser = new Parser({
        protectCustomTagNewlines: true,
        components: { CustomComponent: 'div' },
      });
      const content = '<CustomComponent /> and <CustomComponent>Content\n\nhere</CustomComponent>';
      const result = parser.parse(content);
      expect(result).toContain('<CustomComponent />');
      expect(result).toContain('<CustomComponent>Content\n\nhere</CustomComponent>');
    });

    it('should protect newlines only in custom tags, not in regular markdown', () => {
      const parser = new Parser({
        protectCustomTagNewlines: true,
        components: { CustomComponent: 'div' },
      });
      const content =
        'Regular paragraph.\n\n<CustomComponent>Custom\n\ncontent</CustomComponent>\n\nAnother paragraph.';
      const result = parser.parse(content);
      expect(result).toContain('<p>Regular paragraph.</p>');
      expect(result).toContain('<CustomComponent>Custom\n\ncontent</CustomComponent>');
      expect(result).toContain('<p>Another paragraph.</p>');
    });

    it('should handle custom tags without double newlines', () => {
      const parser = new Parser({
        protectCustomTagNewlines: true,
        components: { CustomComponent: 'div' },
      });
      const content = '<CustomComponent>Single line content</CustomComponent>';
      const result = parser.parse(content);
      expect(result).toContain('<CustomComponent>Single line content</CustomComponent>');
    });

    it('should keep block markdown parsing behavior when only protectCustomTagNewlines is enabled', () => {
      const parser = new Parser({
        protectCustomTagNewlines: true,
        components: { think: 'div' },
      });
      const content =
        '<think>The user is asking what I can do.\n\nKey capabilities:\n1. one\n2. two\n</think>正文内容开始';
      const result = parser.parse(content);

      expect(result).toContain('<ol>');
      expect(result).toContain('<li>one</li>');
      expect(result).toContain('正文内容开始');
    });

    it('should keep ordered list markup inside custom tags intact when disableCustomTagBlockMarkdown is enabled', () => {
      const parser = new Parser({
        disableCustomTagBlockMarkdown: true,
        components: { think: 'div' },
      });
      const content =
        '<think>The user is asking what I can do.\n\nKey capabilities:\n1. one\n2. two\n</think>正文内容开始';
      const result = parser.parse(content);

      expect(result).toContain(
        '<think>The user is asking what I can do.\n\nKey capabilities:\n1. one\n2. two\n</think>',
      );
      expect(result).toContain('正文内容开始');
      expect(result).not.toContain('<ol>');
      expect(result).not.toContain('<li>');
    });

    it('should still parse inline markdown when disableCustomTagBlockMarkdown is enabled', () => {
      const parser = new Parser({
        disableCustomTagBlockMarkdown: true,
        components: { think: 'div' },
      });
      const content = '<think>line a\n**bold**\nline c</think>tail';
      const result = parser.parse(content);

      expect(result).toContain('<think>line a\n<strong>bold</strong>\nline c</think>');
      expect(result).not.toContain('<ol>');
      expect(result).not.toMatch(/X_MD_NL_/);
    });
  });

  describe('escapeHtml', () => {
    it('should escape HTML when encode is false or undefined and contains special characters', () => {
      expect(escapeHtml('test<script>alert("xss")</script>', false)).toBe(
        'test&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;',
      );
      expect(escapeHtml('test<script>', undefined)).toBe('test&lt;script&gt;');
    });
  });

  // Regression for CJK-friendly strong emphasis (#2038). marked's CommonMark
  // flanking rule keeps `**` literal when next to punctuation, which breaks
  // common Chinese/Japanese output like 写作**"加粗"**表示.
  describe('CJK-friendly strong emphasis', () => {
    it('renders bold when ** is immediately followed by ASCII double quotes', () => {
      const parser = new Parser();
      const result = parser.parse('写作**"加粗"**表示');
      expect(result).toContain('<strong>"加粗"</strong>');
      expect(result).not.toContain('**');
    });

    it('renders bold when ** is immediately followed by fullwidth double quotes', () => {
      const parser = new Parser();
      const result = parser.parse('写作**“加粗”**表示');
      expect(result).toContain('<strong>“加粗”</strong>');
      expect(result).not.toContain('**');
    });

    it('renders bold when ** is immediately followed by fullwidth single quotes', () => {
      const parser = new Parser();
      const result = parser.parse('写作**‘加粗’**表示');
      expect(result).toContain('<strong>‘加粗’</strong>');
    });

    it('renders bold when ** wraps a fullwidth-parenthesized term', () => {
      const parser = new Parser();
      const result = parser.parse('写作**（加粗）**表示');
      expect(result).toContain('<strong>（加粗）</strong>');
    });

    it('renders bold when ** wraps an ASCII-parenthesized term', () => {
      const parser = new Parser();
      const result = parser.parse('写作**(加粗)**表示');
      expect(result).toContain('<strong>(加粗)</strong>');
    });

    it('renders bold for Japanese and Korean adjacent to quotes', () => {
      const parser = new Parser();
      expect(parser.parse('これは**“太字”**です')).toContain('<strong>“太字”</strong>');
      expect(parser.parse('이것은**“굵게”**입니다')).toContain('<strong>“굵게”</strong>');
    });

    it('keeps plain CJK bold working (no regression)', () => {
      const parser = new Parser();
      expect(parser.parse('这是**加粗**测试')).toContain('<strong>加粗</strong>');
    });

    it('keeps plain ASCII bold and intraword bold working (no regression)', () => {
      const parser = new Parser();
      expect(parser.parse('plain **bold** text')).toContain('<strong>bold</strong>');
      expect(parser.parse('foo**bar**baz')).toContain('<strong>bar</strong>');
    });

    it('keeps nested em inside strong working (no regression)', () => {
      const parser = new Parser();
      expect(parser.parse('**bold *italic* inside**')).toContain('<strong>bold <em>italic</em> inside</strong>');
    });

    it('does not leak the boundary sentinel into the output', () => {
      const parser = new Parser();
      const result = parser.parse('写作**“加粗”**表示');
      // PUA sentinel used internally must be stripped before returning.
      expect(result).not.toMatch(/\uE000|\uE001|\uE002/);
    });

    it('keeps ** literal inside fenced code (no regression)', () => {
      const parser = new Parser();
      const result = parser.parse('```\n**not bold**\n```');
      expect(result).not.toContain('<strong>');
      expect(result).toContain('**not bold**');
    });

    it('keeps ** literal inside inline code (no regression)', () => {
      const parser = new Parser();
      const result = parser.parse('`src/**/*.ts`');
      expect(result).not.toContain('<strong>');
      expect(result).toContain('src/**/*.ts');
    });

    it('produces balanced <strong> across all streaming prefixes', () => {
      const parser = new Parser();
      const sentence = '写作**“加粗”**表示。';
      for (let i = 1; i <= sentence.length; i++) {
        const result = parser.parse(sentence.slice(0, i));
        const open = (result.match(/<strong>/g) || []).length;
        const close = (result.match(/<\/strong>/g) || []).length;
        expect(open).toBe(close);
      }
    });

    // Regression: user-supplied U+E002 in input must survive parsing — only
    // sentinels inserted by relaxEmphasis should be stripped.
    it('preserves user-supplied U+E002 characters in the output', () => {
      const parser = new Parser();
      const input = '普通文字\uE002中间有哨兵';
      const result = parser.parse(input);
      expect(result).toContain('\uE002');
      // Content other than the sentinel must not be lost either.
      expect(result).toContain('普通文字');
      expect(result).toContain('中间有哨兵');
    });

    // Regression: a pre-existing placeholder-shaped sequence in the source must
    // not collide with generated placeholders (which start at counter 0).
    it('does not collide with a pre-existing placeholder-shaped sequence', () => {
      const parser = new Parser();
      // \uE000X_MD_EB_0\uE001 is the exact shape of the first generated key.
      const input = '\uE000X_MD_EB_0\uE001\uE002';
      const result = parser.parse(input);
      expect(result).toContain('\uE000X_MD_EB_0\uE001');
      expect(result).toContain('\uE002');
    });

    it('does not collide when multiple U+E002 are protected', () => {
      const parser = new Parser();
      const input = 'a\uE000X_MD_EB_0\uE001b\uE002c\uE002d';
      const result = parser.parse(input);
      expect(result).toContain('a\uE000X_MD_EB_0\uE001b');
      expect(result).toContain('c\uE002d');
    });

    // Regression: triple-emphasis delimiters (*** / ___) must not be split —
    // relaxEmphasis should not insert a sentinel inside them.
    it('does not insert boundary inside triple *** delimiter', () => {
      const parser = new Parser();
      const result = parser.parse('***"加粗"***');
      // marked should produce bold+italic, same as without preprocessing.
      expect(result).toContain('<strong>');
      expect(result).toContain('<em>');
    });

    it('does not insert boundary inside triple ___ delimiter', () => {
      const parser = new Parser();
      const result = parser.parse('___"加粗"___');
      expect(result).toContain('<strong>');
      expect(result).toContain('<em>');
    });

    it('keeps plain triple emphasis working (no regression)', () => {
      const parser = new Parser();
      expect(parser.parse('***bold***')).toContain('<em><strong>bold</strong></em>');
    });
  });
});
