import React, { useEffect, useRef, useState } from 'react';
import { BoxProps } from './types/box';
import Context from './Context';
import { loadCatalog, type Catalog } from './catalog';
import type { A2UICommand_v0_9 } from './types/command_v0.9';
import type { A2UICommand_v0_8 } from './types/command_v0.8';

const Box: React.FC<BoxProps> = ({ children, commands = [], components, onAction }) => {
  const [catalogMap, setCatalogMap] = useState<Map<string, Catalog>>(new Map());
  // Store surfaceId -> catalogId mapping
  const [surfaceCatalogMap, setSurfaceCatalogMap] = useState<Map<string, string>>(new Map());
  // Track the number of already-processed commands to avoid re-processing on every render
  const processedCommandsCount = useRef(0);

  /**
   * Listen to command queue changes, handle createSurface (load catalog) and deleteSurface (clear mapping).
   * The commands array is maintained by external demo, reference changes after each new command is appended, triggering this effect.
   * Only new commands (appended since last render) are processed to avoid redundant work as the queue grows.
   */
  useEffect(() => {
    // commands was cleared or reset — reset the counter and bail out
    if (!commands || commands.length === 0) {
      processedCommandsCount.current = 0;
      return;
    }

    // commands array was replaced with a shorter one (e.g. reset by parent) — reset counter and reprocess from scratch
    if (commands.length < processedCommandsCount.current) {
      processedCommandsCount.current = 0;
    }

    // Only process commands added since the last effect run
    const newCommands = commands.slice(processedCommandsCount.current);
    if (newCommands.length === 0) return;

    for (const cmd of newCommands) {
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

    // Advance the pointer to the end of the current commands array
    processedCommandsCount.current = commands.length;
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
