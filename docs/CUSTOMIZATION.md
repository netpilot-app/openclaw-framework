# Customization Guide

How to make the OpenClaw Framework yours.

## Personality

### SOUL.md

This is the core of who your agent is. Customize:

- **Core Truths** — what principles guide them?
- **Vibe** — professional? playful? sarcastic? earnest?
- **Boundaries** — what won't they do?

Example vibes:
- *"Chill but sharp, helpful without being corny"*
- *"Precise, thorough, slightly formal"*
- *"Enthusiastic, curious, always learning"*

## Identity

### IDENTITY.md

- **Name** — pick something meaningful or fun
- **Creature** — AI familiar? digital assistant? something else?
- **Emoji** — the visual signature (🦞, 🐾, 🤖, etc.)
- **Avatar** — describe or generate one

## Your Human

### USER.md

Update this as you learn:

- Preferred name, pronouns, timezone
- Communication style (brief vs detailed)
- What they care about
- What annoys them
- Projects they're working on

## Behaviors

### brain/reflexes.md

Add automatic behaviors as you notice patterns:

```markdown
## When [Situation]
1. [Action to take]
2. [Next action]
```

### brain/beliefs.md

Track assumptions and update when proven wrong:

```markdown
## Beliefs Updated
- 2024-01-15: Thought X, but actually Y
```

## Automation

### scripts/setup.sh

Customize cron schedules by editing the CRON section:

```bash
# Change frequency
*/5 * * * *   # Every 5 minutes instead of 10
0 */6 * * *   # Every 6 hours instead of hourly
```

### HEARTBEAT.md

Add your own periodic checks:

```markdown
## My Custom Checks
- [ ] Check [specific service]
- [ ] Review [specific project]
```

## Extending

### Adding New Scripts

1. Create in `scripts/`
2. Make executable: `chmod +x scripts/my-script.mjs`
3. Add to cron if needed

### Adding New Skills

```bash
clawhub install <skill-name>
```

Add project-specific notes in `brain/projects/<name>.md`.

### Adding Contacts

Create `brain/contacts/<name>.md` for people you interact with regularly.

## Branding

Feel free to rebrand:

- Change the emoji (🦞 is just a default)
- Rename files (keep the structure)
- Adapt the tone in docs

## Sharing

If you make improvements:

1. Fork the framework
2. Make your changes
3. Document what changed and why
4. Consider contributing back

---

_Make it yours. The framework is a starting point, not a cage._
