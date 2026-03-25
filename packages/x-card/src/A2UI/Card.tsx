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
      console.log(`NodeRenderer onAction:`, { name, context, actionConfig });
      onAction?.(name, context, actionConfig);
    };
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
    commands,
    components = {},
    onAction,
    catalogMap,
    surfaceCatalogMap,
    commandVersion = 'v0.8',
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

  // 用于追踪是否收到 beginRendering 命令（v0.8），使用 ref 避免触发 useEffect 重新执行
  const pendingRenderRef = useRef<{ surfaceId: string; root: string } | null>(null);
  // 存储转换后的组件树，等待 beginRendering 触发渲染
  const pendingNodeTreeRef = useRef<ReactComponentTree | null>(null);
  // 追踪是否已经渲染过（使用 ref 避免依赖循环）
  const hasRenderedRef = useRef(false);

  useEffect(() => {
    if (!commands) return;

    // ===== v0.9 命令处理 =====
    if ('version' in commands && commands.version === 'v0.9') {
      if ('updateComponents' in commands && commands.updateComponents.surfaceId === id) {
        const nodeTree = transformerRef.current!.transform(
          commands.updateComponents.components,
          'v0.9',
        );
        // 只有当 componentMap 中存在 root 节点时才更新渲染，避免覆盖已有内容
        if (nodeTree) {
          setRootNode(nodeTree);
          hasRenderedRef.current = true;
        }
      }

      if ('updateDataModel' in commands && commands.updateDataModel.surfaceId === id) {
        const { path, value } = commands.updateDataModel;
        setDataModel((prev) => applyDataModelUpdateV09(prev, path, value));
      }

      if ('deleteSurface' in commands && commands.deleteSurface.surfaceId === id) {
        setRootNode(null);
        setDataModel({});
        hasRenderedRef.current = false;
        transformerRef.current!.reset();
      }
      return;
    }

    // ===== v0.8 命令处理 =====
    // surfaceUpdate: 定义组件结构
    if ('surfaceUpdate' in commands && commands.surfaceUpdate.surfaceId === id) {
      const nodeTree = transformerRef.current!.transform(commands.surfaceUpdate.components, 'v0.8');
      // 存储转换后的组件树
      pendingNodeTreeRef.current = nodeTree;

      // 如果已经渲染过，直接更新
      if (hasRenderedRef.current) {
        const rootNodeFromCache = transformerRef.current!.getById('root');
        if (rootNodeFromCache) {
          setRootNode(rootNodeFromCache);
        }
      }
    }

    // dataModelUpdate: 更新数据模型（v0.8 格式）
    if ('dataModelUpdate' in commands && commands.dataModelUpdate.surfaceId === id) {
      const { contents } = commands.dataModelUpdate;
      setDataModel((prev) => applyDataModelUpdateV08(prev, contents));
    }

    // beginRendering: 开始渲染
    if ('beginRendering' in commands && commands.beginRendering.surfaceId === id) {
      const { root } = commands.beginRendering;
      // 查找 root 组件并开始渲染
      const nodeTree = transformerRef.current!.getById(root);
      if (nodeTree) {
        setRootNode(nodeTree);
        pendingRenderRef.current = null;
        hasRenderedRef.current = true;
      } else {
        // 如果 root 还未定义，记录等待状态（使用 ref 避免触发 useEffect 重新执行）
        pendingRenderRef.current = { surfaceId: id, root };
      }
    }

    // deleteSurface: 删除 surface
    if ('deleteSurface' in commands && commands.deleteSurface.surfaceId === id) {
      setRootNode(null);
      setDataModel({});
      pendingRenderRef.current = null;
      pendingNodeTreeRef.current = null;
      hasRenderedRef.current = false;
      transformerRef.current!.reset();
    }
  }, [commands, id]);

  if (!rootNode) {
    return null;
  }

  /**
   * action 触发时的处理函数
   * 根据版本使用不同的 extractDataUpdates 和 resolveActionContext
   */
  const handleAction = (name: string, context: Record<string, any>, actionConfig?: any) => {
    console.log(`Card ${id} handleAction:`, {
      name,
      context,
      actionConfig,
      commandVersion,
      currentDataModel: dataModel,
    });

    // 根据版本使用不同的 extractDataUpdates
    const dataUpdates =
      commandVersion === 'v0.9'
        ? extractDataUpdatesV09(actionConfig, context)
        : extractDataUpdatesV08(actionConfig, context);

    console.log(`Card ${id} dataUpdates:`, dataUpdates);

    // 先更新 dataModel
    let newDataModel = dataModel;
    if (dataUpdates.length > 0) {
      newDataModel = dataUpdates.reduce((prev, { path, value }) => {
        return setValueByPath(prev, path, value);
      }, dataModel);

      console.log(`Card ${id} newDataModel:`, newDataModel);
      setDataModel(newDataModel);
    }

    // 合并组件传递的 context 和解析的 context
    // 组件传递的 context 优先级更高（因为已经是实际值）
    const mergedContext = {
      ...context,
    };

    // 向上层上报事件
    onAction?.({
      name,
      surfaceId: id,
      context: mergedContext,
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
