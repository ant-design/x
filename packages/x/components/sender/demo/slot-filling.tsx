import { Sender } from '@ant-design/x';
import { App, Button, Flex, Slider } from 'antd';
import React, { useState, useEffect, useRef } from 'react';

interface SenderContentNode {
  type: 'text' | 'input' | 'select' | 'tag' | 'custom';
  key?: string;
  text?: string;
  props?: {
    [key: string]: any;
  };
  customRender?: (value: any, onChange: (value: any) => void) => React.ReactNode;
  formatResult?: (value: any) => string;
}

// 结构化 value 示例
const initialValue: SenderContentNode[] = [
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
  { type: 'text', text: ', the date is' },
  {
    type: 'input',
    key: 'date',
    props: {
      placeholder: 'Please enter a date',
    },
  },
  { type: 'text', text: ', and the price should be between' },
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
  const [slotConfig, setSlotConfig] = useState<SenderContentNode[]>(initialValue);
  const { message } = App.useApp();
  const inputRef = useRef<any>(null);

  const handleChange = (
    newValue: string,
    event?: React.FormEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLTextAreaElement>,
    currentSlotConfig?: SenderContentNode[],
  ) => {
    console.log('value change:', { newValue, currentSlotConfig });
  };

  // 新的 slotConfig 示例
  const altSlotConfig: SenderContentNode[] = [
    { type: 'text', text: 'My favorite city is' },
    {
      type: 'select',
      key: 'city',
      props: {
        options: ['London', 'Paris', 'New York'],
        placeholder: 'Select a city',
      },
    },
    { type: 'text', text: ', and I want to travel with' },
    { type: 'input', key: 'partner', props: { placeholder: 'Enter a name' } },
    { type: 'text', text: '.' },
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
            inputRef.current?.insert?.(' some text ');
          }}
        >
          Insert
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
        onChange={handleChange}
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
