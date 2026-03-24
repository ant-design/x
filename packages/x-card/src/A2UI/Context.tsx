import { createContext } from 'react';
import { BoxProps, ActionPayload } from './types/box';
import type { Catalog } from './catalog';

interface IBoxContext {
  components: BoxProps['components'];
  commands?: BoxProps['commands'];
  onAction?: (payload: ActionPayload) => void;
  /** catalogId -> Catalog 的映射 */
  catalogMap?: Map<string, Catalog>;
  /** surfaceId -> catalogId 的映射 */
  surfaceCatalogMap?: Map<string, string>;
  /** 当前命令的版本 */
  commandVersion?: 'v0.8' | 'v0.9';
}

const BoxContext = createContext<IBoxContext>({
  components: {},
});

export default BoxContext;
