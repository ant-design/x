import classNames from 'classnames';
import pickAttrs from 'rc-util/lib/pickAttrs';
import * as React from 'react';
import { useXProviderContext } from '../x-provider';
import Bubble, { BubbleContext } from './Bubble';
import type { BubbleRef } from './Bubble';
import useAutoScrollToBottom from './hooks/useAutoScrollToBottom';
import useDisplayData from './hooks/useDisplayData';
import useListData from './hooks/useListData';
import type { BubbleProps } from './interface';
import useStyle from './style';

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
  items?: BubbleDataType[];
  autoScroll?: boolean;
  roles?: RolesType;
}

const BubbleList: React.ForwardRefRenderFunction<BubbleListRef, BubbleListProps> = (props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    rootClassName,
    className,
    items,
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
  const { getPrefixCls } = useXProviderContext();

  const prefixCls = getPrefixCls('bubble', customizePrefixCls);
  const listPrefixCls = `${prefixCls}-list`;

  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

  // ============================ Typing ============================
  const [initialized, setInitialized] = React.useState(false);

  React.useEffect(() => {
    setInitialized(true);
    return () => {
      setInitialized(false);
    };
  }, []);

  // ============================= Data =============================
  const mergedData = useListData(items, roles);

  const [displayData, onTypingComplete] = useDisplayData(mergedData);

  // ============================ Scroll ============================
  // Is current scrollTop at the end. User scroll will make this false.
  const [scrollReachEnd, setScrollReachEnd] = React.useState(true);

  const onInternalScroll: React.UIEventHandler<HTMLDivElement> = (e) => {
    const target = e.target as HTMLElement;

    //  Allow 1px tolerance
    setScrollReachEnd(Math.abs(target.scrollHeight - target.scrollTop - target.clientHeight) <= 1);
  };

  const { manualScrollToBottom } = useAutoScrollToBottom({
    container: listRef.current,
    autoScroll: autoScroll,
  });

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
          const index = displayData.findIndex((dataItem) => dataItem.key === key);
          setScrollReachEnd(index === displayData.length - 1);

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

  const context = React.useMemo(
    () => ({
      onUpdate: manualScrollToBottom,
    }),
    [],
  );

  // ============================ Render ============================
  return wrapCSSVar(
    <BubbleContext.Provider value={context}>
      <div
        {...domProps}
        className={classNames(listPrefixCls, rootClassName, className, hashId, cssVarCls, {
          [`${listPrefixCls}-reach-end`]: scrollReachEnd,
        })}
        ref={listRef}
        onScroll={onInternalScroll}
      >
        {displayData.map(({ key, ...bubble }) => (
          <Bubble
            {...bubble}
            key={key}
            ref={(node) => {
              if (node) {
                bubbleRefs.current[key] = node;
              } else {
                delete bubbleRefs.current[key];
              }
            }}
            typing={initialized ? bubble.typing : false}
            onTypingComplete={() => {
              bubble.onTypingComplete?.();
              onTypingComplete(key);
            }}
          />
        ))}
      </div>
    </BubbleContext.Provider>,
  );
};

const ForwardBubbleList = React.forwardRef(BubbleList);

if (process.env.NODE_ENV !== 'production') {
  ForwardBubbleList.displayName = 'BubbleList';
}

export default ForwardBubbleList;
