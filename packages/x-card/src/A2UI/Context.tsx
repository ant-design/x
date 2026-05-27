import { createContext } from 'react';
import { BoxProps, ActionPayload } from './types/box';
import type { Catalog } from './catalog';
import type { A2UICommand_v0_9 } from './types/command_v0.9';
import type { A2UICommand_v0_8 } from './types/command_v0.8';

interface IBoxContext {
  components: BoxProps['components'];
  /**
   * Command queue: maintained by external demo, entire array reference changes after each new command is appended.
   * Card listens to this queue, filters commands belonging to its surfaceId and processes them in batch.
   */
  commandQueue: (A2UICommand_v0_9 | A2UICommand_v0_8)[];
  onAction?: (payload: ActionPayload) => void;
  /** catalogId -> Catalog mapping */
  catalogMap?: Map<string, Catalog>;
  /** surfaceId -> catalogId mapping */
  surfaceCatalogMap?: Map<string, string>;
}

const BoxContext = createContext<IBoxContext>({
  components: {},
  commandQueue: [],
});

export default BoxContext;
