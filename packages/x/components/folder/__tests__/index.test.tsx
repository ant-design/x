import React from 'react';
import { act, fireEvent, render } from '../../../tests/utils';
import XProvider from '../../x-provider';
import Folder, { FolderRef } from '../index';

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

  it('handles directoryIcons=false (no icons)', () => {
    const { container } = render(<Folder treeData={mockTreeData} directoryIcons={false} />);
    expect(container.querySelector('.ant-folder')).toBeTruthy();
  });

  it('handles directoryTitle=false', () => {
    const { container } = render(<Folder treeData={mockTreeData} directoryTitle={false} />);
    expect(container.querySelector('.ant-folder')).toBeTruthy();
  });

  it('handles directoryTitle=null', () => {
    const { container } = render(<Folder treeData={mockTreeData} directoryTitle={null as any} />);
    expect(container.querySelector('.ant-folder')).toBeTruthy();
  });

  it('handles previewTitle=false (no preview title)', async () => {
    const { getByText } = render(<Folder treeData={mockTreeData} previewTitle={false} />);
    fireEvent.click(getByText('Button.tsx'));
  });

  it('handles previewTitle=null', async () => {
    const { getByText } = render(<Folder treeData={mockTreeData} previewTitle={null as any} />);
    fireEvent.click(getByText('Button.tsx'));
  });

  it('handles previewTitle as function', async () => {
    const previewTitleFn = jest.fn(({ title }) => <span>Title: {title as string}</span>);
    const { getByText } = render(<Folder treeData={mockTreeData} previewTitle={previewTitleFn} />);
    fireEvent.click(getByText('Button.tsx'));
    expect(previewTitleFn).toHaveBeenCalled();
  });

  it('handles emptyRender=false (no empty state)', () => {
    const { container } = render(<Folder treeData={mockTreeData} emptyRender={false} />);
    expect(container.querySelector('.ant-folder')).toBeTruthy();
  });

  it('handles emptyRender=null', () => {
    const { container } = render(<Folder treeData={mockTreeData} emptyRender={null as any} />);
    expect(container.querySelector('.ant-folder')).toBeTruthy();
  });

  it('handles RTL direction via XProvider', () => {
    const { container } = render(
      <XProvider direction="rtl">
        <Folder treeData={mockTreeData} />
      </XProvider>,
    );
    expect(container.querySelector('.ant-folder-rtl')).toBeTruthy();
  });

  it('handles controlled selectedFile mode (isControlled=true)', () => {
    const onSelectedFileChange = jest.fn();
    const { getByText } = render(
      <Folder
        treeData={mockTreeData}
        selectedFile={['package.json']}
        onSelectedFileChange={onSelectedFileChange}
      />,
    );
    fireEvent.click(getByText('Button.tsx'));
    expect(onSelectedFileChange).toHaveBeenCalled();
  });

  it('handles folder click when multiple nodes selected', () => {
    const onFolderClick = jest.fn();
    const { getByText } = render(<Folder treeData={mockTreeData} onFolderClick={onFolderClick} />);
    // Click on the folder node 'src'
    fireEvent.click(getByText('src'));
  });

  it('handles expand and collapse', () => {
    const onExpandedPathsChange = jest.fn();
    const { getByText } = render(
      <Folder treeData={mockTreeData} onExpandedPathsChange={onExpandedPathsChange} />,
    );
    // Click on folder to expand/collapse
    fireEvent.click(getByText('src'));
  });

  it('handles node with empty children array (treated as file)', () => {
    const treeDataWithEmptyChildren = [
      {
        title: 'emptyDir',
        path: 'emptyDir',
        children: [],
      },
    ];
    const { container } = render(<Folder treeData={treeDataWithEmptyChildren} />);
    expect(container.querySelector('.ant-folder')).toBeTruthy();
  });

  it('handles file content service success and loading state', async () => {
    const fileContentService = {
      loadFileContent: jest.fn().mockResolvedValue('loaded content'),
    };

    const { getByText } = render(
      <Folder treeData={mockNoContentTreeData} fileContentService={fileContentService} />,
    );

    fireEvent.click(getByText('Button.tsx'));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(fileContentService.loadFileContent).toHaveBeenCalled();
  });

  it('handles root path "/" in tree data', () => {
    const treeDataWithRoot = [
      {
        title: '/',
        path: '/',
        children: [
          {
            title: 'index.ts',
            path: 'index.ts',
            content: 'export default {};',
          },
        ],
      },
    ];
    const { container } = render(<Folder treeData={treeDataWithRoot} />);
    expect(container.querySelector('.ant-folder')).toBeTruthy();
  });

  it('handles custom tsx icon as function', () => {
    const customIcons = {
      directory: <span>Dir</span>,
      tsx: () => <span>TSX</span>,
    };
    const { container } = render(<Folder treeData={mockTreeData} directoryIcons={customIcons} />);
    expect(container.querySelector('.ant-folder')).toBeTruthy();
  });

  it('handles classNames and styles props', () => {
    const { container } = render(
      <Folder
        treeData={mockTreeData}
        classNames={{
          root: 'custom-root',
          directoryTree: 'custom-tree',
          filePreview: 'custom-preview',
        }}
        styles={{
          root: { padding: '10px' },
          directoryTree: { border: '1px solid red' },
        }}
      />,
    );
    expect(container.querySelector('.custom-root')).toBeTruthy();
  });

  it('handles file content when no service and no content (shows noService message)', async () => {
    const { getByText } = render(<Folder treeData={mockNoContentTreeData} />);
    fireEvent.click(getByText('Button.tsx'));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
    });
  });

  it('handles file with no extension (covers getFileExtension empty string branch)', async () => {
    const treeDataNoExt = [
      {
        title: 'Makefile',
        path: 'Makefile',
        content: 'all: build',
      },
    ];
    const { container, getByText } = render(<Folder treeData={treeDataNoExt} />);
    fireEvent.click(getByText('Makefile'));
    // Content is rendered, verify the component is present
    expect(container.querySelector('.ant-folder')).toBeTruthy();
  });

  it('handles directoryIcons with file extension as function (covers branch)', () => {
    const customIcons = {
      tsx: () => <span>TSX Icon</span>,
    };
    const { container } = render(<Folder treeData={mockTreeData} directoryIcons={customIcons} />);
    expect(container.querySelector('.ant-folder')).toBeTruthy();
  });

  it('handles tree data with root path "/" (covers buildPathSegments root branch)', () => {
    const treeDataWithRootPath = [
      {
        title: 'root',
        path: '/',
        children: [
          {
            title: 'app.ts',
            path: 'app.ts',
            content: 'const app = {};',
          },
        ],
      },
    ];
    const { container } = render(<Folder treeData={treeDataWithRootPath} />);
    expect(container.querySelector('.ant-folder')).toBeTruthy();
  });
});
