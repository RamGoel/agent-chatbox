import * as React from "react";
import { cn } from "../../lib/cn";
import { Markdown } from "../../primitives/Markdown";
import {
  MessageActions,
  type MessageAction,
} from "../../primitives/MessageActions";
import { Attachments, type Attachment } from "../Attachments";

// ============================================================================
// Types
// ============================================================================

export interface UserMessageProps {
  content?: string;
  attachments?: Attachment[];
  children?: React.ReactNode;
  actions?: MessageAction[];
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

export function UserMessage({
  content,
  attachments,
  children,
  actions,
  className,
}: UserMessageProps) {
  if (!content && !children && !attachments?.length) return null;

  return (
    <div
      className={cn(
        "ak group flex w-full shrink-0 flex-col items-end gap-2",
        className
      )}
    >
      {attachments && attachments.length > 0 && (
        <Attachments attachments={attachments} className="justify-end" />
      )}

      {(content || children) && (
        <div
          className="flex flex-col justify-center rounded-lg border border-ak-border bg-ak-surface-hover px-3 py-2"
          style={{ maxWidth: "85%" }}
        >
          {content && <Markdown content={content} />}
          {children && (
            <div className={cn("flex flex-col gap-2", content && "mt-2")}>
              {children}
            </div>
          )}
        </div>
      )}

      {actions && actions.length > 0 && (
        <MessageActions actions={actions} className="justify-end" />
      )}
    </div>
  );
}
