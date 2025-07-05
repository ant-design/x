import { LoadingOutlined, TagsOutlined } from '@ant-design/icons';
import type { ThoughtChainItem } from '@ant-design/x';
import { ThoughtChain, useXAgent } from '@ant-design/x';
import { Button, Descriptions, Splitter } from 'antd';
import React from 'react';

const BASE_URL = 'https://api.example.com/agent';

interface YourMessageType {
  role: string;
  content: string;
}

const App = () => {
  const [status, setStatus] = React.useState<ThoughtChainItem['status']>();
  const [lines, setLines] = React.useState<any[]>([]);

  const [agent] = useXAgent<YourMessageType>({
    baseURL: BASE_URL,
  });

  async function request() {
    setStatus('loading');

    agent.request(
      {
        agentId: 1234,
        query: 'Search for the latest technology news',
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
        <Button type="primary" disabled={status === 'loading'} onClick={request}>
          Agent Request
        </Button>
      </Splitter.Panel>
      <Splitter.Panel>
        <ThoughtChain
          style={{ marginLeft: 16 }}
          items={[
            {
              title: 'Agent Request Log',
              status: status,
              icon: status === 'loading' ? <LoadingOutlined /> : <TagsOutlined />,
              description:
                status === 'error' &&
                agent.config.baseURL === BASE_URL &&
                'Please replace the BASE_URL,RequestParams with your own values.',
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
