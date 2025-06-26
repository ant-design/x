import { MarkedExtension, Tokens } from 'marked';

export type Token = Tokens.Generic;

export interface plugin extends Omit<MarkedExtension, 'renderer'> {
  renderer?: any;
}
