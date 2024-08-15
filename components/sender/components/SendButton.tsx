import * as React from 'react';
import ActionButton from './ActionButton';
import { SendOutlined } from '@ant-design/icons';
import type { ButtonProps } from 'antd';

export default function SendButton(props: ButtonProps) {
  return <ActionButton icon={<SendOutlined />} {...props} action="onSend" />;
}
