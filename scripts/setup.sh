#!/bin/bash
# OpenClaw Framework Setup Script
set -e

WORKSPACE="${HOME}/.openclaw/workspace"

echo "🦞 OpenClaw Framework Setup"
echo "==========================="

# Create memory directory
mkdir -p "${WORKSPACE}/memory"
mkdir -p "${WORKSPACE}/brain"
echo "✅ Directory structure created"

# Create backup script
cat > /usr/local/bin/openclaw-backup.sh << 'SCRIPT'
#!/bin/bash
WORKSPACE="${HOME}/.openclaw/workspace"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M %Z')
cd "${WORKSPACE}"
if [[ -n $(git status --porcelain) ]]; then
  git add -A
  git commit -m "chore: auto-backup $(date '+%Y-%m-%d %H:%M %Z')"
  git push origin master
  echo "[${TIMESTAMP}] ✅ Backup pushed to GitHub"
else
  echo "[${TIMESTAMP}] No changes to backup"
fi
SCRIPT
chmod +x /usr/local/bin/openclaw-backup.sh
echo "✅ Backup script created at /usr/local/bin/openclaw-backup.sh"

# Install cron jobs
CRON_FILE="/etc/cron.d/openclaw-framework"
cat > "${CRON_FILE}" << CRON
# OpenClaw Framework cron jobs
# GitHub backup — every hour
0 * * * * root /usr/local/bin/openclaw-backup.sh >> /var/log/openclaw-backup.log 2>&1

# Unanswered message check — every 10 minutes
*/10 * * * * root node ${WORKSPACE}/scripts/unanswered-check.mjs >> /var/log/openclaw-unanswered.log 2>&1

# Memory distillation — nightly at 02:00
0 2 * * * root node ${WORKSPACE}/scripts/memory-distill.mjs >> /var/log/openclaw-memory.log 2>&1

# Self-review — Monday 08:00
0 8 * * 1 root node ${WORKSPACE}/scripts/self-review.mjs >> /var/log/openclaw-review.log 2>&1
CRON

echo "✅ Cron jobs installed at ${CRON_FILE}"

echo ""
echo "🎉 Setup complete! Next steps:"
echo "  1. Edit SOUL.md — give your agent a personality"
echo "  2. Edit IDENTITY.md — give them a name"
echo "  3. Edit USER.md — tell them who they're helping"
echo "  4. Edit HEARTBEAT.md — set up automatic checks"
echo "  5. Set up GitHub repo + add remote: git remote add origin <your-repo>"
echo "  6. Update channel IDs in scripts/unanswered-check.mjs"
echo "  7. Start OpenClaw: openclaw gateway start"
