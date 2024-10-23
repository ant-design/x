import xStream from '../index';

describe('xStream', () => {
  it('transforms binary stream to SSE events', async () => {
    const textEncoder = new TextEncoder();
    const readableStream = new ReadableStream({
      start(controller) {
        controller.enqueue(textEncoder.encode('event: test\n\ndata: value\n\n'));
        controller.close();
      },
    });

    const result: any[] = [];
    for await (const value of xStream({ readableStream })) {
      result.push(value);
    }

    expect(result).toEqual([{ event: ' test' }, { data: ' value' }]);
  });

  it('make compatible with incomplete SSE data. ', async () => {
    const sseChunks: string[] = [];

    sseChunks.push('event: message\ndata:1\n\nevent: end\n');
    sseChunks.push('data:2\n\n');
    sseChunks.push(':comment\n\n');

    const readableStream = new ReadableStream({
      async start(controller) {
        for (const chunk of sseChunks) {
          controller.enqueue(new TextEncoder().encode(chunk));
        }
        controller.close();
      },
    });

    const result: any[] = [];
    for await (const value of xStream({ readableStream })) {
      result.push(value);
    }

    expect(result).toEqual([
      { event: ' message', data: '1' },
      { event: ' end', data: '2' },
    ]);
  });

  it('supports custom transform streams', async () => {
    const textEncoder = new TextEncoder();
    const readableStream = new ReadableStream({
      start(controller) {
        controller.enqueue(textEncoder.encode('custom-part1|custom-part2|'));
        controller.close();
      },
    });

    const customTransform = new TransformStream({
      transform(chunk, controller) {
        const parts = chunk.split('|');
        parts.forEach((part: string) => controller.enqueue(part));
      },
    });

    const result: any[] = [];
    for await (const value of xStream({ readableStream, transformStream: customTransform })) {
      result.push(value);
    }

    expect(result).toEqual(['custom-part1', 'custom-part2']);
  });

  it('throws an error when readableStream is not an instance of ReadableStream', async () => {
    await expect(
      (async () => {
        const result: any[] = [];
        for await (const value of xStream({ readableStream: {} as any })) {
          result.push(value);
        }
      })(),
    ).rejects.toThrow('The options.readableStream must be an instance of ReadableStream.');
  });

  it('throws an error when key-value separator is not ":"', async () => {
    await expect(
      (async () => {
        const result: any[] = [];
        for await (const value of xStream({
          readableStream: new ReadableStream({
            async start(controller) {
              controller.enqueue(new TextEncoder().encode('event: message\n\nincomplete'));
              controller.close();
            },
          }),
        })) {
          result.push(value);
        }
      })(),
    ).rejects.toThrow('The key-value separator ":" is not found in the sse line chunk!');
  });
});
