import omit from '@rc-component/util/lib/omit';
import pickAttrs from '@rc-component/util/lib/pickAttrs';
import VirtualList from '@rc-component/virtual-list';
import { clsx } from 'clsx';
import * as React from 'react';
import useProxyImperativeHandle from '../_util/hooks/use-proxy-imperative-handle';
import { useXProviderContext } from '../x-provider';
import Bubble from './Bubble';
import { BubbleContext } from './context';
import DividerBubble from './Divider';
import { useCompatibleScroll } from './hooks/useCompatibleScroll';
import {
  BubbleItemType,
  BubbleListProps,
  BubbleListRef,
  BubbleRef,
  FuncRoleProps,
  RoleProps,
  SemanticType,
} from './interface';
import SystemBubble from './System';
import useBubbleListStyle from './style';

interface BubblesRecord {
  [key: string]: BubbleRef;
}

function roleCfgIsFunction(roleCfg: RoleProps | FuncRoleProps): roleCfg is FuncRoleProps {
  return typeof roleCfg === 'function' && roleCfg instanceof Function;
}

const MemoedBubble = React.memo(Bubble);
const MemoedDividerBubble = React.memo(DividerBubble);
const MemoedSystemBubble = React.memo(SystemBubble);

const BubbleListItem: React.FC<
  BubbleItemType & {
    styles?: Partial<Record<SemanticType | 'bubble' | 'system' | 'divider', React.CSSProperties>>;
    classNames?: Partial<Record<SemanticType | 'bubble' | 'system' | 'divider', string>>;
    bubblesRef: React.RefObject<BubblesRecord>;
    // BubbleItemType.key 会在 BubbleList 内渲染时被吞掉，使得 BubbleListItem.props 无法获取到 key
    _key: string | number;
  }
> = (props) => {
  const {
    _key,
    bubblesRef,
    extraInfo,
    status,
    role,
    classNames = {},
    styles = {},
    ...restProps
  } = props;

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

  const {
    root: rootClassName, // 从 items 配置中获得
    // 从 Bubble.List 中获得
    bubble: bubbleClassName,
    divider: dividerClassName,
    system: systemClassName,
    ...otherClassNames
  } = classNames;
  const {
    root: rootStyle, // 从 items 配置中获得
    // 从 Bubble.List 中获得
    bubble: bubbleStyle,
    divider: dividerStyle,
    system: systemStyle,
    ...otherStyles
  } = styles;

  // items 配置优先级更高，覆盖
  let bubble = (
    <MemoedBubble
      ref={initBubbleRef}
      style={rootStyle || bubbleStyle}
      className={rootClassName || bubbleClassName}
      classNames={otherClassNames}
      styles={otherStyles}
      {...restProps}
    />
  );
  if (role === 'divider') {
    bubble = (
      <MemoedDividerBubble
        ref={initBubbleRef}
        style={rootStyle || dividerStyle}
        className={rootClassName || dividerClassName}
        classNames={otherClassNames}
        styles={otherStyles}
        {...restProps}
      />
    );
  } else if (role === 'system') {
    bubble = (
      <MemoedSystemBubble
        ref={initBubbleRef}
        style={rootStyle || systemStyle}
        className={rootClassName || systemClassName}
        classNames={otherClassNames}
        styles={otherStyles}
        {...restProps}
      />
    );
  }

  return (
    <BubbleContext.Provider value={{ key: _key, status, extraInfo }}>
      {bubble}
    </BubbleContext.Provider>
  );
};

const BubbleList: React.ForwardRefRenderFunction<BubbleListRef, BubbleListProps> = (props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    rootClassName,
    className,
    styles = {},
    classNames = {},
    style,
    items,
    autoScroll = true,
    role,
    virtual: virtualProp = false,
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
  const virtualListRef = React.useRef<any>(null);

  // ========================== Virtual Height =========================
  const [virtualHeight, setVirtualHeight] = React.useState<number>(400);

  React.useEffect(() => {
    if (!virtualProp) return;
    const updateHeight = () => {
      if (listRef.current) {
        setVirtualHeight(listRef.current.clientHeight);
      }
    };
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    if (listRef.current) {
      observer.observe(listRef.current);
    }
    return () => observer.disconnect();
  }, [virtualProp]);

  // ============================= States =============================
  const [scrollBoxDom, setScrollBoxDom] = React.useState<HTMLDivElement | null>();
  const [scrollContentDom, setScrollContentDom] = React.useState<HTMLDivElement | null>();
  const { scrollTo } = useCompatibleScroll(scrollBoxDom, scrollContentDom);

  // ============================ Prefix ============================
  const { getPrefixCls } = useXProviderContext();

  const prefixCls = getPrefixCls('bubble', customizePrefixCls);
  const listPrefixCls = `${prefixCls}-list`;

  const [hashId, cssVarCls] = useBubbleListStyle(prefixCls);

  const mergedClassNames = clsx(
    listPrefixCls,
    rootClassName,
    className,
    classNames.root,
    hashId,
    cssVarCls,
  );

  const mergedStyle = {
    ...styles.root,
    ...style,
  };

  // ========================== Merged Items ==========================
  const mergedItems = React.useMemo(() => {
    return items.map((item) => {
      let mergedProps: BubbleItemType;
      if (item.role && role) {
        const cfg = role[item.role];
        mergedProps = { ...(roleCfgIsFunction(cfg) ? cfg(item) : cfg), ...item };
      } else {
        mergedProps = item;
      }
      return mergedProps;
    });
  }, [items, role]);

  // ==================== Virtual Auto Scroll =========================
  const prevItemsLengthRef = React.useRef(mergedItems.length);

  React.useEffect(() => {
    if (!virtualProp || !autoScroll) return;
    const prevLen = prevItemsLengthRef.current;
    prevItemsLengthRef.current = mergedItems.length;
    // Auto scroll when items are added (not removed)
    if (mergedItems.length > prevLen && virtualListRef.current) {
      requestAnimationFrame(() => {
        virtualListRef.current?.scrollTo({ index: mergedItems.length - 1 });
      });
    }
  }, [mergedItems, virtualProp, autoScroll]);

  // Auto scroll when content grows (e.g. streaming messages getting longer)
  React.useEffect(() => {
    if (!virtualProp || !autoScroll || !listRef.current) return;
    const observer = new ResizeObserver(() => {
      if (virtualListRef.current) {
        requestAnimationFrame(() => {
          virtualListRef.current?.scrollTo({ index: mergedItems.length - 1 });
        });
      }
    });
    observer.observe(listRef.current);
    return () => observer.disconnect();
  }, [virtualProp, autoScroll, mergedItems]);

  // ============================= Refs =============================
  useProxyImperativeHandle<HTMLDivElement, BubbleListRef>(ref, () => {
    return {
      nativeElement: listRef.current!,
      scrollBoxNativeElement: scrollBoxDom!,
      scrollTo: ({ key, top, behavior = 'smooth', block }) => {
        // Virtual mode: use VirtualList's scrollTo
        if (virtualProp && virtualListRef.current) {
          // Map block to VirtualList's align option
          const align = block === 'center' ? 'center' : block === 'end' ? 'end' : 'start';
          if (typeof top === 'number') {
            virtualListRef.current.scrollTo({ top, behavior });
          } else if (top === 'bottom') {
            virtualListRef.current.scrollTo({ index: mergedItems.length - 1, align, behavior });
          } else if (top === 'top') {
            virtualListRef.current.scrollTo({ top: 0, behavior });
          } else if (key != null) {
            const itemIndex = mergedItems.findIndex((item) => item.key === key);
            if (itemIndex >= 0) {
              virtualListRef.current.scrollTo({ index: itemIndex, align, behavior });
            }
          }
          return;
        }
        const { scrollHeight, clientHeight } = scrollBoxDom!;
        if (typeof top === 'number') {
          scrollTo({
            top: autoScroll ? -scrollHeight + clientHeight + top : top,
            behavior,
          });
        } else if (top === 'bottom') {
          const bottomOffset = autoScroll ? 0 : scrollHeight;
          scrollTo({ top: bottomOffset, behavior });
        } else if (top === 'top') {
          const topOffset = autoScroll ? -scrollHeight : 0;
          scrollTo({ top: topOffset, behavior });
        } else if (key && bubblesRef.current[key]) {
          scrollTo({
            intoView: { behavior, block },
            intoViewDom: bubblesRef.current[key].nativeElement,
          });
        }
      },
    };
  });

  // ========================= Virtual Render =========================
  const renderItem = (item: BubbleItemType) => (
    <div key={item.key}>
      <BubbleListItem
        classNames={omit(classNames, ['root', 'scroll'])}
        styles={omit(styles, ['root', 'scroll'])}
        {...omit(item, ['key'])}
        key={item.key}
        _key={item.key}
        bubblesRef={bubblesRef}
      />
    </div>
  );

  // ============================ Render ============================
  return (
    <div {...domProps} className={mergedClassNames} style={mergedStyle} ref={listRef}>
      {virtualProp ? (
        <div
          className={clsx(`${listPrefixCls}-scroll-box`, classNames.scroll, {
            [`${listPrefixCls}-autoscroll`]: autoScroll,
          })}
          style={{ ...styles.scroll, overflow: 'hidden' }}
          ref={(node) => setScrollBoxDom(node)}
        >
          <style>{`
            .${listPrefixCls}-scroll-box .rc-virtual-list-scrollbar { display: none !important; }
            .${listPrefixCls}-scroll-box .rc-virtual-list-holder {
              overflow-y: auto !important;
            }
          `}</style>
          <VirtualList<BubbleItemType>
            ref={virtualListRef}
            data={mergedItems}
            height={virtualHeight}
            itemHeight={64}
            itemKey={(item) => item.key}
            virtual
            onScroll={onScroll}
            style={{
              display: 'flex',
              flexDirection: 'column',
              ...(autoScroll ? { flexDirection: 'column-reverse' } : {}),
            }}
          >
            {(item) => renderItem(item)}
          </VirtualList>
        </div>
      ) : (
        <div
          className={clsx(`${listPrefixCls}-scroll-box`, classNames.scroll, {
            [`${listPrefixCls}-autoscroll`]: autoScroll,
          })}
          style={styles.scroll}
          ref={(node) => setScrollBoxDom(node)}
          onScroll={onScroll}
        >
          {/* 映射 scrollHeight 到 dom.height，以使用 ResizeObserver 来监听高度变化 */}
          <div
            ref={(node) => setScrollContentDom(node)}
            className={clsx(`${listPrefixCls}-scroll-content`)}
          >
            {items.map((item) => {
              let mergedProps: BubbleItemType;
              if (item.role && role) {
                const cfg = role[item.role];
                mergedProps = { ...(roleCfgIsFunction(cfg) ? cfg(item) : cfg), ...item };
              } else {
                mergedProps = item;
              }
              return (
                <BubbleListItem
                  classNames={omit(classNames, ['root', 'scroll'])}
                  styles={omit(styles, ['root', 'scroll'])}
                  {...omit(mergedProps, ['key'])}
                  key={item.key}
                  _key={item.key}
                  bubblesRef={bubblesRef}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const ForwardBubbleList = React.forwardRef(BubbleList);

if (process.env.NODE_ENV !== 'production') {
  ForwardBubbleList.displayName = 'BubbleList';
}

export default ForwardBubbleList;
