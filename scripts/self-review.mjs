#!/usr/bin/env node

/**
 * self-review.mjs — Weekly Self-Review Generator
 * 
 * Reads last week's memory files, extracts patterns, generates a self-review
 * draft, suggests belief/reflex updates.
 * 
 * Run: node ~/.openclaw/workspace/scripts/self-review.mjs
 * Schedule: Every Monday during heartbeat or via cron
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';

const WORKSPACE = process.env.WORKSPACE || `${process.env.HOME}/.openclaw/workspace`;
const MEMORY_DIR = join(WORKSPACE, 'memory');
const BRAIN_DIR = join(WORKSPACE, 'brain');
const SELF_REVIEW_PATH = join(BRAIN_DIR, 'self-review.md');
const BELIEFS_PATH = join(BRAIN_DIR, 'beliefs.md');
const REFLEXES_PATH = join(BRAIN_DIR, 'reflexes.md');

// ============================================
// CONFIG: Update this for your notification channel
// ============================================
const EVOLUTION_CHANNEL = 'YOUR_EVOLUTION_CHANNEL_ID_HERE';

// ─── Date Helpers ───────────────────────────────────────────────────────────

function getLastMonday() {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? 6 : day - 1;
  const lastMon = new Date(now);
  lastMon.setDate(now.getDate() - diff - 7);
  return lastMon;
}

function formatDate(d) {
  return d.toISOString().split('T')[0];
}

function getWeekDates(startMonday) {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startMonday);
    d.setDate(startMonday.getDate() + i);
    dates.push(formatDate(d));
  }
  return dates;
}

// ─── File Reading ───────────────────────────────────────────────────────────

function readMemoryFiles(dates) {
  const entries = [];
  for (const date of dates) {
    const filePath = join(MEMORY_DIR, `${date}.md`);
    if (existsSync(filePath)) {
      try {
        const content = readFileSync(filePath, 'utf-8');
        entries.push({ date, content });
      } catch (e) {
        console.warn(`⚠️  Could not read ${filePath}: ${e.message}`);
      }
    }
  }
  return entries;
}

function readBrainFile(path) {
  if (existsSync(path)) {
    try {
      return readFileSync(path, 'utf-8');
    } catch (e) {
      console.warn(`⚠️  Could not read ${path}: ${e.message}`);
    }
  }
  return '';
}

// ─── Pattern Extraction ─────────────────────────────────────────────────────

function extractPatterns(memoryEntries) {
  const patterns = {
    decisions: [],
    errors: [],
    corrections: [],
    successes: [],
    humanPatterns: [],
  };

  for (const { date, content } of memoryEntries) {
    const lines = content.split('\n');

    for (const line of lines) {
      const lower = line.toLowerCase();

      // Decisions & key choices
      if (lower.includes('decision') || lower.includes('decided') || lower.includes('chose') || lower.includes('approved')) {
        patterns.decisions.push({ date, text: line.trim() });
      }

      // Errors & failures
      if (lower.includes('error') || lower.includes('bug') || lower.includes('crash') || lower.includes('broke') ||
          lower.includes('failed') || lower.includes('fix') || lower.includes('wrong') || lower.includes('issue')) {
        if (line.trim().length > 20 && !lower.includes('no new issues')) {
          patterns.errors.push({ date, text: line.trim() });
        }
      }

      // Corrections from human
      if (lower.includes('correct') || lower.includes('flag') || lower.includes('asked') ||
          lower.includes('want') || lower.includes('notice') || lower.includes('feedback')) {
        patterns.corrections.push({ date, text: line.trim() });
      }

      // Successes
      if (lower.includes('✅') || lower.includes('done') || lower.includes('shipped') || lower.includes('completed') ||
          lower.includes('worked') || lower.includes('live')) {
        if (line.trim().length > 15) {
          patterns.successes.push({ date, text: line.trim() });
        }
      }

      // Human behavior patterns
      patterns.humanPatterns.push({ date, text: line.trim() });
    }
  }

  // Deduplicate and limit
  for (const key of Object.keys(patterns)) {
    const seen = new Set();
    patterns[key] = patterns[key].filter(item => {
      const normalized = item.text.substring(0, 60);
      if (seen.has(normalized)) return false;
      seen.add(normalized);
      return true;
    }).slice(0, 15);
  }

  return patterns;
}

// ─── Review Generation ──────────────────────────────────────────────────────

function generateReview(weekStart, patterns, beliefs, reflexes) {
  const weekDate = formatDate(weekStart);

  const topSuccesses = patterns.successes.slice(0, 5).map(s => `- ${s.text}`).join('\n') || '- (no data this week)';
  const topErrors = patterns.errors.slice(0, 5).map(e => `- ${e.text}`).join('\n') || '- (no issues detected)';
  const topDecisions = patterns.decisions.slice(0, 5).map(d => `- ${d.text}`).join('\n') || '- (no major decisions)';
  const topCorrections = patterns.corrections.slice(0, 5).map(c => `- ${c.text}`).join('\n') || '- (no corrections this week)';

  const beliefSuggestions = [];
  const reflexSuggestions = [];

  if (patterns.errors.length > 3) {
    beliefSuggestions.push('- High error count this week — consider whether current approach is too aggressive');
  }
  if (patterns.corrections.length > 2) {
    reflexSuggestions.push('- Multiple corrections — add reflexes to catch these patterns earlier');
  }
  if (patterns.successes.length > 5) {
    beliefSuggestions.push('- Strong success rate — current strategies are working, reinforce them');
  }

  return `
# Self-Review — Week of ${weekDate}

## What Worked Well
${topSuccesses}

## What Didn't Work
${topErrors}

## Key Decisions Made
${topDecisions}

## Corrections Received
${topCorrections}

## Beliefs to Update
${beliefSuggestions.length > 0 ? beliefSuggestions.join('\n') : '- (review beliefs.md manually for accuracy)'}

## Reflexes to Update
${reflexSuggestions.length > 0 ? reflexSuggestions.join('\n') : '- (review reflexes.md manually for needed changes)'}

## Next Week Focus
1. Act on any corrections — make them permanent reflexes
2. Review and update beliefs.md if any assumptions were wrong
3. Check if last week's focus items were addressed
`.trim();
}

// ─── Prepend to Self-Review File ────────────────────────────────────────────

function updateSelfReview(newReview) {
  let existing = '';
  if (existsSync(SELF_REVIEW_PATH)) {
    existing = readFileSync(SELF_REVIEW_PATH, 'utf-8');
  }

  const headerEnd = existing.indexOf('---');
  let header, body;

  if (headerEnd !== -1) {
    header = existing.substring(0, headerEnd + 3);
    body = existing.substring(headerEnd + 3).trim();
  } else {
    header = '# Self-Review Log\n\n_Weekly self-improvement journal. Updated every Monday._\n\n---';
    body = existing;
  }

  const updated = `${header}\n\n${newReview}\n\n${body}`.trim() + '\n';
  writeFileSync(SELF_REVIEW_PATH, updated);
  console.log(`✅ Self-review written to ${SELF_REVIEW_PATH}`);
}

// ─── Discord Post ───────────────────────────────────────────────────────────

function postToEvolution(summary) {
  if (EVOLUTION_CHANNEL === 'YOUR_EVOLUTION_CHANNEL_ID_HERE') {
    console.log('ℹ️  EVOLUTION_CHANNEL not configured — skipping Discord notification');
    return;
  }

  try {
    const message = summary.replace(/"/g, '\\"').replace(/\n/g, '\\n');
    execSync(
      `openclaw message send --channel discord --target "channel:${EVOLUTION_CHANNEL}" --message "${message}"`,
      { timeout: 30000, stdio: 'pipe' }
    );
    console.log('✅ Summary posted to evolution channel');
  } catch (e) {
    console.warn(`⚠️  Could not post to evolution channel: ${e.message}`);
  }
}

// ─── Evolution Summary ──────────────────────────────────────────────────────

function buildEvolutionSummary(weekDate, patterns) {
  const successCount = patterns.successes.length;
  const errorCount = patterns.errors.length;
  const correctionCount = patterns.corrections.length;
  const decisionCount = patterns.decisions.length;

  let summary = `🧠 **Self-Review — Week of ${weekDate}**\n\n`;
  summary += `📊 **Stats:** ${successCount} wins | ${errorCount} issues | ${correctionCount} corrections | ${decisionCount} decisions\n\n`;

  if (patterns.successes.length > 0) {
    summary += `✅ **Top Wins:**\n`;
    patterns.successes.slice(0, 3).forEach(s => {
      summary += `• ${s.text.replace(/^[-*•]\s*/, '').substring(0, 100)}\n`;
    });
    summary += '\n';
  }

  if (patterns.errors.length > 0) {
    summary += `⚠️ **Lessons Learned:**\n`;
    patterns.errors.slice(0, 3).forEach(e => {
      summary += `• ${e.text.replace(/^[-*•]\s*/, '').substring(0, 100)}\n`;
    });
    summary += '\n';
  }

  if (patterns.corrections.length > 0) {
    summary += `🔧 **Corrections (→ new reflexes):**\n`;
    patterns.corrections.slice(0, 3).forEach(c => {
      summary += `• ${c.text.replace(/^[-*•]\s*/, '').substring(0, 100)}\n`;
    });
    summary += '\n';
  }

  summary += `🎯 **Next Week:** Act on corrections, update beliefs, verify last week's focus items`;

  return summary;
}

// ─── Main ───────────────────────────────────────────────────────────────────

function main() {
  console.log('🧠 Self-Review — Starting...\n');

  const lastMonday = getLastMonday();
  const weekDates = getWeekDates(lastMonday);
  const weekDate = formatDate(lastMonday);

  console.log(`📅 Reviewing week of ${weekDate}`);
  console.log(`   Dates: ${weekDates.join(', ')}\n`);

  const memoryEntries = readMemoryFiles(weekDates);
  console.log(`📝 Found ${memoryEntries.length} memory files for the week\n`);

  if (memoryEntries.length === 0) {
    console.log('⚠️  No memory files found for last week. Generating minimal review.');
  }

  const beliefs = readBrainFile(BELIEFS_PATH);
  const reflexes = readBrainFile(REFLEXES_PATH);

  const patterns = extractPatterns(memoryEntries);
  console.log(`🔍 Extracted patterns:`);
  console.log(`   Decisions: ${patterns.decisions.length}`);
  console.log(`   Errors: ${patterns.errors.length}`);
  console.log(`   Corrections: ${patterns.corrections.length}`);
  console.log(`   Successes: ${patterns.successes.length}\n`);

  const review = generateReview(lastMonday, patterns, beliefs, reflexes);
  updateSelfReview(review);

  const summary = buildEvolutionSummary(weekDate, patterns);
  postToEvolution(summary);

  console.log('\n✅ Self-review complete!');
}

main();
