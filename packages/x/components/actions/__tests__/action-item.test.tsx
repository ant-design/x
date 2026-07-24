import React from 'react';
import { render } from '../../../tests/utils';
import useMobile from '../../_util/hooks/use-mobile';
import ActionsItem from '../ActionsItem';

jest.mock('../../_util/hooks/use-mobile', () => jest.fn(() => false));

jest.mock('antd', () => {
  const antd = jest.requireActual('antd');

  return {
    ...antd,
    Tooltip: ({ children, placement, title, overlay }: any) => {
      const content = title ?? overlay;

      return content != null ? (
        <span data-tooltip-placement={placement} data-tooltip-title={content}>
          {children}
        </span>
      ) : (
        <>{children}</>
      );
    },
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

  it('supports custom tooltip overlay', () => {
    const { getByText } = render(
      <ActionsItem
        defaultIcon="default-icon"
        tooltip={{ overlay: 'Custom Tooltip Overlay', placement: 'bottom' }}
      />,
    );

    const tooltip = getByText('default-icon').closest(
      '[data-tooltip-title="Custom Tooltip Overlay"]',
    );
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveAttribute('data-tooltip-placement', 'bottom');
  });

  it('renders tooltip when tooltip title is 0', () => {
    const { getByText } = render(<ActionsItem defaultIcon="default-icon" tooltip={{ title: 0 }} />);

    expect(getByText('default-icon').closest('[data-tooltip-title="0"]')).toBeInTheDocument();
  });

  it('disables tooltip when tooltip is false', () => {
    const { getByText } = render(
      <ActionsItem defaultIcon="default-icon" label="Default Tooltip" tooltip={false} />,
    );

    expect(getByText('default-icon').closest('[data-tooltip-title]')).not.toBeInTheDocument();
  });

  it('does not render tooltip on mobile', () => {
    (useMobile as jest.Mock).mockReturnValue(true);

    const { getByText } = render(
      <ActionsItem defaultIcon="default-icon" label="Default Tooltip" />,
    );

    expect(getByText('default-icon').closest('[data-tooltip-title]')).not.toBeInTheDocument();
    (useMobile as jest.Mock).mockReturnValue(false);
  });

  it('does not render empty tooltip when title is empty', () => {
    const { getByText } = render(<ActionsItem defaultIcon="default-icon" />);

    expect(getByText('default-icon').closest('[data-tooltip-title]')).not.toBeInTheDocument();
  });
});
