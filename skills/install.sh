#!/usr/bin/env bash
# Install agent-kit and its Cursor skill into the current project.
#   curl -fsSL https://raw.githubusercontent.com/RamGoel/agent-kit/main/skills/install.sh | bash
set -euo pipefail

REPO="${AGENT_KIT_REPO:-RamGoel/agent-kit}"
REF="${AGENT_KIT_REF:-main}"
BASE="${AGENT_KIT_BASE:-https://raw.githubusercontent.com/${REPO}/${REF}}"

DEST=".cursor/skills/agent-kit"
mkdir -p "$DEST"

for file in SKILL.md reference.md; do
  echo "Fetching skills/agent-kit/${file}"
  curl -fsSL "${BASE}/skills/agent-kit/${file}" -o "${DEST}/${file}"
done

echo "Installed the agent-kit skill to ${DEST}"

if [[ -f package.json ]]; then
  echo "Installing the agent-kit package"
  npm install agent-kit
else
  echo "No package.json here. The skill is installed; run \`npm install agent-kit\` inside your app."
fi
