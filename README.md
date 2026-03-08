# OpenClaw Framework 🦞

![version](https://img.shields.io/badge/version-v0.1.0-blue) ![license](https://img.shields.io/badge/license-MIT-green)

> A battle-tested starter kit for OpenClaw instances. Drop in, customize, deploy.

## What This Is

A framework for setting up an OpenClaw AI agent with:
- **BrainOS** — file-based memory that persists across sessions
- **Automation** — cron jobs for missed messages, memory distillation, self-improvement
- **Discord UX** — live reaction status (👀🧠✅) so users know what the agent is doing
- **Self-Improving Loop** — weekly review that makes the agent smarter over time

## Quick Start

```bash
# 1. Clone to your OpenClaw workspace
git clone https://github.com/netpilot-app/openclaw-framework ~/.openclaw/workspace

# 2. Run setup
bash ~/.openclaw/workspace/scripts/setup.sh

# 3. Fill in your identity
# Edit: SOUL.md, IDENTITY.md, USER.md

# 4. Start OpenClaw
openclaw gateway start
```

## What to Customize First

1. **SOUL.md** — Who is this agent? What's their personality?
2. **IDENTITY.md** — Name, emoji, avatar description
3. **USER.md** — Who are they helping? Name, timezone, preferences
4. **HEARTBEAT.md** — What should they check automatically?
5. **brain/reflexes.md** — Update channel IDs for your Discord server

## The Stack

| Layer | Files | Purpose |
|-------|-------|---------|
| Identity | SOUL.md, IDENTITY.md, USER.md | Who the agent is |
| Operations | AGENTS.md, HEARTBEAT.md | How they behave |
| Memory | MEMORY.md, memory/, brain/ | What they remember |
| Automation | scripts/ | What they do automatically |
| Tools | skills/, config/ | What they can do |

## Recommended MCPs

Install via mcporter:
```bash
# Essential
openclaw mcporter install filesystem sequential-thinking github brave-search

# Optional (for teams)
openclaw mcporter install linear puppeteer
```

## Recommended Skills

Install from ClawHub:
```bash
clawhub install self-improving semantic-memory brainos-sync backup-recovery discord-command-center
```

## Cron Jobs (auto-installed by setup.sh)

| Job | Schedule | What it does |
|-----|----------|-------------|
| GitHub backup | Every hour | Commits + pushes workspace to GitHub |
| Unanswered check | Every 10 min | Flags missed Discord messages |
| Memory distill | Nightly 02:00 | Promotes daily logs → MEMORY.md |
| Self-review | Weekly Monday | Generates self-improvement report |

## Directory Structure

```
~/openclaw-framework/
├── README.md              # This file
├── BOOTSTRAP.md           # First thing new agents read
├── SOUL.md                # Personality template
├── IDENTITY.md            # Name/emoji/persona
├── USER.md                # Human info template
├── AGENTS.md              # Operating rules
├── HEARTBEAT.md           # Periodic check list
├── MEMORY.md              # Long-term memory
├── brain/                 # Cognitive architecture
│   ├── reflexes.md        # Automatic behaviors
│   ├── cortex.md          # Active goals
│   ├── beliefs.md         # Core beliefs
│   └── context-strategy.md
├── scripts/               # Automation scripts
│   ├── setup.sh
│   ├── unanswered-check.mjs
│   ├── memory-distill.mjs
│   └── self-review.mjs
├── skills/                # Skill recommendations
├── config/                # Configuration templates
└── docs/                  # Documentation
    ├── SETUP_CHECKLIST.md
    ├── WORKFLOW_GUIDE.md
    └── CUSTOMIZATION.md
```

## Need Help?

- Read `docs/SETUP_CHECKLIST.md` for step-by-step setup
- Read `docs/WORKFLOW_GUIDE.md` to understand how it all works
- Read `docs/CUSTOMIZATION.md` to make it yours

---

Built with 🦞 by the OpenClaw community
