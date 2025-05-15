import { ClearOutlined } from '@ant-design/icons';
import type { ButtonProps } from 'antd';
import * as React from 'react';
import ActionButton from './ActionButton';

function ClearButton(props: ButtonProps, ref: React.Ref<HTMLButtonElement>) {
  return <ActionButton icon={<ClearOutlined />} {...props} action="onClear" ref={ref} />;
}

export default React.forwardRef(ClearButton);
