import * as React from "react";
import { cn } from "../../lib/cn";
import { Icon } from "../Icon";
import { X, File as FileIcon } from "lucide-react";

// ============================================================================
// Types
// ============================================================================

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size?: number;
  url?: string;
}

export interface AttachmentsProps {
  attachments: Attachment[];
  onRemove?: (id: string) => void;
  className?: string;
}

// ============================================================================
// Helpers
// ============================================================================

function isImage(type: string): boolean {
  return type.startsWith("image/");
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileExtension(name: string): string {
  const dot = name.lastIndexOf(".");
  if (dot === -1) return "";
  return name.slice(dot + 1).toUpperCase();
}

// ============================================================================
// Shared remove button
// ============================================================================

function RemoveButton({
  name,
  onClick,
}: {
  name: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full",
        "border border-ak-border bg-ak-surface text-ak-content-secondary",
        "opacity-0 transition-opacity group-hover/attachment:opacity-100",
        "hover:bg-ak-surface-hover hover:text-ak-content"
      )}
      aria-label={`Remove ${name}`}
    >
      <X size={12} strokeWidth={2.5} />
    </button>
  );
}

// ============================================================================
// Component
// ============================================================================

export function Attachments({
  attachments,
  onRemove,
  className,
}: AttachmentsProps) {
  if (!attachments || attachments.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {attachments.map((att) => {
        const image = isImage(att.type) && att.url;

        if (image) {
          return (
            <div
              key={att.id}
              title={att.name}
              className="group/attachment relative size-16 shrink-0 rounded-lg border border-ak-border"
            >
              <img
                src={att.url}
                alt={att.name}
                className="size-full rounded-lg object-cover"
              />
              {onRemove && (
                <RemoveButton
                  name={att.name}
                  onClick={() => onRemove(att.id)}
                />
              )}
            </div>
          );
        }

        return (
          <div
            key={att.id}
            className="group/attachment relative flex items-center gap-3 rounded-lg border border-ak-border bg-ak-surface-hover py-1.5 pl-1.5 pr-3"
          >
            <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-ak-surface">
              <FileIcon size={20} strokeWidth={1.2} className="text-ak-content-tertiary" />
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm text-ak-content">
                {att.name}
              </span>
              <span className="text-xs text-ak-content-tertiary">
                {att.size ? formatSize(att.size) : fileExtension(att.name)}
              </span>
            </div>
            {onRemove && (
              <RemoveButton name={att.name} onClick={() => onRemove(att.id)} />
            )}
          </div>
        );
      })}
    </div>
  );
}
