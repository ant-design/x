const useIsSafari = (): boolean => {
  const ua = navigator.userAgent;

  // Determine based on UA (excluding Chrome, CriOS, FxiOS, etc.)
  const isSafariUA =
    ua.includes('Safari') &&
    !ua.includes('Chrome') &&
    !ua.includes('CriOS') &&
    !ua.includes('FxiOS');

  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  return isSafariUA || isSafari;
};

export default useIsSafari;
