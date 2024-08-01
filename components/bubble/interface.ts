import type { AvatarProps } from 'antd';

export interface TypingOption {
  /**
   * @default 1
   */
  step?: number;
  /**
   * @default 100
   */
  interval?: number;
}

export interface BubbleProps extends React.HTMLAttributes<HTMLDivElement> {
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
  content: string;
  messageRender?: (content?: string) => React.ReactNode;
}
