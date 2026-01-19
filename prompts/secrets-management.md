# Secrets Management — AI Prompt Template

## Context

- Runbook: `docs/runbooks/secrets-management.md`

## Placeholders

- SECRET_IDENTIFIER (e.g., AWS access key, API token)
- LOCATION (where the secret was found - repo path, logs, paste site)
- SCOPE (optional - systems/services using the secret)

## Task

Return an ordered remediation plan (revoke/rotate, update services, verify), one-line non-destructive search suggestions, and an incident opening message.

## Output

- Ordered remediation steps
- One-line commands for searching and verification
- Incident opening message
- Emphasize fast revocation, minimal blast radius, and preserving evidence for post-incident analysis
