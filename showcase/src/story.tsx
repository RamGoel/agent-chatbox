import { useState, type ReactNode } from "react";
import { CodeBlock } from "agent-chatbox";

export function PageContent({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex w-full flex-col gap-20 p-12"
      style={{ maxWidth: 900, width: "100%", margin: "0 auto", paddingTop: 80 }}
    >
      {children}
    </div>
  );
}

export function StoryCard({
  name,
  description,
  code,
  language = "tsx",
  children,
}: {
  name: string;
  description?: string;
  code?: string;
  language?: string;
  children: ReactNode;
}) {
  const [showCode, setShowCode] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1 px-2">
        <h2 className="text-base font-semibold text-ak-content">{name}</h2>
        {description && <p className="text-sm text-ak-content-tertiary">{description}</p>}
      </div>

      <div className="flex flex-col overflow-hidden rounded-lg border border-ak-border">
        <div className="flex w-full items-center justify-center p-8" style={{ minHeight: 120 }}>
          {children}
        </div>

        {code && (
          <div className="relative overflow-hidden">
            <div style={{ maxHeight: showCode ? undefined : 72, overflow: "hidden" }}>
              <CodeBlock code={code} language={language} noBorder noCopy={!showCode} minHeight={0} />
            </div>
            {!showCode && (
              <div
                className="flex cursor-pointer items-center justify-center"
                onClick={() => setShowCode(true)}
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to bottom, rgba(36,41,46,0) 0%, rgba(36,41,46,0.9) 50%, #24292e 100%)",
                }}
              >
                <button
                  className="rounded-md border border-ak-border bg-ak-surface px-3 py-1.5 text-sm text-ak-content-secondary transition-colors hover:text-ak-content"
                  onClick={() => setShowCode(true)}
                >
                  View Code
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
