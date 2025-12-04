import { XRequestOptions } from '../x-request';
import { SSEFields } from '../x-stream';
import AbstractChatProvider, { TransformMessage } from './AbstractChatProvider';
import { XModelMessage, XModelParams } from './types/model';

/**
 * DeepSeek Chat Provider
 * @template ChatMessage 消息类型
 * @template Input 请求参数类型
 * @template Output 响应数据类型
 */
export default class DeepSeekChatProvider<
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

  transformLocalMessage(requestParams: Partial<Input>): ChatMessage[] {
    return (requestParams?.messages || []) as ChatMessage[];
  }

  transformMessage(info: TransformMessage<ChatMessage, Output>): ChatMessage {
    const { originMessage, chunk, chunks, responseHeaders } = info;
    let currentContent = '';
    let currentThink = '';
    let role = 'assistant';
    try {
      let message: any;
      if (responseHeaders.get('content-type')?.includes('text/event-stream')) {
        if (chunk && chunk.data?.trim() !== '[DONE]') {
          message = JSON.parse(chunk.data);
        }
      } else {
        message = chunk || chunks[0];
      }
      if (message) {
        message?.choices?.forEach((choice: any) => {
          if (choice?.delta) {
            currentThink = choice.delta.reasoning_content || '';
            currentContent += choice.delta.content || '';
            role = choice.delta.role;
          } else if (choice?.message) {
            currentThink = choice.message.reasoning_content || '';
            currentContent += choice.message.content || '';
            role = choice.message.role;
          }
        });
      }
    } catch (error) {
      console.error('transformMessage error', error);
    }
    let content = '';
    let originMessageContent =
      typeof originMessage?.content === 'string'
        ? originMessage?.content
        : originMessage?.content.text || '';
    if (!originMessageContent && currentThink) {
      content = `\n\n<think>\n\n${currentThink?.replace?.(/^(\/n)+/, '')}`;
    } else if (
      originMessageContent.includes('<think>') &&
      !originMessageContent.includes('</think>') &&
      currentContent
    ) {
      originMessageContent = originMessageContent.replace('<think>', '<think status="done">');
      content = `${originMessageContent?.replace?.(/\n+$/, '')}\n\n</think>\n\n${currentContent}`;
    } else {
      content = `${originMessageContent || ''}${currentThink}${currentContent}`;
    }

    return {
      content,
      role: role || 'assistant',
    } as ChatMessage;
  }
}
