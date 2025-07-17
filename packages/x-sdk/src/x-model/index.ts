import { AnyObject } from '../_util/type';
import XRequest, { XRequestOptions } from '../x-request';

export type XRequestMessageContent = string | AnyObject;
export interface XModelMessage extends AnyObject {
  role?: string;
  content?: XRequestMessageContent;
}

export interface XModelParams extends AnyObject {
  model: string;
  messages: XModelMessage[];

  frequency_penalty?: number;
  logit_bias?: AnyObject;
  logprobs?: boolean;
  max_completion_tokens?: number;
  metadata?: AnyObject;
  modalities?: string[];
  n?: number;
  parallel_tool_calls?: boolean;
  prediction?: {
    content: string;
    type: string;
  };
  presence_penalty?: number;
  reasoning_effort?: string;
  response_format?:
    | 'text'
    | {
        type: 'json_object';
      }
    | {
        type: 'json_schema';
        json_schema: {
          name: string;
          description?: string;
          schema?: AnyObject;
          strict?: boolean;
        };
      };
  seed?: number;
  service_tier?: string;
  stop?: string | string[];
  store?: boolean;
  stream?: boolean;
  stream_options?: {
    include_usage?: boolean;
  };
  temperature?: number;
  tool_choice?:
    | string
    | {
        type: 'function';
        function: {
          name: string;
        };
      };
  // tools?: XModelTool[];
  top_logprobs?: number;
  top_p?: number;
  user?: string;
  web_search_options?: {
    search_context_size?: string;
    user_location?: {
      type: 'approximate';
      approximate: {
        city?: string;
        country?: string;
        region?: string;
        timezone?: string;
      };
    };
  };
}

function XModel(baseURL: string, params: XModelParams, options?: XRequestOptions) {
  return XRequest(baseURL, {
    params,
    ...options,
  });
}

export default XModel;
