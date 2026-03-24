// A2UI Component System v0.8 Type Definitions
// Flexible component system supporting dynamic component types

/** 数据绑定路径对象 */
export interface PathValue {
  path: string;
}

/** 字面字符串值对象（v0.8 特有） */
export interface LiteralStringValue {
  literalString: string;
}

/** v0.8 children 字段格式，支持数组或 explicitList 对象 */
export interface ExplicitList {
  explicitList: string[];
}

// Component wrapper structure with standard fields and custom properties
export interface ComponentWrapper_v0_8 {
  id: string;
  component: {
    [componentType: string]: {
      // Standard fields for component relationships
      child?: string;
      children?: string[] | ExplicitList;
      // 任何字段均支持字面值或 PathValue / LiteralStringValue 数据绑定形式
      // 例：{ "text": "Hello" } 或 { "text": { "path": "/user/name" } } 或 { "text": { "literalString": "Hello" } }
      [key: string]: any;
    };
  };
}

// Command to update surface components
interface SurfaceUpdateCommand {
  surfaceUpdate: {
    surfaceId: string;
    components: ComponentWrapper_v0_8[];
  };
}

// Command to update data model
interface DataModelUpdateCommand {
  dataModelUpdate: {
    surfaceId: string;
    contents: Array<{
      key: string;
      valueMap: Array<{
        key: string;
        valueString: string;
      }>;
    }>;
  };
}

// Command to begin rendering
interface BeginRenderingCommand {
  beginRendering: {
    surfaceId: string;
    root: string; // Root component ID
  };
}

// Command to delete a surface
interface DeleteSurfaceCommand {
  deleteSurface: {
    surfaceId: string;
  };
}

// Union type for all possible commands
export type A2UICommand_v0_8 =
  | SurfaceUpdateCommand
  | DataModelUpdateCommand
  | BeginRenderingCommand
  | DeleteSurfaceCommand;

// Backward compatible type alias
export type XAgentCommand_v0_8 = A2UICommand_v0_8;
