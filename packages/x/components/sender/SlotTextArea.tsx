import { CaretDownFilled } from '@ant-design/icons';
import { Dropdown, Input, InputRef } from 'antd';
import classnames from 'classnames';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import warning from '../_util/warning';
import { useXProviderContext } from '../x-provider';
import { SenderContext } from './context';
import useGetState from './hooks/use-get-state';
import useInputHeight from './hooks/use-input-height';
import type { EventType, SlotConfigType } from './interface';
export interface SlotTextAreaRef {
  focus: InputRef['focus'];
  blur: InputRef['blur'];
  nativeElement: InputRef['nativeElement'];
  insert: (slotConfig: SlotConfigType[]) => void;
  clear: () => void;
  getValue: () => {
    value: string;
    config: SlotConfigType[];
  };
}

type InputFocusOptions = Parameters<InputRef['focus']>[0];
type SlotNode = Text | Document | HTMLSpanElement;
const SlotTextArea = React.forwardRef<SlotTextAreaRef>((_, ref) => {
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
    prefixCls: customizePrefixCls,
    styles = {},
    classNames = {},
    autoSize,
    components,
    onSubmit,
    placeholder,
    onFocus,
    onBlur,
    slotConfig: propsSlotConfig,
    ...rest
  } = React.useContext(SenderContext);

  // ============================= MISC =============================
  const { direction, getPrefixCls } = useXProviderContext();
  const prefixCls = `${getPrefixCls('sender', customizePrefixCls)}`;
  const contextConfig = useXComponentConfig('sender');
  const inputCls = `${prefixCls}-input`;

  // ============================ Style =============================

  const mergeStyle = { ...contextConfig.styles?.input, ...styles.input };
  const inputHeightStyle = useInputHeight(mergeStyle, autoSize);

  // ============================ Refs =============================
  const editableRef = useRef<HTMLDivElement>(null);
  const slotDomMap = useRef<Map<string, HTMLSpanElement>>(new Map());
  const isCompositionRef = useRef(false);
  const keyLockRef = useRef(false);
  const lastSelectionRef = useRef<Range | null>(null);

  // ============================ State =============================

  const [slotConfig, setSlotConfig] = useState<SlotConfigType[]>(
    propsSlotConfig as SlotConfigType[],
  );

  const [slotConfigMap, getSlotValues, setSlotValues] = useGetState(slotConfig);

  const [slotPlaceholders, setSlotPlaceholders] = useState<Map<string, React.ReactNode>>(new Map());

  // ============================ Methods =============================
  const buildSlotSpan = (key: string) => {
    const span = document.createElement('span');
    span.setAttribute('contenteditable', 'false');
    span.dataset.slotKey = key;
    span.className = `${prefixCls}-slot`;
    return span;
  };

  const saveSlotDom = (key: string, dom: HTMLSpanElement) => {
    slotDomMap.current.set(key, dom);
  };

  const getSlotDom = (key: string) => {
    return slotDomMap.current.get(key);
  };

  const updateSlot = (key: string, value: any, e?: EventType) => {
    const slotDom = getSlotDom(key);
    const node = slotConfig?.find((item) => item.key === key);
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
        case 'input':
          return (
            <Input
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
                <span className={`${prefixCls}-slot-select-value`}>
                  {value || node.props?.placeholder || ''}
                </span>
                <span className={`${prefixCls}-slot-select-arrow`}>
                  <CaretDownFilled />
                </span>
              </span>
            </Dropdown>
          );
        case 'tag':
          return <div className={`${prefixCls}-slot-tag`}>{node.props?.label || ''}</div>;
        case 'custom':
          return node.customRender?.(
            value,
            (value: any) => {
              updateSlot(node.key as string, value);
            },
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
      if (config.key) {
        const slotKey = config.key;
        warning(!getSlotDom(slotKey), 'sender', `Duplicate slot key: ${slotKey}`);
        const slotSpan = buildSlotSpan(slotKey);
        saveSlotDom(config.key, slotSpan);
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

  const getEditorValue = (): {
    value: string;
    config: (SlotConfigType & { value: string })[];
  } => {
    const result: string[] = [];
    const currentValues = getSlotValues();
    const currentConfig: (SlotConfigType & { value: string })[] = [];
    editableRef.current?.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        result.push(node.textContent || '');
        currentConfig.push({
          type: 'text',
          value: node.textContent || '',
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        const slotKey = el.getAttribute('data-slot-key');
        if (slotKey) {
          const nodeConfig = slotConfigMap.get(slotKey);
          const slotValue = currentValues[slotKey] || '';
          const tagValue =
            nodeConfig?.type === 'tag' && nodeConfig.props?.value ? nodeConfig.props.value : null;
          const slotResult = nodeConfig?.formatResult?.(slotValue) || tagValue || slotValue;
          result.push(slotResult);
          if (nodeConfig) {
            currentConfig.push({ ...nodeConfig, value: slotResult });
          }
        }
      }
    });

    return {
      value: result.join(''),
      config: currentConfig,
    };
  };

  // ============================ Cursor ============================
  const getCursorPosition = (): {
    type: 'box' | 'slot' | 'outside';
  } => {
    const selection = window.getSelection();
    const editableDom = editableRef.current;
    let range = null;
    if (selection && selection.rangeCount) {
      range = selection?.getRangeAt?.(0);
      if ((range.endContainer as HTMLElement)?.className?.includes(`${prefixCls}-slot`)) {
        return {
          type: 'slot',
        };
      }
      if (range.endContainer === editableDom || range.endContainer.parentElement === editableDom) {
        return {
          type: 'box',
        };
      }
    }
    if (range) {
      range.deleteContents();
    }
    return {
      type: 'outside',
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
    // 如果键盘被锁定或者正在组合输入，则跳过处理
    if (keyLockRef.current || isCompositionRef.current) {
      onKeyDown?.(e as unknown as React.KeyboardEvent<HTMLTextAreaElement>);
      return;
    }

    const canSubmit = e.key === 'Enter';

    switch (submitType) {
      case 'enter':
        if (canSubmit && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
          e.preventDefault();
          // 设置键盘锁定，防止重复触发
          keyLockRef.current = true;
          const result = getEditorValue();
          onSubmit?.(result.value, result.config);
        }
        break;
      case 'shiftEnter':
        if (canSubmit && e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
          e.preventDefault();
          // 设置键盘锁定，防止重复触发
          keyLockRef.current = true;
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
    if (files?.length && onPasteFile) {
      onPasteFile(files[0], files);
      return;
    }

    const text = e.clipboardData?.getData('text/plain');
    if (text) {
      document.execCommand('insertText', false, text);
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
      lastSelectionRef.current = selection.getRangeAt(0);
    }

    onBlur?.(e as unknown as React.FocusEvent<HTMLTextAreaElement>);
  };

  const onInternalInput = (e: React.FormEvent<HTMLDivElement>) => {
    const newValue = getEditorValue();
    onChange?.(
      newValue.value,
      e as unknown as React.ChangeEvent<HTMLTextAreaElement>,
      newValue.config,
    );
  };

  // ============================ Ref Method ============================
  const insert: SlotTextAreaRef['insert'] = (slotConfig) => {
    const editableDom = editableRef.current;
    const selection = window.getSelection();
    if (!editableDom || !selection) return;
    const slotNode = getSlotListNode(slotConfig);

    const { type } = getCursorPosition();
    let range: Range = document.createRange();
    setSlotConfig((ori) => {
      ori?.push(...slotConfig);
      return [...ori];
    });

    setSlotValues(slotConfig);
    // 光标不在输入框内，将内容插入最末位
    if (type === 'outside') {
      selection.removeAllRanges();
      selection.addRange(range);
      range.setStart(editableDom, editableDom.childNodes.length);
    }

    if (type === 'box') {
      range = selection.getRangeAt(0);
    }

    if (type === 'slot') {
      range = selection.getRangeAt(0);
      if (selection?.focusNode?.nextSibling) {
        range.setStartBefore(selection.focusNode.nextSibling);
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
    setTimeout(() => {
      onInternalInput(null as unknown as React.FormEvent<HTMLDivElement>);
    }, 0);
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
    if (propsSlotConfig?.length === 0) return;
    if (editableRef.current && propsSlotConfig) {
      editableRef.current.innerHTML = '';
      const slotNodeList = getSlotListNode(propsSlotConfig);
      slotNodeList.forEach((element) => {
        editableRef.current?.appendChild(element);
      });
      onChange?.(getEditorValue().value, undefined, getEditorValue().config);
    }
  }, [propsSlotConfig]);

  useImperativeHandle(ref, () => ({
    nativeElement: editableRef.current! as unknown as HTMLTextAreaElement,
    focus: (options?: InputFocusOptions) => {
      const editor = editableRef.current;
      if (options?.cursor && editor) {
        editor.focus();
        const selection = window.getSelection();
        if (!selection) return;
        if (options.cursor) {
          const range = document.createRange();
          range.selectNodeContents(editor);
          switch (options.cursor) {
            case 'start': {
              range.collapse(true);
              break;
            }
            case 'end': {
              // 光标移到最后面
              range.collapse(false);
              break;
            }
            case 'all': {
              break;
            }
          }
          selection.removeAllRanges();
          selection.addRange(range);
        }
      } else {
        editor?.focus();
      }
    },
    blur: () => {
      editableRef.current?.blur();
    },
    insert,
    clear,
    getValue: () => {
      return getEditorValue();
    },
  }));

  // ============================ Render =============================
  return (
    <>
      <div
        ref={editableRef}
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
        contentEditable="true"
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
        {...(rest as React.HTMLAttributes<HTMLDivElement>)}
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
