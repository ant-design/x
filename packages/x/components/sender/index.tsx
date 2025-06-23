import { Flex, Input } from 'antd';
import classnames from 'classnames';
import { useMergedState } from 'rc-util';
import React from 'react';
import useProxyImperativeHandle from '../_util/hooks/use-proxy-imperative-handle';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useXProviderContext } from '../x-provider';
import SenderHeader, { SendHeaderContext } from './SenderHeader';
import TextArea, { type TextAreaRef } from './TextArea';
import { ActionButtonContext } from './components/ActionButton';
import ClearButton from './components/ClearButton';
import LoadingButton from './components/LoadingButton';
import SendButton from './components/SendButton';
import SpeechButton from './components/SpeechButton';
import useStyle from './style';
import useSpeech, { type AllowSpeech } from './useSpeech';

import type { ButtonProps, GetProps, InputProps } from 'antd';
import SlotTextArea, { SlotTextAreaRef } from './SlotTextArea';

type TextareaProps = GetProps<typeof Input.TextArea>;

export type SubmitType = 'enter' | 'shiftEnter' | false;

export interface SenderComponents {
  input?: React.ComponentType<TextareaProps>;
}

type ActionsComponents = {
  SendButton: React.ComponentType<ButtonProps>;
  ClearButton: React.ComponentType<ButtonProps>;
  LoadingButton: React.ComponentType<ButtonProps>;
  SpeechButton: React.ComponentType<ButtonProps>;
};

export type ActionsRender = (
  ori: React.ReactNode,
  info: {
    components: ActionsComponents;
  },
) => React.ReactNode;

export type FooterRender = (info: { components: ActionsComponents }) => React.ReactNode;

interface SlotConfigBaseType {
  type: 'text' | 'input' | 'select' | 'tag' | 'custom';
  formatResult?: (value: any) => string;
}

interface SlotConfigTextType extends SlotConfigBaseType {
  type: 'text';
  text?: string;
  key?: string;
}

interface SlotConfigInputType extends SlotConfigBaseType {
  type: 'input';
  key: string;
  props?: {
    defaultValue?: InputProps['defaultValue'];
    placeholder?: string | undefined;
  };
}

interface SlotConfigSelectType extends SlotConfigBaseType {
  type: 'select';
  key: string;
  props?: {
    defaultValue?: string;
    options: string[];
    placeholder?: string | undefined;
  };
}

interface SlotConfigTagType extends SlotConfigBaseType {
  type: 'tag';
  key: string;
  props?: {
    label: React.ReactNode;
    value?: string;
  };
}

interface SlotConfigCustomType extends SlotConfigBaseType {
  type: 'custom';
  key: string;
  props?: {
    defaultValue?: any;
    [key: string]: any;
  };
  customRender?: (
    value: any,
    onChange: (value: any) => void,
    item: SlotConfigType,
  ) => React.ReactNode;
}

export type SlotConfigType =
  | SlotConfigTextType
  | SlotConfigInputType
  | SlotConfigSelectType
  | SlotConfigTagType
  | SlotConfigCustomType;

export interface SenderProps
  extends Pick<TextareaProps, 'placeholder' | 'onKeyUp' | 'onFocus' | 'onBlur'> {
  prefixCls?: string;
  defaultValue?: string;
  value?: string;
  loading?: boolean;
  readOnly?: boolean;
  submitType?: SubmitType;
  disabled?: boolean;
  slotConfig?: SlotConfigType[];
  onSubmit?: (message: string, slotConfig?: SlotConfigType[]) => void;
  onChange?: (
    value: string,
    event?: React.FormEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLTextAreaElement>,
    slotConfig?: SlotConfigType[],
  ) => void;
  onCancel?: VoidFunction;
  onKeyDown?: React.KeyboardEventHandler<any>;
  onPaste?: React.ClipboardEventHandler<HTMLElement>;
  onPasteFile?: (firstFile: File, files: FileList) => void;
  components?: SenderComponents;
  styles?: {
    prefix?: React.CSSProperties;
    input?: React.CSSProperties;
    actions?: React.CSSProperties;
    footer?: React.CSSProperties;
  };
  rootClassName?: string;
  classNames?: {
    prefix?: string;
    input?: string;
    actions?: string;
    footer?: string;
  };
  style?: React.CSSProperties;
  className?: string;
  actions?: React.ReactNode | ActionsRender;
  allowSpeech?: AllowSpeech;
  prefix?: React.ReactNode;
  footer?: React.ReactNode | FooterRender;
  header?: React.ReactNode;
  autoSize?: boolean | { minRows?: number; maxRows?: number };
}

export const SenderContext = React.createContext<SenderProps>({});

export type SenderRef = TextAreaRef | SlotTextAreaRef;

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
    actions,
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
      (inputRef.current as SlotTextAreaRef)?.insert?.(transcript);
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
      components: sharedRenderComponents,
    });
  } else if (actions || actions === false) {
    actionNode = actions;
  }
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

  // ============================ Footer ============================
  const footerNode =
    typeof footer === 'function' ? footer({ components: sharedRenderComponents }) : footer || null;

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

    inputRef.current?.focus();
  };

  // ============================ Render ============================
  return wrapCSSVar(
    <SenderContext.Provider value={contextValue}>
      <div ref={containerRef} className={mergedCls} style={{ ...contextConfig.style, ...style }}>
        {/* Header */}
        {header && (
          <SendHeaderContext.Provider value={{ prefixCls }}>{header}</SendHeaderContext.Provider>
        )}
        <ActionButtonContext.Provider value={actionsButtonContextProps}>
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
            {slotConfig ? (
              <SlotTextArea ref={inputRef as React.Ref<SlotTextAreaRef>} />
            ) : (
              <TextArea ref={inputRef as React.Ref<TextAreaRef>} />
            )}

            {/* Action List */}
            {actionNode && (
              <div
                className={classnames(
                  actionListCls,
                  contextConfig.classNames.actions,
                  classNames.actions,
                )}
                style={{ ...contextConfig.styles.actions, ...styles.actions }}
              >
                {actionNode}
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
    </SenderContext.Provider>,
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
