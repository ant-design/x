import DOMPurify from 'dompurify';
import parseHtml, { domToReact } from 'html-react-parser';
import type { Tokens } from 'marked';
import { type ElementType, type ReactNode } from 'react';
import React from 'react';
import { jsx, jsxs } from 'react/jsx-runtime';
import type { Token, XMarkdownProps } from '../interface';
import Parser from './Parser';

type HeadingDepth = 1 | 2 | 3 | 4 | 5 | 6;

type RendererOptions = {
  components?: XMarkdownProps['components'];
  streaming?: XMarkdownProps['streaming'];
};

const unEscapeReplacements: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
};

const entityRegex = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/gi;

export const unescapeHtmlEntity = (text: string) => {
  return entityRegex.test(text)
    ? text.replace(entityRegex, (entity) => unEscapeReplacements[entity] || "'")
    : text;
};

class Renderer {
  parser!: Parser;
  #elementMap: Map<string, number>;
  options: RendererOptions;

  constructor(options?: RendererOptions) {
    this.#elementMap = new Map();
    this.options = options || {};
  }

  private getElementKey<T extends ElementType>(element: T) {
    const elementName =
      typeof element === 'string' ? element : element?.name || element?.displayName || 'Element';

    const elementCount = this.#elementMap.get(elementName) || 0;
    this.#elementMap.set(elementName, elementCount + 1);
    return `${elementName}-${elementCount}`;
  }

  private render<T extends ElementType>(
    element: T,
    children: ReactNode = null,
    props: { key?: React.Key; [k: string]: unknown } = {},
  ): ReactNode {
    const componentMap = this.options?.components;
    const renderElement =
      typeof element === 'string' && componentMap?.[element] ? componentMap[element] : element;

    const renderFunc = Array.isArray(children) ? jsxs : jsx;
    return renderFunc(
      renderElement,
      { children, ...props },
      props?.key || this.getElementKey(renderElement),
    );
  }

  public hr(_token: Token) {
    return this.render('hr');
  }

  public heading(token: Token) {
    const children = token.tokens ? this.parser.parseInline(token.tokens) : null;
    const depth = token.depth as HeadingDepth;

    return this.render(`h${depth}`, children);
  }

  public codespan(token: Token) {
    const { text, lang } = token;
    const className = lang ? `language-${lang}` : undefined;
    return this.render('code', unescapeHtmlEntity(text), { className, lang });
  }

  public code(token: Token) {
    return this.render('pre', this.codespan(token));
  }

  public tableCell(token: Tokens.TableCell) {
    const children = this.parser?.parseInline(token.tokens);
    const type = token?.header ? 'th' : 'td';
    return this.render(type, children, { align: token?.align });
  }

  public tableRow(children: ReactNode[]) {
    return this.render('tr', children);
  }

  public tableHeader(children: ReactNode) {
    return this.render('thead', children);
  }

  public tableBody(children: ReactNode) {
    return this.render('tbody', children);
  }

  public table(token: Token) {
    const { header: tableHeader, rows } = token as Tokens.Table;
    const headerCell = tableHeader.map((cell) => this.tableCell(cell));
    const headerRow = this.tableRow(headerCell);
    const header = this.tableHeader(headerRow);

    const bodyCell = rows.map((row) => {
      const rowCell = row.map((cell) => this.tableCell(cell));
      return this.tableRow(rowCell);
    });
    const body = this.tableBody(bodyCell);

    return this.render('table', [header, body]);
  }

  public blockquote(token: Token) {
    const children = this.parser.parse(token?.tokens);
    return this.render('blockquote', children);
  }

  public checkbox(token: Tokens.ListItem) {
    return this.render('input', null, {
      type: 'checkbox',
      checked: !!token?.checked,
      disabled: true,
    });
  }

  public listItem(token: Tokens.ListItem) {
    const { task, tokens } = token;
    const children: ReactNode[] = [];
    if (task) {
      children.push(this.checkbox(token));
    }
    children.push(this.parser.parse(tokens));

    return this.render('li', children);
  }

  public list(token: Token) {
    const { ordered, start, items } = token as Tokens.List;
    const type = ordered ? 'ol' : 'ul';
    const children = items.map((item) => this.listItem(item));
    return this.render(type, children, ordered && start !== -1 ? { start } : {});
  }

  private replaceHtml(token: Token) {
    const { raw, tag } = token;
    const componentsMap = this.options.components;
    // don't sanitize custom component
    const htmlRenderer = componentsMap?.[tag];
    const cleanedRaw = htmlRenderer ? raw : DOMPurify.sanitize(raw);

    const options = {
      replace(domNode: Record<string, any>) {
        const { attribs, children, name } = domNode;
        if (!name) return null;

        const renderElement = htmlRenderer ? htmlRenderer : name;
        return jsx(renderElement, { children: domToReact(children), ...attribs });
      },
    };

    return parseHtml(cleanedRaw, htmlRenderer ? options : {});
  }

  public html(token: Token) {
    return this.replaceHtml(token);
  }

  public nonSelfClosingHtml(token: Token) {
    return this.replaceHtml(token);
  }

  public paragraph(token: Token) {
    const children = this.parser.parseInline(token?.tokens);
    return this.render('div', children, { className: 'xmarkdown-p' });
  }

  public text(token: Token) {
    const { text, tokens } = token;
    if (tokens) {
      return this.parser.parseInline(tokens);
    }
    const unescapedText = unescapeHtmlEntity(text);
    return unescapedText;
  }

  public link(token: Token) {
    const { href, title, tokens } = token as Tokens.Link;
    const children = this.parser.parseInline(tokens);
    const props: Record<string, unknown> = { href };
    if (title) {
      props.title = unescapeHtmlEntity(title);
    }
    return this.render('a', children, props);
  }

  public image(token: Token) {
    const { href, text, title } = token as Tokens.Image;
    return this.render('img', null, { src: href, alt: text, title });
  }

  public strong(token: Token) {
    const children = this.parser.parseInline(token.tokens);
    return this.render('strong', children);
  }

  public em(token: Token) {
    const children = this.parser.parseInline(token.tokens);
    return this.render('em', children);
  }

  public br(_token: Token) {
    return this.render('br');
  }

  public del(token: Token) {
    const children = this.parser.parseInline(token.tokens);
    return this.render('del', children);
  }
}

export default Renderer;
