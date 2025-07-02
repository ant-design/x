import type { CollapsibleOptions } from '../_util/hooks/use-collapsible';
import { THOUGHT_CHAIN_ITEM_STATUS } from './Status';

export interface ThoughtChainItem {
  /**
   * @desc 思维节点唯一标识符
   * @descEN Unique identifier
   */
  key?: string;

  /**
   * @desc 思维节点图标
   * @descEN Thought chain item icon
   */
  icon?: React.ReactNode;

  /**
   * @desc 思维节点标题
   * @descEN Thought chain item title
   */
  title?: React.ReactNode;

  /**
   * @desc 思维节点描述
   * @descEN Thought chain item description
   */
  description?: React.ReactNode;

  /**
   * @desc 思维节点内容
   * @descEN Thought chain item content
   */
  content?: React.ReactNode;

  /**
   * @desc 思维节点脚注
   * @descEN Thought chain item footer
   */
  footer?: React.ReactNode;

  /**
   * @desc 思维节点状态
   * @descEN Thought chain item status
   */
  status?: `${THOUGHT_CHAIN_ITEM_STATUS}`;
  /**
   * @desc 是否可折叠
   * @descEN Whether collapsible
   */
  collapsible?: boolean;
}
export type SemanticType =
  | 'root'
  | 'item'
  | 'itemHeader'
  | 'itemIcon'
  | 'itemContent'
  | 'itemFooter';

export interface ThoughtChainProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * @desc 思维节点集合
   * @descEN chain items
   */
  items?: ThoughtChainItem[];
  /**
   * @desc 初始化展开的节点
   * @descEN default expanded keys
   */
  defaultExpandedKeys?: CollapsibleOptions['defaultExpandedKeys'];
  /**
   * @desc 当前展开的节点
   * @descEN current expanded keys
   */
  expandedKeys?: CollapsibleOptions['expandedKeys'];
  /**
   * @desc 展开节点变化回调
   * @descEN callback when expanded keys change
   */
  onExpand?: CollapsibleOptions['onExpand'];
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
   * @desc 线条样式
   * @descEN Line style
   */
  line?: boolean | 'solid' | 'dashed' | 'dotted‌';
}
