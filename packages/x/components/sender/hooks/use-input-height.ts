import useToken from '../../theme/useToken';
import { SenderProps } from '../interface';

const useInputHeight = (autoSize: SenderProps['autoSize'], styles?: React.CSSProperties) => {
  const { token } = useToken();
  const lineHeight = parseFloat(`${styles?.lineHeight || token.lineHeight}`);
  const fontSize = parseFloat(`${styles?.fontSize || token.fontSize}`);
  if (autoSize === false || !autoSize) {
    return {};
  }
  if (autoSize === true) {
    return {
      height: 'auto',
    };
  }

  return {
    minHeight: autoSize.minRows
      ? lineHeight * fontSize * autoSize.minRows + autoSize.minRows * 4.5
      : 'auto',
    maxHeight: autoSize.maxRows
      ? lineHeight * fontSize * autoSize.maxRows + autoSize.maxRows * 4.5
      : 'auto',
    overflowY: 'auto' as React.CSSProperties['overflowY'],
  };
};

export default useInputHeight;
