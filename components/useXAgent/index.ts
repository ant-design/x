import React from 'react';
import request_GPT_3_5_Turbo from './presets/gpt-3.5-turbo';

export type RequestFn<Message = any> = (
  info: {
    message: Message;
    messages: Message[];
  } & Partial<XAgentConfigPreset>,
  callbacks: {
    onUpdate: (message: Message) => void;
    onSuccess: (message: Message) => void;
    onError: (error: Error) => void;
  },
) => void;

export interface XAgentConfigPreset {
  baseURL: string;
  key: string;
  model: 'todo'; // Only provide preset model not string type
}
export interface XAgentConfigCustom<Message> {
  request: RequestFn<Message>;
}

export type XAgentConfig<Message> = XAgentConfigPreset | XAgentConfigCustom<Message>;
export type MergedXAgentConfig<Message> = Partial<XAgentConfigPreset> & XAgentConfigCustom<Message>;

let uuid = 0;

/** This is a wrap class to avoid developer can get too much on origin object */
export class XAgent<Message = string> {
  config: MergedXAgentConfig<Message>;

  private requestingMap: Record<number, boolean> = {};

  constructor(config: MergedXAgentConfig<Message>) {
    this.config = config;
  }

  private finishRequest(id: number) {
    delete this.requestingMap[id];
  }

  public request(
    info: { message: Message; messages?: Message[] },
    callbacks: {
      onUpdate: (message: Message) => void;
      onSuccess: (message: Message) => void;
      onError: (error: Error) => void;
    },
  ) {
    const { request, baseURL, key, model } = this.config;
    const { onUpdate, onSuccess, onError } = callbacks;

    const id = uuid;
    uuid += 1;
    this.requestingMap[id] = true;

    request(
      {
        baseURL,
        key,
        model,
        ...info,
        messages: info.messages || [],
      },
      {
        // Status should be unique.
        // One get success or error should not get more message
        onUpdate: (message) => {
          if (this.requestingMap[id]) {
            onUpdate(message);
          }
        },
        onSuccess: (message) => {
          if (this.requestingMap[id]) {
            onSuccess(message);
            this.finishRequest(id);
          }
        },
        onError: (error) => {
          if (this.requestingMap[id]) {
            onError(error);
            this.finishRequest(id);
          }
        },
      },
    );
  }

  public isRequesting() {
    return Object.keys(this.requestingMap).length > 0;
  }
}

export default function useXAgent<Message = string>(config: XAgentConfig<Message>) {
  return React.useMemo(() => {
    let customConfig: MergedXAgentConfig<Message>;

    if ('request' in config) {
      customConfig = config;
    } else {
      switch (config.model) {
        case 'todo':
          customConfig = {
            ...config,
            request: request_GPT_3_5_Turbo,
          };
      }
    }

    return [new XAgent<Message>(customConfig)] as const;
  }, []);
}
