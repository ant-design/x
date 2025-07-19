import { Marked, Renderer, Tokens } from 'marked';
import { XMarkdownProps } from '../interface';

type ParserOptions = {
  markedConfig?: XMarkdownProps['config'];
  paragraphTag?: string;
};

class Parser {
  options: ParserOptions;
  markdownParser: Marked;

  constructor(options: ParserOptions = {}) {
    const { markedConfig = {} } = options;
    this.options = options;
    this.markdownParser = new Marked(markedConfig);
    this.configureParagraph();
  }

  public configureParagraph() {
    const { paragraphTag } = this.options;
    if (!paragraphTag) return;

    const renderer = {
      paragraph(this: Renderer, { tokens }: Tokens.Paragraph) {
        return `<${paragraphTag}>${this.parser.parseInline(tokens)}</${paragraphTag}>\n`;
      },
    };
    this.markdownParser.use({ renderer });
  }

  public parse(content: string) {
    return this.markdownParser.parse(content) as string;
  }
}

export default Parser;
