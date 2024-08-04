import * as React from 'react';
import pickAttrs from 'rc-util/lib/pickAttrs';
import useConfigContext from '../config-provider/useConfigContext';
import classNames from 'classnames';
import type { BubbleProps } from './interface';
import Bubble from './Bubble';
import useStyle from './style';

export interface BubbleListProps extends React.HTMLAttributes<HTMLDivElement> {
  prefixCls?: string;
  rootClassName?: string;
  data?: BubbleProps[];
}

export default function BubbleList(props: BubbleListProps) {
  const {
    prefixCls: customizePrefixCls,
    rootClassName,
    className,
    data = [],
    ...restProps
  } = props;
  const domProps = pickAttrs(restProps, {
    attr: true,
    aria: true,
  });

  // ============================ Prefix ============================
  const { getPrefixCls } = useConfigContext();

  const prefixCls = getPrefixCls('bubble', customizePrefixCls);
  const listPrefixCls = `${prefixCls}-list`;

  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

  // ============================ Render ============================
  return wrapCSSVar(
    <div
      {...domProps}
      className={classNames(listPrefixCls, rootClassName, className, hashId, cssVarCls)}
    >
      {data.map((bubble, index) => {
        const key = bubble.key ?? index;

        return <Bubble key={key} {...bubble} />;
      })}
    </div>,
  );
}
