import { MarkedOptions, Parser as MarkedParser } from 'marked';
import { ReactNode } from 'react';
import { Token } from '../interface';
import Renderer from './Renderer';

interface ParserOptions {
  XRenderer: Renderer;
  extensions?: MarkedOptions['extensions'];
}

class Parser {
  renderer: Renderer;
  options: ParserOptions;

  constructor(options: ParserOptions) {
    this.options = options;
    this.renderer = options?.XRenderer || new Renderer();
    this.renderer.parser = this;
  }

  public parse(tokens?: Token[]): ReactNode[] {
    if (!Array.isArray(tokens) || !tokens.length) {
      return [];
    }
    return tokens.map((token) => {
      if (this.options.extensions?.renderers[token.type]) {
        const result = this.options.extensions.renderers[token.type].call(
          { parser: new MarkedParser(), XParser: this },
          token,
        );
        return token?.renderType === 'component'
          ? result
          : this.renderer.html({ type: 'html', raw: result || '', text: result });
      }

      switch (token.type) {
        case 'space':
          return null;
        case 'hr':
        case 'heading':
        case 'code':
        case 'table':
        case 'blockquote':
        case 'list':
        case 'html':
        case 'nonSelfClosingHtml':
        case 'paragraph':
        case 'text':
          if (typeof this.renderer[token.type as keyof Renderer] === 'function') {
            return this.renderer[token.type](token);
          }
          break;
        default:
          console.error(`Block token with "${token.type}" type was not found.`);
          return;
      }
    });
  }

  public parseInline(tokens?: Token[]): ReactNode[] {
    if (!Array.isArray(tokens) || !tokens.length) {
      return [];
    }
    return tokens.map((token) => {
      if (this.options.extensions?.renderers[token.type]) {
        const result = this.options.extensions.renderers[token.type].call(
          { parser: new MarkedParser(), XParser: this },
          token,
        );
        return token?.renderType === 'component'
          ? result
          : this.renderer.html({ type: 'html', raw: result || '', text: result });
      }

      switch (token.type) {
        case 'escape':
          return this.renderer.text(token);
        case 'html':
        case 'nonSelfClosingHtml':
        case 'link':
        case 'image':
        case 'strong':
        case 'em':
        case 'codespan':
        case 'br':
        case 'del':
        case 'text':
          if (typeof this.renderer[token.type as keyof Renderer] === 'function') {
            return this.renderer[token.type](token);
          }
          break;
        default:
          console.error(`Block token with "${token.type}" type was not found.`);
          return;
      }
    });
  }
}

export default Parser;
