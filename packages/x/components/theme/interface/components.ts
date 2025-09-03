import type { ComponentToken as ActionsToken } from '../../actions/style';
import type { ComponentToken as AttachmentsToken } from '../../attachments/style';
import type { ComponentToken as BubbleComponentToken } from '../../bubble/style';
import type { ComponentToken as ConversationsComponentToken } from '../../conversations/style';
import type { ComponentToken as FileCardComponentToken } from '../../file-card/style';
import type { ComponentToken as PromptsComponentToken } from '../../prompts/style';
import type { ComponentToken as SenderComponentToken } from '../../sender/style';
import type { ComponentToken as SuggestionComponentToken } from '../../suggestion/style';
import type { ComponentToken as ThinkComponentToken } from '../../think/style';
import type { ComponentToken as ThoughtChainComponentToken } from '../../thought-chain/style';
import type { ComponentToken as WelcomeComponentToken } from '../../welcome/style';
import type { ComponentTokenMap as XMarkdownToken } from './XMarkdownComponents';

export interface ComponentTokenMap extends XMarkdownToken {
  Attachments?: AttachmentsToken;
  Bubble?: BubbleComponentToken;
  Conversations?: ConversationsComponentToken;
  Prompts?: PromptsComponentToken;
  Sender?: SenderComponentToken;
  Suggestion?: SuggestionComponentToken;
  Think?: ThinkComponentToken;
  ThoughtChain?: ThoughtChainComponentToken;
  Welcome?: WelcomeComponentToken;
  Actions?: ActionsToken;
  FileCard?: FileCardComponentToken;
}
