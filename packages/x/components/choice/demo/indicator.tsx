import type { ChoiceProps } from '@ant-design/x';
import { Choice } from '@ant-design/x';
import { App, Space } from 'antd';
import React from 'react';

const items: ChoiceProps['items'] = [
  { key: '1', label: '选项 A', description: '描述 A' },
  { key: '2', label: '选项 B', description: '描述 B' },
  { key: '3', label: '选项 C', description: '描述 C' },
];

const Demo = () => {
  const { message } = App.useApp();

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Choice
        title="indicator: radio (默认单选)"
        items={items}
        indicator="radio"
        onChange={(value) => message.info(`Selected: ${value}`)}
      />
      <Choice
        title="indicator: check"
        mode="multiple"
        items={items}
        indicator="check"
        onChange={(value) =>
          message.info(`Selected: ${(value as Array<string | number>).join(', ')}`)
        }
      />
      <Choice
        title="indicator: number"
        items={items}
        indicator="number"
        onChange={(value) => message.info(`Selected: ${value}`)}
      />
      <Choice
        title="indicator: none"
        items={items}
        indicator="none"
        onChange={(value) => message.info(`Selected: ${value}`)}
      />
    </Space>
  );
};

export default () => (
  <App>
    <Demo />
  </App>
);
