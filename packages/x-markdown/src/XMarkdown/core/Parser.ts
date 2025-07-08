import { Marked } from 'marked';
import { XMarkdownProps } from '../interface';

type ParserOptions = Pick<XMarkdownProps, 'plugins' | 'gfm' | 'breaks'>;

class Parser {
  options: ParserOptions;
  markdownParser: Marked;

  constructor(options: ParserOptions) {
    this.options = options;
    const { gfm = true, breaks = false, plugins } = options;
    this.markdownParser = new Marked({ gfm, breaks, ...plugins });
  }

  public parse(content: string) {
    return this.markdownParser.parse(content) as string;
  }
}

export default Parser;
