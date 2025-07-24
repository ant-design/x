import { XModelMessage, XModelParams, XModelResponse } from '../../x-model';
import { XRequestOptions } from '../../x-request';
import { SSEFields } from '../../x-stream';
import AbstractChatProvider, { ChatProviderConfig, TransformMessage } from './AbstractChatProvider';

/**
 * LLM OpenAI Compatible Chat Provider
 * @template ChatMessage 消息类型
 * @template Input 请求参数类型
 * @template Output 响应数据类型
 */
export default class OpenAIChatProvider<
  ChatMessage = XModelMessage,
  Input = XModelParams,
  Output = Partial<Record<SSEFields, XModelResponse>>,
> extends AbstractChatProvider<ChatMessage, Input, Output> {
  constructor(config: ChatProviderConfig<Input, Output>) {
    super(config);
  }

  transformParams(
    requestParams: ChatMessage & Partial<Input>,
    options: XRequestOptions<Input, Output>,
  ): Input {
    let message: ChatMessage;
    const otherRequestParams = {};

    if (typeof requestParams === 'string') {
      message = {
        role: 'user',
        content: requestParams,
      } as ChatMessage;
    } else {
      message = requestParams as ChatMessage;
    }
    const messages = this.getMessages();
    messages.push(message);
    return {
      ...(options?.params || {}),
      ...otherRequestParams,
      messages,
    } as Input;
  }

  transformMessage(info: TransformMessage<ChatMessage, Output>): ChatMessage {
    const { chunk, chunks, originMessage } = info;

    if (chunk) {
      return chunk as unknown as ChatMessage;
    }

    if (Array.isArray(chunks)) {
      const chunk = chunks?.length > 0 ? chunks?.[chunks?.length - 1] : undefined;
      return originMessage ? originMessage : (chunk as unknown as ChatMessage);
    }

    return chunks as unknown as ChatMessage;
  }
}
