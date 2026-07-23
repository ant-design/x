import { render } from '@testing-library/react';
import React from 'react';
import XMarkdown from '../index';
import { Parser, Renderer } from '../core';
import type { ComponentProps } from '../interface';

/**
 * Tests for Issue #1949: XMarkdown 多个自定义组件同时进入 loading
 *
 * Verifies that streamStatus (loading/done) is isolated per component instance,
 * not shared across all instances of the same tag name or across different tag names.
 *
 * Background:
 *   Before the fix (PR #1590), `detectUnclosedTags` returned a Set of tag NAMES
 *   (e.g. "my-comp"), and `createReplaceElement` checked `unclosedTags.has(name)`.
 *   If ANY instance of a tag was unclosed, ALL instances of that tag (and potentially
 *   all custom components) would receive `streamStatus: 'loading'`.
 *
 *   After the fix, `detectUnclosedComponentTags` returns a Set of instance IDs
 *   (e.g. "my-comp-2"), and `createReplaceElement` checks
 *   `unclosedTags.has(getTagInstanceId(name, tagIndex))`, isolating loading state
 *   per component instance.
 */

const MockComponent: React.FC<any> = (props) => {
  return React.createElement(
    'div',
    { 'data-stream-status': props.streamStatus },
    props.children,
  );
};

// Track streamStatus for each render of a component
interface StreamStatusRecord {
  name: string;
  streamStatus: string;
}

describe('Loading isolation (Issue #1949)', () => {
  // ============================================================
  // Renderer-level tests: verify createReplaceElement isolates
  // streamStatus per instance
  // ============================================================
  describe('Renderer: per-instance streamStatus isolation', () => {
    it('should mark only the unclosed instance as loading (different tag names)', () => {
      const components = { 'comp-a': MockComponent, 'comp-b': MockComponent };
      const renderer = new Renderer({ components });
      const spy = jest.spyOn(React, 'createElement');

      // comp-a is closed, comp-b is unclosed
      renderer.processHtml('<comp-a>A</comp-a><comp-b>B');

      const calls = spy.mock.calls.filter((c) => c[0] === MockComponent);
      const a = calls.filter((c) => (c[1] as any).domNode?.name === 'comp-a');
      const b = calls.filter((c) => (c[1] as any).domNode?.name === 'comp-b');

      expect(a[0][1]).toEqual(expect.objectContaining({ streamStatus: 'done' }));
      expect(b[0][1]).toEqual(expect.objectContaining({ streamStatus: 'loading' }));

      spy.mockRestore();
    });

    it('should mark only the unclosed instance as loading (same tag name)', () => {
      const components = { 'my-comp': MockComponent };
      const renderer = new Renderer({ components });
      const spy = jest.spyOn(React, 'createElement');

      // First instance is closed, second is unclosed
      renderer.processHtml('<my-comp>Done</my-comp><my-comp>Loading');

      const calls = spy.mock.calls.filter((c) => c[0] === MockComponent);
      expect(calls).toHaveLength(2);

      expect(calls[0][1]).toEqual(expect.objectContaining({ streamStatus: 'done' }));
      expect(calls[1][1]).toEqual(expect.objectContaining({ streamStatus: 'loading' }));

      spy.mockRestore();
    });

    it('should isolate loading for 3+ components with only the last one loading', () => {
      const components = {
        'comp-a': MockComponent,
        'comp-b': MockComponent,
        'comp-c': MockComponent,
      };
      const renderer = new Renderer({ components });
      const spy = jest.spyOn(React, 'createElement');

      renderer.processHtml('<comp-a>A</comp-a><comp-b>B</comp-b><comp-c>C');

      const calls = spy.mock.calls.filter((c) => c[0] === MockComponent);
      expect(calls).toHaveLength(3);

      expect(calls[0][1]).toEqual(expect.objectContaining({ streamStatus: 'done' }));
      expect(calls[1][1]).toEqual(expect.objectContaining({ streamStatus: 'done' }));
      expect(calls[2][1]).toEqual(expect.objectContaining({ streamStatus: 'loading' }));

      spy.mockRestore();
    });

    it('should handle interleaved same-name components correctly', () => {
      const components = { 'comp-a': MockComponent };
      const renderer = new Renderer({ components });
      const spy = jest.spyOn(React, 'createElement');

      // A1 closed, A2 closed, A3 unclosed
      renderer.processHtml('<comp-a>1</comp-a><comp-a>2</comp-a><comp-a>3');

      const calls = spy.mock.calls.filter((c) => c[0] === MockComponent);
      expect(calls).toHaveLength(3);

      expect(calls[0][1]).toEqual(expect.objectContaining({ streamStatus: 'done' }));
      expect(calls[1][1]).toEqual(expect.objectContaining({ streamStatus: 'done' }));
      expect(calls[2][1]).toEqual(expect.objectContaining({ streamStatus: 'loading' }));

      spy.mockRestore();
    });

    it('should handle interleaved different-name components correctly', () => {
      const components = { 'comp-a': MockComponent, 'comp-b': MockComponent };
      const renderer = new Renderer({ components });
      const spy = jest.spyOn(React, 'createElement');

      // a closed, b closed, a closed, b unclosed
      renderer.processHtml('<comp-a>A1</comp-a><comp-b>B1</comp-b><comp-a>A2</comp-a><comp-b>B2');

      const calls = spy.mock.calls.filter((c) => c[0] === MockComponent);
      const aCalls = calls.filter((c) => (c[1] as any).domNode?.name === 'comp-a');
      const bCalls = calls.filter((c) => (c[1] as any).domNode?.name === 'comp-b');

      expect(aCalls).toHaveLength(2);
      expect(bCalls).toHaveLength(2);

      expect(aCalls[0][1]).toEqual(expect.objectContaining({ streamStatus: 'done' }));
      expect(aCalls[1][1]).toEqual(expect.objectContaining({ streamStatus: 'done' }));
      expect(bCalls[0][1]).toEqual(expect.objectContaining({ streamStatus: 'done' }));
      expect(bCalls[1][1]).toEqual(expect.objectContaining({ streamStatus: 'loading' }));

      spy.mockRestore();
    });

    it('should mark all as done when all tags are closed', () => {
      const components = { 'comp-a': MockComponent, 'comp-b': MockComponent };
      const renderer = new Renderer({ components });
      const spy = jest.spyOn(React, 'createElement');

      renderer.processHtml('<comp-a>A</comp-a><comp-b>B</comp-b>');

      const calls = spy.mock.calls.filter((c) => c[0] === MockComponent);
      expect(calls).toHaveLength(2);
      expect(calls[0][1]).toEqual(expect.objectContaining({ streamStatus: 'done' }));
      expect(calls[1][1]).toEqual(expect.objectContaining({ streamStatus: 'done' }));

      spy.mockRestore();
    });

    it('should handle self-closing tag followed by unclosed tag', () => {
      const components = { 'comp-a': MockComponent, 'comp-b': MockComponent };
      const renderer = new Renderer({ components });
      const spy = jest.spyOn(React, 'createElement');

      renderer.processHtml('<comp-a /><comp-b>B');

      const calls = spy.mock.calls.filter((c) => c[0] === MockComponent);
      const a = calls.filter((c) => (c[1] as any).domNode?.name === 'comp-a');
      const b = calls.filter((c) => (c[1] as any).domNode?.name === 'comp-b');

      expect(a[0][1]).toEqual(expect.objectContaining({ streamStatus: 'done' }));
      expect(b[0][1]).toEqual(expect.objectContaining({ streamStatus: 'loading' }));

      spy.mockRestore();
    });

    it('should handle nested unclosed parent with closed child', () => {
      const components = { 'comp-a': MockComponent, 'comp-b': MockComponent };
      const renderer = new Renderer({ components });
      const spy = jest.spyOn(React, 'createElement');

      // comp-a unclosed, comp-b closed inside comp-a
      renderer.processHtml('<comp-a>text<comp-b>inner</comp-b>');

      const calls = spy.mock.calls.filter((c) => c[0] === MockComponent);
      const a = calls.filter((c) => (c[1] as any).domNode?.name === 'comp-a');
      const b = calls.filter((c) => (c[1] as any).domNode?.name === 'comp-b');

      // Parent should be loading (unclosed), child should be done (closed)
      expect(a[0][1]).toEqual(expect.objectContaining({ streamStatus: 'loading' }));
      expect(b[0][1]).toEqual(expect.objectContaining({ streamStatus: 'done' }));

      spy.mockRestore();
    });

    it('should handle deep nesting with mixed states', () => {
      const components = { 'comp-a': MockComponent };
      const renderer = new Renderer({ components });
      const spy = jest.spyOn(React, 'createElement');

      // Level 1 open, Level 2 open, Level 3 closed
      renderer.processHtml('<comp-a>1<comp-a>2<comp-a>3</comp-a>');

      const calls = spy.mock.calls.filter((c) => c[0] === MockComponent);
      expect(calls).toHaveLength(3);

      // Innermost (Level 3) processed first - done
      expect(calls[0][1]).toEqual(expect.objectContaining({ streamStatus: 'done' }));
      // Level 2 - loading
      expect(calls[1][1]).toEqual(expect.objectContaining({ streamStatus: 'loading' }));
      // Level 1 - loading
      expect(calls[2][1]).toEqual(expect.objectContaining({ streamStatus: 'loading' }));

      spy.mockRestore();
    });
  });

  // ============================================================
  // Full pipeline tests: verify Parser + Renderer isolates
  // streamStatus through the complete markdown → HTML → React
  // pipeline
  // ============================================================
  describe('Full pipeline (Parser + Renderer): loading isolation', () => {
    it('should isolate loading through marked parsing and DOMPurify sanitization', () => {
      const components = {
        'comp-a': MockComponent,
        'comp-b': MockComponent,
        'comp-c': MockComponent,
      };
      const parser = new Parser({ components });
      const renderer = new Renderer({ components });
      const spy = jest.spyOn(React, 'createElement');

      // comp-a and comp-b are closed, comp-c is unclosed
      const markdown = '<comp-a>A</comp-a>\n\n<comp-b>B</comp-b>\n\n<comp-c>C';
      const html = parser.parse(markdown);
      renderer.render(html);

      const calls = spy.mock.calls.filter((c) => c[0] === MockComponent);
      const a = calls.filter((c) => (c[1] as any).domNode?.name === 'comp-a');
      const b = calls.filter((c) => (c[1] as any).domNode?.name === 'comp-b');
      const c = calls.filter((c) => (c[1] as any).domNode?.name === 'comp-c');

      expect(a[0][1]).toEqual(expect.objectContaining({ streamStatus: 'done' }));
      expect(b[0][1]).toEqual(expect.objectContaining({ streamStatus: 'done' }));
      expect(c[0][1]).toEqual(expect.objectContaining({ streamStatus: 'loading' }));

      spy.mockRestore();
    });
  });

  // ============================================================
  // XMarkdown component tests: verify the full component
  // correctly isolates loading during streaming
  // ============================================================
  describe('XMarkdown component: streaming loading isolation', () => {
    it('should show loading only for the unclosed component during streaming', () => {
      const records: StreamStatusRecord[] = [];

      const CompA: React.FC<ComponentProps> = (props) => {
        records.push({ name: 'comp-a', streamStatus: props.streamStatus });
        return React.createElement('div', { 'data-status': props.streamStatus }, props.children);
      };
      const CompB: React.FC<ComponentProps> = (props) => {
        records.push({ name: 'comp-b', streamStatus: props.streamStatus });
        return React.createElement('div', { 'data-status': props.streamStatus }, props.children);
      };

      // comp-a is fully closed, comp-b is still streaming (unclosed)
      render(
        <XMarkdown
          content="<comp-a>Done</comp-a>

<comp-b>Streaming"
          streaming={{ hasNextChunk: true }}
          components={{ 'comp-a': CompA, 'comp-b': CompB }}
          paragraphTag="div"
        />,
      );

      const aRecords = records.filter((r) => r.name === 'comp-a');
      const bRecords = records.filter((r) => r.name === 'comp-b');

      expect(aRecords.length).toBeGreaterThan(0);
      expect(aRecords[aRecords.length - 1].streamStatus).toBe('done');

      expect(bRecords.length).toBeGreaterThan(0);
      expect(bRecords[bRecords.length - 1].streamStatus).toBe('loading');
    });

    it('should independently complete loading when streaming finishes', () => {
      const records: StreamStatusRecord[] = [];

      const CompA: React.FC<ComponentProps> = (props) => {
        records.push({ name: 'comp-a', streamStatus: props.streamStatus });
        return React.createElement('div', { 'data-status': props.streamStatus }, props.children);
      };
      const CompB: React.FC<ComponentProps> = (props) => {
        records.push({ name: 'comp-b', streamStatus: props.streamStatus });
        return React.createElement('div', { 'data-status': props.streamStatus }, props.children);
      };

      const components = { 'comp-a': CompA, 'comp-b': CompB };

      // Start with comp-b unclosed
      const { rerender } = render(
        <XMarkdown
          content="<comp-a>A</comp-a>

<comp-b>B"
          streaming={{ hasNextChunk: true }}
          components={components}
          paragraphTag="div"
        />,
      );

      // Verify comp-b was loading
      const midB = records.filter((r) => r.name === 'comp-b');
      expect(midB[midB.length - 1].streamStatus).toBe('loading');

      // Clear records and complete comp-b
      records.length = 0;
      rerender(
        <XMarkdown
          content="<comp-a>A</comp-a>

<comp-b>B</comp-b>"
          streaming={{ hasNextChunk: false }}
          components={components}
          paragraphTag="div"
        />,
      );

      // Both should be done after streaming completes
      const finalA = records.filter((r) => r.name === 'comp-a');
      const finalB = records.filter((r) => r.name === 'comp-b');
      expect(finalA[finalA.length - 1].streamStatus).toBe('done');
      expect(finalB[finalB.length - 1].streamStatus).toBe('done');
    });

    it('should handle multiple same-type components with different loading states', () => {
      const records: StreamStatusRecord[] = [];

      const MyComp: React.FC<ComponentProps> = (props) => {
        records.push({ name: 'my-comp', streamStatus: props.streamStatus });
        return React.createElement('div', { 'data-status': props.streamStatus }, props.children);
      };

      // First instance is closed, second is unclosed (still streaming)
      render(
        <XMarkdown
          content={'<my-comp>First complete</my-comp>\n\nText\n\n<my-comp>Second streaming'}
          streaming={{ hasNextChunk: true }}
          components={{ 'my-comp': MyComp }}
          paragraphTag="div"
        />,
      );

      expect(records.length).toBe(2);
      expect(records[0].streamStatus).toBe('done');
      expect(records[1].streamStatus).toBe('loading');
    });
  });
});