import { XMarkdownProps } from '../interface';
import parseHtml, { domToReact } from 'html-react-parser';
import React, { ReactNode } from 'react';

interface RendererOptions {
  components?: XMarkdownProps['components'];
}

class Renderer {
  private readonly options: RendererOptions;

  constructor(options: RendererOptions) {
    this.options = options;
  }

  private processHtml(htmlString: string): React.ReactNode {
    try {
      return parseHtml(htmlString, {
        replace: (domNode: Record<string, any>) => {
          const { type, name, attribs, children } = domNode;
          if (type !== 'tag') return;

          const renderElement = this.options.components?.[name];
          if (renderElement) {
            const props = { ...attribs };
            if (children) {
              props.children = domToReact(children);
            }
            return React.createElement(renderElement, props);
          }
        },
      });
    } catch (error) {
      console.error('Error processing HTML:', error);
      return null;
    }
  }

  public render(html: string): ReactNode | null {
    return this.processHtml(html);
  }
}

export default Renderer;
