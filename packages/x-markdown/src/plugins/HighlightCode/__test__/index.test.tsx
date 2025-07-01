import { render } from '@testing-library/react';
import React from 'react';
import CodeHighLight from '..';
import XMarkdown from '../../../XMarkdown';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useId: () => 'mock-id-123',
}));

describe('CodeHighLight', () => {
  it('render normal code', () => {
    const content = `
    \`\`\`javascript
    console.log("javascript");
    \`\`\`
    `;

    const { container } = render(<XMarkdown content={content} components={CodeHighLight()} />);
    expect(container.querySelector('pre')).toBeInTheDocument();
    expect(container.querySelector('code')).toBeInTheDocument();
    expect(container.textContent).toContain('console.log("javascript");');
  });

  it('mermaid code is render as text', () => {
    const content = `
      \`\`\`mermaid
      graph TD; A-->B;
      \`\`\`
      `;

    const { container } = render(<XMarkdown content={content} components={CodeHighLight()} />);
    expect(container.querySelector('pre')).toBeInTheDocument();
    expect(container.textContent).toContain('graph TD; A-->B;');
  });

  it('should handle undefined lang', () => {
    const content = `
    \`\`\`
    plain text
    \`\`\`
    `;

    const { container } = render(<XMarkdown content={content} components={CodeHighLight()} />);
    expect(container.querySelector('pre')).toBeInTheDocument();
    expect(container.textContent).toContain('plain text');
  });
});
