import { Divider, DividerProps } from 'antd';
import classnames from 'classnames';
import React from 'react';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
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
    styles = {},
    classNames = {},
    dividerProps,
    ...restProps
  },
  ref,
) => {
  // ============================ Prefix ============================
  const { getPrefixCls } = useXProviderContext();

  // ===================== Component Config =========================
  const contextConfig = useXComponentConfig('bubble');
  const prefixCls = getPrefixCls('bubble', customizePrefixCls);

  // ============================ Styles ============================

  const rootMergedCls = classnames(
    prefixCls,
    `${prefixCls}-divider`,
    contextConfig.className,
    contextConfig.classNames.root,
    className,
    classNames.root,
    rootClassName,
  );

  const dividerContentRender: BubbleProps['contentRender'] = (content) => {
    return <Divider {...dividerProps}>{content}</Divider>;
  };

  return (
    <Bubble
      ref={ref}
      style={style}
      styles={styles}
      className={rootMergedCls}
      classNames={classNames}
      prefixCls={prefixCls}
      variant="borderless"
      content={content}
      contentRender={dividerContentRender}
      {...restProps}
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
