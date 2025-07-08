import type { MarkedExtension, Tokens } from 'marked';
import { CSSProperties } from 'react';

type Token = Tokens.Generic;

interface SteamingOption {
  /**
   * @description 是否还有流式数据
   * @default false
   */
  hasNextChunk: boolean;
}

interface XMarkdownProps {
  content?: string;
  children?: string;
  breaks?: boolean;
  gfm?: boolean;
  components?: Record<string, any>;
  streaming?: SteamingOption;
  plugins?: MarkedExtension;
  rootClassName?: string;
  className?: string;
  style?: CSSProperties;
}

export type { XMarkdownProps, Token, Tokens };
