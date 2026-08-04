import type { SurfaceCatalogRegistry } from './catalog';
import { JsonPointerError, setValueAtJsonPointer } from './jsonPointer';
import type {
  SurfaceIssue,
  SurfaceLimits,
  SurfaceNode,
  SurfaceNodeInput,
  SurfaceRuntimeSnapshot,
  SurfaceSnapshot,
  SurfaceTransaction,
} from './types';

export interface ReduceSurfaceTransactionOptions {
  catalogs: SurfaceCatalogRegistry;
  limits: SurfaceLimits;
}

export type ReduceSurfaceTransactionResult =
  { accepted: true; snapshot: SurfaceRuntimeSnapshot } | { accepted: false; issue: SurfaceIssue };

const issue = (
  transaction: SurfaceTransaction,
  code: SurfaceIssue['code'],
  message: string,
  path?: string,
  cause?: unknown,
): SurfaceIssue => ({
  code,
  phase: code.startsWith('catalog') || code.includes('allowed') ? 'catalog' : 'reduce',
  message,
  recoverable: true,
  surfaceId: transaction.surfaceId,
  transactionId: transaction.transactionId,
  path,
  cause,
});

const cloneNode = (node: SurfaceNodeInput): SurfaceNode => ({
  id: node.id,
  type: node.type,
  props: { ...(node.props ?? {}) },
  children: [...(node.children ?? [])],
});

function validateGraph(
  surface: SurfaceSnapshot,
  transaction: SurfaceTransaction,
  limits: SurfaceLimits,
): SurfaceIssue | undefined {
  if (surface.nodes.size > limits.maxNodesPerSurface) {
    return issue(
      transaction,
      'limit_exceeded',
      `Surface "${surface.id}" has ${surface.nodes.size} nodes; the limit is ${limits.maxNodesPerSurface}.`,
    );
  }
  if (!surface.rootId) return undefined;
  if (!surface.nodes.has(surface.rootId)) {
    return issue(
      transaction,
      'graph_invariant_failed',
      `Root node "${surface.rootId}" does not exist.`,
    );
  }

  const visiting = new Set<string>();
  const visited = new Set<string>();

  const visit = (nodeId: string, depth: number): SurfaceIssue | undefined => {
    if (depth > limits.maxDepth) {
      return issue(
        transaction,
        'limit_exceeded',
        `Surface "${surface.id}" exceeds the maximum depth of ${limits.maxDepth}.`,
      );
    }
    if (visiting.has(nodeId)) {
      return issue(
        transaction,
        'graph_invariant_failed',
        `Surface "${surface.id}" contains a cycle at node "${nodeId}".`,
      );
    }
    if (visited.has(nodeId)) return undefined;

    const node = surface.nodes.get(nodeId);
    if (!node) {
      return issue(
        transaction,
        'graph_invariant_failed',
        `Surface "${surface.id}" references missing node "${nodeId}".`,
      );
    }

    visiting.add(nodeId);
    for (const childId of node.children) {
      const childIssue = visit(childId, depth + 1);
      if (childIssue) return childIssue;
    }
    visiting.delete(nodeId);
    visited.add(nodeId);
    return undefined;
  };

  return visit(surface.rootId, 1);
}

function validateNodes(
  surface: SurfaceSnapshot,
  nodes: readonly SurfaceNodeInput[],
  transaction: SurfaceTransaction,
  catalogs: SurfaceCatalogRegistry,
): SurfaceIssue | undefined {
  const nodeIds = new Set<string>();
  for (const node of nodes) {
    if (!node.id || !node.type) {
      return issue(
        transaction,
        'schema_validation_failed',
        'Every node must declare a non-empty id and type.',
      );
    }
    if (nodeIds.has(node.id)) {
      return issue(
        transaction,
        'schema_validation_failed',
        `Node "${node.id}" appears more than once in the same operation.`,
      );
    }
    nodeIds.add(node.id);

    const validation = catalogs.validateNode(surface.catalog.id, node);
    if (!validation.valid) {
      const componentDenied = validation.errors.some((error) => error.includes('not declared'));
      return issue(
        transaction,
        componentDenied ? 'component_not_allowed' : 'schema_validation_failed',
        validation.errors.join(' '),
        `/nodes/${node.id}`,
      );
    }
  }
  return undefined;
}

export function reduceSurfaceTransaction(
  snapshot: SurfaceRuntimeSnapshot,
  transaction: SurfaceTransaction,
  options: ReduceSurfaceTransactionOptions,
): ReduceSurfaceTransactionResult {
  if (transaction.operations.length === 0) {
    return {
      accepted: false,
      issue: issue(transaction, 'invalid_command', 'Surface transaction has no operations.'),
    };
  }
  if (transaction.operations.length > options.limits.maxOperationsPerTransaction) {
    return {
      accepted: false,
      issue: issue(
        transaction,
        'limit_exceeded',
        `Surface transaction has ${transaction.operations.length} operations; the limit is ${options.limits.maxOperationsPerTransaction}.`,
      ),
    };
  }

  const current = snapshot.surfaces.get(transaction.surfaceId);
  if (
    transaction.expectedRevision !== undefined &&
    transaction.expectedRevision !== (current?.revision ?? 0)
  ) {
    return {
      accepted: false,
      issue: issue(
        transaction,
        'revision_conflict',
        `Expected Surface revision ${transaction.expectedRevision}, received ${current?.revision ?? 0}.`,
      ),
    };
  }

  let draft = current;
  for (const operation of transaction.operations) {
    if (operation.type === 'surface.create') {
      if (draft && draft.status !== 'deleted') {
        if (!operation.ifAbsent) {
          return {
            accepted: false,
            issue: issue(
              transaction,
              'duplicate_surface',
              `Surface "${transaction.surfaceId}" already exists.`,
            ),
          };
        }
        if (draft.catalog.id !== operation.catalogId) {
          return {
            accepted: false,
            issue: issue(
              transaction,
              'invalid_transition',
              `Surface "${transaction.surfaceId}" cannot change catalogs during implicit creation.`,
            ),
          };
        }
        continue;
      }

      draft = {
        id: transaction.surfaceId,
        status: 'ready',
        protocol: {
          name: transaction.source.protocol,
          version: transaction.source.version,
        },
        catalog: { id: operation.catalogId },
        revision: current?.revision ?? 0,
        nodes: new Map(),
        dataModel: {},
      };
      continue;
    }

    if (!draft) {
      return {
        accepted: false,
        issue: issue(
          transaction,
          'missing_surface',
          `Surface "${transaction.surfaceId}" does not exist.`,
        ),
      };
    }
    if (draft.status === 'deleted') {
      return {
        accepted: false,
        issue: issue(
          transaction,
          'invalid_transition',
          `Surface "${transaction.surfaceId}" is deleted.`,
        ),
      };
    }

    if (operation.type === 'node.upsert') {
      const validationIssue = validateNodes(draft, operation.nodes, transaction, options.catalogs);
      if (validationIssue) return { accepted: false, issue: validationIssue };
      const nodes = new Map(draft.nodes);
      operation.nodes.forEach((node) => {
        nodes.set(node.id, cloneNode(node));
      });
      draft = { ...draft, nodes };
      continue;
    }

    if (operation.type === 'node.remove') {
      const nodes = new Map(draft.nodes);
      operation.nodeIds.forEach((nodeId) => {
        nodes.delete(nodeId);
      });
      draft = { ...draft, nodes };
      continue;
    }

    if (operation.type === 'data.set') {
      try {
        draft = {
          ...draft,
          dataModel: setValueAtJsonPointer(draft.dataModel, operation.path, operation.value),
        };
      } catch (error) {
        return {
          accepted: false,
          issue: issue(
            transaction,
            'schema_validation_failed',
            error instanceof Error ? error.message : 'Invalid data path.',
            operation.path,
            error instanceof JsonPointerError ? undefined : error,
          ),
        };
      }
      continue;
    }

    if (operation.type === 'render.begin') {
      draft = { ...draft, status: 'rendering', rootId: operation.rootId };
      continue;
    }

    draft = {
      ...draft,
      status: 'deleted',
      rootId: undefined,
      nodes: new Map(),
      dataModel: {},
    };
  }

  if (!draft) {
    return {
      accepted: false,
      issue: issue(transaction, 'missing_surface', 'Surface transaction did not create a Surface.'),
    };
  }

  const graphIssue =
    draft.status === 'deleted' ? undefined : validateGraph(draft, transaction, options.limits);
  if (graphIssue) return { accepted: false, issue: graphIssue };

  const surfaces = new Map(snapshot.surfaces);
  surfaces.set(transaction.surfaceId, { ...draft, revision: (current?.revision ?? 0) + 1 });
  return { accepted: true, snapshot: { surfaces } };
}
