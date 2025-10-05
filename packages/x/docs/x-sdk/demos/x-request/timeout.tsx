import { LoadingOutlined, TagsOutlined } from '@ant-design/icons';
import type { ThoughtChainItemType } from '@ant-design/x';
import { ThoughtChain } from '@ant-design/x';
import { XRequest } from '@ant-design/x-sdk';
import { Button, Descriptions, Splitter } from 'antd';
import React, { useState } from 'react';

const BASE_URL = 'https://api.example.com';
const PATH = '/chat';

async function mockFetch() {
  return new Promise<Response>((resolve) => {
    setTimeout(() => {
      console.log('Response arrived');
      resolve(
        new Response('{ "data": "Hi" }', {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      );
    }, 3000);
  });
}

const App = () => {
  const [status, setStatus] = useState<string>('');
  const [thoughtChainStatus, setThoughtChainStatus] = useState<ThoughtChainItemType['status']>();

  function request() {
    setStatus('pending');

    XRequest(BASE_URL + PATH, {
      timeout: 2000,
      callbacks: {
        onSuccess: () => {
          setStatus('success');
          setThoughtChainStatus('success');
        },
        onError: (error) => {
          if (error.message === 'TimeoutError') {
            setStatus('TimeoutError');
          }
          setThoughtChainStatus('error');
        },
      },
      fetch: mockFetch,
    });
  }

  return (
    <Splitter>
      <Splitter.Panel>
        <Button type="primary" disabled={status === 'loading'} onClick={request}>
          Request - {BASE_URL}
          {PATH}
        </Button>
      </Splitter.Panel>
      <Splitter.Panel style={{ marginLeft: 16 }}>
        <ThoughtChain
          items={[
            {
              title: 'Request Log',
              status: thoughtChainStatus,
              icon: status === 'pending' ? <LoadingOutlined /> : <TagsOutlined />,
              description: `request ${status}`,
              content: (
                <Descriptions column={1}>
                  <Descriptions.Item label="Status">{status || '-'}</Descriptions.Item>
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
