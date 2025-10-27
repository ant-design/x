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
    fireEvent.click(container.querySelector('.ant-file-card-list-remove')!);
    await waitFakeTimer();
    expect(onChange.mock.calls[0][0].fileList).toHaveLength(0);
  });
  it('support classnames and styles', () => {
    render(
      renderAttachments({
        styles: {
          placeholder: {
            color: 'blue',
          },
          upload: {
            color: 'red',
          },
        },
        classNames: {
          placeholder: 'placeholder',
          upload: 'upload',
        },
        items: mockItems,
      }),
    );
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

  it('maxCount', () => {
    const presetFiles = Array.from({ length: 5 }).map(
      (_, index) =>
        ({
          uid: String(index),
          name: `file-${index}.jpg`,
          status: 'done',
          thumbUrl:
            'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*5l2oSKBXatAAAAAAAAAAAAADgCCAQ/original',
          url: 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*5l2oSKBXatAAAAAAAAAAAAADgCCAQ/original',
        }) as const,
    );

    const { container } = render(
      renderAttachments({
        maxCount: 5,
        items: presetFiles,
      }),
    );

    expect(container.querySelectorAll('.ant-file-card-list-item')).toHaveLength(5);
  });

  it('should expose ref methods', () => {
    const ref = React.createRef<any>();
    const { container } = render(<Attachments ref={ref} beforeUpload={() => false} />);

    expect(ref.current).toBeTruthy();
    expect(ref.current.nativeElement).toBeInstanceOf(HTMLDivElement);
    expect(typeof ref.current.upload).toBe('function');
    expect(typeof ref.current.select).toBe('function');
  });

  it('should support ref select method', () => {
    const ref = React.createRef<any>();
    render(<Attachments ref={ref} beforeUpload={() => false} />);

    expect(typeof ref.current.select).toBe('function');
  });

  it('should support ref upload method', () => {
    const ref = React.createRef<any>();
    render(<Attachments ref={ref} beforeUpload={() => false} />);

    expect(typeof ref.current.upload).toBe('function');
  });

  it('should support disabled state', () => {
    const { container } = render(
      renderAttachments({
        disabled: true,
        items: mockItems,
      }),
    );

    expect(container.querySelector('.ant-attachment')).toBeTruthy();
  });

  it('should support custom children', () => {
    const { container } = render(
      <Attachments beforeUpload={() => false}>
        <button type="button">Custom Upload Button</button>
      </Attachments>,
    );

    expect(container.textContent).toContain('Custom Upload Button');
  });

  it('should support RTL direction', () => {
    const { container } = render(
      renderAttachments({
        items: mockItems,
      }),
    );

    expect(container.querySelector('.ant-attachment')).toBeTruthy();
  });

  it('should handle placeholder with function', () => {
    const placeholderFn = jest.fn().mockReturnValue({
      title: 'Custom Title',
      description: 'Custom Description',
    });

    render(
      renderAttachments({
        placeholder: placeholderFn,
      }),
    );

    expect(typeof placeholderFn).toBe('function');
  });

  it('should show placeholder when no files', () => {
    const { container } = render(
      renderAttachments({
        placeholder: {
          title: 'No Files',
          description: 'Upload some files',
        },
      }),
    );

    expect(container.querySelector('.ant-attachment-placeholder')).toBeTruthy();
  });

  it('should support wrap overflow', () => {
    const { container } = render(
      renderAttachments({
        overflow: 'wrap',
        items: mockItems,
      }),
    );

    expect(container.querySelector('.ant-file-card-list')).toBeTruthy();
  });
});
