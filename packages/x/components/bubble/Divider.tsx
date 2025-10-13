import { Divider, DividerProps } from 'antd';
import classnames from 'classnames';
import React from 'react';
import { useXProviderContext } from '../x-provider';
import Bubble from './Bubble';
import type { BubbleContentType, BubbleProps, BubbleRef, DividerBubbleProps } from './interface';

const DividerBubble: React.ForwardRefRenderFunction<BubbleRef, DividerBubbleProps> = (
  {
    prefixCls: customizePrefixCls,
    content = '',
    rootClassName,
    style,
    className,
    styles,
    classNames,
    dividerProps,
  },
  ref,
) => {
  // ============================ Prefix ============================
  const { getPrefixCls } = useXProviderContext();

  const prefixCls = getPrefixCls('bubble', customizePrefixCls);

  const mergeDividerProps: DividerProps = {
    ...dividerProps,
    prefixCls: customizePrefixCls,
    styles: styles?.divider,
    classNames: classNames?.divider,
  };

  const dividerContentRender: BubbleProps['contentRender'] = (content) => {
    return <Divider {...mergeDividerProps}>{content}</Divider>;
  };

  return (
    <Bubble
      ref={ref}
      style={{ ...style, ...styles?.root }}
      className={classnames(`${prefixCls}-divider`, className)}
      rootClassName={classnames(rootClassName, classNames?.root)}
      prefixCls={customizePrefixCls}
      variant="borderless"
      content={content}
      contentRender={dividerContentRender}
    />
  );
};

type ForwardDividerBubbleType = <T extends BubbleContentType = string>(
  props: DividerBubbleProps<T> & { ref?: React.Ref<BubbleRef> },
) => React.ReactElement;

const ForwardDividerBubble = React.forwardRef(DividerBubble);

if (process.env.NODE_ENV !== 'production') {
  ForwardDividerBubble.displayName = 'DividerBubble';
}

export default ForwardDividerBubble as ForwardDividerBubbleType;
