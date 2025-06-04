import { RendererThis, TokenizerAndRendererExtension, Tokens } from 'marked';
import { ReactNode } from 'react';

export type Token = Tokens.Generic;

export type HeadingDepth = 1 | 2 | 3 | 4 | 5 | 6;

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

export type RendererExtensionFunction = (this: RendererThis, token: Token) => ReactNode | null;

export interface plugin {
  gfm?: boolean;
  walkTokens?: (token: Token) => void | Promise<void>;
  extensions?: TokenizerAndRendererExtension[];
  renderer?: RendererExtensionFunction;
}

export interface MarkdownProps {
  content?: string;
  components?: RendererExtensionFunction;
  buffer?: boolean | BufferOption;
  rootClassName?: string;
  children?: string;
  prefixCls?: string;
  plugins?: plugin[];
}
