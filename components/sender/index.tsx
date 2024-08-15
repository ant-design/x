import { Input, Space } from 'antd';
import type { TextAreaProps } from 'antd/lib/input/TextArea';
import classnames from 'classnames';
import { ClearOutlined, SendOutlined } from '@ant-design/icons';

import useStyle from './style';
import React from 'react';
import type { CustomizeComponent, EnterType } from './interface';
import useConfigContext from '../config-provider/useConfigContext';
import { useMergedState } from 'rc-util';
import getValue from 'rc-util/lib/utils/get';
import StopLoadingIcon from './StopLoading';
import ActionButton from './ActionButton';

export interface SenderComponents {
  actions: {
    wrapper?: CustomizeComponent;
    clear?: CustomizeComponent;
    send?: CustomizeComponent;
    loading?: CustomizeComponent;
  };
  input?: CustomizeComponent<TextAreaProps>;
}

export interface SenderProps {
  prefixCls?: string;
  defaultValue?: string;
  value?: string;
  loading?: boolean;
  enterType?: EnterType;
  disabled?: boolean;
  onSubmit?: (message: string) => boolean;
  onChange?: (value: string) => void;
  onCancel?: VoidFunction;
  components?: SenderComponents;
  styles?: {
    input?: React.CSSProperties;
    actions?: React.CSSProperties;
  };
  rootClassName?: string;
  className?: {
    input?: string;
    actions?: string;
  };
  style?: React.CSSProperties;
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
    styles,
    className,
    rootClassName,
    style,
    defaultValue,
    value,
    enterType = 'enter',
    onSubmit,
    loading: outLoading,
    components,
    onCancel,
    onChange,
    ...rest
  } = props;

  // ============================= MISC =============================
  const { direction, getPrefixCls } = useConfigContext();
  const prefixCls = getPrefixCls('sender', customizePrefixCls);

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

  // =========================== Loading ============================
  const [loading, setLoading] = useMergedState<boolean>(false, {
    value: outLoading,
    onChange: (flag) => {
      if (!flag && onCancel) {
        onCancel();
      }
    },
  });

  // ========================== Components ==========================
  const InputTextArea = getComponent(components, ['input'], Input.TextArea);
  const ActionsWrapper = getComponent(components, ['actions', 'wrapper'], Space);
  const SenderButtonComponent = getComponent(components, ['actions', 'send'], ActionButton);
  const ClearButtonComponent = getComponent(components, ['actions', 'clear'], ActionButton);
  const LoadingButtonComponent = getComponent(components, ['actions', 'loading'], ActionButton);

  // ============================ Events ============================
  const triggerSend = () => {
    setLoading(true);
    if (onSubmit) {
      onSubmit(innerValue);
    }
    triggerValueChange('');
  };

  const onKeyPress = (e: React.KeyboardEvent) => {
    // Check for `enterType` to submit
    switch (enterType) {
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
      case false:
        break;
      default:
        break;
    }
  };

  // ============================ Render ============================
  return wrapCSSVar(
    <div className={mergedCls} style={style}>
      <InputTextArea
        style={styles?.input}
        className={classnames(`${prefixCls}-inputarea`, className?.input)}
        autoSize={{ maxRows: 8 }}
        value={innerValue}
        onChange={(e) => {
          triggerValueChange((e.target as HTMLTextAreaElement).value);
        }}
        onPressEnter={onKeyPress}
        {...rest}
      />

      {/* Action List */}
      <ActionsWrapper className={`${prefixCls}-actions-list`}>
        {/* Clear */}
        <ClearButtonComponent
          className={actionBtnCls}
          onClick={() => {
            triggerValueChange('');
          }}
          icon={<ClearOutlined />}
        />

        {/* Loading or Send */}
        {loading ? (
          <LoadingButtonComponent
            className={actionBtnCls}
            onClick={() => {
              setLoading(false);
            }}
            icon={<StopLoadingIcon />}
          />
        ) : (
          <SenderButtonComponent
            className={actionBtnCls}
            onClick={triggerSend}
            icon={<SendOutlined />}
          />
        )}
      </ActionsWrapper>
    </div>,
  );
};

if (process.env.NODE_ENV !== 'production') {
  Sender.displayName = 'Sender';
}

export default Sender;
