import { SunOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Badge, Button, Dropdown } from 'antd';
import { CompactTheme, DarkTheme } from 'antd-token-previewer/es/icons';
import { FormattedMessage } from 'dumi';
import React, { use, useRef } from 'react';

import useThemeAnimation from '../../../hooks/useThemeAnimation';
import type { SiteContextProps } from '../../slots/SiteContext';
import SiteContext from '../../slots/SiteContext';
import ThemeIcon from './ThemeIcon';

export type ThemeName = 'light' | 'dark' | 'compact' | 'motion-off';

export interface ThemeSwitchProps {
  value?: ThemeName[];
}

const ThemeSwitch: React.FC<ThemeSwitchProps> = () => {
  const { theme, updateSiteConfig } = use<SiteContextProps>(SiteContext);
  const toggleAnimationTheme = useThemeAnimation();
  const lastThemeKey = useRef<string>(theme.includes('dark') ? 'dark' : 'light');

  const badge = <Badge color="blue" style={{ marginTop: -1 }} />;

  // 主题选项配置
  const themeOptions = [
    {
      id: 'app.theme.switch.default',
      icon: <SunOutlined />,
      key: 'light',
      showBadge: () => theme.includes('light') || theme.length === 0,
    },
    {
      id: 'app.theme.switch.dark',
      icon: <DarkTheme />,
      key: 'dark',
      showBadge: () => theme.includes('dark'),
    },
    {
      type: 'divider',
    },
    {
      id: 'app.theme.switch.compact',
      icon: <CompactTheme />,
      key: 'compact',
      showBadge: () => theme.includes('compact'),
    },
  ];

  // 构建下拉菜单项
  const items = themeOptions.map((option, i) => {
    if (option.type === 'divider') {
      return { type: 'divider' as const, key: `divider-${i}` };
    }

    const { id, icon, key, showBadge } = option;

    return {
      label: <FormattedMessage id={id} />,
      icon,
      key: key || i,
      extra: showBadge ? (showBadge() ? badge : null) : null,
    };
  });

  // 处理主题切换
  const handleThemeChange = (key: string, domEvent: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (key === lastThemeKey.current) {
      return;
    }

    // 亮色/暗色模式切换时应用动画效果
    if (key === 'dark' || key === 'light') {
      lastThemeKey.current = key;
      toggleAnimationTheme(domEvent, theme.includes('dark'));
    }

    const themeKey = key as ThemeName;

    // 亮色/暗色模式是互斥的
    if (['light', 'dark'].includes(key)) {
      const filteredTheme = theme.filter((t) => !['light', 'dark'].includes(t));
      updateSiteConfig({
        theme: [...filteredTheme, themeKey],
      });
    } else {
      // 其他主题选项是开关式的
      const hasTheme = theme.includes(themeKey);
      updateSiteConfig({
        theme: hasTheme ? theme.filter((t) => t !== themeKey) : [...theme, themeKey],
      });
    }
  };

  const onClick: MenuProps['onClick'] = ({ key, domEvent }) => {
    handleThemeChange(key, domEvent as React.MouseEvent<HTMLElement, MouseEvent>);
  };

  return (
    <Dropdown menu={{ items, onClick }} arrow={{ pointAtCenter: true }} placement="bottomRight">
      <Button
        type="text"
        icon={<ThemeIcon />}
        style={{ fontSize: 16, borderRadius: 100, height: 40, width: 40 }}
      />
    </Dropdown>
  );
};

export default ThemeSwitch;
