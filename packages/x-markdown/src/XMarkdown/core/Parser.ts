import { Marked, Renderer, Tokens } from 'marked';
import { XMarkdownProps } from '../interface';
import { escapeNewlinesInCustomTags, unescapeNewlinesInCustomTags } from '../utils';
import streamingProcessor from './StreamingProcessor';

type ParserOptions = {
  markedConfig?: XMarkdownProps['config'];
  paragraphTag?: string;
  openLinksInNewTab?: boolean;
  components?: XMarkdownProps['components'];
  protectCustomTagNewlines?: boolean;
  streaming?: XMarkdownProps['streaming'];
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
    this.configureParagraphRenderer();
    this.configureCodeRenderer();
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

  private configureParagraphRenderer() {
    const { paragraphTag } = this.options;
    if (!paragraphTag) return;

    const renderer = {
      paragraph(this: Renderer, { tokens }: Tokens.Paragraph) {
        return `<${paragraphTag}>${this.parser.parseInline(tokens)}</${paragraphTag}>\n`;
      },
    };
    this.markdownInstance.use({ renderer });
  }

  private configureCodeRenderer() {
    const renderer = {
      code({ text, raw, lang, escaped, codeBlockStyle }: Tokens.Code): string {
        const langString = (lang || '').match(other.notSpaceStart)?.[0];
        const code = `${text.replace(other.endingNewline, '')}\n`;
        const isIndentedCode = codeBlockStyle === 'indented';
        // if code is indented, it's done because it has no end tag
        const streamStatus =
          isIndentedCode || other.completeFencedCode.test(raw) ? 'done' : 'loading';
        const escapedCode = escaped ? code : escapeHtml(code, true);

        const classAttr = langString ? ` class="language-${escapeHtml(langString)}"` : '';

        return `<pre><code data-block="true" data-state="${streamStatus}"${classAttr}>${escapedCode}</code></pre>\n`;
      },
    };
    this.markdownInstance.use({ renderer });
  }

  private async parseMarkdownToHtml(markdown: string) {
    try {
      if (!this.options.protectCustomTagNewlines) {
        return await this.markdownInstance.parse(markdown);
      }

      const { protected: protectedContent, placeholders } = escapeNewlinesInCustomTags(
        markdown,
        this.options.components,
      );

      const parsed = await this.markdownInstance.parse(protectedContent);
      return unescapeNewlinesInCustomTags(parsed, placeholders);
    } catch (error) {
      console.log('error', error);
      return '';
    }
  }

  public async parse(markdown: string, callback: (html: string) => void) {
    const { hasNextChunk, semantic } = this.options.streaming || {};

    if (hasNextChunk || Boolean(semantic)) {
      await this.parseStreaming(markdown, callback);
    } else {
      callback(await this.parseMarkdownToHtml(markdown));
    }
  }

  public async parseStreaming(markdown: string, callback: (html: string) => void) {
    await streamingProcessor.process({
      markdown,
      onUpdate: async (streamingMarkdown: string) =>
        callback(await this.parseMarkdownToHtml(streamingMarkdown)),
      streaming: this.options.streaming,
      components: this.options.components,
    });
  }
}

export default Parser;
