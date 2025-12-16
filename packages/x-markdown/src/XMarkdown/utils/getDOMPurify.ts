import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

/**
 * Returns the DOMPurify instance, compatible with both server-side (Node.js) and client-side (browser) environments.
 *
 * On the server, it creates a DOMPurify instance with a jsdom window; on the client, it returns the browser's DOMPurify.
 *
 * @see https://github.com/cure53/DOMPurify?tab=readme-ov-file#running-dompurify-on-the-server
 */
export function getDOMPurify() {
  if (typeof window === 'undefined') {
    const jsWindow = new JSDOM('').window;
    return DOMPurify(jsWindow);
  }

  return DOMPurify;
}
