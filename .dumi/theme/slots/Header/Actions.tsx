import { GithubOutlined } from '@ant-design/icons';
import { Button, Select } from 'antd';
import { createStyles } from 'antd-style';
import classnames from 'classnames';
import { useLocation, useSiteData } from 'dumi';
import React from 'react';

import DirectionIcon from '../../icons/DirectionIcon';
import * as utils from '../../utils';
import { getThemeConfig } from '../../utils';
import type { SiteContextProps } from '../SiteContext';
import SiteContext from '../SiteContext';
import SwitchBtn from './SwitchBtn';
import type { SharedProps } from './interface';

const useStyle = createStyles(({ css, token }) => {
  return {
    actions: css`
      display: flex;
      align-items: center;
      margin: 0 ${token.margin}px;
    `,
    mobile: css`
     width: 100%;
     justify-content: center;
    `,
    mini: css`
      margin: 0;
    `,
    select: css`
      padding: 0;
      border-radius: ${token.indexRadius}px;
    `,
  };
});

export interface HeaderActionsProps extends SharedProps {
  className?: string;
}

const HeaderActions: React.FC<HeaderActionsProps> = (props) => {
  const location = useLocation();
  const actionsRef = React.useRef<HTMLDivElement>(null);

  const { pkg } = useSiteData();

  const themeConfig = getThemeConfig();

  const { direction, updateSiteConfig } = React.useContext<SiteContextProps>(SiteContext);

  const { styles } = useStyle();

  const { pathname, search } = location;

  const getDropdownStyle = React.useMemo<React.CSSProperties>(
    () => (direction === 'rtl' ? { direction: 'ltr', textAlign: 'right' } : {}),
    [direction],
  );

  const docVersions: Record<string, string> = {
    [pkg.version]: pkg.version,
    ...themeConfig?.docVersions,
  };
  const versionOptions = Object.keys(docVersions).map((version) => ({
    value: docVersions[version],
    label: version,
  }));

  const onDirectionChange = () => {
    updateSiteConfig({ direction: direction !== 'rtl' ? 'rtl' : 'ltr' });
  };

  const handleVersionChange = React.useCallback((url: string) => {
    const currentUrl = window.location.href;
    const currentPathname = window.location.pathname;
    if (/overview/.test(currentPathname) && /0?[1-39][0-3]?x/.test(url)) {
      window.location.href = currentUrl
        .replace(window.location.origin, url)
        .replace(/\/components\/overview/, `/docs${/0(9|10)x/.test(url) ? '' : '/react'}/introduce`)
        .replace(/\/$/, '');
      return;
    }
    // Mirror url must have `/`, we add this for compatible
    const urlObj = new URL(currentUrl.replace(window.location.origin, url));
    if (urlObj.host.includes('antgroup')) {
      urlObj.pathname = `${urlObj.pathname.replace(/\/$/, '')}/`;
      window.location.href = urlObj.toString();
    } else {
      window.location.href = urlObj.href.replace(/\/$/, '');
    }
  }, []);

  const onLangChange = React.useCallback(() => {
    const currentProtocol = `${window.location.protocol}//`;
    const currentHref = window.location.href.slice(currentProtocol.length);

    if (utils.isLocalStorageNameSupported()) {
      localStorage.setItem('locale', utils.isZhCN(pathname) ? 'en-US' : 'zh-CN');
    }
    window.location.href =
      currentProtocol +
      currentHref.replace(
        window.location.pathname,
        utils.getLocalizedPathname(pathname, !utils.isZhCN(pathname), search).pathname,
      );
  }, [location]);

  const items = [
    <Button type="text" className={styles.select} key="version">
      <Select
        size="large"
        variant="borderless"
        defaultValue={pkg.version}
        onChange={handleVersionChange}
        dropdownStyle={getDropdownStyle}
        popupMatchSelectWidth={false}
        getPopupContainer={(trigger) => {
          return (
            props.isMini && actionsRef.current?.parentNode
              ? actionsRef.current?.parentNode?.parentNode
              : trigger.parentNode
          ) as HTMLElement;
        }}
        options={versionOptions}
      />
    </Button>,
    <SwitchBtn
      key="lang"
      onClick={onLangChange}
      value={utils.isZhCN(pathname) ? 1 : 2}
      label1="中"
      label2="En"
      tooltip1="中文 / English"
      tooltip2="English / 中文"
    />,
    <SwitchBtn
      key="direction"
      onClick={onDirectionChange}
      value={direction === 'rtl' ? 2 : 1}
      label1={<DirectionIcon direction="ltr" />}
      tooltip1="LTR"
      label2={<DirectionIcon direction="rtl" />}
      tooltip2="RTL"
      pure
      aria-label="RTL Switch Button"
    />,
    <a key="github" href="https://github.com/ant-design/x" target="_blank" rel="noreferrer">
      <SwitchBtn value={1} label1={<GithubOutlined />} tooltip1="Github" label2={null} pure />
    </a>,
  ];

  return (
    <div
      className={classnames(
        styles.actions,
        props.isMini && styles.mini,
        props.isMobile && styles.mobile,
        props.className,
      )}
      ref={actionsRef}
    >
      {items}
    </div>
  );
};

export default HeaderActions;
