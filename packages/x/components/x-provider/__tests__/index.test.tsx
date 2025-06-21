import React from 'react';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import themeTest from '../../../tests/shared/themeTest';
import { fireEvent, render } from '../../../tests/utils';
import { Bubble, Conversations } from '../../index';
import zhCN_X from '../../locale/zh_CN';
import XProvider from '../index';
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

  it('conversations.locale', () => {
    const onClick = jest.fn();
    const { getByText } = render(
      <XProvider locale={zhCN_X}>
        <Conversations
          creation={{
            onClick,
          }}
        />
      </XProvider>,
    );
    const creationDom = getByText(zhCN_X.Conversations.create);
    fireEvent.click(creationDom);
    expect(creationDom).toBeTruthy();
    expect(onClick).toHaveBeenCalled();
  });
});
