import { createCache, StyleProvider } from '@ant-design/cssinjs';
import React from 'react';
import { render } from '../../../tests/utils';
import Bubble from '../../bubble';

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
        <Bubble content="test" />
      </StyleProvider>,
    );
    expect(document.head.innerHTML).toContain('@layer antd,antdx;');
    expect(document.head.innerHTML).toContain('<style ');
    expect(document.head.innerHTML).toContain('@layer antdx{');
  });
});
