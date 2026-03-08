# Budget Configuration

## Monthly Limits
monthly_cap: $50
alert_threshold: 0.8

## Model Cost Reference (approx per 1M tokens)
| Model | Input | Output |
|-------|-------|--------|
| claude-sonnet-4-6 | $3 | $15 |
| claude-opus-4-6 | $15 | $75 |
| kimi-coding/k2p5 | $0.14 | $0.14 |
| gpt-4o | $2.50 | $10 |

## Tips for Staying Under Budget
- Use Sonnet for main agent (not Opus)
- Spawn subagents with Kimi K2 for coding tasks (very cheap)
- Keep HEARTBEAT.md lean — every heartbeat costs tokens
- Use reactions instead of replies when possible (no model call needed)
- Set subagent thinking=off for simple tasks

## Last Check
- Date: (not yet run)
- Estimated spend: n/a
- % of monthly cap: n/a
