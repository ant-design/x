import classnames from 'classnames';
import omit from 'rc-util/es/omit';
import pickAttrs from 'rc-util/es/pickAttrs';
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
    bubble: bubbleClassName,
    divider: dividerClassName,
    system: systemClassName,
    ...otherClassNames
  } = classNames;
  const {
    bubble: bubbleStyle,
    divider: dividerStyle,
    system: systemStyle,
    ...otherStyles
  } = styles;

  let bubble = (
    <MemoedBubble
      ref={initBubbleRef}
      style={bubbleStyle}
      className={bubbleClassName}
      classNames={otherClassNames}
      styles={otherStyles}
      {...restProps}
    />
  );
  if (role === 'divider') {
    bubble = (
      <MemoedDividerBubble
        ref={initBubbleRef}
        style={dividerStyle}
        className={dividerClassName}
        classNames={otherClassNames}
        styles={otherStyles}
        {...restProps}
      />
    );
  } else if (role === 'system') {
    bubble = (
      <MemoedSystemBubble
        ref={initBubbleRef}
        style={systemStyle}
        className={systemClassName}
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
    onScroll,
    ...restProps
  } = props;
  const domProps = pickAttrs(restProps, {
    attr: true,
    aria: true,
  });

  // ============================= Refs =============================
  const listRef = React.useRef<HTMLDivElement>(null);
  const scrollBoxRef = React.useRef<HTMLDivElement>(null);

  const bubblesRef = React.useRef<BubblesRecord>({});

  const { resetToBottom } = useCompatibleScroll(autoScroll ? scrollBoxRef.current : null);

  // ============================ Prefix ============================
  const { getPrefixCls } = useXProviderContext();

  const prefixCls = getPrefixCls('bubble', customizePrefixCls);
  const listPrefixCls = `${prefixCls}-list`;

  const [hashId, cssVarCls] = useBubbleListStyle(prefixCls);

  const mergedClassNames = classnames(
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

  // ============================ Scroll ============================
  // 只有最后一条数据变更才需要滚动到底部
  // const lastItemKey = items[items.length - 1]?.key || items.length;
  // React.useEffect(() => {
  //   if (!scrollBoxRef.current) return;
  //   resetToBottom();
  //   scrollBoxRef.current?.scrollTo({ top: autoScroll ? 0 : scrollBoxRef.current.scrollHeight });
  // }, [lastItemKey, autoScroll, resetToBottom]);

  // ============================= Refs =============================
  useProxyImperativeHandle(ref, () => {
    return {
      nativeElement: listRef.current!,
      scrollBoxNativeElement: scrollBoxRef.current!,
      scrollTo: ({
        key,
        top,
        behavior = 'smooth',
        block,
      }: {
        key: string | number;
        top: number | 'bottom' | 'top';
        behavior?: ScrollBehavior;
        block?: ScrollLogicalPosition;
      }) => {
        const { scrollHeight, clientHeight } = scrollBoxRef.current!;
        if (typeof top === 'number') {
          scrollBoxRef.current?.scrollTo({
            top: autoScroll ? -scrollHeight + clientHeight + top : top,
            behavior,
          });
        } else if (top === 'bottom') {
          const bottomOffset = autoScroll ? 0 : scrollHeight;
          scrollBoxRef.current?.scrollTo({ top: bottomOffset, behavior });
        } else if (top === 'top') {
          const topOffset = autoScroll ? -scrollHeight : 0;
          scrollBoxRef.current?.scrollTo({ top: topOffset, behavior });
        } else if (key && bubblesRef.current[key]) {
          bubblesRef.current[key].nativeElement.scrollIntoView({ behavior, block });
        }
      },
    };
  });

  const renderData = autoScroll ? [...items].reverse() : items;

  // ============================ Render ============================
  return (
    <div {...domProps} className={mergedClassNames} style={mergedStyle} ref={listRef}>
      <div
        className={classnames(`${listPrefixCls}-scroll-box`, classNames.scroll, {
          [`${listPrefixCls}-autoscroll`]: autoScroll,
        })}
        style={styles.scroll}
        ref={scrollBoxRef}
        onScroll={onScroll}
      >
        {renderData.map((item) => {
          let mergedProps: BubbleItemType;
          if (item.role && role) {
            const cfg = role[item.role];
            mergedProps = { ...(roleCfgIsFunction(cfg) ? cfg(item) : cfg), ...item };
          } else {
            mergedProps = item;
          }
          return (
            <BubbleListItem
              classNames={classNames}
              styles={styles}
              {...omit(mergedProps, ['key'])}
              key={item.key}
              _key={item.key}
              bubblesRef={bubblesRef}
            />
          );
        })}
      </div>
    </div>
  );
};

const ForwardBubbleList = React.forwardRef(BubbleList);

if (process.env.NODE_ENV !== 'production') {
  ForwardBubbleList.displayName = 'BubbleList';
}

export default ForwardBubbleList;
