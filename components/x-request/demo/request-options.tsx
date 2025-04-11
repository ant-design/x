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
const API_KEY = 'your_dangerouslyApiKey';

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
    await exampleRequest.create(
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
          console.log('onUpdate', msg);
        },
      },
    );
  }

  const changeBaseData = () => {
    setRequestOptions({
      baseURL: `${BASE_URL}/${Date.now()}`,
      model: `${MODEL}/${Date.now()}`,
      dangerouslyApiKey: `${API_KEY}/${Date.now()}`,
    });
  };

  return (
    <Splitter>
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
      <Splitter.Panel style={{ marginLeft: 16 }}>
        <ThoughtChain
          items={[
            {
              title: 'Request Log',
              status: status,
              icon: status === 'pending' ? <LoadingOutlined /> : <TagsOutlined />,
              description:
                status === 'error' &&
                exampleRequest.baseURL === requestOptions.baseURL &&
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
