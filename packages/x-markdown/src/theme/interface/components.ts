import type { ComponentToken as XMarkdownToken } from '../../XMarkdown/style';
import type { ComponentToken as HighlightCodeToken } from '../../plugins/HighlightCode/style';
import type { ComponentToken as MermaidToken } from '../../plugins/Mermaid/style';

export interface ComponentTokenMap {
  XMarkdown: XMarkdownToken;
  Mermaid: MermaidToken;
  HighlightCode: HighlightCodeToken;
}
