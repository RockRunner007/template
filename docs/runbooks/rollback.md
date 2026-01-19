# Rollback Runbook

**Purpose:** Safe rollback procedure when a deployment causes functional regression or serious errors.

**Owner:** Platform / SRE

## When to rollback

- New release causes increased error rates or severe functionality loss.
- Automated monitoring triggers critical alerts tied to the release.

## Rollback Steps

1. Confirm issue is release-related (compare to previous release logs, toggle feature flags).
2. Notify stakeholders about rollback intent and estimated impact.
3. Trigger rollback via CI/CD to the previously known-good artifact (tag/commit).
4. Monitor system health and logs for errors during rollback.
5. If rollback fails, escalate to on-call and the release owner.

## Post-rollback

- Run verification tests to confirm restoration of service.
- Open an incident or post-mortem documenting root cause and next steps.

## Notes for AI

- Use `prompts/rollback.md` for AI-generated step-by-step rollback plans and safe validation checks.
