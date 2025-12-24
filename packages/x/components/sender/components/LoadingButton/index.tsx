import type { ButtonProps } from 'antd';
import { clsx } from 'clsx';
import * as React from 'react';
import ActionButton, { ActionButtonContext } from '../ActionButton';
import StopLoadingIcon from './StopLoading';

function LoadingButton(props: ButtonProps, ref: React.Ref<HTMLButtonElement>) {
  const { prefixCls } = React.useContext(ActionButtonContext);
  const { className } = props;

  return (
    <ActionButton
      icon={<StopLoadingIcon className={`${prefixCls}-loading-icon`} />}
      color="primary"
      variant="text"
      shape="circle"
      {...props}
      className={clsx(className, `${prefixCls}-loading-button`)}
      action="onCancel"
      ref={ref}
    />
  );
}

export default React.forwardRef(LoadingButton);
