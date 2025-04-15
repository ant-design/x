import { LoadingOutlined, TagsOutlined } from '@ant-design/icons';
import { ThoughtChain, XRequest } from '@ant-design/x';
import { Button, Descriptions, Flex, Splitter } from 'antd';
import React, { useState } from 'react';

import type { ThoughtChainItem } from '@ant-design/x';

/**
 * 🔔 Please replace the BASE_URL, PATH, MODEL, API_KEY with your own values.
 */
const BASE_URL = 'https://api.example.com/chat';
const MODEL = 'gpt-3.5-turbo';
const API_KEY = 'Bearer sk-your-dangerouslyApiKey';

const App = () => {
  const [status, setStatus] = useState<ThoughtChainItem['status']>();
  const [lines, setLines] = useState<Record<string, string>[]>([]);
  const [requestOptions, setRequestOptions] = useState({
    baseURL: BASE_URL,
    model: MODEL,
    dangerouslyApiKey: API_KEY,
    /** 🔥🔥 Its dangerously! */
    // dangerouslyApiKey: API_KEY
  });

  const exampleRequest = XRequest(requestOptions);

  async function request() {
    setStatus('pending');
    setLines([]);
    await exampleRequest.create(
      {
        messages: [{ role: 'user', content: 'hello, who are u?' }],
        stream: true,
      },
      {
        onSuccess: () => {
          setStatus('success');
        },
        onError: (error) => {
          setLines((pre) => [...pre, { error: error?.message || 'error' }]);
          setStatus('error');
        },
        onUpdate: (msg) => {
          setLines((pre) => [...pre, msg]);
        },
      },
    );
  }

  const changeBaseData = () => {
    setRequestOptions((pre) => ({
      baseURL: pre.baseURL === BASE_URL ? 'https://xxx-api.example.com/v1' : BASE_URL,
      model: pre.model === MODEL ? 'gpt-4' : MODEL,
      dangerouslyApiKey:
        pre.dangerouslyApiKey === API_KEY ? 'Bearer sk-your-new-dangerouslyApiKey' : API_KEY,
    }));
  };

  return (
    <Splitter>
      <Splitter>
        <Splitter layout="vertical">
          <Splitter.Panel>
            <Flex gap="small">
              <Button type="primary" disabled={status === 'pending'} onClick={changeBaseData}>
                Change Request Options
              </Button>
              <Button type="primary" disabled={status === 'pending'} onClick={request}>
                Request - {requestOptions.baseURL}
              </Button>
            </Flex>
          </Splitter.Panel>
          <Splitter.Panel>
            <p>baseURL: {requestOptions.baseURL}</p>
            <p>model: {requestOptions.model}</p>
            <p>dangerouslyApiKey: {requestOptions.dangerouslyApiKey}</p>
          </Splitter.Panel>
        </Splitter>
      </Splitter>
      <Splitter.Panel style={{ marginLeft: 16 }}>
        <ThoughtChain
          items={[
            {
              title: 'Request Log',
              status: status,
              icon: status === 'pending' ? <LoadingOutlined /> : <TagsOutlined />,
              description:
                status === 'error' &&
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
