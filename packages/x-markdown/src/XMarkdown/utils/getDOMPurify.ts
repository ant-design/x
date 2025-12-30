import DOMPurify from 'dompurify';

let serverDOMPurify: ReturnType<typeof DOMPurify> | null = null;
let jsdomInstance: any = null;

function initializeServerDOMPurify(): boolean {
  try {
    const jsdomModule = require('jsdom');
    const JSDOM = jsdomModule.JSDOM || jsdomModule.default?.JSDOM || jsdomModule;

    if (!JSDOM) {
      return false;
    }

    jsdomInstance = new JSDOM('');
    serverDOMPurify = DOMPurify(jsdomInstance.window);
    return true;
  } catch {
    return false;
  }
}

if (typeof window === 'undefined') {
  initializeServerDOMPurify();
}

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
      initializeServerDOMPurify();
    }
    return serverDOMPurify || DOMPurify;
  }

  return DOMPurify;
}
