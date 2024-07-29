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
  avatar?: React.ReactNode;
  placement?: 'start' | 'end';
  loading?: boolean;
  typing?: boolean | TypingOption;
  content: string;
  contentRender?: (content?: string) => React.ReactNode;
}
