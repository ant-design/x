import type { Config as DOMPurifyConfig } from 'dompurify';
import DOMPurify from 'dompurify';
import type { DOMNode, Element } from 'html-react-parser';
import parseHtml, { domToReact } from 'html-react-parser';
import React, { ReactNode } from 'react';
import AnimationText from '../AnimationText';
import type { ComponentProps, XMarkdownProps } from '../interface';

interface RendererOptions {
  components?: XMarkdownProps['components'];
  dompurifyConfig?: DOMPurifyConfig;
  streaming?: XMarkdownProps['streaming'];
}

class Renderer {
  private readonly options: RendererOptions;
  private static readonly NON_WHITESPACE_REGEX = /[^\r\n\s]+/;

  constructor(options: RendererOptions) {
    this.options = options;
  }

  private static isBrowserEnvironment(): boolean {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
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

    const allowedTags = Array.isArray(userConfig.ADD_TAGS) ? userConfig.ADD_TAGS : [];
    const addAttr = Array.isArray(userConfig.ADD_ATTR) ? userConfig.ADD_ATTR : [];

    return {
      ...userConfig,
      ADD_TAGS: Array.from(new Set([...customComponents, ...allowedTags])),
      ADD_ATTR: Array.from(new Set(['target', 'rel', ...addAttr])),
    };
  }

  private createReplaceElement(unclosedTags: Set<string> | undefined, cidRef: { current: number }) {
    const { enableAnimation, animationConfig } = this.options.streaming || {};
    return (domNode: DOMNode) => {
      const key = `x-markdown-component-${cidRef.current++}`;

      // Check if it's a text node with data
      const isValidTextNode =
        domNode.type === 'text' && domNode.data && Renderer.NON_WHITESPACE_REGEX.test(domNode.data);
      // Skip animation for text nodes inside custom components to preserve their internal structure
      const parentTagName = (domNode.parent as Element)?.name;
      const isParentCustomComponent = parentTagName && this.options.components?.[parentTagName];
      const shouldReplaceText = enableAnimation && isValidTextNode && !isParentCustomComponent;
      if (shouldReplaceText) {
        return React.createElement(AnimationText, { text: domNode.data, key, animationConfig });
      }

      if (!('name' in domNode)) return;

      const { name, attribs, children } = domNode as Element;
      const renderElement = this.options.components?.[name];
      if (renderElement) {
        const streamStatus = unclosedTags?.has(name) ? 'loading' : 'done';
        const props: ComponentProps = {
          domNode,
          streamStatus,
          key,
          ...attribs,
          ...(attribs.disabled !== undefined && { disabled: true }),
          ...(attribs.checked !== undefined && { checked: true }),
        };

        // Handle class and className merging
        const classes = [props.className, props.classname, props.class]
          .filter(Boolean)
          .join(' ')
          .trim();
        props.className = classes || '';

        if (name === 'code') {
          const { 'data-block': block = 'false', 'data-state': codeStreamStatus = 'done' } =
            attribs || {};
          props.block = block === 'true';
          props.streamStatus = codeStreamStatus === 'loading' ? 'loading' : 'done';
        }

        if (children) {
          props.children = this.processChildren(children as DOMNode[], unclosedTags, cidRef);
        }

        return React.createElement(renderElement, props);
      }
    };
  }

  private processChildren(
    children: DOMNode[],
    unclosedTags: Set<string> | undefined,
    cidRef: { current: number },
  ): ReactNode {
    return domToReact(children as DOMNode[], {
      replace: this.createReplaceElement(unclosedTags, cidRef),
    });
  }

  private safeSanitize(htmlString: string, config: DOMPurifyConfig): string {
    if (!Renderer.isBrowserEnvironment()) {
      return htmlString;
    }

    return DOMPurify.sanitize(htmlString, config);
  }

  public processHtml(htmlString: string): React.ReactNode {
    const unclosedTags = this.detectUnclosedTags(htmlString);
    const cidRef = { current: 0 };

    // Use DOMPurify to clean HTML while preserving custom components and target attributes
    const purifyConfig = this.configureDOMPurify();
    const cleanHtml = this.safeSanitize(htmlString, purifyConfig);

    return parseHtml(cleanHtml, {
      replace: this.createReplaceElement(unclosedTags, cidRef),
    });
  }

  public render(html: string): ReactNode | null {
    return this.processHtml(html);
  }
}

export default Renderer;
