import React from "react";
import { CodeBlock } from "agent-chatbox";

const INSTALL_CMD = "npm install agent-chatbox";

const ASCII_ART = ` █████╗  ██████╗ ███████╗███╗   ██╗████████╗   ██╗  ██╗██╗████████╗
██╔══██╗██╔════╝ ██╔════╝████╗  ██║╚══██╔══╝   ██║ ██╔╝██║╚══██╔══╝
███████║██║  ███╗█████╗  ██╔██╗ ██║   ██║█████╗█████╔╝ ██║   ██║   
██╔══██║██║   ██║██╔══╝  ██║╚██╗██║   ██║╚════╝██╔═██╗ ██║   ██║   
██║  ██║╚██████╔╝███████╗██║ ╚████║   ██║      ██║  ██╗██║   ██║   
╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝   ╚═╝      ╚═╝  ╚═╝╚═╝   ╚═╝   `;

// ============================================================================
// Page
// ============================================================================

export function IntroPage() {
  return (
    <div className="flex h-full w-full flex-col">
      <section className="relative flex h-full flex-col items-center justify-center px-8 py-16">
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
        <div className="relative flex flex-col items-center justify-center">
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

          <div className="mt-8 w-full max-w-md">
            <CodeBlock code={INSTALL_CMD} language="bash" minHeight={0} />
          </div>
        </div>
      </section>
    </div>
  );
}
