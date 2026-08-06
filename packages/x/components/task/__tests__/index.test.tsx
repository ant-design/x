import React from 'react';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import themeTest from '../../../tests/shared/themeTest';
import { fireEvent, render, screen } from '../../../tests/utils';
import XProvider from '../../x-provider';
import Task from '../index';
import type { TaskItem } from '../interface';

const baseItem: TaskItem = {
  id: 'task-1',
  title: 'Analyze repository',
  description: 'Scanning source files',
  status: 'running',
  progress: 0.42,
};

describe('Task', () => {
  mountTest(() => <Task item={baseItem} />);
  rtlTest(() => <Task item={baseItem} />);
  themeTest(() => <Task item={baseItem} />);

  it.each([
    ['pending', 'Pending'],
    ['running', 'In progress'],
    ['completed', 'Completed'],
    ['failed', 'Failed'],
    ['cancelled', 'Cancelled'],
  ] as const)('renders %s status', (status, label) => {
    const { container } = render(<Task item={{ ...baseItem, status }} />);
    expect(container.querySelector(`.ant-task-${status}`)).toBeTruthy();
    expect(screen.getAllByText(label).length).toBeGreaterThan(0);
  });

  it('renders normalized and completed progress', () => {
    const { rerender } = render(<Task item={baseItem} />);
    expect(screen.getByText('42%')).toBeTruthy();
    rerender(<Task item={{ ...baseItem, status: 'completed', progress: 0.42 }} />);
    expect(screen.getByText('100%')).toBeTruthy();
  });

  it('supports uncontrolled and controlled expansion', () => {
    const onExpandedChange = jest.fn();
    const { rerender } = render(
      <Task
        item={{ ...baseItem, status: 'completed', result: { files: 12 } }}
        onExpandedChange={onExpandedChange}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Expand task details' }));
    expect(onExpandedChange).toHaveBeenCalledWith(true);
    expect(screen.getByText(/"files": 12/)).toBeTruthy();

    rerender(
      <Task
        item={{ ...baseItem, status: 'completed', result: { files: 12 } }}
        expanded={false}
        onExpandedChange={onExpandedChange}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Expand task details' }));
    expect(onExpandedChange).toHaveBeenLastCalledWith(true);
  });

  it('adopts status expansion defaults after a transition', () => {
    const { rerender } = render(
      <Task item={{ ...baseItem, status: 'pending', error: { message: 'Later failure' } }} />,
    );
    expect(screen.getByRole('button', { name: 'Expand task details' })).toBeTruthy();
    rerender(
      <Task item={{ ...baseItem, status: 'failed', error: { message: 'Later failure' } }} />,
    );
    expect(screen.getByRole('button', { name: 'Collapse task details' })).toBeTruthy();
  });

  it('renders result, error, cancellation reason, and safe fallbacks', () => {
    const circular: Record<string, unknown> = {};
    circular.self = circular;
    render(
      <Task
        item={{
          ...baseItem,
          status: 'failed',
          result: circular,
          error: { code: 'FAILED', message: 'Task failed', details: circular },
          reason: 'Stopped by user',
        }}
      />,
    );
    expect(screen.getAllByText('[Object, unable to serialize]')).toHaveLength(2);
    expect(screen.getByText('FAILED')).toBeTruthy();
    expect(screen.getByText('Stopped by user')).toBeTruthy();
  });

  it('supports custom renderers, actions, semantic styles, and ref', () => {
    const ref = React.createRef<{ nativeElement: HTMLDivElement }>();
    const { container } = render(
      <Task
        ref={ref}
        item={{ ...baseItem, status: 'failed', result: {}, error: { message: 'failed' } }}
        statusRender={() => <span>custom status</span>}
        progressRender={() => <span>custom progress</span>}
        resultRender={() => <span>custom result</span>}
        errorRender={() => <span>custom error</span>}
        actions={() => <button type="button">Inspect</button>}
        classNames={{ title: 'custom-title' }}
        styles={{ details: { padding: 24 } }}
        prefixCls="custom-task"
        rootClassName="custom-root"
      />,
    );
    expect(screen.getByText('custom status')).toBeTruthy();
    expect(screen.getByText('custom progress')).toBeTruthy();
    expect(screen.getByText('custom result')).toBeTruthy();
    expect(screen.getByText('custom error')).toBeTruthy();
    expect(screen.getByText('Inspect')).toBeTruthy();
    expect(container.querySelector('.custom-title')).toBeTruthy();
    expect(container.querySelector('.custom-task-details')).toHaveStyle({ padding: '24px' });
    expect(ref.current?.nativeElement).toBe(container.querySelector('.custom-task'));
  });

  it('merges XProvider component configuration', () => {
    const { container } = render(
      <XProvider
        task={{
          className: 'provider-root',
          classNames: { title: 'provider-title' },
          style: { maxWidth: 640 },
          styles: { progress: { maxWidth: 320 } },
        }}
      >
        <Task item={baseItem} />
      </XProvider>,
    );
    expect(container.querySelector('.provider-root')).toHaveStyle({ maxWidth: '640px' });
    expect(container.querySelector('.provider-title')).toBeTruthy();
    expect(container.querySelector('.ant-task-progress')).toHaveStyle({ maxWidth: '320px' });
  });
});
