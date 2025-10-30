import React from 'react';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import themeTest from '../../../tests/shared/themeTest';
import { fireEvent, render, screen } from '../../../tests/utils';
import ThoughtChain from '../Item';

describe('ThoughtChain.Item', () => {
  mountTest(() => <ThoughtChain />);
  rtlTest(() => <ThoughtChain title="Test" />);
  themeTest(() => <ThoughtChain title="Test" />);

  describe('Basic Rendering', () => {
    it('renders with minimal props', () => {
      const { container } = render(<ThoughtChain />);
      expect(container.querySelector('.ant-thought-chain-item')).toBeInTheDocument();
    });

    it('renders title correctly', () => {
      render(<ThoughtChain title="Test Title" />);
      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('renders description correctly', () => {
      render(<ThoughtChain title="Title" description="Test Description" />);
      expect(screen.getByText('Test Description')).toBeInTheDocument();
    });

    it('renders icon when provided', () => {
      const { container } = render(
        <ThoughtChain title="Test" icon={<span data-testid="custom-icon">🔍</span>} />,
      );
      expect(container.querySelector('[data-testid="custom-icon"]')).toBeInTheDocument();
    });

    it('does not render icon when neither icon nor status is provided', () => {
      const { container } = render(<ThoughtChain title="Test" />);
      expect(container.querySelector('.ant-thought-chain-item-icon')).toBeNull();
    });

    it('renders status when status is provided', () => {
      const { container } = render(<ThoughtChain title="Test" status="loading" />);
      expect(container.querySelector('.ant-thought-chain-item')).toBeInTheDocument();
    });
  });

  describe('Status Variants', () => {
    it.each(['loading', 'success', 'error', 'abort'] as const)(
      'renders %s status correctly',
      (status) => {
        const { container } = render(<ThoughtChain title="Test" status={status} />);
        expect(container.querySelector('.ant-thought-chain-item')).toBeInTheDocument();
      },
    );

    it('applies error class for error status', () => {
      const { container } = render(<ThoughtChain title="Error" status="error" />);
      expect(container.querySelector('.ant-thought-chain-item-error')).toBeInTheDocument();
    });
  });

  describe('Variant Styles', () => {
    it.each(['solid', 'outlined', 'text'] as const)('applies %s variant', (variant) => {
      const { container } = render(<ThoughtChain title="Test" variant={variant} />);
      expect(container.querySelector(`.ant-thought-chain-item-${variant}`)).toBeInTheDocument();
    });

    it('defaults to solid variant', () => {
      const { container } = render(<ThoughtChain title="Test" />);
      expect(container.querySelector('.ant-thought-chain-item-solid')).toBeInTheDocument();
    });
  });

  describe('Blink Mode', () => {
    it('applies blink class when blink is true', () => {
      const { container } = render(<ThoughtChain title="Blink" blink />);
      expect(container.querySelector('.ant-thought-chain-motion-blink')).toBeInTheDocument();
    });

    it('does not apply blink class when blink is false', () => {
      const { container } = render(<ThoughtChain title="No Blink" blink={false} />);
      expect(container.querySelector('.ant-thought-chain-motion-blink')).toBeNull();
    });
  });

  describe('ClassNames and Styles', () => {
    it('applies custom classNames to root', () => {
      const { container } = render(
        <ThoughtChain title="Test" classNames={{ root: 'custom-root' }} />,
      );
      expect(container.querySelector('.custom-root')).toBeInTheDocument();
    });

    it('applies custom classNames to icon', () => {
      const { container } = render(
        <ThoughtChain title="Test" status="success" classNames={{ icon: 'custom-icon' }} />,
      );
      expect(container.querySelector('.custom-icon')).toBeInTheDocument();
    });

    it('applies custom classNames to title', () => {
      const { container } = render(
        <ThoughtChain title="Test" classNames={{ title: 'custom-title' }} />,
      );
      expect(container.querySelector('.custom-title')).toBeInTheDocument();
    });

    it('applies custom classNames to description', () => {
      const { container } = render(
        <ThoughtChain
          title="Test"
          description="Desc"
          classNames={{ description: 'custom-description' }}
        />,
      );
      expect(container.querySelector('.custom-description')).toBeInTheDocument();
    });

    it('applies custom styles to title', () => {
      const { container } = render(
        <ThoughtChain title="Test" styles={{ title: { color: 'blue' } }} />,
      );
      const title = container.querySelector('.ant-thought-chain-item-title');
      expect(title).toHaveStyle('color: blue');
    });

    it('applies custom styles to description', () => {
      const { container } = render(
        <ThoughtChain
          title="Test"
          description="Desc"
          styles={{ description: { fontSize: '16px' } }}
        />,
      );
      const description = container.querySelector('.ant-thought-chain-item-description');
      expect(description).toHaveStyle('font-size: 16px');
    });
  });

  describe('Click Events', () => {
    it('handles click events', () => {
      const handleClick = jest.fn();
      render(<ThoughtChain title="Clickable" onClick={handleClick} />);
      fireEvent.click(screen.getByText('Clickable'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('applies click class when onClick is provided', () => {
      const { container } = render(<ThoughtChain title="Clickable" onClick={() => {}} />);
      expect(container.querySelector('.ant-thought-chain-item-click')).toBeInTheDocument();
    });

    it('does not apply click class when onClick is not provided', () => {
      const { container } = render(<ThoughtChain title="Not Clickable" />);
      expect(container.querySelector('.ant-thought-chain-item-click')).toBeNull();
    });
  });

  describe('Custom Prefix', () => {
    it('uses custom prefix', () => {
      const { container } = render(<ThoughtChain prefixCls="custom-prefix" title="Test" />);
      expect(container.querySelector('.custom-prefix-item')).toBeInTheDocument();
    });
  });

  describe('Ref Support', () => {
    it('provides access to native element via ref', () => {
      const ref = React.createRef<{ nativeElement: HTMLElement }>();
      render(<ThoughtChain ref={ref} title="Ref Test" />);
      expect(ref.current?.nativeElement).toBeInstanceOf(HTMLDivElement);
      expect(ref.current?.nativeElement).toHaveClass('ant-thought-chain-item');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty title by not rendering title element', () => {
      const { container } = render(<ThoughtChain title="" />);
      expect(container.querySelector('.ant-thought-chain-item-title')).toBeNull();
    });

    it('handles null title by not rendering title element', () => {
      const { container } = render(<ThoughtChain title={null as any} />);
      expect(container.querySelector('.ant-thought-chain-item-title')).toBeNull();
    });

    it('handles undefined title by not rendering title element', () => {
      const { container } = render(<ThoughtChain />);
      expect(container.querySelector('.ant-thought-chain-item-title')).toBeNull();
    });

    it('handles null description by not rendering description element', () => {
      const { container } = render(<ThoughtChain title="Test" description={null as any} />);
      expect(container.querySelector('.ant-thought-chain-item-description')).toBeNull();
    });

    it('handles undefined description by not rendering description element', () => {
      const { container } = render(<ThoughtChain title="Test" />);
      expect(container.querySelector('.ant-thought-chain-item-description')).toBeNull();
    });

    it('handles empty description by not rendering description element', () => {
      const { container } = render(<ThoughtChain title="Test" description="" />);
      expect(container.querySelector('.ant-thought-chain-item-description')).toBeNull();
    });

    it('applies title with description class when both title and description are provided', () => {
      const { container } = render(
        <ThoughtChain title="Test Title" description="Test Description" />,
      );
      const titleElement = container.querySelector('.ant-thought-chain-item-title');
      expect(titleElement).toHaveClass('ant-thought-chain-item-title-with-description');
    });

    it('does not apply title with description class when only title is provided', () => {
      const { container } = render(<ThoughtChain title="Test Title" />);
      const titleElement = container.querySelector('.ant-thought-chain-item-title');
      expect(titleElement).not.toHaveClass('ant-thought-chain-item-title-with-description');
    });
  });

  describe('Props Combinations', () => {
    it('handles all props together', () => {
      const { container } = render(
        <ThoughtChain
          title="Full Test"
          description="Full Description"
          status="success"
          variant="outlined"
          icon={<span>✓</span>}
          blink
          onClick={() => {}}
          classNames={{ root: 'test-root' }}
          styles={{ title: { color: 'green' } }}
        />,
      );

      expect(container.querySelector('.test-root')).toBeInTheDocument();
      expect(container.querySelector('.ant-thought-chain-item-outlined')).toBeInTheDocument();
      expect(container.querySelector('.ant-thought-chain-motion-blink')).toBeInTheDocument();
      expect(container.querySelector('.ant-thought-chain-item-click')).toBeInTheDocument();
    });
  });

  describe('HTML Attributes', () => {
    it('passes through HTML attributes', () => {
      const { container } = render(
        <ThoughtChain title="Test" data-testid="custom-testid" aria-label="test-label" />,
      );
      const element = container.querySelector('.ant-thought-chain-item');
      expect(element).toHaveAttribute('data-testid', 'custom-testid');
      expect(element).toHaveAttribute('aria-label', 'test-label');
    });

    it('handles custom className', () => {
      const { container } = render(<ThoughtChain title="Test" className="custom-classname" />);
      const element = container.querySelector('.ant-thought-chain-item');
      expect(element).toHaveClass('custom-classname');
    });

    it('handles custom style', () => {
      const { container } = render(<ThoughtChain title="Test" style={{ margin: '10px' }} />);
      const element = container.querySelector('.ant-thought-chain-item');
      expect(element).toHaveStyle('margin: 10px');
    });
  });
});
