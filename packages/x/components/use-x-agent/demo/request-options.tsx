import { LoadingOutlined, TagsOutlined } from '@ant-design/icons';
import type { ThoughtChainItem } from '@ant-design/x';
import { ThoughtChain, useXAgent } from '@ant-design/x';
import { Button, Descriptions, Flex, Splitter } from 'antd';
import React, { useState } from 'react';

/**
 * 🔔 Please replace the BASE_URL, PATH, MODEL, API_KEY with your own values.
 */
const BASE_URL = 'https://api.example.com/chat/v1';
const MODEL = 'gpt-3.5-turbo';
const API_KEY = 'Bearer sk-your-dangerouslyApiKey';
/** 🔥🔥 Its dangerously! */
// const API_KEY = '';

interface YourMessageType {
  role: string;
  content: string;
}

const App = () => {
  const [status, setStatus] = React.useState<ThoughtChainItem['status']>();
  const [lines, setLines] = React.useState<any[]>([]);
  const [error, setError] = useState<Error>();
  const [requestOptions, setRequestOptions] = useState({
    baseURL: BASE_URL,
    model: MODEL,
    dangerouslyApiKey: API_KEY,
    /** 🔥🔥 Its dangerously! */
    // dangerouslyApiKey: API_KEY
  });

  const [agent] = useXAgent<YourMessageType>(requestOptions);

  const changeBaseData = () => {
    setRequestOptions((pre) => ({
      baseURL: pre.baseURL === BASE_URL ? 'https://api.example.com/chat/v2' : BASE_URL,
      model: pre.model === MODEL ? 'gpt-4' : MODEL,
      dangerouslyApiKey:
        pre.dangerouslyApiKey === API_KEY ? 'Bearer sk-your-new-dangerouslyApiKey' : API_KEY,
    }));
  };

  async function request() {
    setStatus('loading');
    agent.request(
      {
        messages: [{ role: 'user', content: 'hello, who are u?' }],
        stream: true,
      },
      {
        onSuccess: () => {
          setStatus('success');
        },
        onError: (error) => {
          setStatus('error');
          setError(error);
        },
        onUpdate: (msg) => {
          setLines((pre) => [...pre, msg]);
        },
      },
    );
  }

  return (
    <Splitter>
      <Splitter>
        <Splitter layout="vertical">
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
      <Splitter.Panel>
        <ThoughtChain
          style={{ marginLeft: 16 }}
          items={[
            {
              title: 'Agent Request Log',
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
