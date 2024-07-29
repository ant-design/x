import React from 'react';

import Bubble from '..';
import mountTest from '../../../tests/shared/mountTest';
import { render, waitFakeTimer } from '../../../tests/utils';

describe('bubble', () => {
  mountTest(() => <Bubble content="test" />);

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('Bubble component work', () => {
    const { container } = render(<Bubble content="test" />);
    const element = container.querySelector<HTMLDivElement>('.ant-bubble');
    expect(element).toBeTruthy();
    expect(element).toMatchSnapshot();
  });

  it('Bubble support content', () => {
    const { container } = render(<Bubble content="hello world" />);
    const element = container.querySelector<HTMLDivElement>(
      '.ant-bubble .ant-bubble-content',
    );
    expect(element?.textContent).toBe('hello world');
  });

  it('Bubble support contentRender', () => {
    const { container } = render(
      <Bubble
        content="test-contentRender"
        contentRender={(content) => (
          <span className="test-contentRender">{content}</span>
        )}
      />,
    );
    const element = container.querySelector<HTMLSpanElement>(
      '.ant-bubble .test-contentRender',
    );
    expect(element).toBeTruthy();
    expect(element?.textContent).toBe('test-contentRender');
  });

  it('Bubble support typing', () => {
    const { container } = render(<Bubble typing content="test" />);
    expect(container.querySelector<HTMLDivElement>('.ant-bubble')).toHaveClass(
      'ant-bubble-typing',
    );
  });

  it('Bubble support avatar', () => {
    const { container } = render(
      <Bubble
        avatar={<span className="test-avatar">avatar</span>}
        content=""
      />,
    );
    expect(
      container.querySelector<HTMLSpanElement>('.ant-bubble .test-avatar'),
    ).toBeTruthy();
  });

  it('Bubble support loading', () => {
    const { container } = render(<Bubble content="" loading />);
    const selectors = '.ant-bubble .ant-bubble-content .ant-bubble-dot';
    expect(container.querySelector<HTMLSpanElement>(selectors)).toBeTruthy();
  });

  it('Bubble support placement', () => {
    const { container, rerender } = render(
      <Bubble placement="start" content="" />,
    );
    const element = container.querySelector<HTMLDivElement>('.ant-bubble');
    expect(element).toHaveClass('ant-bubble-start');
    rerender(<Bubble placement="end" content="" />);
    expect(element).toHaveClass('ant-bubble-end');
  });

  it('Bubble support typing effect', async () => {
    const { container } = render(<Bubble typing content="你好你好你好" />);
    const element = container.querySelector<HTMLDivElement>(
      '.ant-bubble .ant-bubble-content',
    );
    expect(element?.textContent).toBe('你');
    await waitFakeTimer();
    expect(element?.textContent).toBe('你好你好你好');
  });

  it('Bubble Should support className & classNames & style & styles', () => {
    const { container } = render(
      <Bubble
        content="hello"
        avatar={<span>avatar</span>}
        className="test-className"
        classNames={{ avatar: 'test-avatar', content: 'test-content' }}
        style={{ backgroundColor: 'green' }}
        styles={{ avatar: { color: 'red' }, content: { color: 'blue' } }}
      />,
    );
    const element = container.querySelector<HTMLDivElement>('.ant-bubble');
    const avatarElement =
      element?.querySelector<HTMLDivElement>('.ant-bubble-avatar');
    const contentElement = element?.querySelector<HTMLDivElement>(
      '.ant-bubble-content',
    );
    expect(element).toHaveClass('test-className');
    expect(avatarElement).toHaveClass('test-avatar');
    expect(contentElement).toHaveClass('test-content');
    expect(element).toHaveStyle({ backgroundColor: 'green' });
    expect(avatarElement).toHaveStyle({ color: 'red' });
    expect(contentElement).toHaveStyle({ color: 'blue' });
  });
});
