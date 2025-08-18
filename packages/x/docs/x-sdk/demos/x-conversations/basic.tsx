import type { ConversationItemType } from '@ant-design/x';
import { Conversations } from '@ant-design/x';
import { useXConversations } from '@ant-design/x-sdk';
import { Flex, theme } from 'antd';
import React from 'react';

const items: ConversationItemType[] = Array.from({ length: 4 }).map((_, index) => ({
  key: `item${index + 1}`,
  label:
    index + 1 === 3
      ? "This's Conversation Item 3, you can click me!"
      : `Conversation Item ${index + 1}`,
  disabled: index === 3,
}));

export default () => {
  const { token } = theme.useToken();
  const { conversations } = useXConversations({ defaultConversations: items });

  // Customize the style of the container
  const style = {
    width: 256,
    background: token.colorBgContainer,
    borderRadius: token.borderRadius,
  };

  return (
    <Flex vertical gap="small" align="flex-start">
      <Conversations
        items={conversations as ConversationItemType[]}
        defaultActiveKey="item1"
        style={style}
      />
    </Flex>
  );
};
