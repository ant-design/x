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
    return {
      ...(options?.params || {}),
      ...requestParams,
      messages: this.getMessages(),
    } as unknown as Input;
  }

  transformLocalMessage(requestParams: Partial<Input>): ChatMessage {
    const lastMessage = requestParams?.messages?.[requestParams?.messages?.length - 1];
    return lastMessage as unknown as ChatMessage;
  }

  transformMessage(info: TransformMessage<ChatMessage, Output>): ChatMessage {
    const { originMessage, chunk } = info;
    let currentContent = '';
    let role = 'assistant';
    try {
      if (chunk && chunk.data !== '[DONE]') {
        const message = JSON.parse(chunk.data);
        message?.choices?.forEach((choice: any) => {
          if (choice?.delta) {
            currentContent += choice.delta.content || '';
            role = choice.delta.role || 'assistant';
          } else if (choice?.message) {
            currentContent += choice.message.content || '';
            role = choice.message.role || 'assistant';
          }
        });
      }
    } catch (error) {
      console.error(error);
    }

    const content = `${originMessage?.content || ''}${currentContent}`;

    return {
      content,
      role,
    } as ChatMessage;
  }
}
