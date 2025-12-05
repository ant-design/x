import { Bubble, BubbleListProps, Sender } from '@ant-design/x';
import {
  AbstractXRequestClass,
  OpenAIChatProvider,
  type SSEFields,
  useXChat,
  type XModelMessage,
  type XModelParams,
  type XRequestOptions,
} from '@ant-design/x-sdk';
import { Flex } from 'antd';
import OpenAI from 'openai';
import React, { useState } from 'react';

// 输出类型：SSE字段的任意值映射
// Output type: arbitrary value mapping of SSE fields
type OutputType = Partial<Record<SSEFields, any>>;
// 输入类型：XModel参数类型
// Input type: XModel parameter type
type InputType = XModelParams;

// OpenAI请求类：继承自AbstractXRequestClass，实现OpenAI API的自定义请求处理
// OpenAI Request class: inherits from AbstractXRequestClass, implements custom request handling for OpenAI API
class OpenAiRequest<
  Input extends InputType = InputType,
  Output extends OutputType = OutputType,
> extends AbstractXRequestClass<Input, Output> {
  client: any;
  stream: OpenAI | undefined;

  _isTimeout = false;
  _isStreamTimeout = false;
  _isRequesting = false;

  // 构造函数：初始化OpenAI客户端
  // Constructor: initialize OpenAI client
  constructor(baseURL: string, options: XRequestOptions<Input, Output>) {
    super(baseURL, options);
    this.client = new OpenAI({
      apiKey: 'OPENAI_API_KEY',
      dangerouslyAllowBrowser: true,
    });
  }
  // 异步处理器：返回已解决的Promise
  // Async handler: return resolved Promise
  get asyncHandler(): Promise<any> {
    return Promise.resolve();
  }
  // 是否超时
  // Whether timeout
  get isTimeout(): boolean {
    return this._isTimeout;
  }
  // 是否流超时
  // Whether stream timeout
  get isStreamTimeout(): boolean {
    return this._isStreamTimeout;
  }
  // 是否正在请求
  // Whether requesting
  get isRequesting(): boolean {
    return this._isRequesting;
  }
  // 是否手动模式
  // Whether manual mode
  get manual(): boolean {
    return true;
  }

  // 运行方法：执行OpenAI API请求
  // Run method: execute OpenAI API request
  async run(input: Input): Promise<void> {
    const { callbacks } = this.options;
    try {
      // 创建OpenAI响应：使用指定的模型和输入内容
      // Create OpenAI response: use specified model and input content
      await this.client.responses.create({
        model: 'gpt-5-nano',
        input: input?.messages?.[0]?.content || '',
        stream: true,
      });

      // 请基于 response 实现 流数据更新逻辑
      // Please implement stream data update logic based on response
    } catch (error: any) {
      callbacks?.onError(error);
    }
  }

  // 中止方法：取消当前请求
  // Abort method: cancel current request
  abort(): void {
    // 请基于openai 实现 abort
    // Please implement abort based on OpenAI
  }
}

// 创建OpenAI聊天提供者：使用自定义的OpenAI请求类
// Create OpenAI chat provider: use custom OpenAI request class
const provider = new OpenAIChatProvider<XModelMessage, InputType, OutputType>({
  request: new OpenAiRequest('OPENAI', {}),
});

// 演示组件：展示如何使用自定义OpenAI请求进行聊天
// Demo component: demonstrate how to use custom OpenAI request for chat
const Demo: React.FC = () => {
  const [content, setContent] = useState('');

  // 使用聊天钩子：管理消息、请求状态等
  // Use chat hook: manage messages, request status, etc.
  const { onRequest, messages, isRequesting, abort } = useXChat({
    provider,
    // 请求占位符：在等待响应时显示加载状态
    // Request placeholder: display loading status while waiting for response
    requestPlaceholder: () => {
      return {
        content: 'loading...',
        role: 'assistant',
      };
    },
    // 请求回退：处理请求失败的情况
    // Request fallback: handle request failure cases
    requestFallback: (_, { error }) => {
      if (error.name === 'AbortError') {
        return {
          content: 'Request is aborted',
          role: 'assistant',
        };
      }
      return {
        content: error?.toString(),
        role: 'assistant',
      };
    },
  });

  // 转换消息格式：将消息列表转换为Bubble组件所需的格式
  // Transform message format: convert message list to format required by Bubble component
  const items = messages.map(({ message, id }) => ({
    key: id,
    ...message,
  }));

  // 消息角色配置：定义助手和用户消息的布局
  // Message role configuration: define layout for assistant and user messages
  const role: BubbleListProps['role'] = {
    assistant: {
      placement: 'start',
    },
    user: { placement: 'end' },
  };

  return (
    <Flex
      vertical
      gap={16}
      justify="space-between"
      style={{
        padding: 16,
      }}
    >
      {/* 消息列表：显示所有聊天消息 */}
      {/* Message list: display all chat messages */}
      <Bubble.List style={{ height: 500 }} role={role} items={items} />
      {/* 发送器：用户输入区域，支持发送消息和中止请求 */}
      {/* Sender: user input area, supports sending messages and aborting requests */}
      <Sender
        value={content}
        onChange={setContent}
        loading={isRequesting}
        onCancel={abort}
        onSubmit={(val) => {
          // 发送用户消息：构建消息格式并清空输入框
          // Send user message: build message format and clear input field
          onRequest({
            messages: [{ role: 'user', content: val }],
          });
          setContent('');
        }}
      />
    </Flex>
  );
};

export default Demo;
