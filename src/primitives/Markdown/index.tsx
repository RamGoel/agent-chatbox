import * as React from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "../../lib/cn";
import { CodeBlock } from "../../components/CodeBlock";

// ============================================================================
// Types
// ============================================================================

export interface MarkdownProps {
  content: string;
  className?: string;
}

// ============================================================================
// Helpers
// ============================================================================

interface HastNode {
  type: string;
  value?: string;
  tagName?: string;
  properties?: { className?: unknown };
  children?: HastNode[];
}

function hastText(node: HastNode): string {
  if (node.type === "text") return node.value ?? "";
  return (node.children ?? []).map(hastText).join("");
}

function codeLanguage(node: HastNode | undefined): string {
  const classes = node?.properties?.className;
  if (!Array.isArray(classes)) return "text";
  const lang = classes.find((c): c is string => typeof c === "string" && c.startsWith("language-"));
  return lang ? lang.slice("language-".length) : "text";
}

const SAFE_URL = /^(https?:|mailto:|#|\/)/i;

// ============================================================================
// Element mapping
// ============================================================================

const components: Components = {
  h1: ({ children }) => <h1 className="mt-1 text-lg font-semibold">{children}</h1>,
  h2: ({ children }) => <h2 className="mt-1 text-lg font-semibold">{children}</h2>,
  h3: ({ children }) => <h3 className="mt-1 text-base font-semibold">{children}</h3>,
  h4: ({ children }) => <h4 className="font-semibold">{children}</h4>,
  h5: ({ children }) => <h5 className="font-semibold">{children}</h5>,
  h6: ({ children }) => <h6 className="font-semibold">{children}</h6>,
  p: ({ children }) => <p className="whitespace-pre-wrap">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  del: ({ children }) => <del className="line-through">{children}</del>,
  a: ({ href, children }) =>
    href && SAFE_URL.test(href) ? (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-ak-primary underline underline-offset-2 hover:text-ak-primary-hover"
      >
        {children}
      </a>
    ) : (
      <span>{children}</span>
    ),
  img: ({ src, alt }) =>
    typeof src === "string" && SAFE_URL.test(src) ? (
      <a
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        className="text-ak-primary underline underline-offset-2 hover:text-ak-primary-hover"
      >
        {alt || src}
      </a>
    ) : null,
  ul: ({ children }) => <ul className="flex list-disc flex-col gap-1 pl-5">{children}</ul>,
  ol: ({ children, start }) => (
    <ol start={start} className="flex list-decimal flex-col gap-1 pl-5">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="[&>ol]:mt-1 [&>ul]:mt-1">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="flex flex-col gap-2 border-l-2 border-ak-border pl-3 text-ak-content-secondary">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="border-t border-ak-border" />,
  table: ({ children }) => (
    <div className="ak-scroll overflow-x-auto">
      <table className="w-full text-left">{children}</table>
    </div>
  ),
  th: ({ children, style }) => (
    <th style={style} className="border-b border-ak-border px-2 py-1 font-semibold">
      {children}
    </th>
  ),
  td: ({ children, style }) => (
    <td style={style} className="border-b border-ak-border px-2 py-1">
      {children}
    </td>
  ),
  code: ({ children }) => (
    <code className="rounded bg-ak-surface-hover px-1 py-0.5 font-mono text-xs">
      {children}
    </code>
  ),
  pre: ({ node }) => {
    const codeNode = (node as HastNode | undefined)?.children?.find(
      (c) => c.type === "element" && c.tagName === "code"
    );
    return (
      <CodeBlock
        code={codeNode ? hastText(codeNode).replace(/\n$/, "") : ""}
        language={codeLanguage(codeNode)}
        minHeight={0}
      />
    );
  },
};

// ============================================================================
// Component
// ============================================================================

export function Markdown({ content, className }: MarkdownProps) {
  return (
    <div
      className={cn(
        "ak flex flex-col gap-2 break-words text-sm leading-relaxed text-ak-content",
        className
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
