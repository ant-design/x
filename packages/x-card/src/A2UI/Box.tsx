import React, { useEffect, useState } from 'react';
import { BoxProps } from './types/box';
import Context from './Context';
import { loadCatalog, type Catalog } from './catalog';

const Box: React.FC<BoxProps> = ({ children, commands, components, onAction }) => {
  const [catalogMap, setCatalogMap] = useState<Map<string, Catalog>>(new Map());
  // 存储 surfaceId -> catalogId 的映射
  const [surfaceCatalogMap, setSurfaceCatalogMap] = useState<Map<string, string>>(new Map());

  // 当收到 createSurface 命令时，加载 catalog 并记录映射关系
  useEffect(() => {
    if (commands && 'createSurface' in commands) {
      const { surfaceId, catalogId } = commands.createSurface;
      console.log('Box: createSurface command received', { surfaceId, catalogId });

      // 记录 surfaceId -> catalogId 映射
      if (catalogId) {
        setSurfaceCatalogMap((prev) => {
          const next = new Map(prev).set(surfaceId, catalogId);
          console.log('Box: surfaceCatalogMap updated', next);
          return next;
        });

        // 加载 catalog（使用函数式更新避免依赖 catalogMap）
        loadCatalog(catalogId)
          .then((catalog) => {
            console.log('Box: catalog loaded', catalogId, catalog);
            setCatalogMap((prev) => {
              // 检查是否已经存在，避免重复设置
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
  }, [commands]); // 移除 catalogMap 依赖

  return (
    <Context.Provider value={{ components, commands, onAction, catalogMap, surfaceCatalogMap }}>
      <div>{children}</div>
    </Context.Provider>
  );
};
export default Box;
