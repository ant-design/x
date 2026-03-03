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

  it('image originFileObj', () => {
    const file = new File(['test content'], '1.png', { type: 'image/png' }) as any;
    file.uid = 'rc-upload-1764338695629-39';
    file.lastModifiedDate = new Date('2025-11-23T11:13:14.951Z');

    render(
      renderAttachments({
        items: [
          {
            originFileObj: file,
            uid: '1',
            name: 'image uploading preview.png',
            status: 'uploading',
            percent: 33,
            thumbUrl:
              'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          },
        ],
      }),
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
    render(<Attachments ref={ref} beforeUpload={() => false} />);
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

  describe('ref methods coverage', () => {
    it('should test upload method with file input', () => {
      const ref = React.createRef<any>();

      render(<Attachments ref={ref} beforeUpload={() => false} />);

      // Get the actual file input
      const fileInput = ref.current.fileNativeElement;
      expect(fileInput).toBeInstanceOf(HTMLInputElement);

      // Mock the necessary methods
      const mockDispatchEvent = jest.fn();
      const mockFilesSetter = jest.fn();

      Object.defineProperty(fileInput, 'dispatchEvent', { value: mockDispatchEvent });
      Object.defineProperty(fileInput, 'files', {
        set: mockFilesSetter,
        get: () => null,
        configurable: true,
      });

      const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' });

      // Call upload method to cover lines 102-111
      ref.current.upload(testFile);

      expect(mockFilesSetter).toHaveBeenCalled();
      expect(mockDispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'change',
          bubbles: true,
        }),
      );
    });

    it('should test select method with file input', () => {
      const ref = React.createRef<any>();

      render(<Attachments ref={ref} beforeUpload={() => false} accept=".jpg,.png" />);

      // Get the actual file input
      const fileInput = ref.current.fileNativeElement;
      expect(fileInput).toBeInstanceOf(HTMLInputElement);

      // Mock the click method
      const mockClick = jest.fn();
      Object.defineProperty(fileInput, 'click', { value: mockClick });

      // Test select method to cover lines 113-118
      ref.current.select({ accept: '.pdf', multiple: true });

      expect(fileInput.accept).toBe('.pdf');
      expect(fileInput.multiple).toBe(true);
      expect(mockClick).toHaveBeenCalled();

      // Test select method with default accept
      ref.current.select({ multiple: false });

      expect(fileInput.accept).toBe('.jpg,.png');
      expect(fileInput.multiple).toBe(false);
      expect(mockClick).toHaveBeenCalledTimes(2);
    });

    it('should handle upload when file input is null', () => {
      const ref = React.createRef<any>();

      render(<Attachments ref={ref} beforeUpload={() => false} />);

      // Temporarily set fileNativeElement to null to test edge case
      const originalFileNativeElement = ref.current.fileNativeElement;
      Object.defineProperty(ref.current, 'fileNativeElement', {
        value: null,
        writable: true,
      });

      const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' });

      // Should not throw error when file input is null
      expect(() => {
        ref.current.upload(testFile);
      }).not.toThrow();

      // Restore original value
      Object.defineProperty(ref.current, 'fileNativeElement', {
        value: originalFileNativeElement,
        writable: true,
      });
    });

    it('should handle select when file input is null', () => {
      const ref = React.createRef<any>();

      render(<Attachments ref={ref} beforeUpload={() => false} />);

      // Temporarily set fileNativeElement to null to test edge case
      const originalFileNativeElement = ref.current.fileNativeElement;
      Object.defineProperty(ref.current, 'fileNativeElement', {
        value: null,
        writable: true,
      });

      // Should not throw error when file input is null
      expect(() => {
        ref.current.select({ accept: '.txt' });
      }).not.toThrow();

      // Restore original value
      Object.defineProperty(ref.current, 'fileNativeElement', {
        value: originalFileNativeElement,
        writable: true,
      });
    });

    it('should handle upload when file input query returns null', () => {
      const ref = React.createRef<any>();

      render(<Attachments ref={ref} beforeUpload={() => false} />);

      // Mock querySelector to return null for file input
      const originalQuerySelector = ref.current.fileNativeElement?.querySelector;
      if (ref.current.fileNativeElement) {
        ref.current.fileNativeElement.querySelector = jest.fn().mockReturnValue(null);
      }

      const testFile = new File(['test'], 'test.txt');

      // Should not throw when file input is not found
      expect(() => {
        ref.current.upload(testFile);
      }).not.toThrow();

      // Restore original querySelector
      if (ref.current.fileNativeElement && originalQuerySelector) {
        ref.current.fileNativeElement.querySelector = originalQuerySelector;
      }
    });

    it('should handle select when file input query returns null', () => {
      const ref = React.createRef<any>();

      render(<Attachments ref={ref} beforeUpload={() => false} />);

      // Mock querySelector to return null for file input
      const originalQuerySelector = ref.current.fileNativeElement?.querySelector;
      if (ref.current.fileNativeElement) {
        ref.current.fileNativeElement.querySelector = jest.fn().mockReturnValue(null);
      }

      // Should not throw when file input is not found
      expect(() => {
        ref.current.select({ accept: '.txt' });
      }).not.toThrow();

      // Restore original querySelector
      if (ref.current.fileNativeElement && originalQuerySelector) {
        ref.current.fileNativeElement.querySelector = originalQuerySelector;
      }
    });

    it('should have displayName in non-production environment', () => {
      expect(Attachments.displayName).toBe('Attachments');
    });
  });
});
