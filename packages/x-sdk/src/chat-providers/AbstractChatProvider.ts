import type { MessageStatus, SimpleType } from '../x-chat';
import type { AbstractXRequestClass, XRequestCallbacks, XRequestOptions } from '../x-request';

export interface ChatProviderConfig<Input, Output, ChatMessage extends SimpleType = any> {
  request:
    | AbstractXRequestClass<Input, Output, ChatMessage>
    | (() => AbstractXRequestClass<Input, Output, ChatMessage>);
}

export interface TransformMessage<ChatMessage extends SimpleType, Output> {
  originMessage?: ChatMessage;
  chunk: Output;
  chunks: Output[];
  status: MessageStatus;
  responseHeaders: Headers;
}

export default abstract class AbstractChatProvider<ChatMessage extends SimpleType, Input, Output> {
  private _request!: AbstractXRequestClass<Input, Output, ChatMessage>;
  private _getMessagesFn!: () => ChatMessage[];
  private _originalCallbacks?: XRequestCallbacks<Output, ChatMessage>;

  public get request() {
    return this._request;
  }

  constructor(config: ChatProviderConfig<Input, Output, ChatMessage>) {
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
    options: XRequestOptions<Input, Output, ChatMessage>,
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
    onUpdate: (data: Output, responseHeaders: Headers) => any;
    onSuccess: (data: Output[], responseHeaders: Headers) => any;
    onError: (error: any, errorInfo?: any) => any;
  }) {
    const originalOnUpdate = this._originalCallbacks?.onUpdate;
    const originalOnSuccess = this._originalCallbacks?.onSuccess;
    const originalOnError = this._originalCallbacks?.onError;
    this._request.options.callbacks = {
      onUpdate: (data: Output, responseHeaders: Headers) => {
        const msg = onUpdate(data, responseHeaders);
        if (originalOnUpdate) originalOnUpdate(data, responseHeaders, msg);
      },
      onSuccess: (data: Output[], responseHeaders: Headers) => {
        const msg = onSuccess(data, responseHeaders);
        if (originalOnSuccess) originalOnSuccess(data, responseHeaders, msg);
      },
      onError: (error, errorInfo, responseHeaders) => {
        const fallbackMsg = onError(error, errorInfo);
        if (originalOnError) originalOnError(error, errorInfo, responseHeaders, fallbackMsg);
      },
    } as XRequestCallbacks<Output, any>;
  }
}
