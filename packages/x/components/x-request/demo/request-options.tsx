import { LoadingOutlined, TagsOutlined } from '@ant-design/icons';
import type { ThoughtChainItem } from '@ant-design/x';
import { ThoughtChain, XRequest } from '@ant-design/x';
import { Button, Descriptions, Flex, Splitter } from 'antd';
import React, { useState } from 'react';

/**
 * 🔔 Please replace the BASE_URL, PATH, MODEL, API_KEY with your own values.
 */
const BASE_URL = 'https://api.example.com/chat/v1';
const MODEL = 'gpt-3.5-turbo';
const API_KEY = 'Bearer sk-your-dangerouslyApiKey';

const App = () => {
  const [status, setStatus] = useState<ThoughtChainItem['status']>();
  const [lines, setLines] = useState<Record<string, string>[]>([]);
  const [error, setError] = useState<Error>();
  const [requestOptions, setRequestOptions] = useState({
    baseURL: BASE_URL,
    model: MODEL,
    dangerouslyApiKey: API_KEY,
    /** 🔥🔥 Its dangerously! */
    // dangerouslyApiKey: API_KEY
  });

  const exampleRequest = XRequest(requestOptions);

  async function request() {
    setStatus('loading');
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
          setError(error);
          console.log(error.message, 11);
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
      baseURL: BASE_URL,
      model: pre.model === MODEL ? 'gpt-4' : MODEL,
      dangerouslyApiKey:
        pre.dangerouslyApiKey === API_KEY ? 'Bearer sk-your-new-dangerouslyApiKey' : API_KEY,
    }));
  };

  return (
    <Splitter>
      <Splitter>
        <Splitter orientation="vertical">
          <Splitter.Panel>
            <Flex gap="small">
              <Button type="primary" disabled={status === 'loading'} onClick={changeBaseData}>
                Change Request Options
              </Button>
              <Button type="primary" disabled={status === 'loading'} onClick={request}>
                Agent Request
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
              icon: status === 'loading' ? <LoadingOutlined /> : <TagsOutlined />,
              description: status === 'error' && (error?.message || 'request error'),
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
