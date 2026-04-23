# x-chat-provider 实战示例

## 场景1：OpenAI / DeepSeek 内置 Provider

```ts
import { OpenAIChatProvider, DeepSeekChatProvider, XRequest } from '@ant-design/x-sdk';
import type { XModelParams, XModelResponse, SSEFields } from '@ant-design/x-sdk';

// OpenAI 格式
const openaiProvider = new OpenAIChatProvider({
  request: XRequest<XModelParams, XModelResponse>('https://api.openai.com/v1/chat/completions', {
    manual: true,
    headers: { Authorization: 'Bearer your-api-key' },
    params: { model: 'gpt-4o', stream: true },
  }),
});

// DeepSeek 格式（注意 Output 类型是 Partial<Record<SSEFields, XModelResponse>>）
const deepseekProvider = new DeepSeekChatProvider({
  request: XRequest<XModelParams, Partial<Record<SSEFields, XModelResponse>>>(
    'https://api.deepseek.com/v1/chat/completions',
    {
      manual: true,
      headers: { Authorization: 'Bearer your-api-key' },
      params: { model: 'deepseek-chat', stream: true },
    },
  ),
});
```

## 场景2：DefaultChatProvider（透传原始数据）

适用于不需要格式转换、在 `Bubble.List` 的 `contentRender` 中自行渲染的场景：

```tsx
import { DefaultChatProvider, useXChat, XRequest } from '@ant-design/x-sdk';
import { Bubble, Sender } from '@ant-design/x';
import type { BubbleListProps } from '@ant-design/x';
import React from 'react';

interface ChatInput {
  query: string;
  role: 'user';
  stream?: boolean;
}

interface ChatOutput {
  choices: Array<{ message: { content: string; role: string } }>;
}

// ChatMessage 是 ChatOutput | ChatInput 的联合类型
const provider = new DefaultChatProvider<ChatOutput | ChatInput, ChatInput, ChatOutput>({
  request: XRequest('https://api.x.ant.design/api/default_chat_provider_stream', {
    manual: true,
  }),
});

// contentRender 根据消息类型决定如何渲染
const role: BubbleListProps['role'] = {
  assistant: {
    placement: 'start',
    contentRender(content: ChatOutput) {
      return content?.choices?.[0]?.message?.content;
    },
  },
  user: {
    placement: 'end',
    contentRender(content: ChatInput) {
      return content?.query;
    },
  },
};

const App = () => {
  const { messages, onRequest, isRequesting, abort } = useXChat({
    provider,
    requestPlaceholder: {
      choices: [{ message: { content: '等待中...', role: 'assistant' } }],
    },
    requestFallback: {
      choices: [{ message: { content: '请求失败，请重试', role: 'assistant' } }],
    },
  });

  return (
    <>
      <Bubble.List
        role={role}
        items={messages.map(({ id, message, status }) => ({
          key: id,
          loading: status === 'loading',
          role: (message as ChatInput).role || (message as ChatOutput)?.choices?.[0]?.message?.role,
          content: message,
        }))}
      />
      <Sender
        loading={isRequesting}
        onCancel={abort}
        onSubmit={(val) => onRequest({ query: val, role: 'user', stream: false })}
      />
    </>
  );
};
```

## 场景3：自定义 Provider（私有API）

```ts
import { AbstractChatProvider, XRequest } from '@ant-design/x-sdk';
import type { TransformMessage, XRequestOptions } from '@ant-design/x-sdk';

interface MyInput {
  query: string;
  context?: string;
  model?: string;
  stream?: boolean;
}

interface MyOutput {
  content: string;
  finish_reason?: string;
}

interface MyMessage {
  content: string;
  role: 'user' | 'assistant';
}

export class MyChatProvider extends AbstractChatProvider<MyMessage, MyInput, MyOutput> {
  transformParams(
    requestParams: Partial<MyInput>,
    options: XRequestOptions<MyInput, MyOutput, MyMessage>,
  ): MyInput {
    return {
      ...(options?.params || {}),
      query: requestParams.query || '',
      context: requestParams.context,
      model: 'gpt-3.5-turbo',
      stream: true,
    };
  }

  transformLocalMessage(requestParams: Partial<MyInput>): MyMessage {
    return {
      content: requestParams.query || '',
      role: 'user',
    };
  }

  transformMessage(info: TransformMessage<MyMessage, MyOutput>): MyMessage {
    const { originMessage, chunk } = info;

    if (!chunk?.content || chunk.content === '[DONE]') {
      return { ...(originMessage || { content: '', role: 'assistant' }) };
    }

    return {
      content: `${originMessage?.content || ''}${chunk.content}`,
      role: 'assistant',
    };
  }
}

export const provider = new MyChatProvider({
  request: XRequest<MyInput, MyOutput, MyMessage>('https://your-api.com/chat', {
    manual: true,
    headers: {
      Authorization: 'Bearer your-token',
      'Content-Type': 'application/json',
    },
    params: {
      model: 'gpt-3.5-turbo',
      stream: true,
    },
  }),
});
```

## 场景4：带 callbacks 的 Provider（日志/上报）

```ts
import { OpenAIChatProvider, XRequest } from '@ant-design/x-sdk';
import type { XModelParams, XModelResponse, XModelMessage } from '@ant-design/x-sdk';

const provider = new OpenAIChatProvider({
  request: XRequest<XModelParams, XModelResponse, XModelMessage>(BASE_URL, {
    manual: true,
    callbacks: {
      // 流式更新时触发，message 是当前 MessageInfo（含 transformMessage 结果）
      onUpdate: (chunk, responseHeaders, message) => {
        console.log('流式更新 content:', message?.message?.content?.length);
      },
      // 所有片段完成时触发，可用于统计 token / 上报
      onSuccess: (chunks, responseHeaders, message) => {
        const finalContent = message?.message?.content;
        analytics.track('chat_complete', { length: finalContent?.length });
      },
      // 请求失败时触发（含主动 abort）
      onError: (error, errorInfo, responseHeaders, message) => {
        if (error.name !== 'AbortError') {
          errorLogger.report(error);
        }
      },
    },
    params: { model: 'gpt-4o', stream: true },
  }),
});
```

## 场景5：带自动重试的 Provider

```ts
import { OpenAIChatProvider, XRequest } from '@ant-design/x-sdk';

const provider = new OpenAIChatProvider({
  request: XRequest(BASE_URL, {
    manual: true,
    retryInterval: 3000, // 失败后 3 秒重试
    retryTimes: 3, // 最多重试 3 次
    callbacks: {
      onError: (error) => {
        // 主动 abort 不重试；返回数字可覆盖 retryInterval
        if (error.name === 'AbortError') return;
        return 5000; // 动态设置重试间隔为 5 秒
      },
    },
    params: { model: 'gpt-4o', stream: true },
  }),
});
```

## 场景6：多字段响应（带附件）

```ts
import { AbstractChatProvider } from '@ant-design/x-sdk';
import type { TransformMessage, XRequestOptions } from '@ant-design/x-sdk';

interface MyOutput {
  content: string;
  attachments?: Array<{ name: string; url: string; type: string }>;
}

interface MyMessage {
  content: string;
  role: 'user' | 'assistant';
  attachments?: Array<{ name: string; url: string; type: string }>;
}

class AttachmentProvider extends AbstractChatProvider<MyMessage, { query: string }, MyOutput> {
  transformParams(params: Partial<{ query: string }>, options: XRequestOptions<any, any, any>) {
    return { ...(options?.params || {}), query: params.query || '' };
  }

  transformLocalMessage(params: Partial<{ query: string }>): MyMessage {
    return { content: params.query || '', role: 'user' };
  }

  transformMessage(info: TransformMessage<MyMessage, MyOutput>): MyMessage {
    const { originMessage, chunk } = info;

    if (!chunk || chunk.content === '[DONE]') {
      return { ...(originMessage || { content: '', role: 'assistant' }) };
    }

    try {
      const data = typeof chunk === 'string' ? JSON.parse(chunk) : chunk;
      const existingAttachments = originMessage?.attachments || [];
      const newAttachments = data.attachments || [];

      // 合并附件，避免重复
      const mergedAttachments = [...existingAttachments];
      newAttachments.forEach((a: any) => {
        if (!mergedAttachments.some((e) => e.url === a.url)) {
          mergedAttachments.push(a);
        }
      });

      return {
        content: `${originMessage?.content || ''}${data.content || ''}`,
        role: 'assistant',
        attachments: mergedAttachments,
      };
    } catch {
      return {
        content: `${originMessage?.content || ''}`,
        role: 'assistant',
        attachments: originMessage?.attachments || [],
      };
    }
  }
}
```

## 场景7：多会话 Provider 工厂（配合 useXConversations）

```ts
import { OpenAIChatProvider, XRequest } from '@ant-design/x-sdk';
import type { XModelParams, XModelResponse } from '@ant-design/x-sdk';

// 每个会话独立一个 Provider 实例，避免状态混用
const providerCache = new Map<string, OpenAIChatProvider>();

export function getProvider(conversationKey: string): OpenAIChatProvider {
  if (!providerCache.has(conversationKey)) {
    providerCache.set(
      conversationKey,
      new OpenAIChatProvider({
        request: XRequest<XModelParams, XModelResponse>(BASE_URL, {
          manual: true,
          params: { model: 'gpt-4o', stream: true },
        }),
      }),
    );
  }
  return providerCache.get(conversationKey)!;
}

// 在组件中使用：
// provider={getProvider(activeConversationKey)}
// conversationKey={activeConversationKey}
```
