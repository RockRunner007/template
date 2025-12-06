# Rollback — AI Prompt Template

Context:
- Runbook: `docs/runbooks/rollback.md`

Prompt Template:

You are an SRE preparing a rollback plan.

Inputs (replace placeholders):
- CURRENT_TAG: the release tag currently deployed
- PREVIOUS_GOOD_TAG: the last known-good tag or commit
- DETECTED_FAILURES: brief summary of observed failures or alerts

# Rollback (AI template)

Placeholders:
- CURRENT_TAG
- PREVIOUS_GOOD_TAG
- DETECTED_FAILURES (optional)

Task: Return a numbered rollback plan, one-line CI/CLI commands to execute it, and post-rollback verification steps.

Output: numbered steps, one-line commands, short verification checklist.
