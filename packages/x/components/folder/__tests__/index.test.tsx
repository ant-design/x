import React from 'react';
import { fireEvent, render } from '../../../tests/utils';
import Folder, { type FolderRef } from '../index';

const mockTreeData = [
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
            content: 'export const Button = () => <button>Click</button>;',
          },
        ],
      },
    ],
  },
  {
    title: 'package.json',
    path: 'package.json',
    content: '{ "name": "test-app" }',
  },
];

const mockNoContentTreeData = [
  {
    title: '/',
    path: '/',
    children: [
      {
        title: 'components',
        path: 'components',
        children: [
          {
            title: 'Button.tsx',
            path: 'Button.tsx',
          },
        ],
      },
    ],
  },
];

describe('Folder Component', () => {
  it('renders basic folder structure', () => {
    const { container } = render(
      <Folder
        treeData={mockTreeData}
        directoryTitle="Project Files"
        previewTitle="Custom Preview"
        className="custom-class"
        defaultExpandAll={false}
        style={{ backgroundColor: 'red' }}
      />,
    );
    expect(container.querySelector('.ant-folder')).toBeTruthy();
    const element = container.querySelector('.ant-folder');
    expect(element).toHaveClass('custom-class');
    expect(element).toHaveStyle({ backgroundColor: 'red' });
  });

  it('renders empty state', () => {
    const { container } = render(<Folder treeData={[]} />);
    expect(container.querySelector('.ant-folder')).toBeTruthy();
  });

  it('handles selectable mode', () => {
    const { container } = render(<Folder treeData={mockTreeData} selectable />);
    expect(container.querySelector('.ant-folder')).toBeTruthy();
  });

  it('handles custom directory width', () => {
    const { container } = render(<Folder treeData={mockTreeData} directoryTreeWith={300} />);
    expect(container.querySelector('.ant-folder')).toBeTruthy();
  });

  it('handles custom empty state', () => {
    const { container } = render(
      <Folder treeData={mockTreeData} emptyRender={<div>Custom Empty</div>} />,
    );
    expect(container.querySelector('.ant-folder')).toBeTruthy();
  });

  it('handles custom icons', () => {
    const customIcons = {
      directory: <span>📁</span>,
      tsx: () => <span>⚛️</span>,
      json: <span>⚛️</span>,
    };

    const { container } = render(
      <Folder
        treeData={mockTreeData}
        emptyRender={() => <div>Custom Empty</div>}
        directoryIcons={customIcons}
      />,
    );
    expect(container.querySelector('.ant-folder')).toBeTruthy();
  });
  it('handles custom  directory icons', () => {
    const customIcons = {
      directory: () => <span>📁</span>,
    };

    const { container } = render(<Folder treeData={mockTreeData} directoryIcons={customIcons} />);
    expect(container.querySelector('.ant-folder')).toBeTruthy();
  });

  it('handles ref forwarding', () => {
    const ref = React.createRef<FolderRef>();
    render(<Folder ref={ref} treeData={mockTreeData} />);
    expect(ref.current).not.toBeNull();
  });

  it('handles selectedFile prop', () => {
    const { container } = render(
      <Folder treeData={mockTreeData} selectable selectedFile={['package.json']} />,
    );
    expect(container.querySelector('.ant-folder')).toBeTruthy();
  });
  it('handles not validate selectedFile prop', () => {
    const { container } = render(
      <Folder treeData={mockTreeData} selectable selectedFile={['a.json']} />,
    );
    expect(container.querySelector('.ant-folder')).toBeTruthy();
  });

  it('handles defaultSelectedFile prop', () => {
    const { container } = render(
      <Folder treeData={mockTreeData} defaultSelectedFile={['package.json']} />,
    );
    expect(container.querySelector('.ant-folder')).toBeTruthy();
  });

  it('handles expandedPaths prop', () => {
    const { container } = render(<Folder treeData={mockTreeData} expandedPaths={['src']} />);
    expect(container.querySelector('.ant-folder')).toBeTruthy();
  });

  it('handles defaultExpandedPaths prop', () => {
    const { container } = render(<Folder treeData={mockTreeData} defaultExpandedPaths={['src']} />);
    expect(container.querySelector('.ant-folder')).toBeTruthy();
  });

  it('handles defaultExpandAll prop', () => {
    const { container } = render(<Folder treeData={mockTreeData} defaultExpandAll={true} />);
    expect(container.querySelector('.ant-folder')).toBeTruthy();
  });

  it('handles callbacks', () => {
    const onSelectedFileChange = jest.fn();
    const onFileClick = jest.fn();
    const onFolderClick = jest.fn();
    const onExpandedPathsChange = jest.fn();

    const { container, getByText } = render(
      <Folder
        treeData={mockTreeData}
        selectable
        onSelectedFileChange={onSelectedFileChange}
        onFileClick={onFileClick}
        onFolderClick={onFolderClick}
        onExpandedPathsChange={onExpandedPathsChange}
      />,
    );
    expect(getByText('Button.tsx')).toBeTruthy();
    getByText('Button.tsx').click();
    expect(getByText('components')).toBeTruthy();
    getByText('components').click();
    expect(container.querySelector('.ant-folder')).toBeTruthy();
  });

  it('handles file content service', () => {
    const fileContentService = {
      loadFileContent: jest.fn().mockResolvedValue('// Mock content'),
    };

    const { container, getByText } = render(
      <Folder treeData={mockTreeData} fileContentService={fileContentService} />,
    );

    expect(container.querySelector('.ant-folder')).toBeTruthy();
    expect(getByText('Button.tsx')).toBeTruthy();
    getByText('Button.tsx').click();
  });
  it('handles file content finally', () => {
    const { container, getByText } = render(
      <Folder
        directoryTitle={() => 'Directory Title'}
        previewTitle={() => 'Preview Title'}
        treeData={mockNoContentTreeData}
      />,
    );

    expect(container.querySelector('.ant-folder')).toBeTruthy();
    expect(getByText('Button.tsx')).toBeTruthy();
    getByText('Button.tsx').click();
  });

  it('should display formatted error message when file content service fails', async () => {
    const fileContentService = {
      loadFileContent: jest.fn().mockRejectedValue(new Error('Network error')),
    };

    const { getByText } = render(
      <Folder treeData={mockNoContentTreeData} fileContentService={fileContentService} />,
    );

    fireEvent.click(getByText('Button.tsx'));
  });
  it('should display formatted error message when file content service fails', async () => {
    const fileContentService = {
      loadFileContent: jest.fn().mockRejectedValue(''),
    };

    const { getByText } = render(
      <Folder treeData={mockNoContentTreeData} fileContentService={fileContentService} />,
    );

    fireEvent.click(getByText('Button.tsx'));
  });
  it('should render file content using previewRender function', async () => {
    const { getByText, findByText } = render(
      <Folder
        treeData={mockTreeData}
        previewRender={({ content }) => <div>Custom: {content}</div>}
      />,
    );

    fireEvent.click(getByText('Button.tsx'));

    // 验证自定义预览内容是否正确渲染
    expect(
      await findByText('Custom: export const Button = () => <button>Click</button>;'),
    ).toBeTruthy();
  });

  it('should render static previewRender string', async () => {
    const { getByText, findByText } = render(
      <Folder treeData={mockTreeData} previewRender="Static Preview Content" />,
    );

    fireEvent.click(getByText('Button.tsx'));

    // 验证静态预览内容是否正确渲染
    expect(await findByText('Static Preview Content')).toBeTruthy();
  });

  it('should render default file content when previewRender is null', async () => {
    const { getByText } = render(
      <Folder treeData={mockTreeData} previewTitle="Custom Preview" previewRender={null} />,
    );

    fireEvent.click(getByText('Button.tsx'));
  });
});
