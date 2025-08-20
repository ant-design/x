import { Button, Flex } from 'antd';
import { useEvent } from 'rc-util';
import React from 'react';
import { useLocale } from '../locale';
import en_US from '../locale/en_US';
import { BubbleProps, EditableBubbleOption } from './interface';

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

  const onConfirm = useEvent(() =>
    // textContent 拒绝直接 xss
    // 但 onEditing 端应该对入参做 xss 防护
    onEditConfirm?.(mockInputRef.current!.textContent || ''),
  );
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
