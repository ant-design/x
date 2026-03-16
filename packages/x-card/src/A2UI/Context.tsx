import { createContext } from 'react';
import { BoxProps, ActionPayload } from './types/box';

interface IBoxContext {
  components: BoxProps['components'];
  commands?: BoxProps['commands'];
  onAction?: (payload: ActionPayload) => void;
}

const BoxContext = createContext<IBoxContext>({
  components: {},
});

export default BoxContext;
