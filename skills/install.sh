#!/usr/bin/env bash
# Install the chat-kit skill for one agent, and the npm package when it
# belongs to the current project.
#
#   curl -fsSL https://raw.githubusercontent.com/RamGoel/agent-kit/main/skills/install.sh | bash -s -- cursor
#   curl -fsSL https://raw.githubusercontent.com/RamGoel/agent-kit/main/skills/install.sh | bash -s -- cloud
#   curl -fsSL https://raw.githubusercontent.com/RamGoel/agent-kit/main/skills/install.sh | bash -s -- claude
#   curl -fsSL https://raw.githubusercontent.com/RamGoel/agent-kit/main/skills/install.sh | bash -s -- codex
set -euo pipefail

REPO="${AGENT_KIT_REPO:-RamGoel/agent-kit}"
REF="${AGENT_KIT_REF:-main}"
BASE="${AGENT_KIT_BASE:-https://raw.githubusercontent.com/${REPO}/${REF}}"
TARGET="${1:-cursor}"

case "$TARGET" in
  cursor)
    DEST=".cursor/skills/agent-kit"
    INSTALL_PKG=1
    NOTE="Cursor loads this skill in this project, including Cloud Agents that check out the repo."
    ;;
  cloud)
    DEST="${HOME}/.cursor/skills/agent-kit"
    INSTALL_PKG=0
    NOTE="Installed for every project on this machine. Cloud Agents only see it after you turn on Settings, Agents, Context and Tools, Sync Skills for Cloud Agents. That sync covers ~/.cursor/skills and nothing else."
    ;;
  claude)
    DEST=".claude/skills/agent-kit"
    INSTALL_PKG=1
    NOTE="Claude Code loads this skill in this project. Cursor also reads .claude/skills."
    ;;
  codex)
    DEST=".agents/skills/agent-kit"
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
  echo "Fetching skills/agent-kit/${file}"
  curl -fsSL "${BASE}/skills/agent-kit/${file}" -o "${DEST}/${file}"
done

echo "Installed the chat-kit skill to ${DEST}"
echo "${NOTE}"

if [[ "$INSTALL_PKG" == 1 && -f package.json ]]; then
  echo "Installing the chat-kit package"
  npm install chat-kit
elif [[ "$INSTALL_PKG" == 1 ]]; then
  echo "No package.json here. Run \`npm install chat-kit\` inside your app."
fi
