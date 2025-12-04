import { CopyOutlined, RedoOutlined, UserOutlined } from '@ant-design/icons';
import { Actions, Bubble, XProvider } from '@ant-design/x';
import { Avatar, Button, Divider, Flex, Radio, Switch } from 'antd';
import React, { useState } from 'react';

const text = 'Ant Design X - Better UI toolkit for your AI Chat WebApp. '.repeat(5);

const text2 = 'Ant Design X - Build your AI Chat WebApp with an easier way. '.repeat(5);

const actionItems = [
  {
    key: 'retry',
    icon: <RedoOutlined />,
    label: 'Retry',
  },
  {
    key: 'copy',
    icon: <CopyOutlined />,
    label: 'Copy',
  },
];

const App = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState('');
  const [effect, setEffect] = useState<'fade-in' | 'typing' | 'custom-typing'>('fade-in');
  const [keepPrefix, setKeepPrefix] = useState(false);

  const loadAll = () => {
    setLoading(false);
    setData(text);
  };

  const replaceText = () => {
    setLoading(false);
    setData(text2);
  };

  return (
    <Flex vertical gap="small">
      <Flex gap="small" align="center">
        <span>非流式数据 / Non-streaming data:</span>
        <Button type="primary" onClick={loadAll}>
          load data-1
        </Button>
        <Button onClick={replaceText}>load data-2</Button>
      </Flex>
      <Flex gap="small" align="center">
        <span>动画效果 / Animation effects:</span>
        <Radio.Group value={effect} onChange={(e) => setEffect(e.target.value)}>
          <Radio value="fade-in">fade-in</Radio>
          <Radio value="typing">typing</Radio>
          <Radio value="custom-typing">typing with 💖 </Radio>
        </Radio.Group>
      </Flex>
      <Flex gap="small" align="center">
        <span>保留公共前缀 / Preserve common prefix:</span>
        <Switch value={keepPrefix} onChange={setKeepPrefix} />
      </Flex>
      <Divider />
      <Flex gap="small" align="center">
        <XProvider
          theme={{
            components: {
              Bubble:
                effect === 'custom-typing'
                  ? {
                      typingContent: '"💖"',
                    }
                  : {},
            },
          }}
        >
          <Bubble
            loading={loading}
            content={data}
            typing={{
              effect: effect === 'fade-in' ? effect : 'typing',
              interval: 50,
              step: 3,
              keepPrefix,
            }}
            header={<h5>ADX</h5>}
            footer={(content) => (
              <Actions items={actionItems} onClick={() => console.log(content)} />
            )}
            avatar={<Avatar icon={<UserOutlined />} />}
            onTyping={() => console.log('typing')}
            onTypingComplete={() => console.log('typing complete')}
          />
        </XProvider>
      </Flex>
    </Flex>
  );
};

export default App;
