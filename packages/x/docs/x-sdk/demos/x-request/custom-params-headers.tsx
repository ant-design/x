import { LoadingOutlined, TagsOutlined } from '@ant-design/icons';
import type { ThoughtChainItemType } from '@ant-design/x';
import { ThoughtChain } from '@ant-design/x';
import { XRequest } from '@ant-design/x-sdk';
import { Button, Descriptions, Splitter } from 'antd';
import React from 'react';

const QUERY_URL = 'https://api.x.ant.design/api/default_chat_provider_stream';

const useLocale = () => {
  const isCN = typeof location !== 'undefined' ? location.pathname.endsWith('-cn') : false;
  return {
    request: isCN ? '请求' : 'Request',
    requestLog: isCN ? '请求日志' : 'Request Log',
    status: isCN ? '状态' : 'Status',
    updateTimes: isCN ? '更新次数' : 'Update Times',
    replaceNotice: isCN
      ? '请替换 BASE_URL、PATH 和参数为您自己的值'
      : 'Please replace the BASE_URL, PATH and parameters, with your own values.',
  };
};

const App = () => {
  const [status, setStatus] = React.useState<ThoughtChainItemType['status']>();
  const [lines, setLines] = React.useState<Record<string, string>[]>([]);
  const locale = useLocale();

  const request = () => {
    setStatus('loading');

    XRequest(QUERY_URL, {
      params: {
        query: 'gpt-3.5-turbo',
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'hello, who are u?' }],
        stream: true,
        agentId: 111,
      },
      headers: {
        'X-header': 'ADX',
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
  };

  return (
    <Splitter>
      <Splitter.Panel>
        <Button type="primary" disabled={status === 'loading'} onClick={request}>
          {locale.request} - {QUERY_URL}
        </Button>
      </Splitter.Panel>
      <Splitter.Panel style={{ marginLeft: 16 }}>
        <ThoughtChain
          items={[
            {
              title: locale.requestLog,
              status: status,
              icon: status === 'loading' ? <LoadingOutlined /> : <TagsOutlined />,
              description: status === 'error' && locale.replaceNotice,
              content: (
                <Descriptions column={1}>
                  <Descriptions.Item label={locale.status}>{status || '-'}</Descriptions.Item>
                  <Descriptions.Item label={locale.updateTimes}>{lines.length}</Descriptions.Item>
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
