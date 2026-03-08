#!/usr/bin/env node
/**
 * Budget Check — Weekly usage estimate and alert
 * Reads OpenClaw usage logs and estimates token spend
 * Run via cron: 0 9 * * 1 (Monday 09:00)
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';

const WORKSPACE = process.env.OPENCLAW_WORKSPACE || join(process.env.HOME, '.openclaw/workspace');
const BUDGET_FILE = join(WORKSPACE, 'brain/budgets.md');
const DISCORD_CHANNEL = process.env.BUDGET_CHANNEL_ID || process.env.DISCORD_CHANNEL_ID || 'YOUR_DISCORD_CHANNEL_ID_HERE';

function run(cmd) {
  try { return execSync(cmd, { encoding: 'utf8', timeout: 10000 }).trim(); } catch { return null; }
}

function sendDiscord(msg) {
  if (DISCORD_CHANNEL === 'YOUR_DISCORD_CHANNEL_ID_HERE') return;
  run(`openclaw message send --channel discord --target "channel:${DISCORD_CHANNEL}" --message ${JSON.stringify(msg)}`);
}

// Read budget config from brain/budgets.md
function readBudgets() {
  if (!existsSync(BUDGET_FILE)) {
    return { monthly_cap_usd: 50, alert_threshold: 0.8 };
  }
  const content = readFileSync(BUDGET_FILE, 'utf8');
  const capMatch = content.match(/monthly_cap:\s*\$?(\d+)/i);
  const threshMatch = content.match(/alert_threshold:\s*([\d.]+)/i);
  return {
    monthly_cap_usd: capMatch ? parseInt(capMatch[1]) : 50,
    alert_threshold: threshMatch ? parseFloat(threshMatch[1]) : 0.8
  };
}

// Get usage from openclaw
function getUsage() {
  const result = run('openclaw usage --json 2>/dev/null');
  if (!result) return null;
  try { return JSON.parse(result); } catch { return null; }
}

async function run_check() {
  const budgets = readBudgets();
  const usage = getUsage();
  
  const timestamp = new Date().toISOString().split('T')[0];
  console.log(`[Budget Check ${timestamp}]`);
  console.log(`Monthly cap: $${budgets.monthly_cap_usd}`);
  
  if (!usage) {
    console.log('Usage data not available — openclaw usage command not supported or no data yet');
    return;
  }
  
  const totalCost = usage.totalCostUsd || usage.cost_usd || 0;
  const pct = totalCost / budgets.monthly_cap_usd;
  
  console.log(`Estimated spend: $${totalCost.toFixed(4)} (${(pct*100).toFixed(1)}% of cap)`);
  
  if (pct >= budgets.alert_threshold) {
    const msg = `💰 **Budget Alert** — ${(pct*100).toFixed(0)}% of monthly cap used\nSpend: $${totalCost.toFixed(2)} / $${budgets.monthly_cap_usd}\nCheck brain/budgets.md to review`;
    console.log('ALERT:', msg);
    sendDiscord(msg);
  }
  
  // Update budgets.md with latest estimate
  if (existsSync(BUDGET_FILE)) {
    const content = readFileSync(BUDGET_FILE, 'utf8');
    const updated = content.replace(
      /## Last Check[\s\S]*?(?=\n##|$)/,
      `## Last Check\n- Date: ${timestamp}\n- Estimated spend: $${totalCost.toFixed(4)}\n- ${(pct*100).toFixed(1)}% of monthly cap\n`
    );
    if (updated !== content) writeFileSync(BUDGET_FILE, updated);
  }
}

run_check().catch(console.error);
