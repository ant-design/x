import type { AvatarProps } from 'antd';
import type { AnyObject } from '../_util/type';

export interface TypingOption {
  /**
   * @default 1
   */
  step?: number;
  /**
   * @default 50
   */
  interval?: number;
  /**
   * @default null
   */
  suffix?: React.ReactNode;
}

type SemanticType = 'avatar' | 'content' | 'header' | 'footer';

export type BubbleContentType = React.ReactNode | AnyObject | string | number;

export type messageRenderType<ContentType> = (content: ContentType) => React.ReactNode;

export type footerType<ContentType> =
  | React.ReactNode
  | ((
      bubbleContent: BubbleContentType,
      info: { content: ContentType; key?: string | number },
    ) => React.ReactNode);
export interface BubbleProps<ContentType extends BubbleContentType = string>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content'> {
  prefixCls?: string;
  rootClassName?: string;
  styles?: Partial<Record<SemanticType, React.CSSProperties>>;
  classNames?: Partial<Record<SemanticType, string>>;
  avatar?: AvatarProps | React.ReactElement;
  placement?: 'start' | 'end';
  loading?: boolean;
  typing?: boolean | TypingOption;
  content?: ContentType;
  messageRender?: messageRenderType<ContentType>;
  loadingRender?: () => React.ReactNode;
  variant?: 'filled' | 'borderless' | 'outlined' | 'shadow';
  shape?: 'round' | 'corner';
  onTypingComplete?: VoidFunction;
  key?: string | number;
  _key?: string | number;
  header?: React.ReactNode;
  footer?: footerType<ContentType>;
}
