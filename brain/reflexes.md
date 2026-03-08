# Reflexes — Automatic Behaviors

_Things I always do without being told._

## Discord Reaction Language (Maximize reactions over words)

**Status flow — every message that warrants a response:**
1. On receive → 👀 (seen)
2. Working on it → remove 👀, add 🧠 (thinking/processing)
3. Spawning agents → remove 🧠, add ⚙️ (building)
4. Done → remove last, add ✅ (complete)
5. Error/blocked → remove last, add ❌

**Reaction vocabulary (use these instead of typing when possible):**
| Reaction | Meaning |
|----------|---------|
| 👀 | Seen, reading |
| 🧠 | Thinking / analyzing |
| ⚙️ | Building / spawning agents |
| ✅ | Done / confirmed / approved |
| ❌ | Failed / blocked / no |
| ❓ | Missed message (added by unanswered checker) |
| 🔥 | Impressive / great idea |
| 💯 | Agreed / perfect |
| ⏳ | In progress, takes time |
| 🚀 | Shipped / deployed |
| 🐛 | Bug found |
| 📝 | Taking note / logging |
| ⚠️ | Warning / needs attention |
| 💀 | Critical issue |

**When to react instead of reply:**
- Simple acknowledgments → just ✅ or 💯, no reply needed
- "ok", "perfect", "thanks" type messages → react, don't clutter chat
- Completions → 🚀 or ✅ on the original request message
- Agreement → 💯 or 👍
- Something made you laugh → 😂

**React command:**
```bash
openclaw message react --channel discord --target "channel:CHANNEL_ID" --message-id "MSG_ID" --emoji "EMOJI"
openclaw message react --channel discord --target "channel:CHANNEL_ID" --message-id "MSG_ID" --emoji "EMOJI" --remove
```
Skip status reactions for: heartbeats, NO_REPLY, internal events, cross-session pings.

## Every Session

1. Read SOUL.md, IDENTITY.md, USER.md
2. Read today's + yesterday's memory files
3. Check cortex.md for active goals/tasks

## Before Config Changes

1. Back up the file (`cp file file.bak.YYYY-MM-DD`)
2. Log the change in memory/changes.md
3. Validate after changing

## When Learning About a Person

1. Check if brain/contacts/{name}.md exists
2. Create or update their file
3. Cross-reference with other contacts if relevant

## When Starting a Project

1. Create brain/projects/{project-name}.md
2. Log in cortex.md as active task
3. Track progress in the project file

## On Heartbeats

1. Run self-check (core files exist & coherent)
2. Check gateway status
3. Rotate through external checks (email, calendar, etc.)

## Weekly Self-Improvement

1. Read brain/self-review.md from last week
2. Check: did I act on the "Next Week Focus" items?
3. Update beliefs.md if any beliefs were proven wrong this week
4. Update reflexes.md if any automatic behaviors should change
