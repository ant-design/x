import xStream from '../x-stream';
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

interface XRequestMessage extends AnyObject {
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

export interface XRequestCallbacks<Output> {
  /**
   * @description Callback when the request is successful
   */
  onSuccess: (chunks: Output[]) => void;

  /**
   * @description Callback when the request fails
   */
  onError: (error: Error) => void;

  /**
   * @description Callback when the request is updated
   */
  onUpdate: (chunk: Output) => void;
}

export type XRequestFunction<Input = AnyObject, Output = SSEOutput> = (
  params: XRequestParams & Input,
  callbacks: XRequestCallbacks<Output>,
  transformStream?: XStreamOptions<Output>['transformStream'],
) => Promise<void>;

class XRequest {
  readonly baseURL;
  readonly model;

  private defaultHeaders;
  private customOptions;

  private static instanceBuffer: Map<string, XRequest> = new Map();

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

  public static init(options: XRequestOptions): XRequest {
    const id = options.baseURL;

    if (!id || typeof id !== 'string') throw new Error('The baseURL is not valid!');

    if (!XRequest.instanceBuffer.has(id)) {
      XRequest.instanceBuffer.set(id, new XRequest(options));
    }

    return XRequest.instanceBuffer.get(id) as XRequest;
  }

  public create = async <Input = AnyObject, Output = SSEOutput>(
    params: XRequestParams & Input,
    callbacks?: XRequestCallbacks<Output>,
    transformStream?: XStreamOptions<Output>['transformStream'],
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

      const chunks: Output[] = [];

      if (contentType.includes('text/event-stream')) {
        for await (const chunk of xStream({
          readableStream: response.body!,
          transformStream,
        })) {
          chunks.push(chunk);

          onUpdate?.(chunk);
        }
      } else if (contentType.includes('application/json')) {
        const chunk: Output = await response.json();

        chunks.push(chunk);

        onUpdate?.(chunk);
      } else {
        throw new Error(`The response content-type: ${contentType} is not support!`);
      }

      onSuccess?.(chunks);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error!');

      onError?.(err);

      throw err;
    }
  };
}

const xRequest = XRequest.init;

export default xRequest;