import { ElementType, ReactNode } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import { Token } from '../interface';
import Parser from './Parser';
import { jsx, jsxs } from 'react/jsx-runtime';
import { Tokens } from 'marked';
import { unescape } from './helpers';

type HeadingDepth = 1 | 2 | 3 | 4 | 5 | 6;

class Renderer {
  parser!: Parser;
  #elementMap: Map<string, number>;

  constructor() {
    this.#elementMap = new Map();
  }

  #getElementKey<T extends ElementType>(element: T) {
    const elementName =
      typeof element === 'string' ? element : element?.name || element?.displayName || 'Element';

    const elementCount = this.#elementMap.get(elementName) || 0;
    this.#elementMap.set(elementName, elementCount + 1);
    return elementName + '-' + elementCount;
  }

  #render<T extends ElementType>(
    element: T,
    children: ReactNode = null,
    props: { key?: React.Key; [k: string]: unknown } = {},
  ): ReactNode {
    const renderFunc = Array.isArray(children) ? jsxs : jsx;
    return renderFunc(element, { children, ...props }, props?.key || this.#getElementKey(element));
  }

  hr(_token: Token) {
    return this.#render('hr');
  }

  heading(token: Token) {
    const children = token.tokens ? this.parser.parseInline(token.tokens) : null;
    const depth = token.depth as HeadingDepth;

    return this.#render(`h${depth}`, children);
  }

  codespan(token: Token) {
    const { text } = token as Tokens.Codespan;
    return this.#render('code', unescape(text));
  }

  code(token: Token) {
    return this.#render('pre', this.codespan(token));
  }

  tableCell(token: Tokens.TableCell) {
    const children = this.parser?.parseInline(token.tokens);
    const type = token?.header ? 'th' : 'td';
    return this.#render(type, children, { align: token?.align });
  }

  tableRow(children: ReactNode[]) {
    return this.#render('tr', children);
  }

  tableHeader(children: ReactNode) {
    return this.#render('thead', children);
  }

  tableBody(children: ReactNode) {
    return this.#render('tbody', children);
  }

  table(token: Token) {
    const { header: tableHeader, rows } = token as Tokens.Table;
    const headerCell = tableHeader.map((cell) => this.tableCell(cell));
    const headerRow = this.tableRow(headerCell);
    const header = this.tableHeader(headerRow);

    const bodyCell = rows.map((row) => {
      const rowCell = row.map((cell) => this.tableCell(cell));
      return this.tableRow(rowCell);
    });
    const body = this.tableBody(bodyCell);

    return this.#render('table', [header, body]);
  }

  blockquote(token: Token) {
    const children = this.parser.parse(token?.tokens);
    return this.#render('blockquote', children);
  }

  checkbox(token: Tokens.ListItem) {
    return this.#render('input', null, {
      type: 'checkbox',
      checked: !!token?.checked,
      disabled: true,
    });
  }

  listItem(token: Tokens.ListItem) {
    const { task, tokens } = token;
    const children: ReactNode[] = [];
    if (task) {
      children.push(this.checkbox(token));
    }
    children.push(this.parser.parse(tokens));

    return this.#render('li', children);
  }

  list(token: Token) {
    const { ordered, start, items } = token as Tokens.List;
    const type = ordered ? 'ol' : 'ul';
    const children = items.map((item) => this.listItem(item));
    return this.#render(type, children, ordered && start !== -1 ? { start } : {});
  }

  html(token: Token) {
    // TODO: any better way?
    return this.#render('span', null, {
      dangerouslySetInnerHTML: { __html: DOMPurify.sanitize(token.raw) },
    });
  }

  paragraph(token: Token) {
    const children = this.parser.parseInline(token?.tokens);
    return this.#render('p', children);
  }

  text(token: Token) {
    const { text, tokens } = token;
    return tokens ? this.parser.parseInline(tokens) : unescape(text);
  }

  link(token: Token) {
    const { href, title, tokens } = token as Tokens.Link;
    const children = this.parser.parseInline(tokens);
    return this.#render('a', children, { href, title: title ? unescape(title) : '' });
  }

  image(token: Token) {
    const { href, text, title } = token as Tokens.Image;
    return this.#render('img', null, { src: href, alt: text, title });
  }

  strong(token: Token) {
    const children = this.parser.parseInline(token.tokens);
    return this.#render('strong', children);
  }

  em(token: Token) {
    const children = this.parser.parseInline(token.tokens);
    return this.#render('em', children);
  }

  br(_token: Token) {
    return this.#render('br');
  }

  del(token: Token) {
    const children = this.parser.parseInline(token.tokens);
    return this.#render('del', children);
  }
}

export default Renderer;
