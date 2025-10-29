import { AnyObject } from '../../_util/type';
import { AbstractXRequestClass, XRequestCallbacks, XRequestOptions } from '../../x-request';
import { MessageStatus } from '..';

export interface ChatProviderConfig<Input, Output> extends AnyObject {
  request: AbstractXRequestClass<Input, Output> | (() => AbstractXRequestClass<Input, Output>);
}

export interface TransformMessage<ChatMessage, Output> {
  originMessage?: ChatMessage;
  chunk: Output;
  chunks: Output[];
  status: MessageStatus;
  responseHeaders: Headers;
}

export default abstract class AbstractChatProvider<ChatMessage, Input, Output> {
  private _request!: AbstractXRequestClass<Input, Output>;
  private _getMessagesFn!: () => ChatMessage[];
  private _originalCallbacks?: XRequestCallbacks<Output>;

  public get request() {
    return this._request;
  }

  constructor(config: ChatProviderConfig<Input, Output>) {
    const request = typeof config.request === 'function' ? config.request() : config.request;
    if (!request.manual) {
      throw new Error('request must be manual');
    }
    this._request = request;
    this._originalCallbacks = this._request.options?.callbacks;
  }

  /**
   * 转换onRequest传入的参数，你可以和Provider实例化时request配置中的params进行合并或者额外处理
   * @param requestParams 请求参数
   * @param options 请求配置，从Provider实例化时request配置中来
   */
  abstract transformParams(
    requestParams: Partial<Input>,
    options: XRequestOptions<Input, Output>,
  ): Input;

  /**
   * 将onRequest传入的参数转换为本地（用户发送）的ChatMessage，用于消息渲染
   * @param requestParams onRequest传入的参数
   */
  abstract transformLocalMessage(requestParams: Partial<Input>): ChatMessage | ChatMessage[];

  /**
   * 可在更新返回数据时对messages做转换，同时会更新到messages
   * @param info
   */
  abstract transformMessage(info: TransformMessage<ChatMessage, Output>): ChatMessage;

  getMessages(): ChatMessage[] {
    return this?._getMessagesFn();
  }

  injectGetMessages(getMessages: () => ChatMessage[]) {
    this._getMessagesFn = getMessages;
  }

  injectRequest({
    onUpdate,
    onSuccess,
    onError,
  }: {
    onUpdate: (data: Output, responseHeaders: Headers) => void;
    onSuccess: (data: Output[], responseHeaders: Headers) => void;
    onError: (error: any) => void;
  }) {
    const originalOnUpdate = this._originalCallbacks?.onUpdate;
    const originalOnSuccess = this._originalCallbacks?.onSuccess;
    const originalOnError = this._originalCallbacks?.onError;
    this._request.options.callbacks = {
      onUpdate: (data: Output, responseHeaders: Headers) => {
        onUpdate(data, responseHeaders);
        if (originalOnUpdate) originalOnUpdate(data, responseHeaders);
      },
      onSuccess: (data: Output[], responseHeaders: Headers) => {
        onSuccess(data, responseHeaders);
        if (originalOnSuccess) originalOnSuccess(data, responseHeaders);
      },
      onError: (error) => {
        onError(error);
        if (originalOnError) originalOnError(error);
      },
    } as XRequestCallbacks<Output>;
  }
}
