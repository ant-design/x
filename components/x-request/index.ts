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

class XRequestClass {
  readonly baseURL;
  readonly model;

  private defaultHeaders;
  private customOptions;

  private static instanceBuffer: Map<string | typeof fetch, XRequestClass> = new Map();

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

  public static init(options: XRequestOptions): XRequestClass {
    if (!options.baseURL || typeof options.baseURL !== 'string')
      throw new Error('The baseURL is not valid!');

    const id = options.fetch || options.baseURL;

    if (!XRequestClass.instanceBuffer.has(id)) {
      XRequestClass.instanceBuffer.set(id, new XRequestClass(options));
    }

    return XRequestClass.instanceBuffer.get(id) as XRequestClass;
  }

  public create = async <Input = AnyObject, Output = SSEOutput>(
    params: XRequestParams & Input,
    callbacks?: XRequestCallbacks<Output>,
    transformStream?: XStreamOptions<Output>['transformStream'],
  ) => {
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

      if (transformStream) {
        await this.customResponseHandler<Output>(response, callbacks, transformStream);
        return;
      }

      const contentType = response.headers.get('content-type') || '';

      const mimeType = contentType.split(';')[0].trim();

      switch (mimeType) {
        /** SSE */
        case 'text/event-stream':
          await this.sseResponseHandler<Output>(response, callbacks);
          break;

        /** JSON */
        case 'application/json':
          await this.jsonResponseHandler<Output>(response, callbacks);
          break;

        default:
          throw new Error(`The response content-type: ${contentType} is not support!`);
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error!');

      callbacks?.onError?.(err);

      throw err;
    }
  };

  private customResponseHandler = async <Output = SSEOutput>(
    response: Response,
    callbacks?: XRequestCallbacks<Output>,
    transformStream?: XStreamOptions<Output>['transformStream'],
  ) => {
    const chunks: Output[] = [];

    for await (const chunk of XStream({
      readableStream: response.body!,
      transformStream,
    })) {
      chunks.push(chunk);

      callbacks?.onUpdate?.(chunk);
    }

    callbacks?.onSuccess?.(chunks);
  };

  private sseResponseHandler = async <Output = SSEOutput>(
    response: Response,
    callbacks?: XRequestCallbacks<Output>,
  ) => {
    const chunks: Output[] = [];

    for await (const chunk of XStream<Output>({
      readableStream: response.body!,
    })) {
      chunks.push(chunk);

      callbacks?.onUpdate?.(chunk);
    }
    callbacks?.onSuccess?.(chunks);
  };

  private jsonResponseHandler = async <Output = SSEOutput>(
    response: Response,
    callbacks?: XRequestCallbacks<Output>,
  ) => {
    const chunk: Output = await response.json();

    callbacks?.onUpdate?.(chunk);

    callbacks?.onSuccess?.([chunk]);
  };
}

const XRequest = XRequestClass.init;

export default XRequest;
