import { AnyObject } from '../_util/type';
import XRequest, { XRequestOptions } from '../x-request';

export interface XMCPTool {
  name: string;
  description?: string;
  inputSchema: {
    type: 'object';
    properties: AnyObject;
  };
  annotations?: {
    title?: string;
    readOnlyHint?: boolean;
    destructiveHint?: boolean;
    idempotentHint?: boolean;
    openWorldHint?: boolean;
  };
}

export type XMCPClientOptions = Pick<XRequestOptions, 'params' | 'headers' | 'timeout' | 'fetch'>;

class XMCPClientClass {
  readonly baseURL: string;
  private options: XMCPClientOptions | undefined;

  constructor(baseURL: string, options?: XMCPClientOptions) {
    if (!baseURL || typeof baseURL !== 'string') throw new Error('The baseURL is not valid!');
    this.baseURL = baseURL;
    this.options = options;
  }

  async tools(): Promise<XMCPTool[]> {
    return new Promise((resolve, reject) => {
      XRequest(this.baseURL, {
        ...this.options,
        callbacks: {
          onSuccess(chunks) {
            resolve(chunks[0] as XMCPTool[]);
          },
          onError: (error: Error): void => {
            reject(error);
          },
        },
      });
    });
  }
}

function XMCPClient(baseURL: string, options?: XMCPClientOptions) {
  return new XMCPClientClass(baseURL, options);
}

export default XMCPClient;
