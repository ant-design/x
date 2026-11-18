import React from 'react';
import { fireEvent, render, waitFakeTimer } from '../../../tests/utils';
import ActionsItem from '../ActionsItem';

describe('Actions.Item', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders with no status', () => {
    const { getByText } = render(<ActionsItem defaultIcon="default-icon" />);
    expect(getByText('default-icon')).toBeTruthy();
    render(<ActionsItem defaultIcon="default-icon" status={'xxx' as any} />);
  });

  it('renders default tooltip with label', async () => {
    const { container } = render(
      <ActionsItem defaultIcon={<span>icon</span>} label="Action Label" />,
    );
    const trigger = container.querySelector('.ant-actions-button-item')!;
    fireEvent.mouseEnter(trigger);
    await waitFakeTimer();
    const tooltip = document.querySelector('.ant-tooltip');
    expect(tooltip).toBeInTheDocument();
    expect(tooltip?.textContent).toBe('Action Label');
  });

  it('renders custom tooltip string', async () => {
    const { container } = render(
      <ActionsItem defaultIcon={<span>icon</span>} label="Action Label" tooltip="Custom Tooltip" />,
    );
    const trigger = container.querySelector('.ant-actions-button-item')!;
    fireEvent.mouseEnter(trigger);
    await waitFakeTimer();
    const tooltip = document.querySelector('.ant-tooltip');
    expect(tooltip).toBeInTheDocument();
    expect(tooltip?.textContent).toBe('Custom Tooltip');
  });

  it('does not render tooltip when tooltip is false', async () => {
    const { container } = render(
      <ActionsItem defaultIcon={<span>icon</span>} label="Action Label" tooltip={false} />,
    );
    const trigger = container.querySelector('.ant-actions-button-item')!;
    fireEvent.mouseEnter(trigger);
    await waitFakeTimer();
    const tooltip = document.querySelector('.ant-tooltip');
    expect(tooltip).not.toBeInTheDocument();
  });
});
