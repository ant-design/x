import classnames from 'classnames';
import React from 'react';

import { Avatar } from 'antd';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useXProviderContext } from '../x-provider';
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
    classNames = {},
    styles = {},
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
  const { direction, getPrefixCls } = useXProviderContext();

  const prefixCls = getPrefixCls('bubble', customizePrefixCls);

  // ===================== Component Config =========================
  const contextConfig = useXComponentConfig('bubble');

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
    prefixCls,
    rootClassName,
    contextConfig.className,
    className,
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
  const mergedContent = messageRender ? messageRender(typedContent) : typedContent;

  // ============================ Render ============================
  return wrapCSSVar(
    <div
      style={{
        ...contextConfig.style,
        ...style,
      }}
      className={mergedCls}
      {...otherHtmlProps}
      ref={divRef}
    >
      {/* Avatar */}
      {avatar && (
        <div
          style={{
            ...contextConfig.styles.avatar,
            ...styles.avatar,
          }}
          className={classnames(
            `${prefixCls}-avatar`,
            contextConfig.classNames.avatar,
            classNames.avatar,
          )}
        >
          {avatarNode}
        </div>
      )}

      {/* Content */}
      <div
        style={{
          ...contextConfig.styles.content,
          ...styles.content,
        }}
        className={classnames(
          `${prefixCls}-content`,
          contextConfig.classNames.content,
          classNames.content,
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
