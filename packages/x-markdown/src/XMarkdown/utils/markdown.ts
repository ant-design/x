import { XMarkdownProps } from '../interface';

export const escapeNewlinesInCustomTags = (
  markdown: string,
  components: XMarkdownProps['components'],
) => {
  const placeholders = new Map<string, string>();
  const customTagNames = Object.keys(components || {});

  if (customTagNames.length === 0) {
    return { protected: markdown, placeholders };
  }

  let placeholderIndex = 0;

  const tagNamePattern = customTagNames
    .map((name) => name.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');

  const openTagRegex = new RegExp(`<(${tagNamePattern})(?:\\s[^>]*)?>`, 'gi');
  const closeTagRegex = new RegExp(`</(${tagNamePattern})>`, 'gi');

  const positions: Array<{
    index: number;
    type: 'open' | 'close';
    tagName: string;
    match: string;
  }> = [];

  let match;
  openTagRegex.lastIndex = 0;
  match = openTagRegex.exec(markdown);
  while (match !== null) {
    positions.push({
      index: match.index,
      type: 'open',
      tagName: match[1].toLowerCase(),
      match: match[0],
    });
    match = openTagRegex.exec(markdown);
  }

  closeTagRegex.lastIndex = 0;
  match = closeTagRegex.exec(markdown);
  while (match !== null) {
    positions.push({
      index: match.index,
      type: 'close',
      tagName: match[1].toLowerCase(),
      match: match[0],
    });
    match = closeTagRegex.exec(markdown);
  }

  positions.sort((a, b) => a.index - b.index);

  const stack: Array<{ tagName: string; start: number; openTag: string }> = [];
  const result: string[] = [];
  let lastIndex = 0;

  positions.forEach((pos) => {
    if (pos.type === 'open') {
      // Self-closing tags don't have inner content, so they shouldn't be pushed to the stack.
      if (!pos.match.endsWith('/>')) {
        stack.push({ tagName: pos.tagName, start: pos.index, openTag: pos.match });
      }
    } else if (
      pos.type === 'close' &&
      stack.length > 0 &&
      stack[stack.length - 1].tagName === pos.tagName
    ) {
      const open = stack.pop()!;
      if (stack.length === 0) {
        const startPos = open.start;
        const endPos = pos.index + pos.match.length;
        const openTag = open.openTag;
        const closeTag = pos.match;
        const innerContent = markdown.slice(startPos + openTag.length, pos.index);

        if (lastIndex < startPos) {
          result.push(markdown.slice(lastIndex, startPos));
        }

        if (innerContent.includes('\n\n')) {
          const protectedInner = innerContent.replace(/\n\n/g, () => {
            const ph = `__X_MD_PLACEHOLDER_${placeholderIndex++}__`;
            placeholders.set(ph, '\n\n');
            return ph;
          });
          result.push(openTag + protectedInner + closeTag);
        } else {
          result.push(openTag + innerContent + closeTag);
        }

        lastIndex = endPos;
      }
    }
  });

  if (lastIndex < markdown.length) {
    result.push(markdown.slice(lastIndex));
  }

  return { protected: result.join(''), placeholders };
};

export const unescapeNewlinesInCustomTags = (
  markdown: string,
  placeholders: Map<string, string>,
): string => {
  if (placeholders?.size === 0) {
    return markdown;
  }
  return markdown.replace(/__X_MD_PLACEHOLDER_\d+__/g, (match) => placeholders.get(match) ?? match);
};

export const isInsideUnclosedCodeBlock = (markdown: string, isFinalChunk = false): boolean => {
  const lines = markdown.split('\n');
  let inFenced = false;
  let fenceChar = '';
  let fenceLen = 0;

  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(/^(`{3,}|~{3,})(.*)$/);
    if (match) {
      const [fence, after] = [match[1], match[2]];
      if (!inFenced) {
        inFenced = true;
        fenceChar = fence[0];
        fenceLen = fence.length;
      } else {
        const isValidEnd =
          fence[0] === fenceChar && fence.length >= fenceLen && /^\s*$/.test(after);
        if (isValidEnd && (isFinalChunk || i < lines.length - 1)) {
          inFenced = false;
          fenceChar = '';
          fenceLen = 0;
        }
      }
    }
  }
  return inFenced;
};
