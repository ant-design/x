import { LoadingOutlined, TagsOutlined } from '@ant-design/icons';
import { ThoughtChain, useXAgent } from '@ant-design/x';
import type { ThoughtChainItem } from '@ant-design/x';
import { Button, Descriptions, Flex, Splitter, Typography } from 'antd';
import React, { useRef, useState } from 'react';

const { Paragraph } = Typography;

const BASE_URL = 'https://api.siliconflow.cn/v1/chat/completions';
const MODEL = 'deepseek-ai/DeepSeek-R1-Distill-Qwen-7B';
const API_KEY = 'Bearer sk-ravoadhrquyrkvaqsgyeufqdgphwxfheifujmaoscudjgldr';
/** 🔥🔥 Its dangerously! */
// dangerouslyApiKey: API_KEY

interface YourMessageType {
  role: string;
  content: string;
}

const App = () => {
  const [status, setStatus] = useState<string>('');
  const [thoughtChainStatus, setThoughtChainStatus] = useState<ThoughtChainItem['status']>();
  const [lines, setLines] = useState<any[]>([]);
  const [message, setMessage] = useState<string>('');

  const [agent] = useXAgent<YourMessageType>({
    baseURL: BASE_URL,
    model: MODEL,
    dangerouslyApiKey: API_KEY,
  });
  const abortController = useRef<AbortController>(null);

  const request = () => {
    setMessage('');
    setLines([]);
    setThoughtChainStatus('pending');
    setStatus('pending');
    agent.request(
      {
        messages: [{ role: 'user', content: 'hello, who are u?' }],
        stream: true,
      },
      {
        onSuccess: () => {
          setStatus('success');
          setThoughtChainStatus('success');
        },
        onError: (error) => {
          if (error.name === 'AbortError') {
            setStatus('abort');
          }
          setThoughtChainStatus('error');
        },
        onUpdate: (msg) => {
          setLines((pre) => [...pre, msg]);
          setMessage((pre) => pre + msg);
        },
        onStream: (controller) => {
          abortController.current = controller;
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
  };

  const abort = () => {
    abortController?.current?.abort?.();
  };

  return (
    <Splitter>
      <Splitter.Panel>
        <Splitter layout="vertical">
          <Splitter.Panel>
            <Flex gap="small">
              <Button type="primary" disabled={status === 'pending'} onClick={request}>
                Agent Request
              </Button>
              <Button type="primary" disabled={status !== 'pending'} onClick={abort}>
                Agent Abort
              </Button>
            </Flex>
          </Splitter.Panel>
          <Splitter.Panel>
            <Paragraph>{message}</Paragraph>
          </Splitter.Panel>
        </Splitter>
      </Splitter.Panel>
      <Splitter.Panel>
        <ThoughtChain
          style={{ marginLeft: 16 }}
          items={[
            {
              title: 'Agent Request Log',
              status: thoughtChainStatus,
              icon: status === 'pending' ? <LoadingOutlined /> : <TagsOutlined />,
              description: `request ${status}`,
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
