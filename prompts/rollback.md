# Rollback — AI Prompt Template

## Context

- Runbook: `docs/runbooks/rollback.md`

## Placeholders

- CURRENT_TAG
- PREVIOUS_GOOD_TAG
- DETECTED_FAILURES (optional)

## Task

Return a numbered rollback plan, one-line CI/CLI commands to execute it, and post-rollback verification steps.

## Output

- Numbered rollback steps
- One-line CLI commands to execute
- Short verification checklist
