import { CopyOutlined, SyncOutlined, UserOutlined } from '@ant-design/icons';
import { Bubble } from '@ant-design/x';
import { Avatar, Button, Space, theme } from 'antd';
import React from 'react';
import SemanticPreview from '../../../.dumi/components/SemanticPreview';
import useLocale from '../../../.dumi/hooks/useLocale';

const locales = {
  cn: {
    root: '气泡根节点',
    body: '主体容器',
    avatar: '头像的外层容器',
    header: '头部的容器',
    content: '聊天内容的容器',
    footer: '底部的容器',
    extra: '气泡尾边栏容器',
  },
  en: {
    root: 'Bubble root',
    body: 'Wrapper element of the body',
    avatar: 'Wrapper element of the avatar',
    header: 'Wrapper element of the header',
    content: 'Wrapper element of the content',
    footer: 'Wrapper element of the footer',
    extra: 'Wrapper element of the extra',
  },
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);

  const { token } = theme.useToken();

  return (
    <SemanticPreview
      componentName="Bubble"
      semantics={[
        { name: 'root', desc: locale.root },
        { name: 'body', desc: locale.body },
        { name: 'avatar', desc: locale.avatar },
        { name: 'header', desc: locale.header },
        { name: 'content', desc: locale.content },
        { name: 'footer', desc: locale.footer },
        { name: 'extra', desc: locale.extra },
      ]}
    >
      <Bubble
        content="Feel free to use Ant Design !"
        avatar={<Avatar size={32} icon={<UserOutlined />} />}
        header="Ant Design X"
        extra={<Button color="default" variant="text" size="small" icon={<CopyOutlined />} />}
        footer={
          <Space size={token.paddingXXS}>
            <Button color="default" variant="text" size="small" icon={<SyncOutlined />} />
          </Space>
        }
      />
    </SemanticPreview>
  );
};

export default App;
