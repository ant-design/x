interface PathValue {
  path: string;
}

interface LiteralStringValue {
  literalString: string;
}

// A2UI Component System v0.8 Type Definitions
// Flexible component system supporting dynamic component types

// Base value types for data binding
interface PathValue {
  path: string;
}

interface LiteralStringValue {
  literalString: string;
}

// Component wrapper structure with standard fields and custom properties
export interface ComponentWrapper_v0_8 {
  id: string;
  component: {
    [componentType: string]: {
      // Standard fields for component relationships and data binding
      child?: string;
      children?: string[];
      value?: PathValue | LiteralStringValue;

      // All other properties are custom and component-specific
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

// Union type for all possible commands
export type A2UICommand_v0_8 =
  | SurfaceUpdateCommand
  | DataModelUpdateCommand
  | BeginRenderingCommand;

// Backward compatible type alias
export type XAgentCommand_v0_8 = A2UICommand_v0_8;
