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

const useLocale = () => {
  const isCN = typeof location !== 'undefined' ? location.pathname.endsWith('-cn') : false;
  return {
    request: isCN ? '请求' : 'Request',
    requestLog: isCN ? '请求日志' : 'Request Log',
    status: isCN ? '状态' : 'Status',
    requestStatus: (status: string) => `request ${status}`,
  };
};

const App = () => {
  const [status, setStatus] = useState<string>('');
  const [thoughtChainStatus, setThoughtChainStatus] = useState<ThoughtChainItemType['status']>();
  const locale = useLocale();

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
          {locale.request} - {BASE_URL}
          {PATH}
        </Button>
      </Splitter.Panel>
      <Splitter.Panel style={{ marginLeft: 16 }}>
        <ThoughtChain
          items={[
            {
              title: locale.requestLog,
              status: thoughtChainStatus,
              icon: status === 'pending' ? <LoadingOutlined /> : <TagsOutlined />,
              description: locale.requestStatus(status),
              content: (
                <Descriptions column={1}>
                  <Descriptions.Item label={locale.status}>{status || '-'}</Descriptions.Item>
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
