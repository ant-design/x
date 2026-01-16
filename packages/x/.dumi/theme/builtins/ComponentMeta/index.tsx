import { CompassOutlined, EditOutlined, GithubOutlined, HistoryOutlined } from '@ant-design/icons';
import type { GetProp } from 'antd';
import { Descriptions, Flex, Tooltip, Typography, theme } from 'antd';
import { createStyles, css } from 'antd-style';
import kebabCase from 'lodash/kebabCase';
import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import useLocale from '../../../hooks/useLocale';
import ComponentChangelog from '../../common/ComponentChangelog';
import Link from '../../common/Link';

const locales = {
  cn: {
    import: '使用',
    copy: '复制',
    copied: '已复制',
    source: '源码',
    docs: '文档',
    edit: '编辑此页',
    changelog: '更新日志',
    design: '设计指南',
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
    design: 'Design',
    version: 'Version',
  },
};

const branchUrl = 'https://github.com/ant-design/x/edit/main/packages/x/';

function isVersionNumber(value?: string) {
  return value && /^\d+\.\d+\.\d+$/.test(value);
}

const useStyle = createStyles(({ token }) => ({
  code: css`
    cursor: pointer;
    position: relative;
    display: inline-flex;
    align-items: center;
    column-gap: ${token.paddingXXS}px;
    border-radius: ${token.borderRadiusSM}px;
    padding-inline: ${token.paddingXXS}px !important;
    transition: all ${token.motionDurationSlow} !important;
    font-family: ${token.codeFamily};
    color: ${token.colorTextSecondary} !important;
    &:hover {
      background: ${token.controlItemBgHover};
    }
    a&:hover {
      text-decoration: underline !important;
    }
  `,
  icon: css`
    margin-inline-end: 3px;
  `,
}));

export interface ComponentMetaProps {
  component: string;
  source: string | true;
  filename?: string;
  version?: string;
  packageName?: string;
  designUrl?: string;
}

const ComponentMeta: React.FC<ComponentMetaProps> = (props) => {
  const { component, packageName = 'x', source, filename, version, designUrl } = props;
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

  const getPackageCodeUrl = (kebabComponent: string, packageName: string) => {
    switch (packageName) {
      case 'x-sdk': {
        const sdkComponent = kebabComponent.replace('use-', '');
        return [
          `https://github.com/ant-design/x/blob/main/packages/x-sdk/src/${sdkComponent}`,
          `x-sdk/src/${sdkComponent}`,
        ];
      }
      case 'x-markdown':
        return [
          `https://github.com/ant-design/x/blob/main/packages/x-markdown/src/${kebabComponent}`,
          `x-markdown/src/${kebabComponent}`,
        ];
      case 'x-markdown/plugins':
        return [
          `https://github.com/ant-design/x/blob/main/packages/x-markdown/src/plugins/${kebabComponent}`,
          `x-markdown/src/plugins/${kebabComponent}`,
        ];
      default:
        return [
          `https://github.com/ant-design/x/blob/main/packages/x/components/${kebabComponent}`,
          `x/components/${kebabComponent}`,
        ];
    }
  };
  // ======================== Source ========================
  const [filledSource, abbrSource] = React.useMemo(() => {
    if (String(source) === 'true') {
      const kebabComponent = kebabCase(component);
      return getPackageCodeUrl(kebabComponent, packageName);
    }

    if (typeof source !== 'string') {
      return [null, null];
    }

    return [source, source];
  }, [component, source, packageName]);

  const transformComponentName = (componentName: string) => {
    if (componentName === 'Notification') {
      return componentName.toLowerCase();
    }
    return componentName;
  };

  // ======================== Render ========================
  const importList =
    packageName !== 'x-markdown/plugins'
      ? `import { ${transformComponentName(component)} } from "@ant-design/${packageName}";`
      : `import ${transformComponentName(component)} from "@ant-design/x-markdown/plugins/${transformComponentName(component)}";`;

  return (
    <Descriptions
      size="small"
      colon={false}
      column={1}
      style={{ marginTop: token.margin }}
      styles={{
        label: { paddingInlineEnd: token.padding, width: 56 },
      }}
      items={
        [
          {
            label: locale.import,
            children: (
              <CopyToClipboard text={importList} onCopy={onCopy}>
                <Tooltip
                  placement="right"
                  title={copied ? locale.copied : locale.copy}
                  onOpenChange={onOpenChange}
                >
                  <Typography.Text className={styles.code} onClick={onCopy}>
                    {importList}
                  </Typography.Text>
                </Tooltip>
              </CopyToClipboard>
            ),
          },
          filledSource && {
            label: locale.source,
            children: (
              <Typography.Link
                className={styles.code}
                href={filledSource}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GithubOutlined className={styles.icon} />
                <span>{abbrSource}</span>
              </Typography.Link>
            ),
          },
          filename && {
            label: locale.docs,
            children: (
              <Flex justify="flex-start" align="center" gap="small">
                <Typography.Link
                  className={styles.code}
                  href={`${branchUrl}${filename}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <EditOutlined className={styles.icon} />
                  <span>{locale.edit}</span>
                </Typography.Link>
                {designUrl && (
                  <Link className={styles.code} to={designUrl}>
                    <CompassOutlined className={styles.icon} />
                    <span>{locale.design}</span>
                  </Link>
                )}
                <ComponentChangelog>
                  <Typography.Link className={styles.code}>
                    <HistoryOutlined className={styles.icon} />
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
                {isZhCN ? `自 ${version} 起支持` : `supported since ${version}`}
              </Typography.Text>
            ),
          },
        ].filter(Boolean) as GetProp<typeof Descriptions, 'items'>
      }
    />
  );
};

export default ComponentMeta;
