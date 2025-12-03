import { LoadingOutlined, TagsOutlined } from '@ant-design/icons';
import type { ThoughtChainItemType } from '@ant-design/x';
import { ThoughtChain } from '@ant-design/x';
import { AbstractXRequestClass, XRequest } from '@ant-design/x-sdk';
import { Button, Descriptions, Flex, Input, Splitter, Typography } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

const { Paragraph } = Typography;

interface ChatInput {
  query?: string;
  stream?: boolean;
}

const QUERY_URL = 'https://api.x.ant.design/api/default_chat_provider_stream';

const useLocale = () => {
  const isCN = location.pathname.endsWith('-cn');
  return {
    request: isCN ? '请求' : 'Request',
    requestAbort: isCN ? '请求中止' : 'Request Abort',
    requestLog: isCN ? '请求日志' : 'Request Log',
    status: isCN ? '状态' : 'Status',
    updateTimes: isCN ? '更新次数' : 'Update Times',
    requestStatus: (status: string) => `request ${status}`,
  };
};

const App = () => {
  const [status, setStatus] = useState<string>();
  const [thoughtChainStatus, setThoughtChainStatus] = useState<ThoughtChainItemType['status']>();
  const [lines, setLines] = useState<Record<string, string>[]>([]);
  const [questionText, setQuestionText] = useState<string>('hello, who are u?');
  const locale = useLocale();

  const requestHandlerRef = useRef<AbstractXRequestClass<ChatInput, Record<string, string>>>(null);

  useEffect(() => {
    requestHandlerRef.current = XRequest<ChatInput, Record<string, string>>(QUERY_URL, {
      params: {
        stream: true,
      },
      manual: true,
      callbacks: {
        onSuccess: () => {
          setStatus('success');
          setThoughtChainStatus('success');
        },
        onError: (error) => {
          if (error.name === 'AbortError') {
            setStatus('abort');
          }
          setThoughtChainStatus('error');
        },
        onUpdate: (msg) => {
          setLines((pre) => [...pre, msg]);
        },
      },
    });
  }, []);

  const request = () => {
    setStatus('pending');
    setLines([]);
    requestHandlerRef?.current?.run({
      query: questionText,
    });
  };

  const abort = () => {
    requestHandlerRef.current?.abort?.();
  };

  return (
    <Splitter>
      <Splitter.Panel style={{ height: 300 }}>
        <Splitter orientation="vertical">
          <Splitter.Panel style={{ margin: '0 16px' }}>
            <Flex gap="large" vertical>
              <Input
                value={questionText}
                onChange={(e) => {
                  setQuestionText(e.target.value);
                }}
              />
              <Flex gap="small">
                <Button type="primary" disabled={status === 'pending'} onClick={request}>
                  {locale.request}
                </Button>
                <Button type="primary" disabled={status !== 'pending'} onClick={abort}>
                  {locale.requestAbort}
                </Button>
              </Flex>
            </Flex>
          </Splitter.Panel>
          <Splitter.Panel style={{ margin: 16 }}>
            <Paragraph>{lines.length > 0 && JSON.stringify(lines)}</Paragraph>
          </Splitter.Panel>
        </Splitter>
      </Splitter.Panel>
      <Splitter.Panel style={{ marginLeft: 16 }}>
        <ThoughtChain
          items={[
            {
              title: locale.requestLog,
              status: thoughtChainStatus,
              icon: status === 'pending' ? <LoadingOutlined /> : <TagsOutlined />,
              description: locale.requestStatus(status || ''),
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
