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
    minHeight: lineHeight * fontSize * (autoSize.minRows || 1),
    maxHeight: lineHeight * fontSize * (autoSize.maxRows || 8),
    overflowX: 'auto',
  };
};

export default useInputHeight;
