import React from 'react';

import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import { fireEvent, render, waitFakeTimer } from '../../../tests/utils';
import Sources from '../index';

const items = [
  {
    title: '1. Data source',
    url: 'https://x.ant.design/components/overview',
  },
  {
    title: '2. Data source',
    url: 'https://x.ant.design/components/overview',
  },
  {
    title: '3. Data source',
    url: 'https://x.ant.design/components/overview',
  },
];

describe('Sources Component', () => {
  mountTest(() => <Sources title={'Test'} items={items} />);

  rtlTest(() => <Sources title={'Test'} items={items} />);

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('Sources component work', () => {
    const { container } = render(<Sources title={'Test'} items={items} />);
    const element = container.querySelector<HTMLDivElement>('.ant-sources');
    expect(element).toBeTruthy();
    expect(element).toMatchSnapshot();
  });

  it('Sources should support custom style and styles', () => {
    const { container } = render(
      <Sources
        title="Test"
        items={items}
        style={{ backgroundColor: 'red' }}
        styles={{ root: { padding: '10px' } }}
      />,
    );
    const element = container.querySelector<HTMLDivElement>('.ant-sources');
    expect(element).toHaveStyle('background-color: red');
    expect(element).toHaveStyle('padding: 10px');
  });

  it('Sources should support custom className and classNames', () => {
    const { container } = render(
      <Sources
        title="Test"
        items={items}
        className="test-className"
        classNames={{ root: 'test-className2' }}
      />,
    );
    const element = container.querySelector<HTMLDivElement>('.ant-sources');
    expect(element).toHaveClass('test-className');
    expect(element).toHaveClass('test-className2');
  });

  it('Sources should support expandIconPosition', () => {
    const { container } = render(<Sources title="Test" items={items} expandIconPosition="end" />);
    const element = container.querySelector<HTMLDivElement>('.ant-sources-icon-position-end');
    expect(element).toBeTruthy();
  });

  it('Sources should support controlled expanded state', async () => {
    const { container } = render(<Sources title="Test" items={items} defaultExpanded={false} />);

    expect(container.querySelector('.ant-sources-content')).toBeNull();
    fireEvent.click(container.querySelector('.ant-sources-title-wrapper')!);
    await waitFakeTimer();
    expect(container.querySelector('.ant-sources-content')).toBeTruthy();
  });

  it('Sources should support inline mode', () => {
    const { container } = render(<Sources title="Test" items={items} inline />);
    const element = container.querySelector<HTMLDivElement>('.ant-sources-inline');
    expect(element).toBeTruthy();
  });

  it('Sources should support items with all properties', () => {
    const fullItems = [
      {
        key: 'test-key',
        title: 'Test Title',
        url: 'https://test.com',
        icon: <span data-testid="test-icon">icon</span>,
        description: 'Test description',
      },
    ];

    const { container, getByTestId } = render(<Sources title="Test" items={fullItems} />);

    const icon = getByTestId('test-icon');
    expect(icon).toBeTruthy();

    const link = container.querySelector<HTMLAnchorElement>('.ant-sources-link');
    expect(link).toHaveAttribute('href', 'https://test.com');
  });

  it('Sources should support children instead of items', () => {
    const { container } = render(
      <Sources title="Test">
        <div data-testid="custom-content">Custom content</div>
      </Sources>,
    );

    const customContent = container.querySelector('[data-testid="custom-content"]');
    expect(customContent).toBeTruthy();
  });

  it('Sources supports ref', () => {
    const ref = React.createRef<any>();
    render(<Sources ref={ref} title={'Test'} items={items} />);
    expect(ref.current).not.toBeNull();
  });

  it('Sources should support CarouselCard left/right navigation', async () => {
    const carouselItems = [
      {
        key: '1',
        title: 'First Item',
        url: 'https://first.com',
        description: 'First description',
      },
      {
        key: '2',
        title: 'Second Item',
        url: 'https://second.com',
        description: 'Second description',
      },
      {
        key: '3',
        title: 'Third Item',
        url: 'https://third.com',
        description: 'Third description',
      },
    ];

    const { container } = render(<Sources title="Test" items={carouselItems} inline />);

    const titleWrapper = container.querySelector('.ant-sources-title-wrapper');
    expect(titleWrapper).toBeTruthy();
    const carouselCard = container.querySelector('.ant-sources-carousel');
    expect(carouselCard).toBeTruthy();

    const leftBtn = container.querySelector(
      '.ant-sources-carousel-btn-wrapper .ant-sources-carousel-left-btn',
    );
    const rightBtn = container.querySelector(
      '.ant-sources-carousel-btn-wrapper .ant-sources-carousel-right-btn',
    );

    // 验证按钮存在
    expect(leftBtn).toBeTruthy();
    expect(rightBtn).toBeTruthy();

    // 验证初始状态
    const pageIndicator = container.querySelector('.ant-sources-carousel-page');
    expect(pageIndicator).toHaveTextContent('1/3');

    // 验证按钮状态
    expect(leftBtn).toHaveClass('ant-sources-carousel-btn-disabled');
    expect(rightBtn).not.toHaveClass('ant-sources-carousel-btn-disabled');

    // 点击右按钮
    fireEvent.click(rightBtn!);
    await waitFakeTimer();

    // 验证状态更新
    expect(pageIndicator).toHaveTextContent('2/3');
    expect(leftBtn).not.toHaveClass('ant-sources-carousel-btn-disabled');

    // 点击左按钮
    fireEvent.click(leftBtn!);
    await waitFakeTimer();

    // 验证状态更新
    expect(pageIndicator).toHaveTextContent('1/3');
    expect(leftBtn).toHaveClass('ant-sources-carousel-btn-disabled');
  });

  it('Sources should support onClick', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    const { container } = render(
      <Sources
        title="Test"
        items={items}
        onClick={(item) => {
          console.log(`Clicked: ${item.title}`);
        }}
        defaultExpanded={true}
      />,
    );

    const firstItem = container.querySelector('.ant-sources-list-item');
    expect(firstItem).toBeTruthy();

    fireEvent.click(firstItem!);
    expect(consoleSpy).toHaveBeenCalledWith('Clicked: 1. Data source');

    consoleSpy.mockRestore();
  });

  it('Sources should support onClick on line mode', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    const { container } = render(
      <Sources
        title="Test"
        items={items}
        onClick={(item) => {
          console.log(`Clicked: ${item.title}`);
        }}
        inline
      />,
    );

    const firstItem = container.querySelector('.ant-sources-carousel-item');
    expect(firstItem).toBeTruthy();

    fireEvent.click(firstItem!);
    expect(consoleSpy).toHaveBeenCalledWith('Clicked: 1. Data source');

    consoleSpy.mockRestore();
  });
});
