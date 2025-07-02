import { LoadingOutlined, TagsOutlined } from '@ant-design/icons';
import { ThoughtChain, XRequest } from '@ant-design/x';
import { Button, Descriptions, Flex, Input, Splitter, Typography } from 'antd';
import React, { useRef, useState } from 'react';

import type { ThoughtChainItem } from '@ant-design/x';

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

const exampleRequest = XRequest({
  baseURL: BASE_URL,
  model: MODEL,
  dangerouslyApiKey: API_KEY,
  /** 🔥🔥 Its dangerously! */
});

const App = () => {
  const [status, setStatus] = useState<string>();
  const [thoughtChainStatus, setThoughtChainStatus] = useState<ThoughtChainItem['status']>();
  const [lines, setLines] = useState<Record<string, string>[]>([]);
  const [questionText, setQuestionText] = useState<string>('hello, who are u?');
  const abortController = useRef<AbortController>(null);

  const request = async () => {
    setStatus('loading');
    setLines([]);
    await exampleRequest.create(
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
    );
  };

  const abort = () => {
    abortController?.current?.abort?.();
  };

  return (
    <Splitter>
      <Splitter.Panel style={{ height: 300 }}>
        <Splitter layout="vertical">
          <Splitter.Panel style={{ margin: '0 16px' }}>
            <Flex gap="large" vertical>
              <Input
                value={questionText}
                onChange={(e) => {
                  setQuestionText(e.target.value);
                }}
              />
              <Flex gap="small">
                <Button type="primary" disabled={status === 'loading'} onClick={request}>
                  Request
                </Button>
                <Button type="primary" disabled={status !== 'loading'} onClick={abort}>
                  Request Abort
                </Button>
              </Flex>
            </Flex>
          </Splitter.Panel>
          <Splitter.Panel style={{ margin: 16 }}>
            <Paragraph>{lines.length > 0 && JSON.stringify(lines)}</Paragraph>
          </Splitter.Panel>
        </Splitter>
      </Splitter.Panel>
      <Splitter.Panel style={{ marginLeft: 16 }}>
        <ThoughtChain
          items={[
            {
              title: 'Request Log',
              status: thoughtChainStatus,
              icon: status === 'loading' ? <LoadingOutlined /> : <TagsOutlined />,
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
