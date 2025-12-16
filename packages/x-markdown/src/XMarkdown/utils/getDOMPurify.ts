import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

let serverDOMPurify: ReturnType<typeof DOMPurify> | null = null;
let jsdomInstance: JSDOM | null = null;

/**
 * Returns the DOMPurify instance, compatible with both server-side (Node.js) and client-side (browser) environments.
 *
 * On the server, it creates a DOMPurify instance with a jsdom window; on the client, it returns the browser's DOMPurify.
 *
 * @see https://github.com/cure53/DOMPurify?tab=readme-ov-file#running-dompurify-on-the-server
 */
export function getDOMPurify(): ReturnType<typeof DOMPurify> {
  if (typeof window === 'undefined') {
    if (!serverDOMPurify) {
      jsdomInstance = new JSDOM('');
      serverDOMPurify = DOMPurify(jsdomInstance.window);
    }
    return serverDOMPurify;
  }

  return DOMPurify;
}
