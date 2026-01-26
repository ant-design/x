export const safeEncodeURIComponent = (content: string): string => {
  const sanitize = (str: string): string => {
    let result = '';
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i);

      if (charCode >= 0xd800 && charCode <= 0xdbff) {
        if (
          i + 1 < str.length &&
          str.charCodeAt(i + 1) >= 0xdc00 &&
          str.charCodeAt(i + 1) <= 0xdfff
        ) {
          result += str[i] + str[i + 1];
          i++;
        }
      } else if (charCode < 0xdc00 || charCode > 0xdfff) {
        result += str[i];
      }
    }
    return result;
  };

  try {
    return encodeURIComponent(content);
  } catch (e) {
    if (e instanceof URIError) {
      return encodeURIComponent(sanitize(content));
    }
    return '';
  }
};
