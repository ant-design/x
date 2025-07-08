import { createCache, StyleProvider } from '@ant-design/cssinjs';
import React from 'react';
import { render } from '../../../tests/utils';
import { Bubble } from '../../index';
import XProvider from '../index';

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
    expect(bubbleStyle.innerHTML).toContain('ant-bubble');
    expect(container.querySelector('.ant-bubble')?.className).toContain('ant-bubble');
  });

  it('with XProvider', () => {
    const { container } = render(
      <StyleProvider cache={createCache()}>
        <XProvider>
          <Bubble content="test" />
        </XProvider>
      </StyleProvider>,
    );

    const styleList = Array.from(document.head.querySelectorAll('style'));
    const bubbleStyle = styleList.find((style) => style.innerHTML.includes('.ant-bubble'))!;
    expect(bubbleStyle.innerHTML).toContain('ant-bubble');

    expect(container.querySelector('.ant-bubble')?.className).toContain('ant-bubble');
  });
});
