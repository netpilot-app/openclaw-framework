#!/bin/bash
# OpenClaw Framework Health Check
# Verifies setup is complete and working

WORKSPACE="${OPENCLAW_WORKSPACE:-$HOME/.openclaw/workspace}"
PASS=0
FAIL=0
WARN=0

green() { echo -e "\033[0;32m  ✅ $1\033[0m"; PASS=$((PASS+1)); }
red()   { echo -e "\033[0;31m  ❌ $1\033[0m"; FAIL=$((FAIL+1)); }
yellow(){ echo -e "\033[0;33m  ⚠️  $1\033[0m"; WARN=$((WARN+1)); }

echo ""
echo "🔍 OpenClaw Framework Health Check"
echo "==================================="
echo "Workspace: $WORKSPACE"
echo ""

echo "📁 Core Files"
[ -f "$WORKSPACE/SOUL.md" ] && green "SOUL.md exists" || red "SOUL.md missing — copy from framework"
[ -f "$WORKSPACE/IDENTITY.md" ] && green "IDENTITY.md exists" || red "IDENTITY.md missing"
[ -f "$WORKSPACE/USER.md" ] && green "USER.md exists" || red "USER.md missing"
[ -f "$WORKSPACE/AGENTS.md" ] && green "AGENTS.md exists" || red "AGENTS.md missing"
[ -f "$WORKSPACE/HEARTBEAT.md" ] && green "HEARTBEAT.md exists" || red "HEARTBEAT.md missing"
echo ""

echo "🧠 Customization Check"
grep -q "YOUR_AGENT_NAME\|MyAgent" "$WORKSPACE/IDENTITY.md" 2>/dev/null \
  && yellow "IDENTITY.md still has placeholder — update agent name" \
  || green "IDENTITY.md customized"
grep -q "YOUR_NAME\|Human" "$WORKSPACE/USER.md" 2>/dev/null \
  && yellow "USER.md still has placeholder — update your name" \
  || green "USER.md customized"
grep -q "YOUR_DISCORD_CHANNEL_ID_HERE" "$WORKSPACE/scripts/unanswered-check.mjs" 2>/dev/null \
  && yellow "Scripts still have placeholder channel IDs" \
  || green "Discord IDs configured in scripts"
echo ""

echo "📜 Scripts"
[ -f "$WORKSPACE/scripts/unanswered-check.mjs" ] && green "unanswered-check.mjs" || red "unanswered-check.mjs missing"
[ -f "$WORKSPACE/scripts/memory-distill.mjs" ] && green "memory-distill.mjs" || red "memory-distill.mjs missing"
[ -f "$WORKSPACE/scripts/self-review.mjs" ] && green "self-review.mjs" || red "self-review.mjs missing"
echo ""

echo "⏰ Cron Jobs"
if crontab -l 2>/dev/null | grep -q "openclaw\|backup.sh"; then
  green "User crontab has openclaw jobs"
elif [ -f "/etc/cron.d/openclaw-framework" ]; then
  green "System cron installed at /etc/cron.d/openclaw-framework"
else
  yellow "No cron jobs found — run scripts/setup.sh to install"
fi
echo ""

echo "🔗 GitHub"
if cd "$WORKSPACE" 2>/dev/null && git remote -v 2>/dev/null | grep -q "origin"; then
  REMOTE=$(git remote get-url origin 2>/dev/null)
  green "Git remote: $REMOTE"
else
  yellow "No git remote — run: git remote add origin <your-repo>"
fi
echo ""

echo "🦞 OpenClaw"
if command -v openclaw &>/dev/null; then
  green "openclaw CLI found: $(openclaw --version 2>/dev/null | head -1)"
  # Check gateway
  if openclaw gateway status 2>/dev/null | grep -q "running"; then
    green "Gateway: running"
  else
    yellow "Gateway: not running — start with: openclaw gateway start"
  fi
else
  red "openclaw not found — install from https://openclaw.ai"
fi
echo ""

echo "=================================="
echo "Results: ✅ $PASS passed | ⚠️ $WARN warnings | ❌ $FAIL failed"
echo ""
if [ $FAIL -eq 0 ] && [ $WARN -eq 0 ]; then
  echo "🎉 All checks passed! Your agent is ready."
elif [ $FAIL -eq 0 ]; then
  echo "👍 Core setup is good. Address warnings when ready."
else
  echo "🔧 Fix the failures above before starting."
fi
echo ""
