import useToken from '../../theme/useToken';
import { SenderProps } from '../interface';

const SENDER_INPUT_PADDING_HEIGHT = 4.35;
const useInputHeight = (
  styles: React.CSSProperties,
  autoSize: SenderProps['autoSize'],
  editableRef: React.RefObject<HTMLDivElement | null>,
) => {
  const { token } = useToken();
  const computedStyle: any = editableRef.current
    ? window.getComputedStyle(editableRef.current)
    : {};
  const lineHeight = parseFloat(`${styles.lineHeight || token.lineHeight}`);
  const fontSize = parseFloat(`${computedStyle?.fontSize || styles.fontSize || token.fontSize}`);
  const height = computedStyle?.lineHeight
    ? parseFloat(`${computedStyle?.lineHeight}`)
    : lineHeight * fontSize;
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
      ? (height + SENDER_INPUT_PADDING_HEIGHT) * autoSize.minRows
      : 'auto',
    maxHeight: autoSize.maxRows
      ? (height + SENDER_INPUT_PADDING_HEIGHT) * autoSize.maxRows
      : 'auto',
    overflowY: 'auto' as React.CSSProperties['overflowY'],
  };
};

export default useInputHeight;
