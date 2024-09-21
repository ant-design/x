import type { AvatarProps } from 'antd';

export interface TypingOption {
  /**
   * @default 1
   */
  step?: number;
  /**
   * @default 50
   */
  interval?: number;
}

type SemanticType = 'avatar' | 'content';

export interface BubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  prefixCls?: string;
  rootClassName?: string;
  styles?: Partial<Record<SemanticType, React.CSSProperties>>;
  classNames?: Partial<Record<SemanticType, string>>;
  avatar?: AvatarProps | React.ReactElement;
  placement?: 'start' | 'end';
  loading?: boolean;
  typing?: boolean | TypingOption;
  content: string;
  messageRender?: (content: string) => React.ReactNode;
}
