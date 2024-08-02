import React from 'react';
import Conversations from '..';
import { render } from '../../../tests/utils';

import type { ConversationProps } from '..';
import mountTest from '../../../tests/shared/mountTest';


const data: ConversationProps[] = [
  {
    key: 'demo1',
    label: 'What is Ant Design X ?',
    timestamp: 794620800,
    icon: <div id="conversation-test-id">icon</div>,
  },
  {
    key: 'demo2',
    label: <div>Getting Started: <a target="_blank" href='https://ant-design.antgroup.com/index-cn' rel="noreferrer">Ant Design !</a></div>,
    timestamp: 794620900,
  },
  {
    key: 'demo4',
    label: 'In Docker, use 🐑 Ollama and initialize',
    timestamp: 794621100,
  },
  {
    key: 'demo5',
    label: 'Expired, please go to the recycle bin to check',
    timestamp: 794621200,
    disabled: true,
  },
];

describe('Conversations Component', () => {
  mountTest(() => <Conversations />);

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('Conversations component work', () => {
    const { container } = render(<Conversations data={data} />);
    const element = container.querySelector<HTMLUListElement>('.ant-conversations');
    expect(element).toBeTruthy();
    expect(element).toMatchSnapshot();
  });
});
