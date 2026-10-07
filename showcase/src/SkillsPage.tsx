import { useState } from "react";
import { CodeBlock } from "agent-kit";

const BASE =
  "curl -fsSL https://raw.githubusercontent.com/RamGoel/agent-kit/main/skills/install.sh | bash -s --";

type Target = "cursor" | "cloud" | "claude" | "codex";

const TARGETS: { id: Target; label: string; detail: string; blurb: string }[] = [
  {
    id: "cursor",
    label: "Add to Cursor",
    detail: ".cursor/skills",
    blurb:
      "Installs the skill into this project and runs npm install agent-kit when a package.json is here. Cloud Agents that check out the repo get the skill too.",
  },
  {
    id: "cloud",
    label: "Add to Cloud",
    detail: "~/.cursor/skills",
    blurb:
      "Installs the skill for every project on this machine. Cloud Agents pick it up after you turn on Settings → Agents → Sync Skills for Cloud Agents. Only ~/.cursor/skills syncs.",
  },
  {
    id: "claude",
    label: "Add to Claude",
    detail: ".claude/skills",
    blurb:
      "Installs the skill where Claude Code looks, in this project, and installs the npm package when a package.json is here. Cursor reads this directory too.",
  },
  {
    id: "codex",
    label: "Add to Codex",
    detail: ".agents/skills",
    blurb:
      "Installs the skill where Codex looks, in this project, and installs the npm package when a package.json is here. Cursor reads this directory too.",
  },
];

export function SkillsPage() {
  const [target, setTarget] = useState<Target>("cursor");
  const current = TARGETS.find((item) => item.id === target) ?? TARGETS[0];

  return (
    <div className="mx-auto w-full max-w-3xl px-8 py-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-medium text-ak-content">Skills</h1>
        <p className="text-sm text-ak-content-secondary">
          One command installs a skill that knows the agent-kit API, so your coding agent builds chats with these components. Pick where it should live.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {TARGETS.map((item) => {
          const active = item.id === target;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTarget(item.id)}
              aria-pressed={active}
              className={`flex flex-col gap-0.5 rounded-xl border px-3 py-2.5 text-left transition-colors ${
                active
                  ? "border-ak-primary bg-ak-surface-hover"
                  : "border-ak-border bg-ak-surface hover:border-ak-border-hover"
              }`}
            >
              <span className={`text-sm font-medium ${active ? "text-ak-content" : "text-ak-content-secondary"}`}>
                {item.label}
              </span>
              <span className="font-mono text-[11px] text-ak-content-tertiary">{item.detail}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <p className="text-sm text-ak-content-secondary">{current.blurb}</p>
        <CodeBlock code={`${BASE} ${current.id}`} language="bash" minHeight={0} />
        <p className="text-xs text-ak-content-tertiary">Run it from your app's root.</p>
      </div>
    </div>
  );
}
