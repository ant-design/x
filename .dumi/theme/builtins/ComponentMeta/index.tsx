import { EditOutlined, GithubOutlined, HistoryOutlined } from '@ant-design/icons';
import type { GetProp } from 'antd';
import { Descriptions, Flex, Tooltip, Typography, theme } from 'antd';
import { createStyles, css } from 'antd-style';
import kebabCase from 'lodash/kebabCase';
import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import useLocale from '../../../hooks/useLocale';
import ComponentChangelog from '../../common/ComponentChangelog';

const locales = {
  cn: {
    import: '使用',
    copy: '复制',
    copied: '已复制',
    source: '源码',
    docs: '文档',
    edit: '编辑此页',
    changelog: '更新日志',
    version: '版本',
  },
  en: {
    import: 'Import',
    copy: 'Copy',
    copied: 'Copied',
    source: 'Source',
    docs: 'Docs',
    edit: 'Edit this page',
    changelog: 'Changelog',
    version: 'Version',
  },
};

const branchUrl = 'https://github.com/ant-design/x/edit/main/';

function isVersionNumber(value?: string) {
  return value && /^\d+\.\d+\.\d+$/.test(value);
}

const useStyle = createStyles(({ token }) => ({
  code: css`
    cursor: pointer;
    position: relative;
    align-items: center;
    border-radius: ${token.borderRadiusSM}px;
    padding-inline: ${token.paddingXXS}px !important;
    transition: all ${token.motionDurationSlow} !important;
    color: ${token.colorTextSecondary} !important;

    > code {
      padding: 0;
      border: 0;
      background: transparent;
      display: inline-flex;
      column-gap: ${token.paddingXXS}px;
      line-height: 1;
      font-size: 13px;
      font-family: ${token.codeFamily};
    }
  
    &:hover {
      background: ${token.controlItemBgHover};
    }

    a&:hover {
      text-decoration: underline !important;
    }
  `,
  import: css`
    color: ${token.magenta8};
  `,
  component: css`
    color: ${token.colorText};
  `,
  from: css`
    color: ${token.magenta8};
    margin-inline-end: 0.5em;
  `,
  antdx: css`
    color: ${token.green8};
  `,
  semicolon: css`
    color: ${token.colorText};
  `,
}));

export interface ComponentMetaProps {
  component: string;
  source: string | true;
  filename?: string;
  version?: string;
}

const ComponentMeta: React.FC<ComponentMetaProps> = (props) => {
  const { component, source, filename, version } = props;
  const { token } = theme.useToken();
  const [locale, lang] = useLocale(locales);
  const isZhCN = lang === 'cn';
  const { styles } = useStyle();

  // ========================= Copy =========================
  const [copied, setCopied] = React.useState(false);

  const onCopy = () => {
    setCopied(true);
  };

  const onOpenChange = (open: boolean) => {
    if (open) {
      setCopied(false);
    }
  };

  // ======================== Source ========================
  const [filledSource, abbrSource] = React.useMemo(() => {
    if (String(source) === 'true') {
      const kebabComponent = kebabCase(component);
      return [
        `https://github.com/ant-design/x/blob/main/components/${kebabComponent}`,
        `components/${kebabComponent}`,
      ];
    }

    if (typeof source !== 'string') {
      return [null, null];
    }

    return [source, source];
  }, [component, source]);

  const transformComponentName = (componentName: string) => {
    if (componentName === 'Notifiction' || componentName === 'Message') {
      return componentName.toLowerCase();
    }
    return componentName;
  };

  // ======================== Render ========================
  const importList = [
    <span key="import" className={styles.import}>
      import
    </span>,
    <span key="component" className={styles.component}>{`{ ${transformComponentName(
      component,
    )} }`}</span>,
    <span key="from" className={styles.from}>
      from
    </span>,
    <span key="@ant-design/x" className={styles.antdx}>
      {`"@ant-design/x"`}
    </span>,
    <span key="semicolon" className={styles.semicolon}>
      ;
    </span>,
  ];

  return (
    <Descriptions
      size="small"
      colon={false}
      column={1}
      style={{ marginTop: token.margin }}
      labelStyle={{ paddingInlineEnd: token.padding, width: 56 }}
      items={
        [
          {
            label: locale.import,
            children: (
              <CopyToClipboard
                text={`import { ${component} } from "@ant-design/x";`}
                onCopy={onCopy}
              >
                <Tooltip
                  placement="right"
                  title={copied ? locale.copied : locale.copy}
                  onOpenChange={onOpenChange}
                >
                  <pre className={styles.code} onClick={onCopy}>
                    <code>{importList}</code>
                  </pre>
                </Tooltip>
              </CopyToClipboard>
            ),
          },
          filledSource && {
            label: locale.source,
            children: (
              <Typography.Link className={styles.code} href={filledSource} target="_blank">
                <GithubOutlined style={{ marginInlineEnd: 4 }} />
                <span>{abbrSource}</span>
              </Typography.Link>
            ),
          },
          filename && {
            label: locale.docs,
            children: (
              <Flex gap={16}>
                <Typography.Link
                  className={styles.code}
                  href={`${branchUrl}${filename}`}
                  target="_blank"
                >
                  <EditOutlined style={{ marginInlineEnd: 4 }} />
                  <span>{locale.edit}</span>
                </Typography.Link>
                <ComponentChangelog>
                  <Typography.Link className={styles.code}>
                    <HistoryOutlined style={{ marginInlineEnd: 4 }} />
                    <span>{locale.changelog}</span>
                  </Typography.Link>
                </ComponentChangelog>
              </Flex>
            ),
          },
          isVersionNumber(version) && {
            label: locale.version,
            children: (
              <Typography.Text className={styles.code}>
                {isZhCN ? `自 ${version} 后支持` : `supported since ${version}`}
              </Typography.Text>
            ),
          },
        ].filter(Boolean) as GetProp<typeof Descriptions, 'items'>
      }
    />
  );
};

export default ComponentMeta;
