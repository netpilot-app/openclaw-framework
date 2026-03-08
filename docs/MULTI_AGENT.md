# Multi-Agent Setup Guide

> Set up a team of specialist agents — like Paperclip's Aria, Atlas, Nova, Scout, Forge, Ops.

## The Pattern

One **main agent** orchestrates. Specialist agents do the work in isolated sessions.

```
Main Agent (you talk to this one)
├── Forge 🔨 — code, builds, scripts
├── Scout 🔍 — research, analysis
├── Nova 📋 — project management
└── Ops ⚙️ — infrastructure, monitoring
```

Why it works:
- Each agent has its own context window (no cross-contamination)
- Specialists can run different models (cheap model for coding, powerful for strategy)
- Main agent stays clean — dispatches work, relays results

## Quick Start: 2-Agent Setup (Main + Forge)

### Step 1: Configure agents in openclaw.json

```json
{
  "agents": {
    "defaults": {
      "model": "anthropic/claude-sonnet-4-6",
      "workspace": "~/.openclaw/workspace"
    },
    "list": [
      {
        "id": "main",
        "name": "Main Agent",
        "workspace": "~/.openclaw/workspace"
      },
      {
        "id": "forge",
        "name": "Forge",
        "model": "kimi-coding/k2p5",
        "workspace": "~/.openclaw/workspace-forge"
      }
    ]
  }
}
```

### Step 2: Create Forge's workspace

```bash
mkdir -p ~/.openclaw/workspace-forge
cp ~/.openclaw/workspace/personas/dev-agent.md ~/.openclaw/workspace-forge/SOUL.md
cp ~/.openclaw/workspace/AGENTS.md ~/.openclaw/workspace-forge/AGENTS.md

cat > ~/.openclaw/workspace-forge/IDENTITY.md << 'EOF'
# IDENTITY.md
- Name: Forge
- Emoji: 🔨
- Role: Senior Engineer
- Specialty: Code, builds, scripts, infrastructure
EOF
```

### Step 3: Main agent dispatches to Forge

The main agent spawns Forge as a subagent for coding tasks:

> **The subagent rule:** If a task involves code, 3+ file reads, or heavy output → spawn a subagent.

## Full Team Setup (Paperclip-Style)

### Team Roles

| Agent | Model | Specialty |
|-------|-------|-----------|
| **main** | Sonnet | Orchestration, conversation, routing |
| **forge** | Kimi K2 (cheap!) | Code, scripts, builds |
| **scout** | Sonnet | Research, web search, analysis |
| **nova** | Sonnet | Project management, Linear, standups |
| **ops** | Sonnet | Infrastructure, monitoring, health |
| **aria** | Opus | Strategy, architecture, big decisions |

Cost tip: Use Kimi K2 (`kimi-coding/k2p5`) for Forge — it's 100x cheaper than Opus for coding tasks.

### openclaw.json for full team

```json
{
  "agents": {
    "defaults": {
      "model": "anthropic/claude-sonnet-4-6",
      "thinking": { "default": "adaptive" }
    },
    "list": [
      { "id": "main", "workspace": "~/.openclaw/workspace" },
      { "id": "forge", "model": "kimi-coding/k2p5", "workspace": "~/.openclaw/workspace-forge" },
      { "id": "scout", "workspace": "~/.openclaw/workspace-scout" },
      { "id": "nova", "workspace": "~/.openclaw/workspace-nova" },
      { "id": "ops", "workspace": "~/.openclaw/workspace-ops" },
      { "id": "aria", "model": "anthropic/claude-opus-4-6", "workspace": "~/.openclaw/workspace-aria" }
    ]
  }
}
```

### Channel bindings (route different Discord channels to different agents)

```json
{
  "channels": {
    "discord": {
      "token": "${DISCORD_BOT_TOKEN}",
      "bindings": [
        { "channelId": "MAIN_CHANNEL_ID", "agentId": "main" },
        { "channelId": "FORGE_CHANNEL_ID", "agentId": "forge" },
        { "channelId": "ARIA_CHANNEL_ID", "agentId": "aria" }
      ]
    }
  }
}
```

## Workspace Setup Script

```bash
#!/bin/bash
# setup-team.sh — set up all agent workspaces

WORKSPACE="$HOME/.openclaw/workspace"
PERSONAS="$WORKSPACE/personas"

agents=("forge:dev-agent" "scout:personal-assistant" "nova:team-manager" "ops:dev-agent" "aria:personal-assistant")

for agent_def in "${agents[@]}"; do
  agent="${agent_def%%:*}"
  persona="${agent_def##*:}"
  ws="$HOME/.openclaw/workspace-$agent"

  mkdir -p "$ws/brain" "$ws/memory"
  cp "$WORKSPACE/AGENTS.md" "$ws/"
  cp "$WORKSPACE/HEARTBEAT.md" "$ws/"
  cp "$PERSONAS/${persona}.md" "$ws/SOUL.md" 2>/dev/null || cp "$WORKSPACE/SOUL.md" "$ws/"

  cat > "$ws/IDENTITY.md" << EOF
# IDENTITY.md
- Name: $(echo $agent | sed 's/./\U&/')
- Role: Specialist Agent ($agent)
EOF

  echo "✅ Created workspace: $ws"
done
```

## How Main Agent Dispatches Work

The main agent uses `sessions_spawn` to create isolated subagent sessions:

```
User: "build me a React component for the dashboard"
Main: spawns Forge subagent with the task
Forge: writes code, commits, returns result
Main: relays result to user
```

The main agent never loads Forge's code context — stays clean for conversation.

## Tips

- **Budget:** Use cheap models for coding (Kimi K2), powerful models for strategy (Opus)
- **Isolation:** Each agent has its own workspace, memory, and session history
- **Routing:** Use Discord channel bindings to talk directly to specialist agents
- **Heartbeat:** Each agent can have its own heartbeat for specialized monitoring
