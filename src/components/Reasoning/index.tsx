import * as React from "react";
import { cn } from "../../lib/cn";
import { Brain, ChevronRight } from "lucide-react";
import { Markdown } from "../../primitives/Markdown";

// ============================================================================
// Types
// ============================================================================

export interface ReasoningProps {
  content: string;
  streaming?: boolean;
  startTime?: number;
  duration?: number;
  defaultCollapsed?: boolean;
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

export function Reasoning({
  content,
  streaming = false,
  startTime,
  duration,
  defaultCollapsed = true,
  className,
}: ReasoningProps) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);
  const [elapsed, setElapsed] = React.useState(0);

  // Live elapsed timer while streaming
  React.useEffect(() => {
    if (!streaming || !startTime) return;
    setElapsed(Math.round((Date.now() - startTime) / 1000));
    const interval = setInterval(() => {
      setElapsed(Math.round((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [streaming, startTime]);

  // Auto-expand when streaming starts
  React.useEffect(() => {
    if (streaming) setCollapsed(false);
  }, [streaming]);

  if (!content.trim()) return null;

  let label: string;
  if (streaming) {
    label = elapsed > 0 ? `Thinking (${elapsed}s)` : "Thinking";
  } else if (duration != null && duration > 0) {
    label = `Thought for ${duration}s`;
  } else {
    label = "Thought";
  }

  return (
    <div
      className={cn(
        "overflow-hidden transition-opacity duration-200",
        collapsed ? "opacity-50 hover:opacity-80" : "opacity-80",
        className
      )}
    >
      {/* Header — click to toggle */}
      <div
        className="flex cursor-pointer select-none items-center gap-2 py-0.5"
        onClick={() => setCollapsed((c) => !c)}
      >
        <Brain size={14} className="text-ak-content-secondary" />
        <span className="text-xs font-medium text-ak-content-secondary">
          {label}
        </span>
        <span
          className={cn(
            "inline-flex transition-transform duration-150",
            collapsed ? "" : "rotate-90"
          )}
        >
          <ChevronRight size={14} className="text-ak-content-tertiary" />
        </span>
      </div>

      {/* Body — reasoning content */}
      {!collapsed && (
        <div
          className="overflow-y-auto pb-2 pl-5 opacity-50"
          style={{ maxHeight: "300px" }}
        >
          <Markdown
            content={content}
            className="text-sm italic text-ak-content-secondary"
          />
        </div>
      )}
    </div>
  );
}
