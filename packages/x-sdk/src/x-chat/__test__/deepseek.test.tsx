import { act, cleanup, renderHook, waitFor } from '../../../tests/utils';
import DeepSeekChatProvider from '../../chat-providers/DeepSeekChatProvider';
import XRequest from '../../x-request';
import useXChat from '../index';

type Delta = { reasoning_content?: string; content?: string };

const userMessage = { role: 'user', content: 'Please answer the question.' };
const placeholder = { role: 'assistant', content: 'Waiting for an answer...' };

function jsonResponse(message: Delta) {
  return new Response(
    JSON.stringify({ choices: [{ message: { role: 'assistant', ...message } }] }),
    {
      headers: { 'Content-Type': 'application/json' },
    },
  );
}

function sseResponse(deltas: Delta[]) {
  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const delta of deltas) {
        const chunk = { choices: [{ delta: { role: 'assistant', ...delta } }] };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
      }
      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
    },
  });
  const response = new Response(null, { headers: { 'Content-Type': 'text/event-stream' } });
  // Keep the body in the same stream implementation installed by the test setup.
  Object.defineProperty(response, 'body', { value: body });
  return response;
}

async function expectChatResponse(response: Response, content: string, withPlaceholder = false) {
  let releaseResponse!: () => void;
  const ready = new Promise<void>((resolve) => {
    releaseResponse = resolve;
  });
  const onError = jest.fn();
  const onSuccess = jest.fn();
  const request = XRequest('http://localhost/deepseek-test', {
    manual: true,
    callbacks: { onError, onSuccess },
    fetch: async () => {
      await ready;
      return response;
    },
  });
  const provider = new DeepSeekChatProvider({ request });
  const { result } = renderHook(() =>
    useXChat({
      provider,
      requestPlaceholder: withPlaceholder ? placeholder : undefined,
    }),
  );

  try {
    await waitFor(() => expect(result.current!.isDefaultMessagesRequesting).toBe(false));
    act(() => {
      result.current!.onRequest({ messages: [userMessage] });
    });

    if (withPlaceholder) {
      await waitFor(() => {
        expect(result.current!.messages).toEqual([
          expect.objectContaining({ message: userMessage, status: 'local' }),
          expect.objectContaining({ message: placeholder, status: 'loading' }),
        ]);
      });
    }

    await act(async () => {
      releaseResponse();
      await request.asyncHandler;
    });

    await waitFor(() => {
      expect(onError).not.toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalledTimes(1);
      expect(result.current!.isRequesting).toBe(false);
      expect(request.isRequesting).toBe(false);
      expect(result.current!.messages).toEqual([
        expect.objectContaining({ message: userMessage, status: 'local' }),
        expect.objectContaining({ message: { role: 'assistant', content }, status: 'success' }),
      ]);
    });
  } finally {
    releaseResponse();
    await act(async () => {
      await request.asyncHandler;
    });
    cleanup();
  }
}

describe('useXChat with DeepSeekChatProvider', () => {
  it.each([
    false,
    true,
  ])('preserves mixed JSON content with placeholder: %s', async (withPlaceholder) => {
    await expectChatResponse(
      jsonResponse({ reasoning_content: 'Reasoning.', content: 'Answer.' }),
      '\n\n<think status="done">\n\nReasoning.\n\n</think>\n\nAnswer.',
      withPlaceholder,
    );
  });

  it.each([
    false,
    true,
  ])('preserves a mixed first SSE delta with placeholder: %s', async (withPlaceholder) => {
    await expectChatResponse(
      sseResponse([{ reasoning_content: 'Reasoning.', content: 'Answer.' }]),
      '\n\n<think status="done">\n\nReasoning.\n\n</think>\n\nAnswer.',
      withPlaceholder,
    );
  });

  it('retains the first answer when later SSE deltas continue it', async () => {
    await expectChatResponse(
      sseResponse([
        { reasoning_content: 'Reasoning.', content: 'Answer' },
        { content: ' continues.' },
      ]),
      '\n\n<think status="done">\n\nReasoning.\n\n</think>\n\nAnswer continues.',
    );
  });

  it('preserves separate SSE reasoning and content deltas', async () => {
    await expectChatResponse(
      sseResponse([{ reasoning_content: 'Reasoning.' }, { content: 'Answer.' }]),
      '\n\n<think status="done">\n\nReasoning.\n\n</think>\n\nAnswer.',
    );
  });

  it.each(['JSON', 'SSE'])('does not replay %s content on success', async (format) => {
    const message = { content: 'Answer exactly once.' };
    await expectChatResponse(
      format === 'JSON' ? jsonResponse(message) : sseResponse([message]),
      message.content,
    );
  });

  it('retains the reasoning tail when an SSE delta also starts the answer', async () => {
    await expectChatResponse(
      sseResponse([
        { reasoning_content: 'Reasoning.' },
        { reasoning_content: ' More reasoning.', content: 'Answer.' },
      ]),
      '\n\n<think status="done">\n\nReasoning. More reasoning.\n\n</think>\n\nAnswer.',
    );
  });
});
