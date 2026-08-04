import React from 'react';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import { act, fireEvent, render, screen, waitFor } from '../../../tests/utils';
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

  it('supports uncontrolled async approval and records the decision', async () => {
    const onApprove = jest.fn().mockResolvedValue(undefined);
    const onStatusChange = jest.fn();
    render(
      <ToolCall
        item={{ ...baseItem, status: 'pending' }}
        approval={{
          description: 'This action writes production data.',
          risk: 'high',
          onApprove,
          onReject: () => {},
          onStatusChange,
        }}
      />,
    );

    expect(screen.getAllByText('Awaiting approval').length).toBeGreaterThan(0);
    expect(screen.getByText('High risk')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Approve and run' }));
    expect(onApprove).toHaveBeenCalledWith(expect.objectContaining({ id: 'tool-1' }));
    await waitFor(() => expect(screen.getByText('Approved')).toBeTruthy());
    expect(onStatusChange).toHaveBeenCalledWith(
      'approved',
      expect.objectContaining({ id: 'tool-1' }),
    );
  });

  it('supports controlled approval and custom approval rendering', async () => {
    const onStatusChange = jest.fn();
    const { rerender } = render(
      <ToolCall
        item={{ ...baseItem, status: 'pending' }}
        approval={{ status: 'pending', onApprove: () => {}, onStatusChange }}
        approvalRender={(_, __, actions) => (
          <button type="button" onClick={actions.approve}>
            Custom approve
          </button>
        )}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Custom approve' }));
    await waitFor(() => expect(onStatusChange).toHaveBeenCalledWith('approved', expect.anything()));
    expect(screen.getByRole('button', { name: 'Custom approve' })).toBeTruthy();

    rerender(
      <ToolCall item={{ ...baseItem, status: 'running' }} approval={{ status: 'approved' }} />,
    );
    expect(screen.getByText('Approved')).toBeTruthy();
  });

  it('keeps approval pending when an async action fails', async () => {
    const onStatusChange = jest.fn();
    render(
      <ToolCall
        item={{ ...baseItem, status: 'pending' }}
        approval={{
          onApprove: () => Promise.reject(new Error('Approval service unavailable')),
          onStatusChange,
        }}
      />,
    );

    const approveButton = screen.getByRole('button', { name: 'Approve and run' });
    fireEvent.click(approveButton);
    await waitFor(() => expect(approveButton).not.toBeDisabled());
    expect(screen.getAllByText('Awaiting approval').length).toBeGreaterThan(0);
    expect(onStatusChange).not.toHaveBeenCalled();
  });

  it('updates live duration, supports a controlled value and freezes completion time', () => {
    jest.useFakeTimers();
    jest.setSystemTime(5000);
    const { rerender } = render(
      <ToolCall item={{ ...baseItem, startedAt: 3000 }} duration={{ refreshInterval: 250 }} />,
    );
    expect(screen.getByLabelText('Elapsed time 2.0s')).toBeTruthy();

    act(() => {
      jest.setSystemTime(6250);
      jest.advanceTimersByTime(250);
    });
    expect(screen.getByLabelText('Elapsed time 3.5s')).toBeTruthy();

    rerender(
      <ToolCall item={{ ...baseItem, status: 'completed', startedAt: 3000, completedAt: 4280 }} />,
    );
    expect(screen.getByLabelText('Elapsed time 1.3s')).toBeTruthy();

    rerender(
      <ToolCall
        item={{ ...baseItem, status: 'completed', startedAt: 3000, completedAt: 68_500 }}
      />,
    );
    expect(screen.getByLabelText('Elapsed time 1m 05s')).toBeTruthy();

    rerender(
      <ToolCall
        item={baseItem}
        duration={{ value: 9000, formatter: (value) => `${value / 1000} seconds` }}
      />,
    );
    expect(screen.getByLabelText('Elapsed time 9 seconds')).toBeTruthy();
    jest.useRealTimers();
  });

  it('emits cancellation intent and exposes its loading state', async () => {
    let resolveCancel: () => void = () => {};
    const onCancel = jest.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveCancel = resolve;
        }),
    );
    render(<ToolCall item={baseItem} onCancel={onCancel} />);

    const cancelButton = screen.getByRole('button', { name: 'Cancel execution queryOrder' });
    fireEvent.click(cancelButton);
    expect(onCancel).toHaveBeenCalledWith(baseItem);
    expect(cancelButton).toBeDisabled();
    act(() => resolveCancel());
    await waitFor(() => expect(cancelButton).not.toBeDisabled());
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
    expect(container.querySelector('.custom-tool-details')).toHaveStyle({ padding: '24px' });
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
    expect(container.querySelector('.provider-root')).toHaveStyle({ maxWidth: '640px' });
    expect(container.querySelector('.provider-name')).toBeTruthy();
    expect(container.querySelector('.ant-tool-call-details')).toHaveStyle({ padding: '12px' });
  });
});
