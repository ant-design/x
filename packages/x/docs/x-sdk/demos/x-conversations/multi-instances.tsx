import { DeleteOutlined } from '@ant-design/icons';
import type { ConversationItemType, ConversationsProps } from '@ant-design/x';
import { Conversations } from '@ant-design/x';
import { useXConversations } from '@ant-design/x-sdk';
import { Button, Col, Flex, Row, theme } from 'antd';
import React from 'react';

const items: ConversationItemType[] = Array.from({ length: 4 }).map((_, index) => ({
  key: `item${index + 1}`,
  label:
    index + 1 === 3
      ? "This's Conversation Item 3, you can click me!"
      : `Conversation Item ${index + 1}`,
  disabled: index === 3,
}));
const others: ConversationItemType[] = Array.from({ length: 2 }).map((_, index) => ({
  key: `other${index + 1}`,
  label:
    index + 1 === 3
      ? "This's Conversation Item 3, you can click me!"
      : `Conversation Item ${index + 1}`,
  disabled: index === 3,
}));

let idx = 5;
let otherIdx = 3;

export default () => {
  const { token } = theme.useToken();
  const handler = useXConversations({
    defaultConversations: items as any,
    defaultActiveConversationKey: items[0].key,
  });
  const otherHandler = useXConversations({
    defaultConversations: others as any,
    defaultActiveConversationKey: others[0].key,
  });

  // Customize the style of the container
  const style = {
    width: 256,
    background: token.colorBgContainer,
    borderRadius: token.borderRadius,
  };

  const onAdd = (type?: string) => {
    const instance = type === 'other' ? otherHandler : handler;
    instance.addConversation({
      key: `other${type === 'other' ? otherIdx : idx}`,
      label: `Conversation Item ${type === 'other' ? otherIdx : idx}`,
    });
    if (type === 'other') {
      otherIdx = otherIdx + 1;
    } else {
      idx = idx + 1;
    }
  };

  const onUpdate = (type?: string) => {
    const instance = type === 'other' ? otherHandler : handler;
    const realActive =
      type === 'other' ? otherHandler.activeConversationKey : handler.activeConversationKey;
    instance.setConversation(realActive, { key: realActive, label: 'Updated Conversation Item' });
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
      handler.removeConversation(conversation.key);
    },
  });

  const otherMenuConfig: ConversationsProps['menu'] = (conversation) => ({
    items: [
      {
        label: 'Delete',
        key: 'delete',
        icon: <DeleteOutlined />,
        danger: true,
      },
    ],
    onClick: () => {
      otherHandler.removeConversation(conversation.key);
    },
  });

  return (
    <Flex vertical gap="small" align="flex-start">
      <Row gutter={36}>
        <Col>
          <h3>List 1</h3>
          <Conversations
            items={handler.conversations as ConversationItemType[]}
            activeKey={handler.activeConversationKey}
            style={style}
            onActiveChange={handler.setActiveConversationKey}
            menu={menuConfig}
          />
          <Flex gap="small">
            <Button onClick={() => onAdd()}>Add</Button>
            <Button onClick={() => onUpdate()}>Update</Button>
          </Flex>
        </Col>
        <Col>
          <h3>List 2</h3>
          <Conversations
            items={otherHandler.conversations as ConversationItemType[]}
            activeKey={otherHandler.activeConversationKey}
            style={style}
            onActiveChange={otherHandler.setActiveConversationKey}
            menu={otherMenuConfig}
          />
          <Flex gap="small">
            <Button onClick={() => onAdd('other')}>Add</Button>
            <Button onClick={() => onUpdate('other')}>Update</Button>
          </Flex>
        </Col>
      </Row>
    </Flex>
  );
};
