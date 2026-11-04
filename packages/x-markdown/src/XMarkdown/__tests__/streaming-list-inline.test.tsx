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
    // A settled task marker is "[ ]/[x]/[X]" followed by whitespace, so these
    // commit as plain list text rather than handing over as a link.
    it('empty task marker with text', () => expectOutput('- [ ] buy milk', '- [ ] buy milk'));
    it('checked task marker with text', () => expectOutput('- [x] done', '- [x] done'));
    it('uppercase checked marker with text', () => expectOutput('- [X] done', '- [X] done'));
    it('task marker followed by a trailing space', () => expectOutput('- [ ] ', '- [ ] '));

    // A bare marker ("- [x]" with nothing after the "]") is ambiguous mid-stream:
    // it may still become a task item ("- [x] text") or a link ("- [x](url)"), so
    // it is held pending until the next char decides. This blank is transient and
    // resolves once streaming completes (hasNextChunk is false -> raw input).
    it('bare marker is held pending mid-stream', () => expectOutput('- [x]', ''));
    it('bare marker renders once streaming completes', () => {
      const done = {
        streaming: { hasNextChunk: false as const },
        components: withPlaceholders.components,
      };
      const { container } = render(<TestComponent input="- [x]" config={done} />);
      expect(container.textContent).toBe('- [x]');
    });
  });

  describe('#1988 single-char-label links after a marker (CodeRabbit)', () => {
    // "[x](url)" is a link whose label happens to be "x" — it must NOT be swallowed
    // by the task-marker rule. Verified for lower/upper/space labels.
    it('checked-looking label is a link', () =>
      expectOutput('- [x](htt', `- <incomplete-link data-raw="${raw('[x](htt')}" />`));
    it('uppercase-looking label is a link', () =>
      expectOutput('- [X](htt', `- <incomplete-link data-raw="${raw('[X](htt')}" />`));
    it('space-looking label is a link', () =>
      expectOutput('- [ ](htt', `- <incomplete-link data-raw="${raw('[ ](htt')}" />`));
  });

  describe('no regression', () => {
    it('plain list item', () => expectOutput('- plain text', '- plain text'));
    it('bare link (no list) still works', () =>
      expectOutput('[text](htt', `<incomplete-link data-raw="${raw('[text](htt')}" />`));
  });
});
