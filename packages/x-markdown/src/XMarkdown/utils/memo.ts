/**
 * Props comparator for `React.memo` on custom components.
 *
 * Every parse hands custom components a fresh `domNode`, so the default
 * shallow comparison of `React.memo` never succeeds while streaming and a
 * component such as a code highlighter re-renders on every chunk even though
 * nothing it displays has changed. This comparator ignores `domNode` and
 * shallow-compares everything else (`children`, `lang`, `streamStatus`,
 * `className`, data attributes, …).
 *
 * It helps components whose other props are primitives — `code` is the
 * typical case — and is a no-op for components that receive a fresh
 * `children` array every parse, such as `table`; `streaming.incremental`
 * covers those.
 *
 * ```tsx
 * const Code = React.memo((props: ComponentProps) => <Highlighter {...props} />,
 *   arePropsEqualIgnoringDomNode);
 * <XMarkdown components={{ code: Code }} />
 * ```
 */
export const arePropsEqualIgnoringDomNode = (
  prev: Readonly<Record<string, unknown>>,
  next: Readonly<Record<string, unknown>>,
): boolean => {
  const prevKeys = Object.keys(prev);
  const nextKeys = Object.keys(next);
  if (prevKeys.length !== nextKeys.length) return false;
  for (const key of prevKeys) {
    if (key === 'domNode') continue;
    if (!Object.prototype.hasOwnProperty.call(next, key)) return false;
    if (!Object.is(prev[key], next[key])) return false;
  }
  return true;
};
