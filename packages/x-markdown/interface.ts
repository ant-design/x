import { TokenizerAndRendererExtension, Tokens } from 'marked';
import { Renderer } from './core';

export type Token = Tokens.Generic;

export interface BufferOption {
  /**
   * @default 1
   */
  step?: number;
  /**
   * @default 50
   */
  interval?: number;
}

export type GenericRendererFunction = (...args: unknown[]) => React.ReactNode | false;

export type RendererObject = {
  [K in keyof Renderer]: GenericRendererFunction;
};

export interface plugin {
  gfm?: boolean;
  walkTokens?: (token: Token) => void | Promise<void>;
  extensions?: TokenizerAndRendererExtension[];
  renderer?: RendererObject;
}

export interface MarkdownProps {
  content?: string;
  components?: RendererObject;
  buffer?: boolean | BufferOption;
  rootClassName?: string;
  children?: string;
  prefixCls?: string;
  plugins?: plugin[];
}
