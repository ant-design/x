import type { InputRef as AntdInputRef, InputRef } from 'antd';
import { Input } from 'antd';
import classnames from 'classnames';
import pickAttrs from 'rc-util/lib/pickAttrs';
import getValue from 'rc-util/lib/utils/get';
import React from 'react';
import { SenderContext } from './context';

function getComponent<T>(
  components: { input?: React.ComponentType<T> } | undefined,
  path: string[],
  defaultComponent: React.ComponentType<T>,
): React.ComponentType<T> {
  return getValue(components, path) || defaultComponent;
}

export interface TextAreaRef {
  nativeElement: InputRef['nativeElement'];
  focus: InputRef['focus'];
  blur: InputRef['blur'];
  insert: (value: string) => void;
  clear: () => void;
  getValue: () => { value: string; config: any[] };
}

const TextArea = React.forwardRef<TextAreaRef>((_, ref) => {
  const {
    value,
    onChange,
    onKeyUp,
    onKeyDown,
    onPaste,
    onPasteFile,
    loading,
    disabled,
    readOnly,
    submitType = 'enter',
    prefixCls,
    styles = {},
    classNames = {},
    autoSize = { maxRows: 8 },
    components,
    onSubmit,
    placeholder,
    onFocus,
    onBlur,
    ...rest
  } = React.useContext(SenderContext);

  const inputRef = React.useRef<AntdInputRef>(null);

  const insert = (insertValue: string) => {
    const newValue = (value || '') + insertValue;
    onChange?.(newValue);
  };

  const clear = () => {
    onChange?.('');
  };

  const getValue = () => {
    return { value: value || '', config: [] };
  };

  React.useImperativeHandle(ref, () => ({
    nativeElement: (inputRef.current as any)?.resizableTextArea?.textArea as HTMLTextAreaElement,
    focus: inputRef.current?.focus!,
    blur: inputRef.current?.blur!,
    insert,
    clear,
    getValue,
  }));

  // ============================ Submit ============================
  const isCompositionRef = React.useRef(false);

  const onInternalCompositionStart = () => {
    isCompositionRef.current = true;
  };

  const onInternalCompositionEnd = () => {
    isCompositionRef.current = false;
  };

  const onInternalKeyUp: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    const canSubmit = e.key === 'Enter' && !isCompositionRef.current;

    // Check for `submitType` to submit
    switch (submitType) {
      case 'enter':
        if (canSubmit && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
          e.preventDefault();
          onSubmit?.(value || '');
        }
        break;

      case 'shiftEnter':
        if (canSubmit && e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
          e.preventDefault();
          onSubmit?.(value || '');
        }
        break;
    }

    onKeyUp?.(e);
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

  const InputTextArea = getComponent(components, ['input'], Input.TextArea);

  const domProps = pickAttrs(rest, {
    attr: true,
    aria: true,
    data: true,
  });

  const inputProps = {
    ...domProps,
    ref: inputRef,
  };

  return (
    <InputTextArea
      {...inputProps}
      disabled={disabled}
      style={styles.input}
      className={classnames(`${prefixCls}-input`, classNames.input)}
      autoSize={autoSize}
      value={value}
      onChange={(event) => {
        onChange?.(
          (event.target as HTMLTextAreaElement).value,
          event as React.ChangeEvent<HTMLTextAreaElement>,
        );
      }}
      onKeyUp={onInternalKeyUp}
      onCompositionStart={onInternalCompositionStart}
      onCompositionEnd={onInternalCompositionEnd}
      onKeyDown={onKeyDown}
      onPaste={onInternalPaste}
      variant="borderless"
      readOnly={readOnly}
      placeholder={placeholder}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
});

if (process.env.NODE_ENV !== 'production') {
  TextArea.displayName = 'TextArea';
}

export default TextArea;
