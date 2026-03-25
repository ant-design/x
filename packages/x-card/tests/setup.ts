/* eslint-disable no-console */
import util from 'util';

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

if (typeof window !== 'undefined') {
  fillWindowEnv(window);
}

global.requestAnimationFrame = global.requestAnimationFrame || global.setTimeout;
global.cancelAnimationFrame = global.cancelAnimationFrame || global.clearTimeout;
