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

## Automation

- [ ] Ran `bash scripts/setup.sh`
- [ ] Cron jobs installed (verify with `cat /etc/cron.d/openclaw-framework`)
- [ ] Discord channel IDs updated in `scripts/unanswered-check.mjs`
- [ ] Bot user ID updated in `scripts/unanswered-check.mjs`
- [ ] Evolution channel ID updated in `scripts/self-review.mjs`

## First Tests

- [ ] First heartbeat test passed (sent `HEARTBEAT_OK` or did checks)
- [ ] First backup pushed to GitHub (manual test)
- [ ] Discord reaction test (👀 → 🧠 → ✅)
- [ ] Agent introduced themselves to human

## You're Live! 🦞

Once everything is checked off, your agent is ready to go.

Next: Read `WORKFLOW_GUIDE.md` to understand how it all works.
