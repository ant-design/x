import type { SurfaceOperation, SurfaceProtocolAdapter } from '../types';
import {
  createNode,
  createTransaction,
  readChildren,
  requireRecord,
  requireString,
  SurfaceAdapterError,
} from './shared';

export const a2uiV09Adapter: SurfaceProtocolAdapter = {
  protocol: 'a2ui',
  versions: ['0.9', 'v0.9'],
  normalize(input) {
    const command = requireRecord(input.payload, 'A2UI v0.9 command');
    if (command.version !== 'v0.9') {
      throw new SurfaceAdapterError('A2UI v0.9 command must declare version "v0.9".');
    }

    if ('createSurface' in command) {
      const payload = requireRecord(command.createSurface, 'createSurface');
      const surfaceId = requireString(payload.surfaceId, 'createSurface.surfaceId');
      const catalogId = requireString(payload.catalogId, 'createSurface.catalogId');
      return createTransaction(input, surfaceId, [{ type: 'surface.create', catalogId }]);
    }

    if ('updateComponents' in command) {
      const payload = requireRecord(command.updateComponents, 'updateComponents');
      const surfaceId = requireString(payload.surfaceId, 'updateComponents.surfaceId');
      if (!Array.isArray(payload.components)) {
        throw new SurfaceAdapterError('updateComponents.components must be an array.');
      }
      const nodes = payload.components.map((component, index) => {
        const value = requireRecord(component, `updateComponents.components[${index}]`);
        const id = requireString(value.id, `updateComponents.components[${index}].id`);
        const type = requireString(
          value.component,
          `updateComponents.components[${index}].component`,
        );
        const children = readChildren(
          value.child,
          value.children,
          `updateComponents.components[${index}]`,
        );
        return createNode(id, type, value, children, ['id', 'component', 'child', 'children']);
      });
      const operations: SurfaceOperation[] = [{ type: 'node.upsert', nodes }];
      if (nodes.some((node) => node.id === 'root')) {
        operations.push({ type: 'render.begin' as const, rootId: 'root' });
      }
      return createTransaction(input, surfaceId, operations);
    }

    if ('updateDataModel' in command) {
      const payload = requireRecord(command.updateDataModel, 'updateDataModel');
      const surfaceId = requireString(payload.surfaceId, 'updateDataModel.surfaceId');
      const path = requireString(payload.path, 'updateDataModel.path');
      return createTransaction(input, surfaceId, [
        { type: 'data.set', path, value: payload.value },
      ]);
    }

    if ('deleteSurface' in command) {
      const payload = requireRecord(command.deleteSurface, 'deleteSurface');
      const surfaceId = requireString(payload.surfaceId, 'deleteSurface.surfaceId');
      return createTransaction(input, surfaceId, [{ type: 'surface.delete' }]);
    }

    throw new SurfaceAdapterError('Unsupported A2UI v0.9 command.');
  },
};
