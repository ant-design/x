import { useXAgent } from '@ant-design/x';
import { Button, Divider, Form, Input, Typography } from 'antd';
import React from 'react';
type OutPutType = string;
type InputType = { message: string };
const App = () => {
  const [lines, setLines] = React.useState<string[]>([]);

  const [form] = Form.useForm();

  const log = (text: string) => {
    setLines((ori) => [...ori, text]);
  };

  const [agent] = useXAgent<string, InputType, OutPutType>({
    request: ({ message }, { onUpdate, onSuccess }) => {
      let times = 0;
      const chunks: OutPutType[] = [];
      const id = setInterval(() => {
        times += 1;
        const chunk = `Thinking...(${times}/3)`;
        onUpdate(chunk);
        chunks.push(chunk);
        if (times >= 3) {
          onUpdate(`It's funny that you ask: ${message}`);
          onSuccess(chunks);
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
        onUpdate: (chunk) => {
          log(`[Agent] Update: ${chunk}`);
        },
        onSuccess: (chunks) => {
          log(`[Agent] Answer: ${chunks.join(',')}`);
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
