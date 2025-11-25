import { CaretDownFilled } from '@ant-design/icons';
import { Dropdown, Input, InputRef } from 'antd';
import classnames from 'classnames';
import pickAttrs from 'rc-util/lib/pickAttrs';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import warning from '../_util/warning';
import { useXProviderContext } from '../x-provider';
import Skill from './components/Skill';
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
    skill,
    ...restProps
  } = React.useContext(SenderContext);
  const slotConfigRef = useRef<SlotConfigType[]>([...(slotConfig || [])]);

  // ============================= MISC =============================
  const { direction, getPrefixCls } = useXProviderContext();
  const prefixCls = `${getPrefixCls('sender', customizePrefixCls)}`;
  const contextConfig = useXComponentConfig('sender');
  const inputCls = `${prefixCls}-input`;

  // ============================ Refs =============================
  const editableRef = useRef<HTMLDivElement>(null);
  const slotDomMap = useRef<Map<string, HTMLSpanElement>>(new Map());
  const isCompositionRef = useRef<boolean>(false);
  const keyLockRef = useRef<boolean>(false);
  const lastSelectionRef = useRef<Range | null>(null);
  const slotInnerRef = useRef<boolean>(false);
  const skillDom = useRef<HTMLSpanElement>(null);

  // ============================ Style =============================

  const mergeStyle = { ...contextConfig.styles?.input, ...styles.input };
  const inputHeightStyle = useInputHeight(mergeStyle, autoSize, editableRef);

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

  const [slotConfigMap, getSlotValues, setSlotValues, setSlotConfigMap] = useSlotConfigState(
    slotConfig || [],
  );

  const [slotPlaceholders, setSlotPlaceholders] = useState<Map<string, React.ReactNode>>(new Map());
  const [skillPlaceholders, setSkillPlaceholders] = useState<React.ReactNode>(null);
  // ============================ Methods =============================
  const buildSlotSpan = (key: string) => {
    const span = document.createElement('span');

    span.setAttribute('contenteditable', 'false');
    span.dataset.slotKey = key;
    span.className = `${prefixCls}-slot`;

    return span;
  };

  const buildSkillSpan = (key: string) => {
    const span = document.createElement('span');
    span.setAttribute('contenteditable', 'false');
    span.dataset.skillKey = key;
    span.className = `${prefixCls}-skill`;
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
      return '';
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
        const slotType = el.getAttribute('data-node-type');
        if (slotKey && slotType !== 'nbsp') {
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

  /**
   * 获取插入位置信息
   * @param position - 插入位置类型：'cursor' | 'end' | 'start'
   * @returns 包含插入类型和对应 range 的对象
   */
  const getInsertPosition = (
    position: insertPosition,
  ): {
    type: 'box' | 'slot' | 'end' | 'start';
    range?: Range;
  } => {
    // 处理特殊位置：开始和结束
    if (position === 'start') {
      return { type: 'start' };
    }
    if (position === 'end') {
      return { type: 'end' };
    }

    const selection = window?.getSelection?.();
    if (!selection) {
      return { type: 'end' };
    }

    // 获取有效的 range
    const currentRange = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
    const range = lastSelectionRef.current || currentRange;
    if (!range) {
      return { type: 'end' };
    }

    const editableDom = editableRef.current;
    if (!editableDom) {
      return { type: 'end' };
    }

    // 检查是否在 slot 元素内
    const endContainer = range.endContainer as HTMLElement;
    if (endContainer?.className?.includes(`${prefixCls}-slot`)) {
      return { type: 'slot', range };
    }

    // 检查是否在编辑框内
    const isInEditableBox =
      range.endContainer === editableDom || range.endContainer.parentElement === editableDom;

    if (isInEditableBox) {
      return { type: 'box', range };
    }

    // 默认返回结束位置
    return { type: 'end' };
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

  const insertSkill = () => {
    if (slotInnerRef.current && skill) {
      removeSkill();
      const skillSpan = buildSkillSpan(skill.value);
      const reactNode = createPortal(
        <Skill removeSkill={removeSkill} {...skill} prefixCls={prefixCls} />,
        skillSpan,
      );
      setSkillPlaceholders(reactNode);
      const range: Range = document.createRange();
      const editableDom = editableRef.current;
      if (!editableDom) return;
      range.setStart(editableDom, 0);
      range.insertNode(skillSpan);
      skillDom.current = skillSpan;
    }
  };

  const removeSkill = () => {
    const editableDom = editableRef.current;
    if (!editableDom) return;
    skillDom.current?.remove();
    skillDom.current = null;
  };
  // 移除<br>标签（仅在enter模式下）
  const removeSpecificBRs = (element: HTMLDivElement | null) => {
    if (submitType !== 'enter' || !element) return;
    element.querySelectorAll('br').forEach((br) => {
      br.remove();
    });
  };

  const slotFocus = (key?: string) => {
    const editor = editableRef.current;
    if (!editor) return;
    // 处理 slot 类型的焦点

    const focusSlotInput = () => {
      // 如果指定了 key，直接查找对应的 slot
      if (key) {
        const slotDom = getSlotDom(key);
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
      setCursorPosition(targetElement, 0);
    }
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

  const setCursorPosition = (element: Node, position: number) => {
    // 创建一个range对象

    const range = document.createRange();
    // 设置range的起始点和结束点

    range.setStart(element, position);
    range.setEnd(element, position);

    // 创建一个selection对象
    const selection = window.getSelection();
    if (selection) {
      // 清除之前的selection
      selection.removeAllRanges();
      // 添加新的range到selection
      range.collapse(false);
      selection.addRange(range);
    }
  };

  const onInternalSelect: React.ReactEventHandler<HTMLDivElement> = () => {
    const editableDom = editableRef.current;
    const selection = window.getSelection();
    if (
      editableDom &&
      selection?.focusNode === editableDom &&
      selection.focusOffset === 0 &&
      skillDom.current
    ) {
      setCursorPosition(editableDom, 1);
    }
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
      const lastNode = editableDom.childNodes[editableDom.childNodes.length - 1];
      if (lastNode.nodeType === Node.TEXT_NODE && lastNode.textContent === '\n') {
        range.setStart(editableDom, editableDom.childNodes.length - 1);
      } else {
        range.setStart(editableDom, editableDom.childNodes.length);
      }
    }
    if (type === 'start') {
      range.setStart(editableDom, skillDom.current ? 1 : 0);
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
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);

    const timer = setTimeout(() => {
      onInternalInput(null as unknown as React.FormEvent<HTMLDivElement>);
      clearTimeout(timer);
    }, 0);
  };

  const focus = (options?: FocusOptions) => {
    const editor = editableRef.current;
    if (!editor) return;
    editor.focus();
    if (!options?.cursor) return;
    // 处理 slot 类型的焦点
    if (options?.cursor === 'slot') {
      return slotFocus(options?.key);
    }
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
    slotInnerRef.current = false;
    slotDomMap?.current?.clear();
    onInternalInput(null as unknown as React.FormEvent<HTMLDivElement>);
  };

  const clear = () => {
    const editableDom = editableRef.current;
    if (!editableDom) return;
    editableDom.innerHTML = '';
    insertSkill();
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
      slotInnerRef.current = true;
      insertSkill();
    }
  }, [slotConfig]);

  useEffect(() => {
    insertSkill();
  }, [skill]);

  useImperativeHandle(ref, () => {
    return {
      nativeElement: editableRef.current! as unknown as HTMLTextAreaElement,
      focus,
      blur: () => {
        editableRef.current?.blur();
      },
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
        onSelect={onInternalSelect}
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
        {skillPlaceholders}
      </div>
    </>
  );
});

if (process.env.NODE_ENV !== 'production') {
  SlotTextArea.displayName = 'SlotTextArea';
}

export default SlotTextArea;
