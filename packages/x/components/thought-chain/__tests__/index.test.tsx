import React from 'react';
import { fireEvent, render } from '../../../tests/utils';
import ThoughtChain from '../index';

import { CheckCircleOutlined } from '@ant-design/icons';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import themeTest from '../../../tests/shared/themeTest';

import type { ThoughtChainItem } from '../index';

const customizationProps = (key: string): ThoughtChainItem => ({
  title: 'Thought Chain Item Title',
  description: 'description',
  icon: <CheckCircleOutlined />,
  extra: 'Extra',
  footer: 'Thought Chain Item Footer',
  content: `content ${key}`,
});

const items: ThoughtChainItem[] = [
  {
    ...customizationProps('test1'),
    status: 'success',
    key: 'test1',
  },
  {
    ...customizationProps('test2'),
    status: 'error',
    key: 'test2',
  },
  {
    ...customizationProps('test3'),
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
    const { container, getByText } = render(<ThoughtChain items={items} collapsible />);
    const element = container.querySelector<HTMLUListElement>('.ant-thought-chain');
    const elementHeader = container.querySelectorAll<HTMLDivElement>(
      '.ant-thought-chain-item-header-box',
    )[0];
    fireEvent.click(elementHeader as Element);

    expect(getByText('content test1')).toBeInTheDocument();
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
  it('ThoughtChain component work with controlled mode', async () => {
    const onExpand = jest.fn();
    const App = () => {
      const [expandedKeys] = React.useState<string[]>(['test1']);
      return (
        <ThoughtChain
          items={items}
          collapsible={{
            expandedKeys,
            onExpand: (keys) => {
              onExpand(keys);
            },
          }}
        />
      );
    };
    const { container } = render(<App />);

    const expandBodyBeforeElements = container.querySelectorAll<HTMLDivElement>(
      '.ant-thought-chain-item-content-box',
    );
    expect(expandBodyBeforeElements).toHaveLength(1);

    const itemHeaderElement = container.querySelectorAll<HTMLDivElement>(
      '.ant-thought-chain-item-header-box',
    )[0];
    fireEvent.click(itemHeaderElement as Element);
    expect(onExpand).toHaveBeenCalledWith([]);

    // click again
    fireEvent.click(itemHeaderElement as Element);
    expect(onExpand).toHaveBeenCalledWith([]);

    const expandBodyAfterElements = container.querySelectorAll<HTMLDivElement>(
      '.ant-thought-chain-item-content-box',
    );
    expect(expandBodyAfterElements).toHaveLength(1);
  });
  it('ThoughtChain component work collapsible without expandedKeys', async () => {
    const onExpand = jest.fn();
    const App = () => {
      return (
        <ThoughtChain
          items={items}
          collapsible={{
            onExpand: (keys) => {
              onExpand(keys);
            },
          }}
        />
      );
    };
    const { container } = render(<App />);

    const expandBodyElementBefore = container.querySelectorAll<HTMLDivElement>(
      '.ant-thought-chain-item-content-box',
    );
    expect(expandBodyElementBefore).toHaveLength(0);

    const element = container.querySelectorAll<HTMLDivElement>(
      '.ant-thought-chain-item-header-box',
    )[0];
    fireEvent.click(element as Element);
    expect(onExpand).toHaveBeenCalledWith(['test1']);

    const expandBodyElementsAfter = container.querySelectorAll<HTMLDivElement>(
      '.ant-thought-chain-item-content-box',
    );
    expect(expandBodyElementsAfter).toHaveLength(1);
  });
});
