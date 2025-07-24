import { XRequestOptions } from '../../x-request';
import AbstractChatProvider, { ChatProviderConfig, TransformMessage } from './AbstractChatProvider';

export default class DefaultChatProvider<ChatMessage, Input, Output> extends AbstractChatProvider<
  ChatMessage,
  Input,
  Output
> {
  constructor(config: ChatProviderConfig<Input, Output>) {
    super(config);
  }

  transformParams(
    requestParams: ChatMessage & Partial<Input>,
    options: XRequestOptions<Input, Output>,
  ): Input {
    if (typeof requestParams !== 'object') {
      throw new Error('requestParams must be an object');
    }
    return {
      ...(options?.params || {}),
      ...(requestParams || {}),
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
