import React, { useMemo } from 'react';
import type { Parser, Renderer } from './core';

export interface SectionProps {
  /** Markdown source of this section */
  content: string;
  parser: Parser;
  renderer: Renderer;
  /** Whether the streaming tail is appended to this section (only the last one) */
  injectTail: boolean;
}

/**
 * One section of an incrementally rendered document. Memoised on its source
 * string: while streaming, every section but the last keeps the same string
 * from chunk to chunk, so React skips this component entirely for them and
 * marked, DOMPurify, html-react-parser and reconciliation run only for the
 * section that is still growing.
 *
 * Renders a fragment so the DOM is exactly what rendering the whole document
 * at once would produce.
 */
const Section = React.memo<SectionProps>(({ content, parser, renderer, injectTail }) => {
  const html = useMemo(() => parser.parse(content, { injectTail }), [content, parser, injectTail]);
  const node = useMemo(() => (html ? renderer.render(html) : null), [html, renderer]);
  return <>{node}</>;
});

if (process.env.NODE_ENV !== 'production') {
  Section.displayName = 'XMarkdownSection';
}

export default Section;
