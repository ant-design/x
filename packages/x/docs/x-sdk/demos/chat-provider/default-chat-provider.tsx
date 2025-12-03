import { Sender } from '@ant-design/x';
import { DefaultChatProvider, useXChat, XRequest } from '@ant-design/x-sdk';
import { Button, Divider, Flex, Typography } from 'antd';
import React from 'react';
import ReactJson from 'react-json-view';

const { Title } = Typography;

const useLocale = () => {
  const isCN = location.pathname.endsWith('-cn');
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
    waiting: isCN ? '等待中...' : 'Waiting...',
    mockFailed: isCN ? '模拟失败' : 'Mock failed',
  };
};
interface ChatInput {
  query: string;
  stream?: boolean;
}

interface ChatOutput {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
  }>;
}
interface SystemMessage {
  role: 'system';
  content: string;
}

const App = () => {
  const [content, setContent] = React.useState('');
  const locale = useLocale();
  const [provider] = React.useState(
    new DefaultChatProvider<ChatOutput | ChatInput | SystemMessage, ChatInput, ChatOutput>({
      request: XRequest('https://api.x.ant.design/api/default_chat_provider_stream', {
        manual: true,
      }),
    }),
  );

  // Chat messages
  const { onRequest, messages, abort, isRequesting, setMessages, setMessage } = useXChat({
    provider,
    requestPlaceholder: { choices: [{ message: { content: locale.waiting, role: 'assistant' } }] },
    requestFallback: { choices: [{ message: { content: locale.mockFailed, role: 'assistant' } }] },
  });

  const addUserMessage = () => {
    setMessages([
      ...messages,
      {
        id: Date.now(),
        message: { query: locale.addUserMsg },
        status: 'local',
      },
    ]);
  };

  const addAIMessage = () => {
    setMessages([
      ...messages,
      {
        id: Date.now(),
        message: { choices: [{ message: { content: locale.addAIMsg, role: 'assistant' } }] },
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
    const isSystem = (lastMessage.message as SystemMessage).role === 'system';
    const isUser = !!(lastMessage.message as ChatInput).query;
    const isAI = !!(lastMessage.message as ChatOutput).choices;
    if (isSystem) {
      setMessage(lastMessage.id, {
        message: { role: 'system', content: locale.editLastMsg },
      });
    }
    if (isUser) {
      setMessage(lastMessage.id, {
        message: { query: locale.editLastMsg },
      });
    }

    if (isAI) {
      setMessage(lastMessage.id, {
        message: { choices: [{ message: { content: locale.editLastMsg, role: 'assistant' } }] },
      });
    }
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
        <div style={{ height: 500, overflow: 'auto' }}>
          <ReactJson src={messages} />
        </div>
      </Flex>
      <Divider />
      <Flex vertical gap="small">
        <Title level={4}>{locale.operations}</Title>
        <div>{locale.sendRequest}</div>
        <Sender
          loading={isRequesting}
          value={content}
          onCancel={abort}
          placeholder={locale.placeholder}
          onChange={setContent}
          onSubmit={(nextContent) => {
            onRequest({
              stream: false,
              query: nextContent,
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
