import React from 'react';
import classnames from 'classnames';

import type { BubbleProps } from './interface';
import Loading from './loading';
import useStyle from './style';
import useTypedEffect from './hooks/useTypedEffect';
import getPrefixCls from '../_util/getPrefixCls';
import { Avatar } from 'antd';
import useTypingConfig from './hooks/useTypingConfig';

const Bubble: React.FC<Readonly<BubbleProps>> = (props) => {
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

  const prefixCls = getPrefixCls('bubble', customizePrefixCls);

  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

  const [typingEnabled, typingStep, typingInterval] = useTypingConfig(typing);

  const [typedContent, isTyping] = useTypedEffect(
    content,
    typingEnabled,
    typingStep,
    typingInterval,
  );

  const mergedCls = classnames(
    className,
    rootClassName,
    prefixCls,
    hashId,
    cssVarCls,
    `${prefixCls}-${placement}`,
    { [`${prefixCls}-typing`]: isTyping && !loading && !messageRender },
  );

  // ============================ Avatar ============================
  const avatarNode = React.isValidElement(avatar) ? avatar : <Avatar {...avatar} />;

  // =========================== Content ============================
  const mergedContent = messageRender ? messageRender(typedContent) : typedContent;

  // ============================ Render ============================
  return wrapCSSVar(
    <div style={style} className={mergedCls} {...otherHtmlProps}>
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
        className={classnames(`${prefixCls}-content`, classNames?.content)}
      >
        {loading ? <Loading prefixCls={prefixCls} /> : mergedContent}
      </div>
    </div>,
  );
};

if (process.env.NODE_ENV !== 'production') {
  Bubble.displayName = 'Bubble';
}

export type { BubbleProps };

export default Bubble;
