import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/cn";

// ============================================================================
// Types
// ============================================================================

export interface ScrollToBottomProps {
  /** Whether the user has scrolled away from the bottom. */
  visible: boolean;
  /** Click handler — typically scrolls the container to the bottom. */
  onClick: () => void;
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

export function ScrollToBottom({
  visible,
  onClick,
  className,
}: ScrollToBottomProps) {
  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Scroll to bottom"
      className={cn(
        "flex size-9 items-center justify-center rounded-full",
        "border border-ak-border bg-ak-surface text-ak-content-secondary",
        "shadow-md transition-all",
        "hover:bg-ak-surface-hover hover:text-ak-content",
        "active:scale-95",
        className
      )}
    >
      <ChevronDown size={18} />
    </button>
  );
}
