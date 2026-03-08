#!/bin/bash
# OpenClaw Framework Interactive Setup Wizard
set -e

WORKSPACE="${OPENCLAW_WORKSPACE:-$HOME/.openclaw/workspace}"
FRAMEWORK_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo ""
echo "🦞 OpenClaw Framework Setup Wizard"
echo "==================================="
echo ""
echo "I'll ask you a few questions to configure your agent."
echo "Press Enter to accept defaults shown in [brackets]."
echo ""

# Helper function
ask() {
  local prompt=$1
  local default=$2
  local var_name=$3
  echo -n "  $prompt [$default]: "
  read -r input
  eval "$var_name=\"${input:-$default}\""
}

ask "Agent name" "MyAgent" AGENT_NAME
ask "Agent emoji" "🤖" AGENT_EMOJI
ask "Your name (the human)" "Human" HUMAN_NAME
ask "Your timezone" "UTC" TIMEZONE
ask "Discord channel ID (for unanswered-check, or skip)" "" DISCORD_CHANNEL_ID
ask "Your Discord user ID (or skip)" "" DISCORD_USER_ID
ask "GitHub repo URL (or skip)" "" GITHUB_REPO

echo ""
echo "📝 Configuring your agent..."

# Fill IDENTITY.md
sed -i "s/YOUR_AGENT_NAME/$AGENT_NAME/g" "${WORKSPACE}/IDENTITY.md" 2>/dev/null || true
sed -i "s/YOUR_EMOJI/$AGENT_EMOJI/g" "${WORKSPACE}/IDENTITY.md" 2>/dev/null || true

# Fill USER.md
sed -i "s/YOUR_NAME/$HUMAN_NAME/g" "${WORKSPACE}/USER.md" 2>/dev/null || true
sed -i "s/YOUR_TIMEZONE/$TIMEZONE/g" "${WORKSPACE}/USER.md" 2>/dev/null || true

# Fill scripts with real IDs
if [ -n "$DISCORD_CHANNEL_ID" ]; then
  for script in "${WORKSPACE}"/scripts/*.mjs; do
    sed -i "s/YOUR_DISCORD_CHANNEL_ID_HERE/$DISCORD_CHANNEL_ID/g" "$script" 2>/dev/null || true
  done
fi

if [ -n "$DISCORD_USER_ID" ]; then
  for script in "${WORKSPACE}"/scripts/*.mjs; do
    sed -i "s/YOUR_DISCORD_USER_ID_HERE/$DISCORD_USER_ID/g" "$script" 2>/dev/null || true
  done
fi

# Set up GitHub
if [ -n "$GITHUB_REPO" ]; then
  cd "${WORKSPACE}"
  git init 2>/dev/null || true
  git remote add origin "$GITHUB_REPO" 2>/dev/null || git remote set-url origin "$GITHUB_REPO"
  echo "  ✅ GitHub remote: $GITHUB_REPO"
fi

echo ""
echo "✅ Agent configured!"
echo ""
echo "  Name:     $AGENT_NAME $AGENT_EMOJI"
echo "  Human:    $HUMAN_NAME ($TIMEZONE)"
if [ -n "$DISCORD_CHANNEL_ID" ]; then
echo "  Discord:  Channel $DISCORD_CHANNEL_ID"
fi
echo ""
echo "Next: Edit SOUL.md to give $AGENT_NAME a personality!"
