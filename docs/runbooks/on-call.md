# On-Call Runbook

Purpose: Guidance for on-call engineers handling alerts, paging, and escalations.

Owner: Platform / SRE on-call rota

Before You Start:
- Familiarize with monitoring dashboards, alert thresholds, and escalation matrix.
- Keep the incident response runbook `docs/runbooks/incident-response.md` handy.

Responding to an Alert:
1. Acknowledge the page and confirm receipt on the incident channel.
2. Triage using the incident response steps: gather context, logs, traces.
3. Mitigate impact (restart, scale, route traffic) and notify stakeholders.
4. Escalate when thresholds or time-to-resolution exceeds SLOs.

Escalation:
- Use the escalation matrix in this runbook to call senior SRE or on-call leads.

After the Alert:
- Document the event, actions taken, and follow up with a post-incident review.

Notes for AI:
- Use `prompts/runbooks/oncall-prompt.md` to produce quick triage scripts, escalation text templates, and prioritized action lists for on-call responders.
