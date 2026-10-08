import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import {
  AgentMessage,
  AgentQuestion,
  ChatInput,
  Plan,
  Reasoning,
  ScrollToBottom,
  ToolCall,
  UserMessage,
  type Attachment,
} from "agent-chatbox";

// ============================================================================
// Thread chrome shared by every recipe preview
// ============================================================================

export function ThreadPreview({
  children,
  footer,
  scrollKey = 0,
}: {
  children: ReactNode;
  footer?: ReactNode;
  scrollKey?: string | number;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const stickRef = useRef(true);
  const [away, setAway] = useState(false);

  const pin = () => {
    const el = scrollerRef.current;
    if (!el) return;
    stickRef.current = true;
    el.scrollTop = el.scrollHeight;
    setAway(false);
  };

  useLayoutEffect(() => {
    const el = scrollerRef.current;
    if (!el || !stickRef.current) return;
    el.scrollTop = el.scrollHeight;
  }, [scrollKey]);

  return (
    <div className="mx-auto flex h-[32rem] w-[22.5rem] max-w-full flex-col overflow-hidden rounded-xl border border-ak-border bg-ak-surface">
      <div className="relative min-h-0 flex-1">
        <div
          ref={scrollerRef}
          onScroll={() => {
            const el = scrollerRef.current;
            if (!el) return;
            const isAway = el.scrollHeight - el.scrollTop - el.clientHeight > 48;
            stickRef.current = !isAway;
            setAway(isAway);
          }}
          className="thread-scroll absolute inset-0 overflow-y-auto"
        >
          <div className="flex flex-col gap-2 px-4 py-5">{children}</div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
          <div className="pointer-events-auto">
            <ScrollToBottom visible={away} onClick={pin} />
          </div>
        </div>
      </div>
      {footer ? (
        <div className="flex shrink-0 flex-col gap-2 p-2">{footer}</div>
      ) : null}
    </div>
  );
}

// ============================================================================
// Recipe registry
// ============================================================================

export interface Recipe {
  slug: string;
  title: string;
  summary: string;
  when: string;
  tryIt: string;
  uses: string[];
  code: string;
  Preview: () => ReactNode;
}

const GENERAL_CODE = `import { useRef } from "react";
import {
  AgentMessage,
  ChatInput,
  ScrollToBottom,
  UserMessage,
} from "agent-chatbox";

export function GeneralChat({
  messages,
  attachments,
  isGenerating,
  showJump,
  onSubmit,
  onStop,
  onJump,
  addAttachments,
  onRemoveAttachment,
  feedback,
  onFeedback,
  onRetry,
}) {
  const fileInput = useRef<HTMLInputElement>(null);
  const lastAgentId = messages.findLast((message) => message.role === "agent")?.id;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16, padding: 16 }}>
        {messages.map((message) =>
          message.role === "user" ? (
            <UserMessage
              key={message.id}
              content={message.content}
              attachments={message.attachments}
            />
          ) : (
            <AgentMessage
              key={message.id}
              content={message.content}
              streaming={message.streaming}
              actions={[
                {
                  icon: "copy",
                  label: "Copy",
                  onClick: () => navigator.clipboard.writeText(message.content),
                },
                {
                  icon: "thumbs-up",
                  label: "Good response",
                  active: feedback[message.id] === "up",
                  onClick: () => onFeedback(message.id, "up"),
                },
                {
                  icon: "thumbs-down",
                  label: "Bad response",
                  active: feedback[message.id] === "down",
                  onClick: () => onFeedback(message.id, "down"),
                },
                ...(message.id === lastAgentId
                  ? [{ icon: "retry", label: "Retry", onClick: () => onRetry(message.id) }]
                  : []),
              ]}
            />
          ),
        )}
      </div>
      <div style={{ position: "absolute", bottom: 72, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <ScrollToBottom visible={showJump} onClick={onJump} />
      </div>
      <div style={{ padding: 12 }}>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(event) => {
            // Image attachments need a url, or they render as file chips.
            const files = Array.from(event.target.files ?? []).map((file) => ({
              id: crypto.randomUUID(),
              name: file.name,
              type: file.type,
              size: file.size,
              url: URL.createObjectURL(file),
            }));
            addAttachments(files);
            event.target.value = "";
          }}
        />
        <ChatInput
          isGenerating={isGenerating}
          placeholder="Message…"
          attachments={attachments}
          onAttach={() => fileInput.current?.click()}
          onRemoveAttachment={onRemoveAttachment}
          onSubmit={onSubmit}
          onStop={onStop}
        />
      </div>
    </div>
  );
}`;

const CODING_CODE = `import {
  AgentMessage,
  ChatInput,
  Plan,
  Reasoning,
  ToolCall,
  UserMessage,
} from "agent-chatbox";

export function CodingAgent({ isGenerating, onSubmit, onStop }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16, padding: 16 }}>
        <UserMessage content="The login form accepts a 3-character password." />
        <Reasoning
          content="The check never runs before submit. I'll read the form, add a length check, and run the tests."
          duration={3}
        />
        <ToolCall
          toolTitle="Read"
          toolKind="read"
          toolStatus="success"
          defaultExpanded={false}
          toolContent={[
            {
              type: "content",
              text: \`function submit(password: string) {
  return login(password);
}\`,
            },
          ]}
        />
        <ToolCall
          toolTitle="Edit"
          toolKind="edit"
          toolStatus="success"
          defaultExpanded={false}
          toolContent={[
            {
              type: "diff",
              path: "src/LoginForm.tsx",
              oldText: \`function submit(password: string) {
  return login(password);
}\`,
              newText: \`function submit(password: string) {
  if (password.length < 8) {
    return setError("Use at least 8 characters.");
  }
  return login(password);
}\`,
            },
          ]}
        />
        <ToolCall
          toolTitle="Bash"
          toolStatus="success"
          defaultExpanded={false}
          toolContent={[
            {
              type: "terminal",
              terminalId: "1",
              text: \`$ npm test -- LoginForm
✓ rejects a short password

1 passed\`,
            },
          ]}
        />
        <AgentMessage
          streaming={isGenerating}
          content="The form now rejects passwords shorter than 8 characters, and the test passes."
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 12 }}>
        <Plan
          floating
          entries={[
            { content: "Read the form", status: "completed" },
            { content: "Add the length check", status: "completed" },
            { content: "Run tests", status: "completed" },
            { content: "Summarize the change", status: "in_progress" },
          ]}
        />
        <ChatInput
          isGenerating={isGenerating}
          placeholder="Tell the agent what to change…"
          onSubmit={onSubmit}
          onStop={onStop}
        />
      </div>
    </div>
  );
}`;

const WORK_CODE = `import {
  AgentMessage,
  AgentQuestion,
  ChatInput,
  Plan,
  UserMessage,
} from "agent-chatbox";

const DRAFT = \`**Q3 status**

- Shipped the new onboarding flow. Activation is up 12%.
- Support volume is flat. Billing retries and a slow export are still open.
- Need a decision on staffing the export fix this sprint.\`;

export function WorkAgent({ onAnswer, onSubmit }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16, padding: 16 }}>
        <UserMessage
          content="Turn this brief into a status update for leadership."
          attachments={[
            { id: "brief", name: "q3-brief.pdf", type: "application/pdf", size: 184320 },
          ]}
        />
        <Plan
          entries={[
            { content: "Read the brief", status: "completed" },
            { content: "Draft the update", status: "completed" },
            { content: "Confirm who should see it", status: "in_progress" },
          ]}
        />
        <AgentMessage content={DRAFT} />
        <AgentQuestion
          question="Who should see this?"
          type="single-select"
          options={[
            { label: "Leadership channel", value: "leadership" },
            { label: "Just my manager", value: "manager" },
            { label: "Hold for review", value: "hold" },
          ]}
          onSubmit={onAnswer}
        />
      </div>
      <div style={{ padding: 12 }}>
        <ChatInput placeholder="Change the tone or the audience…" onSubmit={onSubmit} />
      </div>
    </div>
  );
}`;

const RESEARCH_CODE = `import { AgentMessage, ChatInput, ToolCall, UserMessage } from "agent-chatbox";

export function ResearchAgent({ onSubmit }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16, padding: 16 }}>
        <UserMessage content="What do we have to tell users if we ship this chatbot in Europe?" />
        <ToolCall
          toolTitle="Web search"
          toolKind="web_search"
          toolStatus="success"
          defaultExpanded={false}
          toolContent={[
            {
              type: "content",
              text: \`Chatbot transparency duties
Disclosure in the chat, where the conversation starts\`,
            },
          ]}
        />
        <ToolCall
          toolTitle="Fetch article"
          toolKind="fetch"
          toolStatus="success"
          defaultExpanded={false}
          toolContent={[
            {
              type: "content",
              text: "People have to be told they are interacting with an AI system. The notice belongs in the product, where the conversation starts.",
            },
          ]}
        />
        <AgentMessage
          content={\`Two things belong in the product itself.

1. **Say that a person is talking to a system.** Put that in the chat, where the conversation starts.
2. **Keep the model paperwork.** If you wrap a general-purpose model, store what the provider gives you and what you changed.

The search and the page are in the trace above. This is a product summary, not legal advice.\`}
        />
      </div>
      <div style={{ padding: 12 }}>
        <ChatInput placeholder="Ask a follow-up…" onSubmit={onSubmit} />
      </div>
    </div>
  );
}`;

interface ChatMessage {
  id: string;
  role: "user" | "agent";
  content: string;
  attachments?: Attachment[];
  streaming?: boolean;
}

function GeneralPreview() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "u1",
      role: "user",
      content: "What's a good way to explain embeddings to a new teammate?",
    },
    {
      id: "a1",
      role: "agent",
      content:
        "Start with a map, not the math.\n\nAn embedding turns a piece of text into a list of numbers. Texts about the same thing land near each other, and texts about different things land far apart.\n\nThen show four sentences: two about a login bug, two about lunch. Ask which pair should sit closer, and why. Once that clicks, the vector is just the coordinate on that map.",
    },
    {
      id: "u2",
      role: "user",
      content: "Make it two sentences.",
    },
    {
      id: "a2",
      role: "agent",
      content:
        "An embedding is a list of numbers that puts similar text near each other. Two sentences about the same bug should land closer together than either one lands next to a sentence about lunch.",
    },
    {
      id: "u3",
      role: "user",
      content: "Which of these dashboards reads better?",
      attachments: [
        {
          id: "dash-a",
          name: "dashboard-a.png",
          type: "image/png",
          url: "https://picsum.photos/seed/dashboard/256/256",
        },
        {
          id: "dash-b",
          name: "dashboard-b.png",
          type: "image/png",
          url: "https://picsum.photos/seed/analytics/256/256",
        },
      ],
    },
    {
      id: "a3",
      role: "agent",
      content:
        "The second one. Its headline number sits top left, where the eye lands first, and the chart below it explains that number. The first one splits attention across four cards of the same size.",
    },
  ]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [feedback, setFeedback] = useState<Record<string, "up" | "down">>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const timer = useRef<number | null>(null);
  const copiedTimer = useRef<number | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const objectUrls = useRef<string[]>([]);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
      if (copiedTimer.current) window.clearTimeout(copiedTimer.current);
      objectUrls.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const copy = (message: ChatMessage) => {
    navigator.clipboard.writeText(message.content);
    setCopiedId(message.id);
    if (copiedTimer.current) window.clearTimeout(copiedTimer.current);
    copiedTimer.current = window.setTimeout(() => setCopiedId(null), 1500);
  };

  const rate = (id: string, value: "up" | "down") => {
    setFeedback((prev) => {
      const next = { ...prev };
      if (next[id] === value) delete next[id];
      else next[id] = value;
      return next;
    });
  };

  const retry = (message: ChatMessage) => {
    if (isGenerating) return;
    const previous = message.content;
    setFeedback((prev) => {
      const next = { ...prev };
      delete next[message.id];
      return next;
    });
    setMessages((prev) =>
      prev.map((m) => (m.id === message.id ? { ...m, content: "", streaming: true } : m)),
    );
    setIsGenerating(true);
    timer.current = window.setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === message.id ? { ...m, content: previous, streaming: false } : m,
        ),
      );
      setIsGenerating(false);
    }, 1200);
  };

  const lastAgentId = [...messages].reverse().find((m) => m.role === "agent")?.id;

  const addFiles = (files: FileList | null) => {
    const next = Array.from(files ?? []).map((file) => {
      const url = URL.createObjectURL(file);
      objectUrls.current.push(url);
      return { id: crypto.randomUUID(), name: file.name, type: file.type, size: file.size, url };
    });
    setAttachments((prev) => [...prev, ...next]);
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => {
      const removed = prev.find((attachment) => attachment.id === id);
      if (removed?.url) {
        URL.revokeObjectURL(removed.url);
        objectUrls.current = objectUrls.current.filter((url) => url !== removed.url);
      }
      return prev.filter((attachment) => attachment.id !== id);
    });
  };

  const onSubmit = (text: string) => {
    const agentId = crypto.randomUUID();
    const sent = attachments;
    setAttachments([]);
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", content: text, attachments: sent },
      { id: agentId, role: "agent", content: "", streaming: true },
    ]);
    setIsGenerating(true);
    timer.current = window.setTimeout(() => {
      const reply =
        sent.length > 0
          ? `I can see ${sent.length === 1 ? "the image" : `all ${sent.length} images`}. In a real app, send ${sent.length === 1 ? "it" : "them"} with “${text.trim()}” to a vision model and stream its answer here.`
          : `An embedding places “${text.trim()}” near text that means the same thing, and far from text that doesn't.\n\nThat's the whole idea: similar in, nearby numbers out.`;
      setMessages((prev) =>
        prev.map((message) =>
          message.id === agentId ? { ...message, streaming: false, content: reply } : message,
        ),
      );
      setIsGenerating(false);
    }, 1600);
  };

  const onStop = () => {
    if (timer.current) window.clearTimeout(timer.current);
    setIsGenerating(false);
    setMessages((prev) =>
      prev.map((message) =>
        message.streaming ? { ...message, content: "Stopped.", streaming: false } : message,
      ),
    );
  };

  return (
    <ThreadPreview
      scrollKey={messages.length + (isGenerating ? 1 : 0)}
      footer={
        <>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(event) => {
              addFiles(event.target.files);
              event.target.value = "";
            }}
          />
          <ChatInput
            isGenerating={isGenerating}
            placeholder="Message…"
            attachments={attachments}
            onAttach={() => fileInput.current?.click()}
            onRemoveAttachment={removeAttachment}
            onSubmit={onSubmit}
            onStop={onStop}
          />
        </>
      }
    >
      {messages.map((message) =>
        message.role === "user" ? (
          <UserMessage
            key={message.id}
            content={message.content}
            attachments={message.attachments}
          />
        ) : (
          <AgentMessage
            key={message.id}
            content={message.content}
            streaming={message.streaming}
            actions={[
              {
                icon: copiedId === message.id ? "check" : "copy",
                label: copiedId === message.id ? "Copied" : "Copy",
                onClick: () => copy(message),
              },
              {
                icon: "thumbs-up",
                label: "Good response",
                active: feedback[message.id] === "up",
                onClick: () => rate(message.id, "up"),
              },
              {
                icon: "thumbs-down",
                label: "Bad response",
                active: feedback[message.id] === "down",
                onClick: () => rate(message.id, "down"),
              },
              ...(message.id === lastAgentId
                ? [{ icon: "retry", label: "Retry", onClick: () => retry(message) }]
                : []),
            ]}
          />
        ),
      )}
    </ThreadPreview>
  );
}

const LOGIN_BEFORE = `function submit(password: string) {
  return login(password);
}`;

const LOGIN_AFTER = `function submit(password: string) {
  if (password.length < 8) {
    return setError("Use at least 8 characters.");
  }
  return login(password);
}`;

function CodingPreview() {
  const [isGenerating, setIsGenerating] = useState(true);
  const [extra, setExtra] = useState<string[]>([]);

  return (
    <ThreadPreview
      scrollKey={extra.length + (isGenerating ? 1 : 0)}
      footer={
        <>
          <Plan
            floating
            entries={[
              { content: "Read the form", status: "completed" },
              { content: "Add the length check", status: "completed" },
              { content: "Run tests", status: "completed" },
              {
                content: "Summarize the change",
                status: isGenerating ? "in_progress" : "completed",
              },
            ]}
          />
          <ChatInput
            isGenerating={isGenerating}
            placeholder="Tell the agent what to change…"
            onSubmit={(text) => {
              setExtra((prev) => [...prev, text]);
              setIsGenerating(true);
            }}
            onStop={() => setIsGenerating(false)}
          />
        </>
      }
    >
      <UserMessage content="The login form accepts a 3-character password." />
      <Reasoning
        content="The check never runs before submit. I'll read the form, add a length check, and run the tests."
        duration={3}
      />
      <ToolCall
        toolTitle="Read"
        toolKind="read"
        toolStatus="success"
        defaultExpanded={false}
        toolContent={[{ type: "content", path: "src/LoginForm.tsx", text: LOGIN_BEFORE }]}
      />
      <ToolCall
        toolTitle="Edit"
        toolKind="edit"
        toolStatus="success"
        defaultExpanded={false}
        toolContent={[
          {
            type: "diff",
            path: "src/LoginForm.tsx",
            oldText: LOGIN_BEFORE,
            newText: LOGIN_AFTER,
          },
        ]}
      />
      <ToolCall
        toolTitle="Bash"
        toolStatus="success"
        defaultExpanded={false}
        toolContent={[
          {
            type: "terminal",
            terminalId: "1",
            text: "$ npm test -- LoginForm\n✓ rejects a short password\n\n1 passed",
          },
        ]}
      />
      <AgentMessage
        streaming={isGenerating}
        content="The form now rejects passwords shorter than 8 characters, and the test passes."
      />
      {extra.map((text, index) => (
        <UserMessage key={index} content={text} />
      ))}
    </ThreadPreview>
  );
}

const WORK_DRAFT = `**Q3 status**

- Shipped the new onboarding flow. Activation is up 12%.
- Support volume is flat. Billing retries and a slow export are still open.
- Need a decision on staffing the export fix this sprint.`;

const WORK_OPTIONS = [
  { label: "Leadership channel", value: "leadership" },
  { label: "Just my manager", value: "manager" },
  { label: "Hold for review", value: "hold" },
];

function WorkPreview() {
  const [followUp, setFollowUp] = useState<string | null>(null);
  const [notes, setNotes] = useState<string[]>([]);

  return (
    <ThreadPreview
      scrollKey={(followUp ? 1 : 0) + notes.length}
      footer={
        <ChatInput
          placeholder="Change the tone or the audience…"
          onSubmit={(text) => setNotes((prev) => [...prev, text])}
        />
      }
    >
      <UserMessage
        content="Turn this brief into a status update for leadership."
        attachments={[{ id: "brief", name: "q3-brief.pdf", type: "application/pdf", size: 184320 }]}
      />
      <Plan
        entries={[
          { content: "Read the brief", status: "completed" },
          { content: "Draft the update", status: "completed" },
          {
            content: "Confirm who should see it",
            status: followUp ? "completed" : "in_progress",
          },
        ]}
      />
      <AgentMessage content={WORK_DRAFT} />
      <AgentQuestion
        question="Who should see this?"
        type="single-select"
        options={WORK_OPTIONS}
        onSubmit={(value) => {
          if (value === "hold") {
            setFollowUp("Holding the draft here. Tell me what to change before it goes out.");
            return;
          }
          const label = WORK_OPTIONS.find((option) => option.value === value)?.label ?? value;
          setFollowUp(`I'll send this to ${label}.`);
        }}
        onSkip={() => setFollowUp("Leaving the draft here until you pick an audience.")}
      />
      {followUp ? <AgentMessage content={followUp} /> : null}
      {notes.map((text, index) => (
        <UserMessage key={index} content={text} />
      ))}
    </ThreadPreview>
  );
}

const RESEARCH_ANSWER = `Two things belong in the product itself.

1. **Say that a person is talking to a system.** Put that in the chat, where the conversation starts.
2. **Keep the model paperwork.** If you wrap a general-purpose model, store what the provider gives you and what you changed.

The search and the page are in the trace above. This is a product summary, not legal advice.`;

function ResearchPreview() {
  const [notes, setNotes] = useState<string[]>([]);

  return (
    <ThreadPreview
      scrollKey={notes.length}
      footer={
        <ChatInput
          placeholder="Ask a follow-up…"
          onSubmit={(text) => setNotes((prev) => [...prev, text])}
        />
      }
    >
      <UserMessage content="What do we have to tell users if we ship this chatbot in Europe?" />
      <ToolCall
        toolTitle="Web search"
        toolKind="web_search"
        toolStatus="success"
        defaultExpanded={false}
        toolContent={[
            {
              type: "content",
              text: "Chatbot transparency duties\nDisclosure in the chat, where the conversation starts",
            },
        ]}
      />
      <ToolCall
        toolTitle="Fetch article"
        toolKind="fetch"
        toolStatus="success"
        defaultExpanded={false}
        toolContent={[
          {
            type: "content",
            text: "People have to be told they are interacting with an AI system. The notice belongs in the product, where the conversation starts.",
          },
        ]}
      />
      <AgentMessage content={RESEARCH_ANSWER} />
      {notes.map((text, index) => (
        <UserMessage key={index} content={text} />
      ))}
    </ThreadPreview>
  );
}

export const RECIPES: Recipe[] = [
  {
    slug: "general-chat",
    title: "General chat",
    summary: "A back-and-forth assistant. Messages, images, a streaming reply, and a composer.",
    when: "Use this for a product assistant, a help pane, or any chat that talks. The thread is a list of messages you render yourself. Stream tokens into the latest AgentMessage, turn the composer into stop while the request is open, and pass images to the composer and the sent message with a url so they show as thumbnails. Actions appear once a reply finishes streaming.",
    tryIt: "Rate a reply, copy it, or retry the latest one. Attach an image with the paperclip, remove one before sending, then send it with a message. Stop a reply mid-way, or scroll up and use the jump button to come back.",
    uses: ["UserMessage", "AgentMessage", "ChatInput", "Attachments", "ScrollToBottom"],
    code: GENERAL_CODE,
    Preview: GeneralPreview,
  },
  {
    slug: "coding-agent",
    title: "Coding agent",
    summary: "A turn that thinks, reads a file, edits it, runs a command, and keeps a plan.",
    when: "Use this when the agent changes a codebase and the trace should stay in the thread. Reasoning is the thinking. ToolCall is a read, a diff, or a terminal. Plan with floating sits above the composer for the step that is still running.",
    tryIt: "The composer starts on stop, because the summary is still streaming. Stop ends the turn, and the plan bar tucks away once every step is done. Open the read to see the file the edit came from.",
    uses: ["UserMessage", "Reasoning", "ToolCall", "Plan", "AgentMessage", "ChatInput"],
    code: CODING_CODE,
    Preview: CodingPreview,
  },
  {
    slug: "work-agent",
    title: "Work agent",
    summary: "A document in, a clarifying question, and a draft the user can redirect.",
    when: "Use this for status updates, briefs, and email drafts. The attachment rides on the user message. The plan shows the work. AgentQuestion waits for a decision before the agent sends anything.",
    tryIt: "Pick who should see the update. The question resolves in place, the plan marks that step done, and the agent continues.",
    uses: ["UserMessage", "Plan", "AgentMessage", "AgentQuestion", "ChatInput"],
    code: WORK_CODE,
    Preview: WorkPreview,
  },
  {
    slug: "research-agent",
    title: "Research agent",
    summary: "A search, a fetched page, and an answer that points back at both.",
    when: "Use this when the agent looks things up and the trail is part of the answer. A web search and a fetch are both ToolCall. The written answer comes after them, so a reader can open what the agent actually used.",
    tryIt: "Tool calls start collapsed. Open one to see what the agent searched or read.",
    uses: ["UserMessage", "ToolCall", "AgentMessage", "ChatInput"],
    code: RESEARCH_CODE,
    Preview: ResearchPreview,
  },
];

export function getRecipe(slug: string | undefined): Recipe | undefined {
  return RECIPES.find((recipe) => recipe.slug === slug);
}
