# x-chat-provider Practical Examples

## Scenario 1: OpenAI / DeepSeek Built-in Provider

```ts
import { OpenAIChatProvider, DeepSeekChatProvider, XRequest } from '@ant-design/x-sdk';
import type { XModelParams, XModelResponse, SSEFields } from '@ant-design/x-sdk';

// OpenAI format
const openaiProvider = new OpenAIChatProvider({
  request: XRequest<XModelParams, XModelResponse>('https://api.openai.com/v1/chat/completions', {
    manual: true,
    headers: { Authorization: 'Bearer your-api-key' },
    params: { model: 'gpt-4o', stream: true },
  }),
});

// DeepSeek format (note Output type is Partial<Record<SSEFields, XModelResponse>>)
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

## Scenario 2: DefaultChatProvider (Pass-through raw data)

Suitable for cases where no format conversion is needed and rendering is handled in `Bubble.List`'s `contentRender`:

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

// ChatMessage is a union type of ChatOutput | ChatInput
const provider = new DefaultChatProvider<ChatOutput | ChatInput, ChatInput, ChatOutput>({
  request: XRequest('https://api.x.ant.design/api/default_chat_provider_stream', {
    manual: true,
  }),
});

// contentRender decides how to render based on message type
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
      choices: [{ message: { content: 'Loading...', role: 'assistant' } }],
    },
    requestFallback: {
      choices: [{ message: { content: 'Request failed, please retry', role: 'assistant' } }],
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

## Scenario 3: Custom Provider (Private API)

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

## Scenario 4: Provider with callbacks (Logging / Reporting)

```ts
import { OpenAIChatProvider, XRequest } from '@ant-design/x-sdk';
import type { XModelParams, XModelResponse, XModelMessage } from '@ant-design/x-sdk';

const provider = new OpenAIChatProvider({
  request: XRequest<XModelParams, XModelResponse, XModelMessage>(BASE_URL, {
    manual: true,
    callbacks: {
      // Triggered on each streaming update; message is the current MessageInfo (with transformMessage result)
      onUpdate: (chunk, responseHeaders, message) => {
        console.log('Stream update content length:', message?.message?.content?.length);
      },
      // Triggered when all chunks are complete; good for token counting / reporting
      onSuccess: (chunks, responseHeaders, message) => {
        const finalContent = message?.message?.content;
        analytics.track('chat_complete', { length: finalContent?.length });
      },
      // Triggered on request failure (including user abort)
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

## Scenario 5: Provider with Auto-retry

```ts
import { OpenAIChatProvider, XRequest } from '@ant-design/x-sdk';

const provider = new OpenAIChatProvider({
  request: XRequest(BASE_URL, {
    manual: true,
    retryInterval: 3000, // Retry 3 seconds after failure
    retryTimes: 3, // Max 3 retries
    callbacks: {
      onError: (error) => {
        // Don't retry on user abort; return number to override retryInterval
        if (error.name === 'AbortError') return;
        return 5000; // Dynamic retry interval of 5 seconds
      },
    },
    params: { model: 'gpt-4o', stream: true },
  }),
});
```

## Scenario 6: Multi-field Response (with Attachments)

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

      // Merge attachments, avoid duplicates
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

## Scenario 7: Multi-conversation Provider Factory (with useXConversations)

```ts
import { OpenAIChatProvider, XRequest } from '@ant-design/x-sdk';
import type { XModelParams, XModelResponse } from '@ant-design/x-sdk';

// Each conversation gets its own Provider instance to avoid state mixing
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

// Usage in component:
// provider={getProvider(activeConversationKey)}
// conversationKey={activeConversationKey}
```
