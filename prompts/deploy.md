# Deploy — AI Prompt Template

Context:

Prompt Template:

You are an expert Release Engineer. A manual production deploy is planned.

Inputs (replace placeholders):
# Deploy (AI template)

Placeholders:
- ARTIFACT_TAG
- TARGET_ENV
- RISK_NOTES (optional)

Task: Return a concise deploy checklist, one-line CI/CLI commands to run it, key health checks, and escalation criteria.

Output: bullet checklist, code lines for commands, short escalation note.
3. List critical metrics and logs to monitor during the deploy and what thresholds indicate rollback.
