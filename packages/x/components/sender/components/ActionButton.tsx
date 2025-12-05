import { Button, type ButtonProps } from 'antd';
import classNames from 'classnames';
import * as React from 'react';

export interface ActionButtonContextProps {
  prefixCls: string;
  onSend?: VoidFunction;
  onSendDisabled?: boolean;
  onClear?: VoidFunction;
  onClearDisabled?: boolean;
  onCancel?: VoidFunction;
  onCancelDisabled?: boolean;
  onSpeech?: VoidFunction;
  onSpeechDisabled?: boolean;
  speechRecording?: boolean;
  disabled?: boolean;
}

export const ActionButtonContext = React.createContext<ActionButtonContextProps>(null!);

export interface ActionButtonProps extends ButtonProps {
  action: 'onSend' | 'onClear' | 'onCancel' | 'onSpeech';
}

export function ActionButton(props: ActionButtonProps, ref: React.Ref<HTMLButtonElement>) {
  const { className, action, onClick, ...restProps } = props;
  const context = React.useContext(ActionButtonContext);
  const { prefixCls, disabled: rootDisabled } = context;
  const mergedDisabled = restProps.disabled ?? rootDisabled ?? context[`${action}Disabled`];
  return (
    <Button
      type="text"
      {...restProps}
      ref={ref}
      onClick={(e) => {
        if (mergedDisabled) {
          return;
        }
        context[action]?.();
        onClick?.(e);
      }}
      disabled={mergedDisabled}
      className={classNames(prefixCls, className, {
        [`${prefixCls}-disabled`]: mergedDisabled,
      })}
    />
  );
}

export default React.forwardRef(ActionButton);
