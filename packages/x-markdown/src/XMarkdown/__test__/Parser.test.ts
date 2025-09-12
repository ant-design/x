import Parser from '../core/Parser';

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
});
