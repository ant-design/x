import type { MarkedExtension, MarkedOptions, TokenizerExtension, Tokens } from 'marked';
import { CSSProperties, ReactNode } from 'react';
import { Renderer } from './core';

export interface MarkdownXOptions extends MarkedOptions {
  XRenderer: Renderer;
}

export type Token = Tokens.Generic;

export interface SteamingOption {
  /**
   * @description 是否还有流式数据
   * @default false
   */
  hasNextChunk: boolean;
}

export interface Config {
  break?: boolean;
  gfm?: boolean;
}

export type GenericRendererFunction = (...args: unknown[]) => React.ReactNode | false;

export type RendererObject = {
  [key: string]: GenericRendererFunction;
};

export interface plugin extends Omit<MarkedExtension, 'renderer' | 'walkTokens'> {
  renderer?: any;
  walkTokens?: (token: Token) => void;
}

export interface XMarkdownProps {
  content?: string;
  children?: string;
  config?: Config;
  allowHtml?: boolean;
  components?: Record<string, (props: Token) => ReactNode>;
  streaming?: SteamingOption;
  plugins?: plugin[];
  className?: string;
  style?: CSSProperties;
}
