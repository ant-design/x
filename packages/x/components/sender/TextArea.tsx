import type { InputRef as AntdInputRef, InputRef } from 'antd';
import { Input } from 'antd';
import classnames from 'classnames';
import pickAttrs from 'rc-util/lib/pickAttrs';
import getValue from 'rc-util/lib/utils/get';
import React from 'react';
import { SenderContext } from './context';
import { insertPosition } from './interface';

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
  insert: (value: string, position?: insertPosition) => void;
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
    disabled,
    readOnly,
    submitType = 'enter',
    prefixCls,
    styles = {},
    classNames = {},
    autoSize,
    components,
    onSubmit,
    placeholder,
    onFocus,
    onBlur,
    ...restProps
  } = React.useContext(SenderContext);

  const inputRef = React.useRef<AntdInputRef>(null);

  const insert: TextAreaRef['insert'] = (insertValue: string, positions = 'cursor') => {
    const textArea = (inputRef.current as any)?.resizableTextArea?.textArea;
    // 获取当前文本内容
    const currentText = textArea.value;
    let startPos = currentText.length;
    let endPos = currentText.length;
    if (positions === 'cursor') {
      startPos = textArea?.selectionStart;
      endPos = textArea?.selectionEnd;
    }
    if (positions === 'start') {
      startPos = 0;
      endPos = 0;
    }

    // 在光标位置插入新文本
    textArea.value =
      currentText.substring(0, startPos) +
      insertValue +
      currentText.substring(endPos, currentText.length);

    // 设置新的光标位置
    textArea.selectionStart = startPos + insertValue.length;
    textArea.selectionEnd = startPos + insertValue.length;

    // 重新聚焦到textarea
    textArea.focus();

    onChange?.(textArea.value);
  };

  const clear = () => {
    onChange?.('');
  };

  const getValue = () => {
    return { value: value || '', config: [] };
  };

  React.useImperativeHandle(ref, () => {
    return {
      nativeElement: (inputRef.current as any)?.resizableTextArea?.textArea as HTMLTextAreaElement,
      focus: inputRef.current?.focus!,
      blur: inputRef.current?.blur!,
      insert,
      clear,
      getValue,
    };
  });

  // ============================ Submit ============================
  const isCompositionRef = React.useRef(false);

  const onInternalCompositionStart = () => {
    isCompositionRef.current = true;
  };

  const onInternalCompositionEnd = () => {
    isCompositionRef.current = false;
  };

  const onInternalKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    const canSubmit = e.key === 'Enter';
    if (isCompositionRef.current || !canSubmit) {
      onKeyDown?.(e as unknown as React.KeyboardEvent<HTMLTextAreaElement>);
      return;
    }

    switch (submitType) {
      case 'enter':
        if (!e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
          e.preventDefault();
          onSubmit?.(value || '');
        }
        break;

      case 'shiftEnter':
        if (e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
          e.preventDefault();
          onSubmit?.(value || '');
        }
        break;
    }

    onKeyDown?.(e);
  };

  // ============================ Paste =============================
  const onInternalPaste: React.ClipboardEventHandler<HTMLElement> = (e) => {
    // Get files
    const files = e.clipboardData?.files;
    const text = e.clipboardData?.getData('text/plain');
    if (!text && files?.length && onPasteFile) {
      onPasteFile(files[0], files);
      e.preventDefault();
    }

    onPaste?.(e);
  };

  const InputTextArea = getComponent(components, ['input'], Input.TextArea);

  const domProps = pickAttrs(restProps, {
    attr: true,
    aria: true,
    data: true,
  });

  const inputProps = {
    ...domProps,
    ref: inputRef,
  };

  const mergeOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(
      (event.target as HTMLTextAreaElement).value,
      event as React.ChangeEvent<HTMLTextAreaElement>,
    );
  };

  return (
    <InputTextArea
      {...inputProps}
      disabled={disabled}
      style={styles.input}
      className={classnames(`${prefixCls}-input`, classNames.input)}
      autoSize={autoSize}
      value={value}
      onChange={mergeOnChange}
      onKeyUp={onKeyUp}
      onCompositionStart={onInternalCompositionStart}
      onCompositionEnd={onInternalCompositionEnd}
      onKeyDown={onInternalKeyDown}
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
