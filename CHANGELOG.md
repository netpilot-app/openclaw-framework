# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-03-08

### Added
- Core identity layer: SOUL.md, IDENTITY.md, USER.md templates
- BrainOS: brain/ directory with reflexes, cortex, beliefs, context-strategy
- AGENTS.md — full operating rules (speak, react, dispatch, group chat)
- HEARTBEAT.md — lean automation schedule template (<60 lines)
- MEMORY.md — long-term memory template with section headers
- Discord reaction language system: 👀🧠⚙️✅ status flow + full vocabulary
- scripts/unanswered-check.mjs — retry missed Discord messages (cron every 10 min)
- scripts/memory-distill.mjs — nightly promotion of daily logs to MEMORY.md
- scripts/self-review.mjs — weekly self-improvement loop posting to #evolution
- scripts/setup.sh — automated setup (portable, root + non-root support)
- scripts/check-env.sh — environment variable validation
- config/mcporter.example.json — MCP server configuration template
- docs/SETUP_CHECKLIST.md, WORKFLOW_GUIDE.md, CUSTOMIZATION.md
- BOOTSTRAP.md — first-run guide for new agents
- .gitignore — prevents secrets and state files from being committed

### Architecture
- File-based memory (BrainOS) as the persistence layer
- Subagent dispatch pattern for heavy work
- Self-improving loop with weekly review cycle
- GitHub auto-backup with hourly cron
