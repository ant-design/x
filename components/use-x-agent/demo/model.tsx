import { LoadingOutlined, TagsOutlined } from '@ant-design/icons';
import { ThoughtChain, useXAgent } from '@ant-design/x';
import type { ThoughtChainItem } from '@ant-design/x';
import { Button, Descriptions, Splitter } from 'antd';
import React from 'react';

const BASE_URL = 'https://api.siliconflow.cn/v1/chat/completions';
const MODEL = 'deepseek-ai/DeepSeek-R1-Distill-Qwen-7B';
const API_KEY = 'Bearer sk-ravoadhrquyrkvaqsgyeufqdgphwxfheifujmaoscudjgldr';

interface YourMessageType {
  role: string;
  content: string;
}

const App = () => {
  const [status, setStatus] = React.useState<ThoughtChainItem['status']>();
  const [lines, setLines] = React.useState<any[]>([]);
  const [message, setMessage] = React.useState<string>('');

  const [agent] = useXAgent<YourMessageType>({
    baseURL: BASE_URL,
    model: MODEL,
    dangerouslyApiKey: API_KEY,
  });

  async function request() {
    setMessage('');
    setLines([]);
    setStatus('pending');
    agent.request(
      {
        messages: [{ role: 'user', content: 'hello, who are u?' }],
        stream: true,
      },
      {
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
          setMessage((pre) => pre + msg);
        },
      },
      new TransformStream<string, any>({
        transform(chunk, controller) {
          const DEFAULT_KV_SEPARATOR = 'data: ';
          const separatorIndex = chunk.indexOf(DEFAULT_KV_SEPARATOR);
          const value = chunk.slice(separatorIndex + DEFAULT_KV_SEPARATOR.length);
          try {
            const modalMessage = JSON.parse(value);
            const content =
              modalMessage?.choices?.[0].delta?.reasoning_content === null
                ? ''
                : modalMessage?.choices?.[0].delta?.reasoning_content;
            controller.enqueue(content);
          } catch (error) {}
        },
      }),
    );
  }
  return (
    <Splitter>
      <Splitter.Panel>
        <Button type="primary" disabled={status === 'pending'} onClick={request}>
          Agent Request
        </Button>
        <p>{message}</p>
      </Splitter.Panel>

      <Splitter.Panel>
        <ThoughtChain
          style={{ marginLeft: 16 }}
          items={[
            {
              title: 'Agent Request Log',
              status: status,
              icon: status === 'pending' ? <LoadingOutlined /> : <TagsOutlined />,
              description:
                status === 'error' &&
                agent.config.baseURL === BASE_URL &&
                'Please replace the BASE_URL, PATH, MODEL, API_KEY with your own values.',
              content: (
                <Descriptions column={1}>
                  <Descriptions.Item label="Status">{status || '-'}</Descriptions.Item>
                  <Descriptions.Item label="Update Times">{lines.length}</Descriptions.Item>
                </Descriptions>
              ),
            },
          ]}
        />
      </Splitter.Panel>
    </Splitter>
  );
};

export default App;
