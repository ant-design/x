# API Reference

Full TypeScript types for `@ant-design/x-card`.

---

## React Components

### XCard.Box

```typescript
interface BoxProps {
  /** Command queue — append new commands; do NOT replace entire array on each update */
  commands?: (XAgentCommand_v0_9 | XAgentCommand_v0_8)[];
  /** Map of component name → React component implementation */
  components?: Record<string, React.ComponentType<any>>;
  /** Called when a surface component triggers an action */
  onAction?: (payload: ActionPayload) => void;
  children?: React.ReactNode;
}
```

### XCard.Card

```typescript
interface CardProps {
  /** The surfaceId this card renders */
  id: string;
}
```

---

## Command Types (v0.9)

```typescript
type XAgentCommand_v0_9 =
  | { version: 'v0.9'; createSurface: CreateSurfacePayload }
  | { version: 'v0.9'; updateComponents: UpdateComponentsPayload }
  | { version: 'v0.9'; updateDataModel: UpdateDataModelPayload }
  | { version: 'v0.9'; deleteSurface: DeleteSurfacePayload };

interface CreateSurfacePayload {
  surfaceId: string;
  catalogId: string;
  theme?: { primaryColor?: string; iconUrl?: string; agentDisplayName?: string };
  sendDataModel?: boolean;
}

interface UpdateComponentsPayload {
  surfaceId: string;
  components: BaseComponent_v0_9[];
}

interface BaseComponent_v0_9 {
  id: string;
  component: string;
  child?: string;
  children?: string[] | { path: string; componentId: string };
  [key: string]: any | PathValue;
}

interface PathValue {
  path: string;
}

interface UpdateDataModelPayload {
  surfaceId: string;
  path?: string; // JSON Pointer (RFC 6901). Default: "/" (full replace)
  value?: any; // Omit to delete key at path
}

interface DeleteSurfacePayload {
  surfaceId: string;
}
```

---

## Action Types

```typescript
interface ActionPayload {
  name: string;
  surfaceId: string;
  context: Record<string, any>;
}

// Server action definition (on component)
interface ServerAction {
  event: {
    name: string;
    context: Record<string, any | PathValue>;
  };
}

// Client-side function action
interface FunctionAction {
  functionCall: {
    call: string;
    args: Record<string, any>;
  };
}
```

---

## Catalog Types

```typescript
interface Catalog {
  $schema?: string;
  $id?: string;
  title?: string;
  description?: string;
  catalogId?: string;
  components?: Record<string, CatalogComponent>;
  functions?: Record<string, any>;
  $defs?: Record<string, any>;
}

interface CatalogComponent {
  type: 'object';
  properties?: Record<string, any>;
  required?: string[];
  allOf?: any[];
  [key: string]: any;
}
```

---

## Catalog API Functions

```typescript
/** Register a local catalog (call before mounting) */
function registerCatalog(catalog: Catalog): void;

/** Load a catalog by ID — checks local registry first, then remote fetch */
function loadCatalog(catalogId: string): Promise<Catalog>;

/** Validate a component's props against a loaded catalog */
function validateComponent(
  catalog: Catalog,
  componentName: string,
  componentProps: Record<string, any>,
): boolean;

/** Clear the in-memory catalog cache */
function clearCatalogCache(): void;
```

---

## v0.8 Types (deprecated)

```typescript
type XAgentCommand_v0_8 =
  | { updateComponents: UpdateComponents_v0_8 }
  | { dataModelUpdate: DataModelUpdate_v0_8 };

interface UpdateComponents_v0_8 {
  surfaceId: string;
  catalogId: string;
  components: ComponentWrapper_v0_8[];
}

interface ComponentWrapper_v0_8 {
  id: string;
  component: Record<string, Record<string, any>>; // { "Button": { props } }
}

interface DataModelUpdate_v0_8 {
  surfaceId: string;
  contents: Array<{
    key: string;
    valueString?: string;
    valueMap?: Array<{ key: string; valueString: string }>;
  }>;
}
```
