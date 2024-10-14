import xFetch from './x-fetch';
import xStream from './x-stream';

import type { XFetchOptions } from './x-fetch';
import type { XStreamOptions } from './x-stream';

import type { AnyObject } from '../_util/type';

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

export enum XAgentEventType {
  LOADING = 'loading',
  MESSAGE = 'message',
  ERROR = 'error',
}

export interface XAgentEventDetail<T> {
  loading?: boolean;
  message?: T;
  error?: Error;
}

type XAgentEvent<T> = CustomEvent<XAgentEventDetail<T>>;

export interface XAgentOptions<T> {
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
export interface XAgentChatParams extends AnyObject {
  /**
   * @description {@link XAgentOptions.model}
   */
  model?: string;

  messages: {
    role?: 'system' | 'user' | 'assistant' | 'tool';
    content?: string;
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

export default class XAgent<T> extends EventTarget implements XAgentOptions<T> {
  readonly baseURL;
  readonly model;
  readonly fetchOptions;
  readonly streamOptions;

  protected _dangerouslyApiKey;

  constructor(baseURL: string, options?: XAgentOptions<T>) {
    super();
    this.baseURL = baseURL;
    this._dangerouslyApiKey = options?.dangerouslyApiKey;
    this.model = options?.model;
    this.fetchOptions = options?.fetchOptions;
    this.streamOptions = options?.streamOptions;
  }

  /**
   * @description Emits a custom event for the agent
   */
  private emit = (type: `${XAgentEventType}`, detail: XAgentEventDetail<T>) => {
    if (typeof detail.loading === 'boolean') {
      this.loading = detail.loading;
    }
    this.dispatchEvent(new CustomEvent(type, { detail }));
  };

  /**
   * @description Registers an event listener for a specific event type
   */
  public on = (
    type: `${XAgentEventType}`,
    callback: (event: XAgentEvent<T>) => void,
    options?: AddEventListenerOptions | boolean,
  ) => {
    this.addEventListener(type, callback as EventListenerOrEventListenerObject, options);
  };

  /**
   * @description Removes an event listener for a specific event type
   */
  public remove = (
    type: `${XAgentEventType}`,
    callback: (event: XAgentEvent<T>) => void,
    options?: EventListenerOptions | boolean,
  ) => {
    this.removeEventListener(type, callback as EventListenerOrEventListenerObject, options);
  };

  /**
   * @description Indicates if the async request is currently loading
   */
  public loading = false;

  /**
   * @description Chat completions
   */
  public chat = async (params: XAgentChatParams) => {
    try {
      this.emit(XAgentEventType.LOADING, { loading: true });

      const res = await xFetch(this.baseURL, {
        method: 'POST',
        body: JSON.stringify({
          model: this.model,
          ...params,
        }),
        ...this.fetchOptions,
        headers: {
          ...DEFAULT_HEADERS,
          ...(this._dangerouslyApiKey && {
            Authorization: this._dangerouslyApiKey,
          }),
          ...this.fetchOptions?.headers,
        },
      });

      const isStream = res.headers.get('Content-Type')?.includes('stream');

      if (isStream) {
        for await (const chunk of xStream({
          readableStream: res.body!,
          transformStream: this.streamOptions?.transformStream,
        })) {
          this.emit(XAgentEventType.MESSAGE, { message: chunk });
        }
      } else {
        this.emit(XAgentEventType.MESSAGE, { message: await res.json() });
      }

      this.emit(XAgentEventType.LOADING, { loading: false });
    } catch (error) {
      this.emit(XAgentEventType.LOADING, { loading: false });

      this.emit(XAgentEventType.ERROR, {
        error: error instanceof Error ? error : new Error('Unknown error!'),
      });
    }
  };
}
