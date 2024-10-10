/**
 * default separator for {@link splitStream}
 */
const DEFAULT_SEPARATOR = '\n';

/**
 * Check if a string is not empty or only contains whitespace characters
 */
const isValidString = (str: string) => (str ?? '').trim() !== '';

/**
 * A TransformStream that caches incomplete data between transformations
 * using a closure. It splits incoming chunks based on the specified separator
 * and enqueues complete segments while retaining any incomplete data for
 * processing with subsequent chunks.
 */
function splitStream(separator: string | RegExp = DEFAULT_SEPARATOR) {
  // Buffer to store incomplete data chunks between transformations
  let buffer = '';

  return new TransformStream({
    transform(chunk, controller) {
      buffer += chunk;

      // Split the buffer based on the separator
      const parts = buffer.split(separator);

      // Enqueue all complete parts except for the last incomplete one
      parts.slice(0, -1).forEach((part) => {
        // Skip empty parts
        if (isValidString(part)) {
          controller.enqueue(part);
        }
      });

      // Save the last incomplete part back to the buffer for the next chunk
      buffer = parts[parts.length - 1];
    },
    flush(controller) {
      // If there's any remaining data in the buffer, enqueue it as the final part
      if (isValidString(buffer)) controller.enqueue(buffer);
    },
  });
}

interface XStreamOptions {
  /**
   * @description Readable stream of binary data
   * @link https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream
   */
  readableStream: ReadableStream<Uint8Array>;

  /**
   * @description Transformer pipe to transform stream
   * @link https://developer.mozilla.org/zh-CN/docs/Web/API/TransformStream
   */
  transformPipe?: TransformStream[];

  /**
   * @description Split a string
   * @default '\n'
   */
  separator?: string | RegExp;
}

/**
 * @description Transform binary stream to string
 * @warning The `xStream` only support the `utf-8` encoding. More encoding support maybe in the future.
 */
async function* xStream(options: XStreamOptions) {
  const { readableStream, separator, transformPipe = [] } = options;

  if (!(readableStream instanceof ReadableStream)) {
    throw new Error('The reader must be an instance of ReadableStream.');
  }

  // Default encoding is `utf-8`
  const decoderStream = new TextDecoderStream();

  let stream = readableStream
    // Decode: binary data -> string data
    .pipeThrough(decoderStream)
    // Split string data by separator
    .pipeThrough(splitStream(separator));

  for (const transformStream of transformPipe) {
    if (!(transformStream instanceof TransformStream)) {
      throw new Error('The transformPipe must be an Array of TransformStream instance.');
    }

    // Set custom transform pipe
    stream = stream.pipeThrough(transformStream);
  }

  const reader = stream.getReader();

  while (reader instanceof ReadableStreamDefaultReader) {
    const { value, done } = await reader.read();

    if (done) break;

    if (!value) continue;

    // Transformed data through all transform pipes
    yield value;
  }
}

export default xStream;
