import type { ConversationItemType } from '@ant-design/x';
import { Bubble, Conversations, Sender, Welcome } from '@ant-design/x';
import {
  DeepSeekChatProvider,
  type DefaultMessageInfo,
  type SSEFields,
  useXChat,
  useXConversations,
  type XModelMessage,
  type XModelParams,
  type XModelResponse,
  XRequest,
} from '@ant-design/x-sdk';
import { Flex, GetRef, theme } from 'antd';
import React, { useEffect, useRef } from 'react';

const DEFAULT_KEY = 'DEFAULT_KEY';
const useLocale = () => {
  const isCN = typeof location !== 'undefined' ? location.pathname.endsWith('-cn') : false;
  return {
    conversationItem1: isCN ? '会话项目 1' : 'Conversation Item 1',
    conversationItem2: isCN ? '会话项目 2' : 'Conversation Item 2',
    conversationItem3: isCN
      ? '会话项目 3，你可以点击我！'
      : "This's Conversation Item 3, you can click me!",
    conversationItem4: isCN ? '会话项目 4' : 'Conversation Item 4',
    thinking: isCN ? '思考中' : 'Thinking',
    requestAborted: isCN ? '请求已中止' : 'Request aborted',
    somethingWrong: isCN ? '出了点问题' : 'Something went wrong',
  };
};

const App = () => {
  const locale = useLocale();
  const { token } = theme.useToken();
  const items: ConversationItemType[] = [
    {
      key: DEFAULT_KEY,
    },
    {
      key: 'sessionId_1',
      label: locale.conversationItem1,
    },
    {
      key: 'sessionId_2',
      label: locale.conversationItem2,
    },
    {
      key: 'sessionId_3',
      label: locale.conversationItem3,
    },
    {
      key: 'sessionId_4',
      label: locale.conversationItem4,
      disabled: true, // 禁用此项目，用户无法点击
    },
  ];

  const isHistorySessionId = (sessionId: string) => items.find(({ key }) => key === sessionId);

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

  // 会话管理：使用会话钩子管理会话列表和激活状态
  // Conversation management: use conversation hook to manage conversation list and active state
  const { conversations, activeConversationKey, setActiveConversationKey, addConversation } =
    useXConversations({
      defaultConversations: items,
      defaultActiveConversationKey: DEFAULT_KEY,
    });

  const senderRef = useRef<GetRef<typeof Sender>>(null);
  const pendingMessageRef = useRef<string | null>(null);

  const style = {
    width: 256,
    background: token.colorBgContainer,
    borderRadius: token.borderRadius,
  };

  // 获取历史消息列表：从服务器加载历史聊天记录
  // Get history message list: load historical chat records from server
  const getHistoryMessageList: (info: {
    conversationKey?: string;
  }) => Promise<DefaultMessageInfo<XModelMessage>[]> = async ({ conversationKey }) => {
    try {
      if (
        !conversationKey ||
        conversationKey === DEFAULT_KEY ||
        !isHistorySessionId(conversationKey)
      )
        return [];
      const response = await fetch(
        `https://api.x.ant.design/api/history_messages?isZH_CN=${typeof location !== 'undefined' && location.pathname.endsWith('-cn')}&sessionId=${conversationKey}`,
        {
          method: 'GET',
        },
      );
      const responseJson = await response.json();
      if (responseJson?.success) {
        return responseJson?.data || [];
      }
    } catch (error) {
      // 网络请求失败时返回空数组
      // Return empty array when network request fails
      console.warn('Failed to load history messages:', error);
    }
    return [];
  };

  // 聊天管理：使用聊天钩子管理消息和请求
  // Chat management: use chat hook to manage messages and requests
  const { onRequest, messages, isDefaultMessagesRequesting, isRequesting, abort } = useXChat({
    provider: providerFactory(activeConversationKey), // 每个会话都有独立的提供者
    conversationKey: activeConversationKey,
    defaultMessages: getHistoryMessageList,
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

  useEffect(() => {
    senderRef.current?.clear();
  }, [activeConversationKey, onRequest]);

  const onAdd = () => {
    setActiveConversationKey(DEFAULT_KEY);
  };

  return (
    <Flex gap="small" align="flex-start">
      {/* 会话列表：左侧显示可点击的会话项目 */}
      {/* Conversation list: display clickable conversation items on the left */}
      <Conversations
        creation={{
          onClick: onAdd,
        }}
        items={
          conversations.filter(({ key }) => key !== DEFAULT_KEY).reverse() as ConversationItemType[]
        }
        activeKey={activeConversationKey === DEFAULT_KEY ? undefined : activeConversationKey}
        style={style}
        onActiveChange={setActiveConversationKey}
      />

      {/* 聊天区域：右侧显示当前会话的聊天内容 */}
      {/* Chat area: display chat content for current conversation on the right */}
      <Flex style={{ width: 500 }} vertical gap="small" align="flex-start">
        <div style={{ width: '100%', height: 350, display: 'flex', flexDirection: 'column' }}>
          {activeConversationKey === DEFAULT_KEY ? (
            <>
              <Welcome
                variant="borderless"
                icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
                title="Hello, I'm Ant Design X"
                description="Base on Ant Design, AGI product interface solution, create a better intelligent vision~"
              />
            </>
          ) : (
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
          )}
        </div>

        {/* 发送器：用户输入区域，支持发送消息和中止请求 */}
        {/* Sender: user input area, supports sending messages and aborting requests */}
        <Sender
          disabled={isDefaultMessagesRequesting}
          ref={senderRef}
          onSubmit={(val: string) => {
            if (!val) return;

            if (activeConversationKey !== DEFAULT_KEY) {
              onRequest({
                messages: [{ role: 'user', content: val }],
              });
            } else {
              addConversation({
                key: 'sessionId_6',
                label: val,
              });
              setActiveConversationKey('sessionId_6');
              setTimeout(() => {
                onRequest({
                  messages: [{ role: 'user', content: '12345' }],
                });
              }, 0);
            }
            senderRef.current?.clear();
          }}
          onCancel={() => {
            abort();
          }}
          loading={isRequesting}
        />
      </Flex>
    </Flex>
  );
};

export default App;
