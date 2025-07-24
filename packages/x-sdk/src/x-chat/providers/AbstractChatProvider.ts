import { XRequestCallbacks, XRequestClass, XRequestOptions } from '../../x-request';
import { MessageStatus } from '..';

export interface ChatProviderConfig<Input, Output> {
  request: XRequestClass<Input, Output> | (() => XRequestClass<Input, Output>);
}

export interface TransformMessage<ChatMessage, Output> {
  originMessage?: ChatMessage;
  chunk: Output;
  chunks: Output[];
  status: MessageStatus;
}

export default abstract class AbstractChatProvider<ChatMessage, Input, Output> {
  private _request!: XRequestClass<Input, Output>;

  public get request() {
    return this._request;
  }

  constructor(config: ChatProviderConfig<Input, Output>) {
    const request = typeof config.request === 'function' ? config.request() : config.request;
    if (!request.manual) {
      throw new Error('request must be manual');
    }
    this._request = request;
  }

  abstract transformParams(
    requestParams: ChatMessage & Partial<Input>,
    options: XRequestOptions<Input, Output>,
  ): Input;

  abstract transformMessage(info: TransformMessage<ChatMessage, Output>): ChatMessage;

  getMessages(): ChatMessage[] {
    return [];
  }

  inspectRequest({
    onUpdate,
    onSuccess,
    onError,
  }: {
    onUpdate: (data: Output) => void;
    onSuccess: (data: Output[]) => void;
    onError: (error: any) => void;
  }) {
    const originalOnUpdate = this._request.options.callbacks?.onUpdate;
    const originalOnSuccess = this._request.options.callbacks?.onSuccess;
    const originalOnError = this._request.options.callbacks?.onError;
    this._request.options.callbacks = {
      onUpdate: (data: Output) => {
        onUpdate(data);
        if (originalOnUpdate) originalOnUpdate(data);
      },
      onSuccess: (data) => {
        onSuccess(data);
        if (originalOnSuccess) originalOnSuccess(data);
      },
      onError: (error) => {
        onError(error);
        if (originalOnError) originalOnError(error);
      },
    } as XRequestCallbacks<Output>;
  }
}
