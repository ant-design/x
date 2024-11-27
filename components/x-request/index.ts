import XStream from '../x-stream';
import xFetch from './x-fetch';

import type { SSEOutput, XStreamOptions } from '../x-stream';
import type { XFetchOptions } from './x-fetch';

import type { AnyObject } from '../_util/type';

export interface XRequestBaseOptions {
  /**
   * @description Base URL, e.g., 'https://api.example.com/v1/chat'
   */
  baseURL: string;

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
}

interface XRequestCustomOptions {
  /**
   * @description Custom fetch
   */
  fetch?: XFetchOptions['fetch'];
}

export type XRequestOptions = XRequestBaseOptions & XRequestCustomOptions;

type XRequestMessageContent = string | AnyObject;

export interface XRequestMessage extends AnyObject {
  role?: string;
  content?: XRequestMessageContent;
}

/**
 * Compatible with the parameters of OpenAI's chat.completions.create,
 * with plans to support more parameters and adapters in the future
 */
export interface XRequestParams {
  /**
   * @description Model name, e.g., 'gpt-3.5-turbo'
   * @default XRequestOptions.model
   */
  model?: string;

  /**
   * @description Indicates whether to use streaming for the response
   */
  stream?: boolean;

  /**
   * @description The messages to be sent to the model
   */
  messages?: XRequestMessage[];
}

export interface XRequestCallbacks {
  /**
   * @description Callback when the request is successful
   */
  onSuccess: (chunk: SSEOutput, chunks?: SSEOutput[]) => void;

  /**
   * @description Callback when the request fails
   */
  onError: (error: Error) => void;

  /**
   * @description Callback when the request is updated
   */
  onUpdate: (chunk: SSEOutput, chunks?: SSEOutput[]) => void;
}

export type XRequestCreate<Params extends XRequestParams = AnyObject> = (
  params: Params,
  callbacks?: XRequestCallbacks,
  transformStream?: XStreamOptions<SSEOutput>['transformStream'],
) => Promise<void>;

export type XRequestFunction<Params extends XRequestParams = AnyObject> = (
  params: Params,
  callbacks: XRequestCallbacks,
) => Promise<void>;

class XRequestClass<Params extends XRequestParams = AnyObject> {
  readonly baseURL;
  readonly model;

  private defaultHeaders;
  private customOptions;

  private static instanceBuffer = new Map();

  private constructor(options: XRequestOptions) {
    const { baseURL, model, dangerouslyApiKey, ...customOptions } = options;

    this.baseURL = options.baseURL;
    this.model = options.model;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...(options.dangerouslyApiKey && {
        Authorization: options.dangerouslyApiKey,
      }),
    };
    this.customOptions = customOptions;
  }

  public static init<P extends XRequestParams = AnyObject>(
    options: XRequestOptions,
  ): XRequestClass<P> {
    const id = options.baseURL;

    if (!id || typeof id !== 'string') throw new Error('The baseURL is not valid!');

    if (!XRequestClass.instanceBuffer.has(id)) {
      XRequestClass.instanceBuffer.set(id, new XRequestClass<P>(options));
    }

    return XRequestClass.instanceBuffer.get(id);
  }

  public create = async (
    params: Params,
    callbacks?: XRequestCallbacks,
    transformStream?: XStreamOptions<SSEOutput>['transformStream'],
  ) => {
    const { onSuccess, onError, onUpdate } = callbacks || {};

    const requestInit = {
      method: 'POST',
      body: JSON.stringify({
        model: this.model,
        ...params,
      }),
      headers: this.defaultHeaders,
    };

    try {
      const response = await xFetch(this.baseURL, {
        fetch: this.customOptions.fetch,
        ...requestInit,
      });

      const contentType = response.headers.get('content-type') || '';

      const chunks: SSEOutput[] = [];
      let deltaChunk: SSEOutput;

      if (contentType.includes('text/event-stream')) {
        for await (const chunk of XStream({
          readableStream: response.body!,
          transformStream,
        })) {
          chunks.push(chunk);

          deltaChunk = this.delta(chunks);

          onUpdate?.(deltaChunk, chunks);
        }
      } else if (contentType.includes('application/json')) {
        const chunk: SSEOutput = await response.json();

        chunks.push(chunk);

        deltaChunk = chunk;

        onUpdate?.(deltaChunk, chunks);
      } else {
        throw new Error(`The response content-type: ${contentType} is not support!`);
      }

      onSuccess?.(deltaChunk!, chunks);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error!');

      onError?.(err);

      throw err;
    }
  };

  public deltaContentRegex = new RegExp(
    /"delta":\s*\{[^}]*?"content"\s*:\s*"([^"\\]*(\\.[^"\\]*)*)"/s,
  );

  private delta = (chunks: SSEOutput[]): SSEOutput => {
    let deltaContent = '';

    for (const chunk of chunks) {
      const match = this.deltaContentRegex.exec(chunk.data);
      if (match?.[1]) {
        deltaContent += match[1];
      }
    }

    const lastChunk = chunks[chunks.length - 1];

    const lastChunkContentMatch = this.deltaContentRegex.exec(lastChunk.data) || [];

    return {
      ...lastChunk,
      data: lastChunk.data.replace(lastChunkContentMatch[1], deltaContent),
    };
  };
}

const XRequest = XRequestClass.init;

export default XRequest;
