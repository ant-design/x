import { Marked } from 'marked';
import { XMarkdownProps } from '../interface';

type ParserOptions = XMarkdownProps['config'];

class Parser {
  options: ParserOptions;
  markdownParser: Marked;

  constructor(options: ParserOptions = {}) {
    this.options = options;
    this.markdownParser = new Marked(options);
  }

  public parse(content: string) {
    return this.markdownParser.parse(content) as string;
  }
}

export default Parser;
