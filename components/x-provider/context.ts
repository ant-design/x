import React from 'react';

import type { AnyObject } from '../_util/type';
import { AttachmentsProps } from '../attachments';
import type { BubbleProps } from '../bubble';
import type { ConversationsProps } from '../conversations';
import type { PromptsProps } from '../prompts';
import type { SenderProps } from '../sender';
import type { SuggestionProps } from '../suggestion';
import type { ThoughtChainProps } from '../thought-chain';
import type { WelcomeProps } from '../welcome';

export interface XComponentStyleConfig {
  classNames: Record<string, string>;
  styles: Record<string, React.CSSProperties>;
  className: string;
  style: React.CSSProperties;
}

type DefaultPickType = keyof XComponentStyleConfig;

type ComponentStyleConfig<
  CompProps extends AnyObject,
  PickType extends keyof CompProps = DefaultPickType,
> = Pick<CompProps, PickType | DefaultPickType>;

export interface XComponentsConfig {
  bubble?: ComponentStyleConfig<BubbleProps>;
  conversations?: ComponentStyleConfig<ConversationsProps>;
  prompts?: ComponentStyleConfig<PromptsProps>;
  sender?: ComponentStyleConfig<SenderProps>;
  suggestion?: ComponentStyleConfig<SuggestionProps>;
  thoughtChain?: ComponentStyleConfig<ThoughtChainProps>;
  attachments?: ComponentStyleConfig<AttachmentsProps>;
  welcome?: ComponentStyleConfig<WelcomeProps>;
}

export interface XProviderProps extends XComponentsConfig {
  // Non-component config props
}

const XProviderContext = React.createContext<XProviderProps>({});

export default XProviderContext;
