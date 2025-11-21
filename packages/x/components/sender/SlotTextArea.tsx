import { CaretDownFilled } from '@ant-design/icons';
import { Dropdown, Input, InputRef } from 'antd';
import classnames from 'classnames';
import pickAttrs from 'rc-util/lib/pickAttrs';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import warning from '../_util/warning';
import { useXProviderContext } from '../x-provider';
import { SenderContext } from './context';
import useInputHeight from './hooks/use-input-height';
import useSlotConfigState from './hooks/use-slot-config-state';
import type { EventType, insertPosition, SlotConfigType } from './interface';

export interface SlotTextAreaRef {
  focus: (options?: FocusOptions) => void;
  blur: InputRef['blur'];
  nativeElement: InputRef['nativeElement'];
  insert: (
    slotConfig: SlotConfigType[],
    position?: insertPosition,
    replaceCharacters?: string,
  ) => void;
  clear: () => void;
  getValue: () => {
    value: string;
    config: SlotConfigType[];
  };
}

type InputFocusOptions = {
  preventScroll?: boolean;
  cursor?: 'start' | 'end' | 'all';
};

type SlotFocusOptions = {
  preventScroll?: boolean;
  cursor?: 'slot';
  key?: string;
};

type FocusOptions = SlotFocusOptions | InputFocusOptions;

type SlotNode = Text | Document | HTMLSpanElement;

const SlotTextArea = React.forwardRef<SlotTextAreaRef>((_, ref) => {
  const {
    onChange,
    onKeyUp,
    onKeyDown,
    onPaste,
    onPasteFile,
    disabled,
    readOnly,
    submitType = 'enter',
    prefixCls: customizePrefixCls,
    styles = {},
    classNames = {},
    autoSize,
    onSubmit,
    placeholder,
    onFocus,
    onBlur,
    slotConfig,
    ...restProps
  } = React.useContext(SenderContext);
  const slotConfigRef = useRef<SlotConfigType[]>([...(slotConfig || [])]);

  // ============================= MISC =============================
  const { direction, getPrefixCls } = useXProviderContext();
  const prefixCls = `${getPrefixCls('sender', customizePrefixCls)}`;
  const contextConfig = useXComponentConfig('sender');
  const inputCls = `${prefixCls}-input`;

  // ============================ Style =============================

  const mergeStyle = { ...contextConfig.styles?.input, ...styles.input };
  const inputHeightStyle = useInputHeight(autoSize, mergeStyle);

  // ============================ Refs =============================
  const editableRef = useRef<HTMLDivElement>(null);
  const slotDomMap = useRef<Map<string, HTMLSpanElement>>(new Map());
  const isCompositionRef = useRef(false);
  const keyLockRef = useRef(false);
  const lastSelectionRef = useRef<Range | null>(null);

  // ============================ Attrs =============================
  const domProps = pickAttrs(restProps, {
    attr: true,
    aria: true,
    data: true,
  });

  const inputProps = {
    ...domProps,
    ref: editableRef,
  };

  // ============================ State =============================

  const [slotConfigMap, __, ___, getSlotValues, setSlotValues, setSlotConfigMap] =
    useSlotConfigState(slotConfig || []);

  const [slotPlaceholders, setSlotPlaceholders] = useState<Map<string, React.ReactNode>>(new Map());

  // ============================ Methods =============================
  const buildSlotSpan = (key: string) => {
    const span = document.createElement('span');
    span.setAttribute('contenteditable', 'false');
    span.dataset.slotKey = key;
    span.className = `${prefixCls}-slot`;

    return span;
  };

  const buildEditSlotSpan = (config: SlotConfigType) => {
    const span = document.createElement('span');
    span.setAttribute('contenteditable', 'true');
    span.dataset.slotKey = config.key;
    span.className = classnames(`${prefixCls}-slot`, `${prefixCls}-slot-content`);
    return span;
  };

  const buildSpan = (slotKey: string, positions: 'before' | 'after') => {
    const span = document.createElement('span');
    span.setAttribute('contenteditable', 'false');
    span.dataset.slotKey = slotKey;
    span.dataset.nodeType = 'nbsp';
    span.className = classnames(`${prefixCls}-slot-${positions}`, `${prefixCls}-slot-no-width`);
    span.innerHTML = '&nbsp;';

    return span;
  };
  const saveSlotDom = (key: string, dom: HTMLSpanElement) => {
    slotDomMap.current.set(key, dom);
  };

  const getSlotDom = (key: string): HTMLSpanElement | undefined => {
    return slotDomMap.current.get(key);
  };

  const updateSlot = (key: string, value: any, e?: EventType) => {
    const slotDom = getSlotDom(key);
    const node = slotConfigMap.get(key);
    setSlotValues((prev) => ({ ...prev, [key]: value }));
    if (slotDom && node) {
      const newReactNode = renderSlot(node, slotDom);
      setSlotPlaceholders((prev) => {
        const newMap = new Map(prev);
        newMap.set(key, newReactNode);
        return newMap;
      });

      // 触发 onChange 回调
      const newValue = getEditorValue();
      onChange?.(newValue.value, e, newValue.config);
    }
  };

  const renderSlot = (node: SlotConfigType, slotSpan: HTMLSpanElement) => {
    if (!node.key) return null;
    const value = getSlotValues()[node.key];
    const renderContent = () => {
      switch (node.type) {
        case 'content':
          slotSpan.innerHTML = value || '';
          slotSpan.setAttribute('data-placeholder', node.props?.placeholder || '');
          return null;

        case 'input':
          return (
            <Input
              readOnly={readOnly}
              className={`${prefixCls}-slot-input`}
              placeholder={node.props?.placeholder || ''}
              data-slot-input={node.key}
              size="small"
              variant="borderless"
              value={value || ''}
              tabIndex={0}
              onChange={(e) => {
                updateSlot(node.key as string, e.target.value, e as unknown as EventType);
              }}
              spellCheck={false}
            />
          );
        case 'select':
          return (
            <Dropdown
              disabled={readOnly}
              menu={{
                items: node.props?.options?.map((opt: any) => ({
                  label: opt,
                  key: opt,
                })),
                defaultSelectedKeys: node.props?.defaultValue ? [node.props.defaultValue] : [],
                selectable: true,
                onSelect: ({ key, domEvent }) => {
                  updateSlot(node.key as string, key, domEvent as unknown as EventType);
                },
              }}
              trigger={['click']}
            >
              <span
                className={classnames(`${prefixCls}-slot-select`, {
                  placeholder: !value,
                  [`${prefixCls}-slot-select-selector-value`]: value,
                })}
              >
                <span
                  data-placeholder={node.props?.placeholder}
                  className={`${prefixCls}-slot-select-value`}
                >
                  {value || ''}
                </span>
                <span className={`${prefixCls}-slot-select-arrow`}>
                  <CaretDownFilled />
                </span>
              </span>
            </Dropdown>
          );
        case 'tag':
          return (
            <div className={`${prefixCls}-slot-tag`}>
              {node.props?.label || node.props?.value || ''}
            </div>
          );
        case 'custom':
          return node.customRender?.(
            value,
            (value: any) => {
              updateSlot(node.key as string, value);
            },
            { disabled, readOnly },
            node,
          );
        default:
          return null;
      }
    };

    return createPortal(renderContent(), slotSpan);
  };

  const getSlotListNode = (slotConfig: readonly SlotConfigType[]): SlotNode[] => {
    return slotConfig.reduce((nodeList, config) => {
      if (config.type === 'text') {
        nodeList.push(document.createTextNode(config.value || ''));
        return nodeList;
      }
      const slotKey = config.key;
      warning(!!slotKey, 'sender', `Duplicate slot key: ${slotKey}`);
      if (slotKey) {
        let slotSpan;
        if (config.type === 'content') {
          slotSpan = buildEditSlotSpan(config);
        } else {
          slotSpan = buildSlotSpan(slotKey);
        }
        saveSlotDom(slotKey, slotSpan);
        if (slotSpan) {
          const reactNode = renderSlot(config, slotSpan);
          if (reactNode) {
            setSlotPlaceholders((ori) => {
              ori.set(slotKey, reactNode);
              return ori;
            });
            nodeList.push(slotSpan);
          }
        }
      }
      return nodeList;
    }, [] as SlotNode[]);
  };

  const getNodeTextValue = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || '';
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const slotKey = el.getAttribute('data-slot-key');
      const nodeType = el.getAttribute('data-node-type');
      if (slotKey) {
        if (nodeType === 'nbsp') {
          return ' ';
        }
        const nodeConfig = slotConfigMap.get(slotKey);
        let slotResult = '';
        if (nodeConfig?.type === 'content') {
          slotResult = el?.innerText || '';
        } else {
          const slotValue = getSlotValues()[slotKey] || '';
          slotResult = nodeConfig?.formatResult?.(slotValue) || slotValue;
        }

        return slotResult;
      }
      return el?.innerText || '';
    }
    return '';
  };

  const getEditorValue = (): {
    value: string;
    config: (SlotConfigType & { value: string })[];
  } => {
    const result: string[] = [];
    const currentConfig: (SlotConfigType & { value: string })[] = [];
    editableRef.current?.childNodes.forEach((node) => {
      const textValue = getNodeTextValue(node);
      result.push(textValue);
      if (node.nodeType === Node.TEXT_NODE) {
        currentConfig.push({
          type: 'text',
          value: textValue,
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        const slotKey = el.getAttribute('data-slot-key');
        if (slotKey) {
          const nodeConfig = slotConfigMap.get(slotKey);
          if (nodeConfig) {
            currentConfig.push({ ...nodeConfig, value: textValue });
          }
        }
      }
    });
    if (!result.length) {
      const div = editableRef.current;
      if (div) {
        div.innerHTML = '';
      }
    }
    return {
      value: result.join(''),
      config: currentConfig,
    };
  };

  const getInsertPosition = (
    position: insertPosition,
  ): {
    type: 'box' | 'slot' | 'end' | 'start';
    range?: Range;
  } => {
    const selection = window?.getSelection?.();
    const editableDom = editableRef.current;
    if (position === 'end' || !selection) {
      return {
        type: 'end',
      };
    }
    if (position === 'start') {
      return {
        type: 'start',
      };
    }
    const currentRange = selection?.rangeCount > 0 ? selection?.getRangeAt?.(0) : null;
    const range = lastSelectionRef.current || currentRange;
    if (range) {
      if ((range.endContainer as HTMLElement)?.className?.includes(`${prefixCls}-slot`)) {
        return {
          type: 'slot',
          range,
        };
      }
      if (range.endContainer === editableDom || range.endContainer.parentElement === editableDom) {
        return {
          range,
          type: 'box',
        };
      }
    }
    return {
      type: 'end',
    };
  };

  const appendNodeList = (slotNodeList: HTMLElement[]) => {
    slotNodeList.forEach((element) => {
      const slotKey = element?.getAttribute?.('data-slot-key') || '';
      const nodeConfig = slotConfigMap.get(slotKey);
      if (nodeConfig?.type === 'content') {
        editableRef.current?.appendChild(buildSpan(slotKey, 'before'));
        editableRef.current?.appendChild(element);
        editableRef.current?.appendChild(buildSpan(slotKey, 'after'));
      } else {
        editableRef.current?.appendChild(element);
      }
    });
  };

  const removeSlot = (key: string, e?: EventType) => {
    const editableDom = editableRef.current;
    if (!editableDom) return;

    // 直接移除所有相关的DOM元素
    editableDom.querySelectorAll(`[data-slot-key="${key}"]`).forEach((element) => {
      element.remove();
    });

    // 清理所有相关引用
    slotDomMap.current.delete(key);

    // 使用函数式更新避免闭包问题
    slotConfigRef.current = slotConfigRef.current.filter((item) => item.key !== key);

    setSlotValues((prev) => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });

    setSlotPlaceholders((prev) => {
      const next = new Map(prev);
      next.delete(key);
      return next;
    });

    // 触发onChange回调
    const newValue = getEditorValue();
    onChange?.(newValue.value, e, newValue.config);
  };

  // ============================ Events =============================
  const onInternalCompositionStart = () => {
    isCompositionRef.current = true;
  };

  const onInternalCompositionEnd = () => {
    isCompositionRef.current = false;
    // 组合输入结束后清除键盘锁定
    keyLockRef.current = false;
  };

  const onInternalKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const { key, target, shiftKey, ctrlKey, altKey, metaKey } = e;

    // 如果键盘被锁定或者正在组合输入，直接跳过处理
    if (keyLockRef.current || isCompositionRef.current) {
      onKeyDown?.(e as unknown as React.KeyboardEvent<HTMLTextAreaElement>);
      return;
    }

    // 处理退格键删除slot
    if (key === 'Backspace' && target === editableRef.current) {
      const selection = window.getSelection();
      if (selection?.focusOffset === 1) {
        const slotKey = (selection.anchorNode?.parentNode as Element)?.getAttribute?.(
          'data-slot-key',
        );
        if (slotKey && selection.anchorNode?.parentNode) {
          e.preventDefault();
          (selection.anchorNode.parentNode as HTMLElement).innerHTML = '';
          return;
        }
      }
      if (selection?.focusOffset === 0) {
        const slotKey = (selection.anchorNode?.previousSibling as Element)?.getAttribute?.(
          'data-slot-key',
        );
        if (slotKey) {
          e.preventDefault();
          removeSlot(slotKey, e as unknown as EventType);
          return;
        }
      }
    }

    // 处理Enter键提交
    if (key === 'Enter') {
      const isModifierPressed = ctrlKey || altKey || metaKey;
      const shouldSubmit =
        (submitType === 'enter' && !shiftKey && !isModifierPressed) ||
        (submitType === 'shiftEnter' && shiftKey && !isModifierPressed);

      if (shouldSubmit) {
        e.preventDefault();
        keyLockRef.current = true;
        const result = getEditorValue();
        onSubmit?.(result.value, result.config);
        return;
      }
    }

    onKeyDown?.(e as unknown as React.KeyboardEvent<HTMLTextAreaElement>);
  };

  // 移除<br>标签（仅在enter模式下）
  const removeSpecificBRs = (element: HTMLDivElement | null) => {
    if (submitType !== 'enter' || !element) return;
    element.querySelectorAll('br').forEach((br) => {
      br.remove();
    });
  };

  // ============================ Input Event ============================

  const onInternalFocus = (e: React.FocusEvent<HTMLDivElement>) => {
    const selection = window.getSelection();
    if (selection) {
      const range = document.createRange();
      range.selectNodeContents(editableRef.current!);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }

    onFocus?.(e as unknown as React.FocusEvent<HTMLTextAreaElement>);
  };

  const onInternalBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (keyLockRef.current) {
      keyLockRef.current = false;
    }
    const selection = window.getSelection();

    if (selection) {
      lastSelectionRef.current = selection.rangeCount ? selection?.getRangeAt?.(0) : null;
    }

    const timer = setTimeout(() => {
      lastSelectionRef.current = null;
      clearTimeout(timer);
      // 清除光标位置
    }, 200);

    onBlur?.(e as unknown as React.FocusEvent<HTMLTextAreaElement>);
  };

  const onInternalInput = (e: React.FormEvent<HTMLDivElement>) => {
    const newValue = getEditorValue();
    removeSpecificBRs(editableRef?.current);
    onChange?.(
      newValue.value,
      e as unknown as React.ChangeEvent<HTMLTextAreaElement>,
      newValue.config,
    );
  };

  const onInternalPaste: React.ClipboardEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    const files = e.clipboardData?.files;
    const text = e.clipboardData?.getData('text/plain');
    if (!text && files?.length && onPasteFile) {
      onPasteFile(files);
      return;
    }

    if (text) {
      insert([{ type: 'text', value: text.replace(/\n/g, '') }]);
    }

    onPaste?.(e as unknown as React.ClipboardEvent<HTMLTextAreaElement>);
  };

  const onInternalKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // 只在松开 Enter 键时解除锁定
    if (e.key === 'Enter') {
      keyLockRef.current = false;
    }
    // 只处理外部传入的 onKeyUp 回调
    onKeyUp?.(e as unknown as React.KeyboardEvent<HTMLTextAreaElement>);
  };
  // ============================ Ref Method ============================
  const insert: SlotTextAreaRef['insert'] = (
    slotConfig,
    position = 'cursor',
    replaceCharacters?: string,
  ) => {
    const editableDom = editableRef.current;
    const selection = window.getSelection();
    if (!editableDom || !selection) return;
    const slotNode = getSlotListNode(slotConfig);
    const { type, range: lastRage } = getInsertPosition(position);
    let range: Range = document.createRange();
    setSlotValues((prev) => ({ ...prev, ...slotConfig }));
    setSlotConfigMap(slotConfig);

    // 光标不在输入框内，将内容插入最末位
    if (type === 'end') {
      selection.removeAllRanges();
      selection.addRange(range);
      range.setStart(editableDom, editableDom.childNodes.length);
    }
    if (type === 'start') {
      range.setStart(editableDom, 0);
    }
    if (type === 'box') {
      range = lastRage as Range;
    }
    if (type === 'slot') {
      range = selection?.getRangeAt?.(0);
      if (selection?.focusNode?.nextSibling) {
        range.setStartBefore(selection.focusNode.nextSibling);
      }
    }
    const startOffset = range.startOffset;
    const container = range.startContainer;

    // 如果光标前有字符
    if (replaceCharacters?.length) {
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(editableDom);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      preCaretRange.setStart(editableDom, 0);
      const textBeforeCursor = preCaretRange.toString();
      const cursorPosition = textBeforeCursor.length; // 光标位置前的字符数

      if (cursorPosition >= replaceCharacters.length) {
        if (textBeforeCursor.endsWith(replaceCharacters)) {
          range.setStart(container, startOffset - replaceCharacters.length);
          range.setEnd(container, startOffset);
          range.deleteContents();
        }
      }
    }
    slotNode.forEach((node) => {
      range.insertNode(node);
      range.setStartAfter(node);
      range = range.cloneRange();
    });

    editableDom.focus();
    selection.removeAllRanges();
    selection.addRange(range);
    range.collapse(false);
    const timer = setTimeout(() => {
      onInternalInput(null as unknown as React.FormEvent<HTMLDivElement>);
      clearTimeout(timer);
    }, 0);
  };

  const focus = (options?: FocusOptions) => {
    const editor = editableRef.current;
    if (!editor) return;

    // 处理 slot 类型的焦点
    if (options?.cursor === 'slot') {
      const focusSlotInput = () => {
        // 如果指定了 key，直接查找对应的 slot
        if (options?.key) {
          const slotDom = getSlotDom(options.key);
          return slotDom?.querySelector<HTMLInputElement>('input') || null;
        }

        // 否则查找第一个可聚焦的 slot
        for (const node of Array.from(editor.childNodes)) {
          const slotKey = (node as Element)?.getAttribute?.('data-slot-key') || '';
          const nodeType = (node as Element)?.getAttribute?.('data-node-type') || '';
          const nodeConfig = slotConfigMap.get(slotKey);

          if (node.nodeType !== Node.ELEMENT_NODE) continue;

          if (nodeConfig?.type === 'input') {
            return (node as Element).querySelector<HTMLInputElement>('input');
          }

          if (nodeConfig?.type === 'content' && nodeType !== 'nbsp') {
            return node;
          }
        }
        return null;
      };

      const targetElement = focusSlotInput();

      if (targetElement && targetElement.nodeName === 'INPUT') {
        (targetElement as HTMLInputElement).focus();
        return;
      }

      // 处理 content 类型的 slot
      if (targetElement) {
        editor.focus();
        const selection = window.getSelection();
        if (selection) {
          const range = document.createRange();
          range.setStart(targetElement, 0);
          range.setEnd(targetElement, 0);
          selection.removeAllRanges();
          selection.addRange(range);
        }
        return;
      }
    }

    // 处理常规焦点
    editor.focus();

    if (!options?.cursor) return;

    const selection = window.getSelection();
    if (!selection) return;

    const range = document.createRange();
    range.selectNodeContents(editor);

    switch (options.cursor) {
      case 'start':
        range.collapse(true);
        break;
      case 'all':
        // 保持全选状态
        break;
      default:
        range.collapse(false);
        break;
    }

    selection.removeAllRanges();
    selection.addRange(range);
  };
  const initClear = () => {
    const div = editableRef.current;
    if (!div) return;
    div.innerHTML = '';
    slotDomMap?.current?.clear();
    onInternalInput(null as unknown as React.FormEvent<HTMLDivElement>);
  };
  const clear = () => {
    const div = editableRef.current;
    if (!div) return;
    div.innerHTML = '';
    setSlotValues({});
    slotDomMap?.current?.clear();
    onInternalInput(null as unknown as React.FormEvent<HTMLDivElement>);
  };
  // ============================ Effects =============================

  useEffect(() => {
    if (slotConfig && slotConfig.length === 0) return;
    if (editableRef.current && slotConfig) {
      initClear();
      appendNodeList(getSlotListNode(slotConfig) as HTMLElement[]);
      onChange?.(getEditorValue().value, undefined, getEditorValue().config);
    }
  }, [slotConfig]);

  useImperativeHandle(ref, () => {
    return {
      nativeElement: editableRef.current! as unknown as HTMLTextAreaElement,
      focus,
      blur: editableRef.current?.blur!,
      insert,
      clear,
      getValue: getEditorValue,
    };
  });
  // ============================ Render =============================
  return (
    <>
      <div
        {...inputProps}
        role="textbox"
        tabIndex={0}
        style={{ ...mergeStyle, ...inputHeightStyle }}
        className={classnames(
          inputCls,
          `${inputCls}-slot`,
          contextConfig.classNames.input,
          classNames.input,
          {
            [`${prefixCls}-rtl`]: direction === 'rtl',
          },
        )}
        data-placeholder={placeholder}
        contentEditable={!readOnly}
        suppressContentEditableWarning
        spellCheck={false}
        onKeyDown={onInternalKeyDown}
        onKeyUp={onInternalKeyUp}
        onPaste={onInternalPaste}
        onCompositionStart={onInternalCompositionStart}
        onCompositionEnd={onInternalCompositionEnd}
        onFocus={onInternalFocus}
        onBlur={onInternalBlur}
        onInput={onInternalInput}
        {...(restProps as React.HTMLAttributes<HTMLDivElement>)}
      />
      <div
        style={{
          display: 'none',
        }}
        id={`${prefixCls}-slot-placeholders`}
      >
        {Array.from(slotPlaceholders.values())}
      </div>
    </>
  );
});

if (process.env.NODE_ENV !== 'production') {
  SlotTextArea.displayName = 'SlotTextArea';
}

export default SlotTextArea;
