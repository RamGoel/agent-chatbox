---
name: agent-chatbox
description: >-
  Build AI agent chat interfaces with the agent-chatbox React components
  (ChatInput, AgentMessage, UserMessage, Reasoning, ToolCall, Plan,
  AgentQuestion, CodeBlock, Attachments, ScrollToBottom). Use when adding a
  chat UI, agent transcript, streaming messages, tool calls, a reasoning
  trace, an agent plan, or when the user mentions agent-chatbox.
---

# agent-chatbox

React components for an agent chat. Compose them yourself. There is no thread component and no message type. The stylesheet is precompiled. Do not add Tailwind, a theme provider, or a markdown library for these components.

## Setup

```tsx
import {
  AgentMessage,
  ChatInput,
  UserMessage,
} from "agent-chatbox";
import "agent-chatbox/styles.css";
```

Import `agent-chatbox/styles.css` once, in the app entry, before any `--ak-*` overrides. Without it every component renders unstyled. It does not restyle the host page.

## Compose a thread

| Need | Component |
| --- | --- |
| What the user said | `UserMessage` |
| What the agent said | `AgentMessage` |
| Thinking trace | `Reasoning` |
| A tool, a diff, or terminal output | `ToolCall` |
| A task list | `Plan`, or `Plan` with `floating` for a compact bar |
| The agent asking the user | `AgentQuestion` |
| The composer | `ChatInput` |
| Jump back to the latest message | `ScrollToBottom` |
| Code outside a message | `CodeBlock` with an explicit `language` |
| File chips on a message or the composer | `Attachments` |

```tsx
<div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
  <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16, padding: 12 }}>
    <UserMessage content="Deploy staging." />
    <Reasoning content="Check the branch, then build." duration={4} />
    <ToolCall
      toolTitle="Bash"
      toolStatus="success"
      toolContent={[
        { type: "terminal", terminalId: "1", text: "$ npm run build\nbuilt in 2.3s" },
      ]}
    />
    <Plan
      entries={[
        { content: "Build", status: "completed" },
        { content: "Deploy", status: "in_progress" },
      ]}
    />
    <AgentMessage content="Deployed to staging." streaming={false} />
  </div>
  <div style={{ padding: 12 }}>
    <ChatInput
      isGenerating={isGenerating}
      onSubmit={(text) => send(text)}
      onStop={abort}
    />
  </div>
</div>
```

The scroll parent needs a real height (`height: 100%` on a sized parent, or a fixed height). A parent with no height collapses the thread.

`isGenerating` turns the send button into stop. Wire `onStop` to the same abort the request uses. Leaving it unwired shows a stop button that does nothing.

While tokens are still arriving, set `streaming` on `AgentMessage` and on `Reasoning`. Set it back to `false` when the turn finishes so message actions can appear. Only the latest agent message should be streaming.

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

Put `AgentQuestion` in the thread where the agent is asking. `single-select` submits on click. `text` and `multi-select` submit from the Continue button. For several questions at once, pass `questions` and `onSubmitMultiple`. A `single-select` with `allowOther` also waits for Continue.

## Easy to get wrong

- You own scrolling. Give the thread one scroll container with a height. Pin to the bottom only when the user is already near it, and show `ScrollToBottom` when they are not. Do not put a second scroll container around that thread.
- Place `Plan` in the thread. Use `<Plan floating />` when you want the compact bar above the input. Nothing else renders a plan for you.
- Give `CodeBlock` a `language` (`tsx`, `python`, `bash`, `diff`, …). The default is plain text, so highlighting silently does nothing. Do not run Prettier on the string first. What the user sees should be what the model wrote.
- Image attachments need `url`. Without it, an image file renders as a chip.
- Theme with `--ak-*` variables in a stylesheet loaded after `agent-chatbox/styles.css`. `className` is for layout, not color. Dark mode is a `dark` class on an ancestor. There is no `theme` prop.
- `ChatInput`: Enter submits, Shift+Enter inserts a newline, Escape stops while generating.

Prop tables, tool-content shapes, and the variable list are in [reference.md](reference.md).
