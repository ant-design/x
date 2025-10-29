import React from 'react';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import themeTest from '../../../tests/shared/themeTest';
import { fireEvent, render } from '../../../tests/utils';
import ThoughtChain from '..';

describe('ThoughtChain.Item Component', () => {
  mountTest(() => <ThoughtChain.Item />);

  rtlTest(() => <ThoughtChain.Item title="ThoughtChainItem.1" />);

  themeTest(() => <ThoughtChain.Item title="ThoughtChainItem.1" />);

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('ThoughtChain component work', () => {
    const { container, getByText } = render(<ThoughtChain.Item title="ThoughtChain.Item.title" />);
    const element = container.querySelector<HTMLUListElement>('.ant-thought-chain');
    expect(getByText('ThoughtChain.Item.title')).toBeInTheDocument();
    expect(element).toBeTruthy();
    expect(element).toMatchSnapshot();
  });

  it('ThoughtChain.Item supports ref', () => {
    const ref = React.createRef<any>();
    render(<ThoughtChain.Item ref={ref} title="ref test" />);
    expect(ref.current).not.toBeNull();
  });

  describe('Basic Rendering', () => {
    it('renders title correctly', () => {
      const { getByText } = render(<ThoughtChain.Item title="Test Title" />);
      expect(getByText('Test Title')).toBeInTheDocument();
    });

    it('renders description correctly', () => {
      const { getByText } = render(
        <ThoughtChain.Item title="Test Title" description="Test Description" />,
      );
      expect(getByText('Test Description')).toBeInTheDocument();
    });

    it('renders icon correctly', () => {
      const { container } = render(
        <ThoughtChain.Item title="Test Title" icon={<span data-testid="custom-icon" />} />,
      );
      expect(container.querySelector('[data-testid="custom-icon"]')).toBeInTheDocument();
    });

    it('does not render icon when icon is not provided', () => {
      const { container } = render(<ThoughtChain.Item title="Test Title" />);
      expect(container.querySelector('.ant-thought-chain-item-icon')).toBeNull();
    });
  });

  describe('Variant Styles', () => {
    it('applies solid variant', () => {
      const { container } = render(<ThoughtChain.Item title="Solid" variant="solid" />);
      expect(container.querySelector('.ant-thought-chain-item-solid')).toBeInTheDocument();
    });

    it('applies outlined variant', () => {
      const { container } = render(<ThoughtChain.Item title="Outlined" variant="outlined" />);
      expect(container.querySelector('.ant-thought-chain-item-outlined')).toBeInTheDocument();
    });

    it('applies text variant', () => {
      const { container } = render(<ThoughtChain.Item title="Text" variant="text" />);
      expect(container.querySelector('.ant-thought-chain-item-text')).toBeInTheDocument();
    });

    it('defaults to solid variant', () => {
      const { container } = render(<ThoughtChain.Item title="Default" />);
      expect(container.querySelector('.ant-thought-chain-item-solid')).toBeInTheDocument();
    });
  });

  describe('Blink Mode', () => {
    it('applies blink class when blink is true', () => {
      const { container } = render(<ThoughtChain.Item title="Blink" blink />);
      expect(container.querySelector('.ant-thought-chain-motion-blink')).toBeInTheDocument();
    });

    it('does not apply blink class when blink is false', () => {
      const { container } = render(<ThoughtChain.Item title="No Blink" blink={false} />);
      expect(container.querySelector('.ant-thought-chain-motion-blink')).toBeNull();
    });
  });

  describe('ClassNames and Styles', () => {
    it('applies custom classNames to root', () => {
      const { container } = render(
        <ThoughtChain.Item title="Custom Classes" classNames={{ root: 'custom-root' }} />,
      );
      expect(container.querySelector('.custom-root')).toBeInTheDocument();
    });

    it('applies custom styles to title', () => {
      const { container } = render(
        <ThoughtChain.Item title="Custom Styles" styles={{ title: { color: 'blue' } }} />,
      );
      const title = container.querySelector('.ant-thought-chain-item-title');
      expect(title).toHaveStyle('color: blue');
    });
  });

  describe('Click Events', () => {
    it('handles click events', () => {
      const handleClick = jest.fn();
      const { getByText } = render(<ThoughtChain.Item title="Clickable" onClick={handleClick} />);
      fireEvent.click(getByText('Clickable'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('applies click class when onClick is provided', () => {
      const { container } = render(<ThoughtChain.Item title="Clickable" onClick={() => {}} />);
      expect(container.querySelector('.ant-thought-chain-item-click')).toBeInTheDocument();
    });
  });

  describe('Custom Prefix', () => {
    it('uses custom prefix', () => {
      const { container } = render(
        <ThoughtChain.Item prefixCls="custom-prefix" title="Custom Prefix" />,
      );
      expect(container.querySelector('.custom-prefix-item')).toBeInTheDocument();
    });
  });

  describe('Ref and Native Element', () => {
    it('provides access to native element via ref', () => {
      const ref = React.createRef<any>();
      render(<ThoughtChain.Item ref={ref} title="Ref Test" />);
      expect(ref.current?.nativeElement).toBeInstanceOf(HTMLDivElement);
      expect(ref.current?.nativeElement).toHaveClass('ant-thought-chain-item');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty title by not rendering title element', () => {
      const { container } = render(<ThoughtChain.Item title="" />);
      expect(container.querySelector('.ant-thought-chain-item-title')).toBeNull();
    });

    it('handles null description', () => {
      const { container } = render(<ThoughtChain.Item title="Test" description={null as any} />);
      expect(container.querySelector('.ant-thought-chain-item-description')).toBeNull();
    });

    it('handles undefined icon', () => {
      const { container } = render(<ThoughtChain.Item title="Test" icon={undefined} />);
      expect(container.querySelector('.ant-thought-chain-item')).toBeInTheDocument();
    });

    it('applies title with description class when both are provided', () => {
      const { container } = render(
        <ThoughtChain.Item title="Test Title" description="Test Description" />,
      );
      const titleElement = container.querySelector('.ant-thought-chain-item-title');
      expect(titleElement).toHaveClass('ant-thought-chain-item-title-with-description');
    });
  });

  describe('Status and Error Handling', () => {
    it('applies error class for error status', () => {
      const { container } = render(<ThoughtChain.Item title="Error" status="error" />);
      expect(container.querySelector('.ant-thought-chain-item-error')).toBeInTheDocument();
    });

    it('renders with status prop', () => {
      const { container } = render(<ThoughtChain.Item title="Status Test" status="loading" />);
      expect(container.querySelector('.ant-thought-chain-item')).toBeInTheDocument();
    });
  });
});
