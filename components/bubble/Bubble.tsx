import classnames from 'classnames';
import React from 'react';

import { Avatar } from 'antd';
import { useConfigContext } from '../config-provider';
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
    variant = 'filled',
    onTypingComplete,
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

  const triggerTypingCompleteRef = React.useRef(false);
  React.useEffect(() => {
    if (!isTyping && !loading) {
      // StrictMode will trigger this twice,
      // So we need a flag to avoid that
      if (!triggerTypingCompleteRef.current) {
        triggerTypingCompleteRef.current = true;
        onTypingComplete?.();
      }
    } else {
      triggerTypingCompleteRef.current = false;
    }
  }, [isTyping, loading]);

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
  const mergedContent = messageRender ? messageRender(typedContent as any) : typedContent;

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
        {loading ? <Loading prefixCls={prefixCls} /> : (mergedContent as React.ReactNode)}
      </div>
    </div>,
  );
};

const ForwardBubble = React.forwardRef(Bubble);

if (process.env.NODE_ENV !== 'production') {
  ForwardBubble.displayName = 'Bubble';
}

export default ForwardBubble;
