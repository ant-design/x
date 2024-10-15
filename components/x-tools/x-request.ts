import xFetch from './x-fetch';
import xStream from './x-stream';

import type { XFetchOptions } from './x-fetch';
import type { XStreamOptions } from './x-stream';

import type { AnyObject } from '../_util/type';

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

export interface CreateXRequestOptions<T> {
  baseURL?: string;

  /**
   * @description Model name, e.g., 'gpt-3.5-turbo'
   */
  model?: string;

  /**
   * @warning 🔥🔥 Its dangerously!
   *
   * Enabling the dangerouslyApiKey option can be dangerous because it exposes
   * your secret API credentials in the client-side code. Web browsers are inherently
   * less secure than server environments, any user with access to the browser can
   * potentially inspect, extract, and misuse these credentials. This could lead to
   * unauthorized access using your credentials and potentially compromise sensitive
   * data or functionality.
   */
  dangerouslyApiKey?: string;

  /**
   * @description Config for {@link XFetchOptions}
   */
  fetchOptions?: XFetchOptions;

  /**
   * @description Config for {@link XStreamOptions}
   */
  streamOptions?: XStreamOptions<T>;
}

/**
 * Compatible with the parameters of OpenAI's chat.completions.create,
 * with plans to support more parameters and adapters in the future
 */
export interface XRequestParams extends AnyObject {
  /**
   * @description {@link XAgentOptions.model}
   */
  model?: string;

  messages: {
    role?: 'system' | 'user' | 'assistant' | 'tool';
    content?: string | AnyObject;
  }[];

  /**
   * @description Indicates whether to use streaming for the response
   */
  stream?: boolean;

  /**
   * @description Multi-modal input image content, support URL and base64
   */
  image_url?: string;
}

export interface XRequestCallbacks<T> {
  onSuccess?: (message: T) => void;
  onError?: (error: Error) => void;
  onUpdate?: (message: T) => void;
}

export type XRequest<T> = (params: XRequestParams, callbacks: XRequestCallbacks<T>) => void;

export function createXRequest<T>(options: CreateXRequestOptions<T>): XRequest<T> {
  const { baseURL, model, dangerouslyApiKey, fetchOptions, streamOptions } = options;

  return async (params, callbacks) => {
    const { onSuccess, onError, onUpdate } = callbacks;
    try {
      if (!baseURL) throw new Error('options.baseURL is required!');

      const res = await xFetch(baseURL, {
        method: 'POST',
        body: JSON.stringify({
          model,
          ...params,
        }),
        ...fetchOptions,
        headers: {
          ...DEFAULT_HEADERS,
          ...(dangerouslyApiKey && {
            Authorization: dangerouslyApiKey,
          }),
          ...fetchOptions?.headers,
        },
      });

      const isStream = res.headers.get('Content-Type')?.includes('stream');

      let message: T;

      if (isStream) {
        for await (const chunk of xStream({
          readableStream: res.body!,
          transformStream: streamOptions?.transformStream,
        })) {
          onUpdate?.(chunk);
          message = chunk;
        }
      } else {
        message = await res.json();
        onUpdate?.(message);
      }

      onSuccess?.(message!);
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error('Unknown error!'));
    }
  };
}
