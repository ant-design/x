import React, { useEffect, useState } from 'react';
import { BoxProps } from './types/box';
import Context from './Context';
import { loadCatalog, type Catalog } from './catalog';
import type { A2UICommand_v0_9 } from './types/command_v0.9';
import type { A2UICommand_v0_8 } from './types/command_v0.8';

const Box: React.FC<BoxProps> = ({ children, commands = [], components, onAction }) => {
  const [catalogMap, setCatalogMap] = useState<Map<string, Catalog>>(new Map());
  // 存储 surfaceId -> catalogId 的映射
  const [surfaceCatalogMap, setSurfaceCatalogMap] = useState<Map<string, string>>(new Map());

  /**
   * 监听命令队列变化，处理 createSurface（加载 catalog）和 deleteSurface（清理映射）。
   * commands 数组由外部 demo 维护，每次追加新命令后引用变化，触发此 effect。
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

          // 加载 catalog（已缓存则直接命中，不重复请求）
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

      // deleteSurface 时清理 surfaceCatalogMap 中的映射
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
