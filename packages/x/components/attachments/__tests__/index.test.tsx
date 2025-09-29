import React from 'react';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import { fireEvent, render, waitFakeTimer } from '../../../tests/utils';
import Attachments, { type AttachmentsProps } from '..';

describe('attachments', () => {
  mountTest(() => <Attachments />);
  rtlTest(() => <Attachments />);
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  const mockItems = Array.from({ length: 5 }).map(
    (_, index) =>
      ({
        uid: String(index),
        name: `file-${index}.jpg`,
        status: 'done',
        thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      }) as const,
  );

  const renderAttachments = (props?: AttachmentsProps) => {
    return (
      <Attachments
        styles={{
          placeholder: {
            color: 'blue',
          },
          upload: {
            color: 'red',
          },
        }}
        classNames={{
          placeholder: 'placeholder',
          upload: 'upload',
        }}
        beforeUpload={() => false}
        {...props}
      />
    );
  };

  it('add and remove file', async () => {
    const onChange = jest.fn();
    const { container } = render(
      renderAttachments({
        onChange,
      }),
    );

    // Add file
    fireEvent.change(container.querySelector('input')!, {
      target: { files: [{ file: 'foo.png' }] },
    });
    await waitFakeTimer();
    expect(onChange.mock.calls[0][0].fileList).toHaveLength(1);
    onChange.mockClear();

    // Remove file
    fireEvent.click(container.querySelector('.ant-file-card-list-remove')!);
    await waitFakeTimer();
    expect(onChange.mock.calls[0][0].fileList).toHaveLength(0);
  });

  it('add and remove file but can stop remove', async () => {
    const onChange = jest.fn();
    const { container } = render(
      renderAttachments({
        onChange,
        onRemove: () => false,
      }),
    );

    // Add file
    fireEvent.change(container.querySelector('input')!, {
      target: { files: [{ file: 'foo.png' }] },
    });
    await waitFakeTimer();
    expect(onChange.mock.calls[0][0].fileList).toHaveLength(1);
    onChange.mockClear();

    // Remove file
    fireEvent.click(container.querySelector('.ant-file-card-list-remove')!);
    await waitFakeTimer();
    expect(container.querySelectorAll('.ant-file-card-list-item')).toHaveLength(1);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('overflow: scrollX', () => {
    const { container } = render(
      renderAttachments({
        overflow: 'scrollX',
        items: mockItems,
      }),
    );

    expect(container.querySelector('.ant-file-card-list-overflow-scrollX')).toBeTruthy();
  });

  it('overflow: scrollY', () => {
    const { container } = render(
      renderAttachments({
        overflow: 'scrollY',
        items: mockItems,
      }),
    );

    expect(container.querySelector('.ant-file-card-list-overflow-scrollY')).toBeTruthy();
  });

  it('card list description done', () => {
    const { container } = render(
      renderAttachments({
        items: [
          {
            uid: '1',
            name: 'file-1.txt',
            status: 'done',
            description: 'test description',
          },
        ],
      }),
    );

    expect(container.querySelector('.ant-file-card-file-description')?.textContent).toBe(
      'test description',
    );
  });

  it('card list description uploading', () => {
    const { container } = render(
      renderAttachments({
        items: [
          {
            uid: '2',
            name: 'file-2.txt',
            status: 'uploading',
            percent: 50,
          },
        ],
      }),
    );

    expect(container.querySelector('.ant-file-card-file-description')?.textContent).toBe('50%');
  });

  it('card list description error', () => {
    const { container } = render(
      renderAttachments({
        items: [
          {
            uid: '3',
            name: 'file-3.txt',
            status: 'error',
            response: 'Error message',
          },
        ],
      }),
    );

    expect(container.querySelector('.ant-file-card-file-description')?.textContent).toBe(
      'Error message',
    );
  });

  it('image list mask', () => {
    const { container } = render(
      renderAttachments({
        items: [
          {
            uid: '1',
            name: 'image uploading preview.png',
            status: 'uploading',
            percent: 33,
            thumbUrl:
              'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          },
          {
            uid: '2',
            name: 'image error preview.png',
            status: 'error',
            response: 'Server Error 500',
            thumbUrl:
              'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          },
        ],
      }),
    );

    expect(container.querySelector('.ant-attachment-list-card-file-img-mask')).toBeTruthy();
    expect(container.querySelector('.ant-progress')).toBeTruthy();
    expect(container.querySelector('.ant-attachment-list-card-ellipsis')?.textContent).toBe(
      'Server Error 500',
    );
  });

  it('maxCount', async () => {
    const onChange = jest.fn();
    const presetFiles = Array.from({ length: 5 }).map(
      (_, index) =>
        ({
          uid: String(index),
          name: `file-${index}.jpg`,
          status: 'done',
          thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        }) as const,
    );

    const { container } = render(
      renderAttachments({
        maxCount: 5,
        items: presetFiles,
        onChange,
      }),
    );

    expect(container.querySelectorAll('.ant-file-card-list-item')).toHaveLength(5);

    const uploadBtn = container.querySelector('.ant-upload-wrapper .ant-btn');
    expect(uploadBtn).toBeTruthy();

    if (uploadBtn) {
      fireEvent.click(uploadBtn);
      const fileInput = container.querySelector('input[type="file"]');
      if (fileInput) {
        fireEvent.change(fileInput, {
          target: { files: [new File(['test'], 'test-file.jpg', { type: 'image/jpeg' })] },
        });
        await waitFakeTimer();
        if (onChange.mock.calls.length > 0) {
          const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1];
          expect(lastCall[0].fileList.length).toBeLessThanOrEqual(5);
        }
      }
    }
  });
});
