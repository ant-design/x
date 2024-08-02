import * as React from 'react';
import useLayoutEffect from 'rc-util/lib/hooks/useLayoutEffect';

/**
 * Return typed content and typing status when typing is enabled.
 * Or return content directly.
 */
const useTypedEffect = (
  content: string,
  typingEnabled: boolean,
  typingStep: number,
  typingInterval: number,
): [typedContent: string, isTyping: boolean] => {
  const [prevContent, setPrevContent] = React.useState<string>('');
  const [typingIndex, setTypingIndex] = React.useState<number>(1);

  // Reset typing index when content changed
  useLayoutEffect(() => {
    setPrevContent(content);
    if (content.indexOf(prevContent) !== 0) {
      setTypingIndex(1);
    }
  }, [content, typingEnabled]);

  // Start typing
  React.useEffect(() => {
    if (typingEnabled && typingIndex < content.length) {
      const id = setTimeout(() => {
        setTypingIndex((prev) => prev + typingStep);
      }, typingInterval);

      return () => {
        clearTimeout(id);
      };
    }
  }, [typingIndex, typingEnabled, content]);

  const mergedTypingContent = typingEnabled ? content.slice(0, typingIndex) : content;

  return [mergedTypingContent, typingEnabled && typingIndex < content.length];
};

export default useTypedEffect;
