import * as React from "react";
import { Check, Loader2, X, Circle, ChevronDown, ListTodo } from "lucide-react";
import { cn } from "../../lib/cn";

// ============================================================================
// Types
// ============================================================================

export type PlanEntryStatus = "pending" | "in_progress" | "completed" | "failed" | "cancelled";

export interface PlanEntry {
  content: string;
  priority?: string;
  status?: PlanEntryStatus;
}

export interface PlanProps {
  entries: PlanEntry[];
  /** When true, renders as a compact floating status bar (above input). */
  floating?: boolean;
  className?: string;
}

// ============================================================================
// Status icon
// ============================================================================

function StatusIcon({ status }: { status?: PlanEntryStatus }) {
  if (status === "completed") {
    return <Check size={12} className="text-ak-content-secondary" />;
  }
  if (status === "in_progress") {
    return <Loader2 size={12} className="animate-spin text-ak-content-tertiary" />;
  }
  if (status === "failed" || status === "cancelled") {
    return <X size={12} className="text-ak-danger" />;
  }
  return <Circle size={12} className="text-ak-content-tertiary" />;
}

// ============================================================================
// Inline Plan panel — always expanded, shown in the message flow
// ============================================================================

function PlanPanel({ entries, className }: { entries: PlanEntry[]; className?: string }) {
  if (entries.length === 0) return null;

  const allDone = entries.every((e) => e.status === "completed");
  const completed = entries.filter((e) => e.status === "completed").length;

  return (
    <div
      className={cn(
        "ak w-full shrink-0 rounded-lg border border-ak-border bg-ak-surface shadow-sm",
        className
      )}
    >
      {/* Header */}
      <div className="flex select-none items-center gap-1.5 px-2.5 py-1.5">
        <ListTodo size={14} className="text-ak-content-secondary" />
        <span className="flex-1 text-xs font-medium text-ak-content">
          {allDone ? "Plan completed" : "Plan"}
        </span>
        <span className="shrink-0 font-mono text-xs text-ak-content-tertiary">
          {completed}/{entries.length}
        </span>
      </div>

      {/* Entries */}
      <div className="flex max-h-[300px] flex-col gap-0.5 overflow-y-auto px-2.5 pb-1.5">
        {entries.map((entry, i) => (
          <div key={i} className="flex items-start gap-1.5 text-xs">
            <span className="mt-0.5 shrink-0">
              <StatusIcon status={entry.status} />
            </span>
            <span
              className={cn(
                "text-ak-content",
                entry.status === "completed" && "line-through opacity-60"
              )}
            >
              {entry.content}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Floating Plan status bar — compact, expandable, shown above input
// ============================================================================

function PlanStatusBar({ entries, className }: { entries: PlanEntry[]; className?: string }) {
  const [expanded, setExpanded] = React.useState(false);

  if (entries.length === 0) return null;

  const allDone = entries.every((e) => e.status === "completed");
  if (allDone) return null;

  const completed = entries.filter((e) => e.status === "completed").length;
  const current = entries.find((e) => e.status === "in_progress");
  const currentStep = current?.content ?? "Working…";

  return (
    <div className={cn("ak shrink-0", className)}>
      <div className="overflow-hidden rounded-lg border border-ak-border bg-ak-surface shadow-sm">
        {/* Header */}
        <button
          type="button"
          className="group flex w-full items-center gap-1.5 px-2.5 py-1.5 text-left transition-colors hover:bg-ak-surface-hover"
          onClick={() => setExpanded((e) => !e)}
          title={expanded ? "Collapse plan" : "Expand plan"}
          aria-expanded={expanded}
        >
          {expanded ? (
            <ListTodo size={14} className="shrink-0 text-ak-content-secondary" />
          ) : current ? (
            <Loader2 size={12} className="shrink-0 animate-spin text-ak-content-tertiary" />
          ) : (
            <Check size={12} className="shrink-0 text-ak-content-secondary" />
          )}
          <span className="min-w-0 flex-1 truncate text-xs text-ak-content">
            {expanded ? "Plan" : currentStep}
          </span>
          <span className="shrink-0 font-mono text-xs text-ak-content-tertiary">
            {completed}/{entries.length}
          </span>
          <ChevronDown
            size={14}
            className={cn(
              "shrink-0 text-ak-content-tertiary transition-transform duration-150",
              expanded && "rotate-180"
            )}
          />
        </button>

        {/* Expanded entries */}
        {expanded && (
          <div className="flex max-h-[300px] flex-col gap-0.5 overflow-y-auto border-t border-ak-border px-2.5 pb-2 pt-1.5">
            {entries.map((entry, i) => (
              <div key={i} className="flex items-start gap-1.5 text-xs">
                <span className="mt-0.5 shrink-0">
                  <StatusIcon status={entry.status} />
                </span>
                <span
                  className={cn(
                    "text-ak-content",
                    entry.status === "completed" && "line-through opacity-60"
                  )}
                >
                  {entry.content}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Export
// ============================================================================

export function Plan({ entries, floating = false, className }: PlanProps) {
  if (floating) {
    return <PlanStatusBar entries={entries} className={className} />;
  }
  return <PlanPanel entries={entries} className={className} />;
}
