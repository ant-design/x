import { PlusOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import React from 'react';
import { useLocale } from '../../locale';
import enUS from '../../locale/en_US';
import type { CreationProps } from '../Creation';
export interface CreationLabelProps {
  shortcutKeysIcon?: string[];
  prefixCls: string;
}
const CreationLabel: React.FC<CreationLabelProps> = ({ shortcutKeysIcon, prefixCls }) => {
  const [contextLocale] = useLocale('Conversations', enUS.Conversations);
  const showShortcutKeys = !!shortcutKeysIcon?.length;
  return (
    <div
      className={classNames(prefixCls, { [`${prefixCls}-shortcut-keys-show`]: showShortcutKeys })}
    >
      <span>{contextLocale.create}</span>
      {showShortcutKeys && (
        <span className={classNames(`${prefixCls}-shortcut-keys`)}>
          {shortcutKeysIcon.map((keyIcon) => (
            <span className={classNames(`${prefixCls}-shortcut-key`)} key={keyIcon}>
              {keyIcon}
            </span>
          ))}
        </span>
      )}
    </div>
  );
};
interface BaseConfig {
  label: React.ReactNode;
  icon: React.ReactNode;
  align: CreationProps['align'];
}

const useCreation = ({
  icon,
  label,
  align,
  shortcutKeyInfo,
  prefixCls,
}: Pick<CreationProps, 'label' | 'icon' | 'align' | 'shortcutKeyInfo' | 'prefixCls'>): [
  React.ReactNode,
  React.ReactNode,
  CreationProps['align'],
] => {
  const { shortcutKeysIcon } = shortcutKeyInfo || {};

  const creationConfig: BaseConfig = {
    label: (
      <CreationLabel
        prefixCls={`${prefixCls}-label`}
        shortcutKeysIcon={shortcutKeysIcon as string[]}
      />
    ),
    icon: <PlusOutlined className={`${prefixCls}-icon`} />,
    align: 'center',
  };

  if (label) {
    creationConfig.label =
      typeof label === 'function'
        ? label({ shortcutKeyInfo, components: { CreationLabel } })
        : label;
  }
  if (icon) {
    creationConfig.icon = typeof icon === 'function' ? icon() : icon;
  }

  return [creationConfig.icon, creationConfig.label, align || creationConfig.align];
};

export default useCreation;
