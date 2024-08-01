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
  const [typingIndex, setTypingIndex] = React.useState<number>(0);

  // Reset typing index when content changed
  useLayoutEffect(() => {
    setTypingIndex(0);
  }, [content, typingEnabled]);

  // Start typing
  React.useEffect(() => {
    if (typingIndex < content.length) {
      const id = setTimeout(() => {
        setTypingIndex((prev) => prev + typingStep);
      }, typingInterval);

      return () => {
        clearTimeout(id);
      };
    }
  }, [typingIndex, typingEnabled]);

  const mergedTypingContent = typingEnabled ? content.slice(0, typingIndex) : content;

  return [mergedTypingContent, typingEnabled && typingIndex < content.length];
};

export default useTypedEffect;
