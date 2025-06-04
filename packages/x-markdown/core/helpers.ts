import {
  MarkedOptions,
  MaybePromise,
  TokenizerAndRendererExtension,
  TokenizerExtension,
} from 'marked';
import { MarkdownProps, RendererExtensionFunction } from '../interface';
import { Renderer } from '.';

interface MarkdownXOptions extends MarkedOptions {
  XRenderer: Renderer;
}

const unEscapeReplacements = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
};

const entityRegex = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/gi;

export const unescape = (text: string) => {
  return entityRegex.test(text)
    ? text.replace(entityRegex, (entity) => unEscapeReplacements[entity] || "'")
    : text;
};

const overrideRenderer = (
  renderer: Renderer,
  customRenderer: RendererExtensionFunction,
): Renderer => {
  const renderer_: Renderer = Object.assign({}, renderer);
  for (const prop in customRenderer) {
    if (!renderer_[prop]) {
      throw new Error(`renderer '${prop}' does not exist`);
    }
    if (['parser'].includes(prop)) {
      // ignore options property
      continue;
    }
    const rendererProp = prop as Exclude<keyof Renderer, 'parser'>;
    const rendererFunc = customRenderer[rendererProp];
    const prevRenderer = renderer_[rendererProp];
    renderer_[rendererProp] = (...args: unknown[]) => {
      let ret = rendererFunc.apply(renderer_, args);
      if (ret === false) {
        ret = prevRenderer.apply(renderer_, args);
      }
      return ret || '';
    };
  }
  return renderer_;
};

const processExtensions = (exts: TokenizerAndRendererExtension[]) => {
  const extensions: MarkedOptions['extensions'] = { renderers: {}, childTokens: {} };

  for (const ext of exts) {
    if (!ext.name) {
      throw new Error('extension name required');
    }

    if ('tokenizer' in ext) {
      if (ext.level !== 'inline' && ext.level !== 'block') {
        throw new Error("extension level must be 'block' or 'inline'");
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

    if ('renderer' in ext) {
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

    if ('childTokens' in ext && ext.childTokens) {
      extensions.childTokens[ext.name] = ext.childTokens;
    }
  }
  return extensions;
};

export const processOptions = (
  plugins: MarkdownProps['plugins'],
  components: MarkdownProps['components'],
): MarkdownXOptions => {
  const options = { XRenderer: new Renderer() } as MarkdownXOptions;

  plugins?.forEach((plugin) => {
    if (plugin.extensions) {
      options.extensions = processExtensions(plugin.extensions);
    }
    if (plugin.renderer) {
      options.XRenderer = overrideRenderer(options.XRenderer, plugin.renderer);
    }
    if (components) {
      options.XRenderer = overrideRenderer(options.XRenderer, components);
    }
    if (plugin.walkTokens) {
      const walkTokens = options.walkTokens;
      const packWalkTokens = plugin.walkTokens;
      options.walkTokens = function (token) {
        let values: MaybePromise[] = [];
        values.push(packWalkTokens.call(this, token));
        if (walkTokens) {
          values = values.concat(walkTokens.call(this, token));
        }
        return values;
      };
    }
  });

  return options;
};
