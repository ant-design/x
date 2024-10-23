import { LoadingOutlined, TagsOutlined } from '@ant-design/icons';
import { ThoughtChain, XRequest } from '@ant-design/x';
import { Button, Descriptions, Splitter } from 'antd';
import React from 'react';

import type { ThoughtChainItem } from '@ant-design/x';

/**
 * 🔔 Please replace the BASE_URL, PATH, MODEL, API_KEY with your own values.
 */
const BASE_URL = 'https://api.example.com';
const PATH = '/chat';
const MODEL = 'gpt-3.5-turbo';
// const API_KEY = '';

const exampleRequest = XRequest({
  baseURL: BASE_URL + PATH,
  model: MODEL,

  /** 🔥🔥 Its dangerously! */
  // dangerouslyApiKey: API_KEY
});

const App = () => {
  const [status, setStatus] = React.useState<ThoughtChainItem['status']>();
  const [lines, setLines] = React.useState<any[]>([]);

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

  return (
    <Splitter>
      <Splitter.Panel>
        <Button type="primary" disabled={status === 'pending'} onClick={request}>
          Request - {BASE_URL}
          {PATH}
        </Button>
      </Splitter.Panel>
      <Splitter.Panel>
        <ThoughtChain
          style={{ marginLeft: 16 }}
          items={[
            {
              title: 'Request Log',
              status: status,
              icon: status === 'pending' ? <LoadingOutlined /> : <TagsOutlined />,
              description:
                status === 'error' &&
                exampleRequest.baseURL === BASE_URL + PATH &&
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
