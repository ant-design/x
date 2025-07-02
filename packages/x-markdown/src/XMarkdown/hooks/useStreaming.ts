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

const Markdown_Symbols = {
  emphasis: ['*', '_'],
  code: ['`'],
  list: ['-', '+', '*'],
};

const STREAM_BUFFER_INIT = {
  processedLength: 0,
  rawStream: '',
  pending: '',
  token: TokenType.Text,
  tokens: [TokenType.Text],
  headingLevel: 0,
  emphasisCount: 0,
  backtickCount: 0,
};

const useStreaming = (input: string, config?: XMarkdownProps['streaming']) => {
  const { hasNextChunk = false } = config || {};

  const [output, setOutput] = useState('');
  const streamBuffer = useRef({ ...STREAM_BUFFER_INIT });

  const pushToken = useCallback((type: TokenType) => {
    streamBuffer.current.tokens = [...streamBuffer.current.tokens, type];
    streamBuffer.current.token = type;
  }, []);

  const popToken = useCallback(() => {
    const { tokens } = streamBuffer.current;
    if (tokens.length <= 1) return;

    const newTokens = [...tokens.slice(0, -1)];
    streamBuffer.current.tokens = newTokens;
    streamBuffer.current.token = newTokens[newTokens.length - 1];
  }, []);

  const flushOutput = (needPopToken = true) => {
    if (needPopToken) popToken();

    streamBuffer.current.pending = '';
    const renderText = streamBuffer.current.rawStream;
    if (renderText) {
      setOutput(renderText);
    }
  };

  const handleChunk = (chunk: string) => {
    const buffer = streamBuffer.current;
    for (const char of chunk) {
      buffer.rawStream += char;
      buffer.pending += char;

      const { token, pending, tokens, emphasisCount } = buffer;
      switch (token) {
        case TokenType.Image: {
          /**
           * \![
           *   ^
           */
          const isInvalidStart = pending.indexOf('![') === -1;
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
          }
          break;
        }
        case TokenType.Link: {
          // not support link reference definitions, [foo]: /url "title" \n[foo]
          const isReferenceLink = pending.endsWith(']:');
          const isLinkEnd = char === ')' || char === '\n';
          const isImageInLink = char === '!';
          if (isImageInLink) {
            pushToken(TokenType.Image);
          } else if (isLinkEnd || isReferenceLink) {
            flushOutput();
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
        case TokenType.MaybeEmphasis: {
          /**
             * /* / *\/n
                ^     ^
             */
          const shouldFlushOutput = char === ' ' || char === '\n';
          if (shouldFlushOutput) {
            flushOutput();
          } else if (Markdown_Symbols.emphasis.includes(char)) {
            buffer.emphasisCount++;
          } else {
            popToken();
            if (emphasisCount === 1) {
              /**
               * _token_ / *token*
               * ^         ^
               */
              pushToken(TokenType.Emphasis);
            } else if (emphasisCount === 2) {
              /**
               * __token__ / **token**
               *  ^           ^
               */
              pushToken(TokenType.Strong);
            } else if (emphasisCount === 3) {
              /**
               * ___token___ / ***token***
               *   ^             ^
               */
              pushToken(TokenType.Emphasis);
              pushToken(TokenType.Strong);
            } else {
              // no more than 3
              buffer.emphasisCount = 0;
            }
          }

          break;
        }
        case TokenType.Strong: {
          /**
           * __token__ / **token**
           *         ^           ^
           */
          if (char === '\n') {
            flushOutput();
          } else if (pending.endsWith('**') || pending.endsWith('__')) {
            if (tokens[tokens.length - 2] === TokenType.Emphasis) {
              popToken();
            } else {
              flushOutput();
            }
          }

          break;
        }
        case TokenType.Emphasis: {
          /**
           * _token_ / *token*
           *       ^         ^
           */
          if (char === '\n') {
            flushOutput();
            buffer.emphasisCount = 0;
          } else if (Markdown_Symbols.emphasis.includes(char)) {
            flushOutput();
            buffer.emphasisCount = 0;
          }

          break;
        }
        case TokenType.XML: {
          /**
           * <XML /> /<XML></XML>
           *       ^      ^
           */
          const shouldFlushOutput = char === '>' || pending === '< ' || char === '\n';
          if (shouldFlushOutput) {
            flushOutput();
            continue;
          }
          break;
        }
        case TokenType.MaybeCode: {
          if (char === '`') {
            buffer.backtickCount++;
          } else {
            if (buffer.backtickCount > 2) {
              /**
               * ```
               *   ^
               */
              flushOutput();
              buffer.backtickCount = 0;
            } else {
              /**
               * ``
               *  ^
               */
              popToken();
              pushToken(TokenType.Code);
            }
          }
          break;
        }
        case TokenType.Code: {
          if (char === '`') {
            buffer.backtickCount--;
          }

          if (buffer.backtickCount === 0) {
            flushOutput();
            buffer.backtickCount = 0;
          }
          break;
        }
        case TokenType.MaybeHr: {
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
          } else if (char === '_' || char === '*') {
            pushToken(TokenType.MaybeEmphasis);
            buffer.emphasisCount = 1;
          } else if (char === '<') {
            pushToken(TokenType.XML);
          } else if (char === '`') {
            pushToken(TokenType.MaybeCode);
            buffer.backtickCount = 1;
          } else if (char === '-' || char === '=') {
            pushToken(TokenType.MaybeHr);
          } else if (Markdown_Symbols.list.includes(char)) {
            pushToken(TokenType.MaybeList);
          } else {
            flushOutput(false);
          }
        }
      }
    }
  };

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

    if (!hasNextChunk) {
      setOutput(input);
      return;
    }

    const chunk = input.slice(streamBuffer.current.processedLength);
    if (chunk.length) {
      streamBuffer.current.processedLength += chunk.length;
      handleChunk(chunk);
    }
  }, [input, hasNextChunk]);

  return output;
};

export default useStreaming;
