import FileListCard from '../FileList/FileListCard';
import { AttachmentContext } from '../context';
import { fireEvent, render } from '../../../tests/utils';
import React from 'react';
import { Attachment } from '..';

describe('FileListCard', () => {
  const baseItem:Attachment = {
    uid: '1',
    name: 'test.pdf',
    status: 'done',
    size: 1024,
    url: 'https://test.com/test.pdf',
  };

  it('renders correct icon for different file types', () => {
    const types = [
      { name: 'a.jpg', key: 'image' },
      { name: 'a.pdf', key: 'pdf' },
      { name: 'a.docx', key: 'word' },
      { name: 'a.zip', key: 'zip' },
      { name: 'a.mp3', key: 'audio' },
      { name: 'a.mp4', key: 'video' },
    ];
    types.forEach(({ name }) => {
      const { container } = render(<FileListCard item={{ ...baseItem, name }} />);
      expect(container.querySelector('.ant-attachment-list-card-icon')).toBeTruthy();
    });
  });

  it('renders image preview when type is image', () => {
    const { container } = render(
      <FileListCard item={{ ...baseItem, name: 'a.jpg', thumbUrl: 'img.png' }} type="image" />
    );
    expect(container.querySelector('img')).toBeTruthy();
  });

  it('renders uploading and error status', () => {
    const { container: uploading } = render(
      <FileListCard item={{ ...baseItem, status: 'uploading', percent: 50 }} />
    );
    expect(uploading.textContent).toContain('50%');

    const { container: error } = render(
      <FileListCard item={{ ...baseItem, status: 'error', response: 'fail' }} />
    );
    expect(error.textContent).toContain('fail');
  });

  it('calls onRemove when remove button clicked', () => {
    const onRemove = jest.fn();
    const { container } = render(<FileListCard item={baseItem} onRemove={onRemove} />);
    fireEvent.click(container.querySelector('button')!);
    expect(onRemove).toHaveBeenCalled();
  });

  it('does not show remove button when disabled', () => {
    const { container } = render(
      <AttachmentContext.Provider value={{ disabled: true }}>
        <FileListCard item={baseItem} onRemove={jest.fn()} />
      </AttachmentContext.Provider>
    );
    expect(container.querySelector('button')).toBeNull();
  });

  it('supports custom icon, imageProps, className, style', () => {
    const { container } = render(
      <FileListCard
        item={baseItem}
        icon={<span data-testid="custom-icon" />}
        imageProps={{ alt: 'custom' }}
        className="custom-class"
        style={{ color: 'red' }}
      />
    );
    expect(container.querySelector('.custom-class')).toBeTruthy();
    expect(container.querySelector('[data-testid="custom-icon"]')).toBeTruthy();
    expect(container.querySelector('.ant-attachment-list-card')).toHaveStyle('color: red');
  });
});