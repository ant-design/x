import type { ChoiceProps } from '@ant-design/x';
import { Choice } from '@ant-design/x';
import { App } from 'antd';
import React from 'react';

const items: ChoiceProps['items'] = [
  { key: '1', label: '选项 A', description: '描述 A' },
  { key: '2', label: '选项 B', description: '描述 B' },
  { key: '3', label: '选项 C', description: '描述 C' },
];

const Demo = () => {
  const [value, setValue] = React.useState<string | number | (string | number)[]>('2');

  const { message } = App.useApp();

  return (
    <Choice
      title="受控模式"
      description="当前选中值由外部 state 控制"
      items={items}
      value={value}
      onChange={(val) => {
        setValue(val);
        message.info(`Changed to: ${val}`);
      }}
    />
  );
};

export default () => (
  <App>
    <Demo />
  </App>
);
