import { CopyOutlined, ShareAltOutlined } from '@ant-design/icons';
import { Actions } from '@ant-design/x';
import React from 'react';
import SemanticPreview from '../../../.dumi/components/SemanticPreview';
import useLocale from '../../../.dumi/hooks/useLocale';

const items = [
  {
    key: 'copy',
    label: 'Copy',
    icon: <CopyOutlined />,
  },
  {
    key: 'more',
    subItems: [
      {
        key: 'share',
        label: 'Share',
        icon: <ShareAltOutlined />,
      },
      { key: 'import', label: 'Import' },
    ],
  },
];

const locales = {
  cn: {
    root: '根节点',
    item: '操作项',
    itemDropdown: '操作下拉选项',
    footer: '底部',
  },
  en: {
    root: 'Root',
    item: 'Item',
    itemDropdown: 'Item Dropdown',
    footer: 'Footer',
  },
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);

  return (
    <SemanticPreview
      componentName="Actions"
      semantics={[
        { name: 'root', desc: locale.root },
        { name: 'item', desc: locale.item },
        { name: 'itemDropdown', desc: locale.itemDropdown },
        { name: 'footer', desc: locale.footer },
      ]}
    >
      <Actions
        items={items}
        dropdownProps={{
          open: true,
          getPopupContainer: (triggerNode) => triggerNode.parentElement!,
          placement: 'topLeft',
        }}
        footer={<>footer</>}
        styles={{
          footer: {
            border: '1px solid #eee',
            padding: 8,
            borderRadius: 12,
          },
        }}
      />
    </SemanticPreview>
  );
};

export default App;
