import useLayoutEffect from 'rc-util/lib/hooks/useLayoutEffect';
import * as React from 'react';
import { BubbleContentType } from '../interface';

function isString(str: any): str is string {
  return typeof str === 'string';
}

/**
 * Find the longest common prefix between two strings
 */
function findCommonPrefix(str1: string, str2: string): number {
  let i = 0;
  const minLength = Math.min(str1.length, str2.length);

  while (i < minLength && str1[i] === str2[i]) {
    i++;
  }

  return i;
}

/**
 * Return typed content and typing status when typing is enabled.
 * Or return content directly.
 */
const useTypedEffect = (
  content: BubbleContentType,
  typingEnabled: boolean,
  typingStep: number,
  typingInterval: number,
): [typedContent: React.ReactNode | object, isTyping: boolean] => {
  const prevContentRef = React.useRef<React.ReactNode | object>('');

  const [typingIndex, setTypingIndex] = React.useState<number>(1);

  const mergedTypingEnabled = typingEnabled && isString(content);

  // Reset typing index when content changed
  useLayoutEffect(() => {
    if (!mergedTypingEnabled && isString(content)) {
      setTypingIndex(content.length);
    } else if (
      isString(content) &&
      isString(prevContentRef.current) &&
      content.indexOf(prevContentRef.current) !== 0
    ) {
      // Find the longest common prefix between new and old content
      const commonPrefixLength = findCommonPrefix(content, prevContentRef.current);

      // If there's no common prefix, start from beginning
      // If there's a common prefix, start from the point where they differ
      if (commonPrefixLength === 0) {
        setTypingIndex(1);
      } else if (commonPrefixLength < content.length) {
        // Start from the next character after the common prefix
        setTypingIndex(commonPrefixLength + 1);
      } else {
        // New content is shorter or same as common prefix, show all
        setTypingIndex(content.length);
      }
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
