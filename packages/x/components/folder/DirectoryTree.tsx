import { FileOutlined, FolderOutlined } from '@ant-design/icons';
import type { TreeProps } from 'antd';
import { Dropdown, Tree } from 'antd';
import type { MenuProps } from 'antd/es/menu';
import type { DataNode } from 'antd/es/tree';
import clsx from 'clsx';
import React, { useCallback, useRef, useState } from 'react';
import { useXProviderContext } from '../x-provider';
import type { FolderProps } from '.';

// File tree node type
export interface FolderTreeData {
  title: React.ReactNode;
  path: string;
  content?: string;
  children?: FolderTreeData[];
  /** Right-click context menu items, set to `false` to disable for this node. Function form receives full path key */
  contextMenu?: MenuProps['items'] | false | ((key: string) => MenuProps['items']);
}

const { DirectoryTree: AntDirectoryTree } = Tree;

export interface DirectoryTreeProps {
  treeData: FolderTreeData[];
  directoryIcons?: false | Record<'directory' | string, React.ReactNode | (() => React.ReactNode)>;
  selectedKeys?: string[];
  expandedKeys?: string[];
  onSelect?: TreeProps['onSelect'];
  onExpand?: TreeProps['onExpand'];
  showLine?: boolean;
  defaultExpandAll?: boolean;
  className?: string;
  classNames?: FolderProps['classNames'];
  styles?: FolderProps['styles'];
  style?: React.CSSProperties;
  directoryTitle?: FolderProps['directoryTitle'];
  prefixCls?: string;
  /** Right-click context menu items, applies to all nodes. Can be overridden by `contextMenu` in `FolderTreeData` */
  contextMenu?: MenuProps['items'] | ((node: FolderTreeData, key: string) => MenuProps['items']);
  /** Callback when right-clicking a node */
  onRightClick?: TreeProps['onRightClick'];
}

const DirectoryTree: React.FC<DirectoryTreeProps> = ({
  treeData,
  selectedKeys,
  expandedKeys,
  onSelect,
  onExpand,
  showLine = false,
  defaultExpandAll = true,
  className,
  classNames,
  directoryIcons,
  styles,
  style,
  directoryTitle,
  prefixCls: customizePrefixCls,
  contextMenu,
  onRightClick,
}) => {
  // ============================ Right-click Menu ============================
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [contextMenuItems, setContextMenuItems] = useState<MenuProps['items']>(undefined);

  // Store all original node data indexed by key for quick lookup
  const nodeDataMapRef = useRef<Map<string, FolderTreeData>>(new Map());

  // Track right-click state to prevent onSelect from firing during right-click
  const isRightClickRef = useRef(false);

  // ============================ Tree Config ============================
  const isFolder = (node: FolderTreeData): boolean => {
    return !!node.children && node.children.length > 0;
  };

  const getIcon = useCallback(
    (node: FolderTreeData) => {
      // If directoryIcons is false or null, do not display icons
      if (directoryIcons === false || directoryIcons === null) {
        return null;
      }

      if (isFolder(node)) {
        const icon = directoryIcons?.directory;
        if (typeof icon === 'function') {
          return icon();
        }
        return icon || <FolderOutlined />;
      }

      // Return corresponding icon based on file extension
      const filePath = node.path.toLowerCase();
      const extension = filePath.split('.').pop();

      if (extension) {
        // Check if custom icon configuration exists
        const icon = directoryIcons?.[extension];
        if (icon) {
          return typeof icon === 'function' ? icon() : icon;
        }
      }

      return <FileOutlined />;
    },
    [directoryIcons],
  );

  const buildPathSegments = useCallback(
    (node: FolderTreeData, parentSegments: string[] = []): string[] => {
      if (node.path === '/' && parentSegments.length === 0) {
        return ['/'];
      }
      return [...parentSegments, node.path].filter((segment) => segment !== '');
    },
    [],
  );

  const convertToTreeData = useCallback(
    (nodes: FolderTreeData[], parentSegments: string[] = []): DataNode[] => {
      return nodes.map((node) => {
        const pathSegments = buildPathSegments(node, parentSegments);
        const fullPath = pathSegments.join('/').replace(/^\/+/, '');
        // Store original node data for context menu lookup
        nodeDataMapRef.current.set(fullPath, node);
        return {
          ...node,
          key: fullPath,
          path: fullPath,
          pathSegments,
          title: node.title,
          icon: getIcon(node),
          isLeaf: !isFolder(node),
          children: node.children ? convertToTreeData(node.children, pathSegments) : undefined,
        };
      });
    },
    [buildPathSegments, getIcon],
  );

  const treeDataConverted = convertToTreeData(treeData);
  const titleNode =
    directoryTitle === false || directoryTitle === null
      ? null
      : typeof directoryTitle === 'function'
        ? directoryTitle()
        : directoryTitle;
  // ============================ Prefix ============================
  const { getPrefixCls } = useXProviderContext();
  const prefixCls = getPrefixCls('folder', customizePrefixCls);

  // ============================ Right-click Handler ============================
  const handleRightClick: TreeProps['onRightClick'] = (info) => {
    const { node } = info;
    const nodeKey = node.key as string;
    const originalNode = nodeDataMapRef.current.get(nodeKey);

    // Mark as right-click to prevent onSelect from firing
    isRightClickRef.current = true;

    // Determine context menu items: node-level > global function > global items
    let items: MenuProps['items'];
    if (originalNode?.contextMenu === false) {
      // Node explicitly disables context menu
      items = undefined;
    } else if (originalNode?.contextMenu) {
      // Node has custom context menu
      items =
        typeof originalNode.contextMenu === 'function'
          ? originalNode.contextMenu(nodeKey)
          : originalNode.contextMenu;
    } else if (contextMenu) {
      // Use global contextMenu
      items =
        typeof contextMenu === 'function'
          ? contextMenu(originalNode || ({} as FolderTreeData), nodeKey)
          : contextMenu;
    }

    if (items && items.length > 0) {
      setContextMenuItems(items);
      setContextMenuOpen(true);
    } else {
      // No menu to show, reset right-click flag immediately
      isRightClickRef.current = false;
    }

    onRightClick?.(info);
  };

  // Intercept onSelect to skip selection triggered by right-click
  const handleSelect: TreeProps['onSelect'] = (keys, info) => {
    if (isRightClickRef.current) {
      isRightClickRef.current = false;
      return;
    }
    onSelect?.(keys, info);
  };

  // Reset right-click flag when context menu closes
  const handleContextMenuOpenChange = (open: boolean) => {
    if (open && !isRightClickRef.current) {
      return;
    }
    setContextMenuOpen(open);
    if (!open) {
      isRightClickRef.current = false;
    }
  };

  return (
    <>
      {titleNode ? (
        <div
          style={{ ...styles?.directoryTitle, ...style }}
          className={clsx(
            `${prefixCls}-directory-tree-title`,
            className,
            classNames?.directoryTitle,
          )}
        >
          {titleNode}
        </div>
      ) : null}
      <Dropdown
        menu={{ items: contextMenuItems || [] }}
        open={contextMenuOpen}
        onOpenChange={handleContextMenuOpenChange}
        trigger={['contextMenu']}
      >
        <div style={{ height: '100%' }}>
          <AntDirectoryTree
            treeData={treeDataConverted}
            selectedKeys={selectedKeys}
            expandedKeys={expandedKeys}
            onSelect={handleSelect}
            onExpand={onExpand}
            onRightClick={handleRightClick}
            multiple={false}
            blockNode
            classNames={{
              itemTitle: `${prefixCls}-directory-tree-item-title`,
            }}
            showLine={showLine}
            defaultExpandAll={defaultExpandAll}
            className={clsx(`${prefixCls}-directory-tree-content`)}
          />
        </div>
      </Dropdown>
    </>
  );
};

export default DirectoryTree;
