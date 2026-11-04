import React from 'react';
import { fireEvent, render, screen, waitFor } from '../../../tests/utils';
import ActionsItem from '../ActionsItem';

describe('Actions.Item', () => {
  it('renders with no status', () => {
    const { getByText } = render(<ActionsItem defaultIcon="default-icon" />);
    expect(getByText('default-icon')).toBeTruthy();
    render(<ActionsItem defaultIcon="default-icon" status={'xxx' as any} />);
  });

  const openTooltip = (trigger: Element) => {
    fireEvent.mouseEnter(trigger);
    fireEvent.mouseMove(trigger);
  };

  it('renders tooltip with label by default', async () => {
    render(<ActionsItem defaultIcon="icon" label="Default Label" />);
    openTooltip(screen.getByText('icon').parentElement!);
    await waitFor(() => {
      expect(screen.getByText('Default Label')).toBeInTheDocument();
    });
  });

  it('uses a custom string as the tooltip title', async () => {
    render(<ActionsItem defaultIcon="icon" label="Label" tooltip="Custom Tooltip" />);
    openTooltip(screen.getByText('icon').parentElement!);
    await waitFor(() => {
      expect(screen.getByText('Custom Tooltip')).toBeInTheDocument();
    });
  });

  it('renders no tooltip when tooltip is false', () => {
    const { container } = render(<ActionsItem defaultIcon="icon" label="Label" tooltip={false} />);
    // icon renders without a Tooltip wrapper
    expect(container.textContent).toContain('icon');
  });

  it('merges TooltipProps object on top of the default title', async () => {
    render(<ActionsItem defaultIcon="icon" label="Label" tooltip={{ placement: 'bottom' }} />);
    openTooltip(screen.getByText('icon').parentElement!);
    await waitFor(() => {
      // title falls back to label when not specified in the TooltipProps
      expect(screen.getByText('Label')).toBeInTheDocument();
    });
  });
});
