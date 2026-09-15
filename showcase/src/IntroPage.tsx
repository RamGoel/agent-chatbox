import React, { useState } from "react";

const INSTALL_CMD = "npm install agent-kit";

const ASCII_ART = ` █████╗  ██████╗ ███████╗███╗   ██╗████████╗   ██╗  ██╗██╗████████╗
██╔══██╗██╔════╝ ██╔════╝████╗  ██║╚══██╔══╝   ██║ ██╔╝██║╚══██╔══╝
███████║██║  ███╗█████╗  ██╔██╗ ██║   ██║█████╗█████╔╝ ██║   ██║   
██╔══██║██║   ██║██╔══╝  ██║╚██╗██║   ██║╚════╝██╔═██╗ ██║   ██║   
██║  ██║╚██████╔╝███████╗██║ ╚████║   ██║      ██║  ██╗██║   ██║   
╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝   ╚═╝      ╚═╝  ╚═╝╚═╝   ╚═╝   `;

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

      </section>
    </div>
  );
}
