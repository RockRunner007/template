# Template — Secure Project Blueprint

![Build](https://github.com/RockRunner007/template/actions/workflows/test-and-build.yml/badge.svg)
![CodeQL](https://github.com/RockRunner007/template/actions/workflows/codeql-analysis.yml/badge.svg)
![Dependabot](https://img.shields.io/badge/dependabot-enabled-blue.svg)
![License](https://img.shields.io/github/license/RockRunner007/template)

A concise starter template for new services with security, docs, and CI best-practices baked in.

Why this repo
- Provides a consistent project layout so teams can start small and scale safely.
- Includes placeholders for security scans, runbooks, and automation so security becomes part of the workflow.

Quick structure
- `_static/` — diagrams, threat models, deployment docs
- `docs/runbooks/` — operational runbooks (deploy, rollback, incident response)
- `prompts/` — AI prompts and project context for automated helpers
- `src/` — source code
- `tst/` — unit, integration, and security-focused tests (this repo uses `tst`)
- `infrastructure/` — IaC (Terraform, etc.) and security policies
- `artifacts/` — build outputs, scan results, coverage reports
- `example/` — example usages or demo projects
- `codeowners` / `.github/CODEOWNERS` — ownership hints (project may include either)
- `.github/workflows/` — CI and security workflows (template-ready; manual by default)
- `.github/dependabot.yml` — dependency automation (Dependabot config)

Tech
- This template is language-agnostic. Add your stack here (e.g., Node.js, Python, Go, Terraform).

Table of Contents
- [Quick structure](#quick-structure)
- [Tech](#tech)
- [Quick start](#quick-start)
- [How to enable CI](#how-to-enable-ci)
- [Security](#security)
- [Personas](#personas)
- [Contributing](#contributing)
- [Coding Standards](#coding-standards)

Security-first defaults
- Workflows in this template are set to `workflow_dispatch` only (manual) — uncomment triggers for active projects.
- Included example workflows: CodeQL, secret scanning, container scanning (Trivy), tfsec for IaC.
- Dependabot configured to suggest updates (including GitHub Actions).
- Keep secrets out of the repo and configure scanners in your CI for automated checks.

Quick start
1. Clone this repository: `git clone <repo>`
2. Copy the template into a new repo or use this repo as a starter
3. Edit `prompts/project-context.md`, `docs/runbooks/*`, and workflow steps to match your stack
4. Enable or customize scanners and change workflow triggers from `workflow_dispatch` to automated triggers when ready

Contributing
- This template is meant to be adapted. Open a PR or edit files directly to match your team conventions.

How to enable CI
1. Workflows in this template are manual by default (`workflow_dispatch`). To enable automated CI, edit the workflow file (in `.github/workflows/`) and replace the `on:` block. Example — replace this manual block:

```yaml
on:
	workflow_dispatch:
```

with automated triggers like:

```yaml
on:
	push:
		branches: [ main ]
	pull_request:
```

2. Commit the change and push — the workflow will then run on push/PR events.

Security
- Add a `SECURITY.md` to define how to report vulnerabilities.
- Workflows include CodeQL, secret scanning, container scanning, and tfsec examples — run them manually first to tune rules.
- Keep secrets out of the repo and store credentials in GitHub Secrets or a secrets manager.

Contributing
- This template is meant to be adapted. Open a PR or edit files directly to match your team conventions.

Coding Standards
- Task: Return a concise list of project coding standards covering formatting, linting, testing, and key security checks.
- Output: short bullet list of explicit rules.

Personas
- This repo includes a set of stakeholder personas you can use in prompts and runbooks to guide AI responses and troubleshooting tone.
- Location: `prompts/personas/` — each persona is a short markdown file (e.g., `boss.md`, `cynic.md`).

Quick example
```text
You are the "boss" persona. Explain the business impact of adding an automated patching pipeline in three bullets.
```

Contacts
- Maintainer: @stevencarlson

License
- See `LICENSE` in the repository.

Further reading
- Threat modeling: https://owasp.org/www-project-threat-modeling/
- 12-factor apps: https://12factor.net/