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
  /** Optional unread message count badge. */
  unreadCount?: number;
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

export function ScrollToBottom({
  visible,
  onClick,
  unreadCount,
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
      {unreadCount != null && unreadCount > 0 && (
        <span
          className={cn(
            "absolute -right-1 -top-1 flex min-w-4 items-center justify-center",
            "rounded-full bg-ak-primary px-1 text-[10px] font-semibold text-ak-primary-content"
          )}
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
}
