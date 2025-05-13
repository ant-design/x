import React from 'react';
import { Bubble } from '../../index';
import XProvider from '../index';

import { render } from '../../../tests/utils';

import { StyleProvider, createCache } from '@ant-design/cssinjs';

describe('XProvider.cssVar', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    document.head.innerHTML = '';
  });

  it('without XProvider', () => {
    const { container } = render(
      <StyleProvider cache={createCache()}>
        <Bubble content="test" />
      </StyleProvider>,
    );

    const styleList = Array.from(document.head.querySelectorAll('style'));
    const bubbleStyle = styleList.find((style) => style.innerHTML.includes('.ant-bubble'))!;
    expect(bubbleStyle.innerHTML).not.toContain('var(--ant-');

    expect(container.querySelector('.ant-bubble')?.className).not.toContain('css-var-');
  });

  it('with XProvider', () => {
    const { container } = render(
      <StyleProvider cache={createCache()}>
        <XProvider theme={{ cssVar: true }}>
          <Bubble content="test" />
        </XProvider>
      </StyleProvider>,
    );

    const styleList = Array.from(document.head.querySelectorAll('style'));
    const bubbleStyle = styleList.find((style) => style.innerHTML.includes('.ant-bubble'))!;
    expect(bubbleStyle.innerHTML).toContain('var(--ant-');

    expect(container.querySelector('.ant-bubble')?.className).toContain('css-var-');
  });
});
