import { CodeBlock } from "agent-kit";

const INSTALL = `# Cursor, this project. Cloud Agents that check out the repo get it too.
curl -fsSL https://raw.githubusercontent.com/RamGoel/agent-kit/main/skills/install.sh | bash -s -- cursor

# Every project on this machine. Then turn on Settings → Agents → Sync Skills for Cloud Agents.
curl -fsSL https://raw.githubusercontent.com/RamGoel/agent-kit/main/skills/install.sh | bash -s -- cloud

# Claude Code, this project
curl -fsSL https://raw.githubusercontent.com/RamGoel/agent-kit/main/skills/install.sh | bash -s -- claude

# Codex, this project
curl -fsSL https://raw.githubusercontent.com/RamGoel/agent-kit/main/skills/install.sh | bash -s -- codex`;

const PROMPT =
  "Add a chat thread with agent-kit. Include a user message, a tool call, and a stop button while the reply is streaming.";

const HELPS = [
  "Imports agent-kit/styles.css, so the components are styled.",
  "Gives Conversation a parent with a height, so the thread is visible.",
  "Renders AgentQuestion beside the thread, because Conversation ignores a question field on a message.",
  "Passes a language to CodeBlock, so code is highlighted instead of plain text.",
  "Themes with --ak-* variables loaded after the stylesheet, not with Tailwind or inline overrides.",
];

export function SkillsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-8 py-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-medium text-ak-content">Skills</h1>
        <p className="text-sm text-ak-content-secondary">
          Install the agent-kit package and a skill in one command. The skill teaches your coding agent the component API, the message shape, and how theming works, so it builds chats with these components instead of inventing its own.
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-ak-content">What is a skill?</h2>
        <p className="text-sm text-ak-content-secondary">
          A skill is a markdown file that your coding agent reads before it writes code. It sits in your project, and it describes how a library is meant to be used. Without one, the agent guesses from the package name and often produces code that compiles but renders wrong. With one, it follows the documented pattern.
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-ak-content">Install</h2>
        <p className="text-sm text-ak-content-secondary">
          Run one of these from your app's root. The comment on each line says where the skill is installed. Project commands also run <code className="rounded bg-ak-surface-hover px-1 text-xs">npm install agent-kit</code> when a <code className="rounded bg-ak-surface-hover px-1 text-xs">package.json</code> is present.
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
            A project skill your agent loads when you ask for a chat UI, agent transcript, tool calls, or reasoning display.
          </li>
        </ul>
      </div>

      <div className="mt-10 flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-ak-content">How it helps</h2>
        <p className="text-sm text-ak-content-secondary">
          The skill is written to prevent the mistakes that most often break an agent chat:
        </p>
        <ul className="flex list-disc flex-col gap-1.5 pl-5 text-sm text-ak-content-secondary">
          {HELPS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="mt-10 flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-ak-content">When it runs</h2>
        <p className="text-sm text-ak-content-secondary">
          Your agent loads the skill on its own when your request is about a chat UI, an agent transcript, tool calls, a reasoning trace, or a plan. In Cursor you can also type <code className="rounded bg-ak-surface-hover px-1 text-xs">/agent-kit</code> to attach it to one message.
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-ak-content">Try it</h2>
        <p className="text-sm text-ak-content-secondary">
          After installing, paste this into your agent:
        </p>
        <CodeBlock code={PROMPT} language="text" minHeight={0} />
      </div>
    </div>
  );
}
