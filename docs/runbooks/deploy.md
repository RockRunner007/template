# Deploy Runbook

Purpose: Steps to perform a manual deployment to production and verification checks.

Owner: Platform / Release Engineer

Prerequisites:
- Access to deployment credentials and registry.
- Relevant branch and CI artifacts built and available.
- Runbook `docs/runbooks/rollback.md` reviewed before risky changes.

Quick Steps:
1. Confirm the release artifact (tag/commit) and environment.
2. Notify stakeholders (Slack/Email) about planned deploy window.
3. From CI/CD, trigger deploy for tag/commit or run the deployment job.
4. Monitor deployment logs and health checks until complete.
5. Run smoke tests and sanity checks.
6. If issues found, follow `docs/runbooks/rollback.md`.

Verification:
- Application health endpoints return 200 within expected latency.
- Key business transactions succeed in staging and production.
- No increase in error budget alerts post-deploy.

Post-deploy:
- Update release notes and close the release ticket.
- Record any deviations and lessons in the post-mortem runbook.

Notes for AI:
- Use the matching AI prompt at `prompts/runbooks/deploy-prompt.md` to generate checklists and safe command snippets for deploys.
