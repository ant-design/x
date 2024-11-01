import { type ButtonProps, Flex, type GetProps, Input } from 'antd';
import classnames from 'classnames';

import { useComposeRef, useMergedState } from 'rc-util';
import pickAttrs from 'rc-util/lib/pickAttrs';
import getValue from 'rc-util/lib/utils/get';
import React from 'react';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useXProviderContext } from '../x-provider';
import SenderHeader, { SendHeaderContext } from './SenderHeader';
import { ActionButtonContext } from './components/ActionButton';
import ClearButton from './components/ClearButton';
import LoadingButton from './components/LoadingButton';
import SendButton from './components/SendButton';
import SpeechButton from './components/SpeechButton';
import type { CustomizeComponent, SubmitType } from './interface';
import useStyle from './style';
import useSpeech from './useSpeech';

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
    prefix?: React.CSSProperties;
    input?: React.CSSProperties;
    actions?: React.CSSProperties;
  };
  rootClassName?: string;
  classNames?: {
    prefix?: string;
    input?: string;
    actions?: string;
  };
  style?: React.CSSProperties;
  className?: string;
  actions?: React.ReactNode | ActionsRender;
  allowSpeech?: boolean;
  prefix?: React.ReactNode;
  header?: React.ReactNode;
}

function getComponent<T>(
  components: SenderComponents | undefined,
  path: string[],
  defaultComponent: CustomizeComponent<T>,
): CustomizeComponent<T> {
  return getValue(components, path) || defaultComponent;
}

function Sender(props: SenderProps, ref: React.Ref<HTMLDivElement>) {
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
    disabled,
    allowSpeech,
    prefix,
    header,
    ...rest
  } = props;

  // ============================= MISC =============================
  const { direction, getPrefixCls } = useXProviderContext();
  const prefixCls = getPrefixCls('sender', customizePrefixCls);

  // ============================= Refs =============================
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  const mergedContainerRef = useComposeRef(ref, containerRef);

  // ======================= Component Config =======================
  const contextConfig = useXComponentConfig('sender');
  const inputCls = `${prefixCls}-input`;

  // ============================ Styles ============================
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);
  const mergedCls = classnames(
    prefixCls,
    contextConfig.className,
    className,
    rootClassName,
    hashId,
    cssVarCls,
    {
      [`${prefixCls}-rtl`]: direction === 'rtl',
      [`${prefixCls}-disabled`]: disabled,
    },
  );

  const actionBtnCls = `${prefixCls}-actions-btn`;
  const actionListCls = `${prefixCls}-actions-list`;

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

  // ============================ Speech ============================
  const [speechPermission, triggerSpeech, speechRecording] = useSpeech((transcript) => {
    triggerValueChange(`${innerValue} ${transcript}`);
  });

  // ========================== Components ==========================
  const InputTextArea = getComponent(components, ['input'], Input.TextArea);

  const domProps = pickAttrs(rest, {
    attr: true,
    aria: true,
    data: true,
  });

  const inputProps: typeof domProps = {
    ...domProps,
    ref: inputRef,
  };

  // ============================ Events ============================
  const triggerSend = () => {
    if (innerValue && onSubmit) {
      onSubmit(innerValue);
    }
  };

  const triggerClear = () => {
    triggerValueChange('');
  };

  // ============================ Submit ============================
  const isCompositionRef = React.useRef(false);

  const onInternalCompositionStart = () => {
    isCompositionRef.current = true;
  };

  const onInternalCompositionEnd = () => {
    isCompositionRef.current = false;
  };

  const onInternalKeyPress: TextareaProps['onKeyPress'] = (e) => {
    const canSubmit = e.key === 'Enter' && !isCompositionRef.current;

    // Check for `submitType` to submit
    switch (submitType) {
      case 'enter':
        if (canSubmit && !e.shiftKey) {
          e.preventDefault();
          triggerSend();
        }
        break;

      case 'shiftEnter':
        if (canSubmit && e.shiftKey) {
          e.preventDefault();
          triggerSend();
        }
        break;
    }

    if (onKeyPress) {
      onKeyPress(e);
    }
  };

  // ============================ Focus =============================
  const onContentMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    // If input focused but click on the container,
    // input will lose focus.
    // We call `preventDefault` to prevent this behavior
    if (e.target !== containerRef.current?.querySelector(`.${inputCls}`)) {
      e.preventDefault();
    }

    inputRef.current?.focus();
  };

  // ============================ Action ============================
  let actionNode: React.ReactNode = (
    <Flex className={`${actionListCls}-presets`}>
      {allowSpeech && <SpeechButton />}
      {/* Loading or Send */}
      {loading ? <LoadingButton /> : <SendButton />}
    </Flex>
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
    <div
      ref={mergedContainerRef}
      className={mergedCls}
      style={{ ...contextConfig.style, ...style }}
    >
      {/* Header */}
      {header && (
        <SendHeaderContext.Provider value={{ prefixCls }}>{header}</SendHeaderContext.Provider>
      )}

      <div className={`${prefixCls}-content`} onMouseDown={onContentMouseDown}>
        {/* Prefix */}
        {prefix && (
          <div
            className={classnames(
              `${prefixCls}-prefix`,
              contextConfig.classNames.prefix,
              classNames.prefix,
            )}
            style={{ ...contextConfig.styles.prefix, ...styles.prefix }}
          >
            {prefix}
          </div>
        )}

        {/* Input */}
        <InputTextArea
          {...inputProps}
          disabled={disabled}
          style={{ ...contextConfig.styles.input, ...styles.input }}
          className={classnames(inputCls, contextConfig.classNames.input, classNames.input)}
          autoSize={{ maxRows: 8 }}
          value={innerValue}
          onChange={(e) => {
            triggerValueChange((e.target as HTMLTextAreaElement).value);
          }}
          onPressEnter={onInternalKeyPress}
          onCompositionStart={onInternalCompositionStart}
          onCompositionEnd={onInternalCompositionEnd}
          onKeyDown={onKeyDown}
          readOnly={loading}
          variant="borderless"
        />

        {/* Action List */}
        <div
          className={classnames(
            actionListCls,
            contextConfig.classNames.actions,
            classNames.actions,
          )}
          style={{ ...contextConfig.styles.actions, ...styles.actions }}
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
              onSpeech: triggerSpeech,
              onSpeechDisabled: !speechPermission,
              speechRecording,
              disabled,
            }}
          >
            {actionNode}
          </ActionButtonContext.Provider>
        </div>
      </div>
    </div>,
  );
}

const ForwardSender = React.forwardRef(Sender) as React.ForwardRefExoticComponent<
  SenderProps & React.RefAttributes<HTMLDivElement>
> & {
  Header: typeof SenderHeader;
};

if (process.env.NODE_ENV !== 'production') {
  ForwardSender.displayName = 'Sender';
}

ForwardSender.Header = SenderHeader;

export default ForwardSender;
