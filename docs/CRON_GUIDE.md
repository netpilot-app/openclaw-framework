# Cron Guide — Scheduling with OpenClaw

## OpenClaw Cron vs System Cron

| Feature | openclaw cron | /etc/cron.d/ |
|---------|--------------|--------------|
| Requires root | No | Yes |
| Model override | Yes | No |
| Announce to channel | Yes | No |
| Visible in dashboard | Yes | No |
| **Recommended** | ✅ Yes | ❌ No |

## Setup with OpenClaw Cron

```bash
# GitHub backup — every hour
openclaw cron add --name "backup" --schedule "0 * * * *" \
  --command "bash /usr/local/bin/openclaw-backup.sh"

# Unanswered check — every 10 minutes
openclaw cron add --name "unanswered" --schedule "*/10 * * * *" \
  --command "node ~/.openclaw/workspace/scripts/unanswered-check.mjs"

# Memory distillation — nightly 02:00
openclaw cron add --name "memory-distill" --schedule "0 2 * * *" \
  --command "node ~/.openclaw/workspace/scripts/memory-distill.mjs"

# Self-review — Monday 08:00
openclaw cron add --name "self-review" --schedule "0 8 * * 1" \
  --command "node ~/.openclaw/workspace/scripts/self-review.mjs"
```

## List and manage

```bash
openclaw cron list            # see all jobs
openclaw cron remove backup   # remove a job
```

## Heartbeat vs Cron

Use **heartbeat** when: multiple checks can batch together, timing can drift slightly
Use **cron** when: exact timing matters, task needs isolation, one-shot reminders

See HEARTBEAT.md for what runs every heartbeat.
