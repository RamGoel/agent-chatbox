---
name: agent-kit
description: >-
  Build AI agent chat interfaces with the agent-kit React components
  (Conversation, ChatInput, AgentMessage, UserMessage, Reasoning, ToolCall,
  Plan, AgentQuestion, CodeBlock, Attachments). Use when adding a chat UI,
  agent transcript, tool-call or reasoning display, or when the user mentions
  agent-kit.
---

# agent-kit

React components for an agent chat. Styles ship precompiled. No Tailwind setup.

## Setup

```tsx
import { Conversation, type ConversationMessage } from "agent-kit";
import "agent-kit/styles.css";
```

Import `agent-kit/styles.css` once, in the app entry, **before** any `--ak-*` overrides. Skipping it leaves every component unstyled. The file does not restyle the host page.

`Conversation` is `h-full`. Give its parent a height.

```tsx
<div style={{ height: "100vh" }}>
  <Conversation
    messages={messages}
    isGenerating={isGenerating}
    onSubmit={handleSubmit}
    onStop={handleStop}
  />
</div>
```

`isGenerating` switches the button to stop. Wire `onStop`.

## Which component

Use `Conversation` for a full thread. Reach for the pieces only when the layout needs something `Conversation` does not do.

| Need | Use |
| --- | --- |
| Scrollable thread, input, auto-scroll | `Conversation` |
| Input only | `ChatInput` |
| One agent or user turn | `AgentMessage`, `UserMessage` |
| Thinking trace | `Reasoning` |
| Tool invocation, diff, or terminal | `ToolCall` |
| Task list | `Plan` (`floating` for the bar above the input) |
| Agent asking the user something | `AgentQuestion` |
| Highlighted code outside a message | `CodeBlock` |

`Conversation` renders reasoning, tool calls, plan, and markdown content. It does **not** render questions. When the agent is waiting on the user, render `AgentQuestion` yourself beside the thread.

## Messages

Pass model output as markdown strings. Do not pass HTML. `javascript:` links are dropped and images render as links.

```tsx
const messages: ConversationMessage[] = [
  { id: "1", role: "user", content: "Deploy staging." },
  {
    id: "2",
    role: "agent",
    reasoning: { content: "Check the branch, then build.", duration: 4 },
    toolCalls: [
      {
        toolTitle: "Bash",
        toolStatus: "success",
        toolContent: [
          { type: "terminal", terminalId: "1", text: "$ npm run build\nbuilt in 2.3s" },
        ],
      },
    ],
    content: "Deployed to staging.",
  },
];
```

Set `streaming: true` on a message (and on `reasoning`) while tokens are still arriving.

## Code and theme

`CodeBlock` defaults to plain text. Pass `language` (`tsx`, `python`, `bash`, `diff`, …). Any language Shiki ships is loaded on first use.

Theme by overriding `--ak-*` after the stylesheet. Full message, tool-content, and variable lists are in [reference.md](reference.md).
