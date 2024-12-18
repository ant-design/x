import type { AvatarProps } from 'antd';
import { TextAreaProps } from 'antd/es/input';
import { ButtonProps } from 'antd/lib';

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

type SemanticType = 'avatar' | 'content' | 'header' | 'footer';

type EditorButtonsConfig = {
  type: 'save' | 'cancel';
  text?: string;
  option?: ButtonProps;
};

export interface EditConfig {
  editing?: boolean;
  onChange?: (content: string) => void;
  onCancel?: VoidFunction;
  onEnd?: (content: string) => void;
  styles?: React.CSSProperties;
  classNames?: string;
  textarea?: TextAreaProps;
  buttons?: EditorButtonsConfig[];
}

export interface BubbleProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content'> {
  prefixCls?: string;
  rootClassName?: string;
  styles?: Partial<Record<SemanticType, React.CSSProperties>>;
  classNames?: Partial<Record<SemanticType, string>>;
  avatar?: AvatarProps | React.ReactElement;
  placement?: 'start' | 'end';
  loading?: boolean;
  typing?: boolean | TypingOption;
  content?: React.ReactNode | object;
  messageRender?: (content: string) => React.ReactNode;
  loadingRender?: () => React.ReactNode;
  variant?: 'filled' | 'borderless' | 'outlined' | 'shadow';
  shape?: 'round' | 'corner';
  onTypingComplete?: VoidFunction;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  editable?: EditConfig;
}
