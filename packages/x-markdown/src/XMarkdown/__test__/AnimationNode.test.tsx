import React from 'react';
import { render, screen } from '@testing-library/react';
import AnimationNode, { AnimationText } from '../AnimationNode';

describe('AnimationText Component', () => {
  it('should render text without animation when no change', () => {
    const { container } = render(<AnimationText text="test" />);
    expect(container.textContent).toBe('test');
  });

  it('should apply custom animation config', () => {
    const customConfig = {
      from: { opacity: 0.5 },
      to: { opacity: 1 },
      config: { tension: 200, friction: 30 }
    };
    render(<AnimationText text="test" animationConfig={customConfig} />);
    expect(screen.getByText('test')).toBeInTheDocument();
  });
});

describe('AnimationNode Component', () => {
  it('should create element with correct tag', () => {
    render(<AnimationNode nodeTag="p" data-testid="test-node" />);
    const node = screen.getByTestId('test-node');
    expect(node.tagName).toBe('P');
  });

  it('should render string children with AnimationText', () => {
    render(
      <AnimationNode nodeTag="p" data-testid="test-node">
        test string
      </AnimationNode>
    );
    expect(screen.getByText('test string')).toBeInTheDocument();
  });

  it('should render ReactNode children directly', () => {
    render(
      <AnimationNode nodeTag="p" data-testid="test-node">
        <span data-testid="child">child</span>
      </AnimationNode>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('should handle array of children', () => {
    render(
      <AnimationNode nodeTag="p">
        {['text1', 'text2', <span key="3">text3</span>]}
      </AnimationNode>
    );
    expect(screen.getByText('text1')).toBeInTheDocument();
    expect(screen.getByText('text2')).toBeInTheDocument();
    expect(screen.getByText('text3')).toBeInTheDocument();
  });

  it('should pass through all props to created element', () => {
    render(
      <AnimationNode 
        nodeTag="p" 
        data-testid="test-node" 
        className="test-class" 
        style={{ color: 'red' }}
      />
    );
    const node = screen.getByTestId('test-node');
    expect(node).toHaveClass('test-class');
    expect(node).toHaveStyle('color: red');
  });
});
