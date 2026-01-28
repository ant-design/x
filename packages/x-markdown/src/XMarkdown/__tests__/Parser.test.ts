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

    it('should not add target and rel attributes when openLinksInNewTab is false or not provided', () => {
      const parser1 = new Parser({ openLinksInNewTab: false });
      const parser2 = new Parser();
      const expected = '<p><a href="https://example.com">Example</a></p>\n';
      expect(parser1.parse('[Example](https://example.com)')).toBe(expected);
      expect(parser2.parse('[Example](https://example.com)')).toBe(expected);
    });

    it('should handle links with title attribute when openLinksInNewTab is true', () => {
      const parser = new Parser({ openLinksInNewTab: true });
      const result = parser.parse('[Example](https://example.com "Example Title")');
      expect(result).toBe(
        '<p><a href="https://example.com" title="Example Title" target="_blank" rel="noopener noreferrer">Example</a></p>\n',
      );
    });

    it('should handle reference-style links', () => {
      const parser = new Parser({ openLinksInNewTab: true });
      const result = parser.parse('[Example][1]\n\n[1]: https://example.com');
      expect(result).toBe(
        '<p><a href="https://example.com" target="_blank" rel="noopener noreferrer">Example</a></p>\n',
      );
    });
  });

  describe('protectCustomTagNewlines', () => {
    it('should protect double newlines inside custom tags (block separation)', () => {
      const parser = new Parser({
        protectCustomTagNewlines: true,
        components: { CustomComponent: 'div' },
      });
      const result = parser.parse('<CustomComponent>First line\n\nSecond line</CustomComponent>');
      expect(result).toContain('<CustomComponent>First line\n\nSecond line</CustomComponent>');
      expect(result).not.toMatch(/<CustomComponent>First line<\/p>\s*<p>Second line/);
    });

    it('single newline alone does not cause block separation per CommonMark spec', () => {
      const parserWithProtect = new Parser({
        protectCustomTagNewlines: true,
        components: { CustomComponent: 'div' },
      });
      const parserWithoutProtect = new Parser({
        protectCustomTagNewlines: false,
        components: { CustomComponent: 'div' },
      });
      const content = '<CustomComponent>Line1\nLine2</CustomComponent>';

      const resultWith = parserWithProtect.parse(content);
      const resultWithout = parserWithoutProtect.parse(content);

      expect(resultWith).toContain('<CustomComponent>Line1\nLine2</CustomComponent>');
      expect(resultWithout).toContain('<CustomComponent>Line1\nLine2</CustomComponent>');
    });

    it('why protect all newlines: \\n followed by list marker causes block change', () => {
      const parserWithProtect = new Parser({
        protectCustomTagNewlines: true,
        components: { CustomComponent: 'div' },
      });
      const parserWithoutProtect = new Parser({
        protectCustomTagNewlines: false,
        components: { CustomComponent: 'div' },
      });
      const content = '<CustomComponent>Text\n- item1</CustomComponent>';

      const resultWithout = parserWithoutProtect.parse(content);
      expect(resultWithout).toContain('<ul>');
      expect(resultWithout).toContain('<li>');

      const resultWith = parserWithProtect.parse(content);
      expect(resultWith).toContain('<CustomComponent>Text\n- item1</CustomComponent>');
      expect(resultWith).not.toContain('<ul>');
    });

    it('why protect all newlines: \\n followed by ordered list marker causes block change', () => {
      const parserWithProtect = new Parser({
        protectCustomTagNewlines: true,
        components: { CustomComponent: 'div' },
      });
      const parserWithoutProtect = new Parser({
        protectCustomTagNewlines: false,
        components: { CustomComponent: 'div' },
      });
      const content = '<CustomComponent>Text\n1. first</CustomComponent>';

      const resultWithout = parserWithoutProtect.parse(content);
      expect(resultWithout).toContain('<ol>');
      expect(resultWithout).toContain('<li>');

      const resultWith = parserWithProtect.parse(content);
      expect(resultWith).toContain('<CustomComponent>Text\n1. first</CustomComponent>');
      expect(resultWith).not.toContain('<ol>');
    });

    it('why protect all newlines: \\n followed by heading marker causes block change', () => {
      const parserWithProtect = new Parser({
        protectCustomTagNewlines: true,
        components: { CustomComponent: 'div' },
      });
      const parserWithoutProtect = new Parser({
        protectCustomTagNewlines: false,
        components: { CustomComponent: 'div' },
      });
      const content = '<CustomComponent>Text\n# heading</CustomComponent>';

      const resultWithout = parserWithoutProtect.parse(content);
      expect(resultWithout).toContain('<h1>');

      const resultWith = parserWithProtect.parse(content);
      expect(resultWith).toContain('<CustomComponent>Text\n# heading</CustomComponent>');
      expect(resultWith).not.toContain('<h1>');
    });

    it('why protect all newlines: \\n followed by code fence causes block change', () => {
      const parserWithProtect = new Parser({
        protectCustomTagNewlines: true,
        components: { CustomComponent: 'div' },
      });
      const parserWithoutProtect = new Parser({
        protectCustomTagNewlines: false,
        components: { CustomComponent: 'div' },
      });
      const content = '<CustomComponent>Text\n```\ncode\n```</CustomComponent>';

      const resultWithout = parserWithoutProtect.parse(content);
      expect(resultWithout).toMatch(/<pre>|<code>/);

      const resultWith = parserWithProtect.parse(content);
      expect(resultWith).toContain('<CustomComponent>');
      expect(resultWith).toContain('code');
      expect(resultWith).not.toContain('<pre>');
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

    it('blockquote marker (>) inside custom tags is escaped by marked', () => {
      const parser = new Parser({
        protectCustomTagNewlines: true,
        components: { CustomComponent: 'div' },
      });
      const content = '<CustomComponent>Text\n> quote here</CustomComponent>';
      const result = parser.parse(content);
      expect(result).toContain('&gt;');
      expect(result).not.toContain('<blockquote>');
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

    it('should handle empty custom tag content (protectNewlines falsy guard)', () => {
      const parser = new Parser({
        protectCustomTagNewlines: true,
        components: { CustomComponent: 'div' },
      });
      const content = '<CustomComponent></CustomComponent>';
      const result = parser.parse(content);
      expect(result).toContain('<CustomComponent></CustomComponent>');
    });

    it('should handle unclosed custom tag and protect newlines', () => {
      const parser = new Parser({
        protectCustomTagNewlines: true,
        components: { CustomComponent: 'div' },
      });
      const result1 = parser.parse('<CustomComponent>Line1\nLine2');
      expect(result1).toContain('<CustomComponent>');
      expect(result1).toContain('Line1\nLine2');

      const result2 = parser.parse('Before <CustomComponent>Inner\nmore');
      expect(result2).toContain('Before');
      expect(result2).toContain('<CustomComponent>');
      expect(result2).toContain('Inner\nmore');
    });

    it('should call restorePlaceholders with empty placeholders when no custom tags in content', () => {
      const parser = new Parser({
        protectCustomTagNewlines: true,
        components: { CustomComponent: 'div' },
      });
      const content = 'Just plain paragraph.\n\nAnother one.';
      const result = parser.parse(content);
      expect(result).toBe('<p>Just plain paragraph.</p>\n<p>Another one.</p>\n');
    });

    it('should handle mismatched close tag (inner closed before outer) as unclosed', () => {
      const parser = new Parser({
        protectCustomTagNewlines: true,
        components: { Outer: 'div', Inner: 'span' },
      });
      const content = '<Outer><Inner>text</Outer>';
      const result = parser.parse(content);
      expect(result).toContain('<Outer>');
      expect(result).toContain('<Inner>');
      expect(result).toContain('text');
    });
  });

  describe('escapeHtml', () => {
    it('should escape HTML when encode is false or undefined and contains special characters', () => {
      expect(escapeHtml('test<script>alert("xss")</script>', false)).toBe(
        'test&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;',
      );
      expect(escapeHtml('test<script>', undefined)).toBe('test&lt;script&gt;');
    });

    it('should return unchanged when no special characters', () => {
      expect(escapeHtml('plain text', true)).toBe('plain text');
      expect(escapeHtml('plain text', false)).toBe('plain text');
    });

    it('should escape when encode is true and contains &<>"\'', () => {
      expect(escapeHtml('a & b < c > d " e \' f', true)).toBe(
        'a &amp; b &lt; c &gt; d &quot; e &#39; f',
      );
    });
  });

  describe('code block (configureCodeRenderer)', () => {
    it('should render fenced code block with and without language', () => {
      const parser = new Parser();
      const result1 = parser.parse('```js\nconst x = 1;\n```');
      expect(result1).toContain('data-block="true"');
      expect(result1).toContain('data-state="done"');
      expect(result1).toContain('language-js');
      expect(result1).toContain('const x = 1;');

      const result2 = parser.parse('```\nconst x = 1;\n```');
      expect(result2).toContain('data-block="true"');
      expect(result2).not.toContain('language-');
      expect(result2).toContain('const x = 1;');
    });

    it('should render indented code block', () => {
      const parser = new Parser();
      const result = parser.parse('    const x = 1;');
      expect(result).toContain('<pre>');
      expect(result).toContain('data-state="done"');
    });
  });
});
