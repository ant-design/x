import type { XAgentCommand_v0_8 } from './command_v0.8';
import type { A2UICommand_v0_9 } from './command_v0.9';

type ComponentName = `${Uppercase<string>}${string}`;

/** action 事件载荷，由 Button 等组件触发 */
export interface ActionPayload {
  /** 事件名称，对应 action.event.name */
  name: string;
  /** 触发该 action 的 surfaceId */
  surfaceId: string;
  /** 当前 surface 的完整 dataModel 快照，作为 context */
  context: Record<string, any>;
}

export interface BoxProps {
  children?: React.ReactNode;
  /**
   * @description 配置组件需要遵循 React 组件规范， 组件名称必须以大写字母开头
   */
  components?: Record<ComponentName, React.ComponentType<any>>;
  commands?: A2UICommand_v0_9 | XAgentCommand_v0_8;
  /**
   * @description 当 Card 内部组件触发 action 时回调，携带事件名称、surfaceId 及当前数据快照
   */
  onAction?: (payload: ActionPayload) => void;
}
