import type { ComponentToken as HighlightCodeToken } from '../../plugins/HighlightCode/style';
import type { ComponentToken as MermaidToken } from '../../plugins/Mermaid/style';

export interface ComponentTokenMap {
  Mermaid: MermaidToken;
  HighlightCode: HighlightCodeToken;
}
