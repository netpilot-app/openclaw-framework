#!/usr/bin/env node
/**
 * Unanswered Message Checker
 * Checks if your human's recent messages got a reply. If not, adds ❓ reaction + alerts.
 * Run via cron every 10 minutes.
 */

import { execSync } from 'child_process';

// ============================================
// CONFIG: Update these values for your setup
// ============================================
const CHANNEL_ID = 'YOUR_DISCORD_CHANNEL_ID_HERE';      // Main channel to monitor
const HUMAN_USER_ID = 'YOUR_DISCORD_USER_ID_HERE';      // Your Discord user ID
const BOT_USER_ID = 'YOUR_BOT_USER_ID_HERE';            // Your agent's bot user ID
const MAX_UNANSWERED_MINUTES = 8;                       // How long to wait before flagging
const ALERTS_CHANNEL = 'YOUR_ALERTS_CHANNEL_ID_HERE';   // Channel for missed message alerts

function run(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8', timeout: 15000 }).trim();
  } catch (e) {
    return null;
  }
}

async function checkUnanswered() {
  const result = run(
    `openclaw message read --channel discord --target "channel:${CHANNEL_ID}" --limit 20 --json`
  );
  if (!result) { console.log('[Check] Could not read messages'); return; }

  let messages;
  try {
    const parsed = JSON.parse(result);
    messages = parsed?.payload?.messages || [];
  } catch { console.log('[Check] Parse error'); return; }

  if (!messages.length) { console.log('[Check] No messages'); return; }

  // Find the most recent human message
  const humanMsgs = messages.filter(m => m.author?.id === HUMAN_USER_ID);
  if (!humanMsgs.length) { console.log('[Check] No recent human messages'); return; }

  const lastHuman = humanMsgs[0];
  const lastHumanTime = new Date(lastHuman.timestamp).getTime();
  const minutesAgo = (Date.now() - lastHumanTime) / 60000;

  // Has the bot replied AFTER this message?
  const botRepliedAfter = messages.some(m =>
    m.author?.id === BOT_USER_ID &&
    new Date(m.timestamp).getTime() > lastHumanTime
  );

  if (botRepliedAfter) {
    console.log(`[Check] ✅ Answered (human's msg was ${minutesAgo.toFixed(1)} min ago)`);
    return;
  }

  if (minutesAgo < MAX_UNANSWERED_MINUTES) {
    console.log(`[Check] ⏳ ${minutesAgo.toFixed(1)} min old — still in response window`);
    return;
  }

  if (minutesAgo > 60) {
    console.log(`[Check] Message is ${minutesAgo.toFixed(0)} min old — too old to retry`);
    return;
  }

  // UNANSWERED within the window — flag it
  const preview = (lastHuman.content || '').replace(/<[^\u003e]+>/g, '').trim().slice(0, 100);
  console.log(`[Check] ⚠️ UNANSWERED ${minutesAgo.toFixed(1)} min: "${preview}"`);

  // React ❓ on the missed message
  run(`openclaw message react --channel discord --target "channel:${CHANNEL_ID}" --message-id "${lastHuman.id}" --emoji "❓"`);

  // Alert to alerts channel
  run(`openclaw message send --channel discord --target "channel:${ALERTS_CHANNEL}" --message "⚠️ **Missed Message** — message sent ${minutesAgo.toFixed(0)} min ago with no reply:\n> ${preview}\n\nCheck <#${CHANNEL_ID}> and respond."`);
}

checkUnanswered().catch(console.error);
