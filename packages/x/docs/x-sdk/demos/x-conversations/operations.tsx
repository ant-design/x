import { DeleteOutlined } from '@ant-design/icons';
import type { ConversationItemType, ConversationsProps } from '@ant-design/x';
import { Conversations } from '@ant-design/x';
import { useXConversations } from '@ant-design/x-sdk';
import { Button, Flex, Typography, theme } from 'antd';
import React from 'react';

const { Paragraph } = Typography;

const createItems: () => ConversationItemType[] = () =>
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

  const {
    conversations,
    addConversation,
    activeConversationKey,
    setActiveConversationKey,
    setConversation,
    removeConversation,
    getConversation,
    setConversations,
  } = useXConversations({
    defaultConversations: createItems(),
    defaultActiveConversationKey: 'item1',
  });

  // Customize the style of the container
  const style = {
    width: 256,
    background: token.colorBgContainer,
    borderRadius: token.borderRadius,
  };

  const onAdd = () => {
    addConversation({ key: `item${idx}`, label: `Conversation Item ${idx}` });
    idx = idx + 1;
  };

  const onUpdate = () => {
    setConversation(activeConversationKey, {
      key: activeConversationKey,
      label: 'Updated Conversation Item',
    });
  };

  const onReset = () => {
    setConversations(createItems());
    setActiveConversationKey('item1');
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
        creation={{
          onClick: onAdd,
        }}
        items={conversations as ConversationItemType[]}
        activeKey={activeConversationKey}
        style={style}
        onActiveChange={setActiveConversationKey}
        menu={menuConfig}
      />
      <Flex gap="small">
        <Button onClick={onAdd}>Add</Button>
        <Button onClick={onUpdate}>Update</Button>
        <Button onClick={onReset}>Reset</Button>
      </Flex>
      <Paragraph>
        Current Conversation Data:
        <pre>{JSON.stringify(getConversation(activeConversationKey), null, 2)}</pre>
      </Paragraph>
    </Flex>
  );
};
