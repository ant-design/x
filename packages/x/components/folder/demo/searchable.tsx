import type { FolderProps } from '@ant-design/x';
import { Folder } from '@ant-design/x';
import { Input, Space, Tag } from 'antd';
import React, { useMemo, useState } from 'react';

const treeData: FolderProps['treeData'] = [
  {
    title: 'project-root',
    path: 'project-root',
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
                title: 'Header.tsx',
                path: 'Header.tsx',
                content: 'Header component implementation...',
              },
              {
                title: 'Footer.tsx',
                path: 'Footer.tsx',
                content: 'Footer component implementation...',
              },
              {
                title: 'Sidebar.tsx',
                path: 'Sidebar.tsx',
                content: 'Sidebar component implementation...',
              },
            ],
          },
          {
            title: 'pages',
            path: 'pages',
            children: [
              {
                title: 'Home.tsx',
                path: 'Home.tsx',
                content: 'Home page component...',
              },
              {
                title: 'About.tsx',
                path: 'About.tsx',
                content: 'About page component...',
              },
              {
                title: 'Contact.tsx',
                path: 'Contact.tsx',
                content: 'Contact page component...',
              },
            ],
          },
          {
            title: 'utils',
            path: 'utils',
            children: [
              {
                title: 'helpers.ts',
                path: 'helpers.ts',
                content: 'Helper functions...',
              },
              {
                title: 'constants.ts',
                path: 'constants.ts',
                content: 'Application constants...',
              },
            ],
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
            content: '<!DOCTYPE html>...',
          },
          {
            title: 'favicon.ico',
            path: 'favicon.ico',
            content: 'Favicon file...',
          },
        ],
      },
      {
        title: 'package.json',
        path: 'package.json',
        content: '{\n  "name": "my-project"\n}',
      },
      {
        title: 'README.md',
        path: 'README.md',
        content: '# Project Documentation...',
      },
    ],
  },
];

// 搜索过滤函数
const filterTreeData = (
  data: FolderProps['treeData'],
  searchValue: string,
): FolderProps['treeData'] => {
  if (!searchValue) return data;

  return data.reduce((acc: FolderProps['treeData'], item) => {
    const titleMatch = item.path.toLowerCase().includes(searchValue.toLowerCase());

    let filteredChildren: FolderProps['treeData'] = [];
    if (item.children) {
      filteredChildren = filterTreeData(item.children, searchValue);
    }

    if (titleMatch || filteredChildren.length > 0) {
      acc.push({
        ...item,
        children: filteredChildren.length > 0 ? filteredChildren : item.children,
      });
    }

    return acc;
  }, []);
};

export default () => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedFile, setSelectedFile] = useState<string[]>([
    'project-root',
    'src',
    'components',
    'Header.tsx',
  ]);

  const filteredTreeData = useMemo(() => {
    return filterTreeData(treeData, searchValue);
  }, [searchValue]);

  return (
    <div style={{ padding: 24, height: 600 }}>
      <Space vertical style={{ width: '100%', marginBottom: 16 }}>
        <Input.Search
          placeholder="Search files or folders..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          allowClear
        />
        <Space>
          <Tag color="blue">Total Files: {countFiles(treeData)}</Tag>
          <Tag color="green">Matching Results: {countFiles(filteredTreeData)}</Tag>
        </Space>
      </Space>
      <Folder
        treeData={filteredTreeData}
        selectedFile={selectedFile}
        onSelectedFileChange={({ path }) => setSelectedFile(path)}
        directoryTitle={
          <div style={{ whiteSpace: 'nowrap', padding: 12, borderBottom: '1px solid #f0f0f0' }}>
            <strong>Project File Browser</strong>
            {searchValue && (
              <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                Search: "{searchValue}"
              </div>
            )}
          </div>
        }
      />
    </div>
  );
};

// 计算文件总数的辅助函数
function countFiles(data: FolderProps['treeData']): number {
  return data.reduce((count, item) => {
    if (!item.children) {
      return count + 1;
    }
    return count + countFiles(item.children);
  }, 0);
}
