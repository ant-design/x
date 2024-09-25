import React from 'react';
import request_GPT_3_5_Turbo from './presets/gpt-3.5-turbo';

export type RequestFn<Message = any> = (
  info: {
    message: Message;
    messages: Message[];
    onUpdate: (message: Message) => void;
    onSuccess: (message: Message) => void;
    onError: (error: Error) => void;
  } & Partial<XAgentConfigPreset>,
) => void | Promise<Message>;

export interface XAgentConfigPreset {
  baseURL: string;
  key: string;
  model: 'gpt-3.5-turbo'; // Only provide preset model not string type
}
export interface XAgentConfigCustom<Message> {
  request: RequestFn<Message>;
}

export type XAgentConfig<Message> = XAgentConfigPreset | XAgentConfigCustom<Message>;
export type MergedXAgentConfig<Message> = Partial<XAgentConfigPreset> & XAgentConfigCustom<Message>;

/** This is a wrap class to avoid developer can get too much on origin object */
export class XAgent<Message> {
  config: MergedXAgentConfig<Message>;

  constructor(config: MergedXAgentConfig<Message>) {
    this.config = config;
  }

  public request = (
    info: { message: Message; messages: Message[] },
    callbacks: {
      onUpdate: (message: Message) => void;
      onSuccess: (message: Message) => void;
      onError: (error: Error) => void;
    },
  ) => {
    const { request, baseURL, key, model } = this.config;
    const { onUpdate, onSuccess, onError } = callbacks;

    let finished = false;

    request({
      baseURL,
      key,
      model,
      ...info,

      // Status should be unique.
      // One get success or error should not get more message
      onUpdate(message) {
        if (!finished) {
          onUpdate(message);
        }
      },
      onSuccess(message) {
        if (!finished) {
          finished = true;
          onSuccess(message);
        }
      },
      onError(error) {
        if (!finished) {
          finished = true;
          onError(error);
        }
      },
    });
  };
}

export default function useXAgent<Message>(config: XAgentConfig<Message>) {
  return React.useMemo(() => {
    let customConfig: MergedXAgentConfig<Message>;

    if ('request' in config) {
      customConfig = config;
    } else {
      switch (config.model) {
        case 'gpt-3.5-turbo':
          customConfig = {
            ...config,
            request: request_GPT_3_5_Turbo,
          };
      }
    }

    return new XAgent<Message>(customConfig);
  }, []);
}
