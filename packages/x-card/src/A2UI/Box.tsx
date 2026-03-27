import React, { useEffect, useState } from 'react';
import { BoxProps } from './types/box';
import Context from './Context';
import { loadCatalog, type Catalog } from './catalog';
import type { A2UICommand_v0_9 } from './types/command_v0.9';
import type { A2UICommand_v0_8 } from './types/command_v0.8';

const Box: React.FC<BoxProps> = ({ children, commands = [], components, onAction }) => {
  const [catalogMap, setCatalogMap] = useState<Map<string, Catalog>>(new Map());
  // Store surfaceId -> catalogId mapping
  const [surfaceCatalogMap, setSurfaceCatalogMap] = useState<Map<string, string>>(new Map());

  /**
   * Listen to command queue changes, handle createSurface (load catalog) and deleteSurface (clear mapping).
   * The commands array is maintained by external demo, reference changes after each new command is appended, triggering this effect.
   */
  useEffect(() => {
    if (!commands || commands.length === 0) return;

    for (const cmd of commands) {
      if ('createSurface' in cmd) {
        const { surfaceId, catalogId } = (cmd as A2UICommand_v0_9 & { createSurface: any })
          .createSurface;

        if (catalogId) {
          setSurfaceCatalogMap((prev) => {
            if (prev.get(surfaceId) === catalogId) return prev;
            return new Map(prev).set(surfaceId, catalogId);
          });

          // Load catalog (cached ones will be hit directly, no duplicate requests)
          loadCatalog(catalogId)
            .then((catalog) => {
              setCatalogMap((prev) => {
                if (prev.has(catalogId)) return prev;
                return new Map(prev).set(catalogId, catalog);
              });
            })
            .catch((error) => {
              console.error(`Failed to load catalog ${catalogId}:`, error);
            });
        }
      }

      // Clear mapping in surfaceCatalogMap when deleteSurface
      if ('deleteSurface' in cmd) {
        const surfaceId = (cmd as { deleteSurface: { surfaceId: string } }).deleteSurface.surfaceId;
        setSurfaceCatalogMap((prev) => {
          if (!prev.has(surfaceId)) return prev;
          const next = new Map(prev);
          next.delete(surfaceId);
          return next;
        });
      }
    }
  }, [commands]);

  return (
    <Context.Provider
      value={{
        components,
        commandQueue: commands as (A2UICommand_v0_9 | A2UICommand_v0_8)[],
        onAction,
        catalogMap,
        surfaceCatalogMap,
      }}
    >
      {children}
    </Context.Provider>
  );
};
export default Box;
