import React, { useEffect, useRef, useState } from 'react';
import BoxContext from './Context';
import { createComponentTransformer } from './format/components';
import type { ComponentTransformer, ReactComponentTree } from './format/components';
import type { Catalog } from './catalog';

// v0.8 specific logic
import { resolvePropsV08, extractDataUpdatesV08, applyDataModelUpdateV08 } from './Card.v0.8';
import type { ActionConfigV08 } from './Card.v0.8';

// v0.9 specific logic
import { resolvePropsV09, extractDataUpdatesV09, applyDataModelUpdateV09 } from './Card.v0.9';
import type { ActionConfigV09 } from './Card.v0.9';

// Shared logic
import { setValueByPath, validateComponentAgainstCatalog } from './utils';

export interface CardProps {
  id: string;
}

/** actionConfig 联合类型，兼容 v0.8 和 v0.9 格式 */
type ActionConfig = ActionConfigV08 | ActionConfigV09;

/** Recursively render a single node, child nodes are found via getById */
function renderNode(
  nodeId: string,
  transformer: ComponentTransformer,
  components: Record<string, React.ComponentType<any>>,
  dataModel: Record<string, any>,
  onAction?: (name: string, context: Record<string, any>, actionConfig?: ActionConfig) => void,
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
  onAction?: (name: string, context: Record<string, any>, actionConfig?: ActionConfig) => void;
  /** Callback when component writes back to dataModel via onChange, path is the binding path */
  onDataChange?: (path: string, value: any) => void;
  /** catalog for component validation */
  catalog?: Catalog;
  /** command version */
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

  // Validate if component conforms to catalog definition
  const validation = validateComponentAgainstCatalog(catalog, type, props);
  if (!validation.valid || validation.errors.length > 0) {
    // Output warnings in development environment
    if (process.env.NODE_ENV === 'development') {
      validation.errors.forEach((error) => {
        console.warn(error);
      });
    }
  }

  // Find corresponding component from registered component mapping
  const Component = components[type];

  if (!Component) {
    // Check if defined in catalog
    if (catalog?.components && !catalog.components[type]) {
      if (process.env.NODE_ENV === 'development') {
        console.error(
          `Component "${type}" is not registered and not defined in catalog. It will not be rendered.`,
        );
      }
      return null;
    }
    // If defined in catalog but not registered, show warning
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        `Component "${type}" is defined in catalog but not registered. Please provide a component implementation.`,
      );
    }
    return null;
  }

  // Use different resolveProps based on version
  const resolvedProps =
    commandVersion === 'v0.9'
      ? resolvePropsV09(props, dataModel)
      : resolvePropsV08(props, dataModel);

  // Inject onAction to all custom components, let component decide when and how to trigger
  if (typeof Component !== 'string') {
    // Wrap onAction to pass action configuration
    resolvedProps.onAction = (name: string, context: Record<string, any>) => {
      // Get action configuration from resolvedProps (path binding already resolved)
      const actionConfig = resolvedProps.action;
      onAction?.(name, context, actionConfig);
    };

    // Inject onDataChange for components to directly update dataModel
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

  // Each Card instance holds independent transformer, maintaining their own component cache
  const transformerRef = useRef<ComponentTransformer | null>(null);
  if (transformerRef.current === null) {
    transformerRef.current = createComponentTransformer();
  }

  // Get catalog corresponding to current surface
  const catalogId = surfaceCatalogMap ? surfaceCatalogMap.get(id) : undefined;
  const catalog = catalogId && catalogMap ? catalogMap.get(catalogId) : undefined;

  // Use rootNode to drive re-render
  const [rootNode, setRootNode] = useState<ReactComponentTree | null>(null);

  // Data model, storing values written by updateDataModel
  const [dataModel, setDataModel] = useState<Record<string, any>>({});

  // Track command version of current surface (per-surface, avoid global shared pollution)
  const [commandVersion, setCommandVersion] = useState<'v0.8' | 'v0.9'>('v0.8');

  // Used to track if beginRendering command is received (v0.8), use ref to avoid triggering useEffect re-execution
  const pendingRenderRef = useRef<{ surfaceId: string; root: string } | null>(null);
  // Store converted component tree, waiting for beginRendering to trigger rendering
  const pendingNodeTreeRef = useRef<ReactComponentTree | null>(null);
  // Track if already rendered (use ref to avoid dependency cycle)
  const hasRenderedRef = useRef(false);

  /**
   * Listen to command queue changes, consume all commands related to this Card (surfaceId === id).
   * Use for...of to iterate through the entire queue, ensuring all commands in the same render cycle are processed.
   */
  useEffect(() => {
    if (commandQueue.length === 0) return;

    // Filter out commands belonging to this surface
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

    // Batch process all commands of this surface, execute in order
    let nextDataModel = dataModel;
    let nextRootNode = rootNode;
    let nextCommandVersion = commandVersion;
    let hasDataModelChange = false;
    let hasRootNodeChange = false;

    for (const cmd of myCommands) {
      // ===== v0.9 command processing =====
      if ('version' in cmd && cmd.version === 'v0.9') {
        nextCommandVersion = 'v0.9';

        if ('createSurface' in cmd) {
          // createSurface is only for initialization, catalog loading is handled by Box
          // If recreating (previously deleted), reset state
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

      // ===== v0.8 command processing =====
      nextCommandVersion = 'v0.8';

      // surfaceUpdate: define component structure
      if ('surfaceUpdate' in cmd) {
        const nodeTree = transformerRef.current!.transform(cmd.surfaceUpdate.components, 'v0.8');
        pendingNodeTreeRef.current = nodeTree;

        // If already rendered, update directly
        if (hasRenderedRef.current) {
          const rootNodeFromCache = transformerRef.current!.getById('root');
          if (rootNodeFromCache) {
            nextRootNode = rootNodeFromCache;
            hasRootNodeChange = true;
          }
        }
      }

      // dataModelUpdate: update data model (v0.8 format)
      if ('dataModelUpdate' in cmd) {
        const { contents } = cmd.dataModelUpdate;
        nextDataModel = applyDataModelUpdateV08(nextDataModel, contents);
        hasDataModelChange = true;
      }

      // beginRendering: start rendering
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

      // deleteSurface: delete surface
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

    // Batch submit state changes, reduce re-render count
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
   * Handler when action is triggered
   * Use different extractDataUpdates and resolveActionContext based on version
   */
  const handleAction = (
    name: string,
    context: Record<string, any>,
    actionConfig?: ActionConfig,
  ) => {
    // Use different extractDataUpdates based on version
    const dataUpdates =
      commandVersion === 'v0.9'
        ? extractDataUpdatesV09(actionConfig, context)
        : extractDataUpdatesV08(actionConfig, context);

    // Update dataModel first
    let newDataModel = dataModel;
    if (dataUpdates.length > 0) {
      newDataModel = dataUpdates.reduce((prev, { path, value }) => {
        return setValueByPath(prev, path, value);
      }, dataModel);

      setDataModel(newDataModel);
    }

    // Report event to upper layer
    onAction?.({
      name,
      surfaceId: id,
      context: { ...context },
    });
  };

  /** Component onChange writes back to dataModel (two-way binding) */
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
