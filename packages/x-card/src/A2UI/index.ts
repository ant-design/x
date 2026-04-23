import Card from './Card';
import Box from './Box';
export type { BoxProps, ActionPayload } from './types/box';
export type { XAgentCommand_v0_9 } from './types/command_v0.9';
export type { XAgentCommand_v0_8 } from './types/command_v0.8';
export type { Catalog, CatalogComponent } from './catalog';
export { loadCatalog, registerCatalog, validateComponent, clearCatalogCache } from './catalog';

const XCard = { Card, Box };

export default XCard;
