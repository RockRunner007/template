# On-Call — AI Prompt Template

## Context

- Runbook: `docs/runbooks/on-call.md`

## Placeholders

- ALERT_SUMMARY
- MONITORED_SERVICE
- CURRENT_STATUS (optional, e.g., `degraded`, `down`, `partial`)

## Task

Return a short triage checklist, a 2-line incident message, and a 1-line escalation note. Include prioritized safe actions.

## Output

- Triage checklist (bullets)
- 2-line incident message
- 1-line escalation note
- Keep instructions terse and minimize risky operations unless necessary
