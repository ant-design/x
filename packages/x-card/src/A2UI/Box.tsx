import React, { useEffect, useState, useMemo } from 'react';
import { BoxProps } from './types/box';
import Context from './Context';
import { loadCatalog, type Catalog } from './catalog';
import type { A2UICommand_v0_9 } from './types/command_v0.9';
import type { A2UICommand_v0_8 } from './types/command_v0.8';

/** 检测命令版本 */
function detectCommandVersion(commands: A2UICommand_v0_9 | A2UICommand_v0_8): 'v0.8' | 'v0.9' {
  if ('version' in commands) {
    return commands.version;
  }
  return 'v0.8';
}

const Box: React.FC<BoxProps> = ({ children, commands, components, onAction }) => {
  const [catalogMap, setCatalogMap] = useState<Map<string, Catalog>>(new Map());
  // 存储 surfaceId -> catalogId 的映射
  const [surfaceCatalogMap, setSurfaceCatalogMap] = useState<Map<string, string>>(new Map());

  // 检测命令版本
  const commandVersion = useMemo(
    () => (commands ? detectCommandVersion(commands) : 'v0.8'),
    [commands],
  );

  // 处理 v0.9 的 createSurface 命令
  useEffect(() => {
    if (commands && 'createSurface' in commands) {
      const { surfaceId, catalogId } = commands.createSurface;
      console.log('Box: createSurface command received (v0.9)', { surfaceId, catalogId });

      // 记录 surfaceId -> catalogId 映射
      if (catalogId) {
        setSurfaceCatalogMap((prev) => {
          const next = new Map(prev).set(surfaceId, catalogId);
          console.log('Box: surfaceCatalogMap updated', next);
          return next;
        });

        // 加载 catalog
        loadCatalog(catalogId)
          .then((catalog) => {
            console.log('Box: catalog loaded', catalogId, catalog);
            setCatalogMap((prev) => {
              if (prev.has(catalogId)) {
                return prev;
              }
              return new Map(prev).set(catalogId, catalog);
            });
          })
          .catch((error) => {
            console.error(`Failed to load catalog ${catalogId}:`, error);
          });
      }
    }
  }, [commands]);

  // 处理 v0.8 的 surfaceUpdate 命令（记录 surface 信息）
  useEffect(() => {
    if (commands && 'surfaceUpdate' in commands) {
      const { surfaceId } = commands.surfaceUpdate;
      console.log('Box: surfaceUpdate command received (v0.8)', { surfaceId });
      // v0.8 不需要 catalogId，使用默认 catalog
    }
  }, [commands]);

  return (
    <Context.Provider
      value={{
        components,
        commands,
        onAction,
        catalogMap,
        surfaceCatalogMap,
        commandVersion,
      }}
    >
      {children}
    </Context.Provider>
  );
};
export default Box;
