import { UserOutlined } from '@ant-design/icons';
import { Bubble, BubbleProps } from '@ant-design/x';
import { Avatar, Button, Divider, Flex, Switch, Typography } from 'antd';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const text = 'Ant Design X - Better UI toolkit for your AI Chat WebApp. '.repeat(5);

function useStreamContent(
  content: string,
  { step, interval }: { step: number; interval: number } = { step: 3, interval: 50 },
) {
  const [streamContent, _setStreamContent] = useState('');
  const streamRef = useRef('');
  const done = useRef(true);
  const timer = useRef(-1);
  const _step = useRef(step);
  _step.current = step;
  const _interval = useRef(interval);
  _interval.current = interval;

  const setStreamContent = useCallback((next: string) => {
    _setStreamContent(next);
    streamRef.current = next;
  }, []);

  useEffect(() => {
    if (content === streamRef.current) return;
    if (!content && streamRef.current) {
      _setStreamContent('');
      done.current = true;
      clearInterval(timer.current);
    } else if (!streamRef.current && content) {
      clearInterval(timer.current);
      startStream(content);
    } else if (content.indexOf(streamRef.current) !== 0) {
      // 非起始子集认为是全新内容
      clearInterval(timer.current);
      startStream(content);
    }
  }, [content]);

  const startStream = (text: string) => {
    done.current = false;
    streamRef.current = '';
    timer.current = setInterval(() => {
      const len = streamRef.current.length + _step.current;
      if (len <= text.length - 1) {
        setStreamContent(text.slice(0, len));
      } else {
        setStreamContent(text);
        done.current = true;
        clearInterval(timer.current);
      }
    }, _interval.current) as any;
  };

  return [streamContent, done.current];
}

const typingConfig = {
  effect: 'typing',
  step: 5,
  interval: 50,
  keepPrefix: true,
} as BubbleProps['typing'];

const App = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState('');
  const [streamConfig, setStreamConfig] = useState({ step: 2, interval: 50 });
  const [streamContent, isDone] = useStreamContent(data, streamConfig);
  const [typing, setTyping] = useState<boolean>(false);
  const [disableStreaming, setDisableStreaming] = useState(false);
  const [count, setCount] = useState(0);
  const loadStream = (step: number, interval: number) => {
    setLoading(false);
    setCount(0);
    setData(`${(Math.random() * 10).toFixed(0)} - ${text}`);
    setStreamConfig({ step, interval });
  };

  const props = useMemo(
    () => ({
      components: {
        header: <h5>ADX</h5>,
        avatar: <Avatar icon={<UserOutlined />} />,
      },
      // 动画函数的更新会使得动画重新触发，应该保证动画函数稳定。
      onTyping: () => console.log('typing'),
      onTypingComplete: () => {
        setCount((c) => c + 1);
        console.log('typing complete');
      },
    }),
    [],
  );

  return (
    <Flex vertical gap="small">
      <Flex gap="small" align="center">
        <span>流式数据 / steaming data:</span>
        <Button type="primary" onClick={() => loadStream(2, 100)}>
          load slowly
        </Button>
        <Button onClick={() => loadStream(10, 50)}>load quickly</Button>
        <Button type="link" onClick={() => setData('')}>
          clear
        </Button>
      </Flex>
      <Flex gap="small" align="center">
        <span>强制关闭流式标志 / Force close the streaming flag: </span>
        <Switch value={disableStreaming} onChange={setDisableStreaming} />
      </Flex>
      <Flex gap="small" align="center">
        <span>启用动画 / Enable animation:</span>
        <Switch value={typing} onChange={setTyping} />
      </Flex>
      <Flex gap="small" align="center">
        <span>
          onTypingComplete 触发次数 / trigger times:{' '}
          <Typography.Text type="danger">{count}</Typography.Text>
        </span>
      </Flex>
      <Divider />
      <Flex gap="small" align="center">
        <Bubble
          loading={loading}
          content={streamContent}
          streaming={disableStreaming ? false : !isDone}
          typing={typing ? typingConfig : false}
          {...props}
        />
      </Flex>
    </Flex>
  );
};

export default App;
