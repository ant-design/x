import type { StreamingConfig, StreamingOption, XMarkdownProps } from '../interface';

export const INTERNAL_STREAM_STATUS_ATTR = 'data-xmd-streaming';
export const INTERNAL_STREAM_STATUS_LOADING = 'loading';

const INTERNAL_COMPONENT_TAGS = new Set(['xmd-tail']);

export interface ResolvedParsingGuards {
  setextHeading: boolean;
  customTags: boolean;
  inlineTags: Set<string>;
}

const DEFAULT_BOOLEAN_STREAMING_CONFIG: StreamingConfig = {
  hasNextChunk: true,
  parsingGuards: true,
};

export const resolveStreamingConfig = (
  streaming?: StreamingOption,
): StreamingConfig | undefined => {
  if (streaming === true) {
    return DEFAULT_BOOLEAN_STREAMING_CONFIG;
  }

  if (streaming && typeof streaming === 'object') {
    return streaming;
  }

  return undefined;
};

export const resolveParsingGuards = (streaming?: StreamingOption): ResolvedParsingGuards => {
  const parsingGuards = resolveStreamingConfig(streaming)?.parsingGuards;

  if (!parsingGuards) {
    return {
      setextHeading: false,
      customTags: false,
      inlineTags: new Set(),
    };
  }

  if (parsingGuards === true) {
    return {
      setextHeading: true,
      customTags: true,
      inlineTags: new Set(),
    };
  }

  const customTagConfig = parsingGuards.customTags;
  return {
    setextHeading: !!parsingGuards.setextHeading,
    customTags: !!customTagConfig,
    inlineTags:
      customTagConfig && typeof customTagConfig === 'object'
        ? new Set((customTagConfig.inlineTags || []).map((tagName) => tagName.toLowerCase()))
        : new Set(),
  };
};

export const getBlockCustomTagNames = (
  components?: XMarkdownProps['components'],
  inlineTags?: Set<string>,
): string[] =>
  Object.keys(components || {})
    .map((tagName) => tagName.toLowerCase())
    .filter((tagName) => !INTERNAL_COMPONENT_TAGS.has(tagName) && !inlineTags?.has(tagName));
