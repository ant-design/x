import { DeleteOutlined } from '@ant-design/icons';
import type { ConversationItemType, ConversationsProps } from '@ant-design/x';
import { Conversations } from '@ant-design/x';
import { useXConversations } from '@ant-design/x-sdk';
import { Button, Flex, Typography, theme } from 'antd';
import React from 'react';

const { Paragraph } = Typography;

const useLocale = () => {
  const isCN = typeof location !== 'undefined' ? location.pathname.endsWith('-cn') : false;
  return {
    add: isCN ? '添加' : 'Add',
    update: isCN ? '更新' : 'Update',
    reset: isCN ? '重置' : 'Reset',
    delete: isCN ? '删除' : 'Delete',
    conversationItem1: isCN ? '会话项目 1' : 'Conversation Item 1',
    conversationItem2: isCN ? '会话项目 2' : 'Conversation Item 2',
    conversationItem3: isCN
      ? '会话项目 3，这是一个超长示例，你可以点击我！'
      : "This's Conversation Item 3, you can click me!",
    conversationItem4: isCN ? '会话项目 4' : 'Conversation Item 4',
    updatedConversationItem: isCN ? '已更新的会话项目' : 'Updated Conversation Item',
    currentConversationData: isCN ? '当前会话数据：' : 'Current Conversation Data:',
    addConversation: isCN ? '添加会话' : 'Add Conversation',
  };
};

const App = () => {
  const locale = useLocale();
  const { token } = theme.useToken();

  const createItems: () => ConversationItemType[] = () => [
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
      disabled: true,
    },
  ];

  let idx = 5;

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
    addConversation({
      key: `item${idx}`,
      label: `${locale.conversationItem1.replace('1', String(idx))}`,
    });
    idx = idx + 1;
  };

  const onUpdate = () => {
    setConversation(activeConversationKey, {
      key: activeConversationKey,
      label: locale.updatedConversationItem,
    });
  };

  const onReset = () => {
    setConversations(createItems());
    setActiveConversationKey('item1');
  };

  const menuConfig: ConversationsProps['menu'] = (conversation) => ({
    items: [
      {
        label: locale.delete,
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
        <Button onClick={onAdd}>{locale.add}</Button>
        <Button onClick={onUpdate}>{locale.update}</Button>
        <Button onClick={onReset}>{locale.reset}</Button>
      </Flex>
      <Paragraph>
        {locale.currentConversationData}
        <pre>{JSON.stringify(getConversation(activeConversationKey), null, 2)}</pre>
      </Paragraph>
    </Flex>
  );
};

export default App;
