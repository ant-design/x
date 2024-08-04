import * as React from 'react';
import pickAttrs from 'rc-util/lib/pickAttrs';
import useConfigContext from '../config-provider/useConfigContext';
import classNames from 'classnames';
import type { BubbleProps } from './interface';
import Bubble, { BubbleContext } from './Bubble';
import useStyle from './style';
import type { GetProp } from 'antd';
import { useEvent } from 'rc-util';

const EMPTY_DATA: GetProp<BubbleListProps, 'data'> = [];

export interface BubbleListProps extends React.HTMLAttributes<HTMLDivElement> {
  prefixCls?: string;
  rootClassName?: string;
  data?: BubbleProps[];
  autoScroll?: boolean;
}

export default function BubbleList(props: BubbleListProps) {
  const {
    prefixCls: customizePrefixCls,
    rootClassName,
    className,
    data = EMPTY_DATA,
    autoScroll = true,
    ...restProps
  } = props;
  const domProps = pickAttrs(restProps, {
    attr: true,
    aria: true,
  });

  // ============================= Refs =============================
  const listRef = React.useRef<HTMLDivElement>(null);

  // ============================ Prefix ============================
  const { getPrefixCls } = useConfigContext();

  const prefixCls = getPrefixCls('bubble', customizePrefixCls);
  const listPrefixCls = `${prefixCls}-list`;

  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

  // ============================ Scroll ============================
  const [updateCount, setUpdateCount] = React.useState(0);

  const onInternalScroll: React.UIEventHandler<HTMLDivElement> = (e) => {
    console.log('>>>', e.currentTarget.scrollTop);
  };

  React.useEffect(() => {
    console.log('??!!!');
  }, [updateCount]);

  // =========================== Context ============================
  // When bubble content update, we try to trigger `autoScroll` for sync
  const onBubbleUpdate = useEvent(() => {
    if (autoScroll) {
      setUpdateCount((c) => c + 1);
    }
  });

  const context = React.useMemo(
    () => ({
      onUpdate: onBubbleUpdate,
    }),
    [],
  );

  // ============================ Render ============================
  return wrapCSSVar(
    <BubbleContext.Provider value={context}>
      <div
        {...domProps}
        className={classNames(listPrefixCls, rootClassName, className, hashId, cssVarCls)}
        ref={listRef}
        onScroll={onInternalScroll}
      >
        {data.map((bubble, index) => {
          const key = bubble.key ?? index;

          return <Bubble key={key} {...bubble} />;
        })}
      </div>
    </BubbleContext.Provider>,
  );
}
