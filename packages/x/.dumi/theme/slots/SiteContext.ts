import type { DirectionType } from 'antd/es/config-provider';
import * as React from 'react';

import type { ThemeName } from '../common/ThemeSwitch';

export interface SiteContextProps {
  isMobile: boolean;
  bannerVisible: boolean;
  direction: DirectionType;
  alertVisible: boolean;
  theme: ThemeName[];
  updateSiteConfig: (props: Partial<SiteContextProps>) => void;
}

const SiteContext = React.createContext<SiteContextProps>({
  isMobile: false,
  alertVisible: true,
  bannerVisible: false,
  direction: 'ltr',
  theme: ['light'],
  updateSiteConfig: () => {},
});

export default SiteContext;
