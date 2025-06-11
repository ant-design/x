import { MarkedExtension, Tokens } from 'marked';
import { Renderer } from './core';
import { CSSProperties } from 'react';

export type Token = Tokens.Generic;

export interface SteamingOption {
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

export interface plugin extends Omit<MarkedExtension, 'renderer'> {
  renderer?: any;
}

export interface MarkdownProps {
  content?: string;
  components?: RendererObject;
  streaming?: boolean | SteamingOption;
  children?: string;
  plugins?: plugin[];
  className?: string;
  style?: CSSProperties;
}
