import React from 'react';
import classnames from 'classnames';

import type { BubbleProps } from './interface';
import Loading from './loading';
import useStyle from './style';
import useTypedEffect from './hooks/useTypedEffect';
import { Avatar } from 'antd';
import useTypingConfig from './hooks/useTypingConfig';
import { useConfigContext } from '../config-provider';

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
    variant = 'filled',
    ...otherHtmlProps
  } = props;

  const { onUpdate } = React.useContext(BubbleContext);

  // ============================= Refs =============================
  const divRef = React.useRef<HTMLDivElement>(null);

  React.useImperativeHandle(ref, () => ({
    nativeElement: divRef.current!,
  }));

  // ============================ Prefix ============================
  const { direction, getPrefixCls } = useConfigContext();

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
    `${prefixCls}-${placement}`,
    {
      [`${prefixCls}-rtl`]: direction === 'rtl',
      [`${prefixCls}-typing`]: isTyping && !loading && !messageRender,
    },
  );

  // ============================ Avatar ============================
  const avatarNode = React.isValidElement(avatar) ? avatar : <Avatar {...avatar} />;

  // =========================== Content ============================
  const mergedContent =
    messageRender && typeof typedContent === 'string' ? messageRender(typedContent) : typedContent;

  // ============================ Render ============================
  return wrapCSSVar(
    <div style={style} className={mergedCls} {...otherHtmlProps} ref={divRef}>
      {/* Avatar */}
      {avatar && (
        <div
          style={styles?.avatar}
          className={classnames(`${prefixCls}-avatar`, classNames?.avatar)}
        >
          {avatarNode}
        </div>
      )}

      {/* Content */}
      <div
        style={styles?.content}
        className={classnames(
          `${prefixCls}-content`,
          `${prefixCls}-content-${variant}`,
          classNames?.content,
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
