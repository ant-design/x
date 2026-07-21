import type { CSSMotionProps } from '@rc-component/motion';
import { useControlledState } from '@rc-component/util';
import pickAttrs from '@rc-component/util/lib/pickAttrs';
import VirtualList from '@rc-component/virtual-list';
import { Divider } from 'antd';
import { clsx } from 'clsx';
import React from 'react';
import useCollapsible from '../_util/hooks/use-collapsible';
import useProxyImperativeHandle from '../_util/hooks/use-proxy-imperative-handle';
import useShortcutKeys, { ShortcutKeyActionType } from '../_util/hooks/use-shortcut-keys';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import type { ShortcutKeys } from '../_util/type';
import { useXProviderContext } from '../x-provider';
import type { CreationProps } from './Creation';
import Creation from './Creation';
import GroupTitle, { GroupTitleContext } from './GroupTitle';
import type { GroupInfoType } from './hooks/useGroupable';
import useGroupable from './hooks/useGroupable';
import ConversationsItem, { type ConversationsItemProps } from './Item';
import type { ConversationItemType, DividerItemType, GroupableProps, ItemType } from './interface';
import useStyle from './style';

type SemanticType = 'root' | 'creation' | 'group' | 'item';
/**
 * @desc 会话列表组件参数
 * @descEN Props for the conversation list component
 */
export interface ConversationsProps extends React.HTMLAttributes<HTMLUListElement> {
  /**
   * @desc 会话列表数据源
   * @descEN Data source for the conversation list
   */
  items?: ItemType[];

  /**
   * @desc 当前选中的值
   * @descEN Currently selected value
   */
  activeKey?: ConversationItemType['key'];

  /**
   * @desc 默认选中值
   * @descEN Default selected value
   */
  defaultActiveKey?: ConversationItemType['key'];

  /**
   * @desc 选中变更回调
   * @descEN Callback for selection change
   */
  onActiveChange?: (value: ConversationItemType['key'], item?: ItemType) => void;

  /**
   * @desc 会话操作菜单
   * @descEN Operation menu for conversations
   */
  menu?:
    | ConversationsItemProps['menu']
    | ((value: ConversationItemType) => ConversationsItemProps['menu']);

  /**
   * @desc 是否支持分组, 开启后默认按 {@link Conversation.group} 字段分组
   * @descEN If grouping is supported, it defaults to the {@link Conversation.group} field
   */
  groupable?: boolean | GroupableProps;

  /**
   * @desc 语义化结构 style
   * @descEN Semantic structure styles
   */
  styles?: Partial<Record<SemanticType, React.CSSProperties>>;

  /**
   * @desc 语义化结构 className
   * @descEN Semantic structure class names
   */
  classNames?: Partial<Record<SemanticType, string>>;

  /**
   * @desc 自定义前缀
   * @descEN Prefix
   */
  prefixCls?: string;

  /**
   * @desc 自定义根类名
   * @descEN Custom class name
   */
  rootClassName?: string;
  /**
   * @desc 自定义快捷键
   * @descEN Custom Shortcut Keys
   */
  shortcutKeys?: {
    creation?: ShortcutKeys<number>;
    items?: ShortcutKeys<'number'> | ShortcutKeys<number>[];
  };
  /**
   * @desc 新建对话按钮的配置
   * @descEN  Config of the new chat button
   */
  creation?: CreationProps;

  /**
   * @desc 是否开启虚拟滚动，当数据量较大时（>100 条）建议开启以提升性能
   * @defaultEN Whether to enable virtual scrolling
   * @default false
   */
  virtual?: boolean;
}

type CompoundedComponent = typeof ForwardConversations & {
  Creation: typeof Creation;
};

type ConversationsRef = {
  nativeElement: HTMLDivElement;
};

type FlatItem =
  | {
      type: 'group-title';
      key: string;
      groupInfo: GroupInfoType;
    }
  | {
      type: 'item';
      key: string;
      conversationInfo: ItemType;
    };

const VirtualGroupTitle = React.forwardRef<
  HTMLLIElement,
  {
    prefixCls: string;
    item: FlatItem & { type: 'group-title' };
    enableCollapse: boolean;
    expandedKeys: string[];
    onItemExpand: ((curKey: string) => void) | undefined;
    collapseMotion: CSSMotionProps;
    className?: string;
  }
>((props, ref) => {
  const { prefixCls, item, enableCollapse, expandedKeys, onItemExpand, collapseMotion, className } =
    props;
  return (
    <GroupTitleContext.Provider
      value={{
        prefixCls,
        groupInfo: item.groupInfo,
        enableCollapse,
        expandedKeys,
        onItemExpand,
        collapseMotion,
      }}
    >
      <GroupTitle ref={ref} className={className} virtual />
    </GroupTitleContext.Provider>
  );
});

const ForwardConversations = React.forwardRef<ConversationsRef, ConversationsProps>(
  (props, ref) => {
    const {
      prefixCls: customizePrefixCls,
      shortcutKeys: customizeShortcutKeys,
      rootClassName,
      items,
      activeKey,
      defaultActiveKey,
      onActiveChange,
      menu,
      styles = {},
      classNames = {},
      groupable,
      className,
      style,
      creation,
      virtual: virtualProp = false,
      ...restProps
    } = props;

    const domProps = pickAttrs(restProps, {
      attr: true,
      aria: true,
      data: true,
    });

    // ============================= Refs =============================
    const containerRef = React.useRef<any>(null);

    // ========================== Virtual Height =========================
    const [virtualHeight, setVirtualHeight] = React.useState<number>(400);

    React.useEffect(() => {
      if (!virtualProp) return;
      const updateHeight = () => {
        if (containerRef.current) {
          setVirtualHeight(containerRef.current.clientHeight);
        }
      };
      updateHeight();
      const observer = new ResizeObserver(updateHeight);
      if (containerRef.current) {
        observer.observe(containerRef.current);
      }
      return () => observer.disconnect();
    }, [virtualProp]);

    useProxyImperativeHandle(ref, () => {
      return {
        nativeElement: containerRef.current!,
      };
    });

    // ============================ ActiveKey ============================

    const [mergedActiveKey, setMergedActiveKey] = useControlledState<
      ConversationsProps['activeKey']
    >(defaultActiveKey, activeKey);

    // ============================ Groupable ============================
    const [groupList, collapsibleOptions, keyList] = useGroupable(groupable, items);

    // ============================ Prefix ============================
    const { getPrefixCls, direction } = useXProviderContext();

    const prefixCls = getPrefixCls('conversations', customizePrefixCls);

    // ===================== Component Config =========================
    const contextConfig = useXComponentConfig('conversations');

    // ============================ Style ============================
    const [hashId, cssVarCls] = useStyle(prefixCls);

    const mergedCls = clsx(
      prefixCls,
      contextConfig.className,
      contextConfig.classNames.root,
      className,
      classNames.root,
      rootClassName,
      hashId,
      cssVarCls,
      {
        [`${prefixCls}-rtl`]: direction === 'rtl',
      },
    );

    // ============================ Events ============================
    const onConversationItemClick: ConversationsItemProps['onClick'] = (key) => {
      setMergedActiveKey(key);
      onActiveChange?.(
        key,
        items?.find((item) => item.key === key),
      );
    };

    // ============================ Short Key =========================
    const [_, shortcutKeysInfo, subscribe] = useShortcutKeys(
      'conversations',
      customizeShortcutKeys,
    );
    const shortKeyAction = (shortcutKeyAction: ShortcutKeyActionType) => {
      switch (shortcutKeyAction?.name) {
        case 'items':
          {
            const index = shortcutKeyAction?.actionKeyCodeNumber ?? shortcutKeyAction?.index;
            if (typeof index === 'number' && !keyList?.[index]?.disabled && keyList?.[index]?.key) {
              setMergedActiveKey(keyList?.[index]?.key);
              onActiveChange?.(
                keyList?.[index]?.key,
                items?.find((item) => item.key === keyList?.[index]?.key),
              );
            }
          }
          break;
        case 'creation':
          {
            if (typeof creation?.onClick === 'function' && !creation?.disabled) {
              creation.onClick();
            }
          }
          break;
      }
    };

    subscribe(shortKeyAction);

    // ============================ Item Node ============================
    const getItemNode = (itemData: ItemType[]) =>
      itemData.map((conversationInfo: ItemType, conversationIndex: number) => {
        if (conversationInfo.type === 'divider') {
          return (
            <Divider
              key={`key-divider-${conversationIndex}`}
              className={`${prefixCls}-divider`}
              dashed={conversationInfo.dashed}
            />
          );
        }
        const baseConversationInfo = conversationInfo as ConversationItemType;
        const { label: _, disabled: __, icon: ___, ...restInfo } = baseConversationInfo;
        return (
          <ConversationsItem
            {...restInfo}
            key={baseConversationInfo.key || `key-${conversationIndex}`}
            info={baseConversationInfo}
            prefixCls={prefixCls}
            direction={direction}
            className={clsx(
              classNames.item,
              contextConfig.classNames.item,
              baseConversationInfo.className,
            )}
            style={{
              ...contextConfig.styles.item,
              ...styles.item,
              ...baseConversationInfo.style,
            }}
            menu={typeof menu === 'function' ? menu(baseConversationInfo) : menu}
            active={mergedActiveKey === baseConversationInfo.key}
            onClick={onConversationItemClick}
          />
        );
      });

    //  ============================ Item Collapsible ============================
    const rootPrefixCls = getPrefixCls();
    const [enableCollapse, expandedKeys, onItemExpand, collapseMotion] = useCollapsible(
      collapsibleOptions,
      prefixCls,
      rootPrefixCls,
    );

    // ====================== Virtual Flat Data =========================
    const flatData = React.useMemo<FlatItem[]>(() => {
      if (!virtualProp) return [];
      const result: FlatItem[] = [];
      groupList.forEach((groupInfo, groupIndex) => {
        if (groupInfo.enableGroup) {
          result.push({
            type: 'group-title',
            key: `__group__${groupInfo.name || groupIndex}`,
            groupInfo,
          });
        }
        const collapsed =
          enableCollapse && groupInfo.collapsible && !expandedKeys.includes(groupInfo.name);

        if (!collapsed) {
          groupInfo.data.forEach((conversationInfo) => {
            result.push({
              type: 'item',
              key: (conversationInfo as ConversationItemType).key || `__item__${result.length}`,
              conversationInfo,
            });
          });
        }
      });
      return result;
    }, [virtualProp, groupList, enableCollapse, expandedKeys]);

    // ============================ Render ============================
    return (
      <ul
        {...domProps}
        style={{
          ...contextConfig.style,
          ...style,
          ...contextConfig.styles.root,
          ...styles.root,
        }}
        className={mergedCls}
        ref={containerRef}
      >
        {!!creation && (
          <Creation
            className={clsx(contextConfig.classNames.creation, classNames.creation)}
            style={{
              ...contextConfig.styles.creation,
              ...styles.creation,
            }}
            shortcutKeyInfo={shortcutKeysInfo?.creation}
            prefixCls={`${prefixCls}-creation`}
            {...creation}
          />
        )}
        {virtualProp ? (
          <>
            <style>{`
            .${prefixCls} { overflow-y: hidden !important; padding: 0 !important; }
            .${prefixCls} .rc-virtual-list-scrollbar { display: none !important; }
            .${prefixCls} .rc-virtual-list-holder {
              overflow-y: auto !important;
              padding: 12px;
              box-sizing: border-box;
            }
            .${prefixCls} .rc-virtual-list-holder-inner > .${prefixCls}-item {
              margin-top: 4px;
            }
            .${prefixCls} .rc-virtual-list-holder-inner > .${prefixCls}-group + .${prefixCls}-item {
              margin-top: 0;
            }
          `}</style>
            <VirtualList<FlatItem>
              data={flatData}
              height={virtualHeight}
              itemHeight={52}
              itemKey={(item) => item.key}
              virtual
              component="ul"
              className={clsx(`${prefixCls}-list`)}
              style={{ padding: 0, margin: 0, listStyle: 'none' }}
            >
              {(item) => {
                if (item.type === 'group-title') {
                  return (
                    <VirtualGroupTitle
                      prefixCls={prefixCls}
                      item={item}
                      enableCollapse={enableCollapse}
                      expandedKeys={expandedKeys}
                      onItemExpand={onItemExpand}
                      collapseMotion={collapseMotion}
                      className={clsx(contextConfig.classNames.group, classNames.group)}
                    />
                  );
                }
                // item type
                const conversationInfo = item.conversationInfo;
                if (conversationInfo.type === 'divider') {
                  return (
                    <Divider className={`${prefixCls}-divider`} dashed={conversationInfo.dashed} />
                  );
                }
                const baseConversationInfo = conversationInfo as ConversationItemType;
                const { label: _, disabled: __, icon: ___, ...restInfo } = baseConversationInfo;
                return (
                  <ConversationsItem
                    {...restInfo}
                    info={baseConversationInfo}
                    prefixCls={prefixCls}
                    direction={direction}
                    className={clsx(
                      classNames.item,
                      contextConfig.classNames.item,
                      baseConversationInfo.className,
                    )}
                    style={{
                      ...contextConfig.styles.item,
                      ...styles.item,
                      ...baseConversationInfo.style,
                    }}
                    menu={typeof menu === 'function' ? menu(baseConversationInfo) : menu}
                    active={mergedActiveKey === baseConversationInfo.key}
                    onClick={onConversationItemClick}
                  />
                );
              }}
            </VirtualList>
          </>
        ) : (
          groupList.map((groupInfo, groupIndex) => {
            const itemNode = getItemNode(groupInfo.data);
            return groupInfo.enableGroup ? (
              <GroupTitleContext.Provider
                key={groupInfo.name || `key-${groupIndex}`}
                value={{
                  prefixCls,
                  groupInfo,
                  enableCollapse,
                  expandedKeys,
                  onItemExpand,
                  collapseMotion,
                }}
              >
                <GroupTitle className={clsx(contextConfig.classNames.group, classNames.group)}>
                  <ul
                    className={clsx(`${prefixCls}-list`, {
                      [`${prefixCls}-group-collapsible-list`]: groupInfo.collapsible,
                    })}
                    style={{ ...contextConfig.styles.group, ...styles.group }}
                  >
                    {itemNode}
                  </ul>
                </GroupTitle>
              </GroupTitleContext.Provider>
            ) : (
              itemNode
            );
          })
        )}
      </ul>
    );
  },
);

const Conversations = ForwardConversations as CompoundedComponent;

if (process.env.NODE_ENV !== 'production') {
  Conversations.displayName = 'Conversations';
}

export type { ConversationItemType, DividerItemType, ItemType };

Conversations.Creation = Creation;
export default Conversations;
