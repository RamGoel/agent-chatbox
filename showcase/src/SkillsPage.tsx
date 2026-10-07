import { CodeBlock } from "agent-kit";

const INSTALL =
  "curl -fsSL https://raw.githubusercontent.com/RamGoel/agent-kit/main/skills/install.sh | bash";

export function SkillsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-8 py-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-medium text-ak-content">Skills</h1>
        <p className="text-sm text-ak-content-secondary">
          Install the agent-kit package and a Cursor skill in one command. The skill teaches your coding agent the component API, the message shape, and how theming works, so it builds chats with these components instead of inventing its own.
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-ak-content">Install</h2>
        <p className="text-sm text-ak-content-secondary">
          Run this from your app's root. It copies the skill to <code className="rounded bg-ak-surface-hover px-1 text-xs">.cursor/skills/agent-kit</code> and runs <code className="rounded bg-ak-surface-hover px-1 text-xs">npm install agent-kit</code> when a <code className="rounded bg-ak-surface-hover px-1 text-xs">package.json</code> is present.
        </p>
        <CodeBlock code={INSTALL} language="bash" minHeight={0} />
      </div>

      <div className="mt-10 flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-ak-content">What you get</h2>
        <ul className="flex list-disc flex-col gap-1.5 pl-5 text-sm text-ak-content-secondary">
          <li>
            <span className="font-medium text-ak-content">agent-kit</span> added to your dependencies, plus the stylesheet import your agent is told to keep.
          </li>
          <li>
            A project skill Cursor loads when you ask for a chat UI, agent transcript, tool calls, or reasoning display.
          </li>
        </ul>
      </div>
    </div>
  );
}
