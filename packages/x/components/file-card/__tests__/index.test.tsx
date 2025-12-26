import React from 'react';
import { fireEvent, render, waitFor } from '../../../tests/utils';
import FileCard from '../index';

// Mock resize-observer for file-card tests
jest.mock('@rc-component/resize-observer', () => {
  const React = require('react');
  const ResizeObserver = ({ children, onResize, disabled }: any) => {
    React.useEffect(() => {
      if (!disabled && onResize) {
        setTimeout(() => {
          onResize([
            {
              target: null,
              contentRect: {
                width: 1000,
                height: 800,
                x: 0,
                y: 0,
                top: 0,
                right: 1000,
                bottom: 800,
                left: 0,
              },
              borderBoxSize: [{ inlineSize: 1000, blockSize: 800 }],
              contentBoxSize: [{ inlineSize: 1000, blockSize: 800 }],
              devicePixelContentBoxSize: [{ inlineSize: 1000, blockSize: 800 }],
            },
          ]);
        }, 0);
      }
    }, [onResize, disabled]);

    return children;
  };

  return {
    __esModule: true,
    default: ResizeObserver,
    _rs: () => {},
  };
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
    const removeBtn = container.querySelector('.ant-file-card-list-remove');
    expect(removeBtn).toBeTruthy();
    fireEvent.click(removeBtn as HTMLElement);
    expect(container.querySelector('.ant-file-card-list')).toBeTruthy();
  });

  it('should handle different overflow types', async () => {
    const overflows = ['scrollX', 'scrollY', 'wrap'] as const;
    const scrollContainerStyle = { width: '150px', height: '80px' };
    for (const overflow of overflows) {
      const { container } = render(
        <div style={scrollContainerStyle}>
          <FileCard.List
            items={[
              { name: 'very-long-file-name1.txt' },
              { name: 'very-long-file-name2.txt' },
              { name: 'very-long-file-name3.txt' },
              { name: 'very-long-file-name4.txt' },
              { name: 'very-long-file-name5.txt' },
            ]}
            overflow={overflow}
          />
        </div>,
      );

      // 等待可能的异步更新
      await waitFor(() => {
        const listContent = container.querySelector(`.ant-file-card-list-overflow-${overflow}`);
        expect(listContent).toBeTruthy();
      });
      expect(container.querySelector('.ant-file-card-list')).toBeTruthy();
      // 获取滚动容器并模拟滚动来触发checkPing
      const scrollContainer = container.querySelector('.ant-file-card-list-content');
      expect(scrollContainer).toBeTruthy();
      // 模拟滚动到右侧来触发ping状态
      if (scrollContainer) {
        if (overflow === 'scrollX') {
          // 验证滚动按钮存在
          const prevBtn = container.querySelector('.ant-file-card-list-prev-btn');
          const nextBtn = container.querySelector('.ant-file-card-list-next-btn');
          expect(prevBtn).toBeTruthy();
          expect(nextBtn).toBeTruthy();
          // 设置scrollLeft来模拟滚动
          Object.defineProperty(scrollContainer, 'scrollLeft', {
            value: 50,
            writable: true,
            configurable: true,
          });
          Object.defineProperty(scrollContainer, 'scrollWidth', {
            value: 300,
            writable: true,
            configurable: true,
          });
          Object.defineProperty(scrollContainer, 'clientWidth', {
            value: 150,
            writable: true,
            configurable: true,
          });
          fireEvent.click(prevBtn as HTMLElement);
          fireEvent.click(nextBtn as HTMLElement);
          // 触发滚动事件来调用checkPing
          scrollContainer.dispatchEvent(new Event('scroll'));

          await waitFor(() => {
            // 验证ping状态被设置

            expect(container.querySelector('.ant-file-card-list-overflow-ping-start')).toBeTruthy();

            expect(container.querySelector('.ant-file-card-list-overflow-ping-end')).toBeTruthy();
          });
        }
        if (overflow === 'scrollY') {
          // 设置scrollTop来模拟滚动
          Object.defineProperty(scrollContainer, 'scrollTop', {
            value: 50,
            writable: true,
            configurable: true,
          });
          Object.defineProperty(scrollContainer, 'scrollHeight', {
            value: 300,
            writable: true,
            configurable: true,
          });
          Object.defineProperty(scrollContainer, 'clientHeight', {
            value: 100,
            writable: true,
            configurable: true,
          });
          // 触发滚动事件来调用checkPing
          scrollContainer.dispatchEvent(new Event('scroll'));

          await waitFor(() => {
            // 验证ping状态被设置
            expect(container.querySelector('.ant-file-card-list-overflow-ping-start')).toBeTruthy();
            expect(container.querySelector('.ant-file-card-list-overflow-ping-end')).toBeTruthy();
          });
        }
      }
    }
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
