import { Marked, Renderer, RendererObject, Tokens } from 'marked';
import { XMarkdownProps } from '../interface';

type ParserOptions = {
  markedConfig?: XMarkdownProps['config'];
  paragraphTag?: string;
  openLinksInNewTab?: boolean;
  configureRenderCleaner?: (content: string, type: keyof RendererObject) => string;
};

export const other = {
  escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,
  escapeTest: /[&<>"']/,
  notSpaceStart: /^\S*/,
  endingNewline: /\n$/,
  escapeReplace: /[&<>"']/g,
  escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,
  completeFencedCode: /^ {0,3}(`{3,}|~{3,})([\s\S]*?)\n {0,3}\1[ \n\t]*$/,
};

const escapeReplacements: { [index: string]: string } = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};
const getEscapeReplacement = (ch: string) => escapeReplacements[ch];

export function escapeHtml(html: string, encode?: boolean) {
  if (encode) {
    if (other.escapeTest.test(html)) {
      return html.replace(other.escapeReplace, getEscapeReplacement);
    }
  } else {
    if (other.escapeTestNoEncode.test(html)) {
      return html.replace(other.escapeReplaceNoEncode, getEscapeReplacement);
    }
  }

  return html;
}

class Parser {
  options: ParserOptions;
  markdownInstance: Marked;

  constructor(options: ParserOptions = {}) {
    const { markedConfig = {} } = options;
    this.options = options;
    this.markdownInstance = new Marked();

    this.configureLinkRenderer();
    this.configureParagraphRenderer(options.configureRenderCleaner);
    this.configureCodeRenderer(options.configureRenderCleaner);
    // user config at last
    this.markdownInstance.use(markedConfig);
  }

  private configureLinkRenderer() {
    if (!this.options.openLinksInNewTab) return;

    const renderer = {
      link(this: Renderer, { href, title, tokens }: Tokens.Link) {
        const text = this.parser.parseInline(tokens);
        const titleAttr = title ? ` title="${title}"` : '';
        return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`;
      },
    };
    this.markdownInstance.use({ renderer });
  }

  public configureParagraphRenderer(
    configureRenderCleaner: ParserOptions['configureRenderCleaner'] = (s) => s,
  ) {
    const { paragraphTag } = this.options;
    if (!paragraphTag) return;

    const renderer = {
      paragraph(this: Renderer, { tokens }: Tokens.Paragraph) {
        const code = `<${paragraphTag}>${this.parser.parseInline(tokens)}</${paragraphTag}>\n`;
        return configureRenderCleaner(code, 'paragraph');
      },
    };
    this.markdownInstance.use({ renderer });
  }

  public configureCodeRenderer(
    configureRenderCleaner: ParserOptions['configureRenderCleaner'] = (s) => s,
  ) {
    const renderer = {
      code({ text, raw, lang, escaped, codeBlockStyle }: Tokens.Code): string {
        const langString = (lang || '').match(other.notSpaceStart)?.[0];
        const code = `${text.replace(other.endingNewline, '')}\n`;
        const isIndentedCode = codeBlockStyle === 'indented';
        // if code is indented, it's done because it has no end tag
        const streamStatus =
          isIndentedCode || other.completeFencedCode.test(raw) ? 'done' : 'loading';

        const cleanedCode = configureRenderCleaner(code, 'code');
        const escapedCode = escaped ? cleanedCode : escapeHtml(cleanedCode, true);

        const classAttr = langString ? ` class="language-${escapeHtml(langString)}"` : '';

        return `<pre><code data-block="true" data-state="${streamStatus}"${classAttr}>${escapedCode}</code></pre>\n`;
      },
    };
    this.markdownInstance.use({ renderer });
  }

  public parse(content: string) {
    return this.markdownInstance.parse(content) as string;
  }
}

export default Parser;
