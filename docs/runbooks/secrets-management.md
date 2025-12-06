# Secrets Management Runbook

Purpose: How to handle, rotate, and remediate leaked or expired secrets for the repository and deployed systems.

Owner: Security / Platform

Scope:
- Service credentials, API keys, tokens, certificates, and environment variables.

Routine Rotation:
1. Schedule and rotate credentials via the secret manager in use (Vault, AWS Secrets Manager, etc.).
2. Update CI/CD variables and redeploy or restart services if necessary.
3. Verify new credentials are active and old credentials are revoked.

Compromised Secret Procedure:
1. Immediately revoke the exposed secret or rotate it.
2. Identify systems and services using the secret and update them.
3. Run a redeploy where required to pick new credentials.
4. Search the repo for accidental exposures and remove them.
5. Open a security incident and follow `docs/runbooks/incident-response.md` if necessary.

Notes for AI:
- Use `prompts/runbooks/secrets-management-prompt.md` to generate step-by-step remediation playbooks and safe search commands for secrets.
