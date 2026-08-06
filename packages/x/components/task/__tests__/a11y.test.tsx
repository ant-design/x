import { axe } from 'jest-axe';
import React from 'react';
import { fireEvent, render, screen } from '../../../tests/utils';
import Task from '../index';

describe('Task accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(
      <Task
        item={{
          id: 'a11y',
          title: 'Generate report',
          status: 'failed',
          progress: 0.7,
          error: { message: 'Generation failed' },
        }}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('exposes task status and expandable details', () => {
    render(
      <Task item={{ id: 'a11y', title: 'Generate report', status: 'running' }}>Reading files</Task>,
    );
    expect(screen.getByRole('group', { name: 'Generate report' })).toBeTruthy();
    expect(screen.getAllByText('In progress')[0]).toHaveAttribute('aria-live', 'polite');
    const button = screen.getByRole('button', { name: 'Collapse task details' });
    expect(button).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });
});
