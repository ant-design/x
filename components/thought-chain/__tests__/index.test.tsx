import React from 'react';
import { fireEvent, render } from '../../../tests/utils';
import ThoughtChain from '../index';

import { CheckCircleOutlined } from '@ant-design/icons';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import themeTest from '../../../tests/shared/themeTest';

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
    key: 'test1',
  },
  {
    ...customizationProps,
    status: 'error',
    key: 'test2',
  },
  {
    ...customizationProps,
    status: 'pending',
    key: 'test3',
  },
];

describe('ThoughtChain Component', () => {
  mountTest(() => <ThoughtChain />);

  rtlTest(() => <ThoughtChain items={items} collapsible />);

  themeTest(() => <ThoughtChain items={items} collapsible />);

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('ThoughtChain component work', () => {
    const { container } = render(<ThoughtChain items={items} collapsible />);
    const element = container.querySelector<HTMLUListElement>('.ant-thought-chain');
    expect(element).toBeTruthy();
    expect(element).toMatchSnapshot();
  });

  it('ThoughtChain component work with collapsible', () => {
    const onExpand = jest.fn();
    const App = () => {
      const [expandedKeys, setExpandedKeys] = React.useState<string[]>([]);
      return (
        <ThoughtChain
          items={items}
          collapsible={{
            expandedKeys,
            onExpand: (keys) => {
              onExpand(keys);
              setExpandedKeys(keys);
            },
          }}
        />
      );
    };
    const { container } = render(<App />);
    const element = container.querySelectorAll<HTMLDivElement>(
      '.ant-thought-chain-item-header-box',
    )[0];
    fireEvent.click(element as Element);
    expect(onExpand).toHaveBeenCalledWith(['test1']);
    fireEvent.click(element as Element);
    expect(onExpand).toHaveBeenCalledWith([]);
  });

  it('ThoughtChain component work with controlled mode', () => {
    const App = () => {
      const [expandedKeys] = React.useState<string[]>(['test3']);

      return (
        <ThoughtChain
          items={items}
          collapsible={{
            expandedKeys,
          }}
        />
      );
    };
    const { container } = render(<App />);
    const element = container.querySelectorAll<HTMLDivElement>(
      '.ant-thought-chain-item-header-box',
    )[0];

    fireEvent.click(element as Element);

    const expandBodyElements = container.querySelectorAll<HTMLDivElement>(
      '.ant-thought-chain-item .ant-thought-chain-item-content',
    );

    expect(expandBodyElements).toHaveLength(2);
  });

  it('ThoughtChain component work with uncontrolled mode', () => {
    const App = () => {
      return <ThoughtChain items={items} collapsible />;
    };

    const { container } = render(<App />);
    const element = container.querySelectorAll<HTMLDivElement>(
      '.ant-thought-chain-item-header-box',
    )[0];

    fireEvent.click(element as Element);

    const expandBodyElements = container.querySelectorAll<HTMLDivElement>(
      '.ant-thought-chain-item .ant-thought-chain-item-content',
    );

    expect(expandBodyElements).toHaveLength(1);
  });
});
