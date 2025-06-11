import { ReactNode } from 'react';
import { Token } from '../interface';
import Renderer from './Renderer';
import { MarkedOptions, Parser as MarkedParser } from 'marked';

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

  parse(tokens?: Token[]): ReactNode[] {
    if (!Array.isArray(tokens) || !tokens.length) {
      return [];
    }
    return tokens.map((token) => {
      try {
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
          case 'space': {
            return null;
          }
          case 'hr': {
            return this.renderer.hr(token);
          }
          case 'heading': {
            return this.renderer.heading(token);
          }
          case 'code': {
            return this.renderer.code(token);
          }
          case 'table': {
            return this.renderer.table(token);
          }
          case 'blockquote': {
            return this.renderer.blockquote(token);
          }
          case 'list': {
            return this.renderer.list(token);
          }
          case 'html': {
            return this.renderer.html(token);
          }
          case 'paragraph': {
            return this.renderer.paragraph(token);
          }
          case 'text': {
            return this.renderer.text(token);
          }
          default: {
            const errMsg = 'Block token with "' + token.type + '" type was not found.';
            console.error(errMsg);
            return '';
          }
        }
      } catch (error) {
        const errMsg = 'Block token with "' + token.type + ', error: ' + error;
        console.error(errMsg);
        return '';
      }
    });
  }

  parseInline(tokens?: Token[]): ReactNode[] {
    if (!Array.isArray(tokens) || !tokens.length) {
      return [];
    }
    return tokens.map((token) => {
      try {
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
          case 'escape': {
            return token.text;
          }
          case 'html': {
            return this.renderer.html(token);
          }
          case 'link': {
            return this.renderer.link(token);
          }
          case 'image': {
            return this.renderer.image(token);
          }
          case 'strong': {
            return this.renderer.strong(token);
          }
          case 'em': {
            return this.renderer.em(token);
          }
          case 'codespan': {
            return this.renderer.codespan(token);
          }
          case 'br': {
            return this.renderer.br(token);
          }
          case 'del': {
            return this.renderer.del(token);
          }
          case 'text': {
            return this.renderer.text(token);
          }
          default: {
            const errMsg = 'Inline token with "' + token.type + '" type was not found.';
            console.error(errMsg);
            return '';
          }
        }
      } catch (error) {
        const errMsg = 'Inline token with "' + token.type + ', error: ' + error;
        console.error(errMsg);
        return '';
      }
    });
  }
}

export default Parser;
