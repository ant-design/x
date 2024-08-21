import React from 'react';
import ThoughtChain from '../index';
import { render } from '../../../tests/utils';

import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import { CheckCircleOutlined } from '@ant-design/icons';

import type { ThoughtChainItem } from '../index';

const customizationProps: ThoughtChainItem = {
  title: 'Thought Chain Item Title',
  description: 'description',
  icon: <CheckCircleOutlined />,
  extra: 'Extra',
  footer: 'Thought Chain Item Footer',
  content: 'content',
};

const items: ThoughtChainItem[] = [
  {
    ...customizationProps,
    status: 'success',
  },
  {
    ...customizationProps,
    status: 'error',
  },
  {
    ...customizationProps,
    status: 'pending',
  },
];

describe('ThoughtChain Component', () => {
  mountTest(() => <ThoughtChain />);

  rtlTest(() => <ThoughtChain items={items} collapsible />);

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('ThoughtChain component work', () => {
    const { container } = render(<ThoughtChain items={items} />);
    const element = container.querySelector<HTMLUListElement>('.ant-thought-chain');
    expect(element).toBeTruthy();
    expect(element).toMatchSnapshot();
  });
});
