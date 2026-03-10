import { useControlledState } from '@rc-component/util';
import type { TreeProps } from 'antd';
import { Flex, Splitter } from 'antd';
import { clsx } from 'clsx';
import React, { useCallback, useEffect, useState } from 'react';
import useProxyImperativeHandle from '../_util/hooks/use-proxy-imperative-handle';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useLocale } from '../locale';
import enUS from '../locale/en_US';
import { useXProviderContext } from '../x-provider';
import DirectoryTree, { type FolderTreeData } from './DirectoryTree';
import FilePreview from './FilePreview';
import useStyle from './style';

// File content service interface
export interface FileContentService {
  loadFileContent(filePath: string): Promise<string>;
}

export type SemanticType =
  | 'root'
  | 'directoryTree'
  | 'directoryTitle'
  | 'filePreview'
  | 'previewTitle'
  | 'previewRender';

// Folder properties
export interface FolderProps {
  // Basic properties
  prefixCls?: string;
  className?: string;
  classNames?: Partial<Record<SemanticType, string>>;
  styles?: Partial<Record<SemanticType, React.CSSProperties>>;
  style?: React.CSSProperties;
  directoryIcons?: Record<'directory' | string, React.ReactNode | (() => React.ReactNode)>;
  // Data properties
  treeData: FolderTreeData[];
  // Selection functionality
  selectable?: boolean;
  selectedFile?: string[];
  defaultSelectedFile?: string[];
  onSelectedFileChange?: (file: {
    path: string[];
    title?: FolderTreeData['title'];
    content?: string;
  }) => void;
  directoryTreeWith?: number | string;
  emptyRender?: React.ReactNode | (() => React.ReactNode);
  previewRender?:
    | React.ReactNode
    | ((
        file: {
          content?: string;
          path: string[];
          title?: FolderTreeData['title'];
          language: string;
        },
        info: { originNode: React.ReactNode },
      ) => React.ReactNode);
  // Expansion control
  defaultExpandedPaths?: string[];
  expandedPaths?: string[];
  defaultExpandAll?: boolean;
  onExpandedPathsChange?: (paths: string[]) => void;

  // File content service
  fileContentService?: FileContentService;

  // Event callbacks
  onFileClick?: (filePath: string, content?: string) => void;
  onFolderClick?: (folderPath: string) => void;

  // Custom titles
  directoryTitle?: React.ReactNode | (() => React.ReactNode);
  previewTitle?:
    | React.ReactNode
    | (({
        title,
        path,
        content,
      }: {
        title: React.ReactNode;
        path: string[];
        content: string;
      }) => React.ReactNode);
}

// Ref interface type
export type FolderRef = {
  nativeElement: HTMLDivElement;
};

const ForwardFolder = React.forwardRef<FolderRef, FolderProps>((props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    classNames,
    styles,
    style,
    treeData,
    directoryIcons,
    previewRender,
    directoryTitle,
    previewTitle,
    selectable = true,
    defaultSelectedFile,
    defaultExpandAll = true,
    selectedFile,
    onSelectedFileChange,
    directoryTreeWith = 278,
    emptyRender,
    defaultExpandedPaths,
    expandedPaths,
    onExpandedPathsChange,
    onFileClick,
    onFolderClick,
  } = props;

  // ============================= Refs =============================
  const containerRef = React.useRef<HTMLDivElement>(null);
  useProxyImperativeHandle(ref, () => {
    return {
      nativeElement: containerRef.current!,
    };
  });

  // ============================ State ============================

  // Find node and validate path
  const findNodeAndValidate = useCallback(
    (
      path: string | string[],
      validateAsFile = false,
    ): { node: FolderTreeData | undefined; isValid: boolean } => {
      if (!path) return { node: undefined, isValid: false };

      const segments = Array.isArray(path) ? path.filter(Boolean) : path.split('/').filter(Boolean);

      if (segments.length === 0) return { node: undefined, isValid: false };

      const findNode = (nodes: FolderTreeData[], index = 0): FolderTreeData | undefined => {
        if (index >= segments.length) return undefined;

        const currentSegment = segments[index];
        for (const node of nodes) {
          if (node.path === currentSegment) {
            return index === segments.length - 1
              ? node
              : node.children
                ? findNode(node.children, index + 1)
                : undefined;
          }
        }
        return undefined;
      };

      const node = findNode(treeData);
      const isValid = validateAsFile
        ? !!node && (!node?.children || node.children.length === 0)
        : !!node;
      return { node, isValid };
    },
    [treeData],
  );

  const [validSelectedFile, setValidSelectedFile] = useState<boolean>(false);

  const isValidSelectedFile = (filePath?: string[]): boolean =>
    !!(filePath && filePath.length > 0 && findNodeAndValidate(filePath, true).isValid);

  const [expandedPathsState, setExpandedPaths] = useControlledState<string[] | undefined>(
    defaultExpandedPaths,
    expandedPaths,
  );

  const [selectedFileState, setSelectedFileState] = useControlledState<string[]>(
    isValidSelectedFile(defaultSelectedFile || []) ? defaultSelectedFile || [] : [],
    selectedFile,
  );

  useEffect(() => {
    const isValid = isValidSelectedFile(selectedFile || defaultSelectedFile || []);
    setValidSelectedFile(isValid);
  }, [selectedFile, treeData, defaultSelectedFile]);

  const [fileContent, setFileContent] = useState<string>('');
  const [loadingContent, setLoadingContent] = useState<boolean>(false);
  // ============================ Prefix ============================
  const { getPrefixCls, direction } = useXProviderContext();
  const prefixCls = getPrefixCls('folder', customizePrefixCls);
  const [hashId, cssVarCls] = useStyle(prefixCls);
  const contextConfig = useXComponentConfig('folder');
  const [locale] = useLocale('Folder', enUS.Folder);

  // ============================ Style ============================
  const mergedCls = clsx(
    prefixCls,
    contextConfig.className,
    className,
    classNames?.root,
    hashId,
    cssVarCls,
    {
      [`${prefixCls}-rtl`]: direction === 'rtl',
      [`${prefixCls}-selectable`]: selectable,
    },
  );

  // ============================ Event Handlers ============================
  const handleSelect: TreeProps['onSelect'] = (_keys, info) => {
    const keys = _keys as string[];
    const nodes = Array.isArray(info.selectedNodes) ? info.selectedNodes : [info.selectedNodes];

    // Check if a folder was clicked
    const isFolder = nodes.some((node) => !node.isLeaf);

    if (isFolder) {
      // Click folder: don't update selectedFileState, only trigger folder click event
      if (nodes.length === 1) {
        const node = nodes[0] as unknown as FolderTreeData;
        onFolderClick?.(node.path);
      }
      return;
    }

    // Convert full path to array format
    const pathArray = keys[0]?.split('/').filter(Boolean) || [];

    // Avoid empty or invalid paths
    if (pathArray.length === 0) return;

    // Get selected file name and content (single file selection)
    const selectedNode = nodes[0] as unknown as FolderTreeData | undefined;
    const fileName = selectedNode?.title as string | undefined;
    const fileContent = selectedNode?.content as string | undefined;

    // Trigger selection change callback (main interaction method)
    onSelectedFileChange?.({ path: pathArray, title: fileName, content: fileContent });

    // // Update internal state in uncontrolled mode
    const isControlled = selectedFile !== undefined;
    if (!isControlled) {
      setValidSelectedFile(true);
      setSelectedFileState(pathArray);
    }

    // Handle single file click event
    if (nodes.length === 1) {
      const node = nodes[0] as unknown as FolderTreeData;
      onFileClick?.(node.path, node.content);
    }
  };

  const handleExpand: TreeProps['onExpand'] = (keys) => {
    const newPaths = keys as string[];
    setExpandedPaths(newPaths);
    onExpandedPathsChange?.(newPaths);
  };

  // ============================ Effects ============================

  useEffect(() => {
    const loadFileContent = async () => {
      if (!validSelectedFile || selectedFileState.length === 0) {
        setFileContent('');
        setLoadingContent(false);
        return;
      }

      const filePath = selectedFileState.join('/');

      // First check if the node already has content
      const segments = filePath.split('/').filter((segment) => segment !== '');
      const { node } = findNodeAndValidate(segments);

      // If file content service is available, use it to load content
      if (props.fileContentService) {
        setLoadingContent(true);
        try {
          const content = await props.fileContentService.loadFileContent(filePath);
          setFileContent(content);
        } catch (error) {
          setFileContent(
            `// ${locale?.loadError}: ${error instanceof Error ? error.message : 'Unknown error'}`,
          );
        } finally {
          setLoadingContent(false);
        }
      } else if (node?.content) {
        // If node already has content, use it directly
        setFileContent(node.content);
        setLoadingContent(false);
        return;
      } else {
        // No file content service, show prompt message
        setFileContent(`// ${locale.noService}`);
        setLoadingContent(false);
      }
    };

    loadFileContent();
  }, [
    validSelectedFile,
    selectedFileState,
    treeData,
    props.fileContentService,
    findNodeAndValidate,
  ]);

  // ============================ Style ============================
  const mergedStyle = {
    ...contextConfig.style,
    ...styles?.root,
    ...style,
  };

  return (
    <div ref={containerRef} className={mergedCls} style={mergedStyle}>
      <Flex className={`${prefixCls}-container`}>
        <Splitter>
          <Splitter.Panel defaultSize={directoryTreeWith}>
            <div
              className={clsx(`${prefixCls}-directory-tree`, classNames?.directoryTree)}
              style={{
                ...contextConfig.styles?.directoryTree,
                ...styles?.directoryTree,
              }}
            >
              <DirectoryTree
                directoryIcons={directoryIcons}
                prefixCls={customizePrefixCls}
                treeData={treeData}
                selectedKeys={
                  selectable && selectedFileState && validSelectedFile
                    ? [selectedFileState.join('/')]
                    : []
                }
                classNames={classNames}
                styles={styles}
                expandedKeys={expandedPathsState}
                onSelect={handleSelect}
                onExpand={handleExpand}
                defaultExpandAll={defaultExpandAll}
                directoryTitle={directoryTitle}
              />
            </div>
          </Splitter.Panel>
          <Splitter.Panel>
            <FilePreview
              emptyRender={emptyRender}
              prefixCls={customizePrefixCls}
              classNames={classNames}
              styles={styles}
              selectedFile={validSelectedFile ? selectedFileState : []}
              fileContent={fileContent}
              loading={loadingContent}
              previewTitle={previewTitle}
              previewRender={previewRender}
              getFileNode={(path) => {
                if (!path || path.length === 0) return undefined;
                const { node } = findNodeAndValidate(path);
                return node
                  ? { title: node.title, path: node.path, content: node.content }
                  : undefined;
              }}
            />
          </Splitter.Panel>
        </Splitter>
      </Flex>
    </div>
  );
});

const Folder = ForwardFolder;

if (process.env.NODE_ENV !== 'production') {
  Folder.displayName = 'Folder';
}

export default Folder;
