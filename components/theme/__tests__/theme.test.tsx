import React from 'react';

import Bubble from '../../bubble';
import { render, waitFakeTimer } from '../../../tests/utils';
import { createCache, StyleProvider } from '@ant-design/cssinjs';

describe('bubble', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    document.head.innerHTML = '';
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('Bubble component work', () => {
    render(
      <StyleProvider cache={createCache()} layer>
        <Bubble avatar={{}} content="test" />
      </StyleProvider>,
    );
    expect(document.head.innerHTML).toContain('@layer antd,antdx;');
    expect(document.head.innerHTML).toContain('@layer antd{');
    expect(document.head.innerHTML).toContain('@layer antdx{');
  });
});
