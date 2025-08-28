import Parser from '../Parser';

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
    expect(result).toBe('<section>This is the first paragraph.</section>\n<section>This is the second paragraph.</section>\n');
  });
});
