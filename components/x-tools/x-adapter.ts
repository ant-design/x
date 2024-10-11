import type { XFetchMiddlewares, XFetchOptions } from './x-fetch';

interface XAdapterOptions {
  /**
   * @description Model name, e.g., 'gpt-3.5-turbo'
   */
  model: string;

  /**
   * @description Whether to enable streaming response, optional parameter
   */
  stream?: boolean;

  /**
   * @description API key (🔥 dangerous!), for debugging or development only; avoid using in production
   */
  dangerouslyApiKey?: string;

  /**
   * @description Initial request configuration
   */
  requestInit?: XFetchOptions;
}

/**
 * @description Defines the XAdapter class that implements XAdapterOptions.
 */
export default class XAdapter implements XAdapterOptions {
  readonly model;
  readonly stream;
  readonly dangerouslyApiKey;
  readonly requestInit;

  /**
   * @description Request middleware for xFetch {@link XFetchMiddlewares.onRequest}
   */
  public onRequest?: XFetchMiddlewares['onRequest'];

  /**
   * @description Response middleware for xFetch {@link XFetchMiddlewares.onResponse}
   */
  public onResponse?: XFetchMiddlewares['onResponse'];

  /**
   * @description Getter for the xFetch options
   * @example
   * ```ts
   * import { xFetch, XAdapter } from '@ant-design/x';
   *
   * const adapter = new XAdapter({
   *  // ... config
   * });
   *
   * xFetch(baseURL, adapter.fetchOptions);
   * ```
   */
  public get fetchOptions(): XFetchOptions {
    return {
      ...this.requestInit,
      middlewares: {
        onRequest: this.onRequest || this.requestInit?.middlewares?.onRequest,
        onResponse: this.onResponse || this.requestInit?.middlewares?.onResponse,
      },
    };
  }

  constructor(options: XAdapterOptions) {
    this.model = options.model;
    this.stream = options.stream;
    this.dangerouslyApiKey = options.dangerouslyApiKey;
    this.requestInit = options.requestInit || {};
  }
}
