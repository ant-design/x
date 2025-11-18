import { Sender, type SenderProps } from '@ant-design/x';
import { Button, Flex, GetRef, Slider } from 'antd';
import React, { useRef, useState } from 'react';

type SlotConfig = SenderProps['slotConfig'];

const otherSlotConfig: SlotConfig = [
  { type: 'text', value: 'want to go to' },

  {
    type: 'select',
    key: 'destination',
    props: {
      defaultValue: 'Beijing',
      options: ['Beijing', 'Shanghai', 'Guangzhou'],
      placeholder: 'Please select a destination',
    },
  },
  {
    type: 'content',
    key: 'user',
    props: { defaultValue: '', placeholder: 'Please enter the occupation' },
  },
  { type: 'text', value: 'for a trip with ' },
  { type: 'tag', key: 'tag', props: { label: '@ Chuck', value: 'a man' } },
  { type: 'text', value: ', the date is ' },
  {
    type: 'input',
    key: 'date',
    props: {
      placeholder: 'Please enter a date',
    },
  },
  { type: 'text', value: ', and the price should be ' },
  {
    type: 'custom',
    key: 'priceRange',
    props: {
      defaultValue: [20, 50],
    },
    customRender: (value: any, onChange: (value: any) => void, props) => {
      return (
        <div style={{ width: '100px' }}>
          <Slider {...props} style={{ margin: 0 }} range value={value} onChange={onChange} />
        </div>
      );
    },
    formatResult: (value: any) => {
      return `between ${value[0]} and ${value[1]} RMB.`;
    },
  },
  { type: 'text', value: ', and the number of people is ' },
  {
    type: 'input',
    key: 'numberOfPeople',
    props: {
      placeholder: 'Please enter a number',
    },
  },
];

const altSlotConfig: SlotConfig = [
  { type: 'text', value: 'My favorite city is ' },
  {
    type: 'select',
    key: 'city',
    props: {
      defaultValue: 'London',
      options: ['London', 'Paris', 'New York'],
      placeholder: 'Select a city',
    },
  },
  { type: 'text', value: ', and I want to travel with ' },
  { type: 'input', key: 'partner', props: { placeholder: 'Enter a name' } },
];

const slotConfig = {
  otherSlotConfig,
  altSlotConfig,
};

const App: React.FC = () => {
  const [slotConfigKey, setSlotConfigKey] = useState<keyof typeof slotConfig | false>(
    'otherSlotConfig',
  );
  const senderRef = useRef<GetRef<typeof Sender>>(null);
  const [value, setValue] = useState<string>('');
  return (
    <Flex vertical gap={16}>
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
          }}
        >
          Get Value
        </Button>
        <Button
          onClick={() => {
            const val = senderRef.current?.getValue();
            setValue(val?.config ? JSON.stringify(val.config) : 'No value');
          }}
        >
          Get Slot
        </Button>
        <Button
          onClick={() => {
            senderRef.current?.insert?.([{ type: 'text', value: ' some text ' }]);
          }}
        >
          Insert Text
        </Button>
        <Button
          onClick={() => {
            senderRef.current?.insert?.([
              {
                type: 'input',
                key: `partner_2_${Date.now()}`,
                props: { placeholder: 'Enter a name' },
              },
            ]);
          }}
        >
          Insert Slot
        </Button>
        <Button
          onClick={() => {
            senderRef.current?.insert?.(
              [
                {
                  type: 'input',
                  key: `partner_2_${Date.now()}`,
                  props: { placeholder: 'Enter a name' },
                },
              ],
              'start',
            );
          }}
        >
          Insert Slot Start
        </Button>
        <Button
          onClick={() => {
            senderRef.current?.insert?.(
              [
                {
                  type: 'input',
                  key: `partner_3_${Date.now()}`,
                  props: { placeholder: 'Enter a name' },
                },
              ],
              'end',
            );
          }}
        >
          Insert Slot End
        </Button>
        <Button
          onClick={() => {
            setSlotConfigKey((prev) => {
              if (prev === 'otherSlotConfig') {
                return 'altSlotConfig';
              }
              return 'otherSlotConfig';
            });
          }}
        >
          Change SlotConfig
        </Button>
        <Button
          onClick={() => {
            senderRef.current!.focus({
              cursor: 'start',
            });
          }}
        >
          Focus at first
        </Button>
        <Button
          onClick={() => {
            senderRef.current!.focus({
              cursor: 'end',
            });
          }}
        >
          Focus at last
        </Button>
        <Button
          onClick={() => {
            senderRef.current!.focus({
              cursor: 'slot',
            });
          }}
        >
          Focus at slot
        </Button>
        <Button
          onClick={() => {
            senderRef.current!.focus({
              cursor: 'slot',
              key: 'numberOfPeople',
            });
          }}
        >
          Focus at slot with key
        </Button>
        <Button
          onClick={() => {
            senderRef.current!.focus({
              cursor: 'all',
            });
          }}
        >
          Focus to select all
        </Button>
        <Button
          onClick={() => {
            senderRef.current!.focus({
              preventScroll: true,
            });
          }}
        >
          Focus prevent scroll
        </Button>
        <Button
          onClick={() => {
            senderRef.current!.blur();
          }}
        >
          Blur
        </Button>
      </Flex>
      {/* Sender 词槽填空示例 */}
      <Sender
        styles={{
          input: {
            fontSize: 16,
          },
        }}
        onSubmit={(value) => {
          setValue(value);
          setSlotConfigKey(false);
        }}
        onChange={(value, event, slotConfig) => {
          console.log(value, event, slotConfig);
        }}
        slotConfig={slotConfigKey ? slotConfig?.[slotConfigKey] : []}
        ref={senderRef}
      />
      {value ? `value:${value}` : null}
    </Flex>
  );
};

export default () => <App />;
