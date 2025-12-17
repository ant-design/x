import { ArrowUpOutlined } from '@ant-design/icons';
import type { ButtonProps } from 'antd';
import * as React from 'react';
import { useContext } from 'react';
import ActionButton, { ActionButtonContext } from './ActionButton';

function SendButton(props: ButtonProps, ref: React.Ref<HTMLButtonElement>) {
  const { prefixCls } = useContext(ActionButtonContext);

  return (
    <ActionButton
      icon={<ArrowUpOutlined />}
      type="primary"
      shape="circle"
      {...props}
      action="onSend"
      ref={ref}
    />
  );
}

export default React.forwardRef(SendButton);
