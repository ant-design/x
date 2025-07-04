import { XProvider } from '@ant-design/x';
import { Tabs } from 'antd';
import SourceCode from 'dumi/theme-default/builtins/SourceCode';
import type { Tab } from 'rc-tabs/lib/interface';
import React from 'react';

import BunLogo from './bun';
import NpmLogo from './npm';
import PnpmLogo from './pnpm';
import UtooLogo from './utoo';
import YarnLogo from './yarn';

interface InstallProps {
  npm?: string;
  yarn?: string;
  pnpm?: string;
  bun?: string;
  utoo?: string;
}

const InstallDependencies: React.FC<InstallProps> = (props) => {
  const { npm, yarn, pnpm, bun, utoo } = props;
  const items: Tab[] = [
    {
      key: 'npm',
      label: 'npm',
      children: npm ? <SourceCode lang="bash">{npm}</SourceCode> : null,
      icon: <NpmLogo />,
    },
    {
      key: 'yarn',
      label: 'yarn',
      children: yarn ? <SourceCode lang="bash">{yarn}</SourceCode> : null,
      icon: <YarnLogo />,
    },
    {
      key: 'pnpm',
      label: 'pnpm',
      children: pnpm ? <SourceCode lang="bash">{pnpm}</SourceCode> : null,
      icon: <PnpmLogo />,
    },
    {
      key: 'bun',
      label: 'Bun',
      children: bun ? <SourceCode lang="bash">{bun}</SourceCode> : null,
      icon: <BunLogo />,
    },
    {
      key: 'utoo',
      label: 'utoo',
      children: utoo ? <SourceCode lang="bash">{utoo}</SourceCode> : null,
      icon: <UtooLogo />,
    },
  ].filter((item) => item.children);

  return (
    <XProvider theme={{ components: { Tabs: { horizontalMargin: '0' } } }}>
      <Tabs className="markdown" size="small" defaultActiveKey="npm" items={items} />
    </XProvider>
  );
};

export default InstallDependencies;
