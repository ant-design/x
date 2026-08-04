import { SurfaceAdapterError } from './adapters/shared';
import { CatalogRegistryError, type SurfaceCatalogRegistry } from './catalog';
import { reduceSurfaceTransaction } from './reducer';
import type {
  SurfaceDispatchResult,
  SurfaceInput,
  SurfaceIssue,
  SurfaceLimits,
  SurfaceProtocolAdapter,
  SurfaceRuntimeSnapshot,
  SurfaceSnapshot,
  SurfaceTransaction,
} from './types';

const defaultLimits: SurfaceLimits = {
  maxNodesPerSurface: 2_000,
  maxDepth: 64,
  maxOperationsPerTransaction: 2_500,
  historyLimit: 3,
};

export interface CreateSurfaceRuntimeOptions {
  catalogs: SurfaceCatalogRegistry;
  adapters: readonly SurfaceProtocolAdapter[];
  limits?: Partial<SurfaceLimits>;
  onIssue?: (issue: SurfaceIssue) => void;
}

export interface SurfaceRuntime {
  dispatch(input: SurfaceInput): Promise<SurfaceDispatchResult>;
  dispatchBatch(inputs: readonly SurfaceInput[]): Promise<SurfaceDispatchResult>;
  rollback(surfaceId: string, revision?: number): SurfaceDispatchResult;
  getSnapshot(): SurfaceRuntimeSnapshot;
  getSurface(surfaceId: string): SurfaceSnapshot | undefined;
  subscribe(listener: () => void): () => void;
  dispose(): void;
}

const rejected = (
  snapshot: SurfaceRuntimeSnapshot,
  issue: SurfaceIssue,
  onIssue?: (issue: SurfaceIssue) => void,
): SurfaceDispatchResult => {
  onIssue?.(issue);
  return { accepted: false, issue, snapshot };
};

const cloneSurface = (surface: SurfaceSnapshot): SurfaceSnapshot => ({
  ...surface,
  nodes: new Map(surface.nodes),
  dataModel: { ...surface.dataModel },
});

export function createSurfaceRuntime(options: CreateSurfaceRuntimeOptions): SurfaceRuntime {
  const limits = { ...defaultLimits, ...options.limits };
  const adapterMap = new Map<string, SurfaceProtocolAdapter>();
  options.adapters.forEach((adapter) => {
    adapter.versions.forEach((version) => {
      adapterMap.set(`${adapter.protocol}:${version}`, adapter);
    });
  });

  let snapshot: SurfaceRuntimeSnapshot = { surfaces: new Map() };
  let history = new Map<string, SurfaceSnapshot[]>();
  let processedTransactionIds = new Set<string>();
  let nextInputId = 0;
  let disposed = false;
  const listeners = new Set<() => void>();
  const emit = () =>
    listeners.forEach((listener) => {
      listener();
    });

  const createIssue = (
    code: SurfaceIssue['code'],
    phase: SurfaceIssue['phase'],
    message: string,
    cause?: unknown,
  ): SurfaceIssue => ({ code, phase, message, recoverable: true, cause });

  const normalize = (inputs: readonly SurfaceInput[]) => {
    const transactions: SurfaceTransaction[] = [];
    for (const originalInput of inputs) {
      nextInputId += 1;
      const input = {
        ...originalInput,
        eventId: originalInput.eventId ?? `surface-runtime:${nextInputId}`,
      };
      const adapter = adapterMap.get(`${input.protocol}:${input.version}`);
      if (!adapter) {
        throw createIssue(
          'unsupported_protocol',
          'decode',
          `No Surface adapter supports ${input.protocol} ${input.version}.`,
        );
      }
      const normalized = adapter.normalize(input);
      if ('transactionId' in normalized) transactions.push(normalized);
      else transactions.push(...normalized);
    }
    return transactions;
  };

  const dispatchBatch = async (inputs: readonly SurfaceInput[]): Promise<SurfaceDispatchResult> => {
    if (disposed) {
      return rejected(
        snapshot,
        createIssue('invalid_transition', 'reduce', 'Surface Runtime is disposed.'),
        options.onIssue,
      );
    }

    let transactions: SurfaceTransaction[];
    try {
      transactions = normalize(inputs);
    } catch (error) {
      const surfaceIssue =
        error && typeof error === 'object' && 'code' in error && 'phase' in error
          ? (error as SurfaceIssue)
          : createIssue(
              'invalid_command',
              'decode',
              error instanceof Error ? error.message : 'Unable to decode Surface input.',
              error instanceof SurfaceAdapterError ? undefined : error,
            );
      return rejected(snapshot, surfaceIssue, options.onIssue);
    }

    const seenInBatch = new Set<string>();
    const pending = transactions.filter((transaction) => {
      if (
        processedTransactionIds.has(transaction.transactionId) ||
        seenInBatch.has(transaction.transactionId)
      ) {
        return false;
      }
      seenInBatch.add(transaction.transactionId);
      return true;
    });
    if (pending.length === 0) {
      return { accepted: true, duplicate: true, snapshot };
    }

    try {
      const catalogIds = new Set<string>();
      pending.forEach((transaction) => {
        transaction.operations.forEach((operation) => {
          if (operation.type === 'surface.create') catalogIds.add(operation.catalogId);
        });
      });
      await Promise.all([...catalogIds].map((catalogId) => options.catalogs.resolve(catalogId)));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to resolve Surface catalog.';
      return rejected(
        snapshot,
        createIssue(
          'catalog_not_found',
          'catalog',
          message,
          error instanceof CatalogRegistryError ? undefined : error,
        ),
        options.onIssue,
      );
    }

    let draftSnapshot = snapshot;
    const draftHistory = new Map(history);
    for (const transaction of pending) {
      const previous = draftSnapshot.surfaces.get(transaction.surfaceId);
      const result = reduceSurfaceTransaction(draftSnapshot, transaction, {
        catalogs: options.catalogs,
        limits,
      });
      if (!result.accepted) return rejected(snapshot, result.issue, options.onIssue);

      if (previous) {
        const entries = [
          ...(draftHistory.get(transaction.surfaceId) ?? []),
          cloneSurface(previous),
        ];
        draftHistory.set(transaction.surfaceId, entries.slice(-limits.historyLimit));
      }
      draftSnapshot = result.snapshot;
    }

    snapshot = draftSnapshot;
    history = draftHistory;
    processedTransactionIds = new Set([...processedTransactionIds, ...seenInBatch]);
    emit();
    return { accepted: true, snapshot };
  };

  return {
    dispatch(input) {
      return dispatchBatch([input]);
    },
    dispatchBatch,
    rollback(surfaceId, revision) {
      const current = snapshot.surfaces.get(surfaceId);
      const entries = history.get(surfaceId) ?? [];
      const target =
        revision === undefined
          ? entries[entries.length - 1]
          : entries.find((entry) => entry.revision === revision);
      if (!current || !target) {
        return rejected(
          snapshot,
          {
            code: current ? 'revision_conflict' : 'missing_surface',
            phase: 'reduce',
            message: current
              ? `Surface revision ${revision ?? '<previous>'} is not available for rollback.`
              : `Surface "${surfaceId}" does not exist.`,
            recoverable: true,
            surfaceId,
          },
          options.onIssue,
        );
      }

      const surfaces = new Map(snapshot.surfaces);
      surfaces.set(surfaceId, { ...cloneSurface(target), revision: current.revision + 1 });
      const nextEntries = [...entries, cloneSurface(current)].slice(-limits.historyLimit);
      history = new Map(history).set(surfaceId, nextEntries);
      snapshot = { surfaces };
      emit();
      return { accepted: true, snapshot };
    },
    getSnapshot() {
      return snapshot;
    },
    getSurface(surfaceId) {
      return snapshot.surfaces.get(surfaceId);
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    dispose() {
      disposed = true;
      listeners.clear();
      history.clear();
      processedTransactionIds.clear();
    },
  };
}
