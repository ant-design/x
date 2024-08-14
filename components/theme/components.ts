import type { ComponentToken as BubbleComponentToken } from '../bubble/style';
import type { ComponentToken as PromptsComponentToken } from '../prompts/style';
import type { ComponentToken as ConversationsComponentToken } from '../conversations/style';

export interface ComponentTokenMap {
  Bubble?: BubbleComponentToken;
  Conversations?: ConversationsComponentToken;
  Prompts?: PromptsComponentToken;
}
