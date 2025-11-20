import type { ConversationItemType } from '@ant-design/x';
import { Bubble, Conversations, Sender } from '@ant-design/x';
import {
  DeepSeekChatProvider,
  SSEFields,
  useXChat,
  useXConversations,
  XModelParams,
  XModelResponse,
  XRequest,
} from '@ant-design/x-sdk';
import { Flex, GetRef, theme } from 'antd';

import React, { useEffect, useRef } from 'react';

const items: ConversationItemType[] = Array.from({ length: 4 }).map((_, index) => ({
  key: `item${index + 1}`,
  label:
    index + 1 === 3
      ? "This's Conversation Item 3, you can click me!"
      : `Conversation Item ${index + 1}`,
  disabled: index === 3,
}));

// ==================== Chat Provider ====================
const providerCaches = new Map<string, DeepSeekChatProvider>();
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

// Provide different default messages based on activeConversationKey
const getDefaultMessages = (conversationKey: string) => {
  const messagesMap: Record<string, any[]> = {
    item1: [
      {
        message: { role: 'user', content: 'Hello, this is Conversation 1!' },
        status: 'success',
      },
      {
        message: {
          role: 'assistant',
          content:
            'Hello! This is the welcome message for Conversation 1. I can help you answer various questions.',
        },
        status: 'success',
      },
    ],
    item2: [
      {
        message: { role: 'user', content: 'Conversation 2 has started' },
        status: 'success',
      },
      {
        message: {
          role: 'assistant',
          content: 'Welcome to Conversation 2! Here we can discuss technology-related topics.',
        },
        status: 'success',
      },
    ],
    item3: [
      {
        message: { role: 'user', content: 'Clicked on Conversation 3' },
        status: 'success',
      },
      {
        message: {
          role: 'assistant',
          content:
            'You selected Conversation 3! This is a special conversation. How can I help you?',
        },
        status: 'success',
      },
    ],
    item4: [
      {
        message: { role: 'user', content: 'Conversation 4 initialized' },
        status: 'success',
      },
      {
        message: {
          role: 'assistant',
          content:
            'This is Conversation 4. Although it is disabled, you can still view historical messages.',
        },
        status: 'success',
      },
    ],
  };

  return (
    messagesMap[conversationKey] || [
      {
        message: { role: 'user', content: 'hello!' },
        status: 'success',
      },
      {
        message: {
          role: 'assistant',
          content: 'Hello! How can I assist you today?',
        },
        status: 'success',
      },
    ]
  );
};

export default () => {
  const { token } = theme.useToken();
  const { conversations, activeConversationKey, setActiveConversationKey } = useXConversations({
    defaultConversations: items,
    defaultActiveConversationKey: items[0].key,
  });
  const senderRef = useRef<GetRef<typeof Sender>>(null);

  const style = {
    width: 256,
    background: token.colorBgContainer,
    borderRadius: token.borderRadius,
  };

  const { onRequest, messages, isRequesting, abort } = useXChat({
    provider: providerFactory(activeConversationKey), // every conversation has its own provider
    conversationKey: activeConversationKey,
    defaultMessages: getDefaultMessages(activeConversationKey),
    requestPlaceholder: () => {
      return {
        content: 'Thinking',
        role: 'assistant',
      };
    },
    requestFallback: (_, { error }) => {
      return {
        role: 'assistant',
        content: error.message,
      };
    },
  });

  useEffect(() => {
    senderRef.current?.clear();
  }, [activeConversationKey]);
  return (
    <Flex gap="small" align="flex-start">
      <Conversations
        items={conversations as ConversationItemType[]}
        activeKey={activeConversationKey}
        style={style}
        onActiveChange={setActiveConversationKey}
      />
      <Flex style={{ width: 500 }} vertical gap="small" align="flex-start">
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
        <Sender
          ref={senderRef}
          onSubmit={(val: string) => {
            if (!val) return;
            onRequest({
              messages: [{ role: 'user', content: val }],
            });

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
