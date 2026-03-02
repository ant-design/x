import { render } from '@testing-library/react';
import React from 'react';
import DividerBubble from '../Divider';

describe('Bubble.Divider', () => {
  describe('Basic functionality', () => {
    it('should correctly render basic DividerBubble component', () => {
      const { container } = render(<DividerBubble content="分割线内容" />);

      const bubbleElement = container.querySelector('.ant-bubble');
      const dividerElement = container.querySelector('.ant-divider');

      expect(bubbleElement).toBeInTheDocument();
      expect(bubbleElement).toHaveClass('ant-bubble-divider');
      expect(dividerElement).toBeInTheDocument();
      expect(dividerElement).toHaveTextContent('分割线内容');
    });

    it('should support empty content', () => {
      const { container } = render(<DividerBubble />);

      const dividerElement = container.querySelector('.ant-divider');
      expect(dividerElement).toBeInTheDocument();
      expect(dividerElement).toHaveTextContent('');
    });

    it('should support custom class prefix', () => {
      const { container } = render(<DividerBubble prefixCls="custom-bubble" content="测试内容" />);

      const bubbleElement = container.querySelector('.custom-bubble');
      expect(bubbleElement).toBeInTheDocument();
    });

    it('should support React node content', () => {
      const content = <span className="custom-content">自定义内容</span>;
      const { container } = render(<DividerBubble content={content as any} />);

      expect(container.querySelector('.custom-content')).toBeInTheDocument();
      expect(container).toHaveTextContent('自定义内容');
    });
  });

  describe('Divider property passing', () => {
    it('should correctly pass Divider properties', () => {
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

  describe('Styles and class names', () => {
    it('should support custom className', () => {
      const { container } = render(<DividerBubble content="测试" className="custom-class" />);

      const bubbleElement = container.querySelector('.ant-bubble-divider');
      expect(bubbleElement).toBeInTheDocument();
      expect(bubbleElement).toHaveClass('custom-class');
    });

    it('should support custom style', () => {
      const { container } = render(
        <DividerBubble content="测试" style={{ backgroundColor: 'red' }} />,
      );

      const divierElm = container.querySelector('.ant-bubble-divider');
      expect(divierElm).toBeInTheDocument();
      expect(divierElm).toHaveStyle({ backgroundColor: 'red' });
    });
  });
});
