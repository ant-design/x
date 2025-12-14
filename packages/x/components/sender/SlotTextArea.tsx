import { CaretDownFilled } from '@ant-design/icons';
import pickAttrs from '@rc-component/util/lib/pickAttrs';
import { Dropdown, Input, type InputRef } from 'antd';
import { clsx } from 'clsx';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import warning from '../_util/warning';
import { useXProviderContext } from '../x-provider';
import Skill from './components/Skill';
import { SenderContext } from './context';
import useCursor from './hooks/use-cursor';
import useInputHeight from './hooks/use-input-height';
import useSlotBuilder from './hooks/use-slot-builder';
import useSlotConfigState from './hooks/use-slot-config-state';
import type {
  EventType,
  InsertPosition,
  SkillType,
  SlotConfigBaseType,
  SlotConfigType,
} from './interface';

export interface SlotTextAreaRef {
  focus: (options?: FocusOptions) => void;
  blur: InputRef['blur'];
  nativeElement: InputRef['nativeElement'];
  insert: (
    slotConfig: SlotConfigType[],
    position?: InsertPosition,
    replaceCharacters?: string,
    preventScroll?: boolean,
  ) => void;
  clear: () => void;
  getValue: () => {
    value: string;
    slotConfig: SlotConfigType[];
    skill?: SkillType;
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
    triggerSend,
    placeholder,
    onFocus,
    onBlur,
    slotConfig,
    skill,
    ...restProps
  } = React.useContext(SenderContext);
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
  const skillDomRef = useRef<HTMLDivElement>(null);
  const skillRef = useRef<SkillType>(null);
  const submitDisabledRef = useRef<boolean>(false);

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
  const [slotConfigMap, { getSlotValues, setSlotValues, getNodeInfo, mergeSlotConfig }] =
    useSlotConfigState(slotConfig);
  const [slotPlaceholders, setSlotPlaceholders] = useState<Map<string, React.ReactNode>>(new Map());
  const [skillPlaceholders, setSkillPlaceholders] = useState<React.ReactNode>(null);
  // ============================ Cursor =============================
  const {
    setEndCursor,
    setStartCursor,
    setAllSelectCursor,
    setCursorPosition,
    setSlotFocus,
    setAfterNodeFocus,
    getTextBeforeCursor,
  } = useCursor({
    prefixCls,
    getSlotDom: (key: string) => slotDomMap.current.get(key),
    slotConfigMap,
  });

  // ============================ Slot Builder =============================
  const { buildSkillSpan, buildEditSlotSpan, buildSlotSpan, buildSpaceSpan } = useSlotBuilder({
    prefixCls,
    placeholder,
  });

  // ============================ Methods =============================
  const triggerValueChange = (e?: EventType) => {
    const newValue = getEditorValue();
    if (skillDomRef.current) {
      if (!newValue?.value && newValue.slotConfig.length === 0) {
        skillDomRef.current.setAttribute('contenteditable', 'true');
        skillDomRef.current.classList.add(`${prefixCls}-skill-empty`);
      } else {
        skillDomRef.current.setAttribute('contenteditable', 'false');
        skillDomRef.current.classList.remove(`${prefixCls}-skill-empty`);
      }
    }
    onChange?.(newValue.value, e, newValue.slotConfig, newValue.skill);
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
      triggerValueChange(e);
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
              onKeyDown={onInternalKeyDown}
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
                className={clsx(`${prefixCls}-slot-select`, {
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
      warning(!!slotKey, 'Sender', `Slot key is missing: ${slotKey}`);
      if (slotKey) {
        let slotSpan: HTMLElement[];
        let slotDom: HTMLSpanElement;
        if (config.type === 'content') {
          slotDom = buildEditSlotSpan(config);
          slotSpan = [buildSpaceSpan(slotKey, 'before'), slotDom, buildSpaceSpan(slotKey, 'after')];
        } else {
          slotDom = buildSlotSpan(slotKey);
          slotSpan = [slotDom];
        }
        saveSlotDom(slotKey, slotDom);
        if (slotDom) {
          const reactNode = renderSlot(config, slotDom);
          if (reactNode) {
            setSlotPlaceholders((ori) => {
              const newMap = new Map(ori);
              newMap.set(slotKey, reactNode);
              return newMap;
            });
            nodeList.push(...slotSpan);
          }
        }
      }
      return nodeList;
    }, [] as SlotNode[]);
  };

  const getNodeTextValue = (node: Node): string => {
    const nodeType = node.nodeType;

    if (nodeType === Node.TEXT_NODE) {
      return node.textContent || '';
    }

    if (nodeType !== Node.ELEMENT_NODE) {
      return '';
    }

    const element = node as HTMLElement;
    const nodeInfo = getNodeInfo(element);

    // 无节点信息，直接返回文本内容
    if (!nodeInfo) {
      return element.innerText || '';
    }

    const { slotKey, skillKey, nodeType: infoNodeType, slotConfig } = nodeInfo;

    // 缓存文本内容，避免重复获取
    const textContent = element.innerText || '';

    // 处理 slot 节点
    if (slotKey) {
      if (infoNodeType === 'nbsp') {
        return ' ';
      }
      if (!slotConfig || slotConfig.type === 'content') {
        return textContent;
      }
      const slotValue = getSlotValues()[slotKey] ?? '';
      return slotConfig.formatResult?.(slotValue) ?? slotValue;
    }

    // 处理 skill 节点
    if (skillKey) {
      const skillWrapper = element.querySelector(`.${prefixCls}-skill-wrapper`);
      if (!skillWrapper) {
        return textContent;
      }
      const skillText = skillWrapper.textContent || '';
      return textContent.replace(skillText, '').replace(/\n/g, '');
    }

    return textContent;
  };

  const getEditorValue: SlotTextAreaRef['getValue'] = () => {
    const editableDom = editableRef.current;
    const emptyRes = { value: '', slotConfig: [], skill: undefined };
    if (!editableDom) {
      return emptyRes;
    }

    const childNodes = editableDom.childNodes;
    if (childNodes.length === 0) {
      return emptyRes;
    }

    const hasSkill = !!skill;
    const result: string[] = new Array(childNodes.length);
    const currentSlotConfig: (SlotConfigType & { value: string })[] = [];
    let currentSkillConfig: SkillType | undefined;
    let resultIndex = 0;

    for (let i = 0; i < childNodes.length; i++) {
      const node = childNodes[i];
      const textValue = getNodeTextValue(node);
      result[resultIndex++] = textValue;

      if (node.nodeType === Node.TEXT_NODE) {
        if (textValue) {
          currentSlotConfig.push({
            type: 'text',
            value: textValue,
          });
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        const nodeInfo = getNodeInfo(el);

        if (nodeInfo) {
          const { skillKey, slotKey, nodeType } = nodeInfo;

          if (skillKey && hasSkill) {
            currentSkillConfig = skill;
          }

          if (slotKey && nodeType !== 'nbsp') {
            const nodeConfig = slotConfigMap.get(slotKey);
            if (nodeConfig) {
              currentSlotConfig.push({ ...nodeConfig, value: textValue });
            }
          }
        }
      }
    }

    if (resultIndex === 0) {
      editableDom.innerHTML = '';
      skillDomRef.current = null;
      return emptyRes;
    }

    const finalValue = result.slice(0, resultIndex).join('');

    if (!currentSkillConfig) {
      skillDomRef.current = null;
    }

    return {
      value: finalValue,
      slotConfig: currentSlotConfig,
      skill: currentSkillConfig,
    };
  };

  const initClear = () => {
    const div = editableRef.current;
    if (!div) return;
    div.innerHTML = '';
    skillDomRef.current = null;
    skillRef.current = null;
    slotDomMap?.current?.clear();
  };

  /**
   * 获取插入位置信息
   * @param position - 插入位置类型：'cursor' | 'end' | 'start'
   * @returns 包含插入类型和对应 range 的对象
   */
  const getInsertPosition = (
    position?: InsertPosition,
  ): {
    type: 'box' | 'slot' | 'end' | 'start' | 'content';
    slotType?: SlotConfigBaseType['type'];
    range?: Range;
    selection: Selection | null;
  } => {
    const selection = window?.getSelection?.();
    if (position === 'start' || position === 'end') {
      return { type: position, selection };
    }

    if (!selection || selection.rangeCount === 0) {
      return { type: 'end', selection };
    }

    const range = lastSelectionRef.current || selection.getRangeAt(0);
    if (!range) {
      return { type: 'end', selection };
    }

    const editableDom = editableRef.current;
    if (!editableDom) {
      return { type: 'end', selection };
    }

    const container =
      range.endContainer.nodeType === Node.TEXT_NODE
        ? range.endContainer.parentElement
        : (range.endContainer as HTMLElement);

    if (!container) {
      return { type: 'end', selection };
    }
    const { slotKey, slotConfig } = getNodeInfo(container) || {};

    if (slotKey || slotKey) {
      return { type: 'slot', slotType: slotConfig?.type, range, selection };
    }

    const isInEditableBox = editableDom.contains(range.endContainer);
    if (isInEditableBox) {
      return { type: 'box', range, selection };
    }

    return { type: 'end', selection };
  };

  const appendNodeList = (slotNodeList: HTMLElement[]) => {
    slotNodeList.forEach((element) => {
      editableRef.current?.appendChild(element);
    });
  };

  const removeSlot = (key: string, e?: EventType) => {
    const editableDom = editableRef.current;
    if (!editableDom) return;

    editableDom.querySelectorAll(`[data-slot-key="${key}"]`).forEach((element) => {
      element.remove();
    });

    slotDomMap.current.delete(key);

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
    triggerValueChange(e);
  };

  const insertSkill = () => {
    if (skill && skillRef.current !== skill) {
      removeSkill(false);
      skillRef.current = skill;
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
      skillDomRef.current = skillSpan;
      triggerValueChange();
    }
  };

  const removeSkill = (isChange = true) => {
    const editableDom = editableRef.current;
    if (!editableDom || !skillDomRef.current) return;
    skillDomRef.current?.remove();
    skillDomRef.current = null;
    skillRef.current = null;
    if (isChange) {
      triggerValueChange();
    }
  };
  // 移除<br>标签（仅在enter模式下）
  const removeSpecificBRs = (element: HTMLDivElement | null) => {
    if (submitType !== 'enter' || !element) return;
    element.querySelectorAll('br').forEach((br) => {
      br.remove();
    });
  };

  const initRenderSlot = () => {
    if (slotConfig && slotConfig.length > 0 && editableRef.current) {
      initClear();
      appendNodeList(getSlotListNode(slotConfig) as HTMLElement[]);
    }
  };

  /**
   * 检查是否应该跳过键盘事件处理
   */
  const shouldSkipKeyHandling = (e: React.KeyboardEvent<HTMLDivElement>): boolean => {
    const eventRes = onKeyDown?.(e);
    return keyLockRef.current || isCompositionRef.current || eventRes === false;
  };

  /**
   * 处理退格键删除逻辑
   */
  const handleBackspaceKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== editableRef.current) return;

    const selection = window.getSelection();
    if (!selection) return;

    const { focusOffset, anchorNode } = selection;

    // 处理删除单个字符的slot
    if (focusOffset === 1) {
      const slotKey = (anchorNode?.parentNode as Element)?.getAttribute?.('data-slot-key');
      if (slotKey && anchorNode?.parentNode && anchorNode.textContent?.length === 1) {
        e.preventDefault();
        (anchorNode.parentNode as HTMLElement).innerHTML = '';
        return true;
      }
    }

    // 处理删除整个slot或skill
    if (focusOffset === 0) {
      const nodeInfo = getNodeInfo(anchorNode?.previousSibling as HTMLElement);
      if (nodeInfo) {
        const { slotKey, skillKey } = nodeInfo;
        if (slotKey) {
          e.preventDefault();
          removeSlot(slotKey, e as unknown as EventType);
          return true;
        }
        if (skillKey) {
          e.preventDefault();
          removeSkill();
          return true;
        }
      }
    }

    return false;
  };

  /**
   * 检查是否应该提交表单
   */
  const shouldSubmitForm = (e: React.KeyboardEvent<HTMLDivElement>): boolean => {
    const { key, shiftKey, ctrlKey, altKey, metaKey } = e;
    if (key !== 'Enter') return false;

    const isModifierPressed = ctrlKey || altKey || metaKey;
    return (
      (submitType === 'enter' && !shiftKey && !isModifierPressed) ||
      (submitType === 'shiftEnter' && shiftKey && !isModifierPressed)
    );
  };

  /**
   * 处理skill区域的键盘事件
   */
  const handleSkillAreaKeyEvent = () => {
    if (!skillDomRef.current) return;

    const selection = window.getSelection();
    if (!selection?.anchorNode || !skillDomRef.current.contains(selection.anchorNode)) return;

    skillDomRef.current.setAttribute('contenteditable', 'false');
    skillDomRef.current.classList.remove(`${prefixCls}-skill-empty`);
    focus({ cursor: 'end' });
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
    // 检查是否应该跳过处理
    if (shouldSkipKeyHandling(e)) {
      onKeyDown?.(e as unknown as React.KeyboardEvent<HTMLTextAreaElement>);
      return;
    }

    // 处理退格键
    if (e.key === 'Backspace') {
      if (handleBackspaceKey(e)) return;
    }

    // 处理Enter键提交
    if (shouldSubmitForm(e)) {
      e.preventDefault();
      if (!submitDisabledRef.current) {
        keyLockRef.current = true;
        triggerSend?.();
      }
      return;
    }

    // 处理全选
    if (e.key === 'a' && e.metaKey) {
      setAllSelectCursor(editableRef.current, skillDomRef.current);
      e.preventDefault();
      return;
    }

    // 处理skill区域的键盘事件
    handleSkillAreaKeyEvent();
  };

  const onInternalFocus = (e: React.FocusEvent<HTMLDivElement>) => {
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
    removeSpecificBRs(editableRef?.current);
    triggerValueChange(e as unknown as EventType);
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

  const onInternalSelect: React.ReactEventHandler<HTMLDivElement> = () => {
    const editableDom = editableRef.current;
    const selection = window.getSelection();
    if (
      editableDom &&
      selection?.focusNode === editableDom &&
      selection.focusOffset === 0 &&
      getEditorValue().skill
    ) {
      setCursorPosition(editableDom, editableRef.current, 1);
    }
  };

  // ============================ Ref Method ============================

  const insert: SlotTextAreaRef['insert'] = (
    slotConfig,
    position,
    replaceCharacters,
    preventScroll,
  ) => {
    const editableDom = editableRef.current;
    if (!editableDom) return;
    mergeSlotConfig(slotConfig);
    const slotNode = getSlotListNode(slotConfig);

    const { type, slotType, range: lastRage, selection } = getInsertPosition(position);
    let range: Range | null = null;
    if (type === 'end') {
      const lastNode = editableDom.childNodes[editableDom.childNodes.length - 1];
      if (lastNode.nodeType === Node.TEXT_NODE && lastNode.textContent === '\n') {
        range = setCursorPosition(
          editableDom,
          editableDom,
          editableDom.childNodes.length - 1,
        ).range;
      } else {
        range = setCursorPosition(editableDom, editableDom, editableDom.childNodes.length).range;
      }
    }
    if (type === 'start') {
      range = setCursorPosition(
        editableDom,
        editableRef.current,
        getEditorValue().skill ? 1 : 0,
      ).range;
    }
    if (type === 'box') {
      range = lastRage as Range;
    }
    if (type === 'slot' && selection) {
      range = selection.getRangeAt?.(0) || null;
      if (slotType !== 'content') {
        if (selection.focusNode) {
          range?.setStartAfter(selection.focusNode);
        }
      }
    }
    if (!selection || !range) return;
    // 如果光标前有字符

    if (replaceCharacters?.length) {
      const {
        value: textBeforeCursor,
        startContainer,
        startOffset,
      } = getTextBeforeCursor(editableDom);
      const cursorPosition = textBeforeCursor.length; // 光标位置前的字符数
      if (cursorPosition >= replaceCharacters.length) {
        if (textBeforeCursor.endsWith(replaceCharacters) && startContainer && startOffset >= 0) {
          range.setStart(startContainer, startOffset - replaceCharacters.length);
          range.setEnd(startContainer, startOffset);
          range.deleteContents();
        }
      }
    }
    selection.deleteFromDocument();

    [...slotNode].reverse().forEach((node) => {
      range?.insertNode(node);
    });

    setAfterNodeFocus(
      slotNode[slotNode.length - 1] as HTMLDivElement,
      editableDom,
      range,
      selection,
      preventScroll,
    );
    const timer = setTimeout(() => {
      onInternalInput(null as unknown as React.FormEvent<HTMLDivElement>);
      clearTimeout(timer);
    }, 0);
  };

  const focus = (options?: FocusOptions) => {
    const mergeOptions = {
      preventScroll: options?.preventScroll ?? false,
      cursor: options?.cursor ?? 'end',
      key: (options as SlotFocusOptions)?.key,
    };

    switch (mergeOptions.cursor) {
      case 'slot':
        setSlotFocus(editableRef, (options as SlotFocusOptions)?.key, mergeOptions.preventScroll);
        break;
      case 'start':
        setStartCursor(editableRef.current, mergeOptions.preventScroll);
        break;
      case 'all':
        setAllSelectCursor(editableRef.current, skillDomRef.current, mergeOptions.preventScroll);
        break;
      case 'end':
        setEndCursor(editableRef.current, mergeOptions.preventScroll);
        break;
    }
  };

  const clear = () => {
    const editableDom = editableRef.current;
    if (!editableDom) return;
    editableDom.innerHTML = '';
    skillRef.current = null;
    skillDomRef.current = null;
    slotConfigMap.clear();
    insertSkill();
    setSlotValues({});
    slotDomMap?.current?.clear();
    onInternalInput(null as unknown as React.FormEvent<HTMLDivElement>);
  };

  // ============================ Effects =============================

  useEffect(() => {
    initRenderSlot();
    if (!skill) {
      triggerValueChange();
    } else {
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
      blur: () => editableRef.current?.blur(),
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
        className={clsx(
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
