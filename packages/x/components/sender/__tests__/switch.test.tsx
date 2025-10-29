import React from 'react';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import { fireEvent, render } from '../../../tests/utils';
import Sender from '../index';

describe('Sender.Switch', () => {
  mountTest(() => <Sender.Switch />);
  rtlTest(() => <Sender.Switch />);

  it('should support controlled mode', () => {
    const Demo = () => {
      const [checked, setChecked] = React.useState(false);
      return (
        <Sender.Switch
          value={checked}
          onChange={setChecked}
          checkedChildren="ON"
          unCheckedChildren="OFF"
        />
      );
    };
    const { getByText } = render(<Demo />);
    // Initial state is OFF
    expect(getByText('OFF')).toBeInTheDocument();
    // 点击切换
    fireEvent.click(getByText('OFF'));
    expect(getByText('ON')).toBeInTheDocument();
  });

  it('should support uncontrolled mode', () => {
    const { getByText } = render(<Sender.Switch checkedChildren="ON" unCheckedChildren="OFF" />);
    expect(getByText('OFF')).toBeInTheDocument();
    fireEvent.click(getByText('OFF'));
    expect(getByText('ON')).toBeInTheDocument();
  });

  it('should support disabled', () => {
    const onChange = jest.fn();
    const { container } = render(<Sender.Switch disabled onChange={onChange} />);
    // Should not trigger onChange when disabled
    fireEvent.click(container?.querySelector('.ant-sender-switch') as Element);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('should support loading', () => {
    const { container } = render(<Sender.Switch loading />);
    expect(container.querySelector('.anticon-loading')).toBeTruthy();
  });

  it('should support icon', () => {
    const { container } = render(<Sender.Switch icon={<span data-testid="icon">icon</span>} />);
    expect(container.querySelector('[data-testid="icon"]')).toBeTruthy();
  });

  it('should render checkedChildren and unCheckedChildren', () => {
    const { getByText } = render(<Sender.Switch checkedChildren="YES" unCheckedChildren="NO" />);
    expect(getByText('NO')).toBeInTheDocument();
    fireEvent.click(getByText('NO'));
    expect(getByText('YES')).toBeInTheDocument();
  });
});
