import { AnyObject } from '../../_util/type';

export interface XModelMessage extends AnyObject {
  role: string;
  content:
    | string
    | {
        text: string;
        type: string;
      };
}

export interface XModelParams extends AnyObject {
  model?: string;
  messages?: XModelMessage[];
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
      approximate?: {
        city?: string;
        country?: string;
        region?: string;
        timezone?: string;
      };
    };
  };
}

export interface XModelResponse {
  choices: {
    index: number;
    message: {
      role: string;
      content: string | null;
      reasoning_content: string | null;
      refusal: string | null;
      annotations: {
        type: 'url_citation';
        end_index: number;
        start_index: number;
        url: string;
        title: string;
      }[];
    };
    logprobs: AnyObject | null;
    finish_reason: 'stop' | 'length' | 'content_filter' | 'tool_calls' | string;
  }[];
  created: number;
  id: string;
  model: string;
  object: 'chat.completion' | 'chat.completion.chunk';
  service_tier: string | null;
  system_fingerprint: string | null;
  usage: {
    completion_tokens: number;
    prompt_tokens: number;
    total_tokens: number;
    completion_tokens_details: {
      reasoning_tokens: number;
      audio_tokens: number;
      accepted_prediction_tokens: number;
      rejected_prediction_tokens: number;
    };
    prompt_tokens_details: {
      cached_tokens: number;
      audio_tokens: number;
    };
  };
}
