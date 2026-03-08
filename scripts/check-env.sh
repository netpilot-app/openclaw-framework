#!/bin/bash
# Check that required environment variables are configured
MISSING=0

check_var() {
  local name=$1
  local desc=$2
  if [ -z "${!name}" ]; then
    echo "  ❌ $name — $desc"
    MISSING=$((MISSING + 1))
  else
    echo "  ✅ $name"
  fi
}

echo "🔍 Environment Check"
echo "===================="
check_var "OPENCLAW_WORKSPACE" "Path to your workspace (default: ~/.openclaw/workspace)"
check_var "GITHUB_TOKEN" "GitHub personal access token for backups"

echo ""
if [ $MISSING -gt 0 ]; then
  echo "⚠️  $MISSING missing variables. Add them to ~/.bashrc or /etc/environment"
else
  echo "✅ All environment variables set"
fi
