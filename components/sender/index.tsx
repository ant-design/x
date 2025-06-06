import { Flex, Input } from 'antd';
import classnames from 'classnames';
import { useMergedState } from 'rc-util';
import pickAttrs from 'rc-util/lib/pickAttrs';
import getValue from 'rc-util/lib/utils/get';
import React from 'react';
import useProxyImperativeHandle from '../_util/hooks/use-proxy-imperative-handle';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useXProviderContext } from '../x-provider';
import SenderHeader, { SendHeaderContext } from './SenderHeader';
import { ActionButtonContext } from './components/ActionButton';
import ClearButton from './components/ClearButton';
import LoadingButton from './components/LoadingButton';
import SendButton from './components/SendButton';
import SpeechButton from './components/SpeechButton';
import useStyle from './style';
import useSpeech, { type AllowSpeech } from './useSpeech';

import type { InputRef as AntdInputRef, ButtonProps, GetProps } from 'antd';

export type SubmitType = 'enter' | 'shiftEnter' | false;

type TextareaProps = GetProps<typeof Input.TextArea>;

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
export interface SenderProps
  extends Pick<TextareaProps, 'placeholder' | 'onKeyPress' | 'onFocus' | 'onBlur'> {
  prefixCls?: string;
  defaultValue?: string;
  value?: string;
  loading?: boolean;
  readOnly?: boolean;
  submitType?: SubmitType;
  disabled?: boolean;
  onSubmit?: (message: string) => void;
  onChange?: (
    value: string,
    event?: React.FormEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLTextAreaElement>,
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

export type SenderRef = {
  nativeElement: HTMLDivElement;
} & Pick<AntdInputRef, 'focus' | 'blur'>;

function getComponent<T>(
  components: SenderComponents | undefined,
  path: string[],
  defaultComponent: React.ComponentType<T>,
): React.ComponentType<T> {
  return getValue(components, path) || defaultComponent;
}

/** Used for actions render needed components */
const sharedRenderComponents = {
  SendButton,
  ClearButton,
  LoadingButton,
  SpeechButton,
};

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

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
    readOnly,
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
  const inputRef = React.useRef<AntdInputRef>(null);

  useProxyImperativeHandle(ref, () => ({
    nativeElement: containerRef.current!,
    focus: inputRef.current?.focus!,
    blur: inputRef.current?.blur!,
  }));

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

  const triggerValueChange: SenderProps['onChange'] = (nextValue, event) => {
    setInnerValue(nextValue);

    if (onChange) {
      onChange(nextValue, event);
    }
  };

  // ============================ Speech ============================
  const [speechPermission, triggerSpeech, speechRecording] = useSpeech((transcript) => {
    triggerValueChange(`${innerValue} ${transcript}`);
  }, allowSpeech);

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
    if (innerValue && onSubmit && !loading) {
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
    if (isSafari) {
      return;
    }
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

    if (isSafari) {
      isCompositionRef.current = false;
    }

    onKeyPress?.(e);
  };

  // ============================ Paste =============================
  const onInternalPaste: React.ClipboardEventHandler<HTMLElement> = (e) => {
    // Get files
    const files = e.clipboardData?.files;
    if (files?.length && onPasteFile) {
      onPasteFile(files[0], files);
      e.preventDefault();
    }

    onPaste?.(e);
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

  // ============================ Render ============================
  return wrapCSSVar(
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
          <InputTextArea
            {...inputProps}
            disabled={disabled}
            style={{ ...contextConfig.styles.input, ...styles.input }}
            className={classnames(inputCls, contextConfig.classNames.input, classNames.input)}
            autoSize={autoSize}
            value={innerValue}
            onChange={(event) => {
              triggerValueChange(
                (event.target as HTMLTextAreaElement).value,
                event as React.ChangeEvent<HTMLTextAreaElement>,
              );
              triggerSpeech(true);
            }}
            onPressEnter={onInternalKeyPress}
            onCompositionStart={onInternalCompositionStart}
            onCompositionEnd={onInternalCompositionEnd}
            onKeyDown={onKeyDown}
            onPaste={onInternalPaste}
            variant="borderless"
            readOnly={readOnly}
          />
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
    </div>,
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
