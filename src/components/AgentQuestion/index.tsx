import * as React from "react";
import { cn } from "../../lib/cn";
import { Markdown } from "../../primitives/Markdown";

// ============================================================================
// Types
// ============================================================================

export type AgentQuestionType = "text" | "single-select" | "multi-select";

export interface AgentQuestionOption {
  label: string;
  value: string;
}

export interface AgentQuestionProps {
  question: string;
  type?: AgentQuestionType;
  options?: AgentQuestionOption[];
  allowOther?: boolean;
  placeholder?: string;
  secret?: boolean;
  submitLabel?: string;
  skipLabel?: string;
  onSubmit?: (answer: string) => void;
  onSkip?: () => void;
  answer?: string;
  className?: string;
}

// ============================================================================
// Option row — matches Sarvam extension pattern
// ============================================================================

function OptionRow({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "group w-full rounded-lg border px-3 py-2 text-left transition-colors",
        "active:scale-[0.98]",
        selected
          ? "border-ak-primary bg-ak-surface-active"
          : "border-ak-border bg-ak-surface hover:border-ak-border-hover hover:bg-ak-surface-hover"
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <span className="min-w-0 flex-1 truncate text-sm text-ak-content">
          {label}
        </span>
        <span
          className={cn(
            "shrink-0 text-xs transition-opacity",
            selected
              ? "text-ak-primary opacity-100"
              : "text-ak-content-tertiary opacity-0 group-hover:opacity-60"
          )}
          aria-hidden="true"
        >
          {selected ? "\u2713" : "\u2192"}
        </span>
      </div>
    </button>
  );
}

// ============================================================================
// Component
// ============================================================================

export function AgentQuestion({
  question,
  type = "text",
  options = [],
  allowOther = false,
  placeholder = "Your answer…",
  secret = false,
  submitLabel = "Continue",
  skipLabel,
  onSubmit,
  onSkip,
  answer,
  className,
}: AgentQuestionProps) {
  const [textValue, setTextValue] = React.useState("");
  const [selected, setSelected] = React.useState<string | null>(null);
  const [multiSelected, setMultiSelected] = React.useState<Set<string>>(new Set());
  const [otherSelected, setOtherSelected] = React.useState(false);
  const [otherText, setOtherText] = React.useState("");
  const [resolved, setResolved] = React.useState<string | null>(answer ?? null);

  React.useEffect(() => {
    if (answer !== undefined) setResolved(answer);
  }, [answer]);

  if (resolved) {
    return (
      <div
        className={cn(
          "w-full shrink-0 rounded-lg border border-ak-border bg-ak-surface-hover px-3 py-2.5",
          className
        )}
      >
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-ak-content-secondary">
            {question}
          </span>
          <span className="text-sm text-ak-content">
            {resolved}
          </span>
        </div>
      </div>
    );
  }

  const handleSubmit = () => {
    let result: string;
    if (type === "text") {
      result = textValue.trim();
      if (!result) return;
    } else if (type === "single-select") {
      if (otherSelected && otherText.trim()) {
        result = otherText.trim();
      } else if (selected) {
        result = selected;
      } else {
        return;
      }
    } else {
      const parts = Array.from(multiSelected);
      if (otherSelected && otherText.trim()) {
        parts.push(otherText.trim());
      }
      if (parts.length === 0) return;
      result = parts.join(", ");
    }
    setResolved(result);
    onSubmit?.(result);
  };

  const handleSkip = () => {
    setResolved("Skipped");
    onSkip?.();
  };

  const toggleMulti = (value: string) => {
    setMultiSelected((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  };

  const selectOption = (value: string) => {
    if (type === "single-select") {
      if (value === "__other__") {
        setOtherSelected(true);
        setSelected(null);
      } else {
        setResolved(value);
        onSubmit?.(value);
      }
    } else {
      if (value === "__other__") {
        setOtherSelected((v) => !v);
      } else {
        toggleMulti(value);
      }
    }
  };

  const canSubmit =
    type === "text"
      ? textValue.trim().length > 0
      : type === "single-select"
        ? otherSelected
          ? otherText.trim().length > 0
          : selected !== null
        : multiSelected.size > 0 || (otherSelected && otherText.trim().length > 0);

  const showSubmit =
    type === "text" ||
    type === "multi-select" ||
    (type === "single-select" && allowOther && otherSelected);

  const showFooter = showSubmit || skipLabel !== undefined;

  return (
    <div className={cn("w-full shrink-0", className)}>
      <div className="overflow-hidden rounded-lg border border-ak-border bg-ak-surface shadow-sm">
        {/* Content */}
        <div className="flex flex-col gap-1.5 px-3 py-2.5">
          <div className="text-sm text-ak-content">
            <Markdown content={question} />
          </div>

          {type === "text" && (
            <input
              type={secret ? "password" : "text"}
              placeholder={placeholder}
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              className="w-full rounded-lg border border-ak-border bg-ak-surface px-2.5 py-1.5 text-sm text-ak-content outline-none transition-colors placeholder:text-ak-content-tertiary focus:border-ak-border-hover"
            />
          )}

          {(type === "single-select" || type === "multi-select") && (
            <div className="mt-0.5 flex flex-col gap-1">
              {options.map((opt) => {
                const isSelected =
                  type === "single-select"
                    ? selected === opt.value
                    : multiSelected.has(opt.value);
                return (
                  <OptionRow
                    key={opt.value}
                    label={opt.label}
                    selected={isSelected}
                    onClick={() => selectOption(opt.value)}
                  />
                );
              })}

              {allowOther && (
                <>
                  <OptionRow
                    label="Other"
                    selected={otherSelected}
                    onClick={() => selectOption("__other__")}
                  />
                  {otherSelected && (
                    <input
                      type={secret ? "password" : "text"}
                      placeholder="Type your answer…"
                      value={otherText}
                      onChange={(e) => setOtherText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleSubmit();
                        }
                      }}
                      className="w-full rounded-lg border border-ak-border bg-ak-surface px-2.5 py-1.5 text-sm text-ak-content outline-none transition-colors placeholder:text-ak-content-tertiary focus:border-ak-border-hover"
                    />
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {showFooter && (
          <div className="flex items-center justify-between gap-2 border-t border-ak-border px-3 py-2">
            {skipLabel !== undefined ? (
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSkip();
                }}
                className="rounded-lg border border-ak-border bg-ak-surface px-3 py-1.5 text-xs font-medium text-ak-content transition-colors hover:bg-ak-surface-hover"
              >
                {skipLabel}
              </button>
            ) : (
              <span />
            )}
            {showSubmit && (
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSubmit();
                }}
                disabled={!canSubmit}
                className="rounded-lg bg-ak-primary px-3 py-1.5 text-xs font-medium text-ak-primary-content transition-colors hover:bg-ak-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
              >
                {submitLabel}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
