# chat-kit

A standalone React component library for building AI agent chat interfaces. No design system dependency, no Tailwind or CSS framework required in your app — import the components and one precompiled stylesheet, override a few CSS variables, and you're done.

## Components

- **ChatInput** — Auto-resizing input bar with attachment support, send/stop buttons, and controlled/uncontrolled modes
- **AgentMessage** — Borderless agent response with markdown rendering and action buttons
- **UserMessage** — Right-aligned message bubble with attachments and actions
- **Reasoning** — Collapsible thinking block with live elapsed timer
- **ToolCall** — Collapsible tool invocation display with file diffs, terminal output, and content rendering
- **AgentQuestion** — Interactive question prompts (text, single-select, multi-select, multiple questions)
- **Plan** — Agent task plan, inline or as a compact floating status bar
- **Attachments** — File preview list with image thumbnails and file chips
- **CodeBlock** — Syntax-highlighted code blocks via Shiki with copy-to-clipboard
- **ScrollToBottom** — Floating "jump to latest" button
- **Conversation** — Composes all components into a single scrollable chat interface

Primitives: **Markdown** (GitHub-flavoured markdown via `react-markdown`), **MessageActions**, **Icon**.

## Features

- **Standalone** — Ships precompiled CSS and its own theming via CSS variables
- **Doesn't touch your app** — No global reset; styles are scoped to chat-kit components
- **Safe by default for model output** — Raw HTML is escaped, `javascript:` and other unsafe links aren't rendered as links, and markdown images render as links instead of loading automatically
- **Dark mode** — Built-in dark theme via `.dark` class, override any color with CSS variables
- **TypeScript** — Full type definitions for all props and callbacks
- **Lazy syntax highlighting** — Shiki and each language grammar load on first use

## Install

```bash
npm install chat-kit
```

## Quick start

```tsx
import { Conversation, type ConversationMessage } from "chat-kit";
import "chat-kit/styles.css";

const messages: ConversationMessage[] = [
  {
    id: "1",
    role: "user",
    content: "Can you deploy the staging environment?",
  },
  {
    id: "2",
    role: "agent",
    reasoning: {
      content: "I need to check the current branch and run the build.",
      duration: 4,
    },
    toolCalls: [
      {
        toolTitle: "Bash",
        toolStatus: "success",
        toolContent: [
          { type: "terminal", terminalId: "1", text: "$ npm run build\n✓ built in 2.3s" },
        ],
      },
    ],
    content: "Done! Deployed to staging.",
  },
];

export function App() {
  return (
    <div style={{ height: 600 }}>
      <Conversation
        messages={messages}
        onSubmit={(v) => console.log(v)}
        onStop={() => console.log("stopped")}
      />
    </div>
  );
}
```

`Conversation` fills its parent's height, so give the parent a height.

## Theming

All colors are driven by CSS variables. Override them globally or per-component:

```css
:root {
  --ak-primary: #6366f1;
  --ak-primary-hover: #4f46e5;
  --ak-surface: #ffffff;
  --ak-border: #e4e4e7;
  --ak-content: #18181b;
}

.dark {
  --ak-primary: #818cf8;
  --ak-surface: #18181b;
  --ak-border: #27272a;
  --ak-content: #fafafa;
}
```

Load your overrides after `chat-kit/styles.css`. The full list of variables:

| Variable | Used for |
| --- | --- |
| `--ak-surface`, `--ak-surface-hover`, `--ak-surface-active` | Backgrounds |
| `--ak-border`, `--ak-border-hover` | Borders |
| `--ak-content`, `--ak-content-secondary`, `--ak-content-tertiary` | Text |
| `--ak-primary`, `--ak-primary-hover`, `--ak-primary-content` | Primary buttons and links |
| `--ak-danger`, `--ak-danger-hover` | Stop button, failed states |
| `--ak-code-surface`, `--ak-code-content` | Code block background and text |
| `--ak-font-sans`, `--ak-font-mono` | Fonts (default: system font stack) |

## Agent skill

Run one of these from your app's root. Each installs the same skill in a different place, and the project targets also run `npm install chat-kit` when a `package.json` is present.

```bash
# This project, for Cursor. Cloud Agents that check out the repo get it too.
curl -fsSL https://raw.githubusercontent.com/RamGoel/agent-kit/main/skills/install.sh | bash -s -- cursor

# Every project on this machine. Then turn on Settings → Agents → Sync Skills for Cloud Agents.
curl -fsSL https://raw.githubusercontent.com/RamGoel/agent-kit/main/skills/install.sh | bash -s -- cloud

# Claude Code (.claude/skills) or Codex (.agents/skills)
curl -fsSL https://raw.githubusercontent.com/RamGoel/agent-kit/main/skills/install.sh | bash -s -- claude
curl -fsSL https://raw.githubusercontent.com/RamGoel/agent-kit/main/skills/install.sh | bash -s -- codex
```

## Development

```bash
npm install
npm run dev        # showcase at http://localhost:5173
npm run build      # library build into dist/
```

## License

[MIT](./LICENSE)
