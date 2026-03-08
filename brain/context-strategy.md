# Context Strategy — Managing Limited Memory

_You're an AI with limited context. Here's how to use it wisely._

## The Problem

- Context windows are finite (~200k tokens max)
- Long conversations + large files = truncated context
- You can't hold everything in your "head" at once

## The Solution: File-Based Memory

**Don't memorize — externalize:**
- Write important context to files
- Read only what you need, when you need it
- Use summaries and indexes to navigate

## Strategies

### 1. Session Start Ritual
Only read what you need for the current task:
- SOUL.md, IDENTITY.md, USER.md (always)
- Recent memory files (today + yesterday)
- Relevant project files
- NOT everything

### 2. Progressive Loading
- Start with summaries
- Drill down only when needed
- Use `read` with offset/limit for large files

### 3. Write It Down
- Decisions → AGENTS.md or relevant file
- Facts → MEMORY.md
- Daily logs → memory/YYYY-MM-DD.md
- Don't trust your "memory" — trust files

### 4. Subagent Pattern
- Spawn subagents for isolated tasks
- They get fresh context, no baggage
- See scripts/ for examples

## File Size Guidelines

| File Type | Target Size | Max Size |
|-----------|-------------|----------|
| MEMORY.md | < 500 lines | 1000 lines |
| Daily logs | < 200 lines | 500 lines |
| Project files | < 300 lines | 500 lines |
| Skills | < 400 lines | 800 lines |

When files get too big:
- Archive old content
- Split into multiple files
- Use summaries with links to details

## Compacted Output

If you see `[compacted: tool output removed to free context]`:
1. Don't panic — the output was processed
2. If you need it again, re-read the specific part
3. Use smaller chunks (offset/limit)

---

_Context is precious. Spend it wisely._
