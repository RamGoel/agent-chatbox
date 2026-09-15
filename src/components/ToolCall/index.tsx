import * as React from "react";
import { cn } from "../../lib/cn";
import {
  File,
  Pencil,
  Trash2,
  ArrowUp,
  Search,
  Globe,
  TerminalSquare,
  Brain,
  Download,
  ChevronsUpDown,
  Code2,
  ChevronRight,
  CircleAlert,
  type LucideIcon,
} from "lucide-react";
import { CodeBlock } from "../CodeBlock";
import { Markdown } from "../../primitives/Markdown";

// ============================================================================
// Types
// ============================================================================

export type ToolKind =
  | "read"
  | "edit"
  | "delete"
  | "move"
  | "search"
  | "web_search"
  | "execute"
  | "think"
  | "fetch"
  | "switch_mode"
  | "other";

export type ToolStatus = "in_progress" | "success" | "error" | "";

export interface ToolContent {
  type: "content" | "diff" | "terminal";
  text?: string;
  path?: string;
  oldText?: string | null;
  newText?: string;
  terminalId?: string;
}

export interface ToolCallProps {
  toolCallId?: string;
  toolTitle?: string;
  toolKind?: ToolKind;
  toolStatus?: ToolStatus;
  toolContent?: ToolContent[];
  defaultExpanded?: boolean;
  className?: string;
}

// ============================================================================
// Tool kind resolution
// ============================================================================

export function resolveToolKind(
  title: string,
  content?: ToolContent[]
): ToolKind {
  const lower = (title || "").toLowerCase();

  if (
    lower.includes("web search") ||
    lower.includes("web_search") ||
    lower.includes("websearch")
  ) {
    return "web_search";
  }

  if (content) {
    if (content.some((c) => c.type === "terminal")) return "execute";
    if (content.some((c) => c.type === "diff")) return "edit";
  }

  if (
    lower.includes("bash") ||
    lower.includes("shell") ||
    lower.includes("terminal") ||
    lower.includes("command") ||
    lower.includes("run ")
  ) {
    return "execute";
  }
  if (lower.includes("read") || lower.includes("cat ") || lower.includes("view")) {
    return "read";
  }
  if (
    lower.includes("write") ||
    lower.includes("edit") ||
    lower.includes("patch") ||
    lower.includes("modify")
  ) {
    return "edit";
  }
  if (lower.includes("search") || lower.includes("grep") || lower.includes("find")) {
    return "search";
  }
  if (lower.includes("think") || lower.includes("reason")) {
    return "think";
  }
  if (lower.includes("fetch") || lower.includes("download") || lower.includes("curl")) {
    return "fetch";
  }
  if (lower.includes("delete") || lower.includes("remove")) {
    return "delete";
  }
  if (lower.includes("move") || lower.includes("rename")) {
    return "move";
  }

  return "other";
}

export function getToolKindLabel(kind: ToolKind): string {
  switch (kind) {
    case "read": return "Read";
    case "edit": return "Edit";
    case "delete": return "Delete";
    case "move": return "Move";
    case "search": return "Search";
    case "web_search": return "Web";
    case "execute": return "Run";
    case "think": return "Think";
    case "fetch": return "Fetch";
    case "switch_mode": return "Switch";
    default: return "Tool";
  }
}

// ============================================================================
// Icon mapping
// ============================================================================

const KIND_ICON: Record<ToolKind, LucideIcon> = {
  read: File,
  edit: Pencil,
  delete: Trash2,
  move: ArrowUp,
  search: Search,
  web_search: Globe,
  execute: TerminalSquare,
  think: Brain,
  fetch: Download,
  switch_mode: ChevronsUpDown,
  other: Code2,
};

// ============================================================================
// Diff computation — simple line-by-line diff (no external dep)
// ============================================================================

interface DiffLine {
  type: "add" | "del" | "ctx";
  text: string;
}

function computeDiff(oldText: string, newText: string): DiffLine[] {
  const oldLines = oldText.split("\n");
  const newLines = newText.split("\n");

  const m = oldLines.length;
  const n = newLines.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0)
  );

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (oldLines[i - 1] === newLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const result: DiffLine[] = [];
  let i = m, j = n;
  while (i > 0 && j > 0) {
    if (oldLines[i - 1] === newLines[j - 1]) {
      result.unshift({ type: "ctx", text: oldLines[i - 1] });
      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      result.unshift({ type: "del", text: oldLines[i - 1] });
      i--;
    } else {
      result.unshift({ type: "add", text: newLines[j - 1] });
      j--;
    }
  }
  while (i > 0) {
    result.unshift({ type: "del", text: oldLines[i - 1] });
    i--;
  }
  while (j > 0) {
    result.unshift({ type: "add", text: newLines[j - 1] });
    j--;
  }

  return result;
}

function diffStats(content: ToolContent): { added: number; removed: number } {
  if (!content.newText && !content.oldText) return { added: 0, removed: 0 };
  if (!content.oldText) {
    return { added: content.newText!.split("\n").length, removed: 0 };
  }
  if (!content.newText) {
    return { added: 0, removed: content.oldText.split("\n").length };
  }
  const lines = computeDiff(content.oldText, content.newText);
  return {
    added: lines.filter((l) => l.type === "add").length,
    removed: lines.filter((l) => l.type === "del").length,
  };
}

// ============================================================================
// DiffView
// ============================================================================

function buildDiffString(oldText: string, newText: string): string {
  const lines = computeDiff(oldText, newText);

  const CONTEXT = 3;
  const changeIndices = lines
    .map((l, i) => (l.type !== "ctx" ? i : -1))
    .filter((i) => i >= 0);

  if (changeIndices.length === 0) return "";

  const shown = new Set<number>();
  for (const ci of changeIndices) {
    for (let k = Math.max(0, ci - CONTEXT); k <= Math.min(lines.length - 1, ci + CONTEXT); k++) {
      shown.add(k);
    }
  }

  const result: string[] = [];
  let prevShown = -1;
  for (let i = 0; i < lines.length; i++) {
    if (!shown.has(i)) continue;
    if (prevShown >= 0 && i - prevShown > 1) {
      result.push("...");
    }
    const l = lines[i];
    result.push(
      l.type === "add" ? `+ ${l.text}` : l.type === "del" ? `- ${l.text}` : `  ${l.text}`
    );
    prevShown = i;
  }

  return result.join("\n");
}

function DiffView({
  path: _path,
  oldText,
  newText,
}: {
  path: string;
  oldText?: string | null;
  newText?: string;
}) {
  const isNewFile = !oldText && !!newText;

  let diffCode: string;
  if (isNewFile) {
    diffCode = newText!.split("\n").map((l) => `+ ${l}`).join("\n");
  } else if (oldText && newText) {
    diffCode = buildDiffString(oldText, newText);
  } else if (oldText) {
    diffCode = oldText.split("\n").map((l) => `- ${l}`).join("\n");
  } else {
    return null;
  }

  if (!diffCode) return null;

  return (
    <div className="my-1">
      <CodeBlock code={diffCode} language="diff" noBorder noCopy minHeight={0} />
    </div>
  );
}

// ============================================================================
// Content renderers
// ============================================================================

function TerminalOutput({ text }: { terminalId?: string; text?: string }) {
  if (!text) return null;
  return (
    <div className="my-1">
      <CodeBlock code={text} language="bash" noBorder noCopy minHeight={0} />
    </div>
  );
}

function ContentText({ text }: { text: string }) {
  return (
    <div className="my-1 max-h-[300px] overflow-auto rounded border border-ak-border bg-ak-surface-hover px-4 py-3 opacity-50">
      <Markdown
        content={text}
        className="text-sm text-ak-content"
      />
    </div>
  );
}

// ============================================================================
// Component
// ============================================================================

export function ToolCall({
  toolCallId,
  toolTitle,
  toolKind,
  toolStatus = "",
  toolContent = [],
  defaultExpanded,
  className,
}: ToolCallProps) {
  const kind: ToolKind = toolKind ?? resolveToolKind(toolTitle ?? "", toolContent);
  const hasDiff = toolContent.some((c) => c.type === "diff");
  const hasTerminal = toolContent.some((c) => c.type === "terminal" && c.text);
  const hasContent = toolContent.length > 0;

  const [expanded, setExpanded] = React.useState(
    defaultExpanded ?? (!!hasDiff || !!hasTerminal)
  );

  const diffContent = toolContent.find((c) => c.type === "diff");
  const titleText = diffContent?.path
    ? diffContent.path.split("/").pop() || diffContent.path
    : toolTitle || getToolKindLabel(kind);

  const stats = React.useMemo(
    () => (diffContent ? diffStats(diffContent) : null),
    [diffContent]
  );

  const isInProgress = toolStatus === "in_progress";
  const isError = toolStatus === "error";
  const KindIcon = KIND_ICON[kind];

  return (
    <div
      className={cn("shrink-0", className)}
      data-tool-call-id={toolCallId || ""}
    >
      {/* Header */}
      <div
        className={cn(
          "flex select-none items-center gap-2 py-0.5 text-xs transition-opacity",
          "opacity-85 hover:opacity-100",
          hasContent ? "cursor-pointer" : "cursor-default"
        )}
        onClick={hasContent ? () => setExpanded((e) => !e) : undefined}
      >
        <KindIcon size={16} className="text-ak-content-secondary" />

        <span
          className={cn(
            "truncate text-ak-content",
            isInProgress && "animate-pulse"
          )}
          title={diffContent?.path || ""}
        >
          {titleText}
        </span>

        {/* Collapse chevron */}
        {hasContent && (
          <span
            className={cn(
              "inline-flex shrink-0 text-ak-content-tertiary transition-transform duration-150",
              expanded ? "rotate-90" : ""
            )}
          >
            <ChevronRight size={14} />
          </span>
        )}

        {/* Diff stats */}
        {stats && (stats.added > 0 || stats.removed > 0) && (
          <span className="flex shrink-0 items-center gap-1 font-mono text-xs">
            {stats.added > 0 && (
              <span className="text-green-600">+{stats.added}</span>
            )}
            {stats.removed > 0 && (
              <span className="text-red-600">-{stats.removed}</span>
            )}
          </span>
        )}

        <div className="flex-1" />

        {/* Error icon */}
        {isError && <CircleAlert size={14} className="text-ak-content-tertiary" />}
      </div>

      {/* Body */}
      {expanded && hasContent && (
        <div className="mt-0.5 flex flex-col gap-2 pl-5">
          {toolContent.map((c, i) => {
            if (c.type === "content" && c.text) {
              return <ContentText key={i} text={c.text} />;
            }
            if (c.type === "diff" && c.path) {
              return (
                <DiffView
                  key={i}
                  path={c.path}
                  oldText={c.oldText}
                  newText={c.newText}
                />
              );
            }
            if (c.type === "terminal" && c.terminalId) {
              return (
                <TerminalOutput
                  key={i}
                  terminalId={c.terminalId}
                  text={c.text}
                />
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
}
