import React from 'react';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import { fireEvent, render, screen } from '../../../tests/utils';
import XProvider from '../../x-provider';
import ToolCall from '../index';
import type { ToolCallItem } from '../interface';

const baseItem: ToolCallItem = {
  id: 'tool-1',
  name: 'queryOrder',
  description: 'Query order details',
  arguments: { orderId: '20260803001' },
  status: 'running',
};

describe('ToolCall', () => {
  mountTest(() => <ToolCall item={baseItem} />);
  rtlTest(() => <ToolCall item={baseItem} />);

  it.each([
    ['pending', 'Pending'],
    ['streaming', 'Receiving arguments'],
    ['running', 'Running'],
    ['completed', 'Completed'],
    ['failed', 'Failed'],
    ['cancelled', 'Cancelled'],
  ] as const)('renders %s status', (status, label) => {
    const { container } = render(<ToolCall item={{ ...baseItem, status }} />);
    expect(container.querySelector(`.ant-tool-call-${status}`)).toBeTruthy();
    expect(screen.getAllByText(label).length).toBeGreaterThan(0);
  });

  it('formats complete JSON and preserves streaming JSON', () => {
    const { rerender } = render(
      <ToolCall
        item={{ ...baseItem, status: 'streaming', argumentsText: '{"city":"Hangzhou"}' }}
      />,
    );
    expect(screen.getByText(/"city": "Hangzhou"/)).toBeTruthy();

    rerender(
      <ToolCall item={{ ...baseItem, status: 'streaming', argumentsText: '{"city":"Hang' }} />,
    );
    expect(screen.getByText('{"city":"Hang')).toBeTruthy();
  });

  it('falls back safely for circular and binary values', () => {
    const circular: Record<string, unknown> = {};
    circular.self = circular;
    const { rerender } = render(
      <ToolCall item={{ ...baseItem, arguments: circular }} defaultExpanded />,
    );
    expect(screen.getByText('[Object, unable to serialize]')).toBeTruthy();

    rerender(
      <ToolCall item={{ ...baseItem, arguments: new Uint8Array([1, 2, 3]) }} defaultExpanded />,
    );
    expect(screen.getByText('[Uint8Array data]')).toBeTruthy();
  });

  it('supports uncontrolled expansion with status defaults', () => {
    render(<ToolCall item={{ ...baseItem, status: 'completed', result: { ok: true } }} />);
    expect(screen.getByText(/Result: \{ "ok": true \}/)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Copy result queryOrder' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Expand details' }));
    expect(screen.getByText(/"ok": true/)).toBeTruthy();
  });

  it('supports controlled expansion', () => {
    const onExpandedChange = jest.fn();
    const { rerender } = render(
      <ToolCall item={baseItem} expanded={false} onExpandedChange={onExpandedChange} />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Expand details' }));
    expect(onExpandedChange).toHaveBeenCalledWith(true);
    expect(screen.queryByText(/orderId/)).toBeNull();

    rerender(<ToolCall item={baseItem} expanded onExpandedChange={onExpandedChange} />);
    expect(screen.getByText(/orderId/)).toBeTruthy();
  });

  it('only renders retry for retryable failures with a handler', () => {
    const onRetry = jest.fn();
    const failedItem: ToolCallItem = {
      ...baseItem,
      status: 'failed',
      error: { message: 'Gateway timeout', retryable: true },
    };
    const { rerender } = render(<ToolCall item={failedItem} onRetry={onRetry} />);
    fireEvent.click(screen.getByRole('button', { name: 'Retry queryOrder' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(onRetry).toHaveBeenCalledWith(failedItem);
    expect(screen.getAllByText('Failed').length).toBeGreaterThan(0);

    rerender(<ToolCall item={failedItem} onRetry={onRetry} retrying />);
    expect(screen.getByRole('button', { name: 'Retry queryOrder' })).toBeDisabled();

    rerender(
      <ToolCall
        item={{ ...failedItem, error: { message: 'Invalid input', retryable: false } }}
        onRetry={onRetry}
      />,
    );
    expect(screen.queryByRole('button', { name: 'Retry queryOrder' })).toBeNull();
  });

  it('supports renderers, semantic styles, custom actions and ref', () => {
    const ref = React.createRef<{ nativeElement: HTMLDivElement }>();
    const { container } = render(
      <ToolCall
        ref={ref}
        item={{
          ...baseItem,
          status: 'failed',
          result: { ok: false },
          error: { message: 'failed' },
        }}
        argumentsRender={() => <span>custom arguments</span>}
        resultRender={() => <span>custom result</span>}
        errorRender={() => <span>custom error</span>}
        actions={<button type="button">Inspect</button>}
        classNames={{ name: 'custom-name' }}
        styles={{ details: { padding: 24 } }}
        rootClassName="custom-root"
        prefixCls="custom-tool"
      />,
    );
    expect(screen.getByText('custom arguments')).toBeTruthy();
    expect(screen.getByText('custom result')).toBeTruthy();
    expect(screen.getByText('custom error')).toBeTruthy();
    expect(screen.getByText('Inspect')).toBeTruthy();
    expect(container.querySelector('.custom-name')).toBeTruthy();
    expect(container.querySelector('.custom-tool-details')).toHaveStyle({ padding: 24 });
    expect(ref.current?.nativeElement).toBe(container.querySelector('.custom-tool'));
  });

  it('merges XProvider component configuration', () => {
    const { container } = render(
      <XProvider
        toolCall={{
          className: 'provider-root',
          classNames: { name: 'provider-name' },
          style: { maxWidth: 640 },
          styles: { details: { padding: 12 } },
        }}
      >
        <ToolCall item={baseItem} />
      </XProvider>,
    );
    expect(container.querySelector('.provider-root')).toHaveStyle({ maxWidth: 640 });
    expect(container.querySelector('.provider-name')).toBeTruthy();
    expect(container.querySelector('.ant-tool-call-details')).toHaveStyle({ padding: 12 });
  });
});
