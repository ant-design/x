import React from 'react';
import { render } from '../../../tests/utils';
import ActionsItem from '../ActionsItem';

jest.mock('antd', () => {
  const antd = jest.requireActual('antd');

  return {
    ...antd,
    Tooltip: ({ children, placement, title }: any) =>
      title ? (
        <span data-tooltip-placement={placement} data-tooltip-title={title}>
          {children}
        </span>
      ) : (
        <>{children}</>
      ),
  };
});

describe('Actions.Item', () => {
  it('renders with no status', () => {
    const { getByText } = render(<ActionsItem defaultIcon="default-icon" />);
    expect(getByText('default-icon')).toBeTruthy();
    render(<ActionsItem defaultIcon="default-icon" status={'xxx' as any} />);
  });

  it('supports custom tooltip', () => {
    const { getByText } = render(
      <ActionsItem defaultIcon="default-icon" label="Default Tooltip" tooltip="Custom Tooltip" />,
    );

    expect(
      getByText('default-icon').closest('[data-tooltip-title="Custom Tooltip"]'),
    ).toBeInTheDocument();
  });

  it('supports custom tooltip props', () => {
    const { getByText } = render(
      <ActionsItem
        defaultIcon="default-icon"
        label="Default Tooltip"
        tooltip={{ title: 'Custom Tooltip Props', placement: 'bottom' }}
      />,
    );

    const tooltip = getByText('default-icon').closest(
      '[data-tooltip-title="Custom Tooltip Props"]',
    );
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveAttribute('data-tooltip-placement', 'bottom');
  });

  it('disables tooltip when tooltip is false', () => {
    const { getByText } = render(
      <ActionsItem defaultIcon="default-icon" label="Default Tooltip" tooltip={false} />,
    );

    expect(getByText('default-icon').closest('[data-tooltip-title]')).not.toBeInTheDocument();
  });

  it('does not render empty tooltip when title is empty', () => {
    const { getByText } = render(<ActionsItem defaultIcon="default-icon" />);

    expect(getByText('default-icon').closest('[data-tooltip-title]')).not.toBeInTheDocument();
  });
});
