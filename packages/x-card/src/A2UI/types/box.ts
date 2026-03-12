import type { XAgentCommand_v0_8 } from './command_v0.8';
import type { A2UICommand_v0_9 } from './command_v0.9';

type ComponentName = `${Uppercase<string>}${string}`;

export interface BoxProps {
  children?: React.ReactNode;
  /**
   * @description 配置组件需要遵循 React 组件规范， 组件名称必须以大写字母开头
   */
  components?: Record<ComponentName, React.ComponentType<any>>;
  commands?: A2UICommand_v0_9 | XAgentCommand_v0_8;
}
