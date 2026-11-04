import XStream from '../index';

function createStream(text: string, byteByByte = false) {
  const bytes = new TextEncoder().encode(text);
  return new ReadableStream<Uint8Array>({
    start(controller) {
      if (byteByByte) {
        for (const byte of bytes) controller.enqueue(new Uint8Array([byte]));
      } else {
        controller.enqueue(bytes);
      }
      controller.close();
    },
  });
}

describe('XStream multiline data', () => {
  it.each([
    false,
    true,
  ])('joins fragmented JSON data with fallback decoder: %s', async (fallback) => {
    const originalDecoder = globalThis.TextDecoderStream;
    if (fallback) (globalThis as any).TextDecoderStream = undefined;

    try {
      const result = [];
      for await (const event of XStream({
        readableStream: createStream('data: {"message":\ndata: "你好"}\n\ndata: next\n\n', true),
      })) {
        result.push(event);
      }

      expect(result).toEqual([{ data: '{"message":\n"你好"}' }, { data: 'next' }]);
      expect(JSON.parse(result[0].data)).toEqual({ message: '你好' });
    } finally {
      globalThis.TextDecoderStream = originalDecoder;
    }
  });

  it.each([
    ['leading', 'data:\ndata: second\n\n', '\nsecond'],
    ['middle', 'data: first\ndata:\ndata: last\n\n', 'first\n\nlast'],
    ['trailing', 'data: first\ndata:\n\n', 'first\n'],
    ['only', 'data:\ndata:\n\n', '\n'],
  ])('preserves %s empty data lines', async (_name, text, expected) => {
    const result = [];
    for await (const event of XStream({ readableStream: createStream(text) })) {
      result.push(event);
    }
    expect(result).toEqual([{ data: expected }]);
  });

  it('joins data across comments and other fields while retaining their last values', async () => {
    const result = [];
    for await (const event of XStream({
      readableStream: createStream(
        'event: first\nid: 1\nretry: 100\ndata: alpha\n: keep-alive\n' +
          'event: last\nid: 2\nretry: 200\ndata: beta\n\n',
      ),
    })) {
      result.push(event);
    }
    expect(result).toEqual([{ event: 'last', id: '2', retry: '200', data: 'alpha\nbeta' }]);
  });

  it('joins data with configured event and part separators', async () => {
    const result = [];
    for await (const event of XStream({
      readableStream: createStream('data=first|data=second<end>data=next<end>'),
      streamSeparator: '<end>',
      partSeparator: '|',
      kvSeparator: '=',
    })) {
      result.push(event);
    }
    expect(result).toEqual([{ data: 'first\nsecond' }, { data: 'next' }]);
  });

  it('leaves multiline data to a custom transformer', async () => {
    const text = 'data: first\ndata: second\n\n';
    const result = [];
    for await (const value of XStream({
      readableStream: createStream(text),
      transformStream: new TransformStream<string, string>({
        transform(chunk, controller) {
          controller.enqueue(chunk);
        },
      }),
    })) {
      result.push(value);
    }
    expect(result).toEqual([text]);
  });
});
