// A2UI Command System v0.9 Type Definitions
// Structured command system with explicit versioning and strict typing

// Base value type for path-based data binding
interface PathValue {
  path: string;
}

// Base component structure for v0.9
interface BaseComponent {
  id: string;
  component: string; // Component type identifier
  child?: string; // Reference to child component ID
  value?: PathValue; // Data binding value
  [key: string]: any; // Additional component-specific properties
}

// Command to create a new surface
interface CreateSurfaceCommand {
  version: 'v0.9';
  createSurface: {
    surfaceId: string;
    catalogId: string;
  };
}

// Command to update components on a surface
interface UpdateComponentsCommand {
  version: 'v0.9';
  updateComponents: {
    surfaceId: string;
    components: BaseComponent[];
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

// Union type for all possible commands
export type A2UICommand_v0_9 =
  | CreateSurfaceCommand
  | UpdateComponentsCommand
  | UpdateDataModelCommand;

// Backward compatible type alias
export type XAgentCommand_v0_9 = A2UICommand_v0_9;
