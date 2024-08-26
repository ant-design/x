import React from 'react';
import { theme as antdTheme } from 'antd';

function useToken() {
  const { cssVar } = React.useContext(antdTheme._internalContext);

  const { theme, token, hashId } = antdTheme.useToken();

  return {
    theme,
    token,
    hashId,
    cssVar,
    realToken: token,
  };
}

export default useToken;
