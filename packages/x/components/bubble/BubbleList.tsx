import classNames from 'classnames';
import omit from 'rc-util/es/omit';
import pickAttrs from 'rc-util/es/pickAttrs';
import * as React from 'react';
import { useXProviderContext } from '../x-provider';
import Bubble from './Bubble';
import { BubbleData, BubbleListProps, BubbleListRef, BubbleRef } from './interface';
import useBubbleListStyle from './style';

interface BubblesRecord {
  [key: string]: BubbleRef;
}

const MemoedBubble = React.memo(Bubble);

const BubbleListItem: React.FC<
  BubbleData & {
    bubblesRef: React.RefObject<BubblesRecord>;
    // BubbleData.key 会在 BubbleList 内渲染时被吞掉，使得 BubbleListItem.props 无法获取到 key
    _key: string | number;
  }
> = (props) => {
  const { _key, bubblesRef, ...restProps } = props;

  const initBubbleRef = React.useCallback(
    (node: BubbleRef) => {
      if (node) {
        bubblesRef.current[_key] = node;
      } else {
        delete bubblesRef.current[_key];
      }
    },
    [_key],
  );

  return <MemoedBubble ref={initBubbleRef} {...omit(restProps, ['role'])} />;
};

const BubbleList: React.ForwardRefRenderFunction<BubbleListRef, BubbleListProps> = (props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    rootClassName,
    className,
    rootStyle,
    style,
    items,
    autoScroll = true,
    role,
    onScroll,
    ...restProps
  } = props;
  const domProps = pickAttrs(restProps, {
    attr: true,
    aria: true,
  });

  // ============================= Refs =============================
  const listRef = React.useRef<HTMLDivElement>(null);

  const bubblesRef = React.useRef<BubblesRecord>({});

  const latestItems = React.useRef(items);
  latestItems.current = items;

  // ============================ Prefix ============================
  const { getPrefixCls } = useXProviderContext();

  const prefixCls = getPrefixCls('bubble', customizePrefixCls);
  const listPrefixCls = `${prefixCls}-list`;

  const [hashId, cssVarCls] = useBubbleListStyle(prefixCls);

  const mergedClassNames = classNames(listPrefixCls, rootClassName, className, hashId, cssVarCls, {
    [`${listPrefixCls}-autoscroll`]: autoScroll,
  });

  const mergedStyle = {
    ...rootStyle,
    ...style,
  };

  // ============================ Scroll ============================
  // Always scroll to bottom when data change
  React.useEffect(() => {
    listRef.current &&
      listRef.current.scrollTo({ top: autoScroll ? 0 : listRef.current.scrollHeight });
  }, [items.length, autoScroll]);

  // ========================== Ref ===========================
  React.useImperativeHandle(
    ref,
    () => ({
      nativeElement: listRef.current!,
      scrollTo: ({ key, top, behavior = 'smooth', block }) => {
        const { scrollHeight, clientHeight } = listRef.current!;
        if (typeof top === 'number') {
          listRef.current?.scrollTo({
            top: autoScroll ? -scrollHeight + clientHeight + top : top,
            behavior,
          });
        } else if (top === 'bottom') {
          const bottomOffset = autoScroll ? 0 : -scrollHeight;
          listRef.current?.scrollTo({ top: bottomOffset, behavior });
        } else if (top === 'top') {
          const topOffset = autoScroll ? -scrollHeight : 0;
          listRef.current?.scrollTo({ top: topOffset, behavior });
        } else if (key && bubblesRef.current[key]) {
          bubblesRef.current[key].nativeElement.scrollIntoView({ behavior, block });
        }
      },
    }),
    [autoScroll],
  );

  const renderData = autoScroll ? [...items].reverse() : items;

  // ============================ Render ============================
  return (
    <div
      {...domProps}
      className={mergedClassNames}
      style={mergedStyle}
      ref={listRef}
      onScroll={onScroll}
    >
      {renderData.map((item) => {
        const mergedProps = { ...role?.[item.role], ...item };
        return (
          <BubbleListItem
            {...omit(mergedProps, ['key'])}
            key={item.key}
            _key={item.key}
            bubblesRef={bubblesRef}
          />
        );
      })}
    </div>
  );
};

const ForwardBubbleList = React.forwardRef(BubbleList);

if (process.env.NODE_ENV !== 'production') {
  ForwardBubbleList.displayName = 'BubbleList';
}

export default ForwardBubbleList;
