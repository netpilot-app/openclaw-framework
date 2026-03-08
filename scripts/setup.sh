#!/bin/bash
# OpenClaw Framework Setup Script
# Works on any user, any system
set -e

WORKSPACE="${OPENCLAW_WORKSPACE:-$HOME/.openclaw/workspace}"
LOG_DIR="/var/log"
CRON_FILE="/etc/cron.d/openclaw-framework"

echo "🦞 OpenClaw Framework Setup"
echo "==========================="
echo "Workspace: $WORKSPACE"
echo ""

# Create directory structure
mkdir -p "${WORKSPACE}/memory"
mkdir -p "${WORKSPACE}/brain/council"
mkdir -p "${WORKSPACE}/config"
mkdir -p "${WORKSPACE}/skills"
echo "✅ Directory structure created"

# Run interactive wizard
echo ""
bash "$(dirname "$0")/wizard.sh"
echo ""

# Create portable backup script
BACKUP_SCRIPT="/usr/local/bin/openclaw-backup.sh"
cat > "$BACKUP_SCRIPT" << BACKUP
#!/bin/bash
WORKSPACE="\${OPENCLAW_WORKSPACE:-\$HOME/.openclaw/workspace}"
TIMESTAMP=\$(date '+%Y-%m-%d %H:%M %Z')
cd "\${WORKSPACE}"
if git rev-parse --git-dir > /dev/null 2>&1; then
  if [[ -n \$(git status --porcelain) ]]; then
    git add -A
    git commit -m "chore: auto-backup \${TIMESTAMP}"
    git push origin master 2>/dev/null || git push origin main 2>/dev/null || true
    echo "[\${TIMESTAMP}] ✅ Backup pushed to GitHub"
  else
    echo "[\${TIMESTAMP}] No changes to backup"
  fi
else
  echo "[\${TIMESTAMP}] ⚠️  Not a git repo — run: git init && git remote add origin <your-repo>"
fi
BACKUP
chmod +x "$BACKUP_SCRIPT"
echo "✅ Backup script: $BACKUP_SCRIPT"

# Install cron jobs
# Try /etc/cron.d/ first (needs root), fall back to user crontab
if [ "$EUID" -eq 0 ]; then
  cat > "$CRON_FILE" << CRON
# OpenClaw Framework — automated jobs
WORKSPACE=${WORKSPACE}
# GitHub backup — every hour
0 * * * * $(whoami) /usr/local/bin/openclaw-backup.sh >> /var/log/openclaw-backup.log 2>&1
# Unanswered message check — every 10 minutes
*/10 * * * * $(whoami) node ${WORKSPACE}/scripts/unanswered-check.mjs >> /var/log/openclaw-unanswered.log 2>&1
# Memory distillation — nightly 02:00
0 2 * * * $(whoami) node ${WORKSPACE}/scripts/memory-distill.mjs >> /var/log/openclaw-memory.log 2>&1
# Self-review — Monday 08:00
0 8 * * 1 $(whoami) node ${WORKSPACE}/scripts/self-review.mjs >> /var/log/openclaw-review.log 2>&1
CRON
  echo "✅ Cron installed at $CRON_FILE (root mode)"
else
  # Non-root: install to user crontab
  (crontab -l 2>/dev/null; echo "# OpenClaw Framework
0 * * * * /usr/local/bin/openclaw-backup.sh >> $HOME/.openclaw/backup.log 2>&1
*/10 * * * * node ${WORKSPACE}/scripts/unanswered-check.mjs >> $HOME/.openclaw/unanswered.log 2>&1
0 2 * * * node ${WORKSPACE}/scripts/memory-distill.mjs >> $HOME/.openclaw/memory.log 2>&1
0 8 * * 1 node ${WORKSPACE}/scripts/self-review.mjs >> $HOME/.openclaw/review.log 2>&1") | crontab -
  echo "✅ Cron installed to user crontab (non-root mode)"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Edit SOUL.md      — give your agent a personality"
echo "  2. Edit IDENTITY.md  — give them a name and emoji"
echo "  3. Edit USER.md      — tell them who they're helping"
echo "  4. Edit HEARTBEAT.md — set up automatic checks"
echo "  5. Set up GitHub:    git init && git remote add origin <your-repo>"
echo "  6. Update Discord channel IDs in scripts/unanswered-check.mjs"
echo "  7. Start OpenClaw:   openclaw gateway start"
echo ""
echo "Run scripts/health-check.sh to verify everything is set up correctly."
