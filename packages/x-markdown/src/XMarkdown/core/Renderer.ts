import { XMarkdownProps } from '../interface';
import parseHtml, { DOMNode, domToReact, Element } from 'html-react-parser';
import React, { ReactNode } from 'react';

interface RendererOptions {
  components?: XMarkdownProps['components'];
}

class Renderer {
  private readonly options: RendererOptions;

  constructor(options: RendererOptions) {
    this.options = options;
  }

  /**
   * 使用正则表达式检测未闭合标签
   */
  private detectUnclosedTags(htmlString: string): Set<string> {
    const unclosedTags = new Set<string>();
    const stack: string[] = [];
    const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9-]*)(?:\s[^>]*)?>/g;

    let match;
    while ((match = tagRegex.exec(htmlString)) !== null) {
      const [fullMatch, tagName] = match;
      const isClosing = fullMatch.startsWith('</');
      const isSelfClosing = fullMatch.endsWith('/>');

      if (this.options.components?.[tagName.toLowerCase()]) {
        if (isClosing) {
          // 找到结束标签，弹出栈
          const lastIndex = stack.lastIndexOf(tagName.toLowerCase());
          if (lastIndex !== -1) {
            stack.splice(lastIndex, 1);
          }
        } else if (!isSelfClosing) {
          // 开始标签，压入栈
          stack.push(tagName.toLowerCase());
        }
      }
    }

    // 栈中剩下的就是未闭合的标签
    stack.forEach((tag) => unclosedTags.add(tag));

    return unclosedTags;
  }

  public processHtml(htmlString: string): React.ReactNode {
    const unclosedTags = this.detectUnclosedTags(htmlString);

    return parseHtml(htmlString, {
      replace: (domNode) => {
        if (!('name' in domNode)) return;

        const { name, attribs, children } = domNode as Element;
        const renderElement = this.options.components?.[name];

        if (renderElement) {
          const streamStatus = unclosedTags.has(name) ? 'loading' : 'done';
          const props: Record<string, any> = {
            domNode,
            streamStatus,
            ...attribs,
          };

          if (children) {
            props.children = domToReact(children as DOMNode[]);
          }

          return React.createElement(renderElement, props);
        }
      },
    });
  }

  public render(html: string): ReactNode | null {
    return this.processHtml(html);
  }
}

export default Renderer;
