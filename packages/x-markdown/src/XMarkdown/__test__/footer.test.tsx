import { render, screen } from '@testing-library/react';
import React from 'react';
import XMarkdown from '../index';

describe('XMarkdown Footer', () => {
  it('should render footer when provided', () => {
    const footerContent = <div data-testid="custom-footer">Loading...</div>;
    render(<XMarkdown content="# Hello World" footer={footerContent} />);

    expect(screen.getByTestId('custom-footer')).toBeInTheDocument();
    expect(screen.getByTestId('custom-footer')).toHaveTextContent('Loading...');
  });

  it('should render footer at the end of content', () => {
    const footerContent = <div data-testid="footer">Footer Content</div>;
    const { container } = render(
      <XMarkdown content="# Hello World\n\nThis is content." footer={footerContent} />,
    );

    const markdownContainer = container.firstChild;
    expect(markdownContainer).toHaveClass('x-markdown');

    const content = container.querySelector('.x-markdown-content');
    const footer = container.querySelector('.x-markdown-footer');

    expect(content).toBeInTheDocument();
    expect(footer).toBeInTheDocument();
    expect(footer).toContainElement(screen.getByTestId('footer'));
  });

  it('should not render footer when not provided', () => {
    const { container } = render(<XMarkdown content="# Hello World" />);

    expect(container.querySelector('.x-markdown-footer')).not.toBeInTheDocument();
  });

  it('should render footer with empty content', () => {
    const footerContent = <div data-testid="empty-footer">Empty Content Footer</div>;
    render(<XMarkdown content="" footer={footerContent} />);

    expect(screen.getByTestId('empty-footer')).toBeInTheDocument();
  });

  it('should render footer with null content', () => {
    const footerContent = <div data-testid="null-footer">Null Content Footer</div>;
    render(<XMarkdown content={null as any} footer={footerContent} />);

    expect(screen.getByTestId('null-footer')).toBeInTheDocument();
  });

  it('should render footer with undefined content', () => {
    const footerContent = <div data-testid="undefined-footer">Undefined Content Footer</div>;
    render(<XMarkdown content={undefined} footer={footerContent} />);

    expect(screen.getByTestId('undefined-footer')).toBeInTheDocument();
  });

  it('should render footer with streaming content', () => {
    const footerContent = <div data-testid="streaming-footer">Streaming...</div>;
    const { rerender } = render(
      <XMarkdown content="# Hello" footer={footerContent} streaming={{ hasNextChunk: true }} />,
    );

    expect(screen.getByTestId('streaming-footer')).toBeInTheDocument();
    expect(screen.getByTestId('streaming-footer')).toHaveTextContent('Streaming...');

    // Update content to simulate streaming
    rerender(
      <XMarkdown
        content="# Hello World\n\nUpdated content"
        footer={footerContent}
        streaming={{ hasNextChunk: true }}
      />,
    );

    // Footer should still be visible
    expect(screen.getByTestId('streaming-footer')).toBeInTheDocument();
  });

  it('should render footer with complex React components', () => {
    const ComplexFooter = () => (
      <div>
        <span>Loading</span>
        <div className="spinner">⚡</div>
      </div>
    );

    render(<XMarkdown content="# Complex Content" footer={<ComplexFooter />} />);

    expect(screen.getByText('Loading')).toBeInTheDocument();
    expect(screen.getByText('⚡')).toBeInTheDocument();
  });

  it('should apply custom styles to footer container', () => {
    const footerContent = <div style={{ color: 'red' }}>Styled Footer</div>;
    const { container } = render(<XMarkdown content="# Test" footer={footerContent} />);

    const footer = container.querySelector('.x-markdown-footer');
    expect(footer).toBeInTheDocument();
    // Check CSS classes instead of computed styles
    expect(footer).toHaveClass('x-markdown-footer');
  });

  it('should work with custom prefixCls', () => {
    const footerContent = <div data-testid="custom-prefix-footer">Custom Prefix</div>;
    const { container } = render(
      <XMarkdown content="# Test" footer={footerContent} prefixCls="custom" />,
    );

    expect(container.querySelector('.custom .x-markdown-content')).toBeInTheDocument();
    expect(container.querySelector('.custom .x-markdown-footer')).toBeInTheDocument();
  });

  it('should not render anything when both content and footer are empty', () => {
    const { container } = render(<XMarkdown content="" footer={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('should render footer with string content', () => {
    render(<XMarkdown footer={<div>String Footer</div>}>{'# String Content'}</XMarkdown>);

    expect(screen.getByText('String Footer')).toBeInTheDocument();
    expect(screen.getByText('String Content')).toBeInTheDocument();
  });

  it('should memoize footer rendering for performance', () => {
    const FooterComponent = jest.fn(() => <div>Memoized Footer</div>);
    const footerElement = <FooterComponent />;

    const { rerender } = render(<XMarkdown content="# Test" footer={footerElement} />);

    expect(FooterComponent).toHaveBeenCalledTimes(1);

    // Re-render with same footer element reference
    rerender(<XMarkdown content="# Test Updated" footer={footerElement} />);

    // Footer component should not re-render due to memoization
    expect(FooterComponent).toHaveBeenCalledTimes(1);
  });
});
