import classnames from 'classnames';
import React from 'react';
import { useXProviderContext } from '../x-provider';
import Bubble from './Bubble';
import type { BubbleContentType, BubbleProps, BubbleRef, SystemBubbleProps } from './interface';

const SystemBubble: React.ForwardRefRenderFunction<BubbleRef, SystemBubbleProps> = (
  {
    prefixCls: customizePrefixCls,
    content,
    variant = 'shadow',
    shape,
    style,
    className,
    styles,
    classNames,
    rootClassName,
  },
  ref,
) => {
  // ============================ Prefix ============================
  const { getPrefixCls } = useXProviderContext();

  const prefixCls = getPrefixCls('bubble', customizePrefixCls);

  const cls = `${prefixCls}-system`;

  const systemContentRender: BubbleProps['contentRender'] = (content) => {
    return <div className={`${cls}-content`}>{content}</div>;
  };

  return (
    <Bubble
      ref={ref}
      prefixCls={customizePrefixCls}
      style={style}
      className={classnames(className, cls)}
      styles={styles}
      classNames={classNames}
      rootClassName={rootClassName}
      variant={variant}
      shape={shape}
      content={content}
      contentRender={systemContentRender}
    />
  );
};

type ForwardSystemBubbleType = <T extends BubbleContentType = string>(
  props: SystemBubbleProps<T> & { ref?: React.Ref<BubbleRef> },
) => React.ReactElement;

const ForwardSystemBubble = React.forwardRef(SystemBubble);

if (process.env.NODE_ENV !== 'production') {
  ForwardSystemBubble.displayName = 'SystemBubble';
}

export default ForwardSystemBubble as ForwardSystemBubbleType;
