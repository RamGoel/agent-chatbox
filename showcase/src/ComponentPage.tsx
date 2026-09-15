import { useState, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import { getComponent } from "./registry";


function PageContent({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex w-full flex-col gap-20 p-12"
      style={{ maxWidth: 900, width: "100%", margin: "0 auto", paddingTop: 80 }}
    >
      {children}
    </div>
  );
}

// ============================================================================
// Code block — simple syntax-highlighted look
// ============================================================================

function CodeSnippet({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto bg-[#24292e] px-4 py-3 font-mono text-sm leading-relaxed text-[#e1e4e8]">
      <code>{code}</code>
    </pre>
  );
}

// ============================================================================
// Story card — preview + collapsible code
// ============================================================================

function StoryCard({
  name,
  description,
  code,
  children,
}: {
  name: string;
  description?: string;
  code?: string;
  children: ReactNode;
}) {
  const [showCode, setShowCode] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      {/* Name + description */}
      <div className="flex flex-col gap-1 px-2">
        <h2 className="text-base font-semibold text-ak-content">
          {name}
        </h2>
        {description && (
          <p className="text-sm text-ak-content-tertiary">{description}</p>
        )}
      </div>

      {/* Preview + code */}
      <div className="flex flex-col overflow-hidden rounded-lg border border-ak-border">
        {/* Preview */}
        <div className="flex w-full items-center justify-center p-8" style={{ minHeight: 120 }}>
          {children}
        </div>

        {/* Code */}
        {code && (
          <div className="relative overflow-hidden">
            <div style={{ maxHeight: showCode ? undefined : 72, overflow: "hidden" }}>
              <CodeSnippet code={code} />
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

// ============================================================================
// Page — generic, driven by registry
// ============================================================================

export function ComponentPage() {
  const { slug } = useParams<{ slug: string }>();
  const config = slug ? getComponent(slug) : undefined;

  if (!config) {
    return (
      <>
        <PageContent>
          <p className="text-base text-ak-content-secondary">
            Component "{slug}" not found in registry.
          </p>
        </PageContent>
      </>
    );
  }

  return (
    <>
      <PageContent>
        {/* Title + description */}
        <div className="flex flex-col gap-3 px-2">
          <h1 className="text-2xl font-bold text-ak-content">{config.title}</h1>
          <p className="text-base text-ak-content-secondary">{config.description}</p>
        </div>

        {/* Stories */}
        {config.stories.map((story) => (
          <StoryCard
            key={story.name}
            name={story.name}
            description={story.description}
            code={story.code}
          >
            {story.render()}
          </StoryCard>
        ))}
      </PageContent>
    </>
  );
}
