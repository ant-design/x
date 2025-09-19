import type { Config as DOMPurifyConfig } from 'dompurify';
import DOMPurify from 'dompurify';
import parseHtml, { DOMNode, domToReact, Element } from 'html-react-parser';
import React, { ReactNode } from 'react';
import type { ComponentProps, XMarkdownProps } from '../interface';

interface RendererOptions {
  components?: XMarkdownProps['components'];
  dompurifyConfig?: DOMPurifyConfig;
}

class Renderer {
  private readonly options: RendererOptions;

  constructor(options: RendererOptions) {
    this.options = options;
  }

  /**
   * Detect unclosed tags using regular expressions
   */
  private detectUnclosedTags(htmlString: string): Set<string> {
    const unclosedTags = new Set<string>();
    const stack: string[] = [];
    const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9-]*)(?:\s[^>]*)?>/g;

    let match = tagRegex.exec(htmlString);
    while (match !== null) {
      const [fullMatch, tagName] = match;
      const isClosing = fullMatch.startsWith('</');
      const isSelfClosing = fullMatch.endsWith('/>');

      if (this.options.components?.[tagName.toLowerCase()]) {
        if (isClosing) {
          // Found closing tag, pop from stack
          const lastIndex = stack.lastIndexOf(tagName.toLowerCase());
          if (lastIndex !== -1) {
            stack.splice(lastIndex, 1);
          }
        } else if (!isSelfClosing) {
          // Found opening tag, push to stack
          stack.push(tagName.toLowerCase());
        }
      }
      match = tagRegex.exec(htmlString);
    }

    // Remaining tags in stack are unclosed
    stack.forEach((tag) => {
      unclosedTags.add(tag);
    });
    return unclosedTags;
  }

  /**
   * Configure DOMPurify to preserve components and target attributes, filter everything else
   */
  private configureDOMPurify(): DOMPurifyConfig {
    const customComponents = Object.keys(this.options.components || {});
    const userConfig = this.options.dompurifyConfig || {};

    return {
      ...userConfig,
      ADD_TAGS: [...new Set([...customComponents, ...(userConfig.ALLOWED_TAGS || [])])],
    };
  }

  public processHtml(htmlString: string): React.ReactNode {
    const unclosedTags = this.detectUnclosedTags(htmlString);
    // Use DOMPurify to clean HTML while preserving custom components and target attributes
    const purifyConfig = this.configureDOMPurify();
    const cleanHtml = DOMPurify.sanitize(htmlString, purifyConfig);

    return parseHtml(cleanHtml, {
      replace: (domNode) => {
        if (!('name' in domNode)) return;

        const { name, attribs, children } = domNode as Element;
        const renderElement = this.options.components?.[name];

        if (renderElement) {
          const streamStatus = unclosedTags.has(name) ? 'loading' : 'done';
          const props: ComponentProps = {
            domNode,
            streamStatus,
            ...attribs,
          };

          // Handle class and className merging
          const classes = [props.className, props.classname, props.class]
            .filter(Boolean)
            .join(' ')
            .trim();
          props.className = classes || '';

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
