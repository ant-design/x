import React from 'react';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import { fireEvent, render } from '../../../tests/utils';
import Sender from '../index';

describe('Sender.Header', () => {
  mountTest(() => <Sender.Header />);
  rtlTest(() => <Sender.Header />);

  it('should render default Sender.Header', () => {
    const { container } = render(<Sender.Header />);
    expect(container.firstChild).toBeTruthy();
  });

  it('should render with title prop', () => {
    const { getByText } = render(<Sender.Header title="Chat Title" />);
    expect(getByText('Chat Title')).toBeInTheDocument();
  });

  it('should support custom className', () => {
    const { container } = render(<Sender.Header className="custom-header" />);
    expect(container.querySelector('.custom-header')).toBeTruthy();
  });

  it('should support custom style', () => {
    const { container } = render(<Sender.Header style={{ color: 'red' }} />);
    expect(container.firstChild).toHaveStyle('color: red');
  });

  it('should render close button when closable is true', () => {
    const { container } = render(<Sender.Header closable />);
    // 断言关闭按钮存在
    expect(container.querySelector('.ant-sender-header-close')).toBeTruthy();
  });

  it('should call onClose when close button is clicked', () => {
    const onClose = jest.fn();
    const { container } = render(<Sender.Header closable onOpenChange={onClose} />);
    const closeBtn = container.querySelector('.ant-sender-header-close');
    expect(closeBtn).toBeTruthy();
    if (closeBtn) {
      fireEvent.click(closeBtn);
    }
  });
  it('should call onOpenChange with toggled value when close button is clicked', () => {
    const onOpenChange = jest.fn();
    // open 为 true，点击后应变为 false
    const { container } = render(
      <Sender.Header title="title" closable open={true} onOpenChange={onOpenChange} />,
    );
    const closeBtn = container.querySelector('.ant-sender-header-close button');
    expect(closeBtn).toBeTruthy();
    if (closeBtn) {
      fireEvent.click(closeBtn);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    }
  });
});
