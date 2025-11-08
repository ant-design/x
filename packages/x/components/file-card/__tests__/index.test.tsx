import React from 'react';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import { fireEvent, render, waitFakeTimer } from '../../../tests/utils';
import FileCard from '../index';

describe('FileCard Component', () => {
  mountTest(() => <FileCard name="test-file.txt" />);
  rtlTest(() => <FileCard name="test-file.txt" />);

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  // 核心功能测试
  it('should render basic file card', () => {
    const { container } = render(<FileCard name="test-file.txt" byte={1024} />);
    expect(container.querySelector('.ant-file-card')).toBeTruthy();
    expect(container.querySelector('.ant-file-card-file-name-prefix')?.textContent).toBe(
      'test-file',
    );
    expect(container.querySelector('.ant-file-card-file-name-suffix')?.textContent).toBe('.txt');
    expect(container.querySelector('.ant-file-card-file-description')?.textContent).toBe('1 KB');
  });

  // 文件类型测试（合并为一个测试）
  it('should support different file types', () => {
    const { container, rerender } = render(
      <FileCard name="image.png" src="test.jpg" type="image" />,
    );
    expect(container.querySelector('.ant-file-card-image')).toBeTruthy();

    rerender(<FileCard name="audio.mp3" src="test.mp3" type="audio" />);
    expect(container.querySelector('.ant-file-card-audio')).toBeTruthy();

    rerender(<FileCard name="video.mp4" src="test.mp4" type="video" />);
    expect(container.querySelector('.ant-file-card-video')).toBeTruthy();

    rerender(<FileCard name="document.pdf" type="file" />);
    expect(container.querySelector('.ant-file-card-file')).toBeTruthy();
  });

  // 样式和类名测试
  it('should support custom styles and classNames', () => {
    const { container } = render(
      <FileCard
        name="test.txt"
        classNames={{ name: 'custom-name' }}
        styles={{ name: { color: 'red' } }}
        description="Custom description"
      />,
    );

    const nameElement = container.querySelector('.ant-file-card-file-name');
    expect(nameElement).toHaveClass('custom-name');
    expect(nameElement).toHaveStyle({ color: 'red' });
    expect(container.querySelector('.ant-file-card-file-description')?.textContent).toBe(
      'Custom description',
    );
  });

  // 遮罩功能测试
  it('should support mask', () => {
    const { container } = render(
      <FileCard name="test.txt" mask={<div className="custom-mask">Mask</div>} />,
    );
    expect(container.querySelector('.custom-mask')).toBeTruthy();
  });

  // 列表功能测试（合并为一个测试）
  describe('FileCard.List', () => {
    it('should render file list with all features', async () => {
      const { container, rerender } = render(
        <FileCard.List
          items={[
            { name: 'file1.txt', byte: 1024 },
            { name: 'file2.jpg', byte: 2048 },
          ]}
          removable
          overflow="scrollX"
          extension={<div className="extension">Extension</div>}
        />,
      );

      expect(container.querySelector('.ant-file-card-list')).toBeTruthy();
      expect(container.querySelectorAll('.ant-file-card')).toHaveLength(2);
      expect(container.querySelector('.ant-file-card-list-overflow-scrollX')).toBeTruthy();
      expect(container.querySelector('.extension')).toBeTruthy();

      // 测试移除功能
      fireEvent.click(container.querySelector('.ant-file-card-list-remove')!);
      await waitFakeTimer();
      expect(container.querySelectorAll('.ant-file-card-list-motion-leave')).toHaveLength(1);

      // 测试其他overflow类型
      rerender(<FileCard.List items={[{ name: 'file.txt' }]} overflow="scrollY" />);
      expect(container.querySelector('.ant-file-card-list-overflow-scrollY')).toBeTruthy();

      // 测试wrap类型
      rerender(<FileCard.List items={[{ name: 'file.txt' }]} overflow="wrap" />);
      expect(container.querySelector('.ant-file-card-list-overflow-wrap')).toBeTruthy();
    });
  });

  // 边界情况测试
  it('should handle edge cases', () => {
    const { container } = render(<FileCard name="file" type="image" src="" />);
    expect(container.querySelector('.ant-file-card')).toBeTruthy();
  });
});
