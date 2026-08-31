import { Sender, type SenderProps } from '@ant-design/x';
import { Button, Flex, GetRef, message } from 'antd';
import React, { useRef, useState } from 'react';

const slotConfig: SenderProps['slotConfig'] = [
  { type: 'text', value: 'Translate "' },
  {
    type: 'content',
    key: 'text',
    props: { defaultValue: 'Hello World', placeholder: 'Enter text' },
    formatResult: (value: any) => `[${value}]`,
  },
  { type: 'text', value: '" from ' },
  {
    type: 'select',
    key: 'sourceLang',
    props: {
      defaultValue: 'English',
      options: ['English', 'Chinese', 'Japanese'],
      placeholder: 'Select language',
    },
    formatResult: (value: any) => `{${value}}`,
  },
  { type: 'text', value: ' to ' },
  {
    type: 'select',
    key: 'targetLang',
    props: {
      defaultValue: 'Chinese',
      options: ['English', 'Chinese', 'Japanese'],
      placeholder: 'Select language',
    },
    formatResult: (value: any) => `{${value}}`,
  },
  { type: 'text', value: '.' },
];

const App: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const senderRef = useRef<GetRef<typeof Sender>>(null);
  const [value, setValue] = useState<string>('');

  return (
    <Flex vertical gap={16}>
      {contextHolder}
      <Flex wrap gap={8}>
        <Button
          onClick={() => {
            const val = senderRef.current?.getValue?.();
            setValue(val?.value ?? '');
          }}
        >
          Get Value
        </Button>
      </Flex>
      <Sender
        autoSize={{ minRows: 2, maxRows: 4 }}
        placeholder="Enter to send"
        onSubmit={(v) => {
          setValue(v);
          messageApi.open({ type: 'success', content: `Sent: ${v}` });
        }}
        slotConfig={slotConfig}
        ref={senderRef}
      />
      <div>
        <strong>getValue() result:</strong> {value || '(click "Get Value" to see formatted result)'}
      </div>
    </Flex>
  );
};

export default () => <App />;
