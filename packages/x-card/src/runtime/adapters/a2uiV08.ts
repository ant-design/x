import { escapeJsonPointerSegment } from '../jsonPointer';
import type { SurfaceProtocolAdapter } from '../types';
import {
  createNode,
  createTransaction,
  isRecord,
  readChildren,
  requireRecord,
  requireString,
  SurfaceAdapterError,
} from './shared';

export interface CreateA2UIV08AdapterOptions {
  catalogId: string;
}

export function createA2UIV08Adapter(options: CreateA2UIV08AdapterOptions): SurfaceProtocolAdapter {
  if (!options.catalogId) throw new SurfaceAdapterError('A2UI v0.8 requires a catalogId.');

  return {
    protocol: 'a2ui',
    versions: ['0.8', 'v0.8'],
    normalize(input) {
      const command = requireRecord(input.payload, 'A2UI v0.8 command');

      if ('surfaceUpdate' in command) {
        const payload = requireRecord(command.surfaceUpdate, 'surfaceUpdate');
        const surfaceId = requireString(payload.surfaceId, 'surfaceUpdate.surfaceId');
        if (!Array.isArray(payload.components)) {
          throw new SurfaceAdapterError('surfaceUpdate.components must be an array.');
        }
        const nodes = payload.components.map((component, index) => {
          const value = requireRecord(component, `surfaceUpdate.components[${index}]`);
          const id = requireString(value.id, `surfaceUpdate.components[${index}].id`);
          const componentValue = requireRecord(
            value.component,
            `surfaceUpdate.components[${index}].component`,
          );
          const entries = Object.entries(componentValue);
          if (entries.length !== 1) {
            throw new SurfaceAdapterError(
              `surfaceUpdate.components[${index}].component must declare exactly one type.`,
            );
          }
          const [type, configValue] = entries[0];
          const config = requireRecord(configValue, `surfaceUpdate.components[${index}].${type}`);
          const explicitList = isRecord(config.children) ? config.children.explicitList : undefined;
          const children = readChildren(
            config.child,
            explicitList ?? config.children,
            `surfaceUpdate.components[${index}].${type}`,
          );
          return createNode(id, type, config, children, ['child', 'children']);
        });
        return createTransaction(input, surfaceId, [
          { type: 'surface.create', catalogId: options.catalogId, ifAbsent: true },
          { type: 'node.upsert', nodes },
        ]);
      }

      if ('dataModelUpdate' in command) {
        const payload = requireRecord(command.dataModelUpdate, 'dataModelUpdate');
        const surfaceId = requireString(payload.surfaceId, 'dataModelUpdate.surfaceId');
        if (!Array.isArray(payload.contents)) {
          throw new SurfaceAdapterError('dataModelUpdate.contents must be an array.');
        }
        const operations = payload.contents.map((item, index) => {
          const value = requireRecord(item, `dataModelUpdate.contents[${index}]`);
          const key = requireString(value.key, `dataModelUpdate.contents[${index}].key`);
          let nextValue: unknown;
          if (typeof value.valueString === 'string') {
            nextValue = value.valueString;
          } else if (Array.isArray(value.valueMap)) {
            nextValue = Object.fromEntries(
              value.valueMap.map((entry, entryIndex) => {
                const mapEntry = requireRecord(
                  entry,
                  `dataModelUpdate.contents[${index}].valueMap[${entryIndex}]`,
                );
                return [
                  requireString(mapEntry.key, 'valueMap.key'),
                  requireString(mapEntry.valueString, 'valueMap.valueString'),
                ];
              }),
            );
          } else {
            throw new SurfaceAdapterError(
              `dataModelUpdate.contents[${index}] must declare valueString or valueMap.`,
            );
          }
          return {
            type: 'data.set' as const,
            path: `/${escapeJsonPointerSegment(key)}`,
            value: nextValue,
          };
        });
        return createTransaction(input, surfaceId, operations);
      }

      if ('beginRendering' in command) {
        const payload = requireRecord(command.beginRendering, 'beginRendering');
        const surfaceId = requireString(payload.surfaceId, 'beginRendering.surfaceId');
        const rootId = requireString(payload.root, 'beginRendering.root');
        return createTransaction(input, surfaceId, [{ type: 'render.begin', rootId }]);
      }

      if ('deleteSurface' in command) {
        const payload = requireRecord(command.deleteSurface, 'deleteSurface');
        const surfaceId = requireString(payload.surfaceId, 'deleteSurface.surfaceId');
        return createTransaction(input, surfaceId, [{ type: 'surface.delete' }]);
      }

      throw new SurfaceAdapterError('Unsupported A2UI v0.8 command.');
    },
  };
}
