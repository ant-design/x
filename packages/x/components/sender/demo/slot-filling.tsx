import { Sender, type SenderProps, XProvider } from '@ant-design/x';
import { Button, Flex, GetRef, Slider } from 'antd';
import React, { useRef, useState } from 'react';

type SlotConfig = SenderProps['slotConfig'];

const otherSlotConfig: SlotConfig = [
  { type: 'text', value: 'I want to travel to ' },
  {
    type: 'content',
    key: 'location',
    props: { defaultValue: '', placeholder: '[Please enter the location]' },
  },
  { type: 'text', value: 'by' },
  {
    type: 'select',
    key: 'transportation',
    props: {
      defaultValue: 'airplane',
      options: ['airplane', 'high-speed rail', 'cruise ship'],
      placeholder: 'Please choose a mode of transportation',
    },
  },
  { type: 'text', value: 'with a group of 3 people, and each person has a budget of' },
  {
    type: 'custom',
    key: 'priceRange',
    props: {
      defaultValue: [3000, 6000],
    },
    customRender: (value: any, onChange: (value: any) => void, props) => {
      return (
        <div
          style={{
            width: '200px',
            paddingInline: 20,
            display: 'inline-block',
            alignItems: 'center',
          }}
        >
          <Slider
            {...props}
            max={8000}
            min={1000}
            style={{ margin: 0 }}
            range
            value={value}
            onChange={onChange}
          />
        </div>
      );
    },
    formatResult: (value: any) => {
      return `between ${value[0]} and ${value[1]} RMB.`;
    },
  },
  { type: 'text', value: 'Please' },
  { type: 'tag', key: 'tag', props: { label: '@Travel Planner ', value: 'travelTool' } },
  { type: 'text', value: 'help me create a travel itinerary,Use account' },
  {
    type: 'input',
    key: 'account',
    props: {
      placeholder: 'Please enter a account',
    },
  },
  { type: 'text', value: '.' },
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
          autoSize={{ minRows: 4, maxRows: 4 }}
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
      </XProvider>

      {value ? `value:${value}` : null}
    </Flex>
  );
};

export default () => <App />;
