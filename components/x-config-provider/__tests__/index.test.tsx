import React from 'react';
import { Bubble } from '../../index';
import XConfigProvider from '../index';

import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import themeTest from '../../../tests/shared/themeTest';
import { render } from '../../../tests/utils';

import type { XConfigProviderProps } from '../index';

const xConfigProviderProps: XConfigProviderProps = {
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

describe('ThoughtChain Component', () => {
  mountTest(() => <XConfigProvider {...xConfigProviderProps} />);

  rtlTest(() => <XConfigProvider {...xConfigProviderProps} />);

  themeTest(() => <XConfigProvider {...xConfigProviderProps} />);

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('bubble.className', () => {
    const { container } = render(
      <XConfigProvider {...xConfigProviderProps}>
        <Bubble content="test" />
      </XConfigProvider>,
    );
    const element = container.querySelector('.test-bubble');
    expect(element).toBeTruthy();
  });
});
