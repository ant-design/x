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
      ? '请替换 BASE_URL、PATH 为您自己的值'
      : 'Please replace the BASE_URL, PATH, with your own values.',
    sendRequest: isCN
      ? '发送请求：使用XRequest进行API调用'
      : 'Send request: use XRequest for API call',
  };
};

const App = () => {
  const [status, setStatus] = React.useState<ThoughtChainItemType['status']>();
  const [lines, setLines] = React.useState<Record<string, string>[]>([]);
  const locale = useLocale();

  // 发送请求：使用XRequest进行API调用
  const request = () => {
    setStatus('loading');
    XRequest(QUERY_URL, {
      params: {
        query: 'X',
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
