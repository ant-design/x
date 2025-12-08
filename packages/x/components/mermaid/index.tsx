import React from 'react';
import type { MermaidProps, MermaidType } from './Mermaid';

const LazyMermaid = React.lazy(() => import('./Mermaid'));

const MermaidWrapper: React.FC<MermaidProps> = (props) => (
  <React.Suspense fallback={<div>Loading Mermaid</div>}>
    <LazyMermaid {...props} />
  </React.Suspense>
);

export type { MermaidProps, MermaidType };

export default MermaidWrapper;
