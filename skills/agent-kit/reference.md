# agent-kit reference

Read this when you need a prop the SKILL.md example does not show.

## ConversationMessage

```ts
interface ConversationMessage {
  id: string;
  role: "user" | "agent";
  content?: string;          // markdown
  streaming?: boolean;
  attachments?: Attachment[]; // { id, name, type, size?, url? }
  reasoning?: { content: string; streaming?: boolean; duration?: number };
  toolCalls?: {
    toolTitle?: string;
    toolStatus?: "in_progress" | "success" | "error" | "";
    toolContent?: ToolContent[];
  }[];
  planEntries?: { content: string; status?: PlanEntryStatus; priority?: string }[];
}

type PlanEntryStatus = "pending" | "in_progress" | "completed" | "failed" | "cancelled";

type ToolContent =
  | { type: "content"; text?: string }
  | { type: "diff"; path?: string; oldText?: string | null; newText?: string }
  | { type: "terminal"; text?: string; terminalId?: string };
```

`toolStatus: "in_progress"` pulses the title. `"error"` shows an error icon. A `diff` entry renders a line diff; a `terminal` entry renders a bash block. `ToolCall` infers an icon from `toolTitle` (Bash, Read, Edit, Search, …) when you don't pass `toolKind`.

The first plan in a thread renders inline. A later plan that is not fully completed also renders as a floating bar above the input. Pass the same `planEntries` on the message; don't render a second `Plan` yourself inside `Conversation`.

## AgentQuestion

```tsx
<AgentQuestion
  questions={[
    { header: "Environment", question: "Where should this go?", type: "single-select", options: [
      { label: "Staging", value: "staging" },
      { label: "Production", value: "production" },
    ]},
    { header: "Note", question: "Anything else?", type: "text" },
  ]}
  onSubmitMultiple={(answers) => save(answers)}
/>
```

`answers` is keyed by `header`, or by the question text when there is no header. Pass `answer` (one question) or `answers` (several) to show the resolved, read-only state instead of the form.

`skipLabel={null}` hides Skip. `secret` uses a password input.

## ChatInput

Controlled with `value` + `onValueChange`, or uncontrolled with `defaultValue`. Enter submits, Shift+Enter inserts a newline, Escape stops while generating. `attachments` + `onRemoveAttachment` render the chip row. `onAttach` is the paperclip.

## Theme variables

Set these on `:root` and `.dark`, in a stylesheet loaded after `agent-kit/styles.css`.

| Variable | Role |
| --- | --- |
| `--ak-surface`, `--ak-surface-hover`, `--ak-surface-active` | Backgrounds |
| `--ak-border`, `--ak-border-hover` | Borders |
| `--ak-content`, `--ak-content-secondary`, `--ak-content-tertiary` | Text |
| `--ak-primary`, `--ak-primary-hover`, `--ak-primary-content` | Buttons and links |
| `--ak-danger`, `--ak-danger-hover` | Stop button, failed plan steps |
| `--ak-code-surface`, `--ak-code-content` | Code block background and fallback text |
| `--ak-font-sans`, `--ak-font-mono` | Fonts. Default is the system stack |

Add `class="dark"` on an ancestor for the built-in dark values. A `className` on any component is for one-off layout only, not for recoloring.
