import useToken from '../../theme/useToken';
import { SenderProps } from '../interface';

const useInputHeight = (styles: React.CSSProperties, autoSize: SenderProps['autoSize']) => {
  const { token } = useToken();
  const lineHeight = parseFloat(`${styles.lineHeight || token.lineHeight}`);
  const fontSize = parseFloat(`${styles.fontSize || token.fontSize}`);
  if (autoSize === false || !autoSize) {
    return {};
  }
  if (autoSize === true) {
    return {
      height: 'auto',
    };
  }

  return {
    minHeight: autoSize.minRows ? lineHeight * fontSize * autoSize.minRows : 'auto',
    maxHeight: autoSize.maxRows ? lineHeight * fontSize * autoSize.maxRows : 'auto',
    overflowY: 'auto' as React.CSSProperties['overflowY'],
  };
};

export default useInputHeight;
