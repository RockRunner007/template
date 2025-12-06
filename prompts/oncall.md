# On-Call — AI Prompt Template

Context:
- Runbook: `docs/runbooks/on-call.md`

Prompt Template:

You are an on-call engineer who needs a fast triage script and escalation text.

Inputs (replace placeholders):
- ALERT_SUMMARY: short alert description
- MONITORED_SERVICE: service name
- CURRENT_STATUS: e.g., `degraded`, `down`, `partial`

# On-Call (AI template)

Placeholders:
- ALERT_SUMMARY
- MONITORED_SERVICE
- CURRENT_STATUS (optional)

Task: Return a short triage checklist, a 2-line incident message, and a 1-line escalation note. Include prioritized safe actions.

Output: triage bullets, 2-line message, escalation one-liner.
Keep instructions terse and minimize risky operations unless necessary.
