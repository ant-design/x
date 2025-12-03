import type { ConversationItemType } from '@ant-design/x';
import { Conversations } from '@ant-design/x';
import { useXConversations } from '@ant-design/x-sdk';
import { Flex, theme } from 'antd';
import React from 'react';

const useLocale = () => {
  const isCN = typeof location !== 'undefined' ? location.pathname.endsWith('-cn') : false;
  return {
    conversationItem1: isCN ? '会话项目 1' : 'Conversation Item 1',
    conversationItem2: isCN ? '会话项目 2' : 'Conversation Item 2',
    conversationItem3: isCN
      ? '会话项目 3，这是一个超长示例，你可以点击我！'
      : "This's Conversation Item 3, you can click me!",
    conversationItem4: isCN ? '会话项目 4' : 'Conversation Item 4',
  };
};

const App = () => {
  const locale = useLocale();
  const { token } = theme.useToken();

  // 会话项目列表：定义基本的会话项目数据
  // Conversation items list: define basic conversation item data
  const items: ConversationItemType[] = [
    {
      key: 'item1',
      label: locale.conversationItem1,
    },
    {
      key: 'item2',
      label: locale.conversationItem2,
    },
    {
      key: 'item3',
      label: locale.conversationItem3,
    },
    {
      key: 'item4',
      label: locale.conversationItem4,
      disabled: true, // 禁用此项目，用户无法点击
    },
  ];

  // 使用会话钩子：管理会话列表状态
  // Use conversations hook: manage conversation list state
  const { conversations } = useXConversations({ defaultConversations: items });

  // 自定义容器样式：使用Ant Design主题token
  // Customize container style: use Ant Design theme tokens
  const style = {
    width: 256,
    background: token.colorBgContainer,
    borderRadius: token.borderRadius,
  };

  return (
    <Flex vertical gap="small" align="flex-start">
      {/* 会话组件：显示会话列表，支持点击和交互 */}
      {/* Conversations component: display conversation list, support click and interaction */}
      <Conversations
        items={conversations as ConversationItemType[]}
        defaultActiveKey="item1" // 默认激活第一个会话项目
        style={style}
      />
    </Flex>
  );
};

export default App;
