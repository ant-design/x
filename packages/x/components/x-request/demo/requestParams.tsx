import { LoadingOutlined, TagsOutlined } from '@ant-design/icons';
import type { ThoughtChainItem } from '@ant-design/x';
import { ThoughtChain, XRequest } from '@ant-design/x';
import { Button, Descriptions, Splitter } from 'antd';
import React from 'react';

const BASE_URL = 'https://api.example.com/agent';

const exampleRequest = XRequest({
  baseURL: BASE_URL,
});

interface RequestParams {
  agentId: number;
  query: string;
}

const App = () => {
  const [status, setStatus] = React.useState<ThoughtChainItem['status']>();
  const [lines, setLines] = React.useState<Record<string, string>[]>([]);

  async function request() {
    setStatus('loading');

    await exampleRequest.create<RequestParams>(
      {
        query: 'Search for the latest technology news',
        agentId: 111,
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
        <Button type="primary" disabled={status === 'loading'} onClick={request}>
          Request - {BASE_URL}
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
                exampleRequest.baseURL === BASE_URL &&
                'Please replace the BASE_URL, RequestParams with your own values.',
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
