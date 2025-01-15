import useLayoutEffect from 'rc-util/lib/hooks/useLayoutEffect';
import * as React from 'react';

function isString(str: any): str is string {
  return typeof str === 'string';
}

/**
 * Return typed content and typing status when typing is enabled.
 * Or return content directly.
 */
const useTypedEffect = (
  content: React.ReactNode | object,
  typingEnabled: boolean,
  typingStep: number,
  typingInterval: number,
): [typedContent: React.ReactNode | object, isTyping: boolean] => {

  const prevContentRef = React.useRef<React.ReactNode | object>();

  const [typingIndex, setTypingIndex] = React.useState<number>(1);

  const mergedTypingEnabled = typingEnabled && isString(content);

  // Reset typing index when content changed
  useLayoutEffect(() => {
    if (!mergedTypingEnabled && isString(content)) {
      setTypingIndex(content.length);
    } else if (isString(content) && isString(prevContentRef.current) && content.indexOf(prevContentRef.current) !== 0) {
      setTypingIndex(1);
    }
    prevContentRef.current = content;
  }, [content]);

  // Start typing
  React.useEffect(() => {
    if (mergedTypingEnabled && typingIndex < content.length) {
      const id = setTimeout(() => {
        setTypingIndex((prev) => prev + typingStep);
      }, typingInterval);

      return () => {
        clearTimeout(id);
      };
    }
  }, [typingIndex, typingEnabled, content]);

  const mergedTypingContent = mergedTypingEnabled ? content.slice(0, typingIndex) : content;

  return [mergedTypingContent, mergedTypingEnabled && typingIndex < content.length];
};

export default useTypedEffect;
