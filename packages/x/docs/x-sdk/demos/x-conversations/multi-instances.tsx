import { DeleteOutlined } from '@ant-design/icons';
import type { ConversationItemType, ConversationsProps } from '@ant-design/x';
import { Conversations } from '@ant-design/x';
import { useXConversations } from '@ant-design/x-sdk';
import { Button, Col, Flex, Row, theme } from 'antd';
import React from 'react';

const useLocale = () => {
  const isCN = typeof location !== 'undefined' ? location.pathname.endsWith('-cn') : false;
  return {
    list1: isCN ? '列表 1' : 'List 1',
    list2: isCN ? '列表 2' : 'List 2',
    add: isCN ? '添加' : 'Add',
    update: isCN ? '更新' : 'Update',
    delete: isCN ? '删除' : 'Delete',
    conversationItem1: isCN ? '会话项目 1' : 'Conversation Item 1',
    conversationItem2: isCN ? '会话项目 2' : 'Conversation Item 2',
    conversationItem3: isCN
      ? '会话项目 3，你可以点击我！'
      : "This's Conversation Item 3, you can click me!",
    conversationItem4: isCN ? '会话项目 4' : 'Conversation Item 4',
    updatedConversationItem: isCN ? '已更新的会话项目' : 'Updated Conversation Item',
  };
};

const App = () => {
  const locale = useLocale();
  const { token } = theme.useToken();

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
      disabled: true,
    },
  ];

  const others: ConversationItemType[] = [
    {
      key: 'other1',
      label: locale.conversationItem1,
    },
    {
      key: 'other2',
      label: locale.conversationItem2,
    },
  ];

  let idx = 5;
  let otherIdx = 3;

  const handler = useXConversations({
    defaultConversations: items as any,
    defaultActiveConversationKey: items[0].key,
  });
  const otherHandler = useXConversations({
    defaultConversations: others as any,
    defaultActiveConversationKey: others[0].key,
  });

  // 自定义容器样式：使用Ant Design主题token
  // Customize container style: use Ant Design theme tokens
  const style = {
    width: 256,
    background: token.colorBgContainer,
    borderRadius: token.borderRadius,
  };

  // 添加会话：向指定列表添加新的会话项目
  // Add conversation: add new conversation item to specified list
  const onAdd = (type?: string) => {
    const instance = type === 'other' ? otherHandler : handler;
    const itemIndex = type === 'other' ? otherIdx : idx;
    instance.addConversation({
      key: `other${itemIndex}`,
      label: `${locale.conversationItem1.replace('1', String(itemIndex))}`,
    });
    if (type === 'other') {
      otherIdx = otherIdx + 1;
    } else {
      idx = idx + 1;
    }
  };

  // 更新会话：更新当前激活的会话项目
  // Update conversation: update currently active conversation item
  const onUpdate = (type?: string) => {
    const instance = type === 'other' ? otherHandler : handler;
    const realActive =
      type === 'other' ? otherHandler.activeConversationKey : handler.activeConversationKey;
    instance.setConversation(realActive, {
      key: realActive,
      label: locale.updatedConversationItem,
    });
  };

  // 菜单配置：为列表1的会话项目定义右键菜单
  // Menu configuration: define right-click menu for conversation items in list 1
  const menuConfig: ConversationsProps['menu'] = (conversation) => ({
    items: [
      {
        label: locale.delete,
        key: 'delete',
        icon: <DeleteOutlined />,
        danger: true, // 危险操作样式
      },
    ],
    onClick: () => {
      handler.removeConversation(conversation.key);
    },
  });

  // 菜单配置：为列表2的会话项目定义右键菜单
  // Menu configuration: define right-click menu for conversation items in list 2
  const otherMenuConfig: ConversationsProps['menu'] = (conversation) => ({
    items: [
      {
        label: locale.delete,
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
      {/* 多实例展示：使用Row和Col布局展示两个独立的会话列表 */}
      {/* Multi-instance display: use Row and Col layout to display two independent conversation lists */}
      <Row gutter={36}>
        {/* 列表1：第一个会话实例 */}
        {/* List 1: first conversation instance */}
        <Col>
          <h3>{locale.list1}</h3>
          <Conversations
            items={handler.conversations as ConversationItemType[]}
            activeKey={handler.activeConversationKey}
            style={style}
            onActiveChange={handler.setActiveConversationKey}
            menu={menuConfig}
          />
          {/* 操作按钮：添加和更新会话项目 */}
          {/* Action buttons: add and update conversation items */}
          <Flex gap="small">
            <Button onClick={() => onAdd()}>{locale.add}</Button>
            <Button onClick={() => onUpdate()}>{locale.update}</Button>
          </Flex>
        </Col>
        {/* 列表2：第二个会话实例 */}
        {/* List 2: second conversation instance */}
        <Col>
          <h3>{locale.list2}</h3>
          <Conversations
            items={otherHandler.conversations as ConversationItemType[]}
            activeKey={otherHandler.activeConversationKey}
            style={style}
            onActiveChange={otherHandler.setActiveConversationKey}
            menu={otherMenuConfig}
          />
          {/* 操作按钮：添加和更新会话项目 */}
          {/* Action buttons: add and update conversation items */}
          <Flex gap="small">
            <Button onClick={() => onAdd('other')}>{locale.add}</Button>
            <Button onClick={() => onUpdate('other')}>{locale.update}</Button>
          </Flex>
        </Col>
      </Row>
    </Flex>
  );
};

export default App;
