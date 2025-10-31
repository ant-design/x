import { UserOutlined } from '@ant-design/icons';
import { Bubble } from '@ant-design/x';
import { Button, Flex, Space } from 'antd';
import React from 'react';

const text = 'Ant Design X love you! ';

const correctionExamples = [
  'The weather is nice today.',
  'The weather is bad today.',
  'The weather is very nice today.',
  'Tomorrow the weather will be better.',
];

const App = () => {
  const [repeat, setRepeat] = React.useState(1);
  const [correctionDemo, setCorrectionDemo] = React.useState(0);

  return (
    <Flex vertical gap="large">
      <Space direction="vertical" size="small">
        <h4>Basic Typing Effect</h4>
        <Bubble
          content={text.repeat(repeat)}
          typing={{ step: 2, interval: 50 }}
          avatar={{ icon: <UserOutlined /> }}
        />
        <Bubble
          content={text.repeat(repeat)}
          typing={{ step: 2, interval: 50, suffix: <>💗</> }}
          avatar={{ icon: <UserOutlined /> }}
        />
        <div style={{ textAlign: 'right' }}>
          <Button
            onClick={() => {
              setRepeat((ori) => (ori < 5 ? ori + 1 : 1));
            }}
          >
            Repeat {repeat} Times
          </Button>
        </div>
      </Space>

      <Space direction="vertical" size="small">
        <h4>Smart Prefix Continuation</h4>
        <Bubble
          content={correctionExamples[correctionDemo]}
          typing={{ step: 2, interval: 50 }}
          avatar={{ icon: <UserOutlined /> }}
        />
        <div style={{ textAlign: 'right' }}>
          <Button
            onClick={() => {
              setCorrectionDemo((ori) => (ori + 1) % correctionExamples.length);
            }}
          >
            Switch Content ({correctionDemo + 1}/{correctionExamples.length})
          </Button>
        </div>
      </Space>
    </Flex>
  );
};

export default App;
