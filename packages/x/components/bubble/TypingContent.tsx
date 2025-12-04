import classNames from 'classnames';
import React from 'react';
import { useTyping } from './hooks/useTyping';
import { BubbleAnimationOption, BubbleProps } from './interface';

export const TypingContent: React.FC<{
  prefixCls: string;
  streaming: boolean;
  content: string;
  typing: true | BubbleAnimationOption;
  onTyping?: BubbleProps['onTyping'];
  onTypingComplete?: BubbleProps['onTypingComplete'];
}> = ({ prefixCls, streaming, content, typing, onTyping, onTypingComplete }) => {
  const { renderedData, animating, memoedAnimationCfg } = useTyping({
    streaming,
    content,
    typing,
    onTyping,
    onTypingComplete,
  });
  const { effect } = memoedAnimationCfg;
  // 渲染元素
  const elements: string | React.ReactNode[] = renderedData.map((item) =>
    effect === 'fade-in' && !item.done ? (
      <span key={item.id} className="fade-in">
        {item.text}
      </span>
    ) : (
      item.text
    ),
  );
  const isTyping = typing === true ? false : effect === 'typing';

  return (
    <div
      className={classNames({
        [`${prefixCls}-typing`]: true,
        [`${prefixCls}-fade-in`]: !isTyping,
      })}
    >
      {elements}
    </div>
  );
};
