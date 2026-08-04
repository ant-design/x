import { axe } from 'jest-axe';
import React from 'react';
import { fireEvent, render, screen } from '../../../tests/utils';
import ToolCall from '../index';

describe('ToolCall accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(
      <ToolCall
        item={{
          id: 'tool-a11y',
          name: 'searchKnowledge',
          arguments: { query: 'Ant Design X' },
          status: 'failed',
          error: { message: 'Service unavailable', retryable: true },
        }}
        onRetry={() => {}}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('exposes group, live status and expandable details', () => {
    render(
      <ToolCall
        item={{ id: 'tool-a11y', name: 'searchKnowledge', arguments: {}, status: 'running' }}
      />,
    );
    expect(screen.getByRole('group', { name: 'searchKnowledge' })).toBeTruthy();
    expect(screen.getAllByText('Running')[0]).toHaveAttribute('aria-live', 'polite');

    const button = screen.getByRole('button', { name: 'Collapse details' });
    expect(button).toHaveAttribute('aria-expanded', 'true');
    button.focus();
    fireEvent.click(button);
    expect(button).toHaveFocus();
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });
});
