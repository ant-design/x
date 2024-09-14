import { type ButtonProps, Input, Space, type GetProps } from 'antd';
import classnames from 'classnames';

import useStyle from './style';
import React from 'react';
import type { CustomizeComponent, SubmitType } from './interface';
import { useConfigContext } from '../config-provider';
import { useMergedState } from 'rc-util';
import getValue from 'rc-util/lib/utils/get';
import { ActionButtonContext } from './components/ActionButton';
import pickAttrs from 'rc-util/lib/pickAttrs';
import ClearButton from './components/ClearButton';
import LoadingButton from './components/LoadingButton';
import SendButton from './components/SendButton';

type TextareaProps = GetProps<typeof Input.TextArea>;

export interface SenderComponents {
  input?: CustomizeComponent<TextareaProps>;
}

export type ActionsRender = (
  ori: React.ReactNode,
  info: {
    components: {
      SendButton: React.ComponentType<ButtonProps>;
      ClearButton: React.ComponentType<ButtonProps>;
      LoadingButton: React.ComponentType<ButtonProps>;
    };
  },
) => React.ReactNode;

export interface SenderProps extends Pick<TextareaProps, 'placeholder' | 'onKeyPress'> {
  prefixCls?: string;
  defaultValue?: string;
  value?: string;
  loading?: boolean;
  submitType?: SubmitType;
  disabled?: boolean;
  onSubmit?: (message: string) => void;
  onChange?: (value: string) => void;
  onCancel?: VoidFunction;
  onKeyDown?: React.KeyboardEventHandler<any>;
  components?: SenderComponents;
  styles?: {
    input?: React.CSSProperties;
    actions?: React.CSSProperties;
  };
  rootClassName?: string;
  classNames?: {
    input?: string;
    actions?: string;
  };
  style?: React.CSSProperties;
  className?: string;
  actions?: React.ReactNode | ActionsRender;
}

function getComponent<T>(
  components: SenderComponents | undefined,
  path: string[],
  defaultComponent: CustomizeComponent<T>,
): CustomizeComponent<T> {
  return getValue(components, path) || defaultComponent;
}

const Sender: React.FC<SenderProps> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    styles = {},
    classNames = {},
    className,
    rootClassName,
    style,
    defaultValue,
    value,
    submitType = 'enter',
    onSubmit,
    loading,
    components,
    onCancel,
    onChange,
    actions,
    onKeyPress,
    onKeyDown,
    ...rest
  } = props;

  // ============================= MISC =============================
  const { direction, getPrefixCls } = useConfigContext();
  const prefixCls = getPrefixCls('sender', customizePrefixCls);

  const domProps = pickAttrs(rest, {
    attr: true,
    aria: true,
    data: true,
  });

  // ============================ Styles ============================
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);
  const mergedCls = classnames(className, rootClassName, prefixCls, hashId, cssVarCls, {
    [`${prefixCls}-rtl`]: direction === 'rtl',
  });

  const actionBtnCls = `${prefixCls}-actions-btn`;

  // ============================ Value =============================
  const [innerValue, setInnerValue] = useMergedState(defaultValue || '', {
    value,
  });

  const triggerValueChange = (nextValue: string) => {
    setInnerValue(nextValue);

    if (onChange) {
      onChange(nextValue);
    }
  };

  // ========================== Components ==========================
  const InputTextArea = getComponent(components, ['input'], Input.TextArea);

  // ============================ Events ============================
  const triggerSend = () => {
    if (innerValue && onSubmit) {
      onSubmit(innerValue);
    }
  };

  const triggerClear = () => {
    triggerValueChange('');
  };

  const onInternalKeyPress: TextareaProps['onKeyPress'] = (e) => {
    // Check for `submitType` to submit
    switch (submitType) {
      case 'enter':
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          triggerSend();
        }
        break;

      case 'shiftEnter':
        if (e.key === 'Enter' && e.shiftKey) {
          e.preventDefault();
          triggerSend();
        }
        break;
    }

    if (onKeyPress) {
      onKeyPress(e);
    }
  };

  // ============================ Action ============================
  let actionNode: React.ReactNode = (
    <Space>
      {/* Clear */}
      <ClearButton />

      {/* Loading or Send */}
      {loading ? <LoadingButton /> : <SendButton />}
    </Space>
  );

  // Custom actions
  if (typeof actions === 'function') {
    actionNode = actions(actionNode, {
      components: {
        SendButton,
        ClearButton,
        LoadingButton,
      },
    });
  } else if (actions) {
    actionNode = actions;
  }

  // ============================ Render ============================
  return wrapCSSVar(
    <div className={mergedCls} style={style}>
      <InputTextArea
        {...domProps}
        style={styles.input}
        className={classnames(`${prefixCls}-input`, classNames.input)}
        autoSize={{ maxRows: 8 }}
        value={innerValue}
        onChange={(e) => {
          triggerValueChange((e.target as HTMLTextAreaElement).value);
        }}
        onPressEnter={onInternalKeyPress}
        onKeyDown={onKeyDown}
        readOnly={loading}
      />

      {/* Action List */}
      <div
        className={classnames(`${prefixCls}-actions-list`, classNames.actions)}
        style={styles.actions}
      >
        <ActionButtonContext.Provider
          value={{
            prefixCls: actionBtnCls,
            onSend: triggerSend,
            onSendDisabled: !innerValue,
            onClear: triggerClear,
            onClearDisabled: !innerValue,
            onCancel,
            onCancelDisabled: !loading,
          }}
        >
          {actionNode}
        </ActionButtonContext.Provider>
      </div>
    </div>,
  );
};

if (process.env.NODE_ENV !== 'production') {
  Sender.displayName = 'Sender';
}

export default Sender;
