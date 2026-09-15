import type { ReactNode } from "react";
import {
  ChatInput,
  AgentMessage,
  UserMessage,
  Reasoning,
  ToolCall,
  AgentQuestion,
  CodeBlock,
  Attachments,
  Conversation,
  ScrollToBottom,
  type Attachment,
  type ConversationMessage,
} from "agent-kit";
import { useState } from "react";

// ============================================================================
// Types
// ============================================================================

export interface Story {
  name: string;
  description?: string;
  code: string;
  render: () => ReactNode;
}

export interface ComponentConfig {
  slug: string;
  title: string;
  description: string;
  stories: Story[];
}

// ============================================================================
// Shared demo helpers
// ============================================================================

const SAMPLE_IMAGES = [
  "https://picsum.photos/seed/dashboard/128/128",
  "https://picsum.photos/seed/analytics/128/128",
  "https://picsum.photos/seed/charts/128/128",
];

// ============================================================================
// Registry
// ============================================================================

export const REGISTRY: ComponentConfig[] = [
  {
    slug: "chat-input",
    title: "ChatInput",
    description:
      "Auto-resizing chat input bar with attachment support, send/stop buttons, and controlled/uncontrolled modes. Enter submits, Shift+Enter inserts a newline, Escape stops generation.",
    stories: [
      {
        name: "Live Chat",
        description: "Type a message and press Enter. The stop button appears while generating.",
        code: `<ChatInput
  placeholder="Type a message…"
  isGenerating={isGenerating}
  onSubmit={handleSubmit}
  onStop={handleStop}
/>`,
        render: () => {
          const [messages, setMessages] = useState<{ role: "user" | "agent"; text: string }[]>([]);
          const [isGenerating, setIsGenerating] = useState(false);
          const handleSubmit = (value: string) => {
            setMessages((prev) => [...prev, { role: "user", text: value }]);
            setIsGenerating(true);
            setTimeout(() => {
              setIsGenerating(false);
              setMessages((prev) => [...prev, { role: "agent", text: `Response to: ${value}` }]);
            }, 1500);
          };
          return (
            <div className="flex w-full max-w-md flex-col gap-4">
              <div className="flex flex-col gap-2">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${
                      msg.role === "user"
                        ? "ml-auto bg-ak-primary text-ak-primary-content"
                        : "bg-ak-surface-hover text-ak-content"
                    }`}
                  >
                    {msg.text}
                  </div>
                ))}
                {isGenerating && (
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 animate-bounce rounded-full bg-ak-content-tertiary [animation-delay:-0.3s]" />
                    <span className="size-2 animate-bounce rounded-full bg-ak-content-tertiary [animation-delay:-0.15s]" />
                    <span className="size-2 animate-bounce rounded-full bg-ak-content-tertiary" />
                  </div>
                )}
              </div>
              <ChatInput
                placeholder="Type a message…"
                isGenerating={isGenerating}
                onSubmit={handleSubmit}
                onStop={() => setIsGenerating(false)}
              />
            </div>
          );
        },
      },
      {
        name: "Default",
        description: "Basic uncontrolled input.",
        code: `<ChatInput placeholder="Type a message…" />`,
        render: () => (
          <div className="w-full max-w-md">
            <ChatInput placeholder="Type a message…" />
          </div>
        ),
      },
      {
        name: "Generating",
        description: "Shows stop button instead of send. Input is disabled.",
        code: `<ChatInput
  placeholder="Generating…"
  isGenerating
  defaultValue="What is the capital of France?"
  onSubmit={() => {}}
  onStop={() => alert("Stopped!")}
/>`,
        render: () => (
          <div className="w-full max-w-md">
            <ChatInput
              placeholder="Generating…"
              isGenerating
              defaultValue="What is the capital of France?"
              onSubmit={() => {}}
              onStop={() => alert("Stopped!")}
            />
          </div>
        ),
      },
      {
        name: "With Attachments",
        description: "Click the paperclip to add a file chip. Hover to remove.",
        code: `<ChatInput
  placeholder="Type a message…"
  attachments={attachments}
  onAttach={handleAttach}
  onRemoveAttachment={handleRemove}
  onSubmit={(v) => alert(\`Sent: \${v}\`)}
/>`,
        render: () => {
          const [attachments, setAttachments] = useState<Attachment[]>([
            { id: "1", name: "dashboard.png", type: "image/png", size: 245760, url: SAMPLE_IMAGES[0] },
            { id: "2", name: "analytics.png", type: "image/png", size: 184320, url: SAMPLE_IMAGES[1] },
            { id: "3", name: "report.pdf", type: "application/pdf", size: 1024000 },
          ]);
          return (
            <div className="w-full max-w-md">
              <ChatInput
                placeholder="Type a message…"
                attachments={attachments}
                onAttach={() => {
                  const id = Math.random().toString(36).slice(2);
                  setAttachments((prev) => [
                    ...prev,
                    { id, name: `file-${id.slice(0, 4)}.pdf`, type: "application/pdf", size: 51200 },
                  ]);
                }}
                onRemoveAttachment={(id) => setAttachments((prev) => prev.filter((a) => a.id !== id))}
                onSubmit={(v) => alert(`Sent: ${v}`)}
              />
            </div>
          );
        },
      },
      {
        name: "Disabled",
        description: "Fully disabled input.",
        code: `<ChatInput placeholder="Disabled…" disabled defaultValue="Cannot send right now" />`,
        render: () => (
          <div className="w-full max-w-md">
            <ChatInput placeholder="Disabled…" disabled defaultValue="Cannot send right now" />
          </div>
        ),
      },
      {
        name: "Controlled",
        description: "Value controlled by parent state.",
        code: `const [value, setValue] = useState("Hello, world!");

<ChatInput
  value={value}
  onValueChange={setValue}
  onSubmit={(v) => alert(\`Sent: \${v}\`)}
  placeholder="Type a message…"
/>`,
        render: () => {
          const [value, setValue] = useState("Hello, world!");
          return (
            <div className="flex w-full max-w-md flex-col gap-3">
              <ChatInput
                value={value}
                onValueChange={setValue}
                onSubmit={(v) => alert(`Sent: ${v}`)}
                placeholder="Type a message…"
              />
              <p className="text-sm text-ak-content-tertiary">
                Current value:{" "}
                <code className="rounded bg-ak-surface-hover px-1.5 py-0.5 font-mono text-xs text-ak-content-secondary">
                  {value}
                </code>
              </p>
            </div>
          );
        },
      },
    ],
  },

  {
    slug: "agent-message",
    title: "AgentMessage",
    description:
      "Borderless, transparent agent chat message. Left-aligned, no bubble. Supports markdown content, streaming cursor, and action buttons.",
    stories: [
      {
        name: "Basic",
        description: "Simple agent message with markdown content.",
        code: `<AgentMessage content="Sure — I can help with that. Here's the plan:\n\n1. Build the image\n2. Run migrations\n3. Deploy to staging" />`,
        render: () => (
          <div className="w-full max-w-md">
            <AgentMessage content="Sure — I can help with that. Here's the plan:\n\n1. Build the image\n2. Run migrations\n3. Deploy to staging" />
          </div>
        ),
      },
      {
        name: "Streaming",
        description: "Shows a blinking cursor while content streams in.",
        code: `<AgentMessage content="Deploying to staging…" streaming />`,
        render: () => (
          <div className="w-full max-w-md">
            <AgentMessage content="Deploying to staging…" streaming />
          </div>
        ),
      },
      {
        name: "With Actions",
        description: "Action buttons rendered below the message.",
        code: `<AgentMessage
  content="Done! The deployment is live."
  actions={[
    { icon: "copy", label: "Copy", onClick: () => alert("Copied!") },
    { icon: "code", label: "View Code", onClick: () => {} },
  ]}
/>`,
        render: () => (
          <div className="w-full max-w-md">
            <AgentMessage
              content="Done! The deployment is live."
              actions={[
                { icon: "copy", label: "Copy", onClick: () => alert("Copied!") },
                { icon: "code", label: "View Code", onClick: () => {} },
              ]}
            />
          </div>
        ),
      },
      {
        name: "With Code Block",
        description: "Markdown with fenced code blocks rendered via CodeBlock.",
        code: `<AgentMessage content={'Here is the code:\n\`\`\`tsx\nconst x = 42;\n\`\`\`'} />`,
        render: () => (
          <div className="w-full max-w-md">
            <AgentMessage content={'Here is the code:\n```tsx\nconst x = 42;\n```'} />
          </div>
        ),
      },
    ],
  },

  {
    slug: "user-message",
    title: "UserMessage",
    description:
      "Right-aligned bordered card for user chat messages. Supports markdown, attachments, and action buttons.",
    stories: [
      {
        name: "Basic",
        description: "Simple user message in a bubble.",
        code: `<UserMessage content="Can you deploy the staging environment?" />`,
        render: () => (
          <div className="w-full max-w-md">
            <UserMessage content="Can you deploy the staging environment?" />
          </div>
        ),
      },
      {
        name: "With Attachments",
        description: "File attachments shown above the message bubble.",
        code: `<UserMessage
  content="Here's the screenshot"
  attachments={[{ id: "1", name: "screenshot.png", type: "image/png", size: 245760, url: url }]}
/>`,
        render: () => (
          <div className="w-full max-w-md">
            <UserMessage
              content="Here's the screenshot"
              attachments={[
                { id: "1", name: "dashboard.png", type: "image/png", size: 245760, url: SAMPLE_IMAGES[0] },
                { id: "2", name: "analytics.png", type: "image/png", size: 184320, url: SAMPLE_IMAGES[1] },
                { id: "3", name: "report.pdf", type: "application/pdf", size: 1024000 },
              ]}
            />
          </div>
        ),
      },
    ],
  },

  {
    slug: "reasoning",
    title: "Reasoning",
    description:
      "Collapsible reasoning/thinking block. Shows a live timer while streaming, collapses to a label when done.",
    stories: [
      {
        name: "Collapsed",
        description: "Default collapsed state showing 'Thought for Xs'.",
        code: `<Reasoning content="I need to check the database schema first…" duration={3} />`,
        render: () => (
          <div className="w-full max-w-md">
            <Reasoning content="I need to check the database schema first, then verify the migration scripts are compatible with the new version." duration={3} />
          </div>
        ),
      },
      {
        name: "Expanded",
        description: "Default expanded to show reasoning text.",
        code: `<Reasoning content="Analyzing the request…" defaultCollapsed={false} duration={5} />`,
        render: () => (
          <div className="w-full max-w-md">
            <Reasoning
              content="Let me think about this step by step.\n\nFirst, I'll check the database schema. Then I'll verify the migration scripts. Finally, I'll run the tests to make sure everything works."
              defaultCollapsed={false}
              duration={5}
            />
          </div>
        ),
      },
    ],
  },

  {
    slug: "tool-call",
    title: "ToolCall",
    description:
      "Collapsible display for a single tool invocation. Supports content text, file diffs, and terminal output with automatic kind detection.",
    stories: [
      {
        name: "Read File",
        description: "Tool call with content output.",
        code: `<ToolCall
  toolTitle="Read File"
  toolStatus="success"
  toolContent={[{ type: "content", text: "Found 42 lines in src/index.ts" }]}
/>`,
        render: () => (
          <div className="w-full max-w-md">
            <ToolCall
              toolTitle="Read File"
              toolStatus="success"
              toolContent={[{ type: "content", text: "Found 42 lines in src/index.ts" }]}
            />
          </div>
        ),
      },
      {
        name: "Edit File (Diff)",
        description: "Tool call with a file diff.",
        code: `<ToolCall
  toolTitle="Edit File"
  toolContent={[{ type: "diff", path: "src/auth.ts", oldText: "const x = 1;", newText: "const x = 2;" }]}
/>`,
        render: () => (
          <div className="w-full max-w-md">
            <ToolCall
              toolTitle="Edit File"
              toolContent={[
                {
                  type: "diff",
                  path: "src/auth.ts",
                  oldText: "const x = 1;\nconst y = 2;",
                  newText: "const x = 2;\nconst y = 3;",
                },
              ]}
            />
          </div>
        ),
      },
      {
        name: "Terminal Output",
        description: "Tool call with terminal output.",
        code: `<ToolCall
  toolTitle="Bash"
  toolStatus="success"
  toolContent={[{ type: "terminal", terminalId: "1", text: "$ npm run build\\n✓ built in 2.3s" }]}
/>`,
        render: () => (
          <div className="w-full max-w-md">
            <ToolCall
              toolTitle="Bash"
              toolStatus="success"
              toolContent={[{ type: "terminal", terminalId: "1", text: "$ npm run build\n✓ built in 2.3s" }]}
            />
          </div>
        ),
      },
      {
        name: "In Progress",
        description: "Tool call currently executing.",
        code: `<ToolCall toolTitle="Bash" toolStatus="in_progress" />`,
        render: () => (
          <div className="w-full max-w-md">
            <ToolCall toolTitle="Bash" toolStatus="in_progress" />
          </div>
        ),
      },
    ],
  },

  {
    slug: "agent-question",
    title: "AgentQuestion",
    description:
      "Interactive question component. Supports text input, single-select, and multi-select modes with an optional 'Other' field.",
    stories: [
      {
        name: "Text Input",
        description: "Simple text question.",
        code: `<AgentQuestion
  question="What is the API endpoint?"
  type="text"
  onSubmit={(answer) => console.log(answer)}
/>`,
        render: () => (
          <div className="w-full max-w-md">
            <AgentQuestion
              question="What is the API endpoint?"
              type="text"
              onSubmit={(answer) => alert(`Answer: ${answer}`)}
            />
          </div>
        ),
      },
      {
        name: "Single Select",
        description: "Choose one option.",
        code: `<AgentQuestion
  question="Which environment?"
  type="single-select"
  options={[
    { label: "Staging", value: "staging" },
    { label: "Production", value: "production" },
  ]}
/>`,
        render: () => (
          <div className="w-full max-w-md">
            <AgentQuestion
              question="Which environment?"
              type="single-select"
              options={[
                { label: "Staging", value: "staging" },
                { label: "Production", value: "production" },
              ]}
              onSubmit={(v) => alert(`Selected: ${v}`)}
            />
          </div>
        ),
      },
      {
        name: "Multi Select",
        description: "Choose multiple options with submit button.",
        code: `<AgentQuestion
  question="Which services to deploy?"
  type="multi-select"
  options={[
    { label: "API", value: "api" },
    { label: "Worker", value: "worker" },
    { label: "Dashboard", value: "dashboard" },
  ]}
  allowOther
  onSubmit={(v) => console.log(v)}
/>`,
        render: () => (
          <div className="w-full max-w-md">
            <AgentQuestion
              question="Which services to deploy?"
              type="multi-select"
              options={[
                { label: "API", value: "api" },
                { label: "Worker", value: "worker" },
                { label: "Dashboard", value: "dashboard" },
              ]}
              allowOther
              onSubmit={(v) => alert(`Selected: ${v}`)}
            />
          </div>
        ),
      },
    ],
  },

  {
    slug: "code-block",
    title: "CodeBlock",
    description:
      "Syntax-highlighted code block using Shiki. Supports multiple languages, optional copy button, and formatting via Prettier.",
    stories: [
      {
        name: "TypeScript",
        description: "Syntax-highlighted TSX with copy button.",
        code: `<CodeBlock code="const x: number = 42;" language="tsx" />`,
        render: () => (
          <div className="w-full max-w-md">
            <CodeBlock code={`const greet = (name: string) => {\n  return \`Hello, \${name}!\`;\n};`} language="tsx" />
          </div>
        ),
      },
      {
        name: "Bash",
        description: "Terminal command output.",
        code: `<CodeBlock code="npm install agent-kit" language="bash" />`,
        render: () => (
          <div className="w-full max-w-md">
            <CodeBlock code="npm install agent-kit" language="bash" />
          </div>
        ),
      },
      {
        name: "No Copy",
        description: "Without the copy button.",
        code: `<CodeBlock code="const x = 42;" noCopy />`,
        render: () => (
          <div className="w-full max-w-md">
            <CodeBlock code="const x = 42;" noCopy />
          </div>
        ),
      },
    ],
  },

  {
    slug: "attachments",
    title: "Attachments",
    description:
      "File attachment preview list. Renders image thumbnails and file chips with optional remove buttons.",
    stories: [
      {
        name: "Mixed",
        description: "Images and file chips together.",
        code: `<Attachments
  attachments={[
    { id: "1", name: "screenshot.png", type: "image/png", size: 245760, url: url },
    { id: "2", name: "report.pdf", type: "application/pdf", size: 1024000 },
  ]}
/>`,
        render: () => (
          <div className="w-full max-w-md">
            <Attachments
              attachments={[
                { id: "1", name: "dashboard.png", type: "image/png", size: 245760, url: SAMPLE_IMAGES[0] },
                { id: "2", name: "analytics.png", type: "image/png", size: 184320, url: SAMPLE_IMAGES[1] },
                { id: "3", name: "chart.png", type: "image/png", size: 92160, url: SAMPLE_IMAGES[2] },
                { id: "4", name: "report.pdf", type: "application/pdf", size: 1024000 },
                { id: "5", name: "data.json", type: "application/json", size: 8192 },
              ]}
            />
          </div>
        ),
      },
      {
        name: "Removable",
        description: "With remove buttons on hover.",
        code: `<Attachments
  attachments={attachments}
  onRemove={(id) => removeAttachment(id)}
/>`,
        render: () => {
          const [attachments, setAttachments] = useState<Attachment[]>([
            { id: "1", name: "dashboard.png", type: "image/png", size: 245760, url: SAMPLE_IMAGES[0] },
            { id: "2", name: "analytics.png", type: "image/png", size: 184320, url: SAMPLE_IMAGES[1] },
            { id: "3", name: "report.pdf", type: "application/pdf", size: 1024000 },
          ]);
          return (
            <div className="w-full max-w-md">
              <Attachments
                attachments={attachments}
                onRemove={(id) => setAttachments((prev) => prev.filter((a) => a.id !== id))}
              />
            </div>
          );
        },
      },
    ],
  },

  {
    slug: "scroll-to-bottom",
    title: "ScrollToBottom",
    description:
      "Floating button that appears when the user scrolls away from the bottom of a conversation, with an optional unread message count badge.",
    stories: [
      {
        name: "Default",
        description: "A floating scroll-to-bottom button with an unread count badge.",
        code: `<ScrollToBottom visible onClick={() => {}} />`,
        render: () => (
          <div className="flex h-40 items-center justify-center rounded-lg border border-ak-border bg-ak-surface-hover">
            <ScrollToBottom visible onClick={() => {}} />
          </div>
        ),
      },
    ],
  },

  {
    slug: "conversation",
    title: "Conversation",
    description:
      "Full chat conversation that composes all agent components — UserMessage, Reasoning, ToolCall, AgentMessage, AgentQuestion, and ChatInput — into a single scrollable interface with auto-scroll and input.",
    stories: [
      {
        name: "Full Conversation",
        description: "A complete interaction showing reasoning, tool calls, messages, and a question.",
        code: `<Conversation
  messages={messages}
  isGenerating={isGenerating}
  onSubmit={handleSubmit}
  onStop={handleStop}
/>`,
        render: () => {
          const [messages, setMessages] = useState<ConversationMessage[]>([
            {
              id: "1",
              role: "user",
              content: "Can you deploy the staging environment?",
            },
            {
              id: "2",
              role: "agent",
              reasoning: {
                content:
                  "I need to check the current branch, run the build, and verify tests pass before deploying. Let me start by reading the deployment config.",
                duration: 4,
              },
              toolCalls: [
                {
                  toolTitle: "Read File",
                  toolStatus: "success",
                  toolContent: [
                    { type: "content", text: "Found deploy.config.yml with staging settings" },
                  ],
                },
                {
                  toolTitle: "Bash",
                  toolStatus: "success",
                  toolContent: [
                    { type: "terminal", terminalId: "1", text: "$ npm run build\n✓ built in 2.3s\n$ npm test\n✓ 42 tests passed" },
                  ],
                },
              ],
              content:
                "Done! I've deployed to staging.\n\nHere's what I did:\n\n1. **Read** the deployment config\n2. **Built** the project (2.3s)\n3. **Ran** all 42 tests (all passed)\n4. **Deployed** to `staging.example.com`\n\nThe deployment is live at `https://staging.example.com`.",
            },
            {
              id: "3",
              role: "user",
              content: "Great! Can you also run the database migration?",
              attachments: [
                { id: "a1", name: "migration.sql", type: "text/sql", size: 4096 },
              ],
            },
            {
              id: "4",
              role: "agent",
              toolCalls: [
                {
                  toolTitle: "Edit File",
                  toolStatus: "success",
                  toolContent: [
                    {
                      type: "diff",
                      path: "db/migrations/001_add_users.sql",
                      oldText: "CREATE TABLE users (\n  id INTEGER PRIMARY KEY\n);",
                      newText: "CREATE TABLE users (\n  id INTEGER PRIMARY KEY,\n  email TEXT UNIQUE NOT NULL,\n  created_at TIMESTAMP DEFAULT NOW()\n);",
                    },
                  ],
                },
              ],
              content: "Migration applied successfully. Added `email` and `created_at` columns to the users table.",
            },
            {
              id: "5",
              role: "agent",
              question: {
                question: "Which environment should I deploy the migration to?",
                type: "single-select",
                options: [
                  { label: "Staging", value: "staging" },
                  { label: "Production", value: "production" },
                ],
                onSubmit: (answer) => alert(`Deploying migration to: ${answer}`),
              },
            },
          ]);
          const [isGenerating, setIsGenerating] = useState(false);

          const handleSubmit = (value: string) => {
            setMessages((prev) => [
              ...prev,
              { id: String(prev.length + 1), role: "user", content: value },
            ]);
            setIsGenerating(true);
            setTimeout(() => {
              setIsGenerating(false);
              setMessages((prev) => [
                ...prev,
                {
                  id: String(prev.length + 1),
                  role: "agent",
                  content: `Got it — working on: "${value}"`,
                },
              ]);
            }, 1500);
          };

          return (
            <div className="mx-auto w-full max-w-sm overflow-hidden rounded-3xl border border-ak-border bg-ak-surface shadow-lg" style={{ height: 600 }}>
              <Conversation
                messages={messages}
                isGenerating={isGenerating}
                onSubmit={handleSubmit}
                onStop={() => setIsGenerating(false)}
              />
            </div>
          );
        },
      },
    ],
  },
];

// ============================================================================
// Helpers
// ============================================================================

export function getComponent(slug: string): ComponentConfig | undefined {
  return REGISTRY.find((c) => c.slug === slug);
}

export function buildMenu(): { label: string; href: string }[] {
  return REGISTRY.map((c) => ({
    label: c.title,
    href: `/components/${c.slug}`,
  }));
}
