import { Alert } from 'antd';
import type { IPreviewerProps } from 'dumi';
import React, { Suspense } from 'react';
import DemoFallback from './DemoFallback';
import Previewer from './Previewer';

const { ErrorBoundary } = Alert;

const PreviewerSuspense: React.FC<IPreviewerProps> = (props) => (
  <ErrorBoundary>
    <Suspense fallback={<DemoFallback />}>
      <Previewer {...props} />
    </Suspense>
  </ErrorBoundary>
);

export default PreviewerSuspense;
