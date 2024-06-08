import { createTheme, getComputedToken } from '@ant-design/cssinjs';

import type { AliasToken } from './interface';
import defaultDerivative from './themes/default';
import seedToken from './themes/seed';
import formatToken from './util/alias';

const getDesignToken = (): AliasToken => {
  const theme = createTheme(defaultDerivative);
  const mergedToken = {
    ...seedToken,
  };
  return getComputedToken(mergedToken as any, {}, theme, formatToken);
};

export default getDesignToken;
