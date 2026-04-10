import { Empty, Flex, Spin } from 'antd';
import { clsx } from 'clsx';
import React from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import ActionsCopy from '../actions/ActionsCopy';
import { useLocale } from '../locale';
import enUS from '../locale/en_US';
import { useXProviderContext } from '../x-provider';
import type { FolderProps } from '.';
import type { FolderTreeData } from './DirectoryTree';
import useStyle from './style';

export interface FileViewProps {
  prefixCls?: string;
  style?: React.CSSProperties;
  classNames?: FolderProps['classNames'];
  styles?: FolderProps['styles'];
  selectedFile?: string[] | null;
  previewRender?: FolderProps['previewRender'];
  fileContent?: string;
  loading?: boolean;
  previewTitle?: FolderProps['previewTitle'];
  getFileNode?: (
    path: string[],
  ) => { title: FolderTreeData['title']; path: string; content?: string } | undefined;
  emptyRender?: FolderProps['emptyRender'];
}

const customOneLight = {
  ...oneLight,
  'pre[class*="language-"]': {
    ...oneLight['pre[class*="language-"]'],
    margin: 0,
    background: 'transparent',
    padding: 0,
    borderRadius: 0,
  },
};

const FileView: React.FC<FileViewProps> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    classNames,
    styles,
    style,
    selectedFile,
    fileContent = '',
    loading = false,
    previewTitle,
    getFileNode,
    emptyRender,
    previewRender,
  } = props;

  const [contextLocale] = useLocale('Folder', enUS.Folder);
  // ============================ Prefix ============================
  const { getPrefixCls } = useXProviderContext();
  const prefixCls = getPrefixCls('folder', customizePrefixCls);
  const contextConfig = useXComponentConfig('folder');
  const previewCls = `${prefixCls}-preview`;
  const [hashId, cssVarCls] = useStyle(prefixCls);
  // ============================ Helpers ============================
  const getFileExtension = (path = '') => {
    const parts = path.split('.');
    return parts[parts.length - 1] || '';
  };

  const getLanguageFromExtension = (ext: string) => {
    return ext.toLowerCase() || 'txt';
  };

  // ============================ Render ============================
  const renderContent = () => {
    if (loading) {
      return (
        <div className={clsx(`${previewCls}-loading-container`, classNames?.previewRender)}>
          <Spin />
        </div>
      );
    }

    if (!selectedFile || selectedFile.length === 0) {
      // 如果 emptyRender 为 false,则不显示空状态
      if (emptyRender === false) {
        return null;
      }

      const emptyNode =
        typeof emptyRender === 'function'
          ? emptyRender()
          : emptyRender || (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={contextLocale.selectFile} />
            );

      return (
        <div className={clsx(`${previewCls}-empty-container`, classNames?.previewRender)}>
          {emptyNode}
        </div>
      );
    }

    const fileNode = getFileNode?.(selectedFile);
    const title = fileNode?.title || selectedFile[selectedFile.length - 1];
    const path = selectedFile;

    // Get file extension from filename
    const fileName = selectedFile[selectedFile.length - 1];
    const extension = getFileExtension(fileName);
    const language = getLanguageFromExtension(extension);

    // Handle custom content title
    let headerNode: React.ReactNode;
    if (previewTitle === false) {
      // 如果 previewTitle 为 false,则不显示标题
      headerNode = null;
    } else if (previewTitle) {
      headerNode =
        typeof previewTitle === 'function'
          ? previewTitle({ title, path, content: fileContent })
          : previewTitle;
    } else {
      headerNode = (
        <Flex justify="space-between" align="center" className={`${previewCls}-title`}>
          <span className={`${previewCls}-filename`}>{title}</span>
          <ActionsCopy text={fileContent} className={`${previewCls}-copy`} />
        </Flex>
      );
    }

    // Handle custom preview content
    let contentNode: React.ReactNode;
    const originContentNode = (
      <SyntaxHighlighter
        language={language}
        wrapLines={true}
        style={customOneLight}
        codeTagProps={{ style: { background: 'transparent' } }}
      >
        {fileContent.replace(/\n$/, '')}
      </SyntaxHighlighter>
    );
    if (previewRender) {
      if (typeof previewRender === 'function') {
        contentNode = previewRender(
          {
            content: fileContent,
            path: selectedFile,
            title: fileNode?.title,
            language,
          },
          {
            originNode: originContentNode,
          },
        );
      } else {
        contentNode = previewRender;
      }
    } else {
      contentNode = (
        <SyntaxHighlighter
          language={language}
          wrapLines={true}
          style={customOneLight}
          codeTagProps={{ style: { background: 'transparent' } }}
        >
          {fileContent.replace(/\n$/, '')}
        </SyntaxHighlighter>
      );
    }

    return (
      <>
        <div className={clsx(`${previewCls}-title-wrapper`, classNames?.previewTitle)}>
          {headerNode}
        </div>
        <div className={clsx(`${previewCls}-content`, classNames?.previewRender)}>
          {contentNode}
        </div>
      </>
    );
  };

  return (
    <div
      className={clsx(`${prefixCls}-preview`, classNames?.filePreview, hashId, cssVarCls)}
      style={{ ...contextConfig.styles?.filePreview, ...styles?.filePreview, ...style }}
    >
      {renderContent()}
    </div>
  );
};

export default FileView;
