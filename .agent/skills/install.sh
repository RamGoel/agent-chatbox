#!/usr/bin/env bash
# Install the agent-chatbox skill for one agent, and the npm package when it
# belongs to the current project.
#
#   curl -fsSL https://raw.githubusercontent.com/RamGoel/agent-chatbox/main/.agent/skills/install.sh | bash -s -- cursor
#   curl -fsSL https://raw.githubusercontent.com/RamGoel/agent-chatbox/main/.agent/skills/install.sh | bash -s -- cloud
#   curl -fsSL https://raw.githubusercontent.com/RamGoel/agent-chatbox/main/.agent/skills/install.sh | bash -s -- claude
#   curl -fsSL https://raw.githubusercontent.com/RamGoel/agent-chatbox/main/.agent/skills/install.sh | bash -s -- codex
set -euo pipefail

REPO="${AGENT_CHATBOX_REPO:-RamGoel/agent-chatbox}"
REF="${AGENT_CHATBOX_REF:-main}"
BASE="${AGENT_CHATBOX_BASE:-https://raw.githubusercontent.com/${REPO}/${REF}}"
TARGET="${1:-cursor}"

case "$TARGET" in
  cursor)
    DEST=".cursor/skills/agent-chatbox"
    INSTALL_PKG=1
    NOTE="Cursor loads this skill in this project, including Cloud Agents that check out the repo."
    ;;
  cloud)
    DEST="${HOME}/.cursor/skills/agent-chatbox"
    INSTALL_PKG=0
    NOTE="Installed for every project on this machine. Cloud Agents only see it after you turn on Settings, Agents, Context and Tools, Sync Skills for Cloud Agents. That sync covers ~/.cursor/skills and nothing else."
    ;;
  claude)
    DEST=".claude/skills/agent-chatbox"
    INSTALL_PKG=1
    NOTE="Claude Code loads this skill in this project. Cursor also reads .claude/skills."
    ;;
  codex)
    DEST=".agents/skills/agent-chatbox"
    INSTALL_PKG=1
    NOTE="Codex loads this skill in this project. Cursor also reads .agents/skills."
    ;;
  *)
    echo "Unknown target: ${TARGET}" >&2
    echo "Use one of: cursor, cloud, claude, codex" >&2
    exit 1
    ;;
esac

mkdir -p "$DEST"
for file in SKILL.md reference.md; do
  echo "Fetching .agent/skills/agent-chatbox/${file}"
  curl -fsSL "${BASE}/.agent/skills/agent-chatbox/${file}" -o "${DEST}/${file}"
done

echo "Installed the agent-chatbox skill to ${DEST}"
echo "${NOTE}"

if [[ "$INSTALL_PKG" == 1 && -f package.json ]]; then
  echo "Installing the agent-chatbox package"
  npm install agent-chatbox
elif [[ "$INSTALL_PKG" == 1 ]]; then
  echo "No package.json here. Run \`npm install agent-chatbox\` inside your app."
fi
