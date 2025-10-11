import { Divider } from 'antd';
import React from 'react';
import { useXProviderContext } from '../x-provider';
import Bubble from './Bubble';
import type { BubbleContentType, BubbleProps, BubbleRef, DividerBubbleProps } from './interface';

const DividerBubble: React.ForwardRefRenderFunction<BubbleRef, DividerBubbleProps> = (
  { prefixCls: customizePrefixCls, content = '', dividerProps },
  ref,
) => {
  // ============================ Prefix ============================
  const { getPrefixCls } = useXProviderContext();

  const prefixCls = getPrefixCls('bubble', customizePrefixCls);

  const dividerContentRender: BubbleProps['contentRender'] = (content) => {
    return (
      <Divider prefixCls={customizePrefixCls} {...dividerProps}>
        {content}
      </Divider>
    );
  };

  return (
    <Bubble
      ref={ref}
      prefixCls={customizePrefixCls}
      className={`${prefixCls}-divider`}
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
