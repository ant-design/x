import { createContext } from 'react';
import { BoxProps, ActionPayload } from './types/box';
import type { Catalog } from './catalog';
import type { A2UICommand_v0_9 } from './types/command_v0.9';
import type { A2UICommand_v0_8 } from './types/command_v0.8';

interface IBoxContext {
  components: BoxProps['components'];
  /**
   * 命令队列：外部 demo 维护，每次追加新命令后整个数组引用变化。
   * Card 监听此队列，过滤出属于自己 surfaceId 的命令并批量处理。
   */
  commandQueue: (A2UICommand_v0_9 | A2UICommand_v0_8)[];
  onAction?: (payload: ActionPayload) => void;
  /** catalogId -> Catalog 的映射 */
  catalogMap?: Map<string, Catalog>;
  /** surfaceId -> catalogId 的映射 */
  surfaceCatalogMap?: Map<string, string>;
}

const BoxContext = createContext<IBoxContext>({
  components: {},
  commandQueue: [],
});

export default BoxContext;
