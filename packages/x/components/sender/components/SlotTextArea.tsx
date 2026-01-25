import { CaretDownFilled } from '@ant-design/icons';
import pickAttrs from '@rc-component/util/lib/pickAttrs';
import { Dropdown, Input, type InputRef } from 'antd';
import { clsx } from 'clsx';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import useXComponentConfig from '../../_util/hooks/use-x-component-config';
import warning from '../../_util/warning';
import { useXProviderContext } from '../../x-provider';
import { SenderContext } from '../context';
import useCursor from '../hooks/use-cursor';
import useInputHeight from '../hooks/use-input-height';
import useSlotBuilder from '../hooks/use-slot-builder';
import useSlotConfigState from '../hooks/use-slot-config-state';
import type {
  EventType,
  InsertPosition,
  SkillType,
  SlotConfigBaseType,
  SlotConfigType,
} from '../interface';
import Skill from './Skill';

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
  const skillDomRef = useRef<HTMLSpanElement>(null);
  const skillRef = useRef<SkillType>(null);

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
  const [
    slotConfigMap,
    { getSlotValues, setSlotValues, getNodeInfo, mergeSlotConfig, getNodeTextValue },
  ] = useSlotConfigState(slotConfig);
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
    removeAllRanges,
    getRange,
    getInsertPosition,
    getEndRange,
    getStartRange,
    getSelection,
    copySelectionString,
    getCleanedText,
  } = useCursor({
    prefixCls,
    getSlotDom: (key: string) => slotDomMap.current.get(key),
    slotConfigMap,
    getNodeInfo,
    getEditorValue: () => getEditorValue(),
  });

  // ============================ Slot Builder =============================
  const {
    buildSkillSpan,
    buildEditSlotSpan,
    buildSlotSpan,
    buildSpaceSpan,
    getSlotDom,
    saveSlotDom,
    getSlotLastDom,
  } = useSlotBuilder({
    prefixCls,
    placeholder,
    slotDomMap,
    slotConfigMap,
  });

  // ============================ Methods =============================
  const triggerValueChange = (e?: EventType) => {
    const newValue = getEditorValue();
    if (skillDomRef.current) {
      if (!newValue?.value && newValue.slotConfig.length === 0 && placeholder) {
        skillDomRef.current.setAttribute('contenteditable', 'true');
        skillDomRef.current.classList.add(`${prefixCls}-skill-empty`);
      } else {
        skillDomRef.current.setAttribute('contenteditable', 'false');
        skillDomRef.current.classList.remove(`${prefixCls}-skill-empty`);
      }
    }
    onChange?.(newValue.value, e, newValue.slotConfig, newValue.skill);
  };

  const updateSlot = (key: string, value: any, e?: EventType) => {
    const slotDom = getSlotDom(key);
    const config = slotConfigMap.get(key);
    setSlotValues((prev) => ({ ...prev, [key]: value }));
    if (slotDom && config) {
      const newReactNode = renderSlot(config, slotDom);
      setSlotPlaceholders((prev) => {
        const newMap = new Map(prev);
        newMap.set(key, newReactNode);
        return newMap;
      });

      // 触发 onChange 回调
      triggerValueChange(e);
    }
  };

  const renderSlot = (config: SlotConfigType, slotSpan: HTMLSpanElement) => {
    if (!config.key) return null;
    const value = getSlotValues()[config.key];

    const renderContent = () => {
      switch (config.type) {
        case 'content':
          slotSpan.innerHTML = value || '';
          slotSpan.setAttribute('data-placeholder', config.props?.placeholder || '');
          return null;
        case 'input':
          return (
            <Input
              readOnly={readOnly}
              className={`${prefixCls}-slot-input`}
              placeholder={config.props?.placeholder || ''}
              data-slot-input={config.key}
              size="small"
              variant="borderless"
              value={value || ''}
              tabIndex={0}
              onKeyDown={onInternalKeyDown}
              onChange={(e) => {
                updateSlot(config.key as string, e.target.value, e as unknown as EventType);
              }}
              spellCheck={false}
            />
          );
        case 'select':
          return (
            <Dropdown
              disabled={readOnly}
              menu={{
                items: config.props?.options?.map((opt: any) => ({
                  label: opt,
                  key: opt,
                })),
                defaultSelectedKeys: config.props?.defaultValue ? [config.props.defaultValue] : [],
                selectable: true,
                onSelect: ({ key, domEvent }) => {
                  updateSlot(config.key as string, key, domEvent as unknown as EventType);
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
                  data-placeholder={config.props?.placeholder}
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
            <span className={`${prefixCls}-slot-tag`}>
              {config.props?.label || config.props?.value || ''}
            </span>
          );
        case 'custom':
          return config.customRender?.(
            value,
            (value: any) => {
              updateSlot(config.key as string, value);
            },
            { disabled, readOnly },
            config,
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
          const before = buildSpaceSpan(slotKey, 'before');
          const after = buildSpaceSpan(slotKey, 'after');
          slotSpan = [before, slotDom, after];
          saveSlotDom(`${slotKey}_before`, before);
          saveSlotDom(slotKey, slotDom);
          saveSlotDom(`${slotKey}_after`, after);
        } else {
          slotDom = buildSlotSpan(slotKey);
          slotSpan = [slotDom];
          saveSlotDom(slotKey, slotDom);
        }
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

  const getEditorValue: SlotTextAreaRef['getValue'] = () => {
    const editableDom = editableRef.current;
    const emptyRes = { value: '', slotConfig: [], skill: undefined };
    if (!editableDom) {
      return emptyRes;
    }

    const childNodes = editableDom.childNodes;
    if (childNodes.length === 0) {
      editableDom.innerHTML = '';
      skillDomRef.current = null;
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
    lastSelectionRef.current = null;
    removeAllRanges();
    slotDomMap?.current?.clear();
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

  // 检查是否应该跳过键盘事件处理
  const shouldSkipKeyHandling = (e: React.KeyboardEvent<HTMLDivElement>): boolean => {
    const eventRes = onKeyDown?.(e);
    return keyLockRef.current || isCompositionRef.current || eventRes === false;
  };

  // 处理删除操作（退格键、剪切等）
  const handleDeleteOperation = (
    e: React.KeyboardEvent<HTMLDivElement> | React.ClipboardEvent<HTMLDivElement>,
    operationType: 'backspace' | 'cut' | 'delete',
  ): boolean => {
    if (!editableRef.current) return false;
    const { range, selection } = getRange();

    if (!selection || selection.rangeCount === 0) return false;
    const { focusOffset, anchorNode } = selection;
    if (!anchorNode || !editableRef.current.contains(anchorNode)) {
      return false;
    }

    // 处理文本节点中的slot删除
    if (anchorNode.nodeType === Node.TEXT_NODE && range) {
      const parentElement = anchorNode.parentNode as HTMLElement;
      const nodeInfo = getNodeInfo(parentElement);
      const selectedText = range.toString();
      const isFullTextSelected = anchorNode.textContent?.length === selectedText.length;
      const isSingleCharAtEnd = anchorNode.textContent?.length === 1 && focusOffset === 1;
      if (nodeInfo?.slotConfig?.type === 'content' && (isFullTextSelected || isSingleCharAtEnd)) {
        e.preventDefault();
        if (operationType === 'cut') {
          copySelectionString();
        }
        (anchorNode.parentNode as HTMLElement).innerHTML = '';
        return true;
      }
    }

    // 处理退格键删除前一个元素
    if (operationType === 'backspace' && focusOffset === 0) {
      const previousSibling = anchorNode.previousSibling;
      if (previousSibling) {
        const nodeInfo = getNodeInfo(previousSibling as HTMLElement);
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
    }

    return false;
  };

  // 检查是否应该提交表单
  const shouldSubmitForm = (e: React.KeyboardEvent<HTMLDivElement>): boolean => {
    const { key, shiftKey, ctrlKey, altKey, metaKey } = e;
    if (key !== 'Enter') return false;

    const isModifierPressed = ctrlKey || altKey || metaKey;
    return (
      (submitType === 'enter' && !shiftKey && !isModifierPressed) ||
      (submitType === 'shiftEnter' && shiftKey && !isModifierPressed)
    );
  };

  //  处理skill区域的键盘事件

  const handleSkillAreaKeyEvent = () => {
    if (
      !skillDomRef.current ||
      !editableRef.current ||
      skillDomRef.current.getAttribute('contenteditable') === 'false'
    ) {
      return;
    }
    const selection = getSelection();
    if (
      !selection?.anchorNode ||
      !skillDomRef.current.contains(selection.anchorNode) ||
      !editableRef.current.contains(selection.anchorNode)
    )
      return;
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
    keyLockRef.current = false;
  };

  const onInternalKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // 检查是否应该跳过处理
    if (shouldSkipKeyHandling(e)) {
      return;
    }

    // 处理退格键删除
    if (e.key === 'Backspace') {
      if (handleDeleteOperation(e, 'backspace')) return;
    }

    // 处理Enter键提交
    if (shouldSubmitForm(e)) {
      e.preventDefault();
      keyLockRef.current = true;
      triggerSend?.();
      return;
    }

    // 处理全选 (支持 Ctrl+A 和 Cmd+A)
    if ((e.key === 'a' || e.key === 'A') && (e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey) {
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
    const { range } = getRange();
    lastSelectionRef.current = range;

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

  const onInternalCut = (e: React.ClipboardEvent<HTMLDivElement>) => {
    handleDeleteOperation(e, 'cut');
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
      let success = false;
      const cleanedText = getCleanedText(text);
      try {
        success = document.execCommand('insertText', false, cleanedText);
      } catch (err) {
        warning(false, 'Sender', `insertText command failed: ${err}`);
      }

      if (!success) {
        insert([{ type: 'text', value: cleanedText }]);
      }
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
    const selection = getSelection();
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

    try {
      // 合并配置并生成节点
      mergeSlotConfig(slotConfig);
      const slotNodes = getSlotListNode(slotConfig);
      if (slotNodes.length === 0) return;

      // 获取插入位置和范围
      const insertContext = getInsertContext(position, editableDom);
      if (!insertContext.range || !insertContext.selection) return;

      const { range, selection } = insertContext;

      // 处理字符替换
      if (replaceCharacters?.length) {
        handleCharacterReplacement(range, replaceCharacters, editableDom);
      }
      range.deleteContents();
      // 执行节点插入
      insertNodesWithPosition(slotNodes, range, insertContext);

      // 设置光标位置并触发更新
      finalizeInsertion(slotNodes, range, selection, preventScroll);
    } catch (error) {
      warning(false, 'Sender', `Insert operation failed: ${error}`);
    }
  };

  // 获取插入上下文信息
  const getInsertContext = (
    position: InsertPosition | undefined,
    editableDom: HTMLDivElement,
  ): {
    range: Range | null;
    selection: Selection | null;
    type: string;
    slotKey?: string;
    slotType?: SlotConfigBaseType['type'];
  } => {
    const {
      type,
      slotKey,
      slotType,
      range: lastRange,
      selection,
    } = getInsertPosition(position, editableRef, lastSelectionRef);

    if (!selection) {
      return { range: null, selection: null, type };
    }

    let range: Range | null = null;

    switch (type) {
      case 'end':
        range = getEndRange(editableDom);
        break;
      case 'start':
        range = getStartRange(editableDom);
        break;
      case 'slot':
        range = getRange().range;
        break;
      case 'box':
        range = lastRange || null;
        if (range && skillDomRef.current && range.collapsed && range.startOffset === 0) {
          range.setStartAfter(skillDomRef.current);
        }
        break;
    }

    return { range, selection, type, slotKey, slotType };
  };

  // 处理字符替换
  const handleCharacterReplacement = (
    range: Range,
    replaceCharacters: string,
    editableDom: HTMLDivElement,
  ): void => {
    const {
      value: textBeforeCursor,
      startContainer,
      startOffset,
    } = getTextBeforeCursor(editableDom);
    const cursorPosition = textBeforeCursor.length;
    if (
      cursorPosition >= replaceCharacters.length &&
      textBeforeCursor.endsWith(replaceCharacters) &&
      startContainer &&
      startOffset >= 0
    ) {
      range.setStart(startContainer, startOffset - replaceCharacters.length);
      range.setEnd(startContainer, startOffset);
      range.deleteContents();
    }
  };

  /**
   * 根据位置插入节点
   */
  const insertNodesWithPosition = (
    slotNodes: SlotNode[],
    range: Range,
    context: { type: string; slotKey?: string; slotType?: SlotConfigBaseType['type'] },
  ): void => {
    const { type, slotKey, slotType } = context;

    let shouldSkipFirstNode = true;
    slotNodes.forEach((node) => {
      // 处理slot插入的特殊逻辑
      if (
        shouldSkipFirstNode &&
        type === 'slot' &&
        (slotType !== 'content' || node.nodeType !== Node.TEXT_NODE) &&
        slotKey
      ) {
        shouldSkipFirstNode = false;
        const lastDom = getSlotLastDom(slotKey);
        if (lastDom) {
          range.setStartAfter(lastDom as HTMLSpanElement);
        }
      }

      range.insertNode(node);
      range.setStartAfter(node);
    });
  };

  // 完成插入操作，设置光标并触发更新
  const finalizeInsertion = (
    slotNodes: SlotNode[],
    range: Range,
    selection: Selection,
    preventScroll?: boolean,
  ): void => {
    const lastNode = slotNodes[slotNodes.length - 1] as HTMLDivElement;
    setAfterNodeFocus(lastNode, editableRef.current!, range, selection, preventScroll);

    // 延迟触发输入事件以确保DOM更新完成
    setTimeout(() => {
      onInternalInput(null as unknown as React.FormEvent<HTMLDivElement>);
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
    lastSelectionRef.current = null;
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
        onCut={onInternalCut}
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
