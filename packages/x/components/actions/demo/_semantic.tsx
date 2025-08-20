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
    itemDropdown: '操作下拉选项'
  },
  en: {
    root: 'Root',
    item: 'Item',
    itemDropdown: 'Item Dropdown'
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
        { name: 'itemDropdown', desc: locale.itemDropdown }
      ]}
    >
      <Actions
        items={items}
        dropdownProps={{
          open: true,
          getPopupContainer: (triggerNode) => triggerNode.parentElement!,
          placement: 'topLeft',
        }}
      />
    </SemanticPreview>
  );
};

export default App;
