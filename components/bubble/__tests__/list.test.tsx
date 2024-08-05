import React from 'react';

import Bubble from '..';
import { render, waitFakeTimer } from '../../../tests/utils';
import { spyElementPrototypes } from 'rc-util/lib/test/domHook';
import type { BubbleListRef } from '../BubbleList';

describe('Bubble.List', () => {
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
    const { container } = render(
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
});
