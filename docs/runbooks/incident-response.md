# Incident Response Runbook

**Purpose:** Triage and contain production incidents, restore service, and perform post-incident analysis.

**Owner:** On-call SRE / Incident Commander

## Initial Triage

1. Acknowledge the alert and set up an incident channel.
2. Capture the incident summary: impact, services affected, start time.
3. Run quick health checks and gather logs, traces, and metrics.
4. Determine if a rollback, mitigation, or configuration change is required.

## Containment & Mitigation

- Apply feature flags or traffic routing to limit impact.
- Scale resources or restart failing components if safe.
- Use read-only or degraded mode if full functionality is blocked.

## Communication

- Post periodic updates in the incident channel and to stakeholders.
- Follow the communication template in this runbook for clarity.

## Post-Incident

- Create a post-mortem, assign action items, and track remediation.
- Update the runbook with any lessons learned.

## Notes for AI

- Use `prompts/incident-response.md` to generate triage checklists, sample incident messages, and prioritized mitigation actions.
