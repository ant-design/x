import { AntDesignOutlined, CopyOutlined, SyncOutlined } from '@ant-design/icons';
import { Bubble } from '@ant-design/x';
import { Avatar, Button, Space, theme } from 'antd';
import React from 'react';
import SemanticPreview from '../../../.dumi/components/SemanticPreview';
import useLocale from '../../../.dumi/hooks/useLocale';
import { BubbleListProps } from '../interface';

const locales = {
  cn: {
    root: '对话列表根节点',
    'bubble.root': '对话气泡容器',
    'bubble.body': '对话气泡的主体容器',
    'bubble.avatar': '对话气泡的头像的外层容器',
    'bubble.header': '对话气泡的头部的容器',
    'bubble.content': '对话气泡的聊天内容的容器',
    'bubble.footer': '对话气泡的底部的容器',
    'bubble.extra': '对话气泡的尾边栏容器',
    'system.root': '系统气泡容器',
    'system.body': '系统气泡的主体容器',
    'system.content': '系统气泡的聊天内容的容器',
    'divider.root': '分割线气泡容器',
    'divider.divider.root': '分割线容器',
    'divider.divider.rail': '分割线的背景条元素',
    'divider.divider.content': '分割线的内容元素',
  },
  en: {
    root: 'Bubble list root node',
    'bubble.root': 'Bubble container',
    'bubble.body': 'Bubble main body container',
    'bubble.avatar': 'Bubble avatar outer container',
    'bubble.header': 'Bubble header container',
    'bubble.content': 'Bubble chat content container',
    'bubble.footer': 'Bubble footer container',
    'bubble.extra': 'Bubble sidebar container',
    'system.root': 'Bubble.System container',
    'system.body': 'Bubble.System main body container',
    'system.content': 'Bubble.System content container',
    'divider.root': 'Bubble root element of Bubble.Divider',
    'divider.divider.root': 'Divider root element in Bubble.Divider',
    'divider.divider.rail': 'Content element of Divider in Bubble.Divider',
    'divider.divider.content': 'Background rail element of Divider in Bubble.Divider',
  },
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);

  const { token } = theme.useToken();
  const memoRole: BubbleListProps['role'] = React.useMemo(
    () => ({
      ai: {
        typing: true,
        components: {
          header: 'AI',
          extra: <Button color="default" variant="text" size="small" icon={<CopyOutlined />} />,
          avatar: () => <Avatar icon={<AntDesignOutlined />} />,
          footer: (
            <Space size={token.paddingXXS}>
              <Button color="default" variant="text" size="small" icon={<SyncOutlined />} />
            </Space>
          ),
        },
      },
      user: () => ({
        placement: 'end',
      }),
    }),
    [],
  );
  return (
    <SemanticPreview
      componentName="Bubble.List"
      semantics={[
        { name: 'root', desc: locale.root },
        { name: 'bubble.root', desc: locale['bubble.root'] },
        { name: 'bubble.body', desc: locale['bubble.body'] },
        { name: 'bubble.avatar', desc: locale['bubble.avatar'] },
        { name: 'bubble.header', desc: locale['bubble.header'] },
        { name: 'bubble.content', desc: locale['bubble.content'] },
        { name: 'bubble.footer', desc: locale['bubble.footer'] },
        { name: 'bubble.extra', desc: locale['bubble.extra'] },
        { name: 'system.root', desc: locale['bubble.root'] },
        { name: 'system.body', desc: locale['bubble.body'] },
        { name: 'system.content', desc: locale['bubble.content'] },
        { name: 'divider.root', desc: locale['bubble.root'] },
        { name: 'divider.divider.root', desc: locale['divider.divider.root'] },
        { name: 'divider.divider.rail', desc: locale['divider.divider.rail'] },
        { name: 'divider.divider.content', desc: locale['divider.divider.content'] },
      ]}
    >
      <Bubble.List
        role={memoRole}
        items={[
          { role: 'system', content: 'Welcome to Ant Design X', key: 'system' },
          { role: 'divider', content: 'divider', key: 'divider' },
          {
            role: 'user',
            content: 'hello, Ant Design X',
            key: 'user',
          },
          {
            role: 'ai',
            content: 'hello',
            key: 'ai',
          },
        ]}
        onScroll={(e) => {
          console.log('scroll', (e.target as HTMLDivElement).scrollTop);
        }}
      />
    </SemanticPreview>
  );
};

export default App;
