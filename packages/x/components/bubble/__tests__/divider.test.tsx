import { render } from '@testing-library/react';
import React from 'react';
import DividerBubble from '../Divider';

describe('Bubble.Divider', () => {
  describe('基础功能', () => {
    it('应该正确渲染基本的 DividerBubble 组件', () => {
      const { container } = render(<DividerBubble content="分割线内容" />);

      const bubbleElement = container.querySelector('.ant-bubble');
      const dividerElement = container.querySelector('.ant-divider');

      expect(bubbleElement).toBeInTheDocument();
      expect(bubbleElement).toHaveClass('ant-bubble-divider');
      expect(dividerElement).toBeInTheDocument();
      expect(dividerElement).toHaveTextContent('分割线内容');
    });

    it('应该支持空内容', () => {
      const { container } = render(<DividerBubble />);

      const dividerElement = container.querySelector('.ant-divider');
      expect(dividerElement).toBeInTheDocument();
      expect(dividerElement).toHaveTextContent('');
    });

    it('应该支持自定义 class 前缀', () => {
      const { container } = render(<DividerBubble prefixCls="custom-bubble" content="测试内容" />);

      const bubbleElement = container.querySelector('.custom-bubble');
      expect(bubbleElement).toBeInTheDocument();
    });

    it('应该支持 React 节点内容', () => {
      const content = <span className="custom-content">自定义内容</span>;
      const { container } = render(<DividerBubble content={content as any} />);

      expect(container.querySelector('.custom-content')).toBeInTheDocument();
      expect(container).toHaveTextContent('自定义内容');
    });
  });

  describe('Divider 属性传递', () => {
    it('应该正确传递 Divider 属性', () => {
      const { container } = render(
        <DividerBubble content="分割线" dividerProps={{ dashed: true, plain: true }} />,
      );

      const dividerElement = container.querySelector('.ant-divider');
      expect(dividerElement).toHaveClass('ant-divider-horizontal');
      expect(dividerElement).toHaveClass('ant-divider-dashed');
      expect(dividerElement).toHaveClass('ant-divider-with-text');
      expect(dividerElement).toHaveClass('ant-divider-plain');
    });
  });

  describe('样式和类名', () => {
    it('应该支持自定义 className', () => {
      const { container } = render(<DividerBubble content="测试" className="custom-class" />);

      const bubbleElement = container.querySelector('.ant-bubble-divider');
      expect(bubbleElement).toBeInTheDocument();
      expect(bubbleElement).toHaveClass('custom-class');
    });

    it('应该支持自定义 style', () => {
      const { container } = render(
        <DividerBubble content="测试" style={{ backgroundColor: 'red' }} />,
      );

      const divierElm = container.querySelector('.ant-bubble-divider');
      expect(divierElm).toBeInTheDocument();
      expect(divierElm).toHaveStyle({ backgroundColor: 'red' });
    });
  });
});
