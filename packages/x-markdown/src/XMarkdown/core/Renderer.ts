import type { Config as DOMPurifyConfig } from 'dompurify';
import DOMPurify from 'dompurify';
import type { DOMNode, Element } from 'html-react-parser';
import parseHtml, { domToReact } from 'html-react-parser';
import React, { ReactNode } from 'react';
import AnimationText from '../AnimationText';
import type { ComponentProps, XMarkdownProps } from '../interface';
import { detectUnclosedComponentTags, getTagInstanceId } from './detectUnclosedComponentTags';

interface RendererOptions {
  components?: XMarkdownProps['components'];
  componentsProps?: XMarkdownProps['componentsProps'];
  dompurifyConfig?: DOMPurifyConfig;
  streaming?: XMarkdownProps['streaming'];
}

/**
 * Upper bound on remembered custom-component subtrees. A streamed answer only
 * ever grows, so the cache holds one entry per custom component already on
 * screen; the cap only matters for pathological documents.
 */
const SUBTREE_CACHE_LIMIT = 2000;

/**
 * A reused subtree is not walked again, so the id counters it would have
 * advanced have to be replayed — otherwise every later node shifts by the
 * number of skipped nodes, its key changes, and the cache misses from there on.
 */
interface CachedSubtree {
  element: React.ReactElement;
  cidDelta: number;
  tagIndexDeltas: Record<string, number>;
}

/**
 * Fix for DOMPurify 3.x in environments (e.g., happy-dom) where the cached
 * Node.prototype getters return incorrect values for elements created in a
 * different document context (the template content owner document).
 *
 * DOMPurify 3.x caches property getters from Node.prototype at module
 * initialization time:
 *   const getNodeName = lookupGetter(Node.prototype, 'nodeName');
 *   const getNodeValue = lookupGetter(Node.prototype, 'nodeValue');
 *
 * In happy-dom, calling these cached getters on elements from the template
 * content owner document returns empty string / null respectively, while
 * direct property access returns the correct value. This causes DOMPurify
 * to compute empty tagNames and strip nearly all elements from the output.
 *
 * The fix patches Node.prototype.nodeName and Node.prototype.nodeValue with
 * safe fallbacks that use direct property access when the cached getter
 * returns a falsy value. Then a fresh DOMPurify instance is created that
 * picks up the patched getters.
 *
 * This is idempotent — calling it multiple times has no additional effect.
 */
let patchedDOMPurify: typeof DOMPurify | null = null;

function createPatchedDOMPurify(): typeof DOMPurify {
  if (patchedDOMPurify) return patchedDOMPurify;

  if (typeof window !== 'undefined' && typeof Node !== 'undefined') {
    // Detect if the Node.prototype.nodeName getter is broken for template
    // content elements (the happy-dom bug).
    try {
      const template = document.createElement('template');
      template.innerHTML = '<test-detect></test-detect>';
      const testEl = template.content.firstChild;
      if (testEl) {
        const nodeNameGetter = Object.getOwnPropertyDescriptor(Node.prototype, 'nodeName')?.get;
        const nodeValueGetter = Object.getOwnPropertyDescriptor(Node.prototype, 'nodeValue')?.get;

        // If the cached getter returns empty/falsy for an element that has
        // a valid nodeName via direct access, we need to patch.
        const needsNodeNamePatch =
          nodeNameGetter && testEl.nodeName && !nodeNameGetter.call(testEl);

        if (needsNodeNamePatch) {
          const originalNodeNameGet = nodeNameGetter;
          Object.defineProperty(Node.prototype, 'nodeName', {
            get: function (this: Node) {
              const value = originalNodeNameGet!.call(this);
              if (value) return value;
              // Fallback: for Element nodes, use tagName directly
              if (this.nodeType === 1 && 'tagName' in this) {
                return (this as unknown as { tagName: string }).tagName;
              }
              // Fallback: standard nodeName values for other node types
              switch (this.nodeType) {
                case 3:
                  return '#text';
                case 4:
                  return '#cdata-section';
                case 7:
                  return '#processing-instruction';
                case 8:
                  return '#comment';
                case 9:
                  return '#document';
                case 11:
                  return '#document-fragment';
              }
              return value;
            },
            configurable: true,
            enumerable: true,
          });
        }

        // Check if nodeValue getter is also broken for text nodes
        const needsNodeValuePatch =
          nodeValueGetter &&
          (() => {
            template.innerHTML = '<div>test</div>';
            const textNode = template.content.firstChild?.firstChild;
            if (!textNode) return false;
            const viaGetter = nodeValueGetter.call(textNode);
            const viaDirect = textNode.nodeValue;
            // getter returns null/undefined but direct access returns the value
            return viaDirect != null && viaGetter == null;
          })();

        if (needsNodeValuePatch) {
          const originalNodeValueGet = nodeValueGetter;
          Object.defineProperty(Node.prototype, 'nodeValue', {
            get: function (this: Node) {
              const value = originalNodeValueGet!.call(this);
              if (value !== null && value !== undefined) return value;
              // For CharacterData nodes (text, comment, CDATA), fall back to
              // the .data property which stores the text content in happy-dom.
              if (
                (this.nodeType === 3 || this.nodeType === 4 || this.nodeType === 8) &&
                'data' in this
              ) {
                return (this as CharacterData).data;
              }
              return value;
            },
            configurable: true,
            enumerable: true,
          });
        }

        if (needsNodeNamePatch || needsNodeValuePatch) {
          // Create a fresh DOMPurify instance that will re-read (and cache)
          // the patched getters from Node.prototype.
          patchedDOMPurify = DOMPurify(window);
          return patchedDOMPurify;
        }
      }
    } catch {
      // If detection fails (e.g., in SSR), fall through to default DOMPurify
    }
  }

  // No patching needed — use the default exported instance
  patchedDOMPurify = DOMPurify;
  return patchedDOMPurify;
}

class Renderer {
  private readonly options: RendererOptions;
  private static readonly NON_WHITESPACE_REGEX = /[^\r\n\s]+/;

  constructor(options: RendererOptions) {
    this.options = options;
  }

  private detectUnclosedTags(htmlString: string): Set<string> {
    return detectUnclosedComponentTags(htmlString, Object.keys(this.options.components ?? {}));
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

  /**
   * Custom-component subtrees keyed by the exact HTML slice they were built
   * from. Returning the *same* React element for unchanged HTML lets React bail
   * out of that subtree entirely, which is what keeps an already-rendered code
   * block from being re-highlighted on every streamed chunk.
   */
  private subtreeCache = new Map<string, CachedSubtree>();

  private createReplaceElement(
    unclosedTags: Set<string> | undefined,
    cidRef: { current: number; tagIndexes: Record<string, number> },
    sourceHtml: string,
    cacheable: boolean,
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
        cidRef.tagIndexes[name] = (cidRef.tagIndexes[name] ?? 0) + 1;
        const streamStatus = unclosedTags?.has(getTagInstanceId(name, cidRef.tagIndexes[name]))
          ? 'loading'
          : 'done';

        // Identical HTML at the same position produces an identical element, so
        // hand back the one already built and let React skip the whole subtree.
        // `key` and `streamStatus` are part of the identity because both are
        // derived from position and from the unclosed-tag scan, not from the
        // slice alone.
        //
        // The slice alone is not enough while a custom tag is still unclosed:
        // sanitization auto-closes it, so "outer open, inner open" and "outer
        // open, inner closed" sanitize to the very same slice with the very
        // same status on the outer element, while their descendants differ.
        // `cacheable` is false for the whole render in that case.
        const { startIndex, endIndex } = domNode as unknown as {
          startIndex: number | null;
          endIndex: number | null;
        };
        const cacheKey =
          !cacheable || startIndex === null || endIndex === null
            ? null
            : `${key} ${streamStatus} ${sourceHtml.slice(startIndex, endIndex + 1)}`;
        if (cacheKey !== null) {
          const cached = this.subtreeCache.get(cacheKey);
          if (cached) {
            cidRef.current += cached.cidDelta;
            for (const tag of Object.keys(cached.tagIndexDeltas)) {
              cidRef.tagIndexes[tag] = (cidRef.tagIndexes[tag] ?? 0) + cached.tagIndexDeltas[tag];
            }
            return cached.element;
          }
        }
        const cidBefore = cidRef.current;
        const tagIndexesBefore = { ...cidRef.tagIndexes };

        const props: ComponentProps = {
          ...attribs,
          ...(attribs.disabled !== undefined && { disabled: true }),
          ...(attribs.checked !== undefined && { checked: true }),
          ...this.options.componentsProps?.[name],
          // Internally computed props are applied last so that neither parsed HTML
          // attributes nor componentsProps can shadow them.
          domNode,
          streamStatus,
          key,
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
          const langFromData = attribs?.['data-lang'];
          const langFromClass =
            attribs?.class?.match(/(?:^|\s)language-([^\s]+)/)?.[1] ??
            attribs?.class?.match(/(?:^|\s)lang-([^\s]+)/)?.[1];
          const lang = langFromData || langFromClass;
          if (lang) {
            props.lang = lang;
          } else {
            // No language metadata: inline code and unlabeled fences must not inherit a
            // `lang` from the HTML attributes or componentsProps.
            delete props.lang;
          }
        }

        if (children) {
          props.children = this.processChildren(
            children as DOMNode[],
            unclosedTags,
            cidRef,
            sourceHtml,
            cacheable,
          );
        }

        const element = React.createElement(renderElement, props);
        if (cacheKey !== null) {
          if (this.subtreeCache.size >= SUBTREE_CACHE_LIMIT) this.subtreeCache.clear();
          const tagIndexDeltas: Record<string, number> = {};
          for (const tag of Object.keys(cidRef.tagIndexes)) {
            const delta = cidRef.tagIndexes[tag] - (tagIndexesBefore[tag] ?? 0);
            if (delta !== 0) tagIndexDeltas[tag] = delta;
          }
          this.subtreeCache.set(cacheKey, {
            element,
            cidDelta: cidRef.current - cidBefore,
            tagIndexDeltas,
          });
        }
        return element;
      }
    };
  }

  private processChildren(
    children: DOMNode[],
    unclosedTags: Set<string> | undefined,
    cidRef: { current: number; tagIndexes: Record<string, number> },
    sourceHtml: string,
    cacheable: boolean,
  ): ReactNode {
    return domToReact(children as DOMNode[], {
      replace: this.createReplaceElement(unclosedTags, cidRef, sourceHtml, cacheable),
    });
  }

  public processHtml(htmlString: string): React.ReactNode {
    // SSR / no DOM: DOMPurify needs a DOM to sanitize, so its default export has no
    // `sanitize` method when there is no `window` (e.g. server pre-render). Skip rendering
    // here and let the client hydrate, matching the pre-streaming-refactor server behavior.
    if (typeof DOMPurify.sanitize !== 'function') {
      return null;
    }

    const unclosedTags = this.detectUnclosedTags(htmlString);
    const cidRef = { current: 0, tagIndexes: {} };
    // Subtree reuse is only sound once every custom tag in the document is
    // closed; see the note in createReplaceElement.
    const cacheable = !unclosedTags || unclosedTags.size === 0;

    // Get a DOMPurify instance that works correctly in environments where
    // Node.prototype getters are broken for template content elements.
    const purify = createPatchedDOMPurify();

    // Use DOMPurify to clean HTML while preserving custom components and target attributes
    const purifyConfig = this.configureDOMPurify();
    const cleanHtml = purify.sanitize(htmlString, purifyConfig);

    return parseHtml(cleanHtml, {
      // Start/end indices let a custom-component subtree be identified by the
      // exact HTML it came from, which is what the subtree cache keys on.
      htmlparser2: { withStartIndices: true, withEndIndices: true },
      replace: this.createReplaceElement(unclosedTags, cidRef, cleanHtml, cacheable),
    });
  }

  public render(html: string): ReactNode | null {
    return this.processHtml(html);
  }
}

export default Renderer;
