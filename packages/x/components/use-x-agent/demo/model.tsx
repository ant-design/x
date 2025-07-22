import { LoadingOutlined, TagsOutlined } from '@ant-design/icons';
import type { ThoughtChainItem } from '@ant-design/x';
import { ThoughtChain, useXAgent } from '@ant-design/x';
import { Button, Descriptions, Flex, Input, Splitter, Typography } from 'antd';
import React, { useRef, useState } from 'react';

const { Paragraph } = Typography;

/**
 * 🔔 Please replace the BASE_URL, PATH, MODEL, API_KEY with your own values.
 */

const BASE_URL = 'https://api.x.ant.design/api/llm_siliconflow_qwen3-8b';

/**
 * 🔔 The MODEL is fixed in the current request, please replace it with your BASE_UR and MODEL
 */

const MODEL = 'Qwen3-8B';

/**
 * 🔔 the API_KEY is a placeholder indicator interface that has a built-in real API_KEY
 */

const API_KEY = 'Bearer sk-xxxxxxxxxxxxxxxxxxxx';

interface YourMessageType {
  role: string;
  content: string;
}

const App = () => {
  const [status, setStatus] = useState<string>('');
  const [thoughtChainStatus, setThoughtChainStatus] = useState<ThoughtChainItem['status']>();
  const [lines, setLines] = useState<any[]>([]);
  const abortController = useRef<AbortController>(null);
  const [questionText, setQuestionText] = useState<string>('hello, who are u?');

  const [agent] = useXAgent<YourMessageType>({
    baseURL: BASE_URL,
    model: MODEL,
    dangerouslyApiKey: API_KEY,
    /** 🔥🔥 Its dangerously! */
  });

  const request = () => {
    setLines([]);
    setThoughtChainStatus('loading');
    setStatus('pending');
    agent.request(
      {
        messages: [{ role: 'user', content: questionText }],
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
        },
        onStream: (controller) => {
          abortController.current = controller;
        },
      },
      new TransformStream<string, any>({
        transform(chunk, controller) {
          const DEFAULT_KV_SEPARATOR = 'data: ';
          const DEFAULT_STREAM_SEPARATOR = '\n\n';
          const parts = chunk.split(DEFAULT_STREAM_SEPARATOR);

          parts.forEach((part) => {
            const separatorIndex = part.indexOf(DEFAULT_KV_SEPARATOR);
            const value = part.slice(separatorIndex + DEFAULT_KV_SEPARATOR.length);
            try {
              const modalMessage = JSON.parse(value || '{}');
              const content = modalMessage?.choices?.[0]?.delta?.content || '';
              controller.enqueue(content);
            } catch (_error) {
              controller.enqueue('');
            }
          });
        },
      }),
    );
  };

  const abort = () => {
    abortController?.current?.abort?.();
  };

  return (
    <Splitter>
      <Splitter.Panel style={{ height: 300 }}>
        <Splitter orientation="vertical">
          <Splitter.Panel style={{ margin: '0 16px' }}>
            <Flex gap="large" vertical>
              <Input
                value={questionText}
                onChange={(e) => {
                  setQuestionText(e.target.value);
                }}
              />
              <Flex gap="small">
                <Button type="primary" disabled={status === 'pending'} onClick={request}>
                  Agent Request
                </Button>
                <Button type="primary" disabled={status !== 'pending'} onClick={abort}>
                  Agent Abort
                </Button>
              </Flex>
            </Flex>
          </Splitter.Panel>
          <Splitter.Panel style={{ margin: 16 }}>
            <Paragraph>{lines.length > 0 && lines.join('')}</Paragraph>
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
