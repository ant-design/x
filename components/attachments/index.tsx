import { Button, Typography } from 'antd';
import type { GetProp, UploadProps } from 'antd';
import classnames from 'classnames';
import React from 'react';

import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useXProviderContext } from '../x-provider';

import { useMergedState } from 'rc-util';
import DropUploader from './DropUploader';
import PlaceholderUploader, { PlaceholderProps } from './PlaceholderUploader';
import SilentUploader from './SilentUploader';
import useStyle from './style';

export type SemanticType = 'list' | 'item' | 'itemContent' | 'title';

export type Attachment = GetProp<UploadProps, 'fileList'>[number];

export interface AttachmentsProps extends Omit<UploadProps, 'fileList'> {
  prefixCls?: string;
  style?: React.CSSProperties;
  className?: string;

  getDropContainer?: null | (() => HTMLElement | null | undefined);

  items?: Attachment[];
  children?: React.ReactElement;

  // ============= placeholder =============
  placeholder?: Pick<PlaceholderProps, 'icon' | 'title' | 'description'>;
}

const Attachments: React.FC<AttachmentsProps> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    style,
    items,
    children,
    getDropContainer,
    placeholder,
    onChange,
    ...uploadProps
  } = props;

  // ============================ PrefixCls ============================
  const { getPrefixCls, direction } = useXProviderContext();

  const prefixCls = getPrefixCls('attachment', customizePrefixCls);

  // ===================== Component Config =========================
  const contextConfig = useXComponentConfig('attachments');

  // ============================ Style ============================
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

  const cssinjsCls = classnames(hashId, cssVarCls);

  // ============================ Upload ============================
  const [fileList, setFileList] = useMergedState([], {
    value: items,
  });

  const mergedUploadProps: UploadProps = {
    ...uploadProps,
    fileList,
    onChange: (info) => {
      setFileList(info.fileList);
      onChange?.(info);
    },
  };

  // ============================ Render ============================
  if (children) {
    return (
      <>
        <SilentUploader upload={mergedUploadProps}>{children}</SilentUploader>
        <DropUploader
          getDropContainer={getDropContainer}
          prefixCls={prefixCls}
          className={cssinjsCls}
        >
          <PlaceholderUploader
            {...placeholder}
            upload={mergedUploadProps}
            prefixCls={prefixCls}
            className={cssinjsCls}
          />
        </DropUploader>
      </>
    );
  }

  return wrapCSSVar(<div>2333</div>);
};

if (process.env.NODE_ENV !== 'production') {
  Attachments.displayName = 'Attachments';
}

export default Attachments;
