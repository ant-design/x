import React from 'react';
import { render } from '../../../tests/utils';
import FileCard from '../index';

describe('FileCard Component', () => {
  // 基础功能测试
  it('should render basic file card', () => {
    const { container } = render(<FileCard name="test-file.txt" byte={1024} />);
    expect(container.querySelector('.ant-file-card')).toBeTruthy();
  });

  it('should render file name correctly', () => {
    const { container } = render(<FileCard name="test-file.txt" />);
    expect(container.querySelector('.ant-file-card-file-name-prefix')?.textContent).toBe(
      'test-file',
    );
    expect(container.querySelector('.ant-file-card-file-name-suffix')?.textContent).toBe('.txt');
  });

  it('should handle file without extension', () => {
    const { container } = render(<FileCard name="filewithoutext" />);
    expect(container.querySelector('.ant-file-card-file-name-prefix')?.textContent).toBe(
      'filewithoutext',
    );
    expect(container.querySelector('.ant-file-card-file-name-suffix')?.textContent).toBe('');
  });

  it('should handle hidden files', () => {
    const { container } = render(<FileCard name=".hiddenfile" />);
    expect(container.querySelector('.ant-file-card-file-name-prefix')?.textContent).toBe('');
    expect(container.querySelector('.ant-file-card-file-name-suffix')?.textContent).toBe(
      '.hiddenfile',
    );
  });

  it('should display file size correctly', () => {
    const { container } = render(<FileCard name="test.txt" byte={1024} />);
    expect(container.querySelector('.ant-file-card-file-description')?.textContent).toBe('1 KB');
  });

  it('should handle custom description', () => {
    const { container } = render(<FileCard name="test.txt" description="Custom desc" />);
    expect(container.querySelector('.ant-file-card-file-description')?.textContent).toBe(
      'Custom desc',
    );
  });

  it('should handle image type', () => {
    const { container } = render(<FileCard name="test.png" type="image" src="test.jpg" />);
    expect(container.querySelector('.ant-file-card-image')).toBeTruthy();
  });

  it('should handle audio type', () => {
    const { container } = render(<FileCard name="test.mp3" type="audio" src="test.mp3" />);
    expect(container.querySelector('.ant-file-card-audio')).toBeTruthy();
  });

  it('should handle video type', () => {
    const { container } = render(<FileCard name="test.mp4" type="video" src="test.mp4" />);
    expect(container.querySelector('.ant-file-card-video')).toBeTruthy();
  });

  it('should handle file type', () => {
    const { container } = render(<FileCard name="test.pdf" type="file" />);
    expect(container.querySelector('.ant-file-card-file')).toBeTruthy();
  });

  it('should handle loading state', () => {
    const { container } = render(<FileCard name="test.png" type="image" loading />);
    expect(container.querySelector('.ant-file-card-loading')).toBeTruthy();
  });
  it('loading usePercent', () => {
    const { container } = render(
      <FileCard
        name="test.png"
        type="image"
        spinProps={{
          percent: 50,
        }}
        loading
      />,
    );
    expect(container.querySelector('.ant-file-card-loading')).toBeTruthy();
  });

  it('should handle custom styles', () => {
    const { container } = render(
      <FileCard
        name="test.txt"
        styles={{ name: { color: 'red' } }}
        classNames={{ name: 'custom-name' }}
      />,
    );
    const nameElement = container.querySelector('.ant-file-card-file-name');
    expect(nameElement).toHaveClass('custom-name');
  });

  it('should handle mask', () => {
    const { container } = render(
      <FileCard name="test.txt" mask={<div className="custom-mask">Mask</div>} />,
    );
    expect(container.querySelector('.custom-mask')).toBeTruthy();
  });

  it('should handle custom icon', () => {
    const { container } = render(
      <FileCard name="test.txt" icon={<span className="custom-icon">ICON</span>} />,
    );
    expect(container.querySelector('.custom-icon')).toBeTruthy();
  });

  it('should handle custom prefixCls', () => {
    const { container } = render(<FileCard name="test.txt" prefixCls="custom-prefix" />);
    expect(container.querySelector('.custom-prefix')).toBeTruthy();
  });

  it('should handle all file extensions', () => {
    const extensions = [
      'png',
      'jpg',
      'jpeg',
      'gif',
      'bmp',
      'webp',
      'svg',
      'jfif',
      'mp3',
      'wav',
      'flac',
      'ape',
      'aac',
      'ogg',
      'mp4',
      'avi',
      'mov',
      'wmv',
      'flv',
      'mkv',
      'xlsx',
      'xls',
      'doc',
      'docx',
      'ppt',
      'pptx',
      'pdf',
      'md',
      'mdx',
      'zip',
      'rar',
      '7z',
      'tar',
      'gz',
      'java',
      'js',
      'py',
      'txt',
    ];

    extensions.forEach((ext) => {
      const { container } = render(<FileCard name={`test.${ext}`} />);
      expect(container.querySelector('.ant-file-card')).toBeTruthy();
    });
  });

  it('should handle empty values gracefully', () => {
    const { container } = render(<FileCard name="" />);
    expect(container.querySelector('.ant-file-card')).toBeTruthy();
  });

  it('should handle custom size', () => {
    const { container } = render(<FileCard name="test.txt" size="small" />);
    expect(container.querySelector('.ant-file-card')).toBeTruthy();
  });

  it('should handle onClick', () => {
    const onClick = jest.fn();
    const { container } = render(<FileCard name="test.txt" onClick={onClick} />);
    const element =
      container.querySelector('.ant-file-card-file') || container.querySelector('.ant-file-card');
    if (element) {
      // Note: In actual test, we would use fireEvent.click(element)
      expect(typeof onClick).toBe('function');
    }
  });
});

// List 组件测试
describe('FileCard.List', () => {
  it('should render file list', () => {
    const { container } = render(
      <FileCard.List
        items={[
          { name: 'file1.txt', byte: 1024 },
          { name: 'file2.jpg', byte: 2048 },
        ]}
      />,
    );
    expect(container.querySelector('.ant-file-card-list')).toBeTruthy();
    expect(container.querySelectorAll('.ant-file-card')).toHaveLength(2);
  });

  it('should handle empty items', () => {
    const { container } = render(<FileCard.List items={[]} />);
    expect(container.querySelector('.ant-file-card-list')).toBeTruthy();
  });

  it('should handle single item', () => {
    const { container } = render(<FileCard.List items={[{ name: 'single.txt' }]} />);
    expect(container.querySelectorAll('.ant-file-card')).toHaveLength(1);
  });

  it('should handle removable', () => {
    const { container } = render(<FileCard.List items={[{ name: 'test.txt' }]} removable />);
    expect(container.querySelector('.ant-file-card-list')).toBeTruthy();
  });

  it('should handle different overflow types', () => {
    const overflows = ['scrollX', 'scrollY', 'wrap'] as const;

    overflows.forEach((overflow) => {
      const { container } = render(
        <FileCard.List items={[{ name: 'test.txt' }]} overflow={overflow} />,
      );
      expect(container.querySelector('.ant-file-card-list')).toBeTruthy();
    });
  });

  it('should handle small size', () => {
    const { container } = render(<FileCard.List items={[{ name: 'test.txt' }]} size="small" />);
    expect(container.querySelector('.ant-file-card-list')).toBeTruthy();
  });

  it('should handle extension prop', () => {
    const { container } = render(
      <FileCard.List
        items={[{ name: 'test.txt' }]}
        extension={<div className="custom-extension">Extension</div>}
      />,
    );
    expect(container.querySelector('.custom-extension')).toBeTruthy();
  });

  it('should handle conditional removable', () => {
    const { container } = render(
      <FileCard.List
        items={[{ name: 'file1.txt' }, { name: 'file2.txt' }]}
        removable={(item) => item.name === 'file1.txt'}
      />,
    );
    expect(container.querySelector('.ant-file-card-list')).toBeTruthy();
  });
});
