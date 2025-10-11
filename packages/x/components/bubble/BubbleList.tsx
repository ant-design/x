import classnames from 'classnames';
import { warning } from 'rc-util';
import omit from 'rc-util/es/omit';
import pickAttrs from 'rc-util/es/pickAttrs';
import * as React from 'react';
import { useXProviderContext } from '../x-provider';
import Bubble from './Bubble';
import { BubbleContext } from './context';
import DividerBubble from './Divider';
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
  const { _key, bubblesRef, extra, status, role, ...restProps } = props;

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

  if (!role) {
    warning(false, `BubbleListItem[key - ${_key}] role is required`);
    return null;
  }

  let bubble = <MemoedBubble ref={initBubbleRef} {...restProps} />;
  if (role === 'divider') {
    bubble = <MemoedDividerBubble ref={initBubbleRef} {...restProps} />;
  } else if (role === 'system') {
    bubble = <MemoedSystemBubble ref={initBubbleRef} {...restProps} />;
  }

  return (
    <BubbleContext.Provider value={{ key: _key, status, extra }}>{bubble}</BubbleContext.Provider>
  );
};

const BubbleList: React.ForwardRefRenderFunction<BubbleListRef, BubbleListProps> = (props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    rootClassName,
    className,
    styles,
    classNames,
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

  // ============================ Prefix ============================
  const { getPrefixCls } = useXProviderContext();

  const prefixCls = getPrefixCls('bubble', customizePrefixCls);
  const listPrefixCls = `${prefixCls}-list`;

  const [hashId, cssVarCls] = useBubbleListStyle(prefixCls);

  const mergedClassNames = classnames(
    listPrefixCls,
    rootClassName,
    className,
    classNames?.root,
    hashId,
    cssVarCls,
    {
      [`${listPrefixCls}-autoscroll`]: autoScroll,
    },
  );

  const mergedStyle = {
    ...styles?.root,
    ...style,
  };

  // ============================ Scroll ============================
  // Always scroll to bottom when data change
  React.useEffect(() => {
    listRef.current?.scrollTo({ top: autoScroll ? 0 : listRef.current.scrollHeight });
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
          const bottomOffset = autoScroll ? 0 : scrollHeight;
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
        let mergedProps: BubbleItemType;
        if (item.role && role) {
          const cfg = role[item.role];
          mergedProps = { ...(roleCfgIsFunction(cfg) ? cfg(item) : cfg), ...item };
        } else {
          mergedProps = item;
        }
        return (
          <BubbleListItem
            classNames={{
              ...classNames,
              root: classNames?.bubble,
            }}
            styles={{
              ...styles,
              root: styles?.bubble,
            }}
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
