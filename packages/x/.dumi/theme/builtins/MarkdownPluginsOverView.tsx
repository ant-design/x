import PluginMeta from '@ant-design/x-markdown/plugins/version/plugin-meta.json';
import { List } from 'antd';
import { createStyles, css } from 'antd-style';
import classnames from 'classnames';
import { Link } from 'dumi';
import React from 'react';
import useLocale from '../../hooks/useLocale';

interface PluginItem {
  plugin: string;
  [key: string]: any;
}

const useStyle = createStyles(({ token }) => ({
  container: css`
    border-radius: ${token.borderRadiusLG}px;
    border: 1px solid ${token.colorSplit};
  `,
  item: css`
    a {
      width: 100%;
    }
    cursor: pointer;
    transition: all ${token.motionDurationMid} ${token.motionEaseInOut};
    &:hover {
      background-color: ${token.colorFillQuaternary};
    }
  `,
  itemMeta: css`
    padding-inline: ${token.padding}px};
  `,
}));

const MarkdownPluginsOverView: React.FC<null> = () => {
  // ======================== locale =========================
  const [_, lang] = useLocale();

  // ======================== style =========================

  const { styles } = useStyle();

  // ======================== info =========================
  const getInfo = (item: any) => {
    const description = lang === 'cn' ? item?.desc : item?.descEn;
    const hrefBase = item?.plugin?.toLowerCase();
    const href =
      lang === 'cn' ? `/x-markdowns/plugin-${hrefBase}-cn` : `/x-markdowns/plugin-${hrefBase}`;
    return {
      description,
      href,
    };
  };

  // ======================== Render ========================
  return (
    <List
      itemLayout="horizontal"
      className={classnames(styles.container)}
      dataSource={PluginMeta || []}
      renderItem={(item: PluginItem) => {
        const info = getInfo(item);
        return (
          <List.Item className={classnames(styles.item)}>
            <Link to={info?.href}>
              <List.Item.Meta
                className={classnames(styles.itemMeta)}
                title={item?.plugin}
                description={info.description}
              />
            </Link>
          </List.Item>
        );
      }}
    />
  );
};

export default MarkdownPluginsOverView;
