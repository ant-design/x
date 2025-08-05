import { XModelMessage, XModelParams } from '../../x-model';
import { XRequestOptions } from '../../x-request';
import { SSEFields } from '../../x-stream';
import AbstractChatProvider, { TransformMessage } from './AbstractChatProvider';

/**
 * LLM OpenAI Compatible Chat Provider
 * @template ChatMessage 消息类型
 * @template Input 请求参数类型
 * @template Output 响应数据类型
 */
export default class OpenAIChatProvider<
  ChatMessage extends XModelMessage = XModelMessage,
  Input extends XModelParams = XModelParams,
  Output extends Partial<Record<SSEFields, any>> = Partial<Record<SSEFields, any>>,
> extends AbstractChatProvider<ChatMessage, Input, Output> {
  transformParams(requestParams: Partial<Input>, options: XRequestOptions<Input, Output>): Input {
    let message: ChatMessage;
    const otherRequestParams = {};

    if (typeof requestParams === 'string') {
      message = {
        role: 'user',
        content: requestParams,
      } as unknown as ChatMessage;
    } else {
      message = requestParams as unknown as ChatMessage;
    }
    const messages = this.getMessages();
    messages.push(message);
    return {
      ...(options?.params || {}),
      ...otherRequestParams,
      messages,
    } as unknown as Input;
  }

  transformLocalMessage(requestParams: Partial<Input>): ChatMessage {
    const lastMessage = requestParams?.messages?.[requestParams?.messages?.length - 1];
    return {
      role: 'user',
      content:
        typeof lastMessage?.content === 'object'
          ? lastMessage?.content?.text
          : lastMessage?.content,
    } as unknown as ChatMessage;
  }

  transformMessage(info: TransformMessage<ChatMessage, Output>): ChatMessage {
    const { originMessage, chunk } = info;
    let currentContent = '';
    try {
      if (chunk && chunk.data !== '[DONE]') {
        const message = JSON.parse(chunk.data);
        currentContent = message?.choices?.[0]?.delta?.content || '';
      }
    } catch (error) {
      console.error(error);
    }

    const content = `${originMessage?.content || ''}${currentContent}`;

    return {
      content: content,
      role: 'assistant',
    } as ChatMessage;
  }
}
