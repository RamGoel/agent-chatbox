import React, { useEffect, useState } from "react";
import type { Highlighter } from "shiki";
import { cn } from "../../lib/cn";
import { Copy, Check } from "lucide-react";

export interface CodeBlockProps {
  code: string;
  label?: string;
  minHeight?: number;
  noBorder?: boolean;
  noCopy?: boolean;
  language?: string;
}

const THEME = "github-dark";
const PLAIN_LANGS = new Set(["text", "plaintext", "plain", "txt", ""]);

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = import("shiki")
      .then((shiki) => shiki.createHighlighter({ themes: [THEME], langs: [] }))
      .catch((err) => {
        highlighterPromise = null;
        throw err;
      });
  }
  return highlighterPromise;
}

async function highlight(code: string, language: string): Promise<string> {
  const [{ bundledLanguages }, highlighter] = await Promise.all([
    import("shiki"),
    getHighlighter(),
  ]);
  const requested = language.toLowerCase();
  const lang =
    !PLAIN_LANGS.has(requested) && requested in bundledLanguages ? requested : "text";
  if (lang !== "text" && !highlighter.getLoadedLanguages().includes(lang)) {
    await highlighter.loadLanguage(lang as keyof typeof bundledLanguages);
  }
  return highlighter.codeToHtml(code, { lang, theme: THEME });
}

export function CodeBlock({
  code,
  label,
  minHeight = 120,
  language = "text",
  noBorder = false,
  noCopy = false,
}: CodeBlockProps) {
  const [html, setHtml] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    highlight(code.trimEnd(), language)
      .then((out) => {
        if (!cancelled) setHtml(out);
      })
      .catch(() => {
        if (!cancelled) setHtml("");
      });
    return () => {
      cancelled = true;
    };
  }, [code, language]);

  const handleCopy = () => {
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }, () => {});
  };

  return (
    <div className="ak ak-codeblock flex flex-col gap-2" style={{ minWidth: 280 }}>
      {label && (
        <span className="text-xs font-medium text-ak-content-tertiary">
          {label}
        </span>
      )}
      <div
        className={cn(!noBorder && "rounded-lg border border-ak-border", "overflow-hidden")}
        style={{
          minHeight,
          backgroundColor: "var(--ak-code-surface)",
          color: "var(--ak-code-content)",
          position: "relative",
        }}
      >
        {!noCopy && (
          <button
            type="button"
            onClick={handleCopy}
            title="Copy code"
            aria-label={copied ? "Copied" : "Copy code"}
            className="absolute right-2 top-2 z-10 flex size-8 items-center justify-center rounded-lg border border-ak-border bg-ak-surface text-ak-content-secondary transition-colors hover:bg-ak-surface-hover hover:text-ak-content"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        )}
        {html ? (
          <div
            style={{
              margin: 0,
              padding: "12px",
              fontSize: 13,
              lineHeight: 1.6,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <pre
            style={{
              margin: 0,
              padding: "12px",
              fontSize: 13,
              lineHeight: 1.6,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            <code>{code}</code>
          </pre>
        )}
      </div>
    </div>
  );
}
