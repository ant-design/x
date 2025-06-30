import htmlParse from 'html-react-parser';
import {
  MaybePromise,
  RendererExtension,
  TokenizerAndRendererExtension,
  TokenizerExtension,
} from 'marked';
import { Fragment, ReactNode } from 'react';
import React from 'react';
import { jsx } from 'react/jsx-runtime';
import type {
  GenericRendererFunction,
  MarkdownXOptions,
  RendererObject,
  Token,
  XMarkdownProps,
} from '../interface';

type Extension = TokenizerExtension & RendererExtension;

type Renderer = MarkdownXOptions['XRenderer'];

type CustomComponentConfig = {
  name: string;
  renderer: (...args: unknown[]) => React.ReactNode;
};

class MarkdownConfigBuilder {
  private options: MarkdownXOptions;
  private baseRenderer: Renderer;

  constructor(baseRenderer: Renderer, config: XMarkdownProps['config']) {
    this.baseRenderer = baseRenderer;
    this.options = {
      gfm: config?.gfm ?? true,
      breaks: config?.break ?? true,
      XRenderer: this.baseRenderer,
      extensions: {
        renderers: {},
        childTokens: {},
      },
    };
  }

  private createComponentExtension(config: CustomComponentConfig) {
    const { name: cname, renderer } = config;
    const name = `customComponent-${cname}`;

    return [
      {
        name,
        level: 'block' as TokenizerExtension['level'],
        start(src: string) {
          const idx = src.indexOf(`<${cname}`);
          return idx >= 0 ? idx : undefined;
        },
        tokenizer(src: string) {
          const rule = new RegExp(`^<(${cname})(.*?)>(.*?)</(${cname})>`, 's');
          const match = rule.exec(src);
          if (match) {
            return {
              type: name,
              renderType: 'component',
              raw: match[0],
              text: match[0],
            };
          }
          return undefined;
        },
        renderer: (token: Token) => {
          const { raw } = token;
          return htmlParse(raw, {
            transform(node: ReactNode) {
              if (!React.isValidElement(node) || node?.type !== cname.toLowerCase()) {
                return null;
              }
              return jsx(Fragment, { children: renderer(node?.props || {}) }, name);
            },
          });
        },
      },
    ];
  }

  private compileExtensions(exts: TokenizerAndRendererExtension[]) {
    const extensions = this.options.extensions!;
    const validatedExtensions = exts as Extension[];
    for (const ext of validatedExtensions) {
      if (!ext.name) {
        console.error('extension name required');
        continue;
      }

      if (ext.tokenizer && ext.level) {
        if (ext.level !== 'inline' && ext.level !== 'block') {
          console.error(`extension ${ext.name}: level must be 'block' or 'inline'`);
        }
        const extLevel = extensions[ext.level];
        if (extLevel) {
          extLevel.unshift(ext.tokenizer);
        } else {
          extensions[ext.level] = [ext.tokenizer];
        }

        if (ext.start) {
          if (ext.level === 'block') {
            if (extensions.startBlock) {
              extensions.startBlock.push(ext.start);
            } else {
              extensions.startBlock = [ext.start];
            }
          } else {
            if (extensions.startInline) {
              extensions.startInline.push(ext.start);
            } else {
              extensions.startInline = [ext.start];
            }
          }
        }
      }

      if (ext.renderer) {
        const prevRenderer = extensions.renderers[ext.name];
        if (prevRenderer) {
          // Replace extension with func to run new extension but fall back if false
          extensions.renderers[ext.name] = function (...args) {
            let ret = ext.renderer.apply(this, args);
            if (ret === false) {
              ret = prevRenderer.apply(this, args);
            }
            return ret;
          };
        } else {
          extensions.renderers[ext.name] = ext.renderer;
        }
      }

      if (ext.childTokens && Object.keys(ext.childTokens).length) {
        extensions.childTokens[ext.name] = ext.childTokens;
      }
    }
  }

  private mergeRendererOverrides(customRenderer: RendererObject) {
    const renderer = this.options.XRenderer;

    Object.entries(customRenderer).forEach(([prop, customRenderFunc]) => {
      if (prop === 'parser') return;
      // add extension to recognize component
      if (!(prop in renderer)) {
        this.compileExtensions(
          this.createComponentExtension({ name: prop, renderer: customRenderFunc }),
        );
        console.warn(`Renderer '${prop}' added as extension`);
        return;
      }

      const rendererProp = prop as keyof Renderer;
      const prevRenderer = renderer[rendererProp] as GenericRendererFunction;
      const rendererFunc = customRenderer[rendererProp] as GenericRendererFunction;

      (renderer[rendererProp] as GenericRendererFunction) = (...args: unknown[]) => {
        let ret = rendererFunc.apply(renderer, args);
        if (ret === false) {
          ret = prevRenderer.apply(renderer, args);
        }
        return ret || '';
      };
    });
  }

  public applyPlugins(plugins: XMarkdownProps['plugins'] = []) {
    plugins.forEach((plugin) => {
      if (plugin.extensions) {
        this.compileExtensions(plugin.extensions);
      }
      if (plugin.renderer) {
        this.mergeRendererOverrides(plugin.renderer);
      }
      if (plugin.walkTokens) {
        const walkTokens = this.options.walkTokens;
        const packWalkTokens = plugin.walkTokens;
        this.options.walkTokens = function (token) {
          let values: MaybePromise[] = [];
          values.push(packWalkTokens.call(this, token));
          if (walkTokens) {
            values = values.concat(walkTokens.call(this, token));
          }
          return values;
        };
      }
    });
    return this;
  }

  public applyComponents(components?: XMarkdownProps['components']) {
    if (components) {
      this.mergeRendererOverrides(components);
    }

    return this;
  }

  public build(): MarkdownXOptions {
    return this.options;
  }
}

export const createMarkdownOptions = (
  baseRenderer: Renderer,
  plugins: XMarkdownProps['plugins'] = [],
  components?: XMarkdownProps['components'],
  config?: XMarkdownProps['config'],
): MarkdownXOptions => {
  return new MarkdownConfigBuilder(baseRenderer, config)
    .applyPlugins(plugins)
    .applyComponents(components)
    .build();
};
