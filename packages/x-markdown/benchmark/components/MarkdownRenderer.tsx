import MarkdownIt from 'markdown-it';
import { marked } from 'marked';
import React, { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { Streamdown } from 'streamdown';
import XMarkdown from '../../src';

type MarkdownRendererProps = {
  md: string;
};

const md = new MarkdownIt();

const MarkedRenderer: FC<MarkdownRendererProps> = (props) => (
  <div
    className="markdown-container"
    // biome-ignore lint/security/noDangerouslySetInnerHtml: benchmark only
    dangerouslySetInnerHTML={{ __html: marked.parse(props.md) as string }}
  />
);

const MarkdownItRenderer: FC<MarkdownRendererProps> = (props) => {
  return (
    // biome-ignore lint/security/noDangerouslySetInnerHtml: benchmark only
    <div className="markdown-container" dangerouslySetInnerHTML={{ __html: md.render(props.md) }} />
  );
};

const ReactMarkdownRenderer: FC<MarkdownRendererProps> = (props) => (
  <div className="markdown-container">
    <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>
      {props.md}
    </ReactMarkdown>
  </div>
);

const XMarkdownRenderer: FC<MarkdownRendererProps> = (props) => (
  <div className="markdown-container">
    <XMarkdown>{props.md}</XMarkdown>
  </div>
);

const StreamdownRenderer: FC<MarkdownRendererProps> = (props) => (
  <div className="markdown-container">
    <Streamdown>{props.md}</Streamdown>
  </div>
);

const Empty = () => <div />;

export {
  MarkedRenderer,
  MarkdownItRenderer,
  ReactMarkdownRenderer,
  XMarkdownRenderer,
  StreamdownRenderer,
  Empty,
};
