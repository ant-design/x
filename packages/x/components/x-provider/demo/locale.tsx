import {
  CodeOutlined,
  FileImageOutlined,
  FileSearchOutlined,
  SignatureOutlined,
} from '@ant-design/icons';
import { Conversations, XProvider } from '@ant-design/x';
import type { XProviderProps } from '@ant-design/x';
import enUS_X from '@ant-design/x/locale/en_US';
import zhCN_X from '@ant-design/x/locale/zh_CN';
import { Card, Flex, Radio, RadioChangeEvent, Typography } from 'antd';
import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';
import React, { useState } from 'react';
type Locale = XProviderProps['locale'];

const items_locale = {
  en: {
    write: 'Help Me Write',
    coding: 'AI Coding',
    createImage: 'Create Image',
    deepSearch: 'Deep Search',
  },
  zh: {
    write: '帮我写作',
    coding: 'AI编码',
    createImage: '图片生成',
    deepSearch: '深度搜索',
  },
};
export default () => {
  const [localeType, setLocaleType] = useState<'zh' | 'en'>('zh');

  // 如果您的项目使用了antd 那么可以将antd的locale合并传入XProvider
  // If your project uses antd, you need to merge antd's locale into XProvider
  const [locale, setLocal] = useState<Locale>({ ...zhCN, ...zhCN_X });
  const changeLocale = (e: RadioChangeEvent) => {
    const localeValue = e.target.value;
    setLocaleType(localeValue);
    setLocal(localeValue === 'zh' ? { ...zhCN, ...zhCN_X } : { ...enUS, ...enUS_X });
  };

  return (
    <>
      <Flex gap={12} style={{ marginBottom: 16 }} align="center">
        <Typography.Text>Change locale of components:</Typography.Text>
        <Radio.Group value={localeType} onChange={changeLocale}>
          <Radio.Button value="en">English</Radio.Button>
          <Radio.Button value="zh">中文</Radio.Button>
        </Radio.Group>
      </Flex>
      <Card>
        <XProvider locale={locale}>
          <Conversations
            style={{ width: 200 }}
            defaultActiveKey="write"
            creation={{
              onClick: () => {},
            }}
            items={[
              {
                key: 'write',
                label: items_locale[localeType].write,
                icon: <SignatureOutlined />,
              },
              {
                key: 'coding',
                label: items_locale[localeType].coding,
                icon: <CodeOutlined />,
              },
              {
                key: 'createImage',
                label: items_locale[localeType].createImage,
                icon: <FileImageOutlined />,
              },
              {
                key: 'deepSearch',
                label: items_locale[localeType].deepSearch,
                icon: <FileSearchOutlined />,
              },
            ]}
          />
        </XProvider>
      </Card>
    </>
  );
};
