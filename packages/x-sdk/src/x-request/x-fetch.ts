import { XRequestOptions } from '.';

export interface XFetchMiddlewares<Input, Output> {
  onRequest?: (
    baseURL: Parameters<typeof fetch>[0],
    options: XRequestOptions<Input, Output>,
  ) => Promise<[Parameters<typeof fetch>[0], XRequestOptions<Input, Output>]>;
  onResponse?: (response: Response) => Promise<Response>;
}

export type XFetchType<Input, Output> = (
  baseURL: Parameters<typeof fetch>[0],
  options?: XRequestOptions<Input, Output>,
) => Promise<Response>;

const XFetch = async <Input, Output>(
  baseURL: Parameters<typeof fetch>[0],
  options: XRequestOptions<Input, Output>,
) => {
  const { fetch: fetchFn = globalThis.fetch, middlewares = {}, ...requestInit } = options;

  if (typeof fetchFn !== 'function') {
    throw new Error('The options.fetch must be a typeof fetch function!');
  }

  /** ---------------------- request init ---------------------- */
  let fetchArgs: [Parameters<typeof fetch>[0], XRequestOptions<Input, Output>] = [
    baseURL,
    requestInit,
  ];

  /** ---------------------- request middleware ---------------------- */
  if (typeof middlewares.onRequest === 'function') {
    const modifiedFetchArgs = await middlewares.onRequest(...fetchArgs);

    fetchArgs = modifiedFetchArgs;
  }

  /** ---------------------- fetch ---------------------- */
  let response = await fetchFn(...fetchArgs);

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

export default XFetch;
