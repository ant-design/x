import React from 'react';
import { Bubble } from '../../index';
import XProvider from '../index';

import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import themeTest from '../../../tests/shared/themeTest';
import { render } from '../../../tests/utils';

import type { XProviderProps } from '../index';

const xProviderProps: XProviderProps = {
  bubble: {
    className: 'test-bubble',
  },
  conversations: {
    className: 'test-conversations',
  },
  prompts: {
    className: 'test-prompts',
  },
  sender: {
    className: 'test-sender',
  },
  suggestion: {
    className: 'test-suggestion',
  },
  thoughtChain: {
    className: 'test-thoughtChain',
  },
};

describe('XProvider Component', () => {
  mountTest(() => <XProvider {...xProviderProps} />);

  rtlTest(() => <XProvider {...xProviderProps} />);

  themeTest(() => <XProvider {...xProviderProps} />);

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('bubble.className', () => {
    const { container } = render(
      <XProvider {...xProviderProps}>
        <Bubble content="test" />
      </XProvider>,
    );
    const element = container.querySelector('.test-bubble');
    expect(element).toBeTruthy();
  });
});
