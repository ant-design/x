import React from 'react';
import XRequest from '../x-request';

import { AnyObject } from '../_util/type';

interface RequestFnInfo<Message> extends Partial<XAgentConfigPreset>, AnyObject {
  messages?: Message[];
  message?: Message;
}

export type RequestFn<Message> = (
  info: RequestFnInfo<Message>,
  callbacks: {
    onUpdate: (message: Message) => void;
    onSuccess: (message: Message) => void;
    onError: (error: Error) => void;
  },
) => void;

export interface XAgentConfigPreset {
  baseURL: string;
  key: string;
  model: string;
  dangerouslyApiKey: string;
}
export interface XAgentConfigCustom<Message> {
  request?: RequestFn<Message>;
}

export type XAgentConfig<Message> = Partial<XAgentConfigPreset> & XAgentConfigCustom<Message>;

let uuid = 0;

/** This is a wrap class to avoid developer can get too much on origin object */
export class XAgent<Message = string> {
  config: XAgentConfig<Message>;

  private requestingMap: Record<number, boolean> = {};

  constructor(config: XAgentConfig<Message>) {
    this.config = config;
  }

  private finishRequest(id: number) {
    delete this.requestingMap[id];
  }

  public request: RequestFn<Message> = (info, callbacks) => {
    const { request } = this.config;
    const { onUpdate, onSuccess, onError } = callbacks;

    const id = uuid;
    uuid += 1;
    this.requestingMap[id] = true;

    request?.(info, {
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
    });
  };

  public isRequesting() {
    return Object.keys(this.requestingMap).length > 0;
  }
}

export default function useXAgent<Message = string>(config: XAgentConfig<Message>) {
  const { request, ...restConfig } = config;
  return React.useMemo(
    () =>
      [
        new XAgent<Message>({
          request:
            request! ||
            XRequest({
              baseURL: restConfig.baseURL!,
              model: restConfig.model,
              dangerouslyApiKey: restConfig.dangerouslyApiKey,
            }).create,
          ...restConfig,
        }),
      ] as const,
    [],
  );
}
