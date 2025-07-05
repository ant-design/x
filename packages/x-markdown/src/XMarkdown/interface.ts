import type { MarkedExtension, Tokens } from 'marked';
import { CSSProperties } from 'react';

export type Token = Tokens.Generic;

export interface SteamingOption {
  /**
   * @description 是否还有流式数据
   * @default false
   */
  hasNextChunk: boolean;
}

export interface Options {
  break?: boolean;
  gfm?: boolean;
}

export type GenericRendererFunction = (...args: unknown[]) => React.ReactNode | false;

export type RendererObject = {
  [key: string]: GenericRendererFunction;
};

export interface XMarkdownProps {
  content?: string;
  children?: string;
  options?: Options;
  allowHtml?: boolean;
  components?: Record<string, any>;
  streaming?: SteamingOption;
  plugins?: MarkedExtension['extensions'];
  walkTokens?: (token: Token) => void;
  className?: string;
  style?: CSSProperties;
}
