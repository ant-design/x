import { useCallback, useEffect, useRef, useState } from 'react';
import { XMarkdownProps } from '../interface';

enum TokenType {
  Text = 0,
  Link = 1,
  Image = 2,
  Heading = 3,
  MaybeEmphasis = 4,
  Emphasis = 5,
  Strong = 6,
  XML = 7,
  MaybeCode = 8,
  Code = 9,
  MaybeHr = 10,
  MaybeList = 11,
}

interface StreamBuffer {
  processedLength: number;
  rawStream: string;
  pending: string;
  token: TokenType;
  tokens: TokenType[];
  headingLevel: number;
  backtickCount: number;
}

const STREAM_BUFFER_INIT: StreamBuffer = {
  processedLength: 0,
  rawStream: '',
  pending: '',
  token: TokenType.Text,
  tokens: [TokenType.Text],
  headingLevel: 0,
  backtickCount: 0,
};

const useStreaming = (input: string, config?: XMarkdownProps['streaming']) => {
  const { hasNextChunk = false, incompleteMarkdownComponentMap } = config || {};

  const [output, setOutput] = useState('');
  const streamBuffer = useRef<StreamBuffer>({ ...STREAM_BUFFER_INIT });

  const pushToken = useCallback((type: TokenType) => {
    const buffer = streamBuffer.current;
    buffer.tokens.push(type);
    buffer.token = type;
  }, []);

  const popToken = useCallback(() => {
    const buffer = streamBuffer.current;
    if (buffer.tokens.length <= 1) return;

    buffer.tokens.pop();
    buffer.token = buffer.tokens[buffer.tokens.length - 1];
  }, []);

  const flushOutput = useCallback(
    (needPopToken = true) => {
      if (needPopToken) {
        popToken();
      }

      streamBuffer.current.pending = '';
      const renderText = streamBuffer.current.rawStream;
      if (!renderText) return;

      setOutput(renderText);
    },
    [popToken],
  );

  // 替换不完整的 Markdown 语义为自定义加载组件
  const replaceInCompleteFormat = useCallback(() => {
    const finalComponentMap = {
      link: `<${incompleteMarkdownComponentMap?.link || 'incomplete-link'} />`,
      image: `<${incompleteMarkdownComponentMap?.image || 'incomplete-image'} />`,
    };

    const renderText = streamBuffer.current.rawStream;
    if (!renderText) return;

    // 使用更精确的正则表达式，避免误匹配
    const replacedOutput = renderText
      .replace(/!\[([^\]]*?)\](?!\([^)]*\)$)(?![^[]*\]\([^)]*\))$/, finalComponentMap.image)
      .replace(/\[([^\]]*?)\](?!\([^)]*\)$)(?![^[]*\]\([^)]*\))$/, finalComponentMap.link)
      .replace(/!\[([^\]]*?)\]\([^)]*$/, finalComponentMap.image)
      .replace(/\[([^\]]*?)\]\([^)]*$/, finalComponentMap.link);

    setOutput(replacedOutput);
  }, [incompleteMarkdownComponentMap]);

  const handleTokenProcessing = useCallback(
    (char: string) => {
      const buffer = streamBuffer.current;
      const { token, tokens } = buffer;

      switch (token) {
        case TokenType.Image: {
          /**
           * \![
           *   ^
           */
          const isInvalidStart = !buffer.pending.includes('![');
          /**
           * \![image]()
           *           ^
           */
          const isImageEnd = char === ')' || char === '\n';

          if (isInvalidStart || isImageEnd) {
            if (tokens[tokens.length - 2] === TokenType.Link) {
              popToken();
            } else {
              flushOutput();
            }
          } else {
            // replace loading component
            replaceInCompleteFormat();
          }
          break;
        }

        case TokenType.Link: {
          // not support link reference definitions, [foo]: /url "title" \n[foo]
          const isReferenceLink = buffer.pending.endsWith(']:');
          const isLinkEnd = char === ')' || char === '\n';
          const isImageInLink = char === '!';

          if (isImageInLink) {
            pushToken(TokenType.Image);
          } else if (isLinkEnd || isReferenceLink) {
            flushOutput();
          } else {
            // replace loading component
            replaceInCompleteFormat();
          }
          break;
        }

        case TokenType.Heading: {
          /**
           * # token / ## token / #####token
           *  ^         ^              ^
           */
          buffer.headingLevel++;
          const shouldFlushOutput = char !== '#' || buffer.headingLevel >= 6;

          if (shouldFlushOutput) {
            flushOutput();
            buffer.headingLevel = 0;
          }
          break;
        }

        case TokenType.XML: {
          /**
           * <XML /> /<XML></XML>
           *       ^      ^
           */
          const shouldFlushOutput = char === '>' || buffer.pending === '< ' || char === '\n';
          if (shouldFlushOutput) {
            flushOutput();
          }
          break;
        }

        case TokenType.MaybeCode: {
          /**
           * ```
           *   ^
           */
          if (char === '`') {
            buffer.backtickCount++;
          } else {
            flushOutput();
            pushToken(TokenType.Code);
          }
          break;
        }

        case TokenType.Code: {
          flushOutput(false);
          if (char === '`' && --buffer.backtickCount === 0) {
            popToken();
          }
          break;
        }

        case TokenType.MaybeHr: {
          /**
           * avoid Setext headings
           * Foo
           * -
           *  ^
           */
          if (char !== '-' && char !== '=' && char !== ' ') {
            flushOutput();
          }
          break;
        }

        case TokenType.MaybeList: {
          if (char !== ' ') {
            flushOutput();
          }
          break;
        }

        default: {
          buffer.pending = char;

          if (char === '!') {
            pushToken(TokenType.Image);
          } else if (char === '[') {
            pushToken(TokenType.Link);
          } else if (char === '#') {
            pushToken(TokenType.Heading);
          } else if (char === '<') {
            pushToken(TokenType.XML);
          } else if (char === '`') {
            pushToken(TokenType.MaybeCode);
            buffer.backtickCount = 1;
          } else if (char === '-' || char === '=') {
            pushToken(TokenType.MaybeHr);
          } else if ((char === '+' || char === '*') && buffer.pending.length === 1) {
            pushToken(TokenType.MaybeList);
          } else {
            flushOutput(false);
          }
        }
      }
    },
    [pushToken, popToken, flushOutput, replaceInCompleteFormat],
  );

  const handleChunk = useCallback(
    (chunk: string) => {
      const buffer = streamBuffer.current;
      for (const char of chunk) {
        buffer.rawStream += char;
        buffer.pending += char;
        handleTokenProcessing(char);
      }
    },
    [handleTokenProcessing],
  );

  useEffect(() => {
    if (!input) {
      setOutput('');
      streamBuffer.current = { ...STREAM_BUFFER_INIT };
      return;
    }

    if (typeof input !== 'string') {
      console.error(`X-Markdown: input must be string, not ${typeof input}.`);
      return;
    }

    // 如果输入完全改变，重置状态
    const currentRaw = streamBuffer.current.rawStream;
    if (!input.startsWith(currentRaw)) {
      streamBuffer.current = { ...STREAM_BUFFER_INIT };
    }

    if (!hasNextChunk) {
      setOutput(input);
      return;
    }

    const chunk = input.slice(streamBuffer.current.processedLength);
    if (chunk.length > 0) {
      streamBuffer.current.processedLength += chunk.length;
      handleChunk(chunk);
    }
  }, [input, hasNextChunk, handleChunk]);

  return output;
};

export default useStreaming;
