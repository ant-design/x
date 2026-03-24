// A2UI Command System v0.9 Type Definitions
// Structured command system with explicit versioning and strict typing

/** 数据绑定路径对象，任何组件字段均可使用此形式实现响应式绑定 */
export interface PathValue {
  path: string;
}

/** Action 事件的 context 字段结构，支持路径绑定 */
export interface ActionContext {
  /** context 中的每个字段都可以是路径绑定或字面值 */
  [key: string]: PathValue | any;
}

/** Action 事件定义 */
export interface ActionEvent {
  /** 事件名称 */
  name: string;
  /**
   * 事件上下文，包含需要上报的数据路径绑定
   * 组件触发 action 时，会自动将组件传递的值写入这些路径
   */
  context?: ActionContext;
}

/** Action 配置 */
export interface ActionConfig {
  /** 事件配置 */
  event?: ActionEvent;
}

// Base component structure for v0.9
export interface BaseComponent_v0_9 {
  id: string;
  component: string; // Component type identifier
  child?: string;
  children?: string[]; // Reference to children component ID
  // 任何字段均支持字面值或 PathValue（{ path: string }）数据绑定形式
  // 例：{ "text": "Hello" } 或 { "text": { "path": "/user/name" } }
  [key: string]: any;
}

// Command to create a new surface
interface CreateSurfaceCommand {
  version: 'v0.9';
  createSurface: {
    surfaceId: string;
    catalogId: string; // 必需，组件目录 URL 或本地标识
  };
}

// Command to update components on a surface
interface UpdateComponentsCommand {
  version: 'v0.9';
  updateComponents: {
    surfaceId: string;
    components: BaseComponent_v0_9[];
  };
}

// Command to update data model
interface UpdateDataModelCommand {
  version: 'v0.9';
  updateDataModel: {
    surfaceId: string;
    path: string;
    value: any;
  };
}

// Command to delete a surface
interface DeleteSurfaceCommand {
  version: 'v0.9';
  deleteSurface: {
    surfaceId: string;
  };
}

// Union type for all possible commands
export type A2UICommand_v0_9 =
  | CreateSurfaceCommand
  | UpdateComponentsCommand
  | UpdateDataModelCommand
  | DeleteSurfaceCommand;

// Backward compatible type alias
export type XAgentCommand_v0_9 = A2UICommand_v0_9;
