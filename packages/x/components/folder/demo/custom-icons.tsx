import {
  CodeOutlined,
  FileExcelOutlined,
  FileImageOutlined,
  FileMarkdownOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  FileWordOutlined,
  FileZipOutlined,
  FolderOutlined,
} from '@ant-design/icons';
import type { FolderProps } from '@ant-design/x';
import { Folder } from '@ant-design/x';
import React from 'react';

const treeData: FolderProps['treeData'] = [
  {
    title: 'my-project',
    path: 'my-project',
    children: [
      {
        title: 'docs',
        path: 'docs',
        children: [
          {
            title: 'README.md',
            path: 'README.md',
            content: '# Project Documentation',
          },
          {
            title: 'API.pdf',
            path: 'API.pdf',
            content: 'API Documentation PDF',
          },
        ],
      },
      {
        title: 'src',
        path: 'src',
        children: [
          {
            title: 'components',
            path: 'components',
            children: [
              {
                title: 'Button.tsx',
                path: 'Button.tsx',
                content: 'Button component code...',
              },
              {
                title: 'styles.css',
                path: 'styles.css',
                content: '/* CSS styles */',
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
                content: 'Utility functions...',
              },
            ],
          },
        ],
      },
      {
        title: 'assets',
        path: 'assets',
        children: [
          {
            title: 'logo.png',
            path: 'logo.png',
            content: 'Company logo image',
          },
          {
            title: 'banner.jpg',
            path: 'banner.jpg',
            content: 'Website banner image',
          },
        ],
      },
      {
        title: 'data',
        path: 'data',
        children: [
          {
            title: 'users.xlsx',
            path: 'users.xlsx',
            content: 'User data spreadsheet',
          },
          {
            title: 'report.docx',
            path: 'report.docx',
            content: 'Monthly report document',
          },
          {
            title: 'archive.zip',
            path: 'archive.zip',
            content: 'Project archive',
          },
        ],
      },
      {
        title: 'package.json',
        path: 'package.json',
        content: '{\n  "name": "my-project"\n}',
      },
    ],
  },
];

export default () => {
  return (
    <div style={{ padding: 24, height: 500 }}>
      <Folder
        treeData={treeData}
        defaultSelectedFile={['my-project', 'package.json']}
        directoryTitle={
          <div style={{ padding: 12, whiteSpace: 'nowrap', borderBottom: '1px solid #f0f0f0' }}>
            <strong>Custom Icon File Browser</strong>
            <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
              Display different icons based on file type
            </div>
          </div>
        }
        directoryIcons={{
          directory: <FolderOutlined style={{ color: '#faad14' }} />,
          md: <FileMarkdownOutlined style={{ color: '#722ed1' }} />,
          pdf: <FilePdfOutlined style={{ color: '#ff4d4f' }} />,
          tsx: <CodeOutlined style={{ color: '#13c2c2' }} />,
          css: <CodeOutlined style={{ color: '#13c2c2' }} />,
          ts: <CodeOutlined style={{ color: '#13c2c2' }} />,
          png: <FileImageOutlined style={{ color: '#1890ff' }} />,
          jpg: <FileImageOutlined style={{ color: '#1890ff' }} />,
          xlsx: <FileExcelOutlined style={{ color: '#52c41a' }} />,
          docx: <FileWordOutlined style={{ color: '#1890ff' }} />,
          zip: <FileZipOutlined style={{ color: '#faad14' }} />,
          json: <FileTextOutlined style={{ color: '#666' }} />,
        }}
      />
    </div>
  );
};
