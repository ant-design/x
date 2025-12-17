import { isImageFileType, previewImage } from '../util';

describe('attachments util', () => {
  describe('isImageFileType', () => {
    it('should return true for image types', () => {
      expect(isImageFileType('image/jpeg')).toBe(true);
      expect(isImageFileType('image/png')).toBe(true);
      expect(isImageFileType('image/gif')).toBe(true);
      expect(isImageFileType('image/svg+xml')).toBe(true);
      expect(isImageFileType('image/webp')).toBe(true);
    });

    it('should return false for non-image types', () => {
      expect(isImageFileType('application/pdf')).toBe(false);
      expect(isImageFileType('text/plain')).toBe(false);
      expect(isImageFileType('video/mp4')).toBe(false);
      expect(isImageFileType('audio/mp3')).toBe(false);
      expect(isImageFileType('')).toBe(false);
    });

    it('should handle case sensitivity', () => {
      expect(isImageFileType('IMAGE/JPEG')).toBe(false);
      expect(isImageFileType('Image/Png')).toBe(false);
    });
  });

  describe('previewImage', () => {
    beforeEach(() => {
      // Mock DOM APIs
      Object.defineProperty(global, 'Image', {
        value: class MockImage {
          onload: (() => void) | null = null;
          onerror: (() => void) | null = null;
          crossOrigin = '';
          src = '';
          width = 0;
          height = 0;

          constructor() {
            setTimeout(() => {
              this.width = 400;
              this.height = 300;
              this.onload?.();
            }, 0);
          }
        },
        writable: true,
      });

      // Mock canvas
      const mockContext = {
        drawImage: jest.fn(),
      } as any;
      global.HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);
      global.HTMLCanvasElement.prototype.toDataURL = jest.fn(() => 'data:image/jpeg;base64,mocked');

      // Mock URL APIs
      global.URL.createObjectURL = jest.fn(() => 'blob:mocked-url');
      global.URL.revokeObjectURL = jest.fn();

      // Mock FileReader
      const MockFileReader = jest.fn().mockImplementation(() => ({
        readAsDataURL: jest.fn(),
        readAsText: jest.fn(),
        readAsArrayBuffer: jest.fn(),
        onload: null,
        onerror: null,
        result: null,
        EMPTY: 0,
        LOADING: 1,
        DONE: 2,
      }));
      global.FileReader = MockFileReader as any;

      // Mock document.createElement
      global.document.createElement = jest.fn((tagName: string) => {
        if (tagName === 'canvas') {
          return {
            width: 0,
            height: 0,
            getContext: jest.fn(() => ({
              drawImage: jest.fn(),
            })),
            toDataURL: jest.fn(() => 'data:image/jpeg;base64,mocked'),
            style: {},
          } as unknown as HTMLCanvasElement;
        }
        return {} as HTMLElement;
      });

      // Mock document.body properly
      Object.defineProperty(global.document, 'body', {
        value: {
          appendChild: jest.fn(),
          removeChild: jest.fn(),
        },
        writable: true,
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return empty string for non-image files', async () => {
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });
      const result = await previewImage(file);
      expect(result).toBe('');
    });

    it('should return empty string for file without type', async () => {
      const file = new File(['content'], 'test.jpg');
      const result = await previewImage(file);
      expect(result).toBe('');
    });

    it('should handle SVG files with FileReader', async () => {
      const file = new File(['<svg></svg>'], 'test.svg', { type: 'image/svg+xml' });

      // Mock FileReader behavior
      const mockFileReaderInstance = {
        readAsDataURL: jest.fn(),
        result: 'data:image/svg+xml;base64,PHN2Zz4=',
        onload: null as any,
      };
      const MockFileReader = jest.fn().mockImplementation(() => mockFileReaderInstance);
      global.FileReader = MockFileReader as any;

      const promise = previewImage(file);

      // Trigger FileReader onload
      await new Promise((resolve) => setTimeout(resolve, 0));
      if (mockFileReaderInstance.onload) {
        mockFileReaderInstance.onload({} as ProgressEvent<FileReader>);
      }

      await promise;

      expect(MockFileReader).toHaveBeenCalled();
      expect(mockFileReaderInstance.readAsDataURL).toHaveBeenCalledWith(file);
    });

    it('should handle regular image files with createObjectURL', async () => {
      const file = new File(['image content'], 'test.jpg', { type: 'image/jpeg' });

      const result = await previewImage(file);

      expect(URL.createObjectURL).toHaveBeenCalledWith(file);
      expect(result).toBe('data:image/jpeg;base64,mocked');
    });

    it('should handle null file', async () => {
      const result = await previewImage(null as any);
      expect(result).toBe('');
    });

    it('should handle undefined file', async () => {
      const result = await previewImage(undefined as any);
      expect(result).toBe('');
    });
  });
});
