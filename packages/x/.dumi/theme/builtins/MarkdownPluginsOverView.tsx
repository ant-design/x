import PluginMeta from '@ant-design/x-markdown/es/version/plugin-meta.json';
import { List } from 'antd';
import { createStyles, css } from 'antd-style';
import classnames from 'classnames';
import React from 'react';
import useLocale from '../../hooks/useLocale';

const useStyle = createStyles(({ token }) => ({
  container: css`
    position: relative;
  `,
}));

export interface MarkdownPluginsOverViewProps {
  items: any[];
  children: any;
}

const MarkdownPluginsOverView: React.FC<MarkdownPluginsOverViewProps> = (props) => {
  const { items, children } = props;

  // ======================== locale =========================
  const [_, lang] = useLocale();

  // ======================== Hover =========================
  const containerRef = React.useRef<HTMLDivElement>(null);

  const { styles } = useStyle();

  // ======================== Render ========================
  return (
    <div className={classnames(styles.container)} ref={containerRef}>
      <List
        itemLayout="horizontal"
        dataSource={PluginMeta || []}
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta
              title={item?.plugin}
              description={lang === 'cn' ? item?.desc : item?.descEn}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default MarkdownPluginsOverView;
