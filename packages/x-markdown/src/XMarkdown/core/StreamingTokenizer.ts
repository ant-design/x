import { SemanticConfig } from '../interface';

export interface TokenizeOptions {
  semantic?: SemanticConfig | boolean;
  enableWordLevel?: boolean;
  enableCharLevel?: boolean;
  customDelimiters?: string[];
}

export interface TokenizeResult {
  tokens: string[];
  originalText: string;
  config: Required<SemanticConfig>;
}

const DEFAULT_DELIMITERS = ['。', '？', '！', '……', '；', '：', '——', '，'];

const DEFAULT_CONFIG: Required<SemanticConfig> = {
  delimiterPattern: '[。？！……；：——，]',
  maxChunkLength: 18,
  chunkDelays: [300, 200, 100, 0],
  charDelays: [50, 30, 20, 10, 5],
};

function getSemanticConfig(semantic?: SemanticConfig | boolean): Required<SemanticConfig> {
  return typeof semantic === 'boolean' || !semantic
    ? DEFAULT_CONFIG
    : { ...DEFAULT_CONFIG, ...semantic };
}

function tokenizeByDelimiters(text: string, delimiters: string[]): string[] {
  const delimiterPattern = new RegExp(
    `[${delimiters.map((d) => d.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('')}]`,
    'g',
  );
  const parts = text.split(delimiterPattern);
  const delimitersFound = text.match(delimiterPattern) || [];

  const tokens: string[] = [];
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i].trim();
    if (part) {
      tokens.push(part);
    }
    if (i < delimitersFound.length) {
      tokens[Math.max(0, tokens.length - 1)] += delimitersFound[i];
    }
  }

  return tokens.filter((token) => token.trim());
}

function tokenizeByWords(text: string, delimiters: string[]): string[] {
  // 中英文混合分词
  const tokens: string[] = [];
  let current = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (isChineseChar(char)) {
      if (current.trim()) {
        tokens.push(current.trim());
        current = '';
      }
      tokens.push(char);
    } else if (isDelimiter(char, delimiters)) {
      if (current.trim()) {
        tokens.push(current.trim() + char);
        current = '';
      } else if (tokens.length > 0) {
        tokens[tokens.length - 1] += char;
      }
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    tokens.push(current.trim());
  }

  return tokens.filter((token) => token.trim());
}

function tokenizeByChars(text: string): string[] {
  return text.split('').filter((char) => char.trim());
}

function isChineseChar(char: string): boolean {
  return /[\u4e00-\u9fa5]/.test(char);
}

function isDelimiter(char: string, delimiters: string[]): boolean {
  return delimiters.includes(char);
}

export function tokenize(text: string, options: TokenizeOptions = {}): TokenizeResult {
  const config = getSemanticConfig(options.semantic);
  const delimiters = options.customDelimiters || DEFAULT_DELIMITERS;

  let tokens: string[] = [];

  if (options.enableWordLevel) {
    tokens = tokenizeByWords(text, delimiters);
  } else if (options.enableCharLevel) {
    tokens = tokenizeByChars(text);
  } else {
    tokens = tokenizeByDelimiters(text, delimiters);
  }

  return {
    tokens,
    originalText: text,
    config,
  };
}

export function createStreamProcessor(
  text: string,
  options: TokenizeOptions = {},
  onToken?: (token: string, index: number) => void,
) {
  const { tokens, config } = tokenize(text, options);
  const delays = config.chunkDelays;

  return {
    tokens,
    async process() {
      for (let i = 0; i < tokens.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, delays[Math.min(i, delays.length - 1)]));
        onToken?.(tokens[i], i);
      }
    },
  };
}

// 保持向后兼容
const StreamingTokenizer = {
  tokenize,
  createStreamProcessor,
};

export default StreamingTokenizer;
