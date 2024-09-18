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

export interface BubbleProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content'> {
  prefixCls?: string;
  rootClassName?: string;
  classNames?: {
    avatar?: string;
    content?: string;
  };
  styles?: {
    avatar?: React.CSSProperties;
    content?: React.CSSProperties;
  };
  avatar?: AvatarProps | React.ReactElement;
  placement?: 'start' | 'end';
  loading?: boolean;
  typing?: boolean | TypingOption;
  content?: React.ReactNode | object;
  messageRender?: (content: string) => React.ReactNode;
  variant?: 'filled' | 'borderless';
  onTypingComplete?: VoidFunction;
}
