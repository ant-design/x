import { Sender, XProvider } from '@ant-design/x';
import { Button, Flex, GetRef, message } from 'antd';
import React, { useRef, useState } from 'react';
import type { SlotConfigType } from '../interface';

const App = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const slotConfig: SlotConfigType[] = [];
  const senderRef = useRef<GetRef<typeof Sender>>(null);
  const [value, setValue] = useState<string>('');
  const [slotValue, setSlotValue] = useState<string>('');
  return (
    <Flex vertical gap={16}>
      {contextHolder}
      {/* 操作按钮区 */}
      <Flex wrap gap={8}>
        <Button
          onClick={() => {
            senderRef.current?.clear?.();
          }}
        >
          Clear
        </Button>
        <Button
          onClick={() => {
            const val = senderRef.current?.getValue?.();
            setValue(val?.value ? val.value : 'No value');
            setSlotValue(val?.slotConfig ? JSON.stringify(val.slotConfig) : 'No value');
          }}
        >
          Get Value
        </Button>
        <Button
          onClick={() => {
            senderRef.current?.focus({ cursor: 'end' });
          }}
        >
          光标聚焦最后
        </Button>
        <Button
          onClick={() => {
            senderRef.current?.insert?.(
              [
                {
                  type: 'tag',
                  key: `tag_${Date.now()}`,
                  props: {
                    label: 'tag',
                    value: 'tag',
                  },
                },
              ],
              'cursor',
              '#',
            );
          }}
        >
          插入词槽并替换 #
        </Button>
      </Flex>
      {/* Sender 词槽填空示例 */}
      <XProvider
        theme={{
          components: {
            Sender: {
              fontSize: 16,
            },
          },
        }}
      >
        <Sender
          allowSpeech
          autoSize={{ minRows: 3, maxRows: 4 }}
          placeholder="Enter to send message"
          onSubmit={(value) => {
            setValue(value);
            messageApi.open({
              type: 'success',
              content: `Send message success: ${value}`,
            });
            senderRef.current?.clear?.();
          }}
          onChange={(value, event, slotConfig, skill) => {
            console.log(value, event, slotConfig, skill);
          }}
          slotConfig={slotConfig}
          ref={senderRef}
          onKeyDown={(event) => {
            if (event.key === '#') {
            }
          }}
        />
      </XProvider>
      <Flex vertical gap="middle">
        <div> {value ? `value:${value}` : null}</div>
        <div> {slotValue ? `slotValue:${slotValue}` : null}</div>
      </Flex>
    </Flex>
  );
};

export default () => <App />;
