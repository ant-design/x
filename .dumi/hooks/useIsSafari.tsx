const useIsSafari = (): boolean => {
  const ua = navigator.userAgent;

  // 基于 UA 判断（去除 Chrome、CriOS、FxiOS 等）
  const isSafariUA =
    ua.includes('Safari') &&
    !ua.includes('Chrome') &&
    !ua.includes('CriOS') &&
    !ua.includes('FxiOS');

  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  return isSafariUA || isSafari;
};

export default useIsSafari;
