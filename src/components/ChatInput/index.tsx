import * as React from "react";
import { cn } from "../../lib/cn";
import { Attachments, type Attachment } from "../Attachments";
import { Paperclip, ArrowUp, Square } from "lucide-react";

// ============================================================================
// Types
// ============================================================================

export interface ChatInputProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  onStop?: () => void;
  onAttach?: () => void;
  attachments?: Attachment[];
  onRemoveAttachment?: (id: string) => void;
  isGenerating?: boolean;
  placeholder?: string;
  maxHeight?: number;
  disabled?: boolean;
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

export function ChatInput({
  value: controlledValue,
  defaultValue = "",
  onValueChange,
  onSubmit,
  onStop,
  onAttach,
  attachments,
  onRemoveAttachment,
  isGenerating = false,
  placeholder = "Type a message…",
  maxHeight = 200,
  disabled = false,
  className,
}: ChatInputProps) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const value = isControlled ? controlledValue! : internalValue;

  React.useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
  }, [value, maxHeight]);

  const setValue = React.useCallback(
    (next: string) => {
      if (!isControlled) setInternalValue(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange]
  );

  const handleSubmit = React.useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || isGenerating || disabled) return;
    onSubmit?.(trimmed);
    if (!isControlled) setInternalValue("");
  }, [value, isGenerating, disabled, onSubmit, isControlled]);

  const handleStop = React.useCallback(() => {
    onStop?.();
  }, [onStop]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isGenerating) return;
      handleSubmit();
    }
    if (e.key === "Escape" && isGenerating) {
      e.preventDefault();
      handleStop();
    }
  };

  const canSend = value.trim().length > 0 && !isGenerating && !disabled;
  const inputDisabled = disabled || (isGenerating && value.trim().length === 0);

  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-xl border border-ak-border bg-ak-surface p-1.5",
        "transition-colors focus-within:border-ak-border-hover",
        className
      )}
    >
      {attachments && attachments.length > 0 && (
        <Attachments
          attachments={attachments}
          onRemove={onRemoveAttachment}
          className="px-1 pt-1"
        />
      )}

      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={inputDisabled}
        rows={1}
        className={cn(
          "w-full min-w-0 resize-none border-none bg-transparent py-1 pl-2.5 pr-1",
          "font-sans text-base leading-relaxed text-ak-content",
          "placeholder:text-ak-content-tertiary",
          "outline-none focus:ring-0",
          "overflow-y-auto whitespace-pre-wrap break-words",
          "disabled:cursor-not-allowed disabled:opacity-50"
        )}
        style={{ maxHeight }}
      />

      <div className="flex h-8 items-center justify-between gap-2">
        <button
          type="button"
          onClick={onAttach}
          disabled={inputDisabled}
          title="Attach file"
          className={cn(
            "flex size-8 items-center justify-center rounded-lg text-ak-content-tertiary",
            "transition-colors hover:bg-ak-surface-hover hover:text-ak-content",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
          aria-label="Attach file"
        >
          <Paperclip size={18} />
        </button>

        <button
          type="button"
          onClick={isGenerating ? handleStop : handleSubmit}
          disabled={!isGenerating && !canSend}
          title={isGenerating ? "Stop" : "Send"}
          aria-label={isGenerating ? "Stop" : "Send"}
          className={cn(
            "flex size-8 items-center justify-center rounded-lg transition-colors",
            isGenerating
              ? "bg-ak-danger text-white hover:bg-ak-danger-hover"
              : "bg-ak-primary text-ak-primary-content hover:bg-ak-primary-hover",
            "disabled:cursor-not-allowed disabled:opacity-40"
          )}
        >
          {isGenerating ? <Square size={14} fill="currentColor" /> : <ArrowUp size={18} />}
        </button>
      </div>
    </div>
  );
}
