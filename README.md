# agent-kit

A standalone React component library for building AI agent chat interfaces. No design system dependency, no runtime CSS framework required — just drop in the components, override a few CSS variables, and you're done.

## Components

- **ChatInput** — Auto-resizing input bar with attachment support, send/stop buttons, and controlled/uncontrolled modes
- **AgentMessage** — Borderless agent response with markdown rendering, streaming cursor, and action buttons
- **UserMessage** — Right-aligned message bubble with attachments and actions
- **Reasoning** — Collapsible thinking block with live elapsed timer
- **ToolCall** — Collapsible tool invocation display with file diffs, terminal output, and content rendering
- **AgentQuestion** — Interactive question prompts (text, single-select, multi-select)
- **Attachments** — File preview list with image thumbnails and file chips
- **CodeBlock** — Syntax-highlighted code blocks via Shiki with copy-to-clipboard
- **Conversation** — Composes all components into a single scrollable chat interface

## Features

- **Standalone** — Ships its own theming via CSS variables, no external design system needed
- **Tree-shakeable** — Import only what you need, each component is independently exported
- **Dark mode** — Built-in dark theme via `.dark` class, override any color with CSS variables
- **TypeScript** — Full type definitions for all props and callbacks
- **Matter font** — Bundled with the Matter font family for consistent typography
- **Lucide icons** — Clean, consistent iconography throughout

## Install

```bash
npm install agent-kit
```

## Quick start

```tsx
import { Conversation, type ConversationMessage } from "agent-kit";
import "agent-kit/styles.css";

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

## License

MIT
