import { DeleteOutlined } from '@ant-design/icons';
import type { ConversationsProps } from '@ant-design/x';
import { Conversations } from '@ant-design/x';
import { useXConversations } from '@ant-design/x-sdk';
import { Button, Col, Flex, type GetProp, Row, theme } from 'antd';
import React, { useState } from 'react';

const items: GetProp<ConversationsProps, 'items'> = Array.from({ length: 4 }).map((_, index) => ({
  key: `item${index + 1}`,
  label:
    index + 1 === 3
      ? "This's Conversation Item 3, you can click me!"
      : `Conversation Item ${index + 1}`,
  disabled: index === 3,
}));
const others: GetProp<ConversationsProps, 'items'> = Array.from({ length: 2 }).map((_, index) => ({
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
  const [active, setActive] = useState('item1');
  const [otherActive, setOtherActive] = useState('other2');
  const handler = useXConversations({ defaultConversations: items as any });
  const otherHandler = useXConversations({ defaultConversations: others as any });

  // Customize the style of the container
  const style = {
    width: 256,
    background: token.colorBgContainer,
    borderRadius: token.borderRadius,
  };

  const onActiveChange = (value: string, type?: string) => {
    if (type === 'other') {
      setOtherActive(value);
    } else {
      setActive(value);
    }
  };

  const onAdd = (type?: string) => {
    const instance = type === 'other' ? otherHandler : handler;
    instance.addConversation({
      key: `other${type === 'other' ? otherIdx : idx}`,
      label: `Conversation Item ${(type === 'other' ? otherIdx : idx)}`,
    });
    if (type === 'other') {
      otherIdx = otherIdx + 1;
    } else {
      idx = idx + 1;
    }
  };

  const onUpdate = (type?: string) => {
    const instance = type === 'other' ? otherHandler : handler;
    const realActive = type === 'other' ? otherActive : active;
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
          <h3>会话列表1</h3>
          <Conversations
            items={handler.conversations}
            activeKey={active}
            style={style}
            onActiveChange={(active) => onActiveChange(active)}
            menu={menuConfig}
          />
          <Flex gap="small">
            <Button onClick={() => onAdd()}>添加会话</Button>
            <Button onClick={() => onUpdate()}>更新会话</Button>
          </Flex>
        </Col>
        <Col>
          <h3>会话列表2</h3>
          <Conversations
            items={otherHandler.conversations}
            activeKey={otherActive}
            style={style}
            onActiveChange={(active) => onActiveChange(active, 'other')}
            menu={otherMenuConfig}
          />
          <Flex gap="small">
            <Button onClick={() => onAdd('other')}>添加会话</Button>
            <Button onClick={() => onUpdate('other')}>更新会话</Button>
          </Flex>
        </Col>
      </Row>
    </Flex>
  );
};
