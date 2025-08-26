import { ControllerUpdate } from '@react-spring/web';
import { DOMNode } from 'html-react-parser';
import type { MarkedExtension, Tokens } from 'marked';
import { CSSProperties } from 'react';

type Token = Tokens.Generic;

interface SteamingOption {
  /**
   * @description 是否还有流式数据
   * @default false
   */
  hasNextChunk?: boolean;
  /**
   * @description 是否开启文字渐显
   * @default false
   */
  enableAnimation?: boolean;
  /**
   * @description 文字动画配置
   */
  animationConfig?: ControllerUpdate;
}

export interface ComponentProps {
  /**
   * @description html react parser node
   */
  domNode: DOMNode;
  /**
   * @description stream render status
   */
  streamStatus: 'loading' | 'done';
  [key: string]: any;
}

interface XMarkdownProps {
  content?: string;
  children?: string;
  components?: Record<string, React.ComponentType<ComponentProps>>;
  streaming?: SteamingOption;
  config?: MarkedExtension;
  rootClassName?: string;
  className?: string;
  paragraphTag?: string;
  style?: CSSProperties;
  prefixCls?: string;
}

export type { XMarkdownProps, Token, Tokens };
