import React, { useState } from "react";
import { ChatInput } from "agent-kit";

const INSTALL_CMD = "npm install agent-kit";

const ASCII_ART = ` █████╗  ██████╗ ███████╗███╗   ██╗████████╗   ██╗  ██╗██╗████████╗
██╔══██╗██╔════╝ ██╔════╝████╗  ██║╚══██╔══╝   ██║ ██╔╝██║╚══██╔══╝
███████║██║  ███╗█████╗  ██╔██╗ ██║   ██║█████╗█████╔╝ ██║   ██║   
██╔══██║██║   ██║██╔══╝  ██║╚██╗██║   ██║╚════╝██╔═██╗ ██║   ██║   
██║  ██║╚██████╔╝███████╗██║ ╚████║   ██║      ██║  ██╗██║   ██║   
╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝   ╚═╝      ╚═╝  ╚═╝╚═╝   ╚═╝   `;

// ============================================================================
// Bento card
// ============================================================================

function BentoCard({
  children,
  span,
}: {
  children: React.ReactNode;
  span?: string;
}) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl border border-ak-border bg-ak-surface p-6 ${span ?? ""}`}
    >
      {children}
    </div>
  );
}

// ============================================================================
// Chat preview — live interactive demo
// ============================================================================

function ChatPreview() {
  const [messages, setMessages] = React.useState<
    { role: "user" | "agent"; text: string }[]
  >([
    { role: "user", text: "Can you deploy the staging environment?" },
    {
      role: "agent",
      text: "Sure — deploying to staging now. I'll build the image, run the migration, and verify health checks.",
    },
  ]);
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleSubmit = (value: string) => {
    setMessages((prev) => [...prev, { role: "user", text: value }]);
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setMessages((prev) => [
        ...prev,
        { role: "agent", text: `Done. I've processed your request: "${value}"` },
      ]);
    }, 1500);
  };

  return (
    <BentoCard span="md:row-span-2">
      <div className="flex h-full flex-col gap-4">
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto">
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
    </BentoCard>
  );
}

// ============================================================================
// Feature cards
// ============================================================================

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <BentoCard>
      <h3 className="text-base font-semibold text-ak-content">{title}</h3>
      <p className="mt-1.5 text-sm text-ak-content-secondary">{description}</p>
    </BentoCard>
  );
}

// ============================================================================
// Install command with copy
// ============================================================================

function InstallCommand() {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(INSTALL_CMD);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="mt-8 flex w-full max-w-md items-center gap-3 rounded-lg border border-ak-border bg-ak-surface px-4 py-3 text-left transition-colors hover:border-ak-border-hover"
    >
      <span className="text-ak-content-tertiary">$</span>
      <code className="flex-1 font-mono text-sm text-ak-content">
        {INSTALL_CMD}
      </code>
      <span className="text-xs text-ak-content-tertiary">
        {copied ? "Copied!" : "Click to copy"}
      </span>
    </button>
  );
}

// ============================================================================
// Page
// ============================================================================

export function IntroPage() {
  return (
    <div className="flex w-full flex-col">
      <section className="relative flex flex-col items-center px-8 py-16">
        {/* Gradient beam */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(45deg, transparent 35%, rgba(99,102,241,0.2) 42%, rgba(239,68,68,0.15) 50%, rgba(255,255,255,0.1) 58%, rgba(99,102,241,0.1) 66%, transparent 82%)",
            WebkitMaskImage:
              "linear-gradient(45deg, transparent 0%, black 30%, black 70%, transparent 92%)",
            maskImage:
              "linear-gradient(45deg, transparent 0%, black 30%, black 70%, transparent 92%)",
            filter: "blur(6px)",
          }}
        />

        {/* Hero */}
        <div
          className="relative flex flex-col items-center justify-center py-16"
          style={{ minHeight: "calc(100vh - 450px)" }}
        >
          <pre
            className="font-mono text-ak-content overflow-x-auto select-none"
            style={{
              fontSize: "clamp(0.35rem, 2.3vw, 1.1rem)",
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            {ASCII_ART}
          </pre>

          <p className="mt-6 max-w-lg text-center text-lg text-ak-content-secondary">
            React components for building AI agent chat interfaces.
            Independent, themeable, zero-config.
          </p>

          <InstallCommand />
        </div>

        {/* Bento grid */}
        <div
          className="grid w-full max-w-4xl grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3"
        >
          <ChatPreview />
          <FeatureCard
            title="Standalone"
            description="No design system dependency. Ships its own theming via CSS variables."
          />
          <FeatureCard
            title="Tree-shakeable"
            description="Import only what you need. Each component is independently exported."
          />
          <FeatureCard
            title="Dark mode"
            description="Built-in dark theme via .dark class. Override any color with CSS variables."
          />
          <FeatureCard
            title="TypeScript"
            description="Full type definitions included. Strict types for all props and callbacks."
          />
        </div>
      </section>
    </div>
  );
}
