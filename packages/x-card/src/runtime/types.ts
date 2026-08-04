export type SurfaceStatus = 'ready' | 'rendering' | 'deleted';

export interface SurfaceNode {
  id: string;
  type: string;
  props: Readonly<Record<string, unknown>>;
  children: readonly string[];
}

export interface SurfaceCatalogRef {
  id: string;
}

export interface SurfaceSnapshot {
  id: string;
  status: SurfaceStatus;
  protocol: {
    name: string;
    version: string;
  };
  catalog: SurfaceCatalogRef;
  revision: number;
  rootId?: string;
  nodes: ReadonlyMap<string, SurfaceNode>;
  dataModel: Readonly<Record<string, unknown>>;
}

export interface SurfaceRuntimeSnapshot {
  surfaces: ReadonlyMap<string, SurfaceSnapshot>;
}

export interface SurfaceTransactionSource {
  protocol: string;
  version: string;
  eventId?: string;
  sequence?: number;
}

export interface SurfaceNodeInput {
  id: string;
  type: string;
  props?: Readonly<Record<string, unknown>>;
  children?: readonly string[];
}

export type SurfaceOperation =
  | {
      type: 'surface.create';
      catalogId: string;
      ifAbsent?: boolean;
    }
  | {
      type: 'node.upsert';
      nodes: readonly SurfaceNodeInput[];
    }
  | {
      type: 'node.remove';
      nodeIds: readonly string[];
    }
  | {
      type: 'data.set';
      path: string;
      value: unknown;
    }
  | {
      type: 'render.begin';
      rootId: string;
    }
  | {
      type: 'surface.delete';
      reason?: string;
    };

export interface SurfaceTransaction {
  transactionId: string;
  surfaceId: string;
  expectedRevision?: number;
  source: SurfaceTransactionSource;
  operations: readonly SurfaceOperation[];
}

export interface SurfaceInput {
  protocol: string;
  version: string;
  payload: unknown;
  eventId?: string;
  sequence?: number;
}

export interface SurfaceProtocolAdapter {
  protocol: string;
  versions: readonly string[];
  normalize(input: SurfaceInput): SurfaceTransaction | readonly SurfaceTransaction[];
}

export type SurfaceIssueCode =
  | 'unsupported_protocol'
  | 'invalid_command'
  | 'catalog_not_found'
  | 'component_not_allowed'
  | 'schema_validation_failed'
  | 'duplicate_surface'
  | 'missing_surface'
  | 'invalid_transition'
  | 'revision_conflict'
  | 'graph_invariant_failed'
  | 'limit_exceeded';

export interface SurfaceIssue {
  code: SurfaceIssueCode;
  phase: 'decode' | 'catalog' | 'reduce';
  message: string;
  recoverable: boolean;
  surfaceId?: string;
  transactionId?: string;
  path?: string;
  cause?: unknown;
}

export interface SurfaceDispatchResult {
  accepted: boolean;
  duplicate?: boolean;
  issue?: SurfaceIssue;
  snapshot: SurfaceRuntimeSnapshot;
}

export interface SurfaceLimits {
  maxNodesPerSurface: number;
  maxDepth: number;
  maxOperationsPerTransaction: number;
  historyLimit: number;
}
