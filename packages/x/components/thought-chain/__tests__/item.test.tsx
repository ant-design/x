import React from 'react';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import themeTest from '../../../tests/shared/themeTest';
import { render } from '../../../tests/utils';
import ThoughtChain from '..';

describe('ThoughtChain.Item Component', () => {
  mountTest(() => <ThoughtChain.Item />);

  rtlTest(() => <ThoughtChain.Item title="ThoughtChainItem.1" />);

  themeTest(() => <ThoughtChain.Item title="ThoughtChainItem.1" />);

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('ThoughtChain component work', () => {
    const { container, getByText } = render(<ThoughtChain.Item title="ThoughtChain.Item.title" />);
    const element = container.querySelector<HTMLUListElement>('.ant-thought-chain');
    expect(getByText('ThoughtChain.Item.title')).toBeInTheDocument();
    expect(element).toBeTruthy();
    expect(element).toMatchSnapshot();
  });
});
