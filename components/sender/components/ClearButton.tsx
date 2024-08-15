import * as React from 'react';
import ActionButton from './ActionButton';
import { ClearOutlined } from '@ant-design/icons';
import type { ButtonProps } from 'antd';

export default function ClearButton(props: ButtonProps) {
  return <ActionButton icon={<ClearOutlined />} {...props} action="onClear" />;
}
