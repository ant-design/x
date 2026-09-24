import { createCache, StyleProvider } from '@ant-design/cssinjs';
import { Popover } from 'antd';
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
    expect(bubbleStyle.innerHTML).toContain('var(--ant-');

    expect(container.querySelector('.ant-bubble')?.className).toContain('css-var-');
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
    expect(bubbleStyle.innerHTML).toContain('var(--ant-');

    expect(container.querySelector('.ant-bubble')?.className).toContain('css-var-');
  });

  it('preserves the Popover drop shadow token', () => {
    render(
      <StyleProvider cache={createCache()}>
        <XProvider>
          <Bubble content="test" />
          <Popover content="popover" open>
            <button type="button">trigger</button>
          </Popover>
        </XProvider>
      </StyleProvider>,
    );

    const popover = document.querySelector('.ant-popover');
    const cssVarClass = Array.from(popover?.classList ?? []).find((className) =>
      className.startsWith('css-var-'),
    );
    const cssVarStyle = Array.from(document.head.querySelectorAll('style')).find(
      (style) =>
        cssVarClass &&
        style.innerHTML.includes(`.${cssVarClass}`) &&
        style.innerHTML.includes('--ant-drop-shadow-popover:'),
    );

    expect(cssVarClass).toBeTruthy();
    expect(cssVarStyle?.innerHTML).toMatch(/--ant-drop-shadow-popover:\s*drop-shadow\(/);
  });
});
