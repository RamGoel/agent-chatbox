import * as React from "react";
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
// Inline markdown renderer
// ============================================================================

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const pattern = /(\*\*([^*]+)\*\*)|(`([^`]+)`)|(\[([^\]]+)\]\(([^)]+)\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    if (match[2]) {
      nodes.push(
        <strong key={`${keyPrefix}-b-${i}`} className="font-semibold">
          {match[2]}
        </strong>
      );
    } else if (match[4]) {
      nodes.push(
        <code
          key={`${keyPrefix}-c-${i}`}
          className="rounded bg-ak-surface-hover px-1 py-0.5 font-mono text-xs text-ak-content"
        >
          {match[4]}
        </code>
      );
    } else if (match[6] && match[7]) {
      nodes.push(
        <a
          key={`${keyPrefix}-l-${i}`}
          href={match[7]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-ak-primary underline underline-offset-2 hover:text-ak-primary-hover"
        >
          {match[6]}
        </a>
      );
    }
    lastIndex = match.index + match[0].length;
    i++;
  }
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }
  return nodes;
}

// ============================================================================
// Block-level markdown renderer
// ============================================================================

function renderContent(content: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const codeBlockPattern = /```(\w+)?\n?([\s\S]*?)```/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = codeBlockPattern.exec(content)) !== null) {
    if (match.index > lastIndex) {
      const textPart = content.slice(lastIndex, match.index).trim();
      if (textPart) {
        nodes.push(...renderParagraphs(textPart, `${keyPrefix}-t-${i}`));
      }
    }
    const lang = match[1] || "tsx";
    const code = match[2].trimEnd();
    nodes.push(
      <div key={`${keyPrefix}-code-${i}`}>
        <CodeBlock code={code} language={lang} noBorder={false} minHeight={0} />
      </div>
    );
    lastIndex = match.index + match[0].length;
    i++;
  }

  if (lastIndex < content.length) {
    const textPart = content.slice(lastIndex).trim();
    if (textPart) {
      nodes.push(...renderParagraphs(textPart, `${keyPrefix}-t-end`));
    }
  }

  return nodes;
}

function renderParagraphs(text: string, keyPrefix: string): React.ReactNode[] {
  return text.split(/\n\n+/).map((para, idx) => {
    const trimmed = para.trim();
    if (!trimmed) return null;

    if (trimmed.startsWith("### ")) {
      return (
        <div key={`${keyPrefix}-p-${idx}`} className={idx > 0 ? "mt-3" : ""}>
          <span className="text-base font-semibold text-ak-content">
            {renderInline(trimmed.slice(4), `${keyPrefix}-p-${idx}`)}
          </span>
        </div>
      );
    }
    if (trimmed.startsWith("## ")) {
      return (
        <div key={`${keyPrefix}-p-${idx}`} className={idx > 0 ? "mt-3" : ""}>
          <span className="text-lg font-semibold text-ak-content">
            {renderInline(trimmed.slice(3), `${keyPrefix}-p-${idx}`)}
          </span>
        </div>
      );
    }
    if (trimmed.startsWith("# ")) {
      return (
        <div key={`${keyPrefix}-p-${idx}`} className={idx > 0 ? "mt-3" : ""}>
          <span className="text-lg font-semibold text-ak-content">
            {renderInline(trimmed.slice(2), `${keyPrefix}-p-${idx}`)}
          </span>
        </div>
      );
    }

    return (
      <div key={`${keyPrefix}-p-${idx}`}>
        <p
          className="text-sm text-ak-content"
          style={{ whiteSpace: "pre-wrap" }}
        >
          {renderInline(trimmed, `${keyPrefix}-p-${idx}`)}
        </p>
      </div>
    );
  });
}

// ============================================================================
// Component
// ============================================================================

export function Markdown({ content, className }: MarkdownProps) {
  return (
    <div className={cn("break-words leading-relaxed", className)}>
      <div className="flex flex-col gap-2">
        {renderContent(content, "mc")}
      </div>
    </div>
  );
}
