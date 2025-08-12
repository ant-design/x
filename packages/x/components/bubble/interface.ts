import type { AnyObject } from '../_util/type';

export type BubbleContentType = React.ReactNode | AnyObject;

export type BubbleSlotType = 'content' | 'body' | 'header' | 'footer' | 'avatar' | 'extra';

export interface BubbleAnimationOption {
  /**
   * @description 动画效果类型，打字机，渐入
   */
  effect: 'typing' | 'fade-in';
  /**
   * @description 内容步进单位，数组格式为随机区间
   */
  step?: number | [number, number];
  /**
   * @description 动画触发间隔
   */
  interval?: number;
  /**
   * @description 重新开始一段动画时是否保留文本的公共前缀
   */
  keepPrefix?: boolean;
  /**
   * @description 打字机效果下步进UI
   */
  suffix?: React.ReactNode;
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

export type BubbleSlot<ContentType> = React.ReactNode | ((content: ContentType) => React.ReactNode);

export interface BubbleRef {
  nativeElement: HTMLElement;
}

export interface BubbleProps<ContentType extends BubbleContentType = string>
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'content' | 'onAnimationStart' | 'onAnimationEnd'
  > {
  prefixCls?: string;
  rootStyle?: React.CSSProperties;
  styles?: Partial<Record<BubbleSlotType | 'root', React.CSSProperties>>;
  rootClassName?: string;
  classNames?: Partial<Record<BubbleSlotType | 'root', string>>;
  placement?: 'start' | 'end';
  loading?: boolean;
  loadingRender?: () => React.ReactNode;
  content: ContentType;
  contentRender?: (content: ContentType) => React.ReactNode;
  /**
   * @description 是否可编辑，提供一个仅针对 content 为 string 的编辑应用场景
   */
  editable?: boolean | EditableBubbleOption;
  /**
   * @description 动画配置，仅在 content 为 string 或 contentRender 返回 string 时生效
   */
  typing?: boolean | BubbleAnimationOption;
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
  components?: {
    header?: BubbleSlot<ContentType>;
    footer?: BubbleSlot<ContentType>;
    avatar?: BubbleSlot<ContentType>;
    extra?: BubbleSlot<ContentType>;
  };
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
  onEditCancle?: () => void;
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

type RemainRole = 'ai' | 'system' | 'user';

type AnyStr = string;

export type BubbleData = BubbleProps<any> & {
  /**
   * @description 数据项唯一标识
   */
  key: string | number;
  /**
   * @description Bubble.List.role key 映射
   */
  role?: RemainRole | AnyStr;
};

export type RoleProps = Pick<
  BubbleData,
  | 'typing'
  | 'variant'
  | 'shape'
  | 'placement'
  | 'rootClassName'
  | 'classNames'
  | 'className'
  | 'rootStyle'
  | 'styles'
  | 'style'
  | 'loading'
  | 'loadingRender'
  | 'contentRender'
  | 'footerPlacement'
  | 'components'
  | 'editable'
  | 'onTyping'
  | 'onTypingComplete'
  | 'onEditConfirm'
  | 'onEditCancle'
>;

export type FuncRoleProps = (data: BubbleData) => RoleProps;

export type RoleType = Partial<Record<RemainRole, RoleProps | FuncRoleProps>> &
  Record<AnyStr, RoleProps | FuncRoleProps>;

export interface BubbleListProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'role'> {
  prefixCls?: string;
  rootClassName?: string;
  rootStyle?: React.CSSProperties;
  items: BubbleData[];
  autoScroll?: boolean;
  /**
   * @description 数据类别基础配置项，优先级低，会被 items 配置覆盖。默认 ai、system、user 三类，允许自定义类别
   */
  role?: RoleType;
}
