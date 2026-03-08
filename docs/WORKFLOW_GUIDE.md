# Workflow Guide

How the OpenClaw Framework operates.

## Daily Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Wake Up   │────▶│ Read Files  │────▶│   Do Work   │
└─────────────┘     └─────────────┘     └─────────────┘
                           │                    │
                           ▼                    ▼
                    ┌─────────────┐     ┌─────────────┐
                    │ SOUL.md     │     │ Log to      │
                    │ IDENTITY.md │     │ memory/     │
                    │ USER.md     │     │ YYYY-MM-DD  │
                    │ cortex.md   │     └─────────────┘
                    └─────────────┘
```

## Memory System

| What | Where | When to Read | When to Write |
|------|-------|--------------|---------------|
| Identity | SOUL.md, IDENTITY.md | Every session | When personality evolves |
| Human info | USER.md | Every session | When you learn new things |
| Daily logs | memory/YYYY-MM-DD.md | Today + yesterday | Continuously |
| Long-term | MEMORY.md | Main sessions only | Significant events |
| Active goals | brain/cortex.md | Every session | When goals change |
| Auto-behaviors | brain/reflexes.md | When relevant | When patterns emerge |

## Automation Schedule

| Job | Frequency | Script | Purpose |
|-----|-----------|--------|---------|
| GitHub backup | Every hour | `backup.sh` | Never lose work |
| Unanswered check | Every 10 min | `unanswered-check.mjs` | Catch missed messages |
| Memory distill | Daily 02:00 | `memory-distill.mjs` | Promote to long-term |
| Self-review | Monday 08:00 | `self-review.mjs` | Weekly improvement |

## Discord Reaction Flow

Every message you respond to should follow this flow:

```
👀 (seen) → 🧠 (thinking) → ⚙️ (spawning agents) → ✅ (done)
```

React instead of replying when:
- Simple acknowledgment → ✅ or 💯
- Agreement → 💯 or 👍
- Something shipped → 🚀
- Taking note → 📝

## Heartbeat Protocol

When you receive a heartbeat poll:

1. **Read HEARTBEAT.md** — follow the checklist
2. **Do productive checks** — gateway, git, email, calendar (rotate)
3. **Reply appropriately:**
   - If you did something → brief summary
   - If nothing to do → `HEARTBEAT_OK`

## Self-Improvement Loop

Every Monday:

1. Read last week's memory files
2. Extract patterns (successes, errors, corrections)
3. Generate self-review → `brain/self-review.md`
4. Post summary to evolution channel
5. Update beliefs/reflexes based on learnings

## File Conventions

| Pattern | Meaning |
|---------|---------|
| UPPERCASE.md | Core identity/ops files (SOUL, AGENTS, MEMORY) |
| lowercase.md | Templates or guides |
| YYYY-MM-DD.md | Daily logs |
| backup.YYYYMMDD | Backup copies |

## Emergency Procedures

**Gateway down:**
```bash
openclaw gateway stop && sleep 3 && openclaw gateway start
```

**Lost memory file:**
- Check GitHub history
- Restore from backup

**Config corrupted:**
- Restore from .bak file
- Check AGENTS.md for config protocol

---

_This is a living document. Update it as your workflow evolves._
