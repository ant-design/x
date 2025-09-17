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
});
