import { createCache, StyleProvider } from '@ant-design/cssinjs';
import React from 'react';
import { render } from '../../../tests/utils';
import { Bubble, Sender } from '../../index';
import XProvider from '../index';

/**
 * Helper to find style tags that contain actual component styles (layout, visual)
 * as opposed to CSS variable declarations only.
 *
 * CSS variable styles only contain `--ant-*` custom property declarations.
 * Component styles contain actual CSS properties like `display`, `position`, `padding`, etc.
 */
function findComponentStyles(selector: string): HTMLStyleElement | undefined {
  const styleList = Array.from(document.head.querySelectorAll('style'));
  return styleList.find((style) => {
    const html = style.innerHTML;
    if (!html.includes(selector)) return false;
    // Strip all CSS variable declarations to check if real properties remain
    const withoutVars = html.replace(/--[\w-]+:[^;]+;/g, '');
    // If only variable declarations existed, stripping them leaves no property declarations
    return /[\w-]+:/.test(withoutVars);
  });
}

describe('XProvider.zeroRuntime', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
  });

  it('should inject component styles at runtime by default', () => {
    render(
      <StyleProvider cache={createCache()}>
        <XProvider>
          <Bubble content="test" />
        </XProvider>
      </StyleProvider>,
    );

    expect(findComponentStyles('.ant-bubble')).toBeTruthy();
  });

  it('should skip component style injection when zeroRuntime is true', () => {
    render(
      <StyleProvider cache={createCache()}>
        <XProvider theme={{ zeroRuntime: true }}>
          <Bubble content="test" />
        </XProvider>
      </StyleProvider>,
    );

    expect(findComponentStyles('.ant-bubble')).toBeFalsy();
  });

  it('should skip component style injection for multiple components', () => {
    render(
      <StyleProvider cache={createCache()}>
        <XProvider theme={{ zeroRuntime: true }}>
          <Bubble content="test" />
          <Sender />
        </XProvider>
      </StyleProvider>,
    );

    expect(findComponentStyles('.ant-bubble')).toBeFalsy();
    expect(findComponentStyles('.ant-sender')).toBeFalsy();
  });

  it('should still render component DOM when zeroRuntime is true', () => {
    const { container } = render(
      <StyleProvider cache={createCache()}>
        <XProvider theme={{ zeroRuntime: true }}>
          <Bubble content="test" />
        </XProvider>
      </StyleProvider>,
    );

    expect(container.querySelector('.ant-bubble')).toBeTruthy();
  });
});
