import { ArrowUpOutlined } from '@ant-design/icons';
import type { ButtonProps } from 'antd';
import * as React from 'react';
import ActionButton from './ActionButton';

export default function SendButton(props: ButtonProps) {
  return (
    <ActionButton
      icon={<ArrowUpOutlined />}
      type="primary"
      shape="circle"
      {...props}
      action="onSend"
    />
  );
}
