import PluginMeta from '"@ant-design/x-markdown/es/version/plugin-meta.json';
import { createStyles, css } from 'antd-style';
import classnames from 'classnames';
/* eslint-disable react-hooks-extra/no-direct-set-state-in-use-effect */
import React from 'react';

const MARK_BORDER_SIZE = 2;

const useStyle = createStyles(({ token }, markPos: [number, number, number, number]) => ({
  container: css`
    position: relative;
  `,
  colWrap: css`
    border-right: 1px solid ${token.colorBorderSecondary};
    display: flex;
    justify-content: center;
    align-items: center;
    padding: ${token.paddingMD}px;
    overflow: hidden;
  `,
  listWrap: css`
    display: flex;
    flex-direction: column;
    list-style: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
  `,
  listItem: css`
    cursor: pointer;
    padding: ${token.paddingSM}px;
    transition: background-color ${token.motionDurationFast} ease;
    &:hover {
      background-color: ${token.controlItemBgHover};
    }
    &:not(:first-of-type) {
      border-top: 1px solid ${token.colorBorderSecondary};
    }
  `,
  markerActive: css`
    opacity: 1;
  `,
  markerNotActive: css`
    opacity: 0;
  `,
  markerMotion: css`
    transition:
      opacity ${token.motionDurationSlow} ease,
      all ${token.motionDurationSlow} ease;
  `,
  markerNotMotion: css`
    transition: opacity ${token.motionDurationSlow} ease;
  `,
}));

export interface MarkdownPluginsOverViewProps {
  items: any[];
  children: any;
}

const MarkdownPluginsOverView: React.FC<MarkdownPluginsOverViewProps> = (props) => {
  const { items, children } = props;
  console.log(PluginMeta, 111);

  // ======================== Hover =========================
  const containerRef = React.useRef<HTMLDivElement>(null);

  const { styles } = useStyle();

  // ======================== Render ========================
  return (
    <div className={classnames(styles.container)} ref={containerRef}>
      {children}
      {items?.map(({ name }) => (
        <>{name}</>
      ))}
    </div>
  );
};

export default MarkdownPluginsOverView;
