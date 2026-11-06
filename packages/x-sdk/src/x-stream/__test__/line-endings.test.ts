import XStream, { SSEOutput, XStreamOptions } from '../index';

function createStream(chunks: string[]) {
  return new ReadableStream<Uint8Array>({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(new TextEncoder().encode(chunk));
      }
      controller.close();
    },
  });
}

async function readEvents(chunks: string[], options: Partial<XStreamOptions<SSEOutput>> = {}) {
  const events: SSEOutput[] = [];
  for await (const event of XStream({ readableStream: createStream(chunks), ...options })) {
    events.push(event);
  }
  return events;
}

describe('XStream line endings', () => {
  it.each(['\n', '\r\n', '\r'])('separates events with %j line endings', async (newline) => {
    const text = `event: delta${newline}data: first${newline}${newline}data: second${newline}${newline}`;

    expect(await readEvents([text])).toEqual([
      { event: 'delta', data: 'first' },
      { data: 'second' },
    ]);
  });

  it('handles CRLF split at every possible chunk boundary', async () => {
    const text = 'event: delta\r\ndata: first\r\n\r\ndata: second\r\n\r\n';
    for (let index = 1; index < text.length; index += 1) {
      expect(await readEvents([text.slice(0, index), '', text.slice(index)])).toEqual([
        { event: 'delta', data: 'first' },
        { data: 'second' },
      ]);
    }
  });

  it('handles mixed line endings one character at a time', async () => {
    const text = 'event: delta\r\ndata: first\n\rdata: second\r\rdata: third\r\n\n';

    expect(await readEvents([...text])).toEqual([
      { event: 'delta', data: 'first' },
      { data: 'second' },
      { data: 'third' },
    ]);
  });

  it('handles fragmented UTF-8 with the fallback decoder', async () => {
    const originalDecoder = globalThis.TextDecoderStream;
    (globalThis as any).TextDecoderStream = undefined;
    const events: SSEOutput[] = [];
    try {
      for await (const event of XStream({
        readableStream: new ReadableStream<Uint8Array>({
          start(controller) {
            for (const byte of new TextEncoder().encode('data: 你好\r\n\r\ndata: 世界\r\n\r\n')) {
              controller.enqueue(new Uint8Array([byte]));
              controller.enqueue(new Uint8Array());
            }
            controller.close();
          },
        }),
      })) {
        events.push(event);
      }
      expect(events).toEqual([{ data: '你好' }, { data: '世界' }]);
    } finally {
      globalThis.TextDecoderStream = originalDecoder;
    }
  });

  it('emits a completed CRLF event before the source closes', async () => {
    let source: ReadableStreamDefaultController<Uint8Array>;
    const reader = XStream({
      readableStream: new ReadableStream<Uint8Array>({
        start(controller) {
          source = controller;
          controller.enqueue(new TextEncoder().encode('data: first\r\n\r\n'));
        },
      }),
    }).getReader();

    try {
      expect(await reader.read()).toEqual({ value: { data: 'first' }, done: false });
    } finally {
      source!.close();
      reader.releaseLock();
    }
  });

  it('preserves custom separators and carriage returns in their values', async () => {
    expect(
      await readEvents(['event=delta|data=first\rsecond<end>data=last<end>'], {
        streamSeparator: '<end>',
        partSeparator: '|',
        kvSeparator: '=',
      }),
    ).toEqual([{ event: 'delta', data: 'first\rsecond' }, { data: 'last' }]);
  });

  it('preserves explicitly configured CRLF separators', async () => {
    expect(
      await readEvents(['event: delta\r\ndata: first\r\n\r\ndata: second\r\n\r\n'], {
        streamSeparator: '\r\n\r\n',
        partSeparator: '\r\n',
      }),
    ).toEqual([{ event: 'delta', data: 'first' }, { data: 'second' }]);
  });

  it.each([false, true])(
    'preserves carriage returns with only a custom key-value separator (fragmented: %s)',
    async (fragmented) => {
      const text = 'data=first\rsecond\n\ndata=last\n\n';
      expect(await readEvents(fragmented ? [...text] : [text], { kvSeparator: '=' })).toEqual([
        { data: 'first\rsecond' },
        { data: 'last' },
      ]);
    },
  );

  it('normalizes line endings with explicitly configured default separators', async () => {
    expect(
      await readEvents(['data: first\r\n\r\ndata: second\r\r'], {
        streamSeparator: '\n\n',
        partSeparator: '\n',
        kvSeparator: ':',
      }),
    ).toEqual([{ data: 'first' }, { data: 'second' }]);
  });

  it('passes original line endings to a custom transformer', async () => {
    const text = 'data: first\r\n\r\ndata: second\r\r';
    const chunks: string[] = [];
    for await (const chunk of XStream({
      readableStream: createStream([text]),
      transformStream: new TransformStream<string, string>({
        transform(chunk, controller) {
          controller.enqueue(chunk);
        },
      }),
    })) {
      chunks.push(chunk);
    }
    expect(chunks).toEqual([text]);
  });
});
