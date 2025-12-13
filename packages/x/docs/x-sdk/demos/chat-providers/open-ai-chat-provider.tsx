import { Sender } from '@ant-design/x';
import {
  OpenAIChatProvider,
  useXChat,
  type XModelParams,
  type XModelResponse,
  XRequest,
} from '@ant-design/x-sdk';
import { Button, Divider, Flex, Typography } from 'antd';
import React from 'react';

const { Title } = Typography;

const useLocale = () => {
  const isCN = typeof location !== 'undefined' ? location.pathname.endsWith('-cn') : false;
  return {
    messages: isCN ? '消息数据（messages）' : 'Messages Data',
    requesting: isCN ? '是否在请求中' : 'Is Requesting',
    length: isCN ? '数据长度' : 'Data Length',
    details: isCN ? '数据详情' : 'Data Details',
    operations: isCN ? '数据操作' : 'Data Operations',
    sendRequest: isCN ? '发送请求' : 'Send Request',
    placeholder: isCN
      ? '请输入内容，按下 Enter 发送消息'
      : 'Please enter content and press Enter to send message',
    abort: isCN ? '中止' : 'Abort',
    addUserMsg: isCN ? '添加用户消息' : 'Add User Message',
    addAIMsg: isCN ? '添加AI消息' : 'Add AI Message',
    addSystemMsg: isCN ? '添加系统消息' : 'Add System Message',
    editLastMsg: isCN ? '编辑最后一条消息' : 'Edit Last Message',
    newUserMessage: isCN ? '添加新用户消息' : 'Add a new user message',
    newAIMessage: isCN ? '添加新AI回复' : 'Add a new AI response',
    editMessage: isCN ? '编辑消息' : 'Edit a message',
    requestAborted: isCN ? '请求已中止' : 'Request aborted',
    requestFailed: isCN ? '请求失败' : 'Request failed',
    waiting: isCN ? '等待中...' : 'Waiting...',
  };
};

const App = () => {
  const [content, setContent] = React.useState('');
  const locale = useLocale();
  const [provider] = React.useState(
    new OpenAIChatProvider({
      request: XRequest<XModelParams, XModelResponse>(
        'https://api.x.ant.design/api/big_model_glm-4.5-flash',
        {
          manual: true,
          params: {
            stream: true,
          },
        },
      ),
    }),
  );

  // Chat messages
  const { onRequest, messages, abort, isRequesting, setMessages, setMessage } = useXChat({
    provider,
    requestPlaceholder: () => {
      return {
        content: locale.waiting,
        role: 'assistant',
      };
    },
    requestFallback: (_, { error, errorInfo, messageInfo }) => {
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
  });

  const addUserMessage = () => {
    setMessages([
      ...messages,
      {
        id: Date.now(),
        message: { role: 'user', content: locale.newUserMessage },
        status: 'success',
      },
    ]);
  };

  const addAIMessage = () => {
    setMessages([
      ...messages,
      {
        id: Date.now(),
        message: { role: 'assistant', content: locale.newAIMessage },
        status: 'success',
      },
    ]);
  };

  const addSystemMessage = () => {
    setMessages([
      ...messages,
      {
        id: Date.now(),
        message: { role: 'system', content: locale.addSystemMsg },
        status: 'success',
      },
    ]);
  };

  const editLastMessage = () => {
    const lastMessage = messages[messages.length - 1];
    setMessage(lastMessage.id, {
      message: { role: lastMessage.message.role, content: locale.editMessage },
    });
  };

  return (
    <Flex vertical gap="middle">
      <Flex vertical gap="small">
        <Title level={4}>{locale.messages}</Title>
        <div>
          {locale.requesting}：{`${isRequesting}`}
        </div>
        <div>
          {locale.length}：{`${messages.length}`}
        </div>
        <div>{locale.details}：</div>
        <div style={{ height: 500, overflow: 'auto' }}>{JSON.stringify(messages)}</div>
      </Flex>
      <Divider />
      <Flex vertical gap="small">
        <Title level={4}>{locale.operations}</Title>
        <div>{locale.sendRequest}</div>
        <Sender
          loading={isRequesting}
          onCancel={abort}
          value={content}
          placeholder={locale.placeholder}
          onChange={setContent}
          onSubmit={(nextContent) => {
            onRequest({
              messages: [
                {
                  role: 'user',
                  content: nextContent,
                },
              ],
              frequency_penalty: 0,
              max_tokens: 1024,
              thinking: {
                type: 'disabled',
              },
            });
            setContent('');
          }}
        />
        <Flex gap="small">
          <Button disabled={!isRequesting} onClick={abort}>
            {locale.abort}
          </Button>
          <Button onClick={addUserMessage}>{locale.addUserMsg}</Button>
          <Button onClick={addAIMessage}>{locale.addAIMsg}</Button>
          <Button onClick={addSystemMessage}>{locale.addSystemMsg}</Button>
          <Button disabled={!messages.length} onClick={editLastMessage}>
            {locale.editLastMsg}
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default App;
