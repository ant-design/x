import React from 'react';

import Bubble from '..';
import { fireEvent, render } from '../../../tests/utils';
import mountTest from '../../../tests/shared/mountTest';
import { spyElementPrototypes } from 'rc-util/lib/test/domHook';
import type { BubbleListRef } from '../BubbleList';

describe('Bubble.List', () => {
  mountTest(() => <Bubble.List />);
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('scrollTo', () => {
    const scrollTo = jest.fn();
    const scrollIntoView = jest.fn();

    const scrollToSpy = spyElementPrototypes(HTMLElement, {
      scrollTo: {
        get: () => scrollTo,
      },
      scrollIntoView: {
        get: () => scrollIntoView,
      },
    });

    const listRef = React.createRef<BubbleListRef>();
    render(
      <Bubble.List
        ref={listRef}
        data={[
          {
            key: 'bamboo',
            content: 'little',
          },
        ]}
      />,
    );

    scrollTo.mockReset();
    scrollIntoView.mockReset();

    // Do offset scroll
    listRef.current?.scrollTo({ offset: 100 });
    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ top: 100 }));

    // Do key scroll but key not exist
    listRef.current?.scrollTo({ key: 'light' });
    expect(scrollIntoView).not.toHaveBeenCalled();

    // Do key scroll
    listRef.current?.scrollTo({ key: 'bamboo', block: 'nearest' });
    expect(scrollIntoView).toHaveBeenCalledWith(expect.objectContaining({ block: 'nearest' }));

    scrollToSpy.mockRestore();
  });

  it('not autoScroll if user scroll', () => {
    let scrollTop = 0;

    const scrollSpy = spyElementPrototypes(HTMLElement, {
      scrollTop: {
        get: () => scrollTop,
      },
      clientHeight: {
        get: () => 10,
      },
      scrollHeight: {
        get: () => 100,
      },
    });

    const { container } = render(
      <Bubble.List
        data={[
          {
            key: 'bamboo',
            content: 'little',
          },
        ]}
      />,
    );

    const listDOM = container.querySelector<HTMLDivElement>('.ant-bubble-list')!;

    // Not end
    fireEvent.scroll(listDOM);
    expect(listDOM).not.toHaveClass('ant-bubble-list-reach-end');

    // End
    scrollTop = 90;
    fireEvent.scroll(listDOM);
    expect(listDOM).toHaveClass('ant-bubble-list-reach-end');

    scrollSpy.mockRestore();
  });

  it('roles function', () => {
    const { container } = render(
      <Bubble.List
        roles={(bubble) => ({
          avatar: { style: { background: '#FF0000' } },
          placement: bubble.key as any,
        })}
        data={[
          {
            key: 'end',
            content: 'little',
          },
        ]}
      />,
    );

    expect(container.querySelector('.ant-bubble-end .ant-bubble-avatar > span')!).toHaveStyle({
      background: '#FF0000',
    });
  });

  it('autoScroll when data change', () => {
    const scrollSpy = spyElementPrototypes(HTMLElement, {
      scrollTop: {
        get: () => 0,
      },
      clientHeight: {
        get: () => 10,
      },
      scrollHeight: {
        get: () => 100,
      },
      getBoundingClientRect() {
        if ((this as any as HTMLElement).classList.contains('ant-bubble-list')) {
          return {
            top: 0,
            bottom: 10,
          };
        }

        return {
          top: -10,
          bottom: 1,
        };
      },
    });

    const getData = (count: number) =>
      Array.from({ length: count }, (_, i) => ({ key: i, content: String(i) }));

    const { container, rerender } = render(<Bubble.List data={getData(5)} />);

    rerender(<Bubble.List data={getData(6)} />);

    expect(container.querySelector('.ant-bubble-list-reach-end')).toBeTruthy();

    scrollSpy.mockRestore();
  });
});
