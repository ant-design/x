import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { XMarkdownProps } from '../interface';

enum TokenType {
  Text = 0,
  Link = 1,
  Image = 2,
  Heading = 3,
  MaybeEmphasis = 4,
  Emphasis = 5,
  Strong = 6,
  MaybeXML = 7,
  XML = 8,
  MaybeCode = 9,
  Code = 10,
  MaybeHr = 11,
}

const Markdown_Symbols = {
  emphasis: ['*', '_'],
  code: ['`'],
  XMLTags: ['div', 'span'],
  list: ['-', '+', '*'],
  thematicBreaks: ['*', '-', '_'],
};

const STREAM_BUFFER_INIT = {
  processedLength: 0,
  rawStream: '',
  pending: '',
  token: TokenType.Text,
  tokens: [TokenType.Text],
  XMLTag: '',
  headingLevel: 0,
  emphasisCount: 0,
  backtickCount: 0,
  seTextCount: 0,
};

const useStreaming = (
  input: string,
  config?: XMarkdownProps['streaming'],
  components?: XMarkdownProps['components'],
) => {
  const { hasNextChunk = false } = config || {};

  const [output, setOutput] = useState('');
  const streamBuffer = useRef({ ...STREAM_BUFFER_INIT });

  const supportedTags = useMemo(
    () => [...Markdown_Symbols.XMLTags, ...(components ? Object.keys(components) : [])],
    [components],
  );

  const pushToken = useCallback((type: TokenType) => {
    streamBuffer.current.tokens = [...streamBuffer.current.tokens, type];
    streamBuffer.current.token = type;
  }, []);

  const popToken = useCallback(() => {
    const { tokens } = streamBuffer.current;
    if (tokens.length <= 1) return;

    const newTokens = [...tokens.slice(0, -1)]; // 创建新数组
    streamBuffer.current.tokens = newTokens;
    streamBuffer.current.token = newTokens[newTokens.length - 1];
  }, []);

  const flushOutput = () => {
    popToken();
    const renderText = streamBuffer.current.rawStream;
    if (renderText) {
      setOutput(renderText);
    }
  };

  const flushOutputByPending = () => {
    const { rawStream } = streamBuffer.current;
    const processedContent = rawStream.slice(0, -1); // 更简洁的截取方式

    if (processedContent) {
      setOutput(processedContent);
    }
  };

  const updatePending = (char: string) => {
    streamBuffer.current.pending = char;
  };

  const handleChunk = (chunk: string) => {
    for (const char of chunk) {
      streamBuffer.current.rawStream += char;
      const { token, pending, XMLTag } = streamBuffer.current;
      // buffer and render
      switch (token) {
        case TokenType.Image:
        case TokenType.Link: {
          // not support link reference definitions, [foo]: /url "title" \n[foo]
          if (pending === ']' && char !== '(') {
            flushOutput();
            updatePending('');
            continue;
          }

          if (char === ')') {
            popToken();
            // prevent nested
            if (
              streamBuffer.current.token !== TokenType.Image &&
              streamBuffer.current.token !== TokenType.Link
            ) {
              flushOutput();
              updatePending('');
              continue;
            }
          }
          break;
        }
        case TokenType.Heading: {
          /**
           * # token / ## token / #####token
           *  ^         ^              ^
           */
          streamBuffer.current.headingLevel++;

          const shouldFlushOutput =
            char === ' ' || char !== '#' || streamBuffer.current.headingLevel >= 6;
          if (shouldFlushOutput) {
            flushOutput();
            updatePending('');
            streamBuffer.current.headingLevel = 0;
            continue;
          }

          break;
        }
        case TokenType.MaybeEmphasis: {
          if (Markdown_Symbols.emphasis.includes(char)) {
            streamBuffer.current.emphasisCount++;
            continue;
          }

          popToken();
          if (char === '\n') {
            /**
             * this is hr
             * ***\n
             *   ^
             */
            streamBuffer.current.emphasisCount = 0;
            break;
          }

          if (streamBuffer.current.emphasisCount === 1) {
            /**
             * _token_ / *token*
             * ^         ^
             */
            pushToken(TokenType.Emphasis);
          } else if (streamBuffer.current.emphasisCount === 2) {
            /**
             * __token__ / **token**
             *  ^           ^
             */
            pushToken(TokenType.Strong);
          } else if (streamBuffer.current.emphasisCount === 3) {
            /**
             * ___token___ / ***token***
             *   ^             ^
             */
            pushToken(TokenType.Strong);
            pushToken(TokenType.Emphasis);
          } else {
            // no more than 3
            streamBuffer.current.emphasisCount = 0;
          }
          break;
        }
        case TokenType.Strong: {
          if (Markdown_Symbols.emphasis.includes(char)) {
            streamBuffer.current.emphasisCount--;
            // if (tokens[tokens.length - 2] === TokenType.Emphasis) {
            //   /**
            //    * __token__ / **token**
            //    *        ^           ^
            //    */
            //   streamBuffer.current.emphasisCount -= 2;
            // } else {
            //   /**
            //    * __token_em / **token*em
            //    *        ^           ^
            //    */
            //   pushToken(TokenType.Emphasis);
            //   streamBuffer.current.emphasisCount++;
            // }
          }

          /**
           * __token__ / **token**
           *         ^           ^
           */
          if (streamBuffer.current.emphasisCount === 0) {
            flushOutput();
            updatePending('');
            continue;
          }

          break;
        }
        case TokenType.Emphasis: {
          if (Markdown_Symbols.emphasis.includes(char)) {
            streamBuffer.current.emphasisCount--;
            // if (tokens[tokens.length - 2] === TokenType.Strong) {
            //   /**
            //    * _token_ / *token*
            //    *       ^         ^
            //    */
            //   streamBuffer.current.emphasisCount--;
            // } else {
            //   /**
            //    * / *emphasis **strong*** / *emphasis **strong***
            //    *             ^                               ^
            //    */
            //   streamBuffer.current.emphasisCount += 2;
            //   pushToken(TokenType.Strong);
            // }
          }

          if (streamBuffer.current.emphasisCount === 0) {
            flushOutput();
            updatePending('');
            continue;
          }
          break;
        }
        case TokenType.MaybeXML: {
          const maxTagLength = Math.max(...supportedTags.map((tag) => tag.length));

          const isTagValid = supportedTags.includes(XMLTag);
          const isTagEnd = [' ', '/', '>'].includes(char);

          if (isTagValid && isTagEnd) {
            popToken();
            pushToken(TokenType.XML);
            break;
          }

          if (streamBuffer.current.XMLTag.length >= maxTagLength) {
            popToken();
            streamBuffer.current.XMLTag = '';
          } else {
            streamBuffer.current.XMLTag += char;
          }
          break;
        }
        case TokenType.XML: {
          /**
           * <XML />
           *      ^
           */
          if (char === '>') {
            flushOutput();
            updatePending('');
            streamBuffer.current.XMLTag = '';
            continue;
          }

          /**
           * <XML></XML>
           *           ^
           */
          // if (pending[0] === '<') {
          //   const potentialCloseTag = `</${XMLTag}>`;

          //   if (pending + char === potentialCloseTag) {
          //     flushOutput();
          //     updatePending('');
          //     streamBuffer.current.XMLTag = '';
          //   } else {
          //     updatePending(pending + char);
          //   }
          //   continue;
          // }
          break;
        }
        case TokenType.MaybeCode: {
          if (char === '`') {
            streamBuffer.current.backtickCount++;
          } else {
            popToken();
            pushToken(TokenType.Code);
          }
          break;
        }
        case TokenType.Code: {
          if (char === '`') {
            streamBuffer.current.backtickCount--;
            if (streamBuffer.current.backtickCount === 0) {
              flushOutput();
              updatePending('');
              continue;
            }
          }
          break;
        }
        case TokenType.MaybeHr: {
          if (char !== '-' && char !== '=') {
            flushOutput();
            updatePending('');
            continue;
          }
          break;
        }
      }

      // recognize token type
      switch (pending[0]) {
        case '!': {
          if (char === '[' && token !== TokenType.Image) {
            pushToken(TokenType.Image);
          }
          break;
        }
        case '[': {
          if (
            token !== TokenType.Link &&
            token !== TokenType.Image &&
            token !== TokenType.XML &&
            char !== ']'
          ) {
            pushToken(TokenType.Link);
          }
          break;
        }
        case '#': {
          if (char === ' ' || token === TokenType.Heading) {
            break;
          }

          // filter not heading format
          if (char === '#') {
            pushToken(TokenType.Heading);
            streamBuffer.current.headingLevel = 1;
          }

          break;
        }
        case '_':
        //emphasis or list
        case '*': {
          if (
            token === TokenType.Strong ||
            token === TokenType.Emphasis ||
            token === TokenType.Image ||
            char === ' '
          ) {
            break;
          }

          if (token !== TokenType.MaybeEmphasis) {
            pushToken(TokenType.MaybeEmphasis);
            const charIsEmphasis = Markdown_Symbols.emphasis.includes(char);
            streamBuffer.current.emphasisCount = charIsEmphasis ? 2 : 1;
          }

          break;
        }
        case '<': {
          if (char === ' ' || char === '/' || char === '>') {
            break;
          }
          if (token === TokenType.MaybeXML || token === TokenType.XML) {
            break;
          }

          pushToken(TokenType.MaybeXML);
          streamBuffer.current.XMLTag = char;
          break;
        }
        case '`': {
          if (token === TokenType.Code || token === TokenType.MaybeCode) {
            break;
          }

          pushToken(TokenType.MaybeCode);
          const charIsCode = char === '`';
          streamBuffer.current.backtickCount = charIsCode ? 2 : 1;
          break;
        }

        // list or hr
        case '-': {
          if (token === TokenType.MaybeHr) {
            break;
          }

          if (char === '-') {
            pushToken(TokenType.MaybeHr);
            streamBuffer.current.seTextCount = 2;
          } else if (char === ' ') {
            pushToken(TokenType.MaybeCode);
          }
          break;
        }
        // hr
        case '=': {
          if (token === TokenType.MaybeHr) {
            break;
          }
          if (char === '=') {
            pushToken(TokenType.MaybeHr);
            streamBuffer.current.seTextCount = 2;
          }
          break;
        }
        default: {
          if (token === TokenType.Text) {
            flushOutputByPending();
          }
          // list
          // if (Markdown_Symbols.list.includes(pending) && char === ' ') {
          //   break;
          // }
          // // thematic breaks
          // if (
          //   Markdown_Symbols.thematicBreaks.includes(pending) &&
          //   (char === pending || char === ' ')
          // ) {
          //   break;
          // }
        }
      }

      updatePending(char);
    }

    // filter list
    if (Markdown_Symbols.list.includes(streamBuffer.current.rawStream)) {
      return;
    }
    if (streamBuffer.current.token === TokenType.Text) {
      setOutput(streamBuffer.current.rawStream);
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
