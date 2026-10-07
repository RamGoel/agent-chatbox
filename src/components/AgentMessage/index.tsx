import * as React from "react";
import { cn } from "../../lib/cn";
import { Markdown } from "../../primitives/Markdown";
import {
  MessageActions,
  type MessageAction,
} from "../../primitives/MessageActions";
import type { IconName } from "../../components/Icon";

// ============================================================================
// Types
// ============================================================================

export interface AgentMessageAction {
  icon: IconName;
  label: string;
  onClick?: () => void;
  active?: boolean;
}

export interface AgentMessageProps {
  content?: string;
  streaming?: boolean;
  actions?: AgentMessageAction[];
  children?: React.ReactNode;
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

export function AgentMessage({
  content,
  streaming = false,
  actions = [],
  children,
  className,
}: AgentMessageProps) {
  const allActions: MessageAction[] = actions.map((a) => ({
    key: a.label,
    icon: a.icon,
    label: a.label,
    onClick: a.onClick,
    active: a.active,
  }));

  return (
    <div
      className={cn(
        "ak group flex w-full shrink-0 flex-col gap-1",
        className
      )}
    >
      {content && <Markdown content={content} />}
      {children}

      {!streaming && allActions.length > 0 && (
        <MessageActions actions={allActions} />
      )}
    </div>
  );
}
