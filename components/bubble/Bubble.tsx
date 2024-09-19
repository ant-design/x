import classnames from 'classnames';
import React from 'react';

import { Avatar } from 'antd';
import mergeStyles from '../_util/merge-styles';
import { useXProvider } from '../x-provider';
import useTypedEffect from './hooks/useTypedEffect';
import useTypingConfig from './hooks/useTypingConfig';
import type { BubbleProps } from './interface';
import Loading from './loading';
import useStyle from './style';

export interface BubbleRef {
  nativeElement: HTMLElement;
}

export interface BubbleContextProps {
  onUpdate?: VoidFunction;
}

export const BubbleContext = React.createContext<BubbleContextProps>({});

const Bubble: React.ForwardRefRenderFunction<BubbleRef, BubbleProps> = (props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    rootClassName,
    style,
    classNames,
    styles,
    avatar,
    placement = 'start',
    loading = false,
    typing,
    content = '',
    messageRender,
    ...otherHtmlProps
  } = props;

  const { onUpdate } = React.useContext(BubbleContext);

  // ============================= Refs =============================
  const divRef = React.useRef<HTMLDivElement>(null);

  React.useImperativeHandle(ref, () => ({
    nativeElement: divRef.current!,
  }));

  // ============================ Prefix ============================
  const { direction, getPrefixCls, bubble } = useXProvider();

  const prefixCls = getPrefixCls('bubble', customizePrefixCls);

  // ============================ Typing ============================
  const [typingEnabled, typingStep, typingInterval] = useTypingConfig(typing);

  const [typedContent, isTyping] = useTypedEffect(
    content,
    typingEnabled,
    typingStep,
    typingInterval,
  );

  React.useEffect(() => {
    onUpdate?.();
  }, [typedContent]);

  // ============================ Styles ============================
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

  const mergedCls = classnames(
    className,
    rootClassName,
    prefixCls,
    hashId,
    cssVarCls,
    bubble?.className,
    `${prefixCls}-${placement}`,
    {
      [`${prefixCls}-rtl`]: direction === 'rtl',
      [`${prefixCls}-typing`]: isTyping && !loading && !messageRender,
    },
  );

  // ============================ Avatar ============================
  const avatarNode = React.isValidElement(avatar) ? avatar : <Avatar {...avatar} />;

  // =========================== Content ============================
  const mergedContent = messageRender ? messageRender(typedContent) : typedContent;

  // ============================ Render ============================
  return wrapCSSVar(
    <div
      style={mergeStyles(style, bubble?.style)}
      className={mergedCls}
      {...otherHtmlProps}
      ref={divRef}
    >
      {/* Avatar */}
      {avatar && (
        <div
          style={mergeStyles(styles?.avatar, bubble?.styles?.avatar)}
          className={classnames(
            `${prefixCls}-avatar`,
            classNames?.avatar,
            bubble?.classNames?.avatar,
          )}
        >
          {avatarNode}
        </div>
      )}

      {/* Content */}
      <div
        style={mergeStyles(styles?.content, bubble?.styles?.content)}
        className={classnames(
          `${prefixCls}-content`,
          classNames?.content,
          bubble?.classNames?.content,
        )}
      >
        {loading ? <Loading prefixCls={prefixCls} /> : mergedContent}
      </div>
    </div>,
  );
};

const ForwardBubble = React.forwardRef(Bubble);

if (process.env.NODE_ENV !== 'production') {
  ForwardBubble.displayName = 'Bubble';
}

export default ForwardBubble;
