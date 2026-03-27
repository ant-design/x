import {
  CheckCircleOutlined,
  CloseOutlined,
  FileOutlined,
  FolderOpenOutlined,
  FolderOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { Bubble } from '@ant-design/x';
import type { ActionPayload, XAgentCommand_v0_8 } from '@ant-design/x-card';
import { XCard } from '@ant-design/x-card';
import XMarkdown from '@ant-design/x-markdown';
import { Button, Card, Collapse, CollapseProps, Space, Tag, Typography } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';

const { Text } = Typography;

// ─────────────────────────────────────────────────────────────────────────────
// Data Type Definitions
// ─────────────────────────────────────────────────────────────────────────────

interface FileNode {
  key: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  size?: number;
  modified?: string;
  language?: string;
  description?: string;
}

interface FileDetail {
  name: string;
  path: string;
  size: number;
  modified: string;
  language: string;
  description: string;
  content?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────────────────────────────────────

const PROJECT_FILES: FileNode[] = [
  {
    key: 'src',
    name: 'src',
    type: 'folder',
    children: [
      {
        key: 'src/components',
        name: 'components',
        type: 'folder',
        children: [
          {
            key: 'src/components/Button.tsx',
            name: 'Button.tsx',
            type: 'file',
            size: 2048,
            modified: '2024-01-15',
            language: 'TypeScript',
            description: 'A reusable button component with multiple variants',
          },
          {
            key: 'src/components/Card.tsx',
            name: 'Card.tsx',
            type: 'file',
            size: 3584,
            modified: '2024-01-14',
            language: 'TypeScript',
            description: 'Card component for displaying content in a container',
          },
          {
            key: 'src/components/Modal.tsx',
            name: 'Modal.tsx',
            type: 'file',
            size: 4096,
            modified: '2024-01-13',
            language: 'TypeScript',
            description: 'Modal dialog component with overlay',
          },
        ],
      },
      {
        key: 'src/hooks',
        name: 'hooks',
        type: 'folder',
        children: [
          {
            key: 'src/hooks/useAuth.ts',
            name: 'useAuth.ts',
            type: 'file',
            size: 1536,
            modified: '2024-01-12',
            language: 'TypeScript',
            description: 'Authentication hook for user login/logout',
          },
          {
            key: 'src/hooks/useTheme.ts',
            name: 'useTheme.ts',
            type: 'file',
            size: 1024,
            modified: '2024-01-11',
            language: 'TypeScript',
            description: 'Theme management hook',
          },
        ],
      },
      {
        key: 'src/App.tsx',
        name: 'App.tsx',
        type: 'file',
        size: 2560,
        modified: '2024-01-10',
        language: 'TypeScript',
        description: 'Main application entry component',
      },
      {
        key: 'src/index.tsx',
        name: 'index.tsx',
        type: 'file',
        size: 512,
        modified: '2024-01-09',
        language: 'TypeScript',
        description: 'Application bootstrap file',
      },
    ],
  },
  {
    key: 'public',
    name: 'public',
    type: 'folder',
    children: [
      {
        key: 'public/index.html',
        name: 'index.html',
        type: 'file',
        size: 768,
        modified: '2024-01-08',
        language: 'HTML',
        description: 'HTML template for the application',
      },
      {
        key: 'public/favicon.ico',
        name: 'favicon.ico',
        type: 'file',
        size: 4096,
        modified: '2024-01-07',
        language: 'Binary',
        description: 'Application favicon',
      },
    ],
  },
  {
    key: 'package.json',
    name: 'package.json',
    type: 'file',
    size: 1280,
    modified: '2024-01-16',
    language: 'JSON',
    description: 'Project dependencies and scripts configuration',
  },
  {
    key: 'README.md',
    name: 'README.md',
    type: 'file',
    size: 2048,
    modified: '2024-01-17',
    language: 'Markdown',
    description: 'Project documentation and usage guide',
  },
];

const PANEL_DATA = [
  {
    id: 'overview',
    title: 'Project Overview',
    content:
      'This is a React-based web application built with TypeScript. It follows a component-based architecture with hooks for state management.',
  },
  {
    id: 'tech-stack',
    title: 'Tech Stack',
    content:
      '- React 18.x\n- TypeScript 5.x\n- Ant Design 5.x\n- Vite for build tooling\n- ESLint & Prettier for code quality',
  },
  {
    id: 'structure',
    title: 'Directory Structure',
    content:
      '- src/components: Reusable UI components\n- src/hooks: Custom React hooks\n- public: Static assets\n- package.json: Dependencies',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Content rendering related
// ─────────────────────────────────────────────────────────────────────────────

const contentHeader =
  'Welcome to Project File Browser! Browse the project structure below. Click on files to view details, expand folders to explore nested contents.';

type TextNode = { text: string; timestamp: number };
type CardNode = { timestamp: number; id: string };
type ContentType = {
  texts: TextNode[];
  card: CardNode[];
};

const role = {
  assistant: {
    contentRender: (content: ContentType) => {
      const contentList = [...content.texts, ...content.card].sort(
        (a, b) => a.timestamp - b.timestamp,
      );
      return contentList.map((node, index) => {
        if ('text' in node && node.text) {
          return <XMarkdown key={index}>{node.text}</XMarkdown>;
        }

        if ('id' in node && node.id) {
          return <XCard.Card key={index} id={node.id} />;
        }
        return null;
      });
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Component Definitions
// ─────────────────────────────────────────────────────────────────────────────

// Text Component
interface TextProps {
  text?: string;
  variant?: 'h1' | 'h2' | 'h3' | 'body' | string;
  children?: React.ReactNode;
}

const TextComponent: React.FC<TextProps> = ({ text, variant, children }) => {
  const content = text ?? children;
  if (!content) return null;
  const styleMap: Record<string, React.CSSProperties> = {
    h1: { fontSize: 20, fontWeight: 700, margin: '0 0 12px' },
    h2: { fontSize: 17, fontWeight: 600, margin: '0 0 8px' },
    h3: { fontSize: 15, fontWeight: 600, margin: '0 0 6px' },
    body: { fontSize: 14, margin: 0 },
  };
  const style = styleMap[variant ?? 'body'] ?? styleMap.body;
  return <p style={style}>{content}</p>;
};

// File Tree Node Component
interface TreeNodeProps {
  node: FileNode;
  level: number;
  selectedKey?: string;
  onFileClick: (file: FileNode) => void;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, level, selectedKey, onFileClick }) => {
  const [expanded, setExpanded] = useState(false);
  const isFolder = node.type === 'folder';
  const isSelected = selectedKey === node.key;

  const handleClick = () => {
    if (isFolder) {
      setExpanded(!expanded);
    } else {
      onFileClick(node);
    }
  };

  return (
    <div>
      <div
        onClick={handleClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 8px',
          cursor: 'pointer',
          borderRadius: 6,
          background: isSelected ? '#e6f4ff' : 'transparent',
          borderLeft: `3px solid ${isSelected ? '#1677ff' : 'transparent'}`,
          marginLeft: level * 12,
          transition: 'all 0.2s',
        }}
      >
        {isFolder ? (
          expanded ? (
            <FolderOpenOutlined style={{ color: '#faad14' }} />
          ) : (
            <FolderOutlined style={{ color: '#faad14' }} />
          )
        ) : (
          <FileOutlined style={{ color: '#1677ff' }} />
        )}
        <Text style={{ flex: 1, fontSize: 13 }}>{node.name}</Text>
        {isFolder && node.children && (
          <Text type="secondary" style={{ fontSize: 11 }}>
            {node.children.length}
          </Text>
        )}
      </div>
      {isFolder && expanded && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.key}
              node={child}
              level={level + 1}
              selectedKey={selectedKey}
              onFileClick={onFileClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// File Tree Component
interface FileTreeProps {
  files?: FileNode[];
  action?: {
    name: string;
    context?: Array<{ key: string; value: { path: string } }>;
  };
  onAction?: (name: string, context: Record<string, any>) => void;
  selectedFile?: FileDetail;
}

const FileTree: React.FC<FileTreeProps> = ({ files, action, onAction, selectedFile }) => {
  const treeData = files && files.length > 0 ? files : PROJECT_FILES;

  const handleFileClick = (file: FileNode) => {
    if (!action?.name) return;

    const fileDetail: FileDetail = {
      name: file.name,
      path: file.key,
      size: file.size || 0,
      modified: file.modified || '',
      language: file.language || 'Unknown',
      description: file.description || '',
    };

    const context: Record<string, any> = {};
    if (action.context) {
      action.context.forEach((item) => {
        context[item.key] = fileDetail;
      });
    }

    onAction?.(action.name, context);
  };

  return (
    <div
      style={{
        borderRadius: 12,
        border: '1px solid #e8e8e8',
        background: '#fff',
        maxHeight: 400,
        overflow: 'auto',
      }}
    >
      <div style={{ padding: '12px 8px' }}>
        {treeData.map((node) => (
          <TreeNode
            key={node.key}
            node={node}
            level={0}
            selectedKey={selectedFile?.path}
            onFileClick={handleFileClick}
          />
        ))}
      </div>
    </div>
  );
};

// File Detail Card Component
interface FileDetailCardProps {
  file?: FileDetail;
  onClose?: () => void;
}

const FileDetailCard: React.FC<FileDetailCardProps> = ({ file, onClose }) => {
  if (!file) return null;

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getLanguageColor = (lang: string) => {
    const colors: Record<string, string> = {
      TypeScript: '#3178c6',
      JavaScript: '#f7df1e',
      HTML: '#e34c26',
      JSON: '#292929',
      Markdown: '#083fa1',
    };
    return colors[lang] || '#666';
  };

  return (
    <Card
      size="small"
      title={
        <Space>
          <FileOutlined style={{ color: '#1677ff' }} />
          <Text strong>{file.name}</Text>
        </Space>
      }
      extra={
        onClose && <Button type="text" size="small" icon={<CloseOutlined />} onClick={onClose} />
      }
      style={{ borderRadius: 12 }}
      styles={{ body: { padding: '16px' } }}
    >
      <Space direction="vertical" size={12} style={{ width: '100%' }}>
        <div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Path
          </Text>
          <br />
          <Text code style={{ fontSize: 13 }}>
            {file.path}
          </Text>
        </div>

        <div style={{ display: 'flex', gap: 24 }}>
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Size
            </Text>
            <br />
            <Text style={{ fontSize: 13 }}>{formatSize(file.size)}</Text>
          </div>
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Modified
            </Text>
            <br />
            <Text style={{ fontSize: 13 }}>{file.modified}</Text>
          </div>
        </div>

        <div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Language
          </Text>
          <br />
          <Tag color={getLanguageColor(file.language)}>{file.language}</Tag>
        </div>

        {file.description && (
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Description
            </Text>
            <br />
            <Text style={{ fontSize: 13 }}>{file.description}</Text>
          </div>
        )}
      </Space>
    </Card>
  );
};

// Accordion Panel Component
interface AccordionPanelProps {
  panels?: Array<{ id: string; title: string; content: string }>;
  children?: React.ReactNode;
}

const AccordionPanel: React.FC<AccordionPanelProps> = ({ panels, children }) => {
  const panelData = panels && panels.length > 0 ? panels : PANEL_DATA;

  const items: CollapseProps['items'] = panelData.map((panel, index) => ({
    key: panel.id || String(index),
    label: (
      <Space>
        <CheckCircleOutlined style={{ color: '#52c41a' }} />
        <Text strong>{panel.title}</Text>
      </Space>
    ),
    children: <Text style={{ fontSize: 13, whiteSpace: 'pre-wrap' }}>{panel.content}</Text>,
    style: { marginBottom: 8, borderRadius: 8 },
  }));

  return (
    <div style={{ minWidth: 300 }}>
      <Collapse
        accordion
        items={items}
        defaultActiveKey={['overview']}
        style={{ background: '#fff' }}
      />
      {children}
    </div>
  );
};

// Main Container Component
interface MainContainerProps {
  children?: React.ReactNode;
}

const MainContainer: React.FC<MainContainerProps> = ({ children }) => {
  return (
    <div
      style={{
        borderRadius: 16,
        border: '1.5px solid #e8e8e8',
        padding: '20px',
        background: '#fff',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        marginBlock: 16,
        minWidth: 500,
      }}
    >
      <Space vertical style={{ width: '100%' }} size={16}>
        {children}
      </Space>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Streaming Text Hook
// ─────────────────────────────────────────────────────────────────────────────

const useStreamText = (text: string) => {
  const textRef = React.useRef(0);
  const [textIndex, setTextIndex] = React.useState(0);
  const textTimestamp = React.useRef(0);
  const [streamStatus, setStreamStatus] = useState('INIT');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const run = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      if (textRef.current < text.length) {
        if (textTimestamp.current === 0) {
          textTimestamp.current = Date.now();
          setStreamStatus('RUNNING');
        }
        textRef.current = Math.min(textRef.current + 3, text.length);
        setTextIndex(textRef.current);
      } else {
        setStreamStatus('FINISHED');
        if (timerRef.current) clearInterval(timerRef.current);
      }
    }, 100);
  }, [text]);

  const reset = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    textRef.current = 0;
    textTimestamp.current = 0;
    setTextIndex(0);
    setStreamStatus('INIT');
  }, []);

  return {
    text: text.slice(0, textIndex),
    streamStatus,
    timestamp: textTimestamp.current,
    run,
    reset,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// v0.8 Agent Command Definition
// ─────────────────────────────────────────────────────────────────────────────

const SurfaceUpdateCommand: XAgentCommand_v0_8 = {
  surfaceUpdate: {
    surfaceId: 'browser',
    components: [
      {
        id: 'title',
        component: {
          Text: {
            text: { literalString: 'Project File Browser' },
            variant: { literalString: 'h1' },
          },
        },
      },
      {
        id: 'file-tree',
        component: {
          FileTree: {
            action: {
              name: 'select_file',
              context: [{ key: 'selectedFile', value: { path: '/browser/selectedFile' } }],
            },
            selectedFile: { path: '/browser/selectedFile' },
          },
        },
      },
      {
        id: 'file-detail',
        component: {
          FileDetailCard: {
            file: { path: '/browser/selectedFile' },
          },
        },
      },
      {
        id: 'accordion-section',
        component: {
          AccordionPanel: {
            panels: { path: '/browser/panels' },
          },
        },
      },
      {
        id: 'root',
        component: {
          MainContainer: {
            children: {
              explicitList: ['title', 'file-tree', 'file-detail', 'accordion-section'],
            },
          },
        },
      },
    ],
  },
};

const DataModelUpdateCommand: XAgentCommand_v0_8 = {
  dataModelUpdate: {
    surfaceId: 'browser',
    contents: [
      {
        key: 'panels',
        valueMap: PANEL_DATA.map((p) => ({
          key: p.id,
          valueString: JSON.stringify({
            id: p.id,
            title: p.title,
            content: p.content,
          }),
        })),
      },
    ],
  },
};

const BeginRenderingCommand: XAgentCommand_v0_8 = {
  beginRendering: {
    surfaceId: 'browser',
    root: 'root',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// App Component
// ─────────────────────────────────────────────────────────────────────────────

const App = () => {
  const [card, setCard] = useState<CardNode[]>([]);
  const [commandQueue, setCommandQueue] = useState<XAgentCommand_v0_8[]>([]);
  const [sessionKey, setSessionKey] = useState(0);

  const onAgentCommand = (command: XAgentCommand_v0_8) => {
    if ('surfaceUpdate' in command) {
      const surfaceId = command.surfaceUpdate.surfaceId;
      setCard((prev) => {
        if (prev.some((c) => c.id === surfaceId)) return prev;
        return [...prev, { id: surfaceId, timestamp: Date.now() }];
      });
    } else if ('deleteSurface' in command) {
      setCard((prev) => prev.filter((c) => c.id !== command.deleteSurface.surfaceId));
    }
    setCommandQueue((prev) => [...prev, command]);
  };

  const handleAction = (payload: ActionPayload) => {
    if (payload.name === 'select_file') {
      const { selectedFile } = payload.context || {};
      if (selectedFile) {
        onAgentCommand({
          dataModelUpdate: {
            surfaceId: 'browser',
            contents: [
              {
                key: 'selectedFile',
                valueMap: Object.entries(selectedFile).map(([k, v]) => ({
                  key: k,
                  valueString: String(v),
                })),
              },
            ],
          },
        });
      }
    }
  };

  const {
    text: textHeader,
    streamStatus: streamStatusHeader,
    timestamp: timestampHeader,
    run: runHeader,
    reset: resetHeader,
  } = useStreamText(contentHeader);

  useEffect(() => {
    runHeader();
  }, [sessionKey, runHeader]);

  useEffect(() => {
    if (streamStatusHeader === 'FINISHED') {
      onAgentCommand(SurfaceUpdateCommand);
      onAgentCommand(DataModelUpdateCommand);
      onAgentCommand(BeginRenderingCommand);
    }
  }, [streamStatusHeader, sessionKey]);

  const handleReload = useCallback(() => {
    resetHeader();
    const deleteCommands: XAgentCommand_v0_8[] = [{ deleteSurface: { surfaceId: 'browser' } }];
    setCommandQueue((prev) => [...prev, ...deleteCommands]);
    setCard([]);
    setTimeout(() => {
      setSessionKey((prev) => prev + 1);
    }, 50);
  }, [resetHeader]);

  const items = [
    {
      content: {
        texts: [{ text: textHeader, timestamp: timestampHeader }].filter(
          (item) => item.timestamp !== 0,
        ),
        card,
      } as ContentType,
      role: 'assistant',
      key: sessionKey,
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<ReloadOutlined />} onClick={handleReload}>
          Reload
        </Button>
      </div>

      <XCard.Box
        key={sessionKey}
        commands={commandQueue}
        onAction={handleAction}
        components={{
          Text: TextComponent,
          FileTree,
          FileDetailCard,
          AccordionPanel,
          MainContainer,
        }}
      >
        <Bubble.List items={items} style={{ height: 700 }} role={role} />
      </XCard.Box>
    </div>
  );
};

export default App;
