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
    return <Attachments beforeUpload={() => false} {...props} />;
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
    fireEvent.click(container.querySelector('.ant-attachment-list-card-remove')!);
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
    fireEvent.click(container.querySelector('.ant-attachment-list-card-remove')!);
    await waitFakeTimer();
    expect(container.querySelectorAll('.ant-attachment-list-card')).toHaveLength(1);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('overflow: scrollX', () => {
    const { container } = render(
      renderAttachments({
        overflow: 'scrollX',
        items: mockItems,
      }),
    );

    expect(container.querySelector('.ant-attachment-list-overflow-scrollX')).toBeTruthy();
  });

  it('overflow: scrollY', () => {
    const { container } = render(
      renderAttachments({
        overflow: 'scrollY',
        items: mockItems,
      }),
    );

    expect(container.querySelector('.ant-attachment-list-overflow-scrollY')).toBeTruthy();
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

    expect(container.querySelectorAll('.ant-attachment-list-card')).toHaveLength(5);

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
