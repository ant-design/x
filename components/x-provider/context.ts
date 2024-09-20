import React from 'react';

import type { ComponentStyleConfig as AntdComponentStyleConfig } from 'antd/es/config-provider/context';

import type { AnyObject } from '../_util/type';
import type { BubbleProps } from '../bubble';
import type { ConversationsProps } from '../conversations';
import type { PromptsProps } from '../prompts';
import type { SenderProps } from '../sender';
import type { SuggestionProps } from '../suggestion';
import type { ThoughtChainProps } from '../thought-chain';

interface DefaultXComponentConfig {
  classNames: Record<string, string>;
  styles: Record<string, React.CSSProperties>;
  className: string;
  style: React.CSSProperties;
}

export const defaultXComponentConfig: DefaultXComponentConfig = {
  classNames: {},
  styles: {},
  className: '',
  style: {},
};

type DefaultPickType = keyof DefaultXComponentConfig;

type ComponentStyleConfig<
  CompProps extends AnyObject,
  PickType extends keyof CompProps = DefaultPickType,
> = AntdComponentStyleConfig &
  Pick<CompProps, PickType> &
  Required<Pick<CompProps, DefaultPickType>>;

export interface XComponentsConfig {
  bubble?: ComponentStyleConfig<BubbleProps>;
  conversations?: ComponentStyleConfig<ConversationsProps>;
  prompts?: ComponentStyleConfig<PromptsProps>;
  sender?: ComponentStyleConfig<SenderProps>;
  suggestion?: ComponentStyleConfig<SuggestionProps>;
  thoughtChain?: ComponentStyleConfig<ThoughtChainProps>;
}

export interface XProviderProps extends XComponentsConfig {
  // Non-component config props
}

const XProviderContext = React.createContext<XProviderProps>({});

export default XProviderContext;
