import type {
  ConfigProviderProps as AntdConfigProviderProps,
  ThemeConfig,
} from 'antd/es/config-provider';
import React from 'react';
import type { AnyObject, ShortcutKeys } from '../_util/type';
import type { ActionsProps } from '../actions/interface';
import { AttachmentsProps } from '../attachments';
import type { BubbleProps } from '../bubble';
import type { ConversationsProps } from '../conversations';
import type { FileCardProps } from '../file-card';
import { Locale } from '../locale';
import type { PromptsProps } from '../prompts';
import type { SenderProps } from '../sender';
import type { SuggestionProps } from '../suggestion';
import { OverrideToken } from '../theme/cssinjs-utils';
import { MappingAlgorithm } from '../theme/interface';
import type { ThinkProps } from '../think';
import type { ThoughtChainProps } from '../thought-chain';
import type { WelcomeProps } from '../welcome';

interface BaseComponentConfig {
  style: React.CSSProperties;
  styles: Record<string, React.CSSProperties>;
  className: string;
  classNames: Record<string, string>;
}
export interface XComponentConfig extends BaseComponentConfig {
  shortcutKeys: Record<string, ShortcutKeys>;
}

type ComponentConfig<
  CompProps extends AnyObject,
  PickType extends keyof CompProps = keyof BaseComponentConfig,
> = Pick<CompProps, PickType>;

export interface XComponentsConfig {
  bubble?: ComponentConfig<BubbleProps>;
  conversations?: ComponentConfig<ConversationsProps, keyof XComponentConfig>;
  prompts?: ComponentConfig<PromptsProps>;
  sender?: ComponentConfig<SenderProps>;
  suggestion?: ComponentConfig<SuggestionProps>;
  thoughtChain?: ComponentConfig<ThoughtChainProps>;
  attachments?: ComponentConfig<AttachmentsProps>;
  welcome?: ComponentConfig<WelcomeProps>;
  actions?: ComponentConfig<ActionsProps>;
  think?: ComponentConfig<ThinkProps>;
  fileCard?: ComponentConfig<FileCardProps>;
}

type ComponentsConfig = {
  [key in keyof OverrideToken]?: OverrideToken[key] & {
    algorithm?: boolean | MappingAlgorithm | MappingAlgorithm[];
  };
};

export interface XProviderProps
  extends XComponentsConfig,
    Omit<AntdConfigProviderProps, 'theme' | 'locale'> {
  theme?: Omit<ThemeConfig, 'components'> & {
    components?: ThemeConfig['components'] & ComponentsConfig;
  };
  locale?: Locale;
}

const XProviderContext = React.createContext<XProviderProps>({});

export default XProviderContext;
