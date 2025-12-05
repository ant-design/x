import classnames from 'classnames';
import React from 'react';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useXProviderContext } from '../x-provider';
import Bubble from './Bubble';
import type { BubbleContentType, BubbleRef, SystemBubbleProps } from './interface';
import useStyle from './style';

const SystemBubble: React.ForwardRefRenderFunction<BubbleRef, SystemBubbleProps> = (
  {
    prefixCls: customizePrefixCls,
    content,
    variant = 'shadow',
    shape,
    style,
    className,
    styles = {},
    classNames = {},
    rootClassName,
    ...restProps
  },
  ref,
) => {
  // ===================== Component Config =========================
  const contextConfig = useXComponentConfig('bubble');

  // ============================ Prefix ============================
  const { getPrefixCls } = useXProviderContext();
  const prefixCls = getPrefixCls('bubble', customizePrefixCls);
  const [hashId, cssVarCls] = useStyle(prefixCls);

  // ============================ Styles ============================
  const cls = `${prefixCls}-system`;
  const rootMergedCls = classnames(
    hashId,
    cssVarCls,
    cls,
    prefixCls,
    contextConfig.className,
    contextConfig.classNames.root,
    classNames.root,
    className,
    rootClassName,
  );

  return (
    <Bubble
      ref={ref}
      style={style}
      className={rootMergedCls}
      styles={styles}
      classNames={classNames}
      variant={variant}
      shape={shape}
      content={content}
      {...restProps}
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
