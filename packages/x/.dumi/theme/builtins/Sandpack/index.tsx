import { Skeleton } from 'antd';
import { createStyles } from 'antd-style';
import { useSearchParams } from 'dumi';
import React, { Suspense } from 'react';

const OriginSandpack = React.lazy(() => import('./Sandpack'));

const indexContent = `import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app';
import './index.css';

const root = createRoot(document.getElementById("root"));
root.render(<App />);
`;

const useStyle = createStyles(({ token, css }) => ({
  fallback: css`
    width: 100%;
    > * {
      width: 100% !important;
      border-radius: ${token.borderRadiusLG}px;
    }
  `,
  placeholder: css`
    color: ${token.colorTextDescription};
    font-size: ${token.fontSizeLG}px;
  `,
}));

const SandpackFallback = () => {
  const { styles } = useStyle();

  return (
    <div className={styles.fallback}>
      <Skeleton.Node active style={{ height: 500, width: '100%' }}>
        <span className={styles.placeholder}>Loading Demo...</span>
      </Skeleton.Node>
    </div>
  );
};

interface SandpackProps {
  dark?: boolean;
  autorun?: boolean;
  dependencies?: string;
}

const Sandpack: React.FC<React.PropsWithChildren<SandpackProps>> = ({
  children,
  dark,
  dependencies: extraDeps,
  autorun = false,
}) => {
  const [searchParams] = useSearchParams();
  const dependencies = extraDeps && JSON.parse(extraDeps);

  const setup = {
    dependencies: {
      react: '^19.0.2',
      'react-dom': '^19.0.2',
      antd: '^6.0.1',
      '@ant-design/x': '^2.0.0',
      '@ant-design/x-markdown': '^2.0.0',
      '@ant-design/x-sdk': '^2.0.0',
      ...dependencies,
    },
    devDependencies: {
      '@types/react': '^19.0.2',
      '@types/react-dom': '^19.0.2',
      typescript: '^5',
    },
    entry: 'index.tsx',
  };

  const options = {
    activeFile: 'app.tsx' as never,
    visibleFiles: ['index.tsx', 'app.tsx', 'package.json', 'index.css'] as any,
    showLineNumbers: true,
    editorHeight: '500px',
    autorun,
  };

  return (
    <Suspense fallback={<SandpackFallback />}>
      <OriginSandpack
        theme={searchParams.getAll('theme').includes('dark') ? 'dark' : undefined}
        customSetup={setup}
        options={options}
        files={{
          'index.tsx': indexContent,
          'index.css': `html, body {
  padding: 0;
  margin: 0;
  background: ${dark ? '#000' : '#fff'};
}

#root {
  padding: 24px;
}`,
          'app.tsx': children,
        }}
      />
    </Suspense>
  );
};

export default Sandpack;
