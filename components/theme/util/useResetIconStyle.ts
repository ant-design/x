import { useStyleRegister } from '@ant-design/cssinjs';

import useToken from '../useToken';
import { resetIcon } from '../../style';

const useResetIconStyle = (iconPrefixCls: string) => {
  const [theme, token] = useToken();
  return useStyleRegister(
    {
      theme,
      token,
      hashId: '',
      path: ['ant-design-icons', iconPrefixCls],
      layer: {
        name: 'antd',
      },
    },
    () => [
      {
        [`.${iconPrefixCls}`]: {
          ...resetIcon(),
          [`.${iconPrefixCls} .${iconPrefixCls}-icon`]: {
            display: 'block',
          },
        },
      },
    ],
  );
};

export default useResetIconStyle;
