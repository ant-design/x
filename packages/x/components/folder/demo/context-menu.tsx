import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  FileAddOutlined,
  FolderAddOutlined,
  InfoCircleOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import type { FolderProps, FolderRef, FolderTreeData } from '@ant-design/x';
import { Folder } from '@ant-design/x';
import { message, Space, Tag } from 'antd';
import React, { useCallback, useRef, useState } from 'react';

const initialTreeData: FolderProps['treeData'] = [
  {
    title: 'my-project',
    path: 'my-project',
    children: [
      {
        title: 'src',
        path: 'src',
        children: [
          {
            title: 'components',
            path: 'components',
            children: [
              {
                title: 'App.tsx',
                path: 'App.tsx',
                content:
                  'import React from "react";\n\nexport default function App() {\n  return <div>Hello World</div>;\n}',
              },
              {
                title: 'Button.tsx',
                path: 'Button.tsx',
                content: 'export const Button = () => <button>Click</button>;',
              },
            ],
          },
          {
            title: 'index.ts',
            path: 'index.ts',
            content: 'export { default as App } from "./components/App";',
          },
        ],
      },
      {
        title: 'public',
        path: 'public',
        children: [
          {
            title: 'index.html',
            path: 'index.html',
            content: '<!DOCTYPE html><html><body></body></html>',
          },
        ],
      },
      {
        title: 'package.json',
        path: 'package.json',
        content: '{\n  "name": "my-project",\n  "version": "1.0.0"\n}',
        // Node-level context menu override: show specific actions for package.json
        contextMenu: [
          {
            key: 'edit',
            label: 'Edit JSON',
            icon: <EditOutlined />,
          },
          {
            key: 'copy',
            label: 'Copy Path',
            icon: <CopyOutlined />,
          },
          { type: 'divider' },
          {
            key: 'info',
            label: 'Package Info',
            icon: <InfoCircleOutlined />,
          },
        ],
      },
      {
        title: 'README.md',
        path: 'README.md',
        content: '# My Project\n\nThis is a sample project.',
        // Node-level context menu override: show specific actions for README
        contextMenu: [
          {
            key: 'edit',
            label: 'Edit README',
            icon: <EditOutlined />,
          },
          {
            key: 'preview',
            label: 'Preview Markdown',
            icon: <InfoCircleOutlined />,
          },
        ],
      },
    ],
  },
];

export default () => {
  const folderRef = useRef<FolderRef>(null);
  const [data, setData] = useState<FolderTreeData[]>(initialTreeData);
  const [lastAction, setLastAction] = useState<string>('');

  // Counter for generating unique names
  const counterRef = useRef(1);
  const nextName = (prefix: string) => {
    const name = `${prefix}${counterRef.current}`;
    counterRef.current += 1;
    return name;
  };

  /**
   * Parse full path key (e.g. "my-project/src/App.tsx") into path segments
   * This is exactly the format used by FolderRef.getNode / updateNode / deleteNode / addNode
   */
  const parseKey = (key: string): string[] => key.split('/').filter(Boolean);

  // Global context menu: function form receives (node, key) — key is the full path string
  const contextMenu: FolderProps['contextMenu'] = (node, _key) => {
    const isFolder = !!node.children && node.children.length > 0;

    const folderMenuItems = [
      {
        key: 'newFile',
        label: 'New File',
        icon: <FileAddOutlined />,
      },
      {
        key: 'newFolder',
        label: 'New Folder',
        icon: <FolderAddOutlined />,
      },
      { type: 'divider' as const },
      {
        key: 'copyPath',
        label: 'Copy Path',
        icon: <CopyOutlined />,
      },
      {
        key: 'copyName',
        label: 'Copy Name',
        icon: <CopyOutlined />,
      },
      { type: 'divider' as const },
      {
        key: 'rename',
        label: 'Rename',
        icon: <EditOutlined />,
      },
      {
        key: 'refresh',
        label: 'Refresh',
        icon: <ReloadOutlined />,
      },
      { type: 'divider' as const },
      {
        key: 'delete',
        label: 'Delete',
        icon: <DeleteOutlined />,
        danger: true,
      },
    ];

    const fileMenuItems = [
      {
        key: 'open',
        label: 'Open File',
        icon: <EditOutlined />,
      },
      {
        key: 'copyPath',
        label: 'Copy Path',
        icon: <CopyOutlined />,
      },
      {
        key: 'copyName',
        label: 'Copy Name',
        icon: <CopyOutlined />,
      },
      { type: 'divider' as const },
      {
        key: 'rename',
        label: 'Rename',
        icon: <EditOutlined />,
      },
      { type: 'divider' as const },
      {
        key: 'delete',
        label: 'Delete',
        icon: <DeleteOutlined />,
        danger: true,
      },
    ];

    return isFolder ? folderMenuItems : fileMenuItems;
  };

  const handleRightClick: FolderProps['onRightClick'] = ({ node }) => {
    const nodeTitle = typeof node.title === 'string' ? node.title : node.key;
    setLastAction(`Right-clicked: ${nodeTitle}`);
  };

  const handleMenuAction = useCallback(
    (actionKey: string, fullPathKey: string) => {
      // key is the full path string like "my-project/src/components/App.tsx"
      const pathSegments = parseKey(fullPathKey);
      const ref = folderRef.current;

      switch (actionKey) {
        // ---- Rename: update the node's title & path via ref ----
        case 'rename': {
          const newName = nextName(`renamed_`);
          setData(
            (prev) => ref?.updateNode(pathSegments, { title: newName, path: newName }) ?? prev,
          );
          message.success(`Renamed to "${newName}"`);
          setLastAction(`Rename: ${fullPathKey} → ${newName}`);
          break;
        }

        // ---- Delete: remove the node via ref ----
        case 'delete': {
          setData((prev) => ref?.deleteNode(pathSegments) ?? prev);
          message.success(`Deleted "${fullPathKey}"`);
          setLastAction(`Delete: ${fullPathKey}`);
          break;
        }

        // ---- New File: add a child file under the folder via ref ----
        case 'newFile': {
          const fileName = nextName('new_file') + '.ts';
          setData(
            (prev) =>
              ref?.addNode(pathSegments, {
                title: fileName,
                path: fileName,
                content: `// ${fileName}`,
              }) ?? prev,
          );
          message.success(`Created file "${fileName}"`);
          setLastAction(`New File: ${fileName} under ${fullPathKey}`);
          break;
        }

        // ---- New Folder: add a child folder via ref ----
        case 'newFolder': {
          const folderName = nextName('new_folder');
          setData(
            (prev) =>
              ref?.addNode(pathSegments, {
                title: folderName,
                path: folderName,
                children: [],
              }) ?? prev,
          );
          message.success(`Created folder "${folderName}"`);
          setLastAction(`New Folder: ${folderName} under ${fullPathKey}`);
          break;
        }

        // ---- Read-only actions (no treeData mutation) ----
        case 'copyPath':
          navigator.clipboard?.writeText(fullPathKey);
          message.success(`Path copied: ${fullPathKey}`);
          setLastAction(`Copy Path: ${fullPathKey}`);
          break;

        case 'copyName': {
          const name = pathSegments[pathSegments.length - 1];
          navigator.clipboard?.writeText(name);
          message.success(`Name copied: ${name}`);
          setLastAction(`Copy Name: ${name}`);
          break;
        }

        case 'refresh':
          message.info('Refreshed');
          setLastAction(`Refresh: ${fullPathKey}`);
          break;

        case 'open':
        case 'edit':
        case 'info':
        case 'preview':
          message.info(`${actionKey}: ${fullPathKey}`);
          setLastAction(`${actionKey}: ${fullPathKey}`);
          break;

        default:
          break;
      }
    },
    [data],
  );

  // Wrap contextMenu to bind click handlers with the full path key
  const contextMenuWithHandler: FolderProps['contextMenu'] = useCallback(
    (node: FolderTreeData, key: string) => {
      const items = typeof contextMenu === 'function' ? contextMenu(node, key) : contextMenu;
      if (!items) return items;

      return items.map((item) => {
        if (item && 'key' in item) {
          return {
            ...item,
            // Capture `key` (the full path string) in the closure
            onClick: () => handleMenuAction(item.key as string, key),
          };
        }
        return item;
      });
    },
    [handleMenuAction],
  );

  return (
    <div style={{ padding: 24, height: 500 }}>
      <Space style={{ marginBottom: 12, display: 'flex', flexWrap: 'wrap' }}>
        <Tag color="blue">Right-click any file or folder to see context menu</Tag>
        {lastAction && <Tag color="green">{lastAction}</Tag>}
      </Space>
      <Folder
        ref={folderRef}
        treeData={data}
        defaultSelectedFile={['my-project', 'src', 'components', 'App.tsx']}
        contextMenu={contextMenuWithHandler}
        onRightClick={handleRightClick}
      />
    </div>
  );
};
