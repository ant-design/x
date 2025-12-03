import { SyncOutlined } from '@ant-design/icons';
import type { BubbleListProps } from '@ant-design/x';
import { Bubble, Sender } from '@ant-design/x';
import XMarkdown from '@ant-design/x-markdown';
import {
  OpenAIChatProvider,
  useXChat,
  type XModelParams,
  type XModelResponse,
  XRequest,
} from '@ant-design/x-sdk';
import { Button, Divider, Flex, Tooltip } from 'antd';
import React from 'react';

/**
 * 🔔 请替换 BASE_URL、PATH、MODEL、API_KEY 为您自己的值
 * 🔔 Please replace the BASE_URL, PATH, MODEL, API_KEY with your own values.
 */

const BASE_URL = 'https://api.x.ant.design/api/llm_siliconflow_THUDM_glm-4-9b-chat';

/**
 * 🔔 当前请求中 MODEL 是固定的，请替换为您自己的 BASE_URL 和 MODEL
 * 🔔 The MODEL is fixed in the current request, please replace it with your BASE_URL and MODEL
 */

const MODEL = 'THUDM/glm-4-9b-chat';

// 本地化钩子：根据当前语言环境返回对应的文本
// Localization hook: return corresponding text based on current language environment
const useLocale = () => {
  const isCN = typeof location !== 'undefined' ? location.pathname.endsWith('-cn') : false;
  return {
    abort: isCN ? '中止' : 'abort',
    addUserMessage: isCN ? '添加用户消息' : 'Add a user message',
    addAIMessage: isCN ? '添加AI消息' : 'Add an AI message',
    addSystemMessage: isCN ? '添加系统消息' : 'Add a system message',
    editLastMessage: isCN ? '编辑最后一条消息' : 'Edit the last message',
    placeholder: isCN
      ? '请输入内容，按下 Enter 发送消息'
      : 'Please enter content and press Enter to send message',
    waiting: isCN ? '请稍候...' : 'Please wait...',
    requestFailed: isCN ? '请求失败，请重试！' : 'Request failed, please try again!',
    requestAborted: isCN ? '请求已中止' : 'Request is aborted',
    noMessages: isCN
      ? '暂无消息，请输入问题并发送'
      : 'No messages yet, please enter a question and send',
    requesting: isCN ? '请求中' : 'Requesting',
    qaCompleted: isCN ? '问答完成' : 'Q&A completed',
    retry: isCN ? '重试' : 'Retry',
    currentStatus: isCN ? '当前状态：' : 'Current status:',
    hello: isCN ? '你好！' : 'Hello!',
    helloResponse: isCN ? '你好，我是一个聊天机器人' : 'Hello, I am a chatbot',
    newUserMessage: isCN ? '添加新的用户消息' : 'Add a new user message',
    newAIResponse: isCN ? '添加新的AI回复' : 'Add a new AI response',
    newSystemMessage: isCN ? '添加新的系统消息' : 'Add a new system message',
    editMessage: isCN ? '编辑消息' : 'Edit a message',
  };
};

// 消息角色配置：定义助手和用户消息的布局和渲染方式
// Message role configuration: define layout and rendering for assistant and user messages
const role: BubbleListProps['role'] = {
  assistant: {
    placement: 'start',
    contentRender(content: string) {
      // 双 '\n' 在markdown中会被解析为新段落，因此需要替换为单个 '\n'
      // Double '\n' in a mark will causes markdown parse as a new paragraph, so we need to replace it with a single '\n'
      const newContent = content.replace('/\n\n/g', '<br/><br/>');
      return <XMarkdown content={newContent} />;
    },
  },
  user: {
    placement: 'end',
  },
};

const App = () => {
  const [content, setContent] = React.useState('');
  // 创建OpenAI聊天提供者：配置请求参数和模型
  // Create OpenAI chat provider: configure request parameters and model
  const [provider] = React.useState(
    new OpenAIChatProvider({
      request: XRequest<XModelParams, XModelResponse>(BASE_URL, {
        manual: true,
        params: {
          model: MODEL,
          stream: true,
        },
      }),
    }),
  );
  const locale = useLocale();

  // 聊天消息管理：处理消息列表、默认消息、错误处理等
  // Chat message management: handle message list, default messages, error handling, etc.
  const { onRequest, messages, setMessages, setMessage, isRequesting, abort, onReload } = useXChat({
    provider,
    // 默认消息：初始化时显示的欢迎消息
    // Default messages: welcome messages displayed on initialization
    defaultMessages: [
      {
        id: '0',
        message: { role: 'user', content: locale.hello },
        status: 'success',
      },
      {
        id: '1',
        message: { role: 'assistant', content: locale.helloResponse },
        status: 'success',
      },
    ],
    requestFallback: (_, { error, errorInfo, messageInfo }) => {
      // 请求失败时的回退处理：区分中止错误和其他错误
      // Fallback handling for request failure: distinguish between abort error and other errors
      if (error.name === 'AbortError') {
        return {
          content: messageInfo?.message?.content || locale.requestAborted,
          role: 'assistant',
        };
      }
      return {
        content: errorInfo?.error?.message || locale.requestFailed,
        role: 'assistant',
      };
    },
    requestPlaceholder: () => {
      // 请求占位符：在等待响应时显示等待消息
      // Request placeholder: display waiting message while waiting for response
      return {
        content: locale.waiting,
        role: 'assistant',
      };
    },
  });

  // 添加用户消息：向消息列表中添加一条用户消息
  // Add user message: add a user message to the message list
  const addUserMessage = () => {
    setMessages([
      ...messages,
      {
        id: messages.length,
        message: { role: 'user', content: locale.newUserMessage },
        status: 'success',
      },
    ]);
  };

  // 添加AI消息：向消息列表中添加一条AI助手消息
  // Add AI message: add an AI assistant message to the message list
  const addAIMessage = () => {
    setMessages([
      ...messages,
      {
        id: messages.length,
        message: { role: 'assistant', content: locale.newAIResponse },
        status: 'success',
      },
    ]);
  };

  // 添加系统消息：向消息列表中添加一条系统消息
  // Add system message: add a system message to the message list
  const addSystemMessage = () => {
    setMessages([
      ...messages,
      {
        id: messages.length,
        message: { role: 'system', content: locale.newSystemMessage },
        status: 'success',
      },
    ]);
  };

  // 编辑最后一条消息：修改消息列表中最后一条消息的内容
  // Edit last message: modify the content of the last message in the message list
  const editLastMessage = () => {
    const lastMessage = messages[messages.length - 1];
    setMessage(lastMessage.id, {
      message: { role: lastMessage.message.role, content: locale.editMessage },
    });
  };

  return (
    <Flex vertical gap="middle">
      {/* 状态和控制区域：显示当前状态并提供操作按钮 */}
      {/* Status and control area: display current status and provide action buttons */}
      <Flex vertical gap="middle">
        <div>
          {locale.currentStatus}{' '}
          {isRequesting
            ? locale.requesting
            : messages.length === 0
              ? locale.noMessages
              : locale.qaCompleted}
        </div>
        <Flex align="center" gap="middle">
          {/* 中止按钮：仅在请求进行中时可用 */}
          {/* Abort button: only available when request is in progress */}
          <Button disabled={!isRequesting} onClick={abort}>
            {locale.abort}
          </Button>
          <Button onClick={addUserMessage}>{locale.addUserMessage}</Button>
          <Button onClick={addAIMessage}>{locale.addAIMessage}</Button>
          <Button onClick={addSystemMessage}>{locale.addSystemMessage}</Button>
          {/* 编辑按钮：仅在存在消息时可用 */}
          {/* Edit button: only available when messages exist */}
          <Button disabled={!messages.length} onClick={editLastMessage}>
            {locale.editLastMessage}
          </Button>
        </Flex>
      </Flex>
      <Divider />
      {/* 消息列表：显示所有聊天消息，包括默认消息 */}
      {/* Message list: display all chat messages, including default messages */}
      <Bubble.List
        role={role}
        style={{ height: 500 }}
        items={messages.map(({ id, message, status }) => ({
          key: id,
          role: message.role,
          status: status,
          loading: status === 'loading',
          content: message.content,
          // 为助手消息添加重试按钮
          // Add retry button for assistant messages
          components:
            message.role === 'assistant'
              ? {
                  footer: (
                    <Tooltip title={locale.retry}>
                      <Button
                        size="small"
                        type="text"
                        icon={<SyncOutlined />}
                        style={{ marginInlineEnd: 'auto' }}
                        onClick={() =>
                          onReload(id, {
                            userAction: 'retry',
                          })
                        }
                      />
                    </Tooltip>
                  ),
                }
              : {},
        }))}
      />
      {/* 发送器：用户输入区域，支持发送消息和中止请求 */}
      {/* Sender: user input area, supports sending messages and aborting requests */}
      <Sender
        loading={isRequesting}
        value={content}
        onCancel={() => {
          // 取消当前请求
          // Cancel current request
          abort();
        }}
        onChange={setContent}
        placeholder={locale.placeholder}
        onSubmit={(nextContent) => {
          // 发送用户消息：构建消息格式并清空输入框
          // Send user message: build message format and clear input field
          onRequest({
            messages: [
              {
                role: 'user',
                content: nextContent,
              },
            ],
          });
          setContent('');
        }}
      />
    </Flex>
  );
};

export default App;
