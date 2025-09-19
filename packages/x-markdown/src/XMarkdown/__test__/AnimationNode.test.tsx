import { act, render, screen } from '@testing-library/react';
import React from 'react';
import AnimationNode, { AnimationText } from '../AnimationNode';

describe('AnimationText Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render text without animation when no change', () => {
    const { container } = render(<AnimationText text="test" />);
    expect(container.textContent).toBe('test');
  });

  it('should apply custom animation config', () => {
    const customConfig = {
      fadeDuration: 300,
      opacity: 0.3,
    };
    render(<AnimationText text="test" animationConfig={customConfig} />);
    expect(screen.getByText('test')).toBeInTheDocument();
  });

  it('should handle text animation with fade effect', () => {
    const { container, rerender } = render(
      <AnimationText text="Hello" animationConfig={{ fadeDuration: 100, opacity: 0.5 }} />,
    );

    expect(container.textContent).toBe('Hello');

    // Test text update with animation
    rerender(
      <AnimationText text="Hello World" animationConfig={{ fadeDuration: 100, opacity: 0.5 }} />,
    );
    expect(container.textContent).toContain('Hello');
  });

  it('should handle animation completion when elapsed time exceeds fadeDuration', () => {
    const { rerender } = render(
      <AnimationText text="Hello" animationConfig={{ fadeDuration: 100, opacity: 0.5 }} />,
    );

    // Mock performance.now and requestAnimationFrame
    const mockNow = jest.spyOn(performance, 'now');
    const mockRaf = jest.spyOn(window, 'requestAnimationFrame');

    mockNow.mockReturnValue(1000);
    let rafCallback: FrameRequestCallback = () => {};
    mockRaf.mockImplementation((callback) => {
      rafCallback = callback;
      return 1;
    });

    rerender(
      <AnimationText text="Hello World" animationConfig={{ fadeDuration: 100, opacity: 0.5 }} />,
    );

    // Test the animation callback with elapsed >= fadeDuration
    act(() => {
      mockNow.mockReturnValue(1101); // 101ms elapsed >= 100ms fadeDuration
      rafCallback(1101);
    });

    // The text should be fully updated
    expect(screen.getByText('Hello World')).toBeInTheDocument();

    mockNow.mockRestore();
    mockRaf.mockRestore();
  });

  it('should handle startTimeRef being null in animation callback', () => {
    const { rerender } = render(
      <AnimationText text="Hello" animationConfig={{ fadeDuration: 100, opacity: 0.5 }} />,
    );

    // Mock requestAnimationFrame to directly call the callback
    const mockRaf = jest.spyOn(window, 'requestAnimationFrame');
    mockRaf.mockImplementation((callback) => {
      // Call the callback with a timestamp, but we'll ensure startTimeRef is null
      callback(1000);
      return 1;
    });

    // Force re-render to trigger animation logic
    rerender(
      <AnimationText text="Hello World" animationConfig={{ fadeDuration: 100, opacity: 0.5 }} />,
    );

    // This should not throw any errors and should early return
    expect(() => {
      act(() => {
        jest.advanceTimersByTime(50);
      });
    }).not.toThrow();

    mockRaf.mockRestore();
  });

  it('should handle empty text', () => {
    const { container } = render(<AnimationText text="" />);
    expect(container.textContent).toBe('');
  });

  it('should handle null/undefined children gracefully', () => {
    const { container } = render(<AnimationText text={null as any} />);
    expect(container.textContent).toBe('');
  });

  it('should handle text that is not a prefix of previous text', () => {
    const { container, rerender } = render(
      <AnimationText text="Hello" animationConfig={{ fadeDuration: 100, opacity: 0.5 }} />,
    );

    expect(container.textContent).toBe('Hello');

    // Test text that is not a prefix (completely different text)
    rerender(<AnimationText text="World" animationConfig={{ fadeDuration: 100, opacity: 0.5 }} />);
    expect(container.textContent).toBe('World');
  });

  it('should handle same text re-render without animation', () => {
    const { container, rerender } = render(
      <AnimationText text="Hello" animationConfig={{ fadeDuration: 100, opacity: 0.5 }} />,
    );

    expect(container.textContent).toBe('Hello');

    // Re-render with same text
    rerender(<AnimationText text="Hello" animationConfig={{ fadeDuration: 100, opacity: 0.5 }} />);
    expect(container.textContent).toBe('Hello');
  });

  it('should test animation loop with requestAnimationFrame', () => {
    const { rerender } = render(
      <AnimationText text="Hello" animationConfig={{ fadeDuration: 100, opacity: 0.5 }} />,
    );

    // Mock requestAnimationFrame and performance.now
    const mockRaf = jest.spyOn(window, 'requestAnimationFrame');
    const mockNow = jest.spyOn(performance, 'now');

    mockNow.mockReturnValue(1000);
    let rafCallback: FrameRequestCallback = () => {};
    mockRaf.mockImplementation((callback) => {
      rafCallback = callback;
      return 1;
    });

    // Trigger animation by changing text
    rerender(
      <AnimationText text="Hello World" animationConfig={{ fadeDuration: 100, opacity: 0.5 }} />,
    );

    // Test animation loop - elapsed < fadeDuration should call requestAnimationFrame again
    act(() => {
      mockNow.mockReturnValue(1050); // 50ms elapsed < 100ms fadeDuration
      rafCallback(1050);
    });

    expect(mockRaf).toHaveBeenCalledTimes(2); // Initial + recursive call

    mockRaf.mockRestore();
    mockNow.mockRestore();
  });

  it('should use default animation values when config is not provided', () => {
    const { container } = render(<AnimationText text="test" />);
    expect(container.textContent).toBe('test');
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
      </AnimationNode>,
    );
    expect(screen.getByText('test string')).toBeInTheDocument();
  });

  it('should render ReactNode children directly', () => {
    render(
      <AnimationNode nodeTag="p" data-testid="test-node">
        <span data-testid="child">child</span>
      </AnimationNode>,
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('should handle array of children', () => {
    const { container } = render(
      <AnimationNode nodeTag="p">{['text1', 'text2', <span key="3">text3</span>]}</AnimationNode>,
    );
    expect(container.textContent).toContain('text1');
    expect(container.textContent).toContain('text2');
    expect(container.textContent).toContain('text3');
  });

  it('should pass through all props to created element', () => {
    render(
      <AnimationNode
        nodeTag="p"
        data-testid="test-node"
        className="test-class"
        style={{ color: 'red' }}
      />,
    );
    const node = screen.getByTestId('test-node');
    expect(node).toHaveClass('test-class');
    expect(node).toHaveStyle('color: red');
  });

  it('should handle empty children', () => {
    const { container } = render(<AnimationNode nodeTag="p" />);
    expect(container.querySelector('p')).toBeEmptyDOMElement();
  });

  it('should handle null children', () => {
    const { container } = render(<AnimationNode nodeTag="p">{null}</AnimationNode>);
    expect(container.querySelector('p')).toBeEmptyDOMElement();
  });

  it('should handle undefined children', () => {
    const { container } = render(<AnimationNode nodeTag="p">{undefined}</AnimationNode>);
    expect(container.querySelector('p')).toBeEmptyDOMElement();
  });

  it('should handle empty array children', () => {
    const { container } = render(<AnimationNode nodeTag="p">{[]}</AnimationNode>);
    expect(container.querySelector('p')).toBeEmptyDOMElement();
  });

  it('should handle mixed array with null/undefined values', () => {
    const { container } = render(
      <AnimationNode nodeTag="p">{['text1', null, undefined, 'text2']}</AnimationNode>,
    );
    expect(container.textContent).toContain('text1');
    expect(container.textContent).toContain('text2');
  });

  it('should handle different HTML tags', () => {
    render(
      <AnimationNode nodeTag="h1" data-testid="test-h1">
        Heading
      </AnimationNode>,
    );
    const node = screen.getByTestId('test-h1');
    expect(node.tagName).toBe('H1');
    expect(node.textContent).toBe('Heading');
  });

  it('should handle complex nested children', () => {
    const { container } = render(
      <AnimationNode nodeTag="p">
        <span>First</span>
        text
        <strong>Second</strong>
      </AnimationNode>,
    );
    expect(container.textContent).toContain('First');
    expect(container.textContent).toContain('text');
    expect(container.textContent).toContain('Second');
  });

  it('should handle _domNode and _streamStatus props correctly', () => {
    render(
      <AnimationNode
        nodeTag="p"
        data-testid="test-node"
        _domNode="test"
        _streamStatus="loading"
        className="should-be-passed"
      />,
    );
    const node = screen.getByTestId('test-node');
    expect(node).toHaveClass('should-be-passed');
    expect(node).not.toHaveAttribute('_domNode');
    expect(node).not.toHaveAttribute('_streamStatus');
  });
});
