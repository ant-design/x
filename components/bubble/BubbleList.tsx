import * as React from 'react';
import pickAttrs from 'rc-util/lib/pickAttrs';
import useConfigContext from '../config-provider/useConfigContext';
import classNames from 'classnames';
import type { BubbleProps } from './interface';
import Bubble, { BubbleContext } from './Bubble';
import type { BubbleRef } from './Bubble';
import useStyle from './style';
import { useEvent } from 'rc-util';
import useListData from './hooks/useListData';

export interface BubbleListRef {
  nativeElement: HTMLDivElement;
  scrollTo: (info: {
    offset?: number;
    key?: string | number;
    behavior?: ScrollBehavior;
    block?: ScrollLogicalPosition;
  }) => void;
}

export type BubbleDataType = BubbleProps & {
  key?: string | number;
  role?: string;
};

export type RoleType = Partial<Omit<BubbleProps, 'content'>>;

export type RolesType = Record<string, RoleType> | ((bubbleDataP: BubbleDataType) => RoleType);

export interface BubbleListProps extends React.HTMLAttributes<HTMLDivElement> {
  prefixCls?: string;
  rootClassName?: string;
  data?: BubbleDataType[];
  autoScroll?: boolean;
  roles?: RolesType;
}

function BubbleList(props: BubbleListProps, ref: React.Ref<BubbleListRef>) {
  const {
    prefixCls: customizePrefixCls,
    rootClassName,
    className,
    data,
    autoScroll = true,
    roles,
    ...restProps
  } = props;
  const domProps = pickAttrs(restProps, {
    attr: true,
    aria: true,
  });

  // ============================= Refs =============================
  const listRef = React.useRef<HTMLDivElement>(null);

  const bubbleRefs = React.useRef<Record<string, BubbleRef>>({});

  // ============================ Prefix ============================
  const { getPrefixCls } = useConfigContext();

  const prefixCls = getPrefixCls('bubble', customizePrefixCls);
  const listPrefixCls = `${prefixCls}-list`;

  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

  // ============================= Data =============================
  const mergedData = useListData(data, roles);

  // ============================ Scroll ============================
  // Is current scrollTop at the end. User scroll will make this false.
  const [scrollReachEnd, setScrollReachEnd] = React.useState(true);

  const [updateCount, setUpdateCount] = React.useState(0);

  const onInternalScroll: React.UIEventHandler<HTMLDivElement> = (e) => {
    const target = e.target as HTMLElement;

    setScrollReachEnd(target.scrollTop + target.clientHeight === target.scrollHeight);
  };

  React.useEffect(() => {
    if (autoScroll && listRef.current && scrollReachEnd) {
      listRef.current.scrollTo({
        top: listRef.current.scrollHeight,
      });
    }
  }, [updateCount]);

  // Always scroll to bottom when data change
  React.useEffect(() => {
    if (autoScroll) {
      setUpdateCount((c) => c + 1);
      setScrollReachEnd(true);
    }
  }, [mergedData.length]);

  // ========================== Outer Ref ===========================
  React.useImperativeHandle(ref, () => ({
    nativeElement: listRef.current!,
    scrollTo: ({ key, offset, behavior = 'smooth', block }) => {
      if (typeof offset === 'number') {
        // Offset scroll
        listRef.current!.scrollTo({
          top: offset,
          behavior,
        });
      } else if (key !== undefined) {
        // Key scroll
        const bubbleInst = bubbleRefs.current[key];

        if (bubbleInst) {
          // Block current auto scrolling
          setScrollReachEnd(false);

          // Do native scroll
          bubbleInst.nativeElement.scrollIntoView({
            behavior,
            block,
          });
        }
      }
    },
  }));

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
        {mergedData.map(({ key, ...bubble }, index) => {
          const mergedKey = key ?? index;

          return (
            <Bubble
              {...bubble}
              key={mergedKey}
              ref={(node) => {
                if (node) {
                  bubbleRefs.current[mergedKey] = node;
                } else {
                  delete bubbleRefs.current[mergedKey];
                }
              }}
            />
          );
        })}
      </div>
    </BubbleContext.Provider>,
  );
}

const ForwardBubbleList = React.forwardRef(BubbleList);

if (process.env.NODE_ENV !== 'production') {
  ForwardBubbleList.displayName = 'BubbleList';
}

export default ForwardBubbleList;
