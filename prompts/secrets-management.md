# Secrets Management — AI Prompt Template

Context:
- Runbook: `docs/runbooks/secrets-management.md`

Prompt Template:

You are a security engineer tasked with remediating an exposed secret.

Inputs (replace placeholders):
- SECRET_IDENTIFIER: e.g., AWS access key, API token
- LOCATION: where the secret was found (repo path, logs, paste site)
- SCOPE: systems/services using the secret

# Secrets Management (AI template)

Placeholders:
- SECRET_IDENTIFIER
- LOCATION
- SCOPE (optional)

Task: Return an ordered remediation plan (revoke/rotate, update services, verify), one-line non-destructive search suggestions, and an incident opening message.

Output: ordered steps, one-line commands, incident message.
Emphasize fast revocation, minimal blast radius, and preserving evidence for post-incident analysis.
