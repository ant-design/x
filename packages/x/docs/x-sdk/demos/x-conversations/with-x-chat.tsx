import type { ConversationItemType } from '@ant-design/x';
import { Bubble, Conversations, Sender } from '@ant-design/x';
import {
  DeepSeekChatProvider,
  type SSEFields,
  useXChat,
  useXConversations,
  type XModelParams,
  type XModelResponse,
  XRequest,
} from '@ant-design/x-sdk';
import { Flex, GetRef, theme } from 'antd';

import React, { useEffect, useRef } from 'react';

const useLocale = () => {
  const isCN = location.pathname.endsWith('-cn');
  return {
    conversationItem1: isCN ? '会话项目 1' : 'Conversation Item 1',
    conversationItem2: isCN ? '会话项目 2' : 'Conversation Item 2',
    conversationItem3: isCN
      ? '会话项目 3，你可以点击我！'
      : "This's Conversation Item 3, you can click me!",
    conversationItem4: isCN ? '会话项目 4' : 'Conversation Item 4',
    helloConversation1: isCN ? '你好，这是会话 1！' : 'Hello, this is Conversation 1!',
    welcomeConversation1: isCN
      ? '你好！这是会话 1 的欢迎消息。我可以帮助你回答各种问题。'
      : 'Hello! This is the welcome message for Conversation 1. I can help you answer various questions.',
    conversation2Started: isCN ? '会话 2 已启动' : 'Conversation 2 has started',
    welcomeConversation2: isCN
      ? '欢迎来到会话 2！在这里我们可以讨论与技术相关的话题。'
      : 'Welcome to Conversation 2! Here we can discuss technology-related topics.',
    clickedConversation3: isCN ? '点击了会话 3' : 'Clicked on Conversation 3',
    specialConversation3: isCN
      ? '你选择了会话 3！这是一个特殊的会话。我该如何帮助你？'
      : 'You selected Conversation 3! This is a special conversation. How can I help you?',
    conversation4Initialized: isCN ? '会话 4 已初始化' : 'Conversation 4 initialized',
    conversation4Disabled: isCN
      ? '这是会话 4。虽然它被禁用了，但你仍然可以查看历史消息。'
      : 'This is Conversation 4. Although it is disabled, you can still view historical messages.',
    helloDefault: isCN ? '你好！' : 'hello!',
    howCanAssist: isCN ? '你好！我今天能为你做些什么？' : 'Hello! How can I assist you today?',
    thinking: isCN ? '思考中' : 'Thinking',
    requestAborted: isCN ? '请求已中止' : 'Request aborted',
    somethingWrong: isCN ? '出了点问题' : 'Something went wrong',
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

  // ==================== 聊天提供者配置 ====================
  // ==================== Chat Provider Configuration ====================
  // 提供者缓存：为每个会话缓存独立的聊天提供者实例
  // Provider cache: cache independent chat provider instances for each conversation
  const providerCaches = new Map<string, DeepSeekChatProvider>();

  // 提供者工厂：根据会话key创建或获取对应的聊天提供者
  // Provider factory: create or get corresponding chat provider based on conversation key
  const providerFactory = (conversationKey: string) => {
    if (!providerCaches.get(conversationKey)) {
      providerCaches.set(
        conversationKey,
        new DeepSeekChatProvider({
          request: XRequest<XModelParams, Partial<Record<SSEFields, XModelResponse>>>(
            'https://api.x.ant.design/api/big_model_glm-4.5-flash',
            {
              manual: true,
              params: {
                thinking: {
                  type: 'disabled',
                },
                stream: true,
                model: 'glm-4.5-flash',
              },
            },
          ),
        }),
      );
    }
    return providerCaches.get(conversationKey);
  };

  // 根据激活的会话key提供不同的默认消息
  // Provide different default messages based on active conversation key
  const getDefaultMessages = (conversationKey: string) => {
    // 会话消息映射：为每个会话定义独特的欢迎消息
    // Conversation message mapping: define unique welcome messages for each conversation
    const messagesMap: Record<string, any[]> = {
      item1: [
        {
          message: { role: 'user', content: locale.helloConversation1 },
          status: 'success',
        },
        {
          message: {
            role: 'assistant',
            content: locale.welcomeConversation1,
          },
          status: 'success',
        },
      ],
      item2: [
        {
          message: { role: 'user', content: locale.conversation2Started },
          status: 'success',
        },
        {
          message: {
            role: 'assistant',
            content: locale.welcomeConversation2,
          },
          status: 'success',
        },
      ],
      item3: [
        {
          message: { role: 'user', content: locale.clickedConversation3 },
          status: 'success',
        },
        {
          message: {
            role: 'assistant',
            content: locale.specialConversation3,
          },
          status: 'success',
        },
      ],
      item4: [
        {
          message: { role: 'user', content: locale.conversation4Initialized },
          status: 'success',
        },
        {
          message: {
            role: 'assistant',
            content: locale.conversation4Disabled,
          },
          status: 'success',
        },
      ],
    };

    // 返回对应会话的默认消息，如果没有则使用默认欢迎消息
    // Return default messages for corresponding conversation, or use default welcome messages if not found
    return (
      messagesMap[conversationKey] || [
        {
          message: { role: 'user', content: locale.helloDefault },
          status: 'success',
        },
        {
          message: {
            role: 'assistant',
            content: locale.howCanAssist,
          },
          status: 'success',
        },
      ]
    );
  };

  // 会话管理：使用会话钩子管理会话列表和激活状态
  // Conversation management: use conversation hook to manage conversation list and active state
  const { conversations, activeConversationKey, setActiveConversationKey } = useXConversations({
    defaultConversations: items,
    defaultActiveConversationKey: items[0].key,
  });

  // 发送器引用：用于控制发送器组件
  // Sender ref: used to control sender component
  const senderRef = useRef<GetRef<typeof Sender>>(null);

  // 会话组件样式：使用Ant Design主题token
  // Conversation component style: use Ant Design theme tokens
  const style = {
    width: 256,
    background: token.colorBgContainer,
    borderRadius: token.borderRadius,
  };

  // 聊天管理：使用聊天钩子管理消息和请求
  // Chat management: use chat hook to manage messages and requests
  const { onRequest, messages, isRequesting, abort } = useXChat({
    provider: providerFactory(activeConversationKey), // 每个会话都有独立的提供者
    conversationKey: activeConversationKey,
    defaultMessages: getDefaultMessages(activeConversationKey),
    requestPlaceholder: () => {
      return {
        content: locale.thinking,
        role: 'assistant',
      };
    },
    requestFallback: (_, { error, errorInfo, messageInfo }) => {
      // 请求失败处理：区分中止错误和其他错误
      // Request failure handling: distinguish between abort error and other errors
      if (error.name === 'AbortError') {
        return {
          content: messageInfo?.message?.content || locale.requestAborted,
          role: 'assistant',
        };
      }
      return {
        content: errorInfo?.error?.message || locale.somethingWrong,
        role: 'assistant',
      };
    },
  });

  // 副作用：当激活的会话改变时清空发送器内容
  // Side effect: clear sender content when active conversation changes
  useEffect(() => {
    senderRef.current?.clear();
  }, [activeConversationKey]);

  return (
    <Flex gap="small" align="flex-start">
      {/* 会话列表：左侧显示可点击的会话项目 */}
      {/* Conversation list: display clickable conversation items on the left */}
      <Conversations
        items={conversations as ConversationItemType[]}
        activeKey={activeConversationKey}
        style={style}
        onActiveChange={setActiveConversationKey}
      />

      {/* 聊天区域：右侧显示当前会话的聊天内容 */}
      {/* Chat area: display chat content for current conversation on the right */}
      <Flex style={{ width: 500 }} vertical gap="small" align="flex-start">
        {/* 消息列表容器：固定高度，支持滚动 */}
        {/* Message list container: fixed height, supports scrolling */}
        <div style={{ width: '100%', height: 300, display: 'flex', flexDirection: 'column' }}>
          <Bubble.List
            items={messages?.map((i) => ({
              ...i.message,
              key: i.id,
              status: i.status,
              loading: i.status === 'loading',
              extraInfo: i.extraInfo,
            }))}
            styles={{
              bubble: {
                maxWidth: 840,
              },
            }}
            role={{
              assistant: {
                placement: 'start',
              },
              user: { placement: 'end' },
            }}
          />
        </div>

        {/* 发送器：用户输入区域，支持发送消息和中止请求 */}
        {/* Sender: user input area, supports sending messages and aborting requests */}
        <Sender
          ref={senderRef}
          onSubmit={(val: string) => {
            if (!val) return;
            // 发送用户消息：构建消息格式并清空输入框
            // Send user message: build message format and clear input field
            onRequest({
              messages: [{ role: 'user', content: val }],
            });
            senderRef.current?.clear();
          }}
          onCancel={() => {
            // 取消当前请求
            // Cancel current request
            abort();
          }}
          loading={isRequesting}
        />
      </Flex>
    </Flex>
  );
};

export default App;
