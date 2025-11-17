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

  const [
    slotConfigMap,
    editSlotConfigMap,
    slotConfigInfo,
    getSlotValues,
    setSlotValues,
    setSlotConfigMap,
  ] = useSlotConfigState(slotConfigRef.current);

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
    span.dataset.slotType = 'content';
    span.className = `${prefixCls}-slot`;
    span.classList.add(`${prefixCls}-slot-content`);
    return span;
  };

  const buildSpan = (positions: 'before' | 'after') => {
    const span = document.createElement('span');
    span.setAttribute('contenteditable', 'false');

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
          slotSpan.innerHTML = node.props?.defaultValue;
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

  const getSlotListNode = (slotConfig: SlotConfigType[]): SlotNode[] => {
    return slotConfig.reduce((nodeList, config) => {
      if (config.type === 'text') {
        nodeList.push(document.createTextNode(config.value || ''));
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
      if (slotKey) {
        const nodeConfig = slotConfigMap.get(slotKey);
        const slotValue = getSlotValues()[slotKey] || '';
        const tagValue =
          nodeConfig?.type === 'tag' && nodeConfig.props?.value ? nodeConfig.props.value : null;
        const slotResult = nodeConfig?.formatResult?.(slotValue) || tagValue || slotValue;
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
      if (node.nodeType === Node.TEXT_NODE) {
        result.push(textValue);
        currentConfig.push({
          type: 'text',
          value: textValue,
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        const slotKey = el.getAttribute('data-slot-key');
        if (slotKey) {
          const nodeConfig = slotConfigMap.get(slotKey);
          result.push(textValue);
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

  // ============================ Insert Position ============================
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
    const canSubmit = e.key === 'Enter';
    // 如果键盘被锁定或者正在组合输入，则跳过处理

    if (keyLockRef.current || isCompositionRef.current || !canSubmit) {
      onKeyDown?.(e as unknown as React.KeyboardEvent<HTMLTextAreaElement>);
      return;
    }

    switch (submitType) {
      case 'enter':
        // 发送
        if (!e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
          // 设置键盘锁定，防止重复触发
          keyLockRef.current = true;
          e.preventDefault();
          const result = getEditorValue();
          onSubmit?.(result.value, result.config);
        }
        break;
      case 'shiftEnter':
        if (e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
          // 设置键盘锁定，防止重复触发
          keyLockRef.current = true;
          e.preventDefault();
          const result = getEditorValue();
          onSubmit?.(result.value, result.config);
        }
        break;
    }
    onKeyDown?.(e as unknown as React.KeyboardEvent<HTMLTextAreaElement>);
  };

  const onInternalKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // 只在松开 Enter 键时解除锁定
    if (e.key === 'Enter') {
      keyLockRef.current = false;
    }
    // 只处理外部传入的 onKeyUp 回调
    onKeyUp?.(e as unknown as React.KeyboardEvent<HTMLTextAreaElement>);
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

  // 移除<br>
  const removeSpecificBRs = (element: HTMLDivElement | null) => {
    if (submitType === 'enter') {
      const brElements = element?.querySelectorAll('br');
      brElements?.forEach((br) => {
        br.remove();
      });
    }
  };

  const editDomEmpty = () => {
    Array.from(editSlotConfigMap.keys()).forEach((key) => {
      const dom = getSlotDom(key);
      if (dom) {
        const contentDom = dom.querySelector(`[data-slot-content='${key}']`);
        const placeholderDom = dom.querySelector(`[data-slot-placeholder='${key}']`);
        if (!dom?.innerText.trim()) {
          if (contentDom && placeholderDom) {
            contentDom.className = classnames(
              `${prefixCls}-content-editable-edit`,
              `${prefixCls}-content-editable-edit-empty-value`,
            );
            placeholderDom.className = classnames(
              `${prefixCls}-content-editable-placeholder`,
              `${prefixCls}-content-editable-placeholder-visible`,
            );
          }
        } else {
          if (contentDom && placeholderDom) {
            contentDom.className = classnames(`${prefixCls}-content-editable-edit`);
            placeholderDom.className = classnames(`${prefixCls}-content-editable-placeholder`);
          }
        }
      }
    });
  };
  const onInternalInput = (e: React.FormEvent<HTMLDivElement>) => {
    Array.from(editSlotConfigMap.keys()).forEach((key) => {
      console.log(key, slotDomMap, 1111);
    });
    editDomEmpty();
    const newValue = getEditorValue();
    removeSpecificBRs(editableRef?.current);
    onChange?.(
      newValue.value,
      e as unknown as React.ChangeEvent<HTMLTextAreaElement>,
      newValue.config,
    );
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
    if (options?.cursor === 'slot') {
      let inputDom = null;
      if (options?.key) {
        inputDom = getSlotDom(options.key)?.querySelector('input') || null;
      } else {
        for (const node of Array.from(editableRef.current?.childNodes || [])) {
          if (node.nodeType === Node.ELEMENT_NODE && (node as Element).querySelector('input')) {
            inputDom = (node as Element).querySelector('input');
            break;
          }
        }
      }
      if (inputDom) {
        inputDom?.focus();
        return;
      }
    }
    const editor = editableRef.current;
    if (options?.cursor && editor) {
      editor.focus();
      const selection = window.getSelection();
      if (!selection) return;
      const range = document.createRange();
      range.selectNodeContents(editor);
      switch (options?.cursor) {
        case 'start': {
          range.collapse(true);
          break;
        }
        case 'all': {
          break;
        }
        default: {
          // 光标移到最后面
          range.collapse(false);
          break;
        }
      }
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  const clear = () => {
    const div = editableRef.current;
    if (!div) return;
    div.innerHTML = '';
    setSlotValues({});
    onInternalInput(null as unknown as React.FormEvent<HTMLDivElement>);
  };
  // ============================ Effects =============================

  useEffect(() => {
    if (slotConfigInfo.length === 0) return;
    if (editableRef.current && slotConfigInfo) {
      editableRef.current.innerHTML = '';
      slotDomMap?.current?.clear();
      const slotNodeList = getSlotListNode(slotConfigInfo);
      slotNodeList.forEach((element) => {
        const slotType = (element as HTMLSpanElement)?.getAttribute?.('data-slot-type') || '';
        if (slotType === 'content') {
          editableRef.current?.appendChild(buildSpan('before'));
          editableRef.current?.appendChild(element);
          editableRef.current?.appendChild(buildSpan('after'));
        } else {
          editableRef.current?.appendChild(element);
        }
      });
      onChange?.(getEditorValue().value, undefined, getEditorValue().config);
    }
  }, [slotConfig]);

  useImperativeHandle(ref, () => {
    return {
      nativeElement: editableRef.current! as unknown as HTMLTextAreaElement,
      focus,
      blur: () => {
        editableRef.current?.blur();
      },
      insert,
      clear,
      getValue: () => {
        return getEditorValue();
      },
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
