import pickAttrs from '@rc-component/util/lib/pickAttrs';
import getValue from '@rc-component/util/lib/utils/get';
import type { InputRef } from 'antd';
import { Input } from 'antd';
import { clsx } from 'clsx';
import React from 'react';
import { SenderContext } from '../context';
import type { InsertPosition, SkillType } from '../interface';

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
  insert: (value: string, position?: InsertPosition) => void;
  clear: () => void;
  getValue: () => { value: string; slotConfig: any[]; skill?: SkillType };
}

interface InnerInputRef {
  focus: InputRef['focus'];
  blur: InputRef['blur'];
  input?: HTMLInputElement | null;
  resizableTextArea?: {
    textArea: HTMLTextAreaElement;
  };
  nativeElement: HTMLElement | null;
}

const getNativeInputElement = (
  inputRef: InnerInputRef | null,
): HTMLInputElement | HTMLTextAreaElement | null => {
  const nativeElement = inputRef?.resizableTextArea?.textArea || inputRef?.input;
  if (nativeElement) {
    return nativeElement;
  }

  const fallbackElement = inputRef?.nativeElement;
  if (fallbackElement?.tagName === 'INPUT' || fallbackElement?.tagName === 'TEXTAREA') {
    return fallbackElement as HTMLInputElement | HTMLTextAreaElement;
  }

  return null;
};

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
    triggerSend,
    placeholder,
    onFocus,
    onBlur,
    ...restProps
  } = React.useContext(SenderContext);

  const inputRef = React.useRef<InnerInputRef>(null);
  const restoreSelectionRef = React.useRef<{
    start: number;
    end: number;
    direction?: 'forward' | 'backward' | 'none';
  } | null>(null);

  React.useLayoutEffect(() => {
    const selection = restoreSelectionRef.current;
    if (!selection) {
      return;
    }

    const inputElement = getNativeInputElement(inputRef.current);
    if (inputElement) {
      inputElement.focus({ preventScroll: true });
      inputElement.setSelectionRange(selection.start, selection.end, selection.direction);
    }

    const timer = window.setTimeout(() => {
      if (restoreSelectionRef.current === selection) {
        restoreSelectionRef.current = null;
      }
    });

    return () => window.clearTimeout(timer);
  });

  const insert: TextAreaRef['insert'] = (insertValue: string, positions = 'cursor') => {
    const textArea = getNativeInputElement(inputRef.current);
    if (!textArea) {
      return;
    }
    // 获取当前文本内容
    const currentText = textArea.value;
    let startPos = currentText.length;
    let endPos = currentText.length;
    if (positions === 'cursor') {
      startPos = textArea.selectionStart ?? currentText.length;
      endPos = textArea.selectionEnd ?? currentText.length;
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
    restoreSelectionRef.current = {
      start: textArea.selectionStart,
      end: textArea.selectionEnd,
      direction: textArea.selectionDirection || undefined,
    };

    // 重新聚焦到textarea
    textArea.focus();

    onChange?.(textArea.value);
  };

  const clear = () => {
    onChange?.('');
  };

  const getValue = () => {
    return { value: value || '', slotConfig: [] };
  };

  React.useImperativeHandle(ref, () => {
    return {
      nativeElement: getNativeInputElement(inputRef.current),
      focus: (options) => inputRef.current?.focus?.(options),
      blur: () => inputRef.current?.blur?.(),
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
    const eventRes = onKeyDown?.(e);
    const { key, shiftKey, ctrlKey, altKey, metaKey } = e;

    if (isCompositionRef.current || key !== 'Enter' || eventRes === false) {
      return;
    }

    // 处理Enter键提交
    if (key === 'Enter') {
      const isModifierPressed = ctrlKey || altKey || metaKey;
      const shouldSubmit =
        (submitType === 'enter' && !shiftKey && !isModifierPressed) ||
        (submitType === 'shiftEnter' && shiftKey && !isModifierPressed);

      if (shouldSubmit) {
        e.preventDefault();
        triggerSend?.();
        return;
      }
    }
  };

  // ============================ Paste =============================
  const onInternalPaste: React.ClipboardEventHandler<HTMLElement> = (e) => {
    // Get files
    const files = e.clipboardData?.files;
    const text = e.clipboardData?.getData('text/plain');
    if (!text && files?.length && onPasteFile) {
      onPasteFile(files);
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
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    restoreSelectionRef.current = {
      start: target.selectionStart ?? target.value.length,
      end: target.selectionEnd ?? target.value.length,
      direction: target.selectionDirection || undefined,
    };

    onChange?.(target.value, event as React.ChangeEvent<HTMLTextAreaElement>);
  };

  return (
    <InputTextArea
      {...inputProps}
      disabled={disabled}
      style={styles.input}
      className={clsx(`${prefixCls}-input`, classNames.input)}
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
