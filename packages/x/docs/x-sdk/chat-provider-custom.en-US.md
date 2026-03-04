---
category: Components
group:
  title: Chat Provider
  order: 2
title: Custom Chat Provider
order: 4
tag: 2.0.0
packageName: x-sdk
---

When the built-in Chat Provider doesn't meet your needs, you can implement the abstract class `AbstractChatProvider` (which only contains three abstract methods) to convert data from different model providers or Agentic services into a unified format that `useXChat` can consume, enabling seamless integration and switching between different models and agents.

## AbstractChatProvider

`AbstractChatProvider` is an abstract class used to define the interface for `Chat Provider`. When you need to use a custom data service, you can inherit from `AbstractChatProvider` and implement its methods. You can refer to the [Playground - Toolbox](/docs/playground/agent-tbox) for examples.

```ts
type MessageStatus = 'local' | 'loading' | 'updating' | 'success' | 'error';

interface ChatProviderConfig<Input, Output> {
  request: XRequestClass<Input, Output> | (() => XRequestClass<Input, Output>);
}

interface TransformMessage<ChatMessage, Output> {
  originMessage?: ChatMessage;
  chunk: Output;
  chunks: Output[];
  status: MessageStatus;
}

abstract class AbstractChatProvider<ChatMessage, Input, Output> {
  constructor(config: ChatProviderConfig<Input, Output>): void;

  /**
   * Transform parameters passed to onRequest. You can merge or additionally process them with the params in the request configuration when instantiating the Provider
   * @param requestParams Request parameters
   * @param options Request configuration, from the request configuration when instantiating the Provider
   */
  abstract transformParams(
    requestParams: Partial<Input>,
    options: XRequestOptions<Input, Output>,
  ): Input;

  /**
   * Convert parameters passed to onRequest into a local (user-sent) ChatMessage for message rendering
   * @param requestParams Parameters passed to onRequest
   */
  abstract transformLocalMessage(requestParams: Partial<Input>): ChatMessage;

  /**
   * Can transform messages when updating returned data, and will also update messages
   * @param info
   */
  abstract transformMessage(info: TransformMessage<ChatMessage, Output>): ChatMessage;
}
```

## Complete Process for Custom Provider

Below is a custom Provider example showing how to customize a `Chat Provider`. Detailed explanations follow the code example.

### Complete Example

```ts
// Type definitions
type CustomInput = {
  query: string;
};

type CustomOutput = {
  data: {
    content: string; // Text content
    attachments?: {
      // Optional: Document attachments
      name: string; // File name
      url: string; // Download link
      type: string; // File type, e.g., 'pdf', 'docx', 'image'
      size?: number; // File size in bytes, optional
    }[];
  };
};

type CustomMessage = {
  content: string;
  role: 'user' | 'assistant';
  // Optional: Attachment information for displaying download links or previews
  attachments?: {
    name: string;
    url: string;
    type: string;
    size?: number;
  }[];
};

class CustomProvider<
  ChatMessage extends CustomMessage = CustomMessage,
  Input extends CustomInput = CustomInput,
  Output extends CustomOutput = CustomOutput,
> extends AbstractChatProvider<ChatMessage, Input, Output> {
  transformParams(
    requestParams: Partial<Input>,
    options: XRequestOptions<Input, Output, ChatMessage>,
  ): Input {
    if (typeof requestParams !== 'object') {
      throw new Error('requestParams must be an object');
    }
    return {
      ...(options?.params || {}),
      ...(requestParams || {}),
    } as Input;
  }
  transformLocalMessage(requestParams: Partial<Input>): ChatMessage {
    return {
      content: requestParams.query,
      role: 'user',
    } as unknown as ChatMessage;
  }
  transformMessage(info: TransformMessage<ChatMessage, Output>): ChatMessage {
    const { originMessage, chunk } = info || {};
    if (!chunk || !chunk?.data || (chunk?.data && chunk?.data?.includes('[DONE]'))) {
      return {
        content: originMessage?.content || '',
        role: 'assistant',
        attachments: originMessage?.attachments || [],
      } as ChatMessage;
    }

    try {
      const data = JSON.parse(chunk.data);
      const content = originMessage?.content || '';

      // Merge attachment information to avoid data loss
      const existingAttachments = originMessage?.attachments || [];
      const newAttachments = data.attachments || [];
      const mergedAttachments = [...existingAttachments];

      // Only add new attachments to avoid duplicates
      newAttachments.forEach((newAttach) => {
        if (!mergedAttachments.some((existing) => existing.url === newAttach.url)) {
          mergedAttachments.push(newAttach);
        }
      });

      return {
        content: `${content || ''}${data.content || ''}`,
        role: 'assistant',
        attachments: mergedAttachments,
      } as ChatMessage;
    } catch {
      // If not JSON format, treat as plain text
      return {
        content: `${originMessage?.content || ''}${chunk.data || ''}`,
        role: 'assistant',
        attachments: originMessage?.attachments || [],
      } as ChatMessage;
    }
  }
}
```

### Detailed Explanation

1. The `Agentic` service streaming interface `https://xxx.agent.com/api/stream`.

Request parameters:

```json
{
  "query": "Help me summarize today's tech news"
}
```

Response data:

```json
id:1
data: {"content":"Okay,"}

id:2
data: {"content":"I'll help you"}

id:3
data: {"content":"summarize today's"}

id:4
data: {"content":"tech news,"}

id:5
data: {"content":"Report has been generated","attachments":[{"name":"Tech News Summary.pdf","url":"https://example.com/download/report.pdf","type":"pdf","size":102400}]}

```

2. Based on the interface, we can define the `CustomInput` and `CustomOutput` types.

`CustomInput` type:

```ts
{
  query: string;
}
```

Since we need to parse the JSON string and extract the content field for concatenation, and handle attachment information if present, the `CustomOutput` type is:

```ts
{
  data: {
    content: string;   // Text content
    attachments?: {    // Optional: Document attachments
      name: string;    // File name
      url: string;     // Download link
      type: string;    // File type, e.g., 'pdf', 'docx', 'image'
      size?: number;   // File size in bytes, optional
    }[];
  };
}
```

All responses use the unified `data.content` field for text content and optional `data.attachments` field for attachment information.

3. We expect the messages data generated by `useXChat` to be directly consumable by Bubble.List, so we can define `CustomMessage` as:

```ts
{
  content: string;
  role: 'user' | 'assistant';
  // Optional: Attachment information for displaying download links or previews
  attachments?: {
    name: string;
    url: string;
    type: string;
    size?: number;
  }[];
}
```

4. Then inherit from `AbstractChatProvider` and implement its methods to get `CustomProvider`. `AbstractChatProvider` only requires implementing three methods.

- `transformParams` is used to transform parameters passed to onRequest. You can merge or additionally process them with the params in the request configuration when instantiating the Provider.
- `transformLocalMessage` converts parameters passed to onRequest into a local (user-sent) ChatMessage for user message rendering, and will also update messages for message list rendering.
- `transformMessage` can transform data into ChatMessage data type when updating returned data, and will also update messages for message list rendering.

5. Finally, we can instantiate `CustomProvider` and pass it to `useXChat` to complete the custom Provider usage.

```tsx
const [provider] = React.useState(
  new CustomProvider({
    request: XRequest<CustomInput, CustomOutput>('https://xxx.agent.com/api/stream', {
      manual: true,
    }),
  }),
);

const { onRequest, messages, setMessages, setMessage, isRequesting, abort, onReload } = useXChat({
  provider,
});
```

6. Send request:

```tsx
onRequest({
  query: "Help me summarize today's tech news",
});
```

### Complete Example with Attachments

If your service supports returning document attachments, you can use it like this:

```tsx
// Send request and handle responses with attachments
onRequest({
  query: 'Generate a project summary report',
});

// The response will include attachment information, which can be displayed as download links in message bubbles
// The messages data will include the attachments field
```

**Notes:**

- Attachment information is optional, not all responses are required to include it
- File types can be common document formats: pdf, docx, xlsx, png, jpg, etc.
- Providing file size information is recommended to improve user experience
- Download links need to ensure users have access permissions

## Usage Example

<!-- prettier-ignore -->
<code src="./demos/chat-providers/custom-provider-width-ui.tsx">Basic</code>

## Contributing Chat Provider

We welcome community contributions for new Chat Providers! Please follow these specifications for Chat Provider development.

### Contribution Guide

This guide will help you contribute to Ant Design. Please take a few minutes to read this [contribution guide](/docs/react/contributing) before submitting an issue or pull request.

### Contribution Standards

Chat Providers should follow these specifications:

- Chat Providers should be included in the `packages/x-sdk/src/chat-providers` directory.
- Chat Provider types should be included in the `packages/x-sdk/src/chat-providers/type` directory.

### Naming Conventions

Chat Provider theme files should follow these naming rules:

- Chat Provider theme files should be named in camelCase format as `[Vendor][Type][Version].ts`.
- For specific models, they can be directly named in camelCase format as `[Vendor][ModelName].ts`.
