import React, { useEffect, useState } from "react";
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

export function CodeBlock({
  code,
  label,
  minHeight = 120,
  language = "tsx",
  noBorder = false,
  noCopy = false,
}: CodeBlockProps) {
  const [html, setHtml] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [shiki, prettierMod] = await Promise.all([
          import("shiki"),
          import("prettier/standalone"),
        ]);
        const parserMod = await import("prettier/plugins/typescript");
        const estreeMod = await import("prettier/plugins/estree");

        let formattedCode = code;
        try {
          formattedCode = await prettierMod.format(code, {
            parser: "tsx",
            plugins: [parserMod.default, estreeMod.default],
            semi: true,
            singleQuote: false,
            tabWidth: 2,
          });
        } catch {
          // If Prettier fails (e.g. bash language), use raw code
        }

        const highlighter = await shiki.createHighlighter({
          themes: ["github-dark"],
          langs: ["tsx", "jsx", "typescript", "bash", "json", "diff"],
        });
        const out = highlighter.codeToHtml(formattedCode.trim(), {
          lang: language,
          theme: "github-dark",
        });
        if (!cancelled) setHtml(out);
        highlighter.dispose();
      } catch {
        if (!cancelled) setHtml("");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [code, language]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-2" style={{ minWidth: 280 }}>
      {label && (
        <span className="text-xs font-medium text-ak-content-tertiary">
          {label}
        </span>
      )}
      <div
        className={cn(!noBorder && "rounded-lg border border-ak-border", "overflow-hidden")}
        style={{
          minHeight,
          backgroundColor: "#24292e",
          position: "relative",
        }}
      >
        {!noCopy && (
          <button
            onClick={handleCopy}
            title="Copy code"
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
              fontFamily: "var(--ak-font-mono, monospace)",
              fontSize: 13,
              lineHeight: 1.6,
              color: "#e4e4e7",
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
