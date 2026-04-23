---
category: Components
group:
  title: 数据提供
  order: 2
title: Custom Chat Provider
order: 4
subtitle: 自定义
tag: 2.0.0
packageName: x-sdk
---

当内置的 Chat Provider 不满足需求时，可以通过实现抽象类 `AbstractChatProvider` (仅包含三个抽象方法)，可以将不同的模型提供商、或者 Agentic 服务数据转换为可被 `useXChat` 消费的格式，从而实现不同模型、Agent之间的无缝接入和切换。

## AbstractChatProvider

`AbstractChatProvider` 是一个抽象类，用于定义 `Chat Provider` 的接口。当你需要使用自定义的数据服务时，你可以继承 `AbstractChatProvider` 并实现其方法，可参考[样板间-百宝箱](/docs/playground/agent-tbox-cn)。

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
   * 转换onRequest传入的参数，你可以和Provider实例化时request配置中的params进行合并或者额外处理
   * @param requestParams 请求参数
   * @param options 请求配置，从Provider实例化时request配置中来
   */
  abstract transformParams(
    requestParams: Partial<Input>,
    options: XRequestOptions<Input, Output>,
  ): Input;

  /**
   * 将onRequest传入的参数转换为本地（用户发送）的ChatMessage，用于消息渲染
   * @param requestParams onRequest传入的参数
   */
  abstract transformLocalMessage(requestParams: Partial<Input>): ChatMessage;

  /**
   * 可在更新返回数据时对messages做转换，同时会更新到messages
   * @param info
   */
  abstract transformMessage(info: TransformMessage<ChatMessage, Output>): ChatMessage;
}
```

## 自定义 Provider 完整过程

下面是一个自定义 Provider 示例，用于展示如何自定义 `Chat Provider`，代码示例后有详细解析

### 完整示例

```ts
// 类型定义
type CustomInput = {
  query: string;
};

type CustomOutput = {
  data: {
    content: string; // 文本内容
    attachments?: {
      // 可选：文档附件信息
      name: string; // 文件名
      url: string; // 下载链接
      type: string; // 文件类型，如 'pdf', 'docx', 'image'
      size?: number; // 文件大小（字节），可选
    }[];
  };
};

type CustomMessage = {
  content: string;
  role: 'user' | 'assistant';
  // 可选：附件信息，与 CustomOutput 中的 attachments 对应
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

      // 合并附件信息，避免丢失已有数据
      const existingAttachments = originMessage?.attachments || [];
      const newAttachments = data.attachments || [];
      const mergedAttachments = [...existingAttachments];

      // 只添加新的附件，避免重复
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
      // 如果不是JSON格式，按普通文本处理
      return {
        content: `${originMessage?.content || ''}${chunk.data || ''}`,
        role: 'assistant',
        attachments: originMessage?.attachments || [],
      } as ChatMessage;
    }
  }
}
```

### 详细解析

1、`Agentic` 服务流式接口 `https://xxx.agent.com/api/stream`。

接口入参

```json
{
  "query": "帮我总结今天的科技新闻"
}
```

接口出参

```json
id:1
data: {"content":"好的，"}

id:2
data: {"content":"我将为您"}

id:3
data: {"content":"总结今天"}

id:4
data: {"content":"的科技新闻，"}

id:5
data: {"content":"报告已生成完成","attachments":[{"name":"科技新闻总结.pdf","url":"https://example.com/download/report.pdf","type":"pdf","size":102400}]}

```

2、那么根据接口可以明确 `CustomInput` 和 `CustomOutput` 类型。

`CustomInput` 类型如下

```ts
{
  query: string;
}
```

由于输出数据字符串需要解析 JSON，然后提取内部的 content 字段进行拼接，如果有附件信息则一并处理，那么 `CustomOutput` 类型如下

```ts
{
  data: {
    content: string;   // 文本内容
    attachments?: {    // 可选：文档附件信息
      name: string;    // 文件名
      url: string;     // 下载链接
      type: string;    // 文件类型，如 'pdf', 'docx', 'image'
      size?: number;   // 文件大小（字节），可选
    }[];
  };
}
```

所有响应都统一使用 `data.content` 字段返回文本内容，可选的 `data.attachments` 字段返回附件信息。

3、我们期望 `useXChat` 生产的 messages 数据可以直接给 Bubble.List 消费，那么可以将 `CustomMessage` 定义如下：

```ts
{
  content: string;
  role: 'user' | 'assistant';
  // 可选：附件信息，用于显示下载链接或预览
  attachments?: {
    name: string;
    url: string;
    type: string;
    size?: number;
  }[];
}
```

4、然后继承 `AbstractChatProvider` 并实现其方法，得到 `CustomProvider`，`AbstractChatProvider` 内有且仅有三个方法需要实现。

- `transformParams` 用于转换 onRequest 传入的参数，你可以和 Provider 实例化时 request 配置中的 params 进行合并或者额外处理。
- `transformLocalMessage` 将 onRequest 传入的参数转换为本地（用户发送）的 ChatMessage，用于用户发送消息渲染，同时会更新到 messages，用于消息列表渲染。
- `transformMessage` 可在更新返回数据时将数据做转换为 ChatMessage 数据类型，同时会更新到 messages，用于消息列表渲染。

**处理附件信息：** 在 `transformMessage` 方法中，需要检测响应数据是否包含附件信息。如果包含，将附件数据添加到返回的 ChatMessage 中，这样消息组件就能显示下载链接。

5、最后我们可以将 `CustomProvider` 实例化并传入 `useXChat` 中，即可完成自定义 Provider 的使用。

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

6、发送请求

```tsx
onRequest({
  query: '帮我总结今天的科技新闻',
});
```

### 带附件的完整示例

如果你的服务支持返回文档附件，可以这样使用：

```tsx
// 发送请求并处理带附件的响应
onRequest({
  query: '生成一份项目总结报告',
});

// 响应将包含附件信息，可以直接在消息气泡中显示下载链接
// messages 数据将包含 attachments 字段
```

**注意事项：**

- 附件信息是可选的，不强制要求所有响应都包含
- 文件类型可以是常见的文档格式：pdf、docx、xlsx、png、jpg 等
- 建议提供文件大小信息，提升用户体验
- 下载链接需要确保用户有权限访问

## 代码演示

<!-- prettier-ignore -->
<code src="./demos/chat-providers/custom-provider-width-ui.tsx">基础</code>

## 贡献 Chat Provider

我们欢迎社区贡献新的 Chat Provider！请按照以下规范进行 Chat Provider 开发。

### 贡献指南

这篇指南会指导你如何为 Ant Design 贡献自己的一份力量，请你在提 issue 或者 pull request 之前花几分钟来阅读一遍这篇[贡献指南](/docs/react/contributing-cn)。

### 贡献规范

Chat Provider 应遵循以下规范：

- Chat Provider 应包含在 `packages/x-sdk/src/chat-providers` 目录下。
- Chat Provider Type 应包含在 `packages/x-sdk/src/chat-providers/type` 目录下。

### 命名规范

Chat Provider 主题文件应遵循以下命名规则：

- Chat Provider 主题文件应以 `[供应商][类型][版本].ts` 驼峰格式的方式命名。
- 如果是特定模型可直接以`[供应商][模型名称].ts` 驼峰格式的方式命名。
