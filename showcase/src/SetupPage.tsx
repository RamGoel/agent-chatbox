import React, { useState } from "react";
import { CodeBlock } from "agent-chatbox";
import { Check, Palette, Package, Terminal } from "lucide-react";

// ============================================================================
// Tabs
// ============================================================================

type Tab = "standalone" | "existing";

function TabButton({
  active,
  onClick,
  icon,
  label,
  description,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  description: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 flex-col gap-1 rounded-xl border p-4 text-left transition-colors ${
        active
          ? "border-ak-primary bg-ak-surface-hover"
          : "border-ak-border bg-ak-surface hover:border-ak-border-hover"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className={active ? "text-ak-content" : "text-ak-content-secondary"}>
          {icon}
        </span>
        <span className={`text-sm font-medium ${active ? "text-ak-content" : "text-ak-content-secondary"}`}>
          {label}
        </span>
      </div>
      <span className="text-xs text-ak-content-tertiary">{description}</span>
    </button>
  );
}

// ============================================================================
// Step
// ============================================================================

function Step({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2.5">
        <span className="flex size-6 items-center justify-center rounded-full bg-ak-primary text-xs font-semibold text-ak-primary-content">
          {number}
        </span>
        <h3 className="text-sm font-semibold text-ak-content">{title}</h3>
      </div>
      <div className="ml-8.5 flex flex-col gap-3">{children}</div>
    </div>
  );
}

// ============================================================================
// Code snippet helper
// ============================================================================

function Snippet({ code, language = "bash" }: { code: string; language?: string }) {
  return <CodeBlock code={code} language={language} minHeight={0} />;
}

// ============================================================================
// Standalone setup
// ============================================================================

function StandaloneSetup() {
  return (
    <div className="flex flex-col gap-8">
      <Step number={1} title="Install the package">
        <p className="text-sm text-ak-content-secondary">
          agent-chatbox ships with its own theming via CSS variables — no external design system required.
        </p>
        <Snippet code="npm install agent-chatbox" />
      </Step>

      <Step number={2} title="Import the styles">
        <p className="text-sm text-ak-content-secondary">
          Import the stylesheet once in your app entry point. It contains the precompiled component styles and the default theme, and only affects agent-chatbox components.
        </p>
        <Snippet
          language="tsx"
          code={`import "agent-chatbox/styles.css";`}
        />
      </Step>

      <Step number={3} title="Use any component">
        <p className="text-sm text-ak-content-secondary">
          All components work out of the box with sensible defaults.
        </p>
        <Snippet
          language="tsx"
          code={`import { AgentMessage, ChatInput, UserMessage } from "agent-chatbox";

function App() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: 600 }}>
      <UserMessage content="Deploy staging." />
      <AgentMessage content="Deployed to staging." />
      <ChatInput onSubmit={handleSubmit} />
    </div>
  );
}`}
        />
      </Step>

      <Step number={4} title="Customize the theme (optional)">
        <p className="text-sm text-ak-content-secondary">
          Override any CSS variable to match your brand. Dark mode is built in via the <code className="rounded bg-ak-surface-hover px-1 text-xs">.dark</code> class.
        </p>
        <Snippet
          language="css"
          code={`:root {
  --ak-primary: #6366f1;
  --ak-primary-hover: #4f46e5;
  --ak-primary-content: #ffffff;
  --ak-border: #e4e4e7;
  --ak-surface: #ffffff;
  --ak-surface-hover: #f4f4f5;
  --ak-content: #18181b;
  --ak-content-secondary: #52525b;
  --ak-content-tertiary: #a1a1aa;
}

.dark {
  --ak-primary: #818cf8;
  --ak-surface: #18181b;
  --ak-content: #fafafa;
  /* ... */
}`}
        />
      </Step>
    </div>
  );
}

// ============================================================================
// Existing design system setup
// ============================================================================

function ExistingDesignSystemSetup() {
  return (
    <div className="flex flex-col gap-8">
      <Step number={1} title="Install the package">
        <Snippet code="npm install agent-chatbox" />
      </Step>

      <Step number={2} title="Map CSS variables to your design tokens">
        <p className="text-sm text-ak-content-secondary">
          agent-chatbox uses a flat set of <code className="rounded bg-ak-surface-hover px-1 text-xs">--ak-*</code> CSS variables. Point them at your existing design system tokens so components blend in seamlessly.
        </p>
        <Snippet
          language="css"
          code={`/* Map agent-chatbox variables to your design system */
:root {
  --ak-border: var(--your-border-color);
  --ak-border-hover: var(--your-border-hover);
  --ak-surface: var(--your-bg);
  --ak-surface-hover: var(--your-bg-subtle);
  --ak-surface-active: var(--your-bg-muted);
  --ak-primary: var(--your-brand);
  --ak-primary-hover: var(--your-brand-hover);
  --ak-primary-content: var(--your-brand-fg);
  --ak-danger: var(--your-danger);
  --ak-danger-hover: var(--your-danger-hover);
  --ak-content: var(--your-text);
  --ak-content-secondary: var(--your-text-muted);
  --ak-content-tertiary: var(--your-text-subtle);
  --ak-code-surface: var(--your-code-bg);
  --ak-code-content: var(--your-code-fg);
  --ak-font-sans: var(--your-font-sans);
  --ak-font-mono: var(--your-font-mono);
}`}
        />
      </Step>

      <Step number={3} title="Import the stylesheet before your tokens">
        <p className="text-sm text-ak-content-secondary">
          Import <code className="rounded bg-ak-surface-hover px-1 text-xs">agent-chatbox/styles.css</code> for the component styles, then load your variable mappings after it so they take precedence over the defaults. It doesn't reset or restyle anything outside agent-chatbox components.
        </p>
        <div className="flex items-center gap-2 rounded-lg border border-ak-border bg-ak-surface-hover px-3 py-2">
          <Check size={14} className="text-green-600" />
          <span className="text-xs text-ak-content-secondary">
            Components read CSS variables at runtime — no JS theming layer needed.
          </span>
        </div>
      </Step>

      <Step number={4} title="Use components normally">
        <p className="text-sm text-ak-content-secondary">
          Everything inherits your design system's colors, fonts, and spacing automatically.
        </p>
        <Snippet
          language="tsx"
          code={`import { AgentMessage, ChatInput, UserMessage } from "agent-chatbox";
import "agent-chatbox/styles.css";
import "./design-tokens.css"; // your --ak-* mappings

function App() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: 600 }}>
      <UserMessage content="Deploy staging." />
      <AgentMessage content="Deployed to staging." />
      <ChatInput onSubmit={handleSubmit} />
    </div>
  );
}`}
        />
      </Step>

      <Step number={5} title="Override individual components (optional)">
        <p className="text-sm text-ak-content-secondary">
          Every component accepts a <code className="rounded bg-ak-surface-hover px-1 text-xs">className</code> prop. Use it for one-off adjustments without ejecting from the system.
        </p>
        <Snippet
          language="tsx"
          code={`import { ChatInput } from "agent-chatbox";

<ChatInput
  className="rounded-full"
  placeholder="Ask anything…"
/>`}
        />
      </Step>
    </div>
  );
}

// ============================================================================
// Page
// ============================================================================

export function SetupPage() {
  const [tab, setTab] = useState<Tab>("standalone");

  return (
    <div className="mx-auto w-full max-w-3xl px-8 py-12">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-medium text-ak-content">Setup</h1>
        <p className="text-sm text-ak-content-secondary">
          Get started with agent-chatbox in two ways — use it standalone with the built-in theme, or integrate it with your existing design system.
        </p>
      </div>

      {/* Tabs */}
      <div className="mt-8 flex gap-3">
        <TabButton
          active={tab === "standalone"}
          onClick={() => setTab("standalone")}
          icon={<Package size={18} />}
          label="Use as-is"
          description="Built-in theme, zero config"
        />
        <TabButton
          active={tab === "existing"}
          onClick={() => setTab("existing")}
          icon={<Palette size={18} />}
          label="Existing design system"
          description="Map CSS variables to your tokens"
        />
      </div>

      {/* Content */}
      <div className="mt-10">
        {tab === "standalone" ? <StandaloneSetup /> : <ExistingDesignSystemSetup />}
      </div>
    </div>
  );
}
