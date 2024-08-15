import React from 'react';
import Conversations from '../index';
import { render, fireEvent } from '../../../tests/utils';

import type { Conversation } from '../index';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';

const items: Conversation[] = [
  {
    key: 'demo1',
    label: 'What is Ant Design X ?',
    icon: <div id="conversation-test-id">icon</div>,
    group: 'pinned',
  },
  {
    key: 'demo2',
    label: (
      <div>
        Getting Started:{' '}
        <a target="_blank" href="https://ant-design.antgroup.com/index-cn" rel="noreferrer">
          Ant Design !
        </a>
      </div>
    ),
  },
  {
    key: 'demo4',
    label: 'In Docker, use 🐑 Ollama and initialize',
  },
  {
    key: 'demo5',
    label: 'Expired, please go to the recycle bin to check',
    disabled: true,
  },
  // Used to test the case where there is no key
  {
    label: 'No key',
    disabled: true,
  } as any,
];

const menu = jest.fn().mockReturnValue({
  items: [
    {
      label: '重命名',
      key: 'mod',
    },
    {
      label: '删除',
      key: 'delete',
      danger: true,
    },
  ],
});

describe('Conversations Component', () => {
  mountTest(() => <Conversations />);

  rtlTest(() => <Conversations items={items} groupable menu={menu} />);

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('Conversations component work', () => {
    const { container } = render(<Conversations items={items} />);
    const element = container.querySelector<HTMLUListElement>('.ant-conversations');
    expect(element).toBeTruthy();
    expect(element).toMatchSnapshot();
  });

  it('should handle defaultActiveKey', () => {
    const { getByText } = render(<Conversations items={items} defaultActiveKey="demo1" />);
    const activeItem = getByText('What is Ant Design X ?');
    expect(activeItem.parentNode).toHaveClass('ant-conversations-item-active');
  });

  it('should handle activeKey', () => {
    const { getByText } = render(<Conversations items={items} activeKey="demo1" />);
    const activeItem = getByText('What is Ant Design X ?');
    expect(activeItem.parentNode).toHaveClass('ant-conversations-item-active');
  });

  it('should trigger onActiveChange', () => {
    const onActiveChange = jest.fn();
    const { getByText } = render(<Conversations items={items} onActiveChange={onActiveChange} />);
    fireEvent.click(getByText('What is Ant Design X ?'));
    expect(onActiveChange).toHaveBeenCalledWith('demo1');
    fireEvent.click(getByText('In Docker, use 🐑 Ollama and initialize'));
    expect(onActiveChange).toHaveBeenCalledWith('demo4');
    fireEvent.click(getByText('Expired, please go to the recycle bin to check'));
    expect(onActiveChange).toHaveBeenCalledWith('demo4');
  });

  it('should handle menu function', () => {
    const { getByText, container } = render(
      <Conversations items={items} menu={menu} defaultActiveKey="demo1" />,
    );
    expect(menu).toHaveBeenCalled();
    const menuElement = container.querySelector('.ant-conversations-menu-icon');
    expect(menuElement).toBeInTheDocument();
    fireEvent.click(menuElement as HTMLElement);
    expect(getByText('重命名')).toBeInTheDocument();
    expect(getByText('删除')).toBeInTheDocument();
    fireEvent.click(menuElement as HTMLElement);
    const element = container.querySelector('.ant-dropdown-open');
    expect(element).not.toBeInTheDocument();
  });

  it('should group items when groupable is true', () => {
    const { getByText } = render(<Conversations items={items} groupable />);
    expect(getByText('pinned')).toBeInTheDocument();
  });

  it('should use custom group title component', () => {
    const { getByText } = render(
      <Conversations items={items} groupable={{ title: (group) => <div>{group}</div> }} />,
    );
    expect(getByText('pinned')).toBeInTheDocument();
  });

  it('should sort groups when groupable.sort is provided', () => {
    const sort = jest.fn().mockReturnValue(0);
    render(<Conversations items={items} groupable={{ sort }} />);
    expect(sort).toHaveBeenCalled();
  });

  it('should not group items when groupable is false', () => {
    const { queryByText } = render(<Conversations items={items} groupable={false} />);
    expect(queryByText('pinned')).not.toBeInTheDocument();
  });
});
