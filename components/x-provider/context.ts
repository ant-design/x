import React from 'react';

import type { ComponentStyleConfig as AntdComponentStyleConfig } from 'antd/es/config-provider/context';

import type { BubbleProps } from '../bubble';
import type { ConversationsProps } from '../conversations';
import type { PromptsProps } from '../prompts';
import type { SenderProps } from '../sender';
import type { SuggestionProps } from '../suggestion';
import type { ThoughtChainProps } from '../thought-chain';

type ComponentStyleConfig<
  CompProps,
  PickType extends keyof CompProps = any,
> = AntdComponentStyleConfig & Pick<CompProps, PickType>;

export interface XComponentsConfig {
  bubble?: ComponentStyleConfig<BubbleProps, 'classNames' | 'styles'>;
  conversations?: ComponentStyleConfig<ConversationsProps, 'classNames' | 'styles'>;
  prompts?: ComponentStyleConfig<PromptsProps, 'styles' | 'classNames'>;
  sender?: ComponentStyleConfig<SenderProps, 'styles' | 'classNames'>;
  suggestion?: ComponentStyleConfig<SuggestionProps>;
  thoughtChain?: ComponentStyleConfig<ThoughtChainProps, 'styles' | 'classNames'>;
}

export interface XProviderProps extends XComponentsConfig {
  // Non-component config props
}

const XProviderContext = React.createContext<XProviderProps>({});

export default XProviderContext;
