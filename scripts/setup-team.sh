#!/bin/bash
# setup-team.sh — Bootstrap all specialist agent workspaces
set -e

WORKSPACE="${OPENCLAW_WORKSPACE:-$HOME/.openclaw/workspace}"
PERSONAS="$WORKSPACE/personas"

echo "🦞 Team Setup"
echo "============="
echo ""

setup_agent() {
  local agent=$1
  local persona=$2
  local role=$3
  local ws="$HOME/.openclaw/workspace-$agent"

  mkdir -p "$ws/brain" "$ws/memory"

  # Copy framework files
  [ -f "$WORKSPACE/AGENTS.md" ] && cp "$WORKSPACE/AGENTS.md" "$ws/"
  [ -f "$WORKSPACE/HEARTBEAT.md" ] && cp "$WORKSPACE/HEARTBEAT.md" "$ws/"

  # Copy persona as SOUL
  if [ -f "$PERSONAS/${persona}.md" ]; then
    cp "$PERSONAS/${persona}.md" "$ws/SOUL.md"
  elif [ -f "$WORKSPACE/SOUL.md" ]; then
    cp "$WORKSPACE/SOUL.md" "$ws/SOUL.md"
  fi

  # Create IDENTITY
  cat > "$ws/IDENTITY.md" << EOF
# IDENTITY.md
- Name: ${agent^}
- Role: $role
- Workspace: $ws
EOF

  # Create empty MEMORY
  cat > "$ws/MEMORY.md" << EOF
# MEMORY.md — ${agent^}
_Long-term memory for ${agent^} agent. Updated over time._
EOF

  echo "  ✅ $agent → $ws"
}

echo "Creating specialist workspaces:"
setup_agent "forge" "dev-agent" "Senior Engineer — code, scripts, builds"
setup_agent "scout" "personal-assistant" "Research & Intelligence"
setup_agent "nova" "team-manager" "Project Manager — sprints, standups, Linear"
setup_agent "ops" "dev-agent" "Infrastructure & Monitoring"
setup_agent "aria" "personal-assistant" "CEO & Architect — strategy, big decisions"

echo ""
echo "✅ Team ready!"
echo ""
echo "Next: Update openclaw.json with the multi-agent config."
echo "See config/openclaw.multi-agent.example.json for the template."
