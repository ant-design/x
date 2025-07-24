import { Flex } from 'antd';
import classnames from 'classnames';
import { useMergedState } from 'rc-util';
import React from 'react';
import useProxyImperativeHandle from '../_util/hooks/use-proxy-imperative-handle';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useXProviderContext } from '../x-provider';
import { ActionButtonContext } from './components/ActionButton';
import ClearButton from './components/ClearButton';
import LoadingButton from './components/LoadingButton';
import SendButton from './components/SendButton';
import SpeechButton from './components/SpeechButton';
import { SenderContext } from './context';
import type {
  ActionsComponents,
  BaseNode,
  SenderComponents,
  SenderProps,
  SenderRef,
  SlotConfigType,
  SubmitType,
} from './interface';
import SenderHeader, { SendHeaderContext } from './SenderHeader';
import SlotTextArea, { type SlotTextAreaRef } from './SlotTextArea';
import useStyle from './style';
import TextArea, { type TextAreaRef } from './TextArea';
import useSpeech from './useSpeech';

export type {
  ActionsComponents,
  SenderComponents,
  SenderProps,
  SenderRef,
  SlotConfigType,
  SubmitType,
};

export { SenderContext };

/** Used for actions render needed components */
const sharedRenderComponents = {
  SendButton,
  ClearButton,
  LoadingButton,
  SpeechButton,
};

const ForwardSender = React.forwardRef<any, SenderProps>((props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    styles = {},
    classNames = {},
    className,
    rootClassName,
    style,
    defaultValue,
    value,
    slotConfig,
    readOnly,
    submitType = 'enter',
    onSubmit,
    loading,
    components,
    onCancel,
    onChange,
    suffix,
    onKeyUp,
    onKeyDown,
    disabled,
    allowSpeech,
    prefix,
    footer,
    header,
    onPaste,
    onPasteFile,
    autoSize = { maxRows: 8 },
    ...rest
  } = props;

  // ============================= MISC =============================
  const { direction, getPrefixCls } = useXProviderContext();
  const prefixCls = getPrefixCls('sender', customizePrefixCls);

  // ============================= Refs =============================
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<any>(null);

  useProxyImperativeHandle(ref, () => {
    return {
      nativeElement: containerRef.current!,
      focus: inputRef.current?.focus!,
      blur: inputRef.current?.blur!,
      insert: inputRef.current?.insert!,
      clear: inputRef.current?.clear!,
      getValue: inputRef.current?.getValue!,
    };
  });

  // ======================= Component Config =======================
  const contextConfig = useXComponentConfig('sender');
  const inputCls = `${prefixCls}-input`;

  // ============================ Styles ============================
  const [hashId, cssVarCls] = useStyle(prefixCls);
  const mergedCls = classnames(
    prefixCls,
    contextConfig.className,
    className,
    rootClassName,
    contextConfig.classNames.root,
    classNames.root,
    hashId,
    cssVarCls,
    {
      [`${prefixCls}-rtl`]: direction === 'rtl',
      [`${prefixCls}-disabled`]: disabled,
    },
  );

  const actionBtnCls = `${prefixCls}-suffix-btn`;
  const actionListCls = `${prefixCls}-suffix-list`;

  // ============================ Value =============================
  const [innerValue, setInnerValue] = useMergedState(defaultValue || '', {
    value,
  });

  const triggerValueChange: SenderProps['onChange'] = (nextValue, event, slotConfig) => {
    if (slotConfig) {
      setInnerValue(nextValue);
      if (onChange) {
        onChange(nextValue, event, slotConfig);
      }
      return;
    }

    setInnerValue(nextValue);

    if (onChange) {
      onChange(nextValue, event);
    }
  };

  // ============================ Speech ============================
  const [speechPermission, triggerSpeech, speechRecording] = useSpeech((transcript) => {
    if (slotConfig) {
      (inputRef.current as SlotTextAreaRef)?.insert?.([
        {
          type: 'text',
          value: transcript,
        },
      ]);
    } else {
      triggerValueChange(`${innerValue} ${transcript}`);
    }
  }, allowSpeech);

  // ============================ Events ============================
  const triggerSend = () => {
    if (innerValue && onSubmit && !loading) {
      onSubmit(innerValue);
    }
  };

  const triggerClear = () => {
    triggerValueChange('');
    if (slotConfig) {
      (inputRef.current as SlotTextAreaRef)?.clear?.();
    }
  };

  // ============================ Action ============================
  const actionNode: React.ReactNode = (
    <Flex className={`${actionListCls}-presets`}>
      {allowSpeech && <SpeechButton />}
      {/* Loading or Send */}
      {loading ? <LoadingButton /> : <SendButton />}
    </Flex>
  );

  // ============================ Suffix ============================

  let suffixNode: BaseNode = actionNode;

  if (typeof suffix === 'function') {
    suffixNode = suffix(actionNode, {
      components: sharedRenderComponents,
    });
  } else if (suffix || suffix === false) {
    suffixNode = suffix;
  }

  // ============================ Prefix ============================

  const prefixNode =
    typeof prefix === 'function'
      ? prefix(actionNode, { components: sharedRenderComponents })
      : prefix || null;

  // ============================ Header ============================
  const headerNode =
    typeof header === 'function'
      ? header(actionNode, { components: sharedRenderComponents })
      : header || null;

  // ============================ Footer ============================
  const footerNode =
    typeof footer === 'function'
      ? footer(actionNode, { components: sharedRenderComponents })
      : footer || null;

  // Custom actions context props
  const actionsButtonContextProps = {
    prefixCls: actionBtnCls,
    onSend: triggerSend,
    onSendDisabled: !innerValue,
    onClear: triggerClear,
    onClearDisabled: !innerValue,
    onCancel,
    onCancelDisabled: !loading,
    onSpeech: () => triggerSpeech(false),
    onSpeechDisabled: !speechPermission,
    speechRecording,
    disabled,
  };

  // ============================ Context ============================
  const contextValue = React.useMemo(
    () => ({
      value: innerValue,
      onChange: triggerValueChange,
      slotConfig,
      onKeyUp,
      onKeyDown,
      onPaste,
      onPasteFile,
      loading,
      disabled,
      readOnly,
      submitType,
      prefixCls,
      styles,
      classNames,
      autoSize,
      components,
      onSubmit,
      placeholder: rest.placeholder,
      onFocus: rest.onFocus,
      onBlur: rest.onBlur,
      ...rest,
    }),
    [
      innerValue,
      triggerValueChange,
      slotConfig,
      onKeyUp,
      onKeyDown,
      onPaste,
      onPasteFile,
      loading,
      disabled,
      readOnly,
      submitType,
      prefixCls,
      styles,
      classNames,
      autoSize,
      components,
      onSubmit,
      rest.placeholder,
      rest.onFocus,
      rest.onBlur,
      rest,
    ],
  );

  // ============================ Focus =============================
  const onContentMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    // If input focused but click on the container,
    // input will lose focus.
    // We call `preventDefault` to prevent this behavior
    if (!slotConfig && e.target !== containerRef.current?.querySelector(`.${inputCls}`)) {
      e.preventDefault();
    }
    if (e.target === containerRef.current?.querySelector(`.${inputCls}`)) {
      inputRef.current?.focus();
    }
  };

  // ============================ Render ============================
  return (
    <SenderContext.Provider value={contextValue}>
      <div
        ref={containerRef}
        className={mergedCls}
        style={{
          ...contextConfig.style,
          ...style,
          ...contextConfig.styles.root,
          ...styles.root,
        }}
      >
        <ActionButtonContext.Provider value={actionsButtonContextProps}>
          {/* Header */}
          {headerNode && (
            <SendHeaderContext.Provider value={{ prefixCls }}>
              {headerNode}
            </SendHeaderContext.Provider>
          )}
          <div className={`${prefixCls}-content`} onMouseDown={onContentMouseDown}>
            {/* Prefix */}
            {prefixNode && (
              <div
                className={classnames(
                  `${prefixCls}-prefix`,
                  contextConfig.classNames.prefix,
                  classNames.prefix,
                )}
                style={{ ...contextConfig.styles.prefix, ...styles.prefix }}
              >
                {prefixNode}
              </div>
            )}

            {/* Input */}
            {slotConfig ? (
              <SlotTextArea ref={inputRef as React.Ref<SlotTextAreaRef>} />
            ) : (
              <TextArea ref={inputRef as React.Ref<TextAreaRef>} />
            )}

            {/* Action List */}
            {suffixNode && (
              <div
                className={classnames(
                  actionListCls,
                  contextConfig.classNames.suffix,
                  classNames.suffix,
                )}
                style={{ ...contextConfig.styles.suffix, ...styles.suffix }}
              >
                {suffixNode}
              </div>
            )}
          </div>
          {footerNode && (
            <div
              className={classnames(
                `${prefixCls}-footer`,
                contextConfig.classNames.footer,
                classNames.footer,
              )}
              style={{
                ...contextConfig.styles.footer,
                ...styles.footer,
              }}
            >
              {footerNode}
            </div>
          )}
        </ActionButtonContext.Provider>
      </div>
    </SenderContext.Provider>
  );
});

type CompoundedSender = typeof ForwardSender & {
  Header: typeof SenderHeader;
};

const Sender = ForwardSender as CompoundedSender;

if (process.env.NODE_ENV !== 'production') {
  Sender.displayName = 'Sender';
}

Sender.Header = SenderHeader;

export default Sender;
