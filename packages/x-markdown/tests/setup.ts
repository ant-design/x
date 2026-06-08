/* eslint-disable no-console */

import type { DOMWindow } from 'jsdom';
import util from 'util';

const originConsoleErr = console.error;

const ignoreWarns = ['validateDOMNesting', 'on an unmounted component', 'not wrapped in act'];

// Hack off React warning to avoid too large log in CI.
console.error = (...args) => {
  const str = args.join('').replace(/\n/g, '');
  if (ignoreWarns.every((warn) => !str.includes(warn))) {
    originConsoleErr(...args);
  }
};

type Writeable<T> = { -readonly [P in keyof T]: T[P] };

// This function can not move to external file since jest setup not support
export function fillWindowEnv(window: Window | DOMWindow) {
  const win = window as Writeable<Window> & typeof globalThis;

  win.resizeTo = (width, height) => {
    win.innerWidth = width || win.innerWidth;
    win.innerHeight = height || win.innerHeight;
    win.dispatchEvent(new Event('resize'));
  };
  win.scrollTo = () => {};
  // ref: https://github.com/ant-design/ant-design/issues/18774
  if (!win.matchMedia) {
    Object.defineProperty(win, 'matchMedia', {
      writable: true,
      configurable: true,
      value: jest.fn((query) => ({
        matches: query.includes('max-width'),
        addListener: jest.fn(),
        removeListener: jest.fn(),
      })),
    });
  }

  // Fix css-animation or @rc-component/motion deps on these
  // https://github.com/react-component/motion/blob/9c04ef1a210a4f3246c9becba6e33ea945e00669/src/util/motion.ts#L27-L35
  // https://github.com/yiminghe/css-animation/blob/a5986d73fd7dfce75665337f39b91483d63a4c8c/src/Event.js#L44
  win.AnimationEvent = win.AnimationEvent || win.Event;
  win.TransitionEvent = win.TransitionEvent || win.Event;

  // ref: https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
  // ref: https://github.com/jsdom/jsdom/issues/2524
  Object.defineProperty(win, 'TextEncoder', {
    writable: true,
    value: util.TextEncoder,
  });
  Object.defineProperty(win, 'TextDecoder', {
    writable: true,
    value: util.TextDecoder,
  });
}

/**
 * happy-dom (>= 20.10.x) regression: the `nodeName` getter on `Node.prototype`
 * returns '' for element instances (the working getter lives on
 * `Element.prototype`). DOMPurify reads `nodeName` through the `Node.prototype`
 * getter — per the DOM spec, `nodeName` is defined on `Node` — so every element
 * is seen as an unknown tag and stripped while its text content is kept. This
 * makes XMarkdown render only the inner text (no <p>/<div>/<h*> wrappers, raw
 * HTML dropped). Restore a spec-correct getter on `Node.prototype` so DOMPurify
 * (and any other consumer) reads the real node name.
 */
function fixNodeNameGetter() {
  if (typeof Node === 'undefined' || !Node.prototype || typeof document === 'undefined') {
    return;
  }
  const desc = Object.getOwnPropertyDescriptor(Node.prototype, 'nodeName');
  const probe = document.createElement('div');
  // Only patch when the Node.prototype getter is actually broken.
  if (!desc?.get || desc.get.call(probe) === 'DIV') {
    return;
  }
  Object.defineProperty(Node.prototype, 'nodeName', {
    configurable: true,
    get(this: Node): string {
      switch (this.nodeType) {
        case 1: // ELEMENT_NODE
          return (this as Element).tagName;
        case 3: // TEXT_NODE
          return '#text';
        case 8: // COMMENT_NODE
          return '#comment';
        case 4: // CDATA_SECTION_NODE
          return '#cdata-section';
        case 7: // PROCESSING_INSTRUCTION_NODE
          return (this as ProcessingInstruction).target;
        case 9: // DOCUMENT_NODE
          return '#document';
        case 10: // DOCUMENT_TYPE_NODE
          return (this as DocumentType).name;
        case 11: // DOCUMENT_FRAGMENT_NODE
          return '#document-fragment';
        default:
          return (this as Element).tagName || '';
      }
    },
  });
}

/* eslint-disable global-require */
if (typeof window !== 'undefined') {
  fillWindowEnv(window);
  fixNodeNameGetter();
}

global.requestAnimationFrame = global.requestAnimationFrame || global.setTimeout;
global.cancelAnimationFrame = global.cancelAnimationFrame || global.clearTimeout;
