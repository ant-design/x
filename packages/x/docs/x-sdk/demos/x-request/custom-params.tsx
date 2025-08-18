import { LoadingOutlined, TagsOutlined } from '@ant-design/icons';
import type { ThoughtChainItem } from '@ant-design/x';
import { ThoughtChain } from '@ant-design/x';
import { XRequest } from '@ant-design/x-sdk';
import { Button, Descriptions, Splitter } from 'antd';
import React from 'react';

/**
 * 🔔 Please replace the BASE_URL, PATH, with your own values.
 */
const BASE_URL = 'https://api.example.com';
const PATH = '/chat';

const App = () => {
  const [status, setStatus] = React.useState<ThoughtChainItem['status']>();
  const [lines, setLines] = React.useState<Record<string, string>[]>([]);

  function request() {
    setStatus('loading');

    XRequest(BASE_URL + PATH, {
      params: {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'hello, who are u?' }],
        stream: true,
        agentId: 111,
      },
      callbacks: {
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
              status: status,
              icon: status === 'loading' ? <LoadingOutlined /> : <TagsOutlined />,
              description:
                status === 'error' &&
                'Please replace the BASE_URL, PATH and parameters, with your own values.',
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
