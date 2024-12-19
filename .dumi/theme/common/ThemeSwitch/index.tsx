import { BgColorsOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';
import { CompactTheme, DarkTheme } from 'antd-token-previewer/es/icons';
import { FormattedMessage, useLocation } from 'dumi';
import React from 'react';

import { getLocalizedPathname, isZhCN } from '../../utils';
import Link from '../Link';
import ThemeIcon from './ThemeIcon';

export type ThemeName = 'light' | 'dark' | 'compact' | 'motion-off';

export interface ThemeSwitchProps {
  value?: ThemeName[];
  onChange: (value: ThemeName[]) => void;
}

const ThemeSwitch: React.FC<ThemeSwitchProps> = (props) => {
  const { value = ['light'], onChange } = props;
  const { pathname, search } = useLocation();

  const isDark = value.includes('dark');

  if (pathname.startsWith('/index') || pathname === '') return null;

  return (
    <FloatButton.Group
      trigger="click"
      icon={<ThemeIcon />}
      aria-label="Theme Switcher"
      badge={{ dot: true }}
      style={{ bottom: 120 }}
    >
      <Link
        to={getLocalizedPathname('/theme-editor', isZhCN(pathname), search)}
        style={{ display: 'block' }}
      >
        <FloatButton
          icon={<BgColorsOutlined />}
          tooltip={<FormattedMessage id="app.footer.theme" />}
        />
      </Link>
      <FloatButton
        icon={<DarkTheme />}
        type={isDark ? 'primary' : 'default'}
        onClick={() => {
          if (isDark) {
            onChange(value.filter((theme) => theme !== 'dark'));
          } else {
            onChange([...value, 'dark']);
          }
        }}
        tooltip={<FormattedMessage id="app.theme.switch.dark" />}
      />
      <FloatButton
        icon={<CompactTheme />}
        type={value.includes('compact') ? 'primary' : 'default'}
        onClick={() => {
          if (value.includes('compact')) {
            onChange(value.filter((theme) => theme !== 'compact'));
          } else {
            onChange([...value, 'compact']);
          }
        }}
        tooltip={<FormattedMessage id="app.theme.switch.compact" />}
      />
    </FloatButton.Group>
  );
};

export default ThemeSwitch;
