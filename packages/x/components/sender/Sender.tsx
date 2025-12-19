import { useControlledState } from '@rc-component/util';
import pickAttrs from '@rc-component/util/lib/pickAttrs';
import { Flex } from 'antd';
import { clsx } from 'clsx';
import React, { useState } from 'react';
import useProxyImperativeHandle from '../_util/hooks/use-proxy-imperative-handle';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useXProviderContext } from '../x-provider';
import { ActionButtonContext } from './components/ActionButton';
import ClearButton from './components/ClearButton';
import LoadingButton from './components/LoadingButton';
import SendButton from './components/SendButton';
import SlotTextArea, { type SlotTextAreaRef } from './components/SlotTextArea';
import SpeechButton from './components/SpeechButton';
import TextArea, { type TextAreaRef } from './components/TextArea';
import { SenderContext } from './context';
import useSpeech from './hooks/use-speech';
import type { BaseNode, SenderProps, SenderRef } from './interface';
import { SendHeaderContext } from './SenderHeader';
import useStyle from './style';

export { SenderContext };

/** Used for actions render needed components */
const sharedRenderComponents = {
  SendButton,
  ClearButton,
  LoadingButton,
  SpeechButton,
};

const ForwardSender = React.forwardRef<SenderRef, SenderProps>((props, ref) => {
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
    placeholder,
    onFocus,
    onBlur,
    skill,
    ...restProps
  } = props;

  const domProps = pickAttrs(restProps, {
    attr: true,
    aria: true,
    data: true,
  });

  const id = React.useId();
  const isSlotMode = Array.isArray(slotConfig) || skill?.value;
  // ============================= MISC =============================
  const { direction, getPrefixCls } = useXProviderContext();
  const prefixCls = getPrefixCls('sender', customizePrefixCls);

  // ============================= Refs =============================
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<SenderRef>(null);

  useProxyImperativeHandle(ref, () => {
    return {
      nativeElement: containerRef.current!,
      inputElement: inputRef.current?.nativeElement,
      focus: (options?: any) => inputRef.current?.focus(options),
      blur: () => inputRef.current?.blur(),
      insert: (...args: any[]) => (inputRef.current as any)?.insert?.(...args),
      clear: () => inputRef.current?.clear(),
      getValue: () =>
        inputRef.current?.getValue() ?? { value: '', slotConfig: [], skill: undefined },
    };
  });

  // ======================= Component Config =======================
  const contextConfig = useXComponentConfig('sender');

  const inputCls = `${prefixCls}-input`;

  // ============================ Styles ============================
  const [hashId, cssVarCls] = useStyle(prefixCls);

  const mergedCls = clsx(
    prefixCls,
    contextConfig.className,
    className,
    rootClassName,
    contextConfig.classNames.root,
    classNames.root,
    hashId,
    cssVarCls,
    `${prefixCls}-main`,
    {
      [`${prefixCls}-rtl`]: direction === 'rtl',
      [`${prefixCls}-disabled`]: disabled,
    },
  );

  const actionBtnCls = `${prefixCls}-actions-btn`;
  const actionListCls = `${prefixCls}-actions-list`;

  // ============================ Value =============================
  const [innerValue, setInnerValue] = useControlledState(defaultValue || '', value);

  const triggerValueChange: SenderProps['onChange'] = (nextValue, event, slotConfig, skill) => {
    setInnerValue(nextValue);
    onChange?.(nextValue, event, slotConfig ?? [], skill);
  };

  // ============================ Speech ============================
  const [speechPermission, triggerSpeech, speechRecording] = useSpeech((transcript) => {
    if (isSlotMode) {
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
    if (inputRef?.current && onSubmit && !loading && !submitDisabled) {
      const inputValue = inputRef.current.getValue();
      onSubmit(inputValue.value, inputValue.slotConfig, inputValue.skill);
    }
  };

  const triggerClear = () => {
    triggerValueChange('');
    if (isSlotMode) {
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

  // ============================ Action context Data ============================
  const [submitDisabled, setSubmitDisabled] = useState(!innerValue);
  // Custom actions context props
  const actionsContextProps = {
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
    setSubmitDisabled,
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
      disabled,
      readOnly,
      submitType,
      prefixCls,
      styles,
      classNames,
      autoSize,
      components,
      triggerSend,
      placeholder,
      onFocus,
      onBlur,
      skill,
      ...restProps,
    }),
    [
      innerValue,
      triggerValueChange,
      slotConfig,
      onKeyUp,
      onKeyDown,
      onPaste,
      onPasteFile,
      disabled,
      readOnly,
      submitType,
      prefixCls,
      styles,
      classNames,
      autoSize,
      components,
      triggerSend,
      placeholder,
      onFocus,
      onBlur,
      skill,
      restProps,
    ],
  );

  // ============================ Focus =============================
  const onContentMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    // If input focused but click on the container,
    // input will lose focus.
    // We call `preventDefault` to prevent this behavior
    if (!isSlotMode && e.target !== containerRef.current?.querySelector(`.${inputCls}`)) {
      e.preventDefault();
    }
    if (e.target === containerRef.current?.querySelector(`.${inputCls}`)) {
      inputRef.current?.focus();
    }
  };

  // ============================ Render ============================
  return (
    <div
      key={id}
      ref={containerRef}
      className={mergedCls}
      style={{
        ...contextConfig.style,
        ...style,
        ...contextConfig.styles.root,
        ...styles.root,
      }}
      {...domProps}
    >
      <SenderContext.Provider value={contextValue}>
        <ActionButtonContext.Provider value={actionsContextProps}>
          {/* Header */}
          {headerNode && (
            <SendHeaderContext.Provider value={{ prefixCls }}>
              {headerNode}
            </SendHeaderContext.Provider>
          )}
          <div
            className={clsx(`${prefixCls}-content`, classNames.content)}
            style={styles.content}
            onMouseDown={onContentMouseDown}
          >
            {/* Prefix */}
            {prefixNode && (
              <div
                className={clsx(
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
            {isSlotMode ? (
              <SlotTextArea ref={inputRef as React.Ref<SlotTextAreaRef>} />
            ) : (
              <TextArea ref={inputRef as React.Ref<TextAreaRef>} />
            )}

            {/* Action List */}
            {suffixNode && (
              <div
                className={clsx(actionListCls, contextConfig.classNames.suffix, classNames.suffix)}
                style={{ ...contextConfig.styles.suffix, ...styles.suffix }}
              >
                {suffixNode}
              </div>
            )}
          </div>
          {footerNode && (
            <div
              className={clsx(
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
      </SenderContext.Provider>
    </div>
  );
});

const Sender = ForwardSender;

if (process.env.NODE_ENV !== 'production') {
  Sender.displayName = 'Sender';
}

export default Sender;
