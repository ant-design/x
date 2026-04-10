import { FileOutlined, FolderOutlined } from '@ant-design/icons';
import type { TreeProps } from 'antd';
import { Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import clsx from 'clsx';
import React, { useCallback } from 'react';
import { useXProviderContext } from '../x-provider';
import type { FolderProps } from '.';
// File tree node type
export interface FolderTreeData {
  title: React.ReactNode;
  path: string;
  content?: string;
  children?: FolderTreeData[];
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
}) => {
  // ============================ Tree Config ============================
  const isFolder = (node: FolderTreeData): boolean => {
    return !!node.children && node.children.length > 0;
  };

  const getIcon = useCallback(
    (node: FolderTreeData) => {
      // 如果 directoryIcons 为 false,则不显示图标
      if (directoryIcons === false) {
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
    directoryTitle === false
      ? null
      : typeof directoryTitle === 'function'
        ? directoryTitle()
        : directoryTitle;
  // ============================ Prefix ============================
  const { getPrefixCls } = useXProviderContext();
  const prefixCls = getPrefixCls('folder', customizePrefixCls);
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
      <AntDirectoryTree
        treeData={treeDataConverted}
        selectedKeys={selectedKeys}
        expandedKeys={expandedKeys}
        onSelect={onSelect}
        onExpand={onExpand}
        multiple={false}
        blockNode
        classNames={{
          itemTitle: `${prefixCls}-directory-tree-item-title`,
        }}
        showLine={showLine}
        defaultExpandAll={defaultExpandAll}
        className={clsx(`${prefixCls}-directory-tree-content`)}
      />
    </>
  );
};

export default DirectoryTree;
