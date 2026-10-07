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

export interface AgentQuestionItem {
  /** Question text (markdown supported). */
  question: string;
  /** Optional short header label shown above the question. */
  header?: string;
  type?: AgentQuestionType;
  options?: AgentQuestionOption[];
  allowOther?: boolean;
  placeholder?: string;
  secret?: boolean;
}

export interface AgentQuestionProps {
  /** Single question (simple mode). */
  question?: string;
  /** Multiple questions (multi mode). When provided, overrides `question`. */
  questions?: AgentQuestionItem[];
  /** Default type for single-question mode. */
  type?: AgentQuestionType;
  options?: AgentQuestionOption[];
  allowOther?: boolean;
  placeholder?: string;
  secret?: boolean;
  submitLabel?: string;
  skipLabel?: string | null;
  /** Single-question mode: called with one answer string. */
  onSubmit?: (answer: string) => void;
  /** Multi-question mode: called with a record of { header/question: answer }. */
  onSubmitMultiple?: (answers: Record<string, string>) => void;
  onSkip?: () => void;
  /** Single-question mode: pre-filled answer. */
  answer?: string;
  /** Multi-question mode: pre-filled answers. */
  answers?: Record<string, string>;
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
      aria-pressed={!!selected}
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
// Shared input
// ============================================================================

function TextInput({
  value,
  onChange,
  onSubmit,
  placeholder,
  secret,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  secret?: boolean;
}) {
  return (
    <input
      type={secret ? "password" : "text"}
      placeholder={placeholder}
      aria-label={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && onSubmit) {
          e.preventDefault();
          onSubmit();
        }
      }}
      className="w-full rounded-lg border border-ak-border bg-ak-surface px-2.5 py-1.5 text-sm text-ak-content outline-none transition-colors placeholder:text-ak-content-tertiary focus:border-ak-border-hover"
    />
  );
}

// ============================================================================
// Single question field (used inside multi-question mode)
// ============================================================================

interface FieldState {
  textValue: string;
  selected: string | null;
  multiSelected: Set<string>;
  otherSelected: boolean;
  otherText: string;
}

function emptyField(): FieldState {
  return {
    textValue: "",
    selected: null,
    multiSelected: new Set(),
    otherSelected: false,
    otherText: "",
  };
}

function isFieldComplete(field: FieldState, item: AgentQuestionItem): boolean {
  if (item.type === "text" || !item.type) {
    return field.textValue.trim().length > 0;
  }
  if (item.type === "single-select") {
    return field.otherSelected
      ? field.otherText.trim().length > 0
      : field.selected !== null;
  }
  return field.multiSelected.size > 0 || (field.otherSelected && field.otherText.trim().length > 0);
}

function getFieldAnswer(field: FieldState, item: AgentQuestionItem): string | null {
  if (item.type === "text" || !item.type) {
    const v = field.textValue.trim();
    return v || null;
  }
  if (item.type === "single-select") {
    if (field.otherSelected && field.otherText.trim()) return field.otherText.trim();
    if (field.selected) return field.selected;
    return null;
  }
  const parts = Array.from(field.multiSelected);
  if (field.otherSelected && field.otherText.trim()) parts.push(field.otherText.trim());
  return parts.length > 0 ? parts.join(", ") : null;
}

function QuestionField({
  item,
  field,
  onChange,
  multi,
}: {
  item: AgentQuestionItem;
  field: FieldState;
  onChange: (next: FieldState) => void;
  multi: boolean;
}) {
  const type = item.type ?? "text";

  const selectOption = (value: string) => {
    if (type === "single-select") {
      if (value === "__other__") {
        onChange({ ...field, otherSelected: true, selected: null });
      } else {
        onChange({ ...field, selected: value, otherSelected: false, otherText: "" });
      }
    } else {
      if (value === "__other__") {
        onChange({ ...field, otherSelected: !field.otherSelected });
      } else {
        const next = new Set(field.multiSelected);
        if (next.has(value)) next.delete(value);
        else next.add(value);
        onChange({ ...field, multiSelected: next });
      }
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      {/* Header (numbered for multi mode) */}
      {item.header && (
        <span className="text-xs font-medium text-ak-content-secondary">
          {item.header}
        </span>
      )}

      {/* Question text */}
      <div className="text-sm text-ak-content">
        <Markdown content={item.question} />
      </div>

      {/* Text input */}
      {type === "text" && (
        <TextInput
          value={field.textValue}
          onChange={(v) => onChange({ ...field, textValue: v })}
          placeholder={item.placeholder ?? "Your answer…"}
          secret={item.secret}
        />
      )}

      {/* Select options */}
      {(type === "single-select" || type === "multi-select") && (
        <div className="mt-0.5 flex flex-col gap-1">
          {(item.options ?? []).map((opt) => {
            const isSelected =
              type === "single-select"
                ? field.selected === opt.value
                : field.multiSelected.has(opt.value);
            return (
              <OptionRow
                key={opt.value}
                label={opt.label}
                selected={isSelected}
                onClick={() => selectOption(opt.value)}
              />
            );
          })}

          {item.allowOther && (
            <>
              <OptionRow
                label="Other"
                selected={field.otherSelected}
                onClick={() => selectOption("__other__")}
              />
              {field.otherSelected && (
                <TextInput
                  value={field.otherText}
                  onChange={(v) => onChange({ ...field, otherText: v })}
                  placeholder="Type your answer…"
                  secret={item.secret}
                />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Resolved (answered) view
// ============================================================================

function ResolvedView({
  items,
  answers,
  className,
}: {
  items: AgentQuestionItem[];
  answers: Record<string, string>;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "ak w-full shrink-0 rounded-lg border border-ak-border bg-ak-surface-hover px-3 py-2.5",
        className
      )}
    >
      <div className="flex flex-col gap-1">
        {items.map((item, i) => {
          const key = item.header || item.question;
          const answer = answers[key];
          if (!answer) return null;
          return (
            <div key={i} className="flex flex-col gap-0.5">
              {items.length > 1 && (
                <span className="text-xs font-medium text-ak-content-secondary">
                  {item.header ?? item.question}
                </span>
              )}
              <span className="text-sm text-ak-content">{answer}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// Component
// ============================================================================

export function AgentQuestion({
  question,
  questions,
  type = "text",
  options = [],
  allowOther = false,
  placeholder = "Your answer…",
  secret = false,
  submitLabel = "Continue",
  skipLabel = "Skip",
  onSubmit,
  onSubmitMultiple,
  onSkip,
  answer,
  answers,
  className,
}: AgentQuestionProps) {
  // Normalize to items array
  const items: AgentQuestionItem[] = questions ?? (question
    ? [{ question, type, options, allowOther, placeholder, secret }]
    : []);

  const isMulti = items.length > 1;

  // Per-question field state
  const [fields, setFields] = React.useState<Record<number, FieldState>>(() => {
    const init: Record<number, FieldState> = {};
    items.forEach((_, i) => { init[i] = emptyField(); });
    return init;
  });

  const [resolved, setResolved] = React.useState<Record<string, string> | null>(
    () => {
      if (answers) return answers;
      if (answer !== undefined && items.length === 1) {
        return { [items[0].header ?? items[0].question]: answer };
      }
      return null;
    }
  );

  if (resolved) {
    return <ResolvedView items={items} answers={resolved} className={className} />;
  }

  // ---- Submit logic ----

  const allComplete = items.every((item, i) => isFieldComplete(fields[i] ?? emptyField(), item));

  const handleSubmit = () => {
    if (!allComplete) return;

    if (isMulti) {
      const result: Record<string, string> = {};
      items.forEach((item, i) => {
        const ans = getFieldAnswer(fields[i] ?? emptyField(), item);
        if (ans) result[item.header ?? item.question] = ans;
      });
      setResolved(result);
      onSubmitMultiple?.(result);
    } else {
      const ans = getFieldAnswer(fields[0] ?? emptyField(), items[0]);
      if (!ans) return;
      setResolved({ [items[0].header ?? items[0].question]: ans });
      onSubmit?.(ans);
    }
  };

  const handleSkip = () => {
    const skipped: Record<string, string> = {};
    items.forEach((item) => {
      skipped[item.header ?? item.question] = "Skipped";
    });
    setResolved(skipped);
    onSkip?.();
  };

  // ---- Auto-submit for single-select without "Other" ----

  const handleFieldChange = (index: number, next: FieldState) => {
    setFields((prev) => ({ ...prev, [index]: next }));

    // Auto-submit: single question, single-select, picked an option (not "Other")
    if (!isMulti && items[0].type === "single-select" && next.selected && !next.otherSelected) {
      const ans = getFieldAnswer(next, items[0]);
      if (ans) {
        setResolved({ [items[0].header ?? items[0].question]: ans });
        onSubmit?.(ans);
      }
    }
  };

  // ---- Show submit button? ----

  const showSubmit = isMulti || type === "text" || type === "multi-select" ||
    (type === "single-select" && allowOther);

  const showFooter = showSubmit || skipLabel !== null;

  // ---- Render ----

  return (
    <div className={cn("ak w-full shrink-0", className)}>
      <div className="overflow-hidden rounded-lg border border-ak-border bg-ak-surface shadow-sm">
        {/* Content */}
        <div className={cn("flex flex-col px-3 py-2.5", isMulti ? "gap-4" : "gap-1.5")}>
          {items.map((item, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              {isMulti && (
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex size-4 items-center justify-center rounded-full bg-ak-primary text-[10px] font-semibold text-ak-primary-content">
                    {i + 1}
                  </span>
                  {item.header && (
                    <span className="text-xs font-medium text-ak-content">
                      {item.header}
                    </span>
                  )}
                </div>
              )}
              <QuestionField
                item={item}
                field={fields[i] ?? emptyField()}
                onChange={(next) => handleFieldChange(i, next)}
                multi={isMulti}
              />
            </div>
          ))}
        </div>

        {/* Footer */}
        {showFooter && (
          <div className="flex items-center justify-between gap-2 border-t border-ak-border px-3 py-2">
            {skipLabel !== null ? (
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
                disabled={!allComplete}
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
