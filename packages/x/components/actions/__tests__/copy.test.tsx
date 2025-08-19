
import React from 'react';
import { render, fireEvent } from '../../../tests/utils';
import ActionsCopy from '../ActionsCopy';

describe('ActionsCopy', () => {
  it('renders with text', () => {
    const { container } = render(<ActionsCopy text="hello" />);
    expect(container.querySelector('.ant-actions-copy')).toBeTruthy();
  });

  it('renders with icon', () => {
    const { container } = render(<ActionsCopy text="copy" icon={<span data-testid="icon" />} />);
    expect(container.querySelector('[data-testid="icon"]')).toBeTruthy();
  });

  it('supports custom className and prefixCls', () => {
    const { container } = render(
      <ActionsCopy text="test" className="my-class" prefixCls="my-prefix" />
    );
    expect(container.querySelector('.my-class')).toBeTruthy();
    expect(container.querySelector('.my-prefix-copy')).toBeTruthy();
  });

  it('supports rootClassName', () => {
    const { container } = render(
      <ActionsCopy text="test" rootClassName="root-class" />
    );
    expect(container.querySelector('.root-class')).toBeTruthy();
  });

  it('triggers copy event', () => {
    // 由于 antd CopyBtn 内部实现，直接模拟点击
    const { container } = render(<ActionsCopy text="copied!" />);
    const btn = container.querySelector('span');
    expect(btn).toBeTruthy();
    if (btn) {
      fireEvent.click(btn);
      // 这里只能保证点击事件被触发，具体复制行为由 antd 测试
    }
  });
});
