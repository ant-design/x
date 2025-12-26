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
  private static readonly VOID_ELEMENTS = new Set<string>([
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr',
  ]);

  constructor(options: RendererOptions) {
    this.options = options;
  }

  /**
   * Detect unclosed tags using regular expressions
   */
  private detectUnclosedTags(htmlString: string): Set<string> {
    const unclosedTags = new Set<string>();

    // Convert tags to lowercase Set for case-insensitive lookup
    const tagsToCheckLower = new Set<string>(
      Object.keys(this.options.components ?? {}).map((tag) => tag.toLowerCase()),
    );

    // Track occurrence count for each tag type to generate unique identifiers
    const tagCount: Record<string, number> = {};

    // Stack to track opening tags of non-void elements awaiting closure
    const openTagsStack: Record<string, number[]> = {};

    let currentPos = 0;
    const htmlLength = htmlString.length;

    while (currentPos < htmlLength) {
      if (htmlString[currentPos] === '<') {
        // Check if this is a closing tag (e.g., </tag>)
        if (currentPos + 1 < htmlLength && htmlString[currentPos + 1] === '/') {
          // Attempt to parse the closing tag
          let scanPos = currentPos + 2;
          let tagName = '';

          // Skip leading whitespace after </
          while (scanPos < htmlLength && /\s/.test(htmlString[scanPos])) scanPos++;

          // Extract the tag name (alphanumeric characters and hyphens for custom components)
          while (scanPos < htmlLength && /[a-zA-Z0-9-]/.test(htmlString[scanPos])) {
            tagName += htmlString[scanPos];
            scanPos++;
          }

          // Skip trailing whitespace before >
          while (scanPos < htmlLength && /\s/.test(htmlString[scanPos])) scanPos++;

          // Validate closing tag syntax and process if valid
          if (scanPos < htmlLength && htmlString[scanPos] === '>' && tagName) {
            const tagNameLower = tagName.toLowerCase();
            if (tagsToCheckLower.has(tagNameLower)) {
              // Pop the most recent matching opening tag from the stack
              if (openTagsStack[tagNameLower] && openTagsStack[tagNameLower].length > 0) {
                openTagsStack[tagNameLower].pop();
              }
            }
            currentPos = scanPos + 1;
            continue;
          }
        } else {
          // Attempt to parse an opening tag (e.g., <tag ...>)
          let scanPos = currentPos + 1;
          let tagName = '';

          // Extract the tag name (alphanumeric characters and hyphens for custom components)
          while (scanPos < htmlLength && /[a-zA-Z0-9-]/.test(htmlString[scanPos])) {
            tagName += htmlString[scanPos];
            scanPos++;
          }

          if (tagName) {
            const tagNameLower = tagName.toLowerCase();

            if (tagsToCheckLower.has(tagNameLower)) {
              // Increment occurrence counter for this tag type
              tagCount[tagNameLower] = (tagCount[tagNameLower] || 0) + 1;
              const currentIndex = tagCount[tagNameLower];

              // Scan forward to find the end of the opening tag
              let foundTagEnd = false;
              let isSelfClosing = false;

              // Continue scanning until we find the closing '>'
              while (scanPos < htmlLength) {
                if (htmlString[scanPos] === '>') {
                  foundTagEnd = true;
                  // Detect self-closing syntax (e.g., <br/> or < img />)
                  if (scanPos > 0 && htmlString[scanPos - 1] === '/') {
                    isSelfClosing = true;
                  }
                  break;
                }
                // Handle quoted attribute values to avoid false positives on '>' within quotes
                if (htmlString[scanPos] === '"' || htmlString[scanPos] === "'") {
                  const quoteChar = htmlString[scanPos];
                  scanPos++;
                  while (scanPos < htmlLength && htmlString[scanPos] !== quoteChar) {
                    scanPos++;
                  }
                }
                scanPos++;
              }

              if (!foundTagEnd) {
                // Tag syntax is incomplete (missing closing '>')
                unclosedTags.add(`${tagNameLower}-${currentIndex}`);
              } else if (!isSelfClosing && !Renderer.VOID_ELEMENTS.has(tagNameLower)) {
                // Non-void, non-self-closing tag requires a matching closing tag
                if (!openTagsStack[tagNameLower]) {
                  openTagsStack[tagNameLower] = [];
                }
                openTagsStack[tagNameLower].push(currentIndex);
              }
              // Void elements and self-closing tags are considered properly closed

              currentPos = foundTagEnd ? scanPos + 1 : htmlLength;
              continue;
            }
          }
        }
      }
      currentPos++;
    }

    // Any tags remaining on the stack were never closed
    for (const tagNameLower of tagsToCheckLower) {
      if (openTagsStack[tagNameLower]) {
        for (const tagIndex of openTagsStack[tagNameLower]) {
          // unclosedTags.add(`${tagNameLower}`);
          unclosedTags.add(`${tagNameLower}-${tagIndex}`);
        }
      }
    }

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

  private createReplaceElement(
    unclosedTags: Set<string> | undefined,
    cidRef: { current: number; tagIndexes: Record<string, number> },
  ) {
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
        // Manage tag indexes for custom components used for streaming status determination
        cidRef.tagIndexes[name] = (cidRef.tagIndexes[name] ?? 0) + 1;
        const streamStatus = unclosedTags?.has(`${name}-${cidRef.tagIndexes[name]}`)
          ? 'loading'
          : 'done';
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
    cidRef: { current: number; tagIndexes: Record<string, number> },
  ): ReactNode {
    return domToReact(children as DOMNode[], {
      replace: this.createReplaceElement(unclosedTags, cidRef),
    });
  }

  public processHtml(htmlString: string): React.ReactNode {
    const unclosedTags = this.detectUnclosedTags(htmlString);
    const cidRef = { current: 0, tagIndexes: {} };

    // Use DOMPurify to clean HTML while preserving custom components and target attributes
    const purifyConfig = this.configureDOMPurify();
    const cleanHtml = DOMPurify.sanitize(htmlString, purifyConfig);

    return parseHtml(cleanHtml, {
      replace: this.createReplaceElement(unclosedTags, cidRef),
    });
  }

  public render(html: string): ReactNode | null {
    return this.processHtml(html);
  }
}

export default Renderer;
