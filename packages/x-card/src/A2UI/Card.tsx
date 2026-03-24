import React, { useEffect, useRef, useState } from 'react';
import BoxContext from './Context';
import { createComponentTransformer } from './format/components';
import type { ComponentTransformer, ReactComponentTree } from './format/components';
import type { Catalog } from './catalog';

export interface CardProps {
  id: string;
}

/** 从嵌套对象中按路径取值，路径格式如 /booking/date */
function getValueByPath(obj: Record<string, any>, path: string): any {
  const parts = path.replace(/^\//, '').split('/');
  return parts.reduce((cur, key) => (cur != null ? cur[key] : undefined), obj as any);
}

/** 判断字符串是否为数据绑定路径（以 / 开头） */
function isPathValue(val: any): val is string {
  return typeof val === 'string' && val.startsWith('/');
}

/** 判断一个值是否为 { path: string } 形式的路径对象 */
function isPathObject(val: any): val is { path: string } {
  return val !== null && typeof val === 'object' && typeof val.path === 'string';
}

/**
 * 验证组件是否符合 catalog 定义
 * @param catalog catalog 定义
 * @param componentName 组件名称
 * @param componentProps 组件属性
 * @returns { valid: boolean, errors: string[] }
 */
function validateComponentAgainstCatalog(
  catalog: Catalog | undefined,
  componentName: string,
  componentProps: Record<string, any>,
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // 如果没有 catalog，默认通过
  if (!catalog || !catalog.components) {
    return { valid: true, errors: [] };
  }

  // 检查组件是否在 catalog 中定义
  const componentDef = catalog.components[componentName];
  if (!componentDef) {
    errors.push(`Component "${componentName}" is not defined in catalog`);
    return { valid: false, errors };
  }

  // 检查必填字段
  const requiredFields = componentDef.required || [];
  for (const field of requiredFields) {
    if (!(field in componentProps)) {
      errors.push(`Missing required field "${field}" for component "${componentName}"`);
    }
  }

  // 检查属性是否在 schema 中定义（警告级别，不阻止渲染）
  if (componentDef.properties) {
    const definedProps = Object.keys(componentDef.properties);
    const actualProps = Object.keys(componentProps).filter(
      (key) => !['id', 'children', 'component'].includes(key),
    );

    for (const prop of actualProps) {
      if (!definedProps.includes(prop)) {
        errors.push(
          `Warning: Property "${prop}" is not defined in catalog for component "${componentName}"`,
        );
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

/** 将 props 中的路径值替换为 dataModel 中的真实值 */
function resolveProps(
  props: Record<string, any>,
  dataModel: Record<string, any>,
): Record<string, any> {
  const resolved: Record<string, any> = {};
  for (const [key, val] of Object.entries(props)) {
    // 处理 { path: string } 形式的路径对象
    if (isPathObject(val)) {
      resolved[key] = getValueByPath(dataModel, val.path);
    }
    // 处理字符串路径（向后兼容）
    else if (isPathValue(val)) {
      resolved[key] = getValueByPath(dataModel, val);
    }
    // 字面值直接使用
    else {
      resolved[key] = val;
    }
  }
  return resolved;
}

/** 按路径将值写入嵌套对象（immutable），路径格式如 /booking/selectedCoffee */
function setValueByPath(obj: Record<string, any>, path: string, value: any): Record<string, any> {
  const parts = path.replace(/^\//, '').split('/');
  const next = { ...obj };
  let cur: Record<string, any> = next;
  for (let i = 0; i < parts.length - 1; i++) {
    cur[parts[i]] = cur[parts[i]] ? { ...cur[parts[i]] } : {};
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = value;
  return next;
}

/**
 * 解析 action.event.context 中的路径绑定，从 dataModel 中提取实际值
 * @param action action 配置对象
 * @param dataModel 当前数据模型
 * @returns 解析后的 context 对象
 */
function resolveActionContext(
  action: any,
  dataModel: Record<string, any>,
): Record<string, any> | undefined {
  const context = action?.event?.context;
  if (!context || typeof context !== 'object') {
    return undefined;
  }

  const resolved: Record<string, any> = {};
  for (const [key, val] of Object.entries(context)) {
    // 处理 { path: string } 形式的路径绑定
    if (isPathObject(val)) {
      resolved[key] = getValueByPath(dataModel, val.path);
    }
    // 字面值直接使用
    else {
      resolved[key] = val;
    }
  }
  return resolved;
}

/**
 * 根据 action.event.context 中的路径配置，将组件传递的值写入 dataModel
 * @param action action 配置对象
 * @param componentContext 组件传递的上下文数据
 * @returns 需要更新的数据路径和值的数组 [{ path: '/booking/res/time', value: '...' }]
 */
function extractDataUpdates(
  action: any,
  componentContext: Record<string, any>,
): Array<{ path: string; value: any }> {
  const context = action?.event?.context;
  if (!context || typeof context !== 'object') {
    return [];
  }

  const updates: Array<{ path: string; value: any }> = [];
  for (const [key, val] of Object.entries(context)) {
    // 只处理 { path: string } 形式的路径绑定
    if (isPathObject(val)) {
      // 从组件传递的 context 中查找对应 key 的值
      // 组件传递的值优先级最高，如果没有则使用 dataModel 中的当前值（用于读取）
      const componentValue = componentContext[key];
      if (componentValue !== undefined) {
        updates.push({ path: val.path, value: componentValue });
      }
    }
  }
  return updates;
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
}

const NodeRenderer: React.FC<NodeRendererProps> = ({
  node,
  transformer,
  components,
  dataModel,
  onAction,
  onDataChange,
  catalog,
}) => {
  const { type, props, children } = node;

  console.log(`NodeRenderer: rendering node type="${type}"`, { props, hasCatalog: !!catalog });

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
  // 如果 catalog 中没有定义该组件，且不在自定义组件列表中，则不渲染
  const Component = components[type];
  console.log(`NodeRenderer: Component for "${type}"`, { found: !!Component });

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

  // 将 props 中的路径绑定替换为 dataModel 中的真实值
  const resolvedProps = resolveProps(props, dataModel);

  // 将 onAction 注入给所有自定义组件，由组件自行决定何时、如何触发
  // 同时注入 action 配置，组件可以访问 action.event.name 和 action.event.context
  if (typeof Component !== 'string') {
    // 包装 onAction，使其能够传递 action 配置
    resolvedProps.onAction = (name: string, context: Record<string, any>) => {
      // 从 resolvedProps 中获取 action 配置（已解析路径绑定）
      const actionConfig = resolvedProps.action;
      onAction?.(name, context, actionConfig);
    };
  }

  const childNodes = children?.map((childId) =>
    renderNode(childId, transformer, components, dataModel, onAction, onDataChange, catalog),
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
  } = React.useContext(BoxContext);

  // 每个 Card 实例持有独立的 transformer，维护各自的组件缓存
  const transformerRef = useRef<ComponentTransformer | null>(null);
  if (transformerRef.current === null) {
    transformerRef.current = createComponentTransformer();
  }

  // 获取当前 surface 对应的 catalog
  const catalogId = surfaceCatalogMap ? surfaceCatalogMap.get(id) : undefined;
  const catalog = catalogId && catalogMap ? catalogMap.get(catalogId) : undefined;

  console.log(`Card ${id}:`, { catalogId, catalog: !!catalog, hasCommands: !!commands });

  // 用 rootNode 驱动重新渲染
  const [rootNode, setRootNode] = useState<ReactComponentTree | null>(null);

  // 数据模型，存储 updateDataModel 写入的值
  const [dataModel, setDataModel] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!commands) return;
    if ('updateComponents' in commands && commands.updateComponents.surfaceId === id) {
      const version = 'version' in commands ? commands.version : 'v0.8';
      const nodeTree = transformerRef.current!.transform(
        commands.updateComponents.components,
        version as 'v0.8' | 'v0.9',
      );
      setRootNode(nodeTree);
    }

    if ('updateDataModel' in commands && commands.updateDataModel.surfaceId === id) {
      const { path, value } = commands.updateDataModel;
      // 将路径写入 dataModel，支持 /booking/date 这样的嵌套路径
      const parts = path.replace(/^\//, '').split('/');
      setDataModel((prev) => {
        const next = { ...prev };
        let cur: Record<string, any> = next;
        for (let i = 0; i < parts.length - 1; i++) {
          cur[parts[i]] = cur[parts[i]] ? { ...cur[parts[i]] } : {};
          cur = cur[parts[i]];
        }
        cur[parts[parts.length - 1]] = value;
        return next;
      });
    }

    if ('deleteSurface' in commands && commands.deleteSurface.surfaceId === id) {
      // 清空组件树和数据模型，使 Card 不再渲染任何内容
      setRootNode(null);
      setDataModel({});
    }
  }, [commands, id]);

  console.log(`Card ${id}: rendering`, { hasRootNode: !!rootNode, rootNode });

  if (!rootNode) {
    console.log(`Card ${id}: no rootNode, returning null`);
    return null;
  }

  /**
   * action 触发时的处理函数
   * 1. 自动根据 action.event.context 中的路径配置更新 dataModel
   * 2. 向上层上报完整的事件信息
   * @param name 事件名称
   * @param context 组件传递的上下文数据（由组件自行构造）
   * @param actionConfig action 配置，包含 event.name 和 event.context
   */
  const handleAction = (name: string, context: Record<string, any>, actionConfig?: any) => {
    // 1. 根据 action.event.context 的路径配置，自动更新 dataModel
    const dataUpdates = extractDataUpdates(actionConfig, context);
    if (dataUpdates.length > 0) {
      setDataModel((prev) => {
        let next = prev;
        for (const { path, value } of dataUpdates) {
          next = setValueByPath(next, path, value);
        }
        return next;
      });
    }

    // 2. 解析 action.event.context 中读取的值（从更新后的 dataModel）
    // 使用 setTimeout 确保 dataModel 更新后再解析
    setTimeout(() => {
      const resolvedContext = resolveActionContext(actionConfig, dataModel);
      const mergedContext = {
        ...resolvedContext,
        ...context, // 组件传递的 context 优先级更高
      };

      // 3. 向上层上报事件
      onAction?.({
        name,
        surfaceId: id,
        context: mergedContext,
      });
    }, 0);
  };

  /** 组件 onChange 写回 dataModel（双向绑定） */
  const handleDataChange = (path: string, value: any) => {
    setDataModel((prev) => setValueByPath(prev, path, value));
  };

  console.log(`Card ${id}: rendering`, { hasRootNode: !!rootNode, rootNode });

  if (!rootNode) {
    console.log(`Card ${id}: no rootNode, returning null`);
    return null;
  }

  return (
    <NodeRenderer
      node={rootNode}
      transformer={transformerRef.current!}
      components={components as Record<string, React.ComponentType<any>>}
      dataModel={dataModel}
      onAction={handleAction}
      onDataChange={handleDataChange}
      catalog={catalog}
    />
  );
};

export default Card;
