import type { DOMWindow } from 'jsdom';
import {
  ReadableStream,
  ReadableStreamDefaultReader,
  TransformStream,
  WritableStream,
} from 'web-streams-polyfill';

/**
 * https://github.com/oven-sh/bun/issues/5648
 *
 * @description Polyfill for TextDecoderStream.
 *
 * Copyright 2016 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Polyfill for TextEncoderStream and TextDecoderStream
 *
 * Modified by Sukka (https://skk.moe) to increase compatibility and performance with Bun.
 */
export class PolyfillTextDecoderStream extends TransformStream<Uint8Array, string> {
  readonly encoding: string;
  readonly fatal: boolean;
  readonly ignoreBOM: boolean;

  constructor(
    encoding = 'utf-8',
    { fatal = false, ignoreBOM = false }: ConstructorParameters<typeof TextDecoder>[1] = {},
  ) {
    const decoder = new TextDecoder(encoding, { fatal, ignoreBOM });
    super({
      transform(chunk: Uint8Array, controller: TransformStreamDefaultController<string>) {
        const decoded = decoder.decode(chunk, { stream: true });
        if (decoded.length > 0) {
          controller.enqueue(decoded);
        }
      },
      flush(controller: TransformStreamDefaultController<string>) {
        // If {fatal: false} is in options (the default), then the final call to
        // decode() can produce extra output (usually the unicode replacement
        // character 0xFFFD). When fatal is true, this call is just used for its
        // side-effect of throwing a TypeError exception if the input is
        // incomplete.
        const output = decoder.decode();
        if (output.length > 0) {
          controller.enqueue(output);
        }
      },
    });

    this.encoding = encoding;
    this.fatal = fatal;
    this.ignoreBOM = ignoreBOM;
  }
}

export function setupStreamsPolyfill(win: Window | DOMWindow) {
  Object.defineProperty(win, 'ReadableStream', {
    writable: true,
    value: ReadableStream,
  });

  Object.defineProperty(win, 'TransformStream', {
    writable: true,
    value: TransformStream,
  });

  Object.defineProperty(win, 'WritableStream', {
    writable: true,
    value: WritableStream,
  });

  Object.defineProperty(win, 'ReadableStreamDefaultReader', {
    writable: true,
    value: ReadableStreamDefaultReader,
  });

  Object.defineProperty(win, 'TextDecoderStream', {
    writable: true,
    value: PolyfillTextDecoderStream,
  });
}
