// Follow code is copy from `antd/components/upload/utils.ts`:

export const isImageFileType = (type: string): boolean => type.indexOf('image/') === 0;

const MEASURE_SIZE = 200;

export function previewImage(file: File | Blob): Promise<string> {
  return new Promise<string>((resolve) => {
    if (!file || !file.type || !isImageFileType(file.type)) {
      resolve('');
      return;
    }

    const img = new Image();
    img.onload = () => {
      const { width, height } = img;

      const ratio = width / height;
      const MEASURE_SIZE_WIDTH = ratio > 1 ? MEASURE_SIZE : MEASURE_SIZE * ratio;
      const MEASURE_SIZE_HEIGHT = ratio > 1 ? MEASURE_SIZE / ratio : MEASURE_SIZE;

      const canvas = document.createElement('canvas');
      canvas.width = MEASURE_SIZE_WIDTH;
      canvas.height = MEASURE_SIZE_HEIGHT;
      canvas.style.cssText = `position: fixed; left: 0; top: 0; width: ${MEASURE_SIZE_WIDTH}px; height: ${MEASURE_SIZE_HEIGHT}px; z-index: 9999; display: none;`;
      document.body.appendChild<HTMLCanvasElement>(canvas);
      const ctx = canvas.getContext('2d');

      ctx!.drawImage(img, 0, 0, MEASURE_SIZE_WIDTH, MEASURE_SIZE_HEIGHT);
      const dataURL = canvas.toDataURL();
      document.body.removeChild(canvas);
      window.URL.revokeObjectURL(img.src);
      resolve(dataURL);
    };
    img.crossOrigin = 'anonymous';
    if (file.type.startsWith('image/svg+xml')) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result && typeof reader.result === 'string') {
          img.src = reader.result;
        }
      };
      reader.readAsDataURL(file);
    } else if (file.type.startsWith('image/gif')) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          resolve(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    } else {
      img.src = window.URL.createObjectURL(file);
    }
  });
}
