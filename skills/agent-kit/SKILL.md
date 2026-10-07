---
name: agent-kit
description: >-
  Build AI agent chat interfaces with the agent-kit React components
  (Conversation, ChatInput, AgentMessage, UserMessage, Reasoning, ToolCall,
  Plan, AgentQuestion, CodeBlock, Attachments). Use when adding a chat UI,
  agent transcript, streaming messages, tool calls, a reasoning trace, an
  agent plan, or when the user mentions agent-kit.
---

# agent-kit

React components for an agent chat. The stylesheet is precompiled. Do not add Tailwind, a theme provider, or a markdown library for these components.

## Setup

```tsx
import { Conversation, type ConversationMessage } from "agent-kit";
import "agent-kit/styles.css";
```

Import `agent-kit/styles.css` once, in the app entry, before any `--ak-*` overrides. Without it every component renders unstyled. It does not restyle the host page.

`Conversation` is `h-full`. The parent needs a real height (`height: 100%` on a sized parent, or a fixed height). A parent with no height collapses the thread.

```tsx
<div style={{ height: "100vh" }}>
  <Conversation
    messages={messages}
    isGenerating={isGenerating}
    onSubmit={(text) => send(text)}
    onStop={abort}
  />
</div>
```

`isGenerating` turns the send button into stop. Wire `onStop` to the same abort the request uses. Leaving it unwired shows a stop button that does nothing.

## One thread

Prefer `Conversation` for a full thread. Use the pieces below only when the layout needs something `Conversation` does not render.

| Need | Component |
| --- | --- |
| Scrollable thread plus input | `Conversation` |
| Input by itself | `ChatInput` |
| A single turn | `AgentMessage`, `UserMessage` |
| Thinking trace | `Reasoning` |
| A tool, a diff, or terminal output | `ToolCall` |
| A task list | `Plan` |
| The agent asking the user | `AgentQuestion`, rendered beside the thread |
| Code outside a message | `CodeBlock` with an explicit `language` |

`Conversation` renders `reasoning`, `toolCalls`, `planEntries`, and markdown `content`. It does not render questions. A `question` field on the message is ignored. Render `AgentQuestion` as a sibling under the thread.

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
    planEntries: [
      { content: "Build", status: "completed" },
      { content: "Deploy", status: "in_progress" },
    ],
    content: "Deployed to staging.",
    streaming: false,
  },
];
```

While tokens are still arriving, set `streaming: true` on that message and on `reasoning` when the trace is still growing. Set it back to `false` when the turn finishes so message actions can appear. Only the latest agent message should be streaming.

Pass model text as a markdown string. Do not convert it to HTML and do not sanitize it yourself. The renderer escapes HTML, drops `javascript:` links, and turns images into links so a prompt cannot load a remote image.

## Asking the user

```tsx
<AgentQuestion
  question="Which environment?"
  type="single-select"
  options={[
    { label: "Staging", value: "staging" },
    { label: "Production", value: "production" },
  ]}
  onSubmit={(answer) => continueWith(answer)}
/>
```

`single-select` submits on click. `text` and `multi-select` submit from the Continue button. For several questions at once, pass `questions` and `onSubmitMultiple`. A `single-select` with `allowOther` also waits for Continue.

## Easy to get wrong

- Do not wrap `Conversation` in a second scroll container. It scrolls itself and pins to the bottom only when the user is already there.
- Do not render a `Plan` next to `Conversation` for the same `planEntries`. The first plan renders inline. A later unfinished plan also floats above the input.
- Give `CodeBlock` a `language` (`tsx`, `python`, `bash`, `diff`, …). The default is plain text, so highlighting silently does nothing. Do not run Prettier on the string first. What the user sees should be what the model wrote.
- Image attachments need `url`. Without it, an image file renders as a chip.
- Theme with `--ak-*` variables in a stylesheet loaded after `agent-kit/styles.css`. `className` is for layout, not color. Dark mode is a `dark` class on an ancestor. There is no `theme` prop.
- `ChatInput`: Enter submits, Shift+Enter inserts a newline, Escape stops while generating.

Prop tables, tool-content shapes, and the variable list are in [reference.md](reference.md).
