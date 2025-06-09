/**
 * Checks if the current browser is Safari.
 * Uses a combination of User-Agent detection and browser-specific feature checks.
 */
const useIsSafari = (): boolean => {
  const ua = navigator.userAgent;

  const isSafari =
    // 1. Check if the User-Agent contains "Safari"
    /Safari/.test(ua) &&
    // 2. Exclude browsers that use WebKit but are not Safari (e.g., Chrome, Edge, etc.)
    !/Chrome|CriOS|Chromium|Edg/.test(ua) &&
    // 3. Additional Safari-specific checks:

    // a) Check for the `window.safari` object (Safari's proprietary API)
    (typeof (window as any).safari !== 'undefined' ||
      // b) Check for Safari-specific CSS support (`-webkit-touch-callout` is Safari-only)
      CSS.supports('-webkit-touch-callout', 'none'));
  return isSafari;
};

export default useIsSafari;
