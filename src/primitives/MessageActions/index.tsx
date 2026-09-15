import * as React from "react";
import { cn } from "../../lib/cn";
import { Icon, type IconName } from "../../components/Icon";

export interface MessageAction {
  key: string;
  icon: IconName;
  label: string;
  onClick?: () => void;
  active?: boolean;
}

export interface MessageActionsProps {
  actions: MessageAction[];
  className?: string;
}

export function MessageActions({ actions, className }: MessageActionsProps) {
  if (!actions.length) return null;

  return (
    <div className={cn("flex items-center gap-1 transition-opacity duration-150", className)}>
      {actions.map((action) => (
        <button
          key={action.key}
          onClick={action.onClick}
          aria-label={action.label}
          title={action.label}
          className={cn(
            "inline-flex size-8 items-center justify-center rounded transition-colors",
            "hover:bg-ak-surface-hover",
            action.active ? "bg-ak-surface-hover" : undefined
          )}
        >
          <Icon
            name={action.icon}
            size="xs"
            tone={action.active ? "primary" : "tertiary"}
          />
        </button>
      ))}
    </div>
  );
}
