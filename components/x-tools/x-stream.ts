/**
 * @description default separator for {@link splitStream}
 */
const DEFAULT_STREAM_SEPARATOR = '\n\n';
/**
 * @description Default separator for event stream chunk
 * @example "event: delta\ndata: {\"key\": \"value\"}"
 */
const DEFAULT_EVENT_SEPARATOR = '\n';
/**
 * @description Default separator for key value, A colon (`:`) is used to separate keys from values.
 * @example "event: delta"
 */
const DEFAULT_KV_SEPARATOR = ':';

type XStreamAwaitedReturn = Record<string, string>;

/**
 * Check if a string is not empty or only contains whitespace characters
 */
const isValidString = (str: string) => (str ?? '').trim() !== '';

/**
 * Process the separator value to return the correct separator string
 */
const processSeparator = (separator?: string | RegExp | boolean, defaultSeparator?: string) => {
  if (typeof separator === 'boolean') {
    return separator ? defaultSeparator : '';
  }

  return separator;
};

/**
 * A TransformStream that caches incomplete data between transformations
 * using a closure. It splits incoming chunks based on the specified separator
 * and enqueues complete segments while retaining any incomplete data for
 * processing with subsequent chunks.
 */
function splitStream(separator?: string | RegExp | boolean) {
  // Buffer to store incomplete data chunks between transformations
  let buffer = '';

  const streamSeparator = processSeparator(separator, DEFAULT_STREAM_SEPARATOR);

  return new TransformStream<string, string>({
    transform(chunk, controller) {
      // If the separator is not set or set false, enqueue the chunk as is
      if (!streamSeparator) return controller.enqueue(chunk);

      buffer += chunk;

      // Split the buffer based on the separator
      const parts = buffer.split(streamSeparator);

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

/**
 * A TransformStream that splits incoming chunks based on the specified
 * event separator and transforms them into key-value pairs. The stream
 * expects each chunk to be a string formatted as "key:value" pairs separated
 * by the event separator. It outputs a record (object) containing all parsed
 * key-value pairs from each chunk.
 */
function splitEvent(separator?: string | RegExp | boolean) {
  const eventSeparator = processSeparator(separator, DEFAULT_EVENT_SEPARATOR);

  return new TransformStream<string, XStreamAwaitedReturn>({
    transform(chunk, controller) {
      if (typeof chunk === 'string') {
        // if the separator is not set or set false, enqueue the chunk as `{ chunk: chunk }`
        if (!eventSeparator) return controller.enqueue({ chunk });

        // Split the chunk into key-value pairs using the eventSeparator
        const kvPairs = chunk.split(eventSeparator);

        // Reduce the key-value pairs into a single object and enqueue
        controller.enqueue(
          kvPairs.reduce((acc, kvPair) => {
            // Find the index of the default key-value separator in the kvPair
            const separatorIndex = kvPair.indexOf(DEFAULT_KV_SEPARATOR);

            // If the separator is not found, skip this pair
            if (separatorIndex === -1) return acc;

            // Extract the key from the beginning of the kvPair up to the separator
            const key = kvPair.slice(0, separatorIndex);

            // Extract the value from the kvPair after the separator
            const value = kvPair.slice(separatorIndex + 1);

            return { ...acc, [key]: value };
          }, {}),
        );
      } else {
        throw new Error('The chunk must be a string!');
      }
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
   * @link https://developer.mozilla.org/en-US/docs/Web/API/TransformStream
   */
  transformStream?: TransformStream<XStreamAwaitedReturn, T>;

  /**
   * @description Used to separate a stream while reading, utilizing a specific delimiter.
   *
   * When handling responses with `Content-Type: text/event-stream`, the following standard practices are commonly observed:
   * - Double newline characters (`\n\n`) are used to separate individual events.
   * - Single newline characters (`\n`) are employed to separate key-value pairs within an event.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/API/EventSource
   */
  separators?: {
    /**
     * @default '\n\n'
     */
    stream?: string | RegExp | boolean;
    /**
     * @default '\n'
     */
    event?: string | RegExp | boolean;
  };
}

/**
 * @description Transform binary stream to string
 * @warning The `xStream` only support the `utf-8` encoding. More encoding support maybe in the future.
 */
async function* xStream<T = XStreamAwaitedReturn>(options: XStreamOptions<T>) {
  const {
    readableStream,
    separators = {
      stream: true,
      event: true,
    },
    transformStream = new TransformStream<XStreamAwaitedReturn, T>(),
  } = options;

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
    // 2. Split by stream separator: [ string data -> string data ]
    .pipeThrough(splitStream(separators.stream))
    // 3. Split by event separator: [ string data -> Record<string, string> data ]
    .pipeThrough(splitEvent(separators.event))
    // 4. Customizable transformer: [ Record<string, string> data -> T ]
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
