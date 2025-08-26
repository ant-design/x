import { Button, Flex } from 'antd';
import { useEvent } from 'rc-util';
import React from 'react';
import { useLocale } from '../locale';
import en_US from '../locale/en_US';
import { BubbleProps, EditableBubbleOption } from './interface';

/**
 * 判断块级元素（跨浏览器）
 * div.contentEditable 在换行时会注入块级元素以达成换行效果
 * 编辑后提取格式化纯文本，需要识别出这些块级元素并替换为 \n
 * */
function isBlock(el: HTMLElement): boolean {
  const d = getComputedStyle(el).display;
  return d === 'block' || d === 'flex' || d === 'list-item' || d === 'table';
}

function getPlainTextWithFormat(dom: HTMLElement) {
  const lines: string[] = [''];
  const walker = document.createTreeWalker(dom, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);

  while (walker.nextNode()) {
    const node = walker.currentNode as HTMLElement;

    if (node.nodeType === Node.TEXT_NODE) {
      // textContent 拒绝直接 xss
      lines[lines.length - 1] += node.textContent;
      continue;
    }

    // 单纯空行结构 <div><br></div>（chrome/edge/safari/firefox)，仅保留一个换行
    if (node.tagName === 'BR' && node.parentNode?.childElementCount === 1) {
      continue;
    }

    // 换行
    if (node.tagName === 'BR' || isBlock(node)) {
      lines.push('');
    }
  }

  return lines.join('\n');
}

export const EditableContent: React.FC<{
  content: string;
  prefixCls: BubbleProps['prefixCls'];
  okText?: EditableBubbleOption['okText'];
  cancelText?: EditableBubbleOption['cancelText'];
  onEditConfirm?: BubbleProps['onEditConfirm'];
  onEditCancel?: BubbleProps['onEditCancel'];
}> = ({ content, prefixCls, okText, cancelText, onEditConfirm, onEditCancel }) => {
  const mockInputRef = React.useRef<HTMLDivElement>(null);

  const [contextLocale] = useLocale('Bubble', en_US.Bubble);

  const onConfirm = useEvent(() => {
    // 但 onEditing 端应该对入参做 xss 防护
    onEditConfirm?.(getPlainTextWithFormat(mockInputRef.current!));
  });
  const onCancel = useEvent(() => onEditCancel?.());

  React.useEffect(() => {
    mockInputRef.current!.textContent = content;
    mockInputRef.current!.focus();
    const selection = window.getSelection()!;
    const range = document.createRange();
    range.selectNodeContents(mockInputRef.current!);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }, []);

  // 拒绝非 string content，保证 div 渲染纯文本（Text Node）而不是 HTML
  if (typeof content !== 'string') throw new Error('Content of editable Bubble should be string');

  // 避免组件更新，影响光标位置
  // 初始化文本使用 content，后续由编辑内容确定
  const memoedMockInput = React.useMemo(
    () => (
      /**
       * 为什么使用 div
       * input、textarea 是固定行为、固定宽高的元素，无法对内容自适应，体验差
       * div.contentEditable 提供了编辑 innerHTML 的能力，同时具备内容自适应能力，体验好
       */
      <div ref={mockInputRef} contentEditable />
    ),
    [],
  );

  return (
    <>
      {memoedMockInput}
      <Flex rootClassName={`${prefixCls}-editing-opts`} gap={8}>
        <Button type="primary" shape="round" size="small" onClick={onConfirm}>
          {okText || contextLocale.editableOk}
        </Button>
        <Button type="text" shape="round" size="small" onClick={onCancel}>
          {cancelText || contextLocale.editableCancel}
        </Button>
      </Flex>
    </>
  );
};
