import {
  SemanticConfig,
  StreamCacheTokenType,
  StreamingOption,
  XMarkdownProps,
} from '../interface';
import { isInsideUnclosedCodeBlock, safeEncodeURIComponent } from '../utils';
import StreamingTokenizer from './StreamingTokenizer';

interface StreamCache {
  pending: string;
  token: StreamCacheTokenType;
  processedLength: number;
  completeMarkdown: string;
}

interface ProcessParams {
  markdown: string;
  onUpdate: (streamingMarkdown: string) => void;
  streaming?: StreamingOption;
  components?: XMarkdownProps['components'];
}

interface SplitSemantic {
  markdown: string;
  onUpdate: (streamingMarkdown: string) => void;
  semantic: StreamingOption['semantic'];
}

const DEFAULT_SEMANTIC_CONFIG: Required<SemanticConfig> = {
  delimiterPattern: '[。？！……；：——，]',
  maxChunkLength: 18,
  chunkDelays: [300, 200, 100, 0],
  charDelays: [50, 30, 20, 10, 5],
};

const STREAM_INCOMPLETE_REGEX = {
  image: [/^!\[[^\]\r\n]{0,1000}$/, /^!\[[^\r\n]{0,1000}\]\(*[^)\r\n]{0,1000}$/],
  link: [/^\[[^\]\r\n]{0,1000}$/, /^\[[^\r\n]{0,1000}\]\(*[^)\r\n]{0,1000}$/],
  html: [/^<\/$/, /^<\/?[a-zA-Z][a-zA-Z0-9-]{0,100}[^>\r\n]{0,1000}$/],
  emphasis: [/^(\*{1,3}|_{1,3})(?!\s)(?!.*\1$)[^\r\n]{0,1000}$/],
  list: [/^[-+*]\s{0,3}$/, /^[-+*]\s{1,3}(\*{1,3}|_{1,3})(?!\s)(?!.*\1$)[^\r\n]{0,1000}$/],
  'inline-code': [/^`[^`\r\n]{0,300}$/],
} as const;

const isTableInComplete = (markdown: string): boolean => {
  if (markdown.includes('\n\n')) return false;
  const lines = markdown.split('\n');
  if (lines.length <= 1) return true;

  const [header, separator] = lines;
  if (!/^\|.*\|$/.test(header.trim())) return false;

  const columns = separator
    .split('|')
    .map((col) => col.trim())
    .filter(Boolean);

  const separatorRegex = /^:?-+:?$/;
  return columns.every((col, index) =>
    index === columns.length - 1
      ? col === ':' || separatorRegex.test(col)
      : separatorRegex.test(col),
  );
};

interface TokenRecognizer {
  tokenType: StreamCacheTokenType;
  isStartOfToken: (markdown: string) => boolean;
  isStreamingValid: (markdown: string) => boolean;
}

const tokenRecognizerMap: Record<StreamCacheTokenType, TokenRecognizer> = {
  [StreamCacheTokenType.Link]: {
    tokenType: StreamCacheTokenType.Link,
    isStartOfToken: (md) => md.startsWith('['),
    isStreamingValid: (md) => STREAM_INCOMPLETE_REGEX.link.some((re) => re.test(md)),
  },
  [StreamCacheTokenType.Image]: {
    tokenType: StreamCacheTokenType.Image,
    isStartOfToken: (md) => md.startsWith('!'),
    isStreamingValid: (md) => STREAM_INCOMPLETE_REGEX.image.some((re) => re.test(md)),
  },
  [StreamCacheTokenType.Html]: {
    tokenType: StreamCacheTokenType.Html,
    isStartOfToken: (md) => md.startsWith('<'),
    isStreamingValid: (md) => STREAM_INCOMPLETE_REGEX.html.some((re) => re.test(md)),
  },
  [StreamCacheTokenType.Emphasis]: {
    tokenType: StreamCacheTokenType.Emphasis,
    isStartOfToken: (md) => md.startsWith('*') || md.startsWith('_'),
    isStreamingValid: (md) => STREAM_INCOMPLETE_REGEX.emphasis.some((re) => re.test(md)),
  },
  [StreamCacheTokenType.List]: {
    tokenType: StreamCacheTokenType.List,
    isStartOfToken: (md) => /^[-+*]/.test(md),
    isStreamingValid: (md) => STREAM_INCOMPLETE_REGEX.list.some((re) => re.test(md)),
  },
  [StreamCacheTokenType.Table]: {
    tokenType: StreamCacheTokenType.Table,
    isStartOfToken: (md) => md.startsWith('|'),
    isStreamingValid: isTableInComplete,
  },
  [StreamCacheTokenType.InlineCode]: {
    tokenType: StreamCacheTokenType.InlineCode,
    isStartOfToken: (md) => md.startsWith('`'),
    isStreamingValid: (md) => STREAM_INCOMPLETE_REGEX['inline-code'].some((re) => re.test(md)),
  },
  [StreamCacheTokenType.Text]: {
    tokenType: StreamCacheTokenType.Text,
    isStartOfToken: () => true,
    isStreamingValid: () => true,
  },
};

class StreamingProcessor {
  private cache: StreamCache = {
    pending: '',
    token: StreamCacheTokenType.Text,
    processedLength: 0,
    completeMarkdown: '',
  };

  private recognize(tokenType: StreamCacheTokenType): void {
    const recognizer = tokenRecognizerMap[tokenType];
    const { token, pending } = this.cache;

    if (token === StreamCacheTokenType.Text && recognizer.isStartOfToken(pending)) {
      this.cache.token = tokenType;
    } else if (token === tokenType && !recognizer.isStreamingValid(pending)) {
      this.commitCache();
    }
  }

  private commitCache(): void {
    if (this.cache.pending) {
      this.cache.completeMarkdown += this.cache.pending;
      this.cache.pending = '';
    }
    this.cache.token = StreamCacheTokenType.Text;
  }

  private resetCache(): void {
    this.cache = {
      pending: '',
      token: StreamCacheTokenType.Text,
      processedLength: 0,
      completeMarkdown: '',
    };
  }

  private stashIncompleteMarkdown(
    markdown: string,
    config?: StreamingOption,
    components?: XMarkdownProps['components'],
  ): string {
    const { incompleteMarkdownComponentMap } = config || {};

    if (!markdown) {
      this.resetCache();
      return '';
    }

    const expectedPrefix = this.cache.completeMarkdown + this.cache.pending;
    if (!markdown.startsWith(expectedPrefix)) {
      this.resetCache();
    }

    const chunk = markdown.slice(this.cache.processedLength);
    if (!chunk) return this.cache.completeMarkdown;

    this.cache.processedLength = markdown.length;

    for (const char of chunk) {
      this.cache.pending += char;

      if (isInsideUnclosedCodeBlock(this.cache.completeMarkdown + this.cache.pending)) {
        this.commitCache();
        continue;
      }

      Object.values(tokenRecognizerMap).forEach((rec) => {
        this.recognize(rec.tokenType);
      });

      if (this.cache.token === StreamCacheTokenType.Text) {
        this.commitCache();
      }
    }

    return this.generatePlaceholder(markdown, incompleteMarkdownComponentMap, components);
  }

  private generatePlaceholder(
    _markdown: string,
    incompleteMarkdownComponentMap?: Record<string, string>,
    components?: XMarkdownProps['components'],
  ): string {
    const { token, pending } = this.cache;

    if (token === StreamCacheTokenType.Text) {
      return this.cache.completeMarkdown;
    }

    if (token === StreamCacheTokenType.Image && pending === '!') {
      return this.cache.completeMarkdown;
    }

    if (token === StreamCacheTokenType.Table && pending.split('\n').length > 2) {
      return this.cache.completeMarkdown + pending;
    }

    const componentMap = incompleteMarkdownComponentMap || {};
    const componentName = componentMap[token] || `incomplete-${token}`;

    if (components?.[componentName]) {
      const encodedPending = safeEncodeURIComponent(pending);
      return `${this.cache.completeMarkdown}<${componentName} data-raw="${encodedPending}" />`;
    }

    return this.cache.completeMarkdown;
  }

  private async splitSemantic({ markdown, semantic, onUpdate }: SplitSemantic) {
    const tokenizer = StreamingTokenizer.createStreamProcessor(
      markdown,
      { semantic, enableWordLevel: true },
      (_, index) => {
        const accumulatedText = tokenizer.tokens.slice(0, index + 1).join('');
        onUpdate(accumulatedText);
      },
    );

    await tokenizer.process();
  }

  public async process({ markdown, onUpdate, streaming, components }: ProcessParams) {
    const { hasNextChunk, semantic } = streaming || {};

    const processed = hasNextChunk
      ? this.stashIncompleteMarkdown(markdown, streaming, components)
      : markdown;

    if (semantic) {
      await this.splitSemantic({ markdown: processed, onUpdate, semantic });
    } else {
      onUpdate(processed);
    }
  }
}

export default new StreamingProcessor();
