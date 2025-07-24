import { DeleteOutlined } from '@ant-design/icons';
import type { ConversationsProps } from '@ant-design/x';
import { Conversations } from '@ant-design/x';
import { ConversationData, useXConversations } from '@ant-design/x-sdk';
import { Button, Flex, Typography, theme } from 'antd';
import React, { useState } from 'react';

const { Paragraph } = Typography;

const createItems: () => ConversationData[] = () =>
  Array.from({ length: 4 }).map((_, index) => ({
    key: `item${index + 1}`,
    label:
      index + 1 === 3
        ? "This's Conversation Item 3, you can click me!"
        : `Conversation Item ${index + 1}`,
    disabled: index === 3,
  }));

let idx = 5;

export default () => {
  const { token } = theme.useToken();
  const [active, setActive] = useState('item1');
  const {
    conversations,
    addConversation,
    setConversation,
    removeConversation,
    getConversation,
    setConversations,
  } = useXConversations({ defaultConversations: createItems() });

  // Customize the style of the container
  const style = {
    width: 256,
    background: token.colorBgContainer,
    borderRadius: token.borderRadius,
  };

  const onActiveChange = (value: string) => {
    setActive(value);
  };

  const onAdd = () => {
    addConversation({ key: 'item' + idx, label: 'Conversation Item ' + idx });
    idx = idx + 1;
  };

  const onUpdate = () => {
    setConversation(active, { label: 'Updated Conversation Item' });
  };

  const onReset = () => {
    setConversations(createItems());
    setActive('item1');
  };

  const menuConfig: ConversationsProps['menu'] = (conversation) => ({
    items: [
      {
        label: 'Delete',
        key: 'delete',
        icon: <DeleteOutlined />,
        danger: true,
      },
    ],
    onClick: () => {
      removeConversation(conversation.key);
    },
  });

  return (
    <Flex vertical gap="small" align="flex-start">
      <Conversations
        items={conversations}
        activeKey={active}
        style={style}
        onActiveChange={onActiveChange}
        menu={menuConfig}
      />
      <Flex gap="small">
        <Button onClick={onAdd}>添加会话</Button>
        <Button onClick={onUpdate}>更新会话</Button>
        <Button onClick={onReset}>重设会话</Button>
      </Flex>
      <Paragraph>
        当前会话数据：
        <pre>{JSON.stringify(getConversation(active), null, 2)}</pre>
      </Paragraph>
    </Flex>
  );
};
