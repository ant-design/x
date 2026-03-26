import React, { useEffect, useRef, useState } from 'react';
import BoxContext from './Context';
import { createComponentTransformer } from './format/components';
import type { ComponentTransformer, ReactComponentTree } from './format/components';
import type { Catalog } from './catalog';

// v0.8 专用逻辑
import { resolvePropsV08, extractDataUpdatesV08, applyDataModelUpdateV08 } from './Card.v0.8';

// v0.9 专用逻辑
import { resolvePropsV09, extractDataUpdatesV09, applyDataModelUpdateV09 } from './Card.v0.9';

// 共享逻辑
import { setValueByPath, validateComponentAgainstCatalog } from './utils';

export interface CardProps {
  id: string;
}

/** 递归渲染单个节点，子节点通过 getById 查找 */
function renderNode(
  nodeId: string,
  transformer: ComponentTransformer,
  components: Record<string, React.ComponentType<any>>,
  dataModel: Record<string, any>,
  onAction?: (name: string, context: Record<string, any>, actionConfig?: any) => void,
  onDataChange?: (path: string, value: any) => void,
  catalog?: Catalog,
  commandVersion?: 'v0.8' | 'v0.9',
): React.ReactNode {
  const node = transformer.getById(nodeId);

  if (!node) return null;
  return (
    <NodeRenderer
      key={nodeId}
      node={node}
      transformer={transformer}
      components={components}
      dataModel={dataModel}
      onAction={onAction}
      onDataChange={onDataChange}
      catalog={catalog}
      commandVersion={commandVersion}
    />
  );
}

interface NodeRendererProps {
  node: ReactComponentTree;
  transformer: ComponentTransformer;
  components: Record<string, React.ComponentType<any>>;
  dataModel: Record<string, any>;
  onAction?: (name: string, context: Record<string, any>, actionConfig?: any) => void;
  /** 组件通过 onChange 写回 dataModel 时的回调，path 为绑定路径 */
  onDataChange?: (path: string, value: any) => void;
  /** catalog 用于验证组件 */
  catalog?: Catalog;
  /** 命令版本 */
  commandVersion?: 'v0.8' | 'v0.9';
}

const NodeRenderer: React.FC<NodeRendererProps> = ({
  node,
  transformer,
  components,
  dataModel,
  onAction,
  onDataChange,
  catalog,
  commandVersion = 'v0.8',
}) => {
  const { type, props, children } = node;

  // 验证组件是否符合 catalog 定义
  const validation = validateComponentAgainstCatalog(catalog, type, props);
  if (!validation.valid || validation.errors.length > 0) {
    // 在开发环境下输出警告
    if (process.env.NODE_ENV === 'development') {
      validation.errors.forEach((error) => {
        console.warn(error);
      });
    }
  }

  // 从注册的组件映射中查找对应组件
  const Component = components[type];

  if (!Component) {
    // 检查是否在 catalog 中定义
    if (catalog?.components && !catalog.components[type]) {
      if (process.env.NODE_ENV === 'development') {
        console.error(
          `Component "${type}" is not registered and not defined in catalog. It will not be rendered.`,
        );
      }
      return null;
    }
    // 如果在 catalog 中定义但没有注册组件，也提示警告
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        `Component "${type}" is defined in catalog but not registered. Please provide a component implementation.`,
      );
    }
    return null;
  }

  // 根据版本使用不同的 resolveProps
  const resolvedProps =
    commandVersion === 'v0.9'
      ? resolvePropsV09(props, dataModel)
      : resolvePropsV08(props, dataModel);

  // 将 onAction 注入给所有自定义组件，由组件自行决定何时、如何触发
  if (typeof Component !== 'string') {
    // 包装 onAction，使其能够传递 action 配置
    resolvedProps.onAction = (name: string, context: Record<string, any>) => {
      // 从 resolvedProps 中获取 action 配置（已解析路径绑定）
      const actionConfig = resolvedProps.action;
      onAction?.(name, context, actionConfig);
    };

    // 注入 onDataChange，用于组件直接更新 dataModel
    resolvedProps.onDataChange = onDataChange;
  }

  const childNodes = children?.map((childId) =>
    renderNode(
      childId,
      transformer,
      components,
      dataModel,
      onAction,
      onDataChange,
      catalog,
      commandVersion,
    ),
  );

  return <Component {...resolvedProps}>{childNodes}</Component>;
};

const Card: React.FC<CardProps> = ({ id }) => {
  const {
    commandQueue,
    components = {},
    onAction,
    catalogMap,
    surfaceCatalogMap,
  } = React.useContext(BoxContext);

  // 每个 Card 实例持有独立的 transformer，维护各自的组件缓存
  const transformerRef = useRef<ComponentTransformer | null>(null);
  if (transformerRef.current === null) {
    transformerRef.current = createComponentTransformer();
  }

  // 获取当前 surface 对应的 catalog
  const catalogId = surfaceCatalogMap ? surfaceCatalogMap.get(id) : undefined;
  const catalog = catalogId && catalogMap ? catalogMap.get(catalogId) : undefined;

  // 用 rootNode 驱动重新渲染
  const [rootNode, setRootNode] = useState<ReactComponentTree | null>(null);

  // 数据模型，存储 updateDataModel 写入的值
  const [dataModel, setDataModel] = useState<Record<string, any>>({});

  // 追踪当前 surface 的命令版本（per-surface，避免全局共享污染）
  const [commandVersion, setCommandVersion] = useState<'v0.8' | 'v0.9'>('v0.8');

  // 用于追踪是否收到 beginRendering 命令（v0.8），使用 ref 避免触发 useEffect 重新执行
  const pendingRenderRef = useRef<{ surfaceId: string; root: string } | null>(null);
  // 存储转换后的组件树，等待 beginRendering 触发渲染
  const pendingNodeTreeRef = useRef<ReactComponentTree | null>(null);
  // 追踪是否已经渲染过（使用 ref 避免依赖循环）
  const hasRenderedRef = useRef(false);

  /**
   * 监听命令队列变化，消费所有与本 Card（surfaceId === id）相关的命令。
   * 使用 for...of 遍历整个队列，确保同一渲染周期内的多条命令都被处理。
   */
  useEffect(() => {
    if (commandQueue.length === 0) return;

    // 过滤出属于本 surface 的命令
    const myCommands = commandQueue.filter((cmd) => {
      if ('createSurface' in cmd) return cmd.createSurface.surfaceId === id;
      if ('updateComponents' in cmd) return cmd.updateComponents.surfaceId === id;
      if ('updateDataModel' in cmd) return cmd.updateDataModel.surfaceId === id;
      if ('deleteSurface' in cmd) return cmd.deleteSurface.surfaceId === id;
      if ('surfaceUpdate' in cmd) return cmd.surfaceUpdate.surfaceId === id;
      if ('dataModelUpdate' in cmd) return cmd.dataModelUpdate.surfaceId === id;
      if ('beginRendering' in cmd) return cmd.beginRendering.surfaceId === id;
      return false;
    });

    if (myCommands.length === 0) return;

    // 批量处理本 surface 的所有命令，按顺序执行
    let nextDataModel = dataModel;
    let nextRootNode = rootNode;
    let nextCommandVersion = commandVersion;
    let hasDataModelChange = false;
    let hasRootNodeChange = false;

    for (const cmd of myCommands) {
      // ===== v0.9 命令处理 =====
      if ('version' in cmd && cmd.version === 'v0.9') {
        nextCommandVersion = 'v0.9';

        if ('createSurface' in cmd) {
          // createSurface 仅用于初始化，catalog 加载由 Box 处理
          // 如果是重新创建（之前已删除），重置状态
          if (!hasRenderedRef.current) {
            nextRootNode = null;
            nextDataModel = {};
            hasRootNodeChange = true;
            hasDataModelChange = true;
          }
        }

        if ('updateComponents' in cmd) {
          const nodeTree = transformerRef.current!.transform(
            cmd.updateComponents.components,
            'v0.9',
          );
          if (nodeTree) {
            nextRootNode = nodeTree;
            hasRenderedRef.current = true;
            hasRootNodeChange = true;
          }
        }

        if ('updateDataModel' in cmd) {
          const { path, value } = cmd.updateDataModel;
          nextDataModel = applyDataModelUpdateV09(nextDataModel, path, value);
          hasDataModelChange = true;
        }

        if ('deleteSurface' in cmd) {
          nextRootNode = null;
          nextDataModel = {};
          hasRenderedRef.current = false;
          hasRootNodeChange = true;
          hasDataModelChange = true;
          transformerRef.current!.reset();
          pendingRenderRef.current = null;
          pendingNodeTreeRef.current = null;
        }

        continue;
      }

      // ===== v0.8 命令处理 =====
      nextCommandVersion = 'v0.8';

      // surfaceUpdate: 定义组件结构
      if ('surfaceUpdate' in cmd) {
        const nodeTree = transformerRef.current!.transform(cmd.surfaceUpdate.components, 'v0.8');
        pendingNodeTreeRef.current = nodeTree;

        // 如果已经渲染过，直接更新
        if (hasRenderedRef.current) {
          const rootNodeFromCache = transformerRef.current!.getById('root');
          if (rootNodeFromCache) {
            nextRootNode = rootNodeFromCache;
            hasRootNodeChange = true;
          }
        }
      }

      // dataModelUpdate: 更新数据模型（v0.8 格式）
      if ('dataModelUpdate' in cmd) {
        const { contents } = cmd.dataModelUpdate;
        nextDataModel = applyDataModelUpdateV08(nextDataModel, contents);
        hasDataModelChange = true;
      }

      // beginRendering: 开始渲染
      if ('beginRendering' in cmd) {
        const { root } = cmd.beginRendering;
        const nodeTree = transformerRef.current!.getById(root);
        if (nodeTree) {
          nextRootNode = nodeTree;
          pendingRenderRef.current = null;
          hasRenderedRef.current = true;
          hasRootNodeChange = true;
        } else {
          pendingRenderRef.current = { surfaceId: id, root };
        }
      }

      // deleteSurface: 删除 surface
      if ('deleteSurface' in cmd) {
        nextRootNode = null;
        nextDataModel = {};
        hasRenderedRef.current = false;
        hasRootNodeChange = true;
        hasDataModelChange = true;
        transformerRef.current!.reset();
        pendingRenderRef.current = null;
        pendingNodeTreeRef.current = null;
      }
    }

    // 批量提交状态变更，减少重渲染次数
    if (nextCommandVersion !== commandVersion) {
      setCommandVersion(nextCommandVersion);
    }
    if (hasRootNodeChange) {
      setRootNode(nextRootNode);
    }
    if (hasDataModelChange) {
      setDataModel(nextDataModel);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commandQueue, id]);

  if (!rootNode) {
    return null;
  }

  /**
   * action 触发时的处理函数
   * 根据版本使用不同的 extractDataUpdates 和 resolveActionContext
   */
  const handleAction = (name: string, context: Record<string, any>, actionConfig?: any) => {
    // 根据版本使用不同的 extractDataUpdates
    const dataUpdates =
      commandVersion === 'v0.9'
        ? extractDataUpdatesV09(actionConfig, context)
        : extractDataUpdatesV08(actionConfig, context);

    // 先更新 dataModel
    let newDataModel = dataModel;
    if (dataUpdates.length > 0) {
      newDataModel = dataUpdates.reduce((prev, { path, value }) => {
        return setValueByPath(prev, path, value);
      }, dataModel);

      setDataModel(newDataModel);
    }

    // 向上层上报事件
    onAction?.({
      name,
      surfaceId: id,
      context: { ...context },
    });
  };

  /** 组件 onChange 写回 dataModel（双向绑定） */
  const handleDataChange = (path: string, value: any) => {
    setDataModel((prev) => setValueByPath(prev, path, value));
  };

  return (
    <NodeRenderer
      node={rootNode}
      transformer={transformerRef.current!}
      components={components as Record<string, React.ComponentType<any>>}
      dataModel={dataModel}
      onAction={handleAction}
      onDataChange={handleDataChange}
      catalog={catalog}
      commandVersion={commandVersion}
    />
  );
};

export default Card;
