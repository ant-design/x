import { useXAgent } from '@ant-design/x';
import { Button, Divider, Form, Input, Typography } from 'antd';
import React from 'react';

const App = () => {
  const [lines, setLines] = React.useState<string[]>([]);

  const [form] = Form.useForm();

  const log = (text: string) => {
    setLines((ori) => [...ori, text]);
  };

  const [agent] = useXAgent({
    request: ({ message }, { onUpdate, onSuccess }) => {
      let times = 0;

      const id = setInterval(() => {
        times += 1;
        onUpdate(`Thinking...(${times}/3)`);

        if (times >= 3) {
          onSuccess(`It's funny that you ask: ${message}`);
          clearInterval(id);
        }
      }, 500);
    },
  });

  const onFinish = ({ question }: { question: string }) => {
    log(`[You] Ask: ${question}`);
    agent.request(
      { message: question },
      {
        onUpdate: (message) => {
          log(`[Agent] Update: ${message}`);
        },
        onSuccess: (message) => {
          log(`[Agent] Answer: ${message}`);
          form.setFieldsValue({ question: '' });
        },
        // Current demo not use error
        onError: () => {},
      },
    );
  };

  return (
    <>
      <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
        <Form.Item label="Question" name="question">
          <Input />
        </Form.Item>
        <Button htmlType="submit" type="primary" loading={agent.isRequesting()}>
          submit
        </Button>
      </Form>

      <Divider />

      <Typography>
        <ul>
          {lines.map((line, index) => (
            <li key={index}>{line}</li>
          ))}
        </ul>
      </Typography>
    </>
  );
};

export default App;
