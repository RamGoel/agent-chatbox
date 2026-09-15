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
          "w-full shrink-0 rounded-md border border-ak-border bg-ak-surface-hover px-3 py-2.5",
          className
        )}
      >
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-medium text-ak-content-secondary">
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
      <div className="overflow-hidden rounded-md border border-ak-border bg-ak-surface-hover shadow-sm">
        <div className="flex flex-col p-5">
          <div className="flex flex-col gap-4">
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
                className="w-full rounded-md border border-ak-border bg-ak-surface px-3 py-2 text-sm text-ak-content outline-none transition-colors placeholder:text-ak-content-tertiary focus:border-ak-border-hover"
              />
            )}

            {(type === "single-select" || type === "multi-select") && (
              <div className="mt-0.5 flex flex-col gap-2">
                {options.map((opt) => {
                  const isSelected =
                    type === "single-select"
                      ? selected === opt.value
                      : multiSelected.has(opt.value);
                  return (
                    <button
                      key={opt.value}
                      onClick={() => selectOption(opt.value)}
                      className={cn(
                        "flex items-center justify-between rounded-md border px-4 py-3 text-left text-sm transition-colors",
                        isSelected
                          ? "border-ak-primary bg-ak-primary/10 text-ak-content"
                          : "border-ak-border bg-ak-surface text-ak-content hover:bg-ak-surface-hover"
                      )}
                    >
                      {opt.label}
                      {isSelected && (
                        <span className="size-4 rounded-full bg-ak-primary" />
                      )}
                    </button>
                  );
                })}

                {allowOther && (
                  <>
                    <button
                      onClick={() => selectOption("__other__")}
                      className={cn(
                        "flex items-center justify-between rounded-md border px-4 py-2 text-left text-sm transition-colors",
                        otherSelected
                          ? "border-ak-primary bg-ak-primary/10 text-ak-content"
                          : "border-ak-border bg-ak-surface text-ak-content hover:bg-ak-surface-hover"
                      )}
                    >
                      Other
                      {otherSelected && (
                        <span className="size-4 rounded-full bg-ak-primary" />
                      )}
                    </button>
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
                        className="w-full rounded-md border border-ak-border bg-ak-surface px-3 py-2 text-sm text-ak-content outline-none transition-colors placeholder:text-ak-content-tertiary focus:border-ak-border-hover"
                      />
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {showFooter && (
          <div
            className="flex items-center justify-between gap-2 border-t border-ak-border px-3 py-3"
            style={{
              backgroundColor: "color-mix(in srgb, var(--ak-surface) 40%, transparent)",
            }}
          >
            {skipLabel !== undefined ? (
              <button
                onClick={handleSkip}
                className="rounded-md border border-ak-border bg-ak-surface px-4 py-2 text-sm text-ak-content transition-colors hover:bg-ak-surface-hover"
              >
                {skipLabel}
              </button>
            ) : (
              <span />
            )}
            {showSubmit && (
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="rounded-md bg-ak-primary px-4 py-2 text-sm text-ak-primary-content transition-colors hover:bg-ak-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
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
