import React from 'react';
import { fireEvent, render } from '../../../tests/utils';
import ActionsItem from '../ActionsItem';

describe('Actions.Item', () => {
  it('renders with no status', () => {
    const { getByText } = render(<ActionsItem defaultIcon="default-icon" />);
    expect(getByText('default-icon')).toBeTruthy();
    render(<ActionsItem defaultIcon="default-icon" status={'xxx' as any} />);
  });

  it('does not render tooltip when tooltip is false', () => {
    const { container } = render(
      <ActionsItem defaultIcon="default-icon" label="Default label" tooltip={false} />,
    );
    expect(container.querySelector('.ant-tooltip')).toBeNull();
  });

  it('renders tooltip with default label', async () => {
    const { container, findByText } = render(
      <ActionsItem defaultIcon="default-icon" label="Default label" />,
    );

    fireEvent.mouseEnter(container.querySelector('.ant-actions-item')!);

    expect(await findByText('Default label')).toBeInTheDocument();
  });

  it('renders tooltip with custom text', async () => {
    const { container, findByText } = render(
      <ActionsItem defaultIcon="default-icon" label="Default label" tooltip="Custom tooltip" />,
    );
    fireEvent.mouseEnter(container.querySelector('.ant-actions-item')!);
    expect(await findByText('Custom tooltip')).toBeInTheDocument();
  });

  it('renders tooltip with custom props', async () => {
    const { container, findByText } = render(
      <ActionsItem
        defaultIcon="default-icon"
        label="Default label"
        tooltip={{ title: 'Custom tooltip' }}
      />,
    );
    fireEvent.mouseEnter(container.querySelector('.ant-actions-item')!);
    expect(await findByText('Custom tooltip')).toBeInTheDocument();
  });
});
