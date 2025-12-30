import { render } from '@testing-library/react';
import React from 'react';
import SystemBubble from '../System';

describe('Bubble.System', () => {
  describe('Basic functionality', () => {
    it('should correctly render basic SystemBubble component', () => {
      const { container } = render(<SystemBubble content="系统消息" />);

      const bubbleElement = container.querySelector('.ant-bubble');
      const contentElement = container.querySelector('.ant-bubble-content');

      expect(bubbleElement).toBeInTheDocument();
      expect(bubbleElement).toHaveClass('ant-bubble-system');
      expect(contentElement).toBeInTheDocument();
      expect(contentElement).toHaveTextContent('系统消息');
    });

    it('should support empty content', () => {
      const { container } = render(<SystemBubble content="" />);

      const contentElement = container.querySelector('.ant-bubble-content');
      expect(contentElement).toBeInTheDocument();
      expect(contentElement).toHaveTextContent('');
    });

    it('should support custom class prefix', () => {
      const { container } = render(<SystemBubble prefixCls="custom-bubble" content="测试内容" />);

      const bubbleElement = container.querySelector('.custom-bubble');
      expect(bubbleElement).toBeInTheDocument();
    });
  });

  describe('Variants and shapes', () => {
    it('should support different variant values', () => {
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

    it('should support different shape values', () => {
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

    it('should use default shadow variant', () => {
      const { container } = render(<SystemBubble content="测试" />);

      const contentElement = container.querySelector('.ant-bubble-content');
      expect(contentElement).toHaveClass('ant-bubble-content-shadow');
    });
  });

  describe('Content type support', () => {
    it('should support React node content', () => {
      const content = <div className="custom-content">自定义内容</div>;
      const { container } = render(<SystemBubble content={content as any} />);

      expect(container.querySelector('.custom-content')).toBeInTheDocument();
      expect(container).toHaveTextContent('自定义内容');
    });
  });

  describe('Styles and class names', () => {
    it('should support custom className', () => {
      const { container } = render(<SystemBubble content="测试" className="custom-class" />);

      const bubbleElement = container.querySelector('.ant-bubble');
      expect(bubbleElement).toHaveClass('custom-class');
      expect(bubbleElement).toHaveClass('ant-bubble-system');
    });

    it('should support custom style', () => {
      const { container } = render(<SystemBubble content="测试" style={{ padding: '10px' }} />);

      const bubbleElement = container.querySelector('.ant-bubble');
      expect(bubbleElement).toHaveStyle({ padding: '10px' });
    });

    it('should support rootClassName', () => {
      const { container } = render(<SystemBubble content="测试" rootClassName="root-class" />);

      const bubbleElement = container.querySelector('.ant-bubble');
      expect(bubbleElement).toHaveClass('root-class');
    });

    it('should support styles property', () => {
      const { container } = render(
        <SystemBubble content="测试" styles={{ content: { color: 'red' } }} />,
      );

      const contentElement = container.querySelector('.ant-bubble-content');
      expect(contentElement).toBeInTheDocument();
    });

    it('should support classNames property', () => {
      const { container } = render(
        <SystemBubble content="测试" classNames={{ content: 'custom-content-class' }} />,
      );

      const contentElement = container.querySelector('.ant-bubble-content');
      expect(contentElement).toBeInTheDocument();
    });
  });
});
