import { render, waitFor } from '@testing-library/react';
import MermaidDiagram from '../index';
import React from 'react';
import XMarkdown from '../../..';

beforeAll(() => {
  Object.defineProperty(global, 'SVGElement', {
    value: class SVGElement {},
    writable: true,
  });
});

jest.mock('mermaid', () => ({
  initialize: jest.fn().mockImplementation((options) => options),
  run: jest.fn().mockImplementation((callback) => callback()),
  mermaidAPI: {
    render: jest.fn().mockImplementation(() => ({
      svg: '<svg></svg>',
    })),
  },
}));

const content = `\`\`\`mermaid
quadrantChart
    title Reach and engagement of campaigns
    x-axis Low Reach --> High Reach
    y-axis Low Engagement --> High Engagement
    quadrant-1 We should expand
    quadrant-2 Need to promote
    quadrant-3 Re-evaluate
    quadrant-4 May be improved
    Campaign A: [0.3, 0.6]
    Campaign B: [0.45, 0.23]
    Campaign C: [0.57, 0.69]
    Campaign D: [0.78, 0.34]
    Campaign E: [0.40, 0.34]
    Campaign F: [0.35, 0.78]
\`\`\``;

const renderComponent = (content: string) => (
  <XMarkdown
    content={content}
    components={{
      code: (props: { class: string; children: string }) => {
        const { class: className, children } = props;
        const lang = className?.replace('language-', '');
        if (lang === 'mermaid') {
          return <MermaidDiagram>{children}</MermaidDiagram>;
        }
        return <code {...props} />;
      },
    }}
  />
);

describe('MermaidDiagram', () => {
  it('renders diagram and escapes brackets', async () => {
    const { container } = render(renderComponent(content));

    expect(container.querySelector('.ant-mermaid-header')).toBeTruthy();
    expect(container.querySelector('.ant-mermaid-graph')).toBeTruthy();
  });

  it('does not render for non-mermaid code blocks', async () => {
    const jsContent = `\`\`\`javascript
console.log('hello');
\`\`\``;

    const { container } = render(renderComponent(jsContent));

    expect(container.querySelector('pre')).toBeTruthy();
    expect(container.querySelector('code')).toBeInTheDocument();
    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });
});
