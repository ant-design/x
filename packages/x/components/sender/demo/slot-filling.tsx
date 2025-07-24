import { Sender, type SenderProps } from '@ant-design/x';
import { App, Button, Flex, Slider } from 'antd';
import React, { useRef, useState } from 'react';

type SlotConfig = SenderProps['slotConfig'];

// 结构化 value 示例
const initialValue: SlotConfig = [
  { type: 'text', text: 'I want to go to ' },
  {
    type: 'select',
    key: 'destination',
    props: {
      options: ['Beijing', 'Shanghai', 'Guangzhou'],
      placeholder: 'Please select a destination',
    },
  },
  { type: 'text', text: 'for a trip with ' },
  { type: 'tag', key: 'tag', props: { label: '@ Chuck', value: 'a man' } },
  { type: 'text', text: ', the date is ' },
  {
    type: 'input',
    key: 'date',
    props: {
      placeholder: 'Please enter a date',
    },
  },
  { type: 'text', text: ', and the price should be ' },
  {
    type: 'custom',
    key: 'priceRange',
    props: {
      defaultValue: [20, 50],
    },
    customRender: (value: any, onChange: (value: any) => void) => {
      return (
        <div style={{ width: '100px' }}>
          <Slider style={{ margin: 0 }} range value={value} onChange={onChange} />
        </div>
      );
    },
    formatResult: (value: any) => {
      return `between ${value[0]} and ${value[1]} RMB.`;
    },
  },
];

const Demo: React.FC = () => {
  const [slotConfig, setSlotConfig] = useState<SlotConfig>(initialValue);
  const { message } = App.useApp();
  const inputRef = useRef<any>(null);

  // 备用 slotConfig 示例
  const altSlotConfig: SlotConfig = [
    { type: 'text', text: 'My favorite city is ' },
    {
      type: 'select',
      key: 'city',
      props: {
        defaultValue: 'London',
        options: ['London', 'Paris', 'New York'],
        placeholder: 'Select a city',
      },
    },
    { type: 'text', text: ', and I want to travel with ' },
    { type: 'input', key: 'partner', props: { placeholder: 'Enter a name' } },
  ];

  return (
    <Flex vertical gap={16}>
      {/* 操作按钮区 */}
      <Flex gap={8}>
        <Button
          onClick={() => {
            inputRef.current?.clear?.();
          }}
        >
          Clear
        </Button>
        <Button
          onClick={() => {
            const val = inputRef.current?.getValue?.();
            message.info(val ? val.value : 'No value');
          }}
        >
          Get Value
        </Button>
        <Button
          onClick={() => {
            inputRef.current?.insert?.([{ type: 'text', text: ' some text ' }]);
          }}
        >
          Insert Text
        </Button>
        <Button
          onClick={() => {
            inputRef.current?.insert?.([
              {
                type: 'input',
                key: 'partner_1',
                props: { placeholder: 'Enter a name' },
              },
            ]);
          }}
        >
          Insert Slot
        </Button>
        <Button
          onClick={() => {
            setSlotConfig((prev) => (prev === initialValue ? altSlotConfig : initialValue));
          }}
        >
          Change SlotConfig
        </Button>
      </Flex>
      {/* Sender 词槽填空示例 */}
      <Sender
        onSubmit={() => {
          const res = inputRef.current?.getValue?.();
          message.info(res.value);
          inputRef.current?.clear?.();
        }}
        slotConfig={slotConfig}
        ref={inputRef}
      />
    </Flex>
  );
};

export default () => (
  <App>
    <Demo />
  </App>
);
