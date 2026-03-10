import { FolderOutlined } from '@ant-design/icons';
import type { FolderProps } from '@ant-design/x';
import { Folder } from '@ant-design/x';
import { Flex } from 'antd';
import React from 'react';
import SemanticPreview from '../../../.dumi/components/SemanticPreview';
import useLocale from '../../../.dumi/hooks/useLocale';

const locales = {
  cn: {
    root: '根节点',
    directoryTree: '目录树容器',
    directoryTitle: '目录树标题',
    filePreview: '文件预览容器',
    previewTitle: '预览标题',
    previewRender: '预览内容',
  },
  en: {
    root: 'Root',
    directoryTree: 'Directory tree container',
    directoryTitle: 'Directory tree title',
    filePreview: 'File preview container',
    previewTitle: 'Preview title',
    previewRender: 'Preview content',
  },
};

const treeData: FolderProps['treeData'] = [
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
            content: `import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'primary' | 'default' | 'dashed';
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  type = 'default' 
}) => {
  return (
    <button 
      className={\`btn btn-\${type}\`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;`,
          },
          {
            title: 'Input.tsx',
            path: 'Input.tsx',
            content: `import React from 'react';

interface InputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const Input: React.FC<InputProps> = ({ 
  placeholder, 
  value, 
  onChange 
}) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className="input"
    />
  );
};

export default Input;`,
          },
        ],
      },
      {
        title: 'utils',
        path: 'utils',
        children: [
          {
            title: 'helper.ts',
            path: 'helper.ts',
            content: `export const formatDate = (date: Date): string => {
  return date.toLocaleDateString();
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};`,
          },
        ],
      },
    ],
  },
  {
    title: 'package.json',
    path: 'package.json',
    content: `{
  "name": "my-app",
  "version": "1.0.0",
  "description": "A sample application",
  "main": "index.js",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test"
  },
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}`,
  },
];

const App: React.FC = () => {
  const [locale] = useLocale(locales);

  return (
    <SemanticPreview
      componentName="Folder"
      semantics={[
        { name: 'root', desc: locale.root },
        { name: 'directoryTree', desc: locale.directoryTree },
        { name: 'directoryTitle', desc: locale.directoryTitle },
        { name: 'filePreview', desc: locale.filePreview },
        { name: 'previewTitle', desc: locale.previewTitle },
        { name: 'previewRender', desc: locale.previewRender },
      ]}
    >
      <Folder
        treeData={treeData}
        directoryTreeWith={200}
        directoryTitle={
          <Flex
            style={{
              paddingInline: 16,
              whiteSpace: 'nowrap',
              width: '100%',
              paddingBlock: 8,
              borderBottom: '1px solid #f0f0f0',
            }}
            align="center"
          >
            <FolderOutlined style={{ marginRight: 8 }} />
            项目文件浏览器
          </Flex>
        }
        defaultSelectedFile={['src', 'components', 'Button.tsx']}
      />
    </SemanticPreview>
  );
};

export default App;
