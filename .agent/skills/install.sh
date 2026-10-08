#!/usr/bin/env bash
# Install the agent-chatbox skill into agent/skills, and the npm package when
# the current directory has a package.json.
#
#   curl -fsSL https://raw.githubusercontent.com/RamGoel/agent-chatbox/main/.agent/skills/install.sh | bash
set -euo pipefail

REPO="${AGENT_CHATBOX_REPO:-RamGoel/agent-chatbox}"
REF="${AGENT_CHATBOX_REF:-main}"
BASE="${AGENT_CHATBOX_BASE:-https://raw.githubusercontent.com/${REPO}/${REF}}"
DEST="agent/skills/agent-chatbox"

mkdir -p "$DEST"
for file in SKILL.md reference.md; do
  echo "Fetching .agent/skills/agent-chatbox/${file}"
  curl -fsSL "${BASE}/.agent/skills/agent-chatbox/${file}" -o "${DEST}/${file}"
done

echo "Installed the agent-chatbox skill to ${DEST}"

if [[ -f package.json ]]; then
  echo "Installing the agent-chatbox package"
  npm install agent-chatbox
else
  echo "No package.json here. Run \`npm install agent-chatbox\` inside your app."
fi
