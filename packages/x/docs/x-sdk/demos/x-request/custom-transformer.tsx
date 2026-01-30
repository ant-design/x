import { TagsOutlined } from '@ant-design/icons';
import type { ThoughtChainItemType } from '@ant-design/x';
import { ThoughtChain } from '@ant-design/x';
import { XRequest } from '@ant-design/x-sdk';
import { Button, Splitter } from 'antd';
import React from 'react';

const BASE_URL = 'https://api.example.com';
const PATH = '/chat';

const ND_JSON_SEPARATOR = '\n';

async function mockFetch() {
  const ndJsonData = `{data:{"id":"0","choices":[{"index":0,"delta":{"content":"Hello","role":"assistant"}}],"created":1733129200,"model":"gpt-4o"}}
{data:{"id":"1","choices":[{"index":1,"delta":{"content":"world!","role":"assistant"}}],"created":1733129300,"model":"gpt-4o"}}
{data:{"id":"2","choices":[{"index":2,"delta":{"content":"I","role":"assistant"}}],"created":1733129400,"model":"gpt-4o"}}
{data:{"id":"3","choices":[{"index":3,"delta":{"content":"am","role":"assistant"}}],"created":1733129500,"model":"gpt-4o"}}
{data:{"id":"4","choices":[{"index":4,"delta":{"content":"Ant Design X!","role":"assistant"}}],"created":1733129600,"model":"gpt-4o"}}`;

  const chunks = ndJsonData.split(ND_JSON_SEPARATOR);

  const response = new Response(
    new ReadableStream({
      async start(controller) {
        for (const chunk of chunks) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          controller.enqueue(new TextEncoder().encode(chunk));
        }
        controller.close();
      },
    }),
    {
      headers: {
        'Content-Type': 'application/x-ndjson',
      },
    },
  );

  return response;
}

const useLocale = () => {
  const isCN = typeof location !== 'undefined' ? location.pathname.endsWith('-cn') : false;
  return {
    request: isCN ? '请求' : 'Request',
    mockCustomProtocolLog: isCN ? '模拟自定义协议 - 日志' : 'Mock Custom Protocol - Log',
    sendRequest: isCN
      ? '发送请求：使用自定义转换器和模拟数据'
      : 'Send request: use custom transformer and mock data',
    customStreamTransformer: isCN ? '自定义流转换器' : 'Custom stream transformer',
  };
};

const App = () => {
  const [status, setStatus] = React.useState<ThoughtChainItemType['status']>();
  const [lines, setLines] = React.useState<string[]>([]);
  const locale = useLocale();

  const request = () => {
    setStatus('loading');

    XRequest(BASE_URL + PATH, {
      params: {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'hello, who are u?' }],
        stream: true,
        agentId: 111,
      },
      callbacks: {
        onSuccess: (messages) => {
          setStatus('success');
          console.log('onSuccess', messages);
        },
        onError: (error) => {
          setStatus('error');
          console.error('onError', error);
        },
        onUpdate: (msg) => {
          setLines((pre) => [...pre, msg]);
          console.log('onUpdate', msg);
        },
      },
      // 自定义流转换器 / Custom stream transformer
      // ReadableStream 只能被一个 reader 锁定，需要注意 Provider 或 XRequest 实例不要被持久化，导致流对象被复用，重复使用会有锁定报错。
      // A ReadableStream can only be locked by one reader. Note that Provider or XRequest instances should not be persisted to avoid stream object reuse, as repeated use will cause locking errors.
      transformStream: () =>
        new TransformStream({
          transform(chunk, controller) {
            // 你的自定义处理逻辑
            // Your custom processing logic
            controller.enqueue(chunk);
          },
        }),
      fetch: mockFetch,
    });
  };

  return (
    <Splitter>
      <Splitter.Panel>
        <Button type="primary" disabled={status === 'loading'} onClick={request}>
          {locale.request} - {BASE_URL}
          {PATH}
        </Button>
      </Splitter.Panel>
      <Splitter.Panel style={{ marginLeft: 16 }}>
        <ThoughtChain
          items={[
            {
              title: locale.mockCustomProtocolLog,
              status: status,
              icon: <TagsOutlined />,
              content: (
                <pre style={{ overflow: 'scroll' }}>
                  <code>{lines.join(ND_JSON_SEPARATOR)}</code>
                </pre>
              ),
            },
          ]}
        />
      </Splitter.Panel>
    </Splitter>
  );
};

export default App;
