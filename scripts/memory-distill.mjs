#!/usr/bin/env node
// memory-distill.mjs — Nightly memory distillation
// Promotes high-value entries from today's daily log to MEMORY.md
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const WORKSPACE = process.env.WORKSPACE || `${process.env.HOME}/.openclaw/workspace`;
const MAX_MEMORY_LINES = 400;
const today = new Date().toISOString().split('T')[0];
const dailyPath = join(WORKSPACE, 'memory', `${today}.md`);
const memoryPath = join(WORKSPACE, 'MEMORY.md');

// Read today's log
if (!existsSync(dailyPath)) {
  console.log('No daily log for today — skipping');
  process.exit(0);
}

if (!existsSync(memoryPath)) {
  console.error('MEMORY.md not found — cannot distill');
  process.exit(1);
}

const daily = readFileSync(dailyPath, 'utf8');
const memory = readFileSync(memoryPath, 'utf8');

// Extract high-value lines (heuristic: headers and bullet points with key terms)
const HIGH_VALUE_TERMS = [
  'installed', 'created', 'fixed', 'deployed', 'configured',
  'API key', 'port', 'URL', 'webhook', 'service', 'tunnel',
  'decision', 'decided', 'rule', 'never', 'always',
  'said', 'wants', 'important', 'lesson', 'learned',
  'contact', 'project', 'infrastructure', 'password', 'secret',
];

const lines = daily.split('\n');
const candidates = lines.filter(line =>
  HIGH_VALUE_TERMS.some(term => line.toLowerCase().includes(term.toLowerCase()))
  && line.trim().length > 20
  && !memory.includes(line.trim()) // avoid duplicates
);

if (candidates.length === 0) {
  console.log('No new high-value entries to distill today');
  process.exit(0);
}

// Build the new section
const section = `\n## Distilled ${today}\n${candidates.map(l => l.trim()).join('\n')}\n`;
let newMemory = memory + section;

// Prune if over limit — remove oldest "## Distilled YYYY-MM-DD" sections first
const memoryLines = newMemory.split('\n');
if (memoryLines.length > MAX_MEMORY_LINES) {
  console.log(`MEMORY.md has ${memoryLines.length} lines — pruning oldest distilled sections...`);

  // Find all distilled section positions
  const distilledSections = [];
  let inDistilled = false;
  let sectionStart = -1;

  for (let i = 0; i < memoryLines.length; i++) {
    if (/^## Distilled \d{4}-\d{2}-\d{2}/.test(memoryLines[i])) {
      if (inDistilled && sectionStart !== -1) {
        distilledSections.push({ start: sectionStart, end: i - 1 });
      }
      sectionStart = i;
      inDistilled = true;
    } else if (inDistilled && /^## /.test(memoryLines[i]) && !/^## Distilled/.test(memoryLines[i])) {
      distilledSections.push({ start: sectionStart, end: i - 1 });
      inDistilled = false;
      sectionStart = -1;
    }
  }
  if (inDistilled && sectionStart !== -1) {
    distilledSections.push({ start: sectionStart, end: memoryLines.length - 1 });
  }

  // Remove oldest distilled sections until under limit
  let pruneIdx = 0;
  let pruned = memoryLines.slice();
  while (pruned.length > MAX_MEMORY_LINES && pruneIdx < distilledSections.length - 1) {
    const { start, end } = distilledSections[pruneIdx];
    const offset = memoryLines.length - pruned.length;
    const adjStart = start - offset;
    const adjEnd = end - offset;
    pruned.splice(adjStart, adjEnd - adjStart + 1);
    pruneIdx++;
    console.log(`Pruned distilled section at original line ${start}`);
  }

  newMemory = pruned.join('\n');
  console.log(`After pruning: ${pruned.length} lines`);
}

writeFileSync(memoryPath, newMemory);
console.log(`✅ Distilled ${candidates.length} entries from ${today} → MEMORY.md`);
