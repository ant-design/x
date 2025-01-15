import React from 'react';

import Attachments, { type AttachmentsProps } from '..';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import { fireEvent, render, waitFakeTimer } from '../../../tests/utils';

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
});
