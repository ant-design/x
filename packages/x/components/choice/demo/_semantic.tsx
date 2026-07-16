import { ClockCircleOutlined, GlobalOutlined, TagOutlined } from '@ant-design/icons';
import { Choice, type ChoiceProps } from '@ant-design/x';
import { Flex } from 'antd';
import React from 'react';
import SemanticPreview from '../../../.dumi/components/SemanticPreview';
import useLocale from '../../../.dumi/hooks/useLocale';

const locales = {
  cn: {
    root: '根节点',
    header: '头部区域（标题 + 描述）',
    title: '标题',
    description: '描述文本',
    list: '列表容器',
    item: '选项项',
    itemContent: '选项内容',
    indicator: '选择指示器',
    footer: '底部操作区',
  },
  en: {
    root: 'Root',
    header: 'Header (title + description)',
    title: 'Title',
    description: 'Description text',
    list: 'List container',
    item: 'Item',
    itemContent: 'Item content',
    indicator: 'Indicator',
    footer: 'Footer',
  },
};

const items: ChoiceProps['items'] = [
  {
    key: '1',
    icon: <ClockCircleOutlined style={{ color: '#1890FF' }} />,
    label: '按时间',
    description: '按时间趋势分析',
  },
  {
    key: '2',
    icon: <GlobalOutlined style={{ color: '#52C41A' }} />,
    label: '按地区',
    description: '按地域分布分析',
  },
  {
    key: '3',
    icon: <TagOutlined style={{ color: '#722ED1' }} />,
    label: '按品类',
    description: '按商品类别分析',
  },
];

const App: React.FC = () => {
  const [locale] = useLocale(locales);

  return (
    <Flex vertical>
      <SemanticPreview
        componentName="Choice"
        semantics={[
          { name: 'root', desc: locale.root },
          { name: 'header', desc: locale.header },
          { name: 'title', desc: locale.title },
          { name: 'description', desc: locale.description },
          { name: 'list', desc: locale.list },
          { name: 'item', desc: locale.item },
          { name: 'itemContent', desc: locale.itemContent },
          { name: 'indicator', desc: locale.indicator },
          { name: 'footer', desc: locale.footer },
        ]}
      >
        <Choice
          title="请选择数据分析维度"
          description="选择最符合您需求的维度"
          items={items}
          confirmable
          confirmText="确认"
        />
      </SemanticPreview>
    </Flex>
  );
};

export default App;
