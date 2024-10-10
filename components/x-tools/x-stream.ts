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

  return new TransformStream<string, string>({
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

interface XStreamOptions<T> {
  /**
   * @description Readable stream of binary data
   * @link https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream
   */
  readableStream: ReadableStream<Uint8Array>;

  /**
   * @description Support customizable transformStream to transform streams
   * @link https://developer.mozilla.org/zh-CN/docs/Web/API/TransformStream
   */
  transformStream?: TransformStream<string, T>;

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
async function* xStream<T = string>(options: XStreamOptions<T>) {
  const { readableStream, separator, transformStream = new TransformStream<string, T>() } = options;

  if (!(readableStream instanceof ReadableStream)) {
    throw new Error('The options.readableStream must be an instance of ReadableStream.');
  }

  if (!(transformStream instanceof TransformStream)) {
    throw new Error('The options.transformStream must be an instance of TransformStream.');
  }

  // Default encoding is `utf-8`
  const decoderStream = new TextDecoderStream();

  const stream = readableStream
    // 1. Decode: [ binary data -> string data ]
    .pipeThrough(decoderStream)
    // 2. Split by separator: [ string data -> string data ]
    .pipeThrough(splitStream(separator))
    // 3. Customizable transformer: [ string data -> T ]
    .pipeThrough(transformStream);

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
