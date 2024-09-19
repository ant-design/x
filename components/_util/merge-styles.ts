import React from 'react';

export default function mergeStyles(...args: (React.CSSProperties | undefined)[]) {
  return Object.assign(
    {},
    ...args.filter((style) => Object.prototype.toString.call(style) === '[object Object]'),
  );
}
