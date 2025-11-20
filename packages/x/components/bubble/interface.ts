import type { DividerProps } from 'antd';
import type { AnyObject } from '../_util/type';

export type BubbleContentType = React.ReactNode | AnyObject;

export type SemanticType =
  | 'root'
  | 'content'
  | 'body'
  | 'header'
  | 'footer'
  | 'avatar'
  | 'extra'
  | 'system'
  | 'divider';

export interface BubbleAnimationOption {
  /**
   * @description 动画效果类型，打字机，渐入
   * @default 'fade-in'
   */
  effect: 'typing' | 'fade-in';
  /**
   * @description 内容步进单位，数组格式为随机区间
   * @default 6
   */
  step?: number | [number, number];
  /**
   * @description 动画触发间隔
   * @default 100
   */
  interval?: number;
  /**
   * @description 重新开始一段动画时是否保留文本的公共前缀
   * @default true
   */
  keepPrefix?: boolean;
}

export interface EditableBubbleOption {
  /**
   * @description 是否可编辑，提供一个仅针对 content 为 string 的编辑应用场景
   */
  editing?: boolean;
  /**
   * @description 确认按钮
   */
  okText?: React.ReactNode;
  /**
   * @description 取消按钮
   */
  cancelText?: React.ReactNode;
}

export type BubbleSlot<ContentType> =
  | React.ReactNode
  | ((content: ContentType, info: Info) => React.ReactNode);

export interface BubbleRef {
  nativeElement: HTMLElement;
}

export enum MessageStatus {
  local = 'local',
  loading = 'loading',
  updating = 'updating',
  success = 'success',
  error = 'error',
  abort = 'abort',
}

export type Info = {
  status?: `${MessageStatus}`;
  key?: string | number;
  extraInfo?: AnyObject;
};
export interface BubbleProps<ContentType extends BubbleContentType = string>
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'content' | 'onAnimationStart' | 'onAnimationEnd'
  > {
  prefixCls?: string;
  styles?: Partial<Record<SemanticType, React.CSSProperties>>;
  rootClassName?: string;
  classNames?: Partial<Record<SemanticType, string>>;
  placement?: 'start' | 'end';
  loading?: boolean;
  loadingRender?: () => React.ReactNode;
  content: ContentType;
  contentRender?: (content: ContentType, info: Info) => React.ReactNode;
  /**
   * @description 是否可编辑，提供一个仅针对 content 为 string 的编辑应用场景
   */
  editable?: boolean | EditableBubbleOption;
  /**
   * @description 动画配置，仅在 content 为 string 或 contentRender 返回 string 时生效
   */
  typing?:
    | boolean
    | BubbleAnimationOption
    | ((content: ContentType, info: Info) => boolean | BubbleAnimationOption);
  /**
   * @description 是否为流式传输 content
   * @default false
   */
  streaming?: boolean;
  /**
   * @description 气泡变体，filled-填充，无边框，outlined-填充，有边框，shadow-填充，无边框，有阴影
   * @default filled
   */
  variant?: 'filled' | 'outlined' | 'shadow' | 'borderless';
  /**
   * @description 气泡形状，default-圆角方形，round-胶囊，corner-气泡
   * @default default
   */
  shape?: 'default' | 'round' | 'corner';
  /**
   * @description 气泡底部插槽渲染位置
   * @default 'outer'
   */
  footerPlacement?: 'outer-start' | 'outer-end' | 'inner-start' | 'inner-end';
  /**
   * @description bubble 扩展槽位渲染配置
   */
  header?: BubbleSlot<ContentType>;
  footer?: BubbleSlot<ContentType>;
  avatar?: BubbleSlot<ContentType>;
  extra?: BubbleSlot<ContentType>;
  /**
   * @description 动画执行时回调
   * @param rendererContent 已渲染内容
   * @param currentContent 当前全量 content
   */
  onTyping?: (rendererContent: string, currentContent: string) => void;
  /**
   * @description 动画结束回调
   */
  onTypingComplete?: (content: string) => void;
  /**
   * @description 编辑态下内容变化时回调
   */
  onEditConfirm?: (content: string) => void;
  /**
   * @description 编辑态下内容变化时回调
   */
  onEditCancel?: () => void;
}

type SystemBubbleSemanticName = 'root' | 'body' | 'content';

export interface SystemBubbleProps<ContentType extends BubbleContentType = string>
  extends Pick<
    BubbleProps<ContentType>,
    'prefixCls' | 'content' | 'style' | 'className' | 'rootClassName' | 'variant' | 'shape'
  > {
  styles?: Partial<Record<SystemBubbleSemanticName, React.CSSProperties>>;
  classNames?: Partial<Record<SystemBubbleSemanticName, string>>;
}

export interface DividerBubbleProps<ContentType extends BubbleContentType = string> {
  prefixCls?: string;
  rootClassName?: string;
  style?: React.CSSProperties;
  className?: string;
  styles?: Partial<Record<SemanticType, React.CSSProperties>>;
  classNames?: Partial<Record<SemanticType, string>>;
  content?: ContentType;
  dividerProps?: Omit<DividerProps, 'children'>;
}

export interface BubbleListRef {
  nativeElement: HTMLDivElement;
  scrollTo: (options: {
    /**
     * @description 数据项唯一标识
     */
    key?: string | number;
    /**
     * @description 滚动条位置，可选传递 'bottom'（视觉底部）、'top'（视觉顶部）
     */
    top?: number | 'bottom' | 'top';
    behavior?: ScrollBehavior;
    block?: ScrollLogicalPosition;
  }) => void;
}

type RemainRole = 'ai' | 'system' | 'user' | 'divider';

type AnyStr = string;

export type BubbleItemType = (Omit<BubbleProps<any>, 'styles' | 'classNames'> &
  Omit<DividerBubbleProps<any>, 'styles' | 'classNames'>) & {
  /**
   * @description 数据项唯一标识
   */
  key: string | number;
  /**
   * @description Bubble.List.role key 映射
   */
  role: RemainRole | AnyStr;
  status?: `${MessageStatus}`;
  extraInfo?: AnyObject;
  styles?: Partial<Record<SemanticType | 'bubble' | 'system' | 'divider', React.CSSProperties>>;
  classNames?: Partial<Record<SemanticType | 'bubble' | 'system' | 'divider', string>>;
};

export type RoleProps = Pick<
  BubbleProps<any>,
  | 'typing'
  | 'variant'
  | 'shape'
  | 'placement'
  | 'rootClassName'
  | 'classNames'
  | 'className'
  | 'styles'
  | 'style'
  | 'loading'
  | 'loadingRender'
  | 'contentRender'
  | 'footerPlacement'
  | 'header'
  | 'footer'
  | 'extra'
  | 'avatar'
  | 'editable'
  | 'onTyping'
  | 'onTypingComplete'
  | 'onEditConfirm'
  | 'onEditCancel'
>;
export type FuncRoleProps = (data: BubbleItemType) => RoleProps;

export type DividerRoleProps = Partial<DividerBubbleProps>;
export type FuncDividerRoleProps = (data: BubbleItemType) => DividerRoleProps;

export type RoleType = Partial<
  Record<Exclude<RemainRole, 'divider'>, RoleProps | FuncRoleProps>
> & { divider?: DividerRoleProps | FuncDividerRoleProps } & Record<
    AnyStr,
    RoleProps | FuncRoleProps
  >;
export interface BubbleListProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'role'> {
  prefixCls?: string;
  styles?: Partial<
    Record<SemanticType | 'scroll' | 'bubble' | 'system' | 'divider', React.CSSProperties>
  >;
  classNames?: Partial<Record<SemanticType | 'scroll' | 'bubble' | 'system' | 'divider', string>>;
  rootClassName?: string;
  items: BubbleItemType[];
  autoScroll?: boolean;
  /**
   * @description 数据类别基础配置项，优先级低，会被 items 配置覆盖。默认 ai、system、user、divider 四类，允许自定义类别
   */
  role?: RoleType;
}
