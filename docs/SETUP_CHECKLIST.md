# Setup Checklist

Step-by-step checklist for setting up your OpenClaw instance.

## Pre-Flight

- [ ] OpenClaw installed and running (`openclaw gateway status`)
- [ ] This framework cloned to `~/.openclaw/workspace/`
- [ ] You have admin/root access for installing cron jobs

## Identity Setup

- [ ] SOUL.md written — what's your agent's personality?
- [ ] IDENTITY.md written — what's their name and emoji?
- [ ] USER.md written — who are they helping?
- [ ] Deleted BOOTSTRAP.md (after first session)

## Channel Setup

- [ ] Discord bot created and invited to server
- [ ] Discord channel IDs collected (main channel, alerts, evolution)
- [ ] Channel connected and tested (`openclaw message send`)

## GitHub Setup

- [ ] GitHub repo created
- [ ] `git remote add origin <your-repo>` run
- [ ] Initial commit pushed

## MCPs (Tools)

- [ ] filesystem — `openclaw mcporter install filesystem`
- [ ] sequential-thinking — `openclaw mcporter install sequential-thinking`
- [ ] github — `openclaw mcporter install github` (add token)
- [ ] brave-search — `openclaw mcporter install brave-search` (add API key)

## Skills

- [ ] self-improving — `clawhub install self-improving`
- [ ] semantic-memory — `clawhub install semantic-memory`
- [ ] brainos-sync — `clawhub install brainos-sync`

## Budget

- [ ] Set monthly cap in `brain/budgets.md`
- [ ] Alert threshold configured (default 80%)
- [ ] Discord channel for budget alerts set (env: `BUDGET_CHANNEL_ID`)
- [ ] Weekly budget check runs Monday 09:00 (verify with `openclaw cron list`)

## Automation

- [ ] Ran `bash scripts/setup.sh`
- [ ] OpenClaw cron jobs installed (verify with `openclaw cron list`)
  - [ ] backup — runs every hour
  - [ ] unanswered — runs every 10 minutes
  - [ ] memory-distill — runs nightly at 02:00
  - [ ] self-review — runs Monday 08:00
- [ ] (Fallback) If not using openclaw cron: verify with `cat /etc/cron.d/openclaw-framework`
- [ ] Discord channel IDs updated in `scripts/unanswered-check.mjs`
- [ ] Bot user ID updated in `scripts/unanswered-check.mjs`
- [ ] Evolution channel ID updated in `scripts/self-review.mjs`

## Hooks & Boot

- [ ] `BOOT.md` present in workspace root
- [ ] `hooks.bootMd.enabled: true` set in `openclaw.json`
- [ ] Verified BOOT.md runs on gateway start (check gateway logs)

## First Tests

- [ ] First heartbeat test passed (sent `HEARTBEAT_OK` or did checks)
- [ ] First backup pushed to GitHub (manual test)
- [ ] Discord reaction test (👀 → 🧠 → ✅)
- [ ] Agent introduced themselves to human

## Choosing a Persona

Copy a persona template as your SOUL.md:
```bash
# Personal assistant (recommended for most users)
cp personas/personal-assistant.md SOUL.md

# Developer agent
cp personas/dev-agent.md SOUL.md

# Team manager
cp personas/team-manager.md SOUL.md
```

Then customize it to fit your needs.

## You're Live! 🦞

Once everything is checked off, your agent is ready to go.

Next: Read `WORKFLOW_GUIDE.md` to understand how it all works.
