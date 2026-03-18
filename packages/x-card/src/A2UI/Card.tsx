import React, { useEffect, useRef, useState } from 'react';
import BoxContext from './Context';
import { createComponentTransformer } from './format/components';
import type { ComponentTransformer, ReactComponentTree } from './format/components';

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

/** 将 props 中的路径值替换为 dataModel 中的真实值 */
function resolveProps(
  props: Record<string, any>,
  dataModel: Record<string, any>,
): Record<string, any> {
  const resolved: Record<string, any> = {};
  for (const [key, val] of Object.entries(props)) {
    resolved[key] = isPathValue(val) ? getValueByPath(dataModel, val) : val;
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

/** 递归渲染单个节点，子节点通过 getById 查找 */
function renderNode(
  nodeId: string,
  transformer: ComponentTransformer,
  components: Record<string, React.ComponentType<any>>,
  dataModel: Record<string, any>,
  onAction?: (name: string, context: Record<string, any>) => void,
  onDataChange?: (path: string, value: any) => void,
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
    />
  );
}

interface NodeRendererProps {
  node: ReactComponentTree;
  transformer: ComponentTransformer;
  components: Record<string, React.ComponentType<any>>;
  dataModel: Record<string, any>;
  onAction?: (name: string, context: Record<string, any>) => void;
  /** 组件通过 onChange 写回 dataModel 时的回调，path 为绑定路径 */
  onDataChange?: (path: string, value: any) => void;
}

const NodeRenderer: React.FC<NodeRendererProps> = ({
  node,
  transformer,
  components,
  dataModel,
  onAction,
  onDataChange,
}) => {
  const { type, props, children } = node;

  // 从注册的组件映射中查找对应组件，找不到则降级为同名 HTML 标签
  const Component = (components[type] ?? type) as React.ElementType;

  // 将 props 中的路径绑定替换为 dataModel 中的真实值
  const resolvedProps = resolveProps(props, dataModel);

  // 将 onAction 注入给所有自定义组件，由组件自行决定何时、如何触发
  // action 字段原样透传，组件自己解析 event.name 并调用 onAction
  if (typeof Component !== 'string') {
    resolvedProps.onAction = onAction;
  }

  const childNodes = children?.map((childId) =>
    renderNode(childId, transformer, components, dataModel, onAction, onDataChange),
  );
  console.log(resolvedProps, 'resolvedProps');

  return <Component {...resolvedProps}>{childNodes}</Component>;
};

const Card: React.FC<CardProps> = ({ id }) => {
  const { commands, components = {}, onAction } = React.useContext(BoxContext);

  // 每个 Card 实例持有独立的 transformer，维护各自的组件缓存
  const transformerRef = useRef<ComponentTransformer | null>(null);
  if (transformerRef.current === null) {
    transformerRef.current = createComponentTransformer();
  }

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

  if (!rootNode) return null;

  /** action 触发时，将 surfaceId 和 dataModel 快照一并上报给 Box.onAction */
  const handleAction = (name: string, context: Record<string, any>) => {
    onAction?.({ name, surfaceId: id, context });
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
    />
  );
};

export default Card;
