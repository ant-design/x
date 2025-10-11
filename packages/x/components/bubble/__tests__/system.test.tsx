import { render } from '@testing-library/react';
import React from 'react';
import SystemBubble from '../System';

describe('Bubble.System', () => {
  describe('基础功能', () => {
    it('应该正确渲染基本的 SystemBubble 组件', () => {
      const { container } = render(<SystemBubble content="系统消息" />);

      const bubbleElement = container.querySelector('.ant-bubble');
      const contentElement = container.querySelector('.ant-bubble-system-content');

      expect(bubbleElement).toBeInTheDocument();
      expect(bubbleElement).toHaveClass('ant-bubble-system');
      expect(contentElement).toBeInTheDocument();
      expect(contentElement).toHaveTextContent('系统消息');
    });

    it('应该支持空内容', () => {
      const { container } = render(<SystemBubble content="" />);

      const contentElement = container.querySelector('.ant-bubble-system-content');
      expect(contentElement).toBeInTheDocument();
      expect(contentElement).toHaveTextContent('');
    });

    it('应该支持自定义 class 前缀', () => {
      const { container } = render(<SystemBubble prefixCls="custom-bubble" content="测试内容" />);

      const bubbleElement = container.querySelector('.custom-bubble');
      expect(bubbleElement).toBeInTheDocument();
    });
  });

  describe('变体和形状', () => {
    it('应该支持不同的 variant 值', () => {
      const { container, rerender } = render(<SystemBubble content="测试" variant="shadow" />);

      let contentElement = container.querySelector('.ant-bubble-content');
      expect(contentElement).toHaveClass('ant-bubble-content-shadow');

      rerender(<SystemBubble content="测试" variant="filled" />);
      contentElement = container.querySelector('.ant-bubble-content');
      expect(contentElement).toHaveClass('ant-bubble-content-filled');

      rerender(<SystemBubble content="测试" variant="outlined" />);
      contentElement = container.querySelector('.ant-bubble-content');
      expect(contentElement).toHaveClass('ant-bubble-content-outlined');

      rerender(<SystemBubble content="测试" variant="borderless" />);
      contentElement = container.querySelector('.ant-bubble-content');
      expect(contentElement).toHaveClass('ant-bubble-content-borderless');
    });

    it('应该支持不同的 shape 值', () => {
      const { container, rerender } = render(<SystemBubble content="测试" shape="default" />);

      let contentElement = container.querySelector('.ant-bubble-content');
      expect(contentElement).toHaveClass('ant-bubble-content-default');

      rerender(<SystemBubble content="测试" shape="round" />);
      contentElement = container.querySelector('.ant-bubble-content');
      expect(contentElement).toHaveClass('ant-bubble-content-round');

      rerender(<SystemBubble content="测试" shape="corner" />);
      contentElement = container.querySelector('.ant-bubble-content');
      expect(contentElement).toHaveClass('ant-bubble-content-corner');
    });

    it('应该使用默认的 shadow 变体', () => {
      const { container } = render(<SystemBubble content="测试" />);

      const contentElement = container.querySelector('.ant-bubble-content');
      expect(contentElement).toHaveClass('ant-bubble-content-shadow');
    });
  });

  describe('内容类型支持', () => {
    it('应该支持 React 节点内容', () => {
      const content = <div className="custom-content">自定义内容</div>;
      const { container } = render(<SystemBubble content={content as any} />);

      expect(container.querySelector('.custom-content')).toBeInTheDocument();
      expect(container).toHaveTextContent('自定义内容');
    });
  });

  describe('样式和类名', () => {
    it('应该支持自定义 className', () => {
      const { container } = render(<SystemBubble content="测试" className="custom-class" />);

      const bubbleElement = container.querySelector('.ant-bubble');
      expect(bubbleElement).toHaveClass('custom-class');
      expect(bubbleElement).toHaveClass('ant-bubble-system');
    });

    it('应该支持自定义 style', () => {
      const { container } = render(<SystemBubble content="测试" style={{ padding: '10px' }} />);

      const bubbleElement = container.querySelector('.ant-bubble');
      expect(bubbleElement).toHaveStyle({ padding: '10px' });
    });

    it('应该支持 rootClassName', () => {
      const { container } = render(<SystemBubble content="测试" rootClassName="root-class" />);

      const bubbleElement = container.querySelector('.ant-bubble');
      expect(bubbleElement).toHaveClass('root-class');
    });

    it('应该支持 styles 属性', () => {
      const { container } = render(
        <SystemBubble content="测试" styles={{ content: { color: 'red' } }} />,
      );

      const contentElement = container.querySelector('.ant-bubble-system-content');
      expect(contentElement).toBeInTheDocument();
    });

    it('应该支持 classNames 属性', () => {
      const { container } = render(
        <SystemBubble content="测试" classNames={{ content: 'custom-content-class' }} />,
      );

      const contentElement = container.querySelector('.ant-bubble-content');
      expect(contentElement).toBeInTheDocument();
    });
  });
});
