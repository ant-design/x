import { render } from '@testing-library/react';
import React from 'react';
import { useStreaming } from '../hooks';
import type { XMarkdownProps } from '../interface';

// Regression for #1988: an inline construct (link / image / inline code) that
// starts immediately after a list marker used to be committed as raw markdown,
// because the list recognizer only handed over to inline code (backticks).
// GFM task markers ([ ]/[x]/[X]) must still render as list text, not links.

const TestComponent = ({
  input,
  config,
}: {
  input: string;
  config?: { streaming: XMarkdownProps['streaming']; components?: XMarkdownProps['components'] };
}) => <div>{useStreaming(input, config)}</div>;

const withPlaceholders = {
  streaming: { hasNextChunk: true as const },
  components: {
    'incomplete-link': () => null,
    'incomplete-image': () => null,
    'incomplete-inline-code': () => null,
  },
};

const raw = (s: string) => encodeURIComponent(s);

const expectOutput = (input: string, output: string) => {
  const { container } = render(<TestComponent input={input} config={withPlaceholders} />);
  expect(container.textContent).toBe(output);
};

describe('#1988 inline construct right after a list marker', () => {
  it('renders a link placeholder for a list item (the reported bug)', () => {
    expectOutput('- [text](htt', `- <incomplete-link data-raw="${raw('[text](htt')}" />`);
  });

  it('renders an image placeholder for a list item (no orphaned "!")', () => {
    expectOutput('- ![alt](htt', `- <incomplete-image data-raw="${raw('![alt](htt')}" />`);
  });

  it('still hands over to inline code (existing behavior)', () => {
    expectOutput('- `code', `- <incomplete-inline-code data-raw="${raw('`code')}" />`);
  });

  describe('GFM task lists must NOT become link placeholders', () => {
    it('empty task marker', () => expectOutput('- [ ]', '- [ ]'));
    it('checked task marker', () => expectOutput('- [x]', '- [x]'));
    it('uppercase checked marker', () => expectOutput('- [X]', '- [X]'));
    it('task marker with text', () => expectOutput('- [ ] buy milk', '- [ ] buy milk'));
  });

  describe('no regression', () => {
    it('plain list item', () => expectOutput('- plain text', '- plain text'));
    it('bare link (no list) still works', () =>
      expectOutput('[text](htt', `<incomplete-link data-raw="${raw('[text](htt')}" />`));
  });
});
