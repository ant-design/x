export interface XFetchMiddlewares {
  onRequest?: (
    request: Request,
    info: {
      baseURL: string;
      init?: RequestInit;
    },
  ) => Promise<Request>;
  onResponse?: (response: Response) => Promise<Response>;
}

export interface XFetchOptions extends RequestInit {
  /**
   * @description A typeof fetch function
   * @default globalThis.fetch
   */
  fetch?: typeof fetch;
  /**
   * @description Middleware for request and response
   */
  middlewares?: XFetchMiddlewares;
}

type XFetch = (baseURL: string, options?: XFetchOptions) => Promise<Response>;

const xFetch: XFetch = async (baseURL, options = {}) => {
  const { fetch: fetchFn = globalThis.fetch, middlewares = {}, ...requestInit } = options;

  if (typeof fetchFn !== 'function') {
    throw new Error('The options.fetch must be a typeof fetch function!');
  }

  /** ---------------------- request init ---------------------- */
  let request = new Request(baseURL, requestInit);

  /** ---------------------- request middleware ---------------------- */
  if (typeof middlewares.onRequest === 'function') {
    const modifiedRequest = await middlewares.onRequest(request, {
      baseURL,
      init: requestInit,
    });

    if (!(modifiedRequest instanceof Request)) {
      throw new Error('The options.onRequest must return a Request instance!');
    }

    request = modifiedRequest;
  }

  /** ---------------------- fetch ---------------------- */
  let response = await fetchFn(request);

  /** ---------------------- response middleware ---------------------- */
  if (typeof middlewares.onResponse === 'function') {
    const modifiedResponse = await middlewares.onResponse(response);

    if (!(modifiedResponse instanceof Response)) {
      throw new Error('The options.onResponse must return a Response instance!');
    }

    response = modifiedResponse;
  }

  /** ---------------------- response check ---------------------- */
  if (!response.ok) {
    throw new Error(`Fetch failed with status ${response.status}`);
  }

  if (!response.body) {
    throw new Error('The response body is empty.');
  }

  /** ---------------------- return ---------------------- */
  return response;
};

export default xFetch;
