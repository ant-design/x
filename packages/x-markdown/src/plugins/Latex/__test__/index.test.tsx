import { render } from '@testing-library/react';
import React from 'react';
import XMarkdown from '../../../XMarkdown';

// Mock CSS import to avoid Jest issues
jest.mock('katex/dist/katex.min.css', () => ({}));

// Mock katex to return HTML instead of MathML
jest.mock('katex', () => ({
  renderToString: (text: string, options: any) => {
    const displayClass = options?.displayMode ? 'katex-display' : 'katex';
    return `<span class="${displayClass}"><span class="katex-mathml">${text}</span><span class="katex-html" aria-hidden="true">${text}</span></span>`;
  },
}));

// Import the actual plugin after mocking
import latexPlugin from '../index';

describe('LaTeX Plugin', () => {
  it('should render inline LaTeX with $..$ syntax', () => {
    const { container } = render(
      <XMarkdown config={{ extensions: latexPlugin() }}>{'$E=mc^2$'}</XMarkdown>,
    );

    expect(container.innerHTML).toContain('katex');
    expect(container.innerHTML).toContain('E=mc^2');
  });

  it('should render block LaTeX with $$..$$ syntax', () => {
    const { container } = render(
      <XMarkdown config={{ extensions: latexPlugin() }}>{'$$\\frac{a}{b}$$'}</XMarkdown>,
    );

    expect(container.innerHTML).toContain('katex');
    expect(container.innerHTML).toContain('\\frac{a}{b}');
  });

  it('should render block LaTeX with \\[..\\] syntax', () => {
    const { container } = render(
      <XMarkdown config={{ extensions: latexPlugin() }}>{'\\[\\frac{a}{b}\\]'}</XMarkdown>,
    );

    expect(container.innerHTML).toContain('katex');
    expect(container.innerHTML).toContain('\\frac{a}{b}');
  });

  it('should handle LaTeX with surrounding text', () => {
    const { container } = render(
      <XMarkdown config={{ extensions: latexPlugin() }}>
        {'This is an equation: $E=mc^2$ in text'}
      </XMarkdown>,
    );

    expect(container.innerHTML).toContain('katex');
    expect(container.innerHTML).toContain('E=mc^2');
  });

  it('should handle multiple LaTeX formulas', () => {
    const { container } = render(
      <XMarkdown config={{ extensions: latexPlugin() }}>{'$a+b$ and $$\\frac{c}{d}$$'}</XMarkdown>,
    );

    expect(container.innerHTML).toContain('katex');
    expect(container.innerHTML).toContain('a+b');
    expect(container.innerHTML).toContain('\\frac{c}{d}');
  });

  it('should handle align* syntax replacement', () => {
    const { container } = render(
      <XMarkdown config={{ extensions: latexPlugin() }}>
        {'$$ \\begin{align*} x &= y \\ y &= z \\end{align*} $$'}
      </XMarkdown>,
    );

    expect(container.innerHTML).toContain('katex');
    expect(container.innerHTML).toContain('aligned');
  });

  it('should handle empty content', () => {
    const { container } = render(
      <XMarkdown config={{ extensions: latexPlugin() }}>{''}</XMarkdown>,
    );

    expect(container).toBeTruthy();
  });

  it('should handle content without LaTeX', () => {
    const { container } = render(
      <XMarkdown config={{ extensions: latexPlugin() }}>{'Just plain text'}</XMarkdown>,
    );

    expect(container.innerHTML).not.toContain('katex');
  });

  it('should handle complex LaTeX expressions', () => {
    const { container } = render(
      <XMarkdown config={{ extensions: latexPlugin() }}>
        {'$\\sum_{i=1}^{n} x_i = \\prod_{j=1}^{m} y_j$'}
      </XMarkdown>,
    );

    expect(container.innerHTML).toContain('katex');
    expect(container.innerHTML).toContain('\\sum_{i=1}^{n} x_i');
  });

  it('should handle mixed LaTeX syntaxes', () => {
    const { container } = render(
      <XMarkdown config={{ extensions: latexPlugin() }}>
        {'Inline: $x^2$ and block: $$\\int_0^1 f(x)dx$$'}
      </XMarkdown>,
    );

    expect(container.innerHTML).toContain('katex');
    expect(container.innerHTML).toContain('x^2');
    expect(container.innerHTML).toContain('\\int_0^1 f(x)dx');
  });
});
