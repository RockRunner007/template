# Template — Secure Project Blueprint

![Build](https://github.com/RockRunner007/template/actions/workflows/test-and-build.yml/badge.svg)
![CodeQL](https://github.com/RockRunner007/template/actions/workflows/codeql-analysis.yml/badge.svg)
![Dependabot](https://img.shields.io/badge/dependabot-enabled-blue.svg)
![License](https://img.shields.io/github/license/RockRunner007/template)

A comprehensive project template for building production-ready services with:
- **Specification-Driven Development** integration with example specs
- **Comprehensive documentation** covering entire software development lifecycle
- **Security-first CI/CD** with automated scanning and best practices
- **Team governance** with clear processes and standards
- **Testing strategy** with pyramid approach and security/performance testing
- **Infrastructure guides** with deployment, scaling, and disaster recovery
- **Repository analyzer** tool to check compliance with best practices

## Why this repo

- Provides a consistent project layout so teams can start small and scale safely.
- Includes spec-driven development methodology with real examples and templates.
- Full documentation ecosystem covering feature lifecycle, releases, testing, governance, and operations.
- Includes placeholders for security scans, runbooks, and automation so security becomes part of the workflow.
- Includes a repository compliance analyzer to evaluate any project against these standards.

## Directory Structure

### Core Directories
- `src/` — source code
- `tst/` — unit, integration, and security-focused tests
- `specs/` — specifications for features (specification-driven development)
- `example/` — example implementations and demonstrations

### Documentation
- `docs/` — comprehensive documentation covering entire SDLC
  - `docs/lifecycle/` — feature, release, and deprecation processes
  - `docs/governance/` — code review, change management, onboarding, dependencies
  - `docs/testing/` — testing pyramid, security testing, performance testing
  - `docs/infrastructure-overview.md` — architecture and infrastructure guide
  - `docs/environment-strategy.md` — dev/staging/prod environment management
  - `docs/runbooks/` — operational runbooks (deploy, rollback, incident response, monitoring)
  - `docs/tools/` — tools documentation (repository analyzer, AI integration)

### Configuration & Operations
- `_static/` — diagrams, threat models, deployment documentation
- `infrastructure/` — IaC (Terraform, etc.) and security policies
- `prompts/` — AI prompts and project context for automated helpers
- `artifacts/` — build outputs, scan results, coverage reports
- `scripts/` — utility scripts (repository analyzer, etc.)

### Project Governance
- `codeowners` / `.github/CODEOWNERS` — ownership hints
- `.github/workflows/` — CI and security workflows (template-ready)
- `.github/dependabot.yml` — dependency automation configuration
- `docs/personas/` — stakeholder personas for guidance and communication

## Tech Stack

This template is language and framework-agnostic. It provides best practices for:

- **Languages:** Node.js, Python, Go, Rust, Java, .NET (examples included)
- **Testing:** Unit, integration, E2E, security, and performance testing frameworks
- **CI/CD:** GitHub Actions workflows for testing, building, and deployment
- **Infrastructure:** Terraform/Bicep for IaC, multi-environment support (dev/staging/prod)
- **Security:** SAST, DAST, secret scanning, dependency management
- **Monitoring:** Observability stack (metrics, logs, traces, alerts)

## Table of Contents

- [Directory Structure](#directory-structure)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Key Features](#key-features)
- [Specification-Driven Development](#specification-driven-development)
- [Documentation](#documentation)
- [Repository Analyzer](#repository-analyzer)
- [Security](#security)
- [CI/CD Workflows](#cicd-workflows)
- [Personas](#personas)
- [Contributing](#contributing)
- [Resources](#resources)

## Key Features

### 📋 Specification-Driven Development

- Complete integration with [spec-kit](https://github.com/github/spec-kit)
- Example specification with tasks, acceptance criteria, and contracts
- Guides for writing tickets, knowledge base entries, and architecture decisions
- Real-world examples: authentication, notifications, user profiles

### 📚 Comprehensive Documentation

- **Feature Lifecycle** — 8 phases from ideation to monitoring with gates and timelines
- **Release Management** — Semantic versioning, changelog, hotfix processes
- **Testing Strategy** — Unit, integration, E2E, security, and performance testing approaches
- **Governance** — Code review standards, change management, dependency handling
- **Infrastructure** — Architecture overview, environment strategy, scaling, and DR
- **Monitoring** — Observability, metrics, logs, traces, alerts, and on-call processes
- **Onboarding** — Structured team member onboarding (week 1-3 checklist)

### 🔍 Repository Analyzer Tool

Evaluate any GitHub repository against best practices:

```bash
# Analyze repository
./scripts/analyze-repo owner/repo

# Get compliance score (0-100%)
./scripts/analyze-repo facebook/react

# JSON output for automation
OUTPUT_FORMAT=json ./scripts/analyze-repo owner/repo > report.json
```

**Checks 8 categories:** Documentation, Governance, Lifecycle, Infrastructure, Testing, Specifications, CI/CD, Examples

See [Repository Analyzer Guide](docs/tools/QUICK-START.md) for details.

### 🛡️ Security-First

- CodeQL analysis for code security vulnerabilities
- Secret scanning to prevent credential leaks
- Dependency scanning and automated updates (Dependabot)
- Container scanning (Trivy) for image vulnerabilities
- Infrastructure as Code scanning (tfsec) for Terraform
- Penetration testing and DAST guidance included

### 🤖 AI Integration Ready

- Repository analyzer produces JSON for AI processing
- Examples for Claude, ChatGPT, and other LLMs
- Automated issue creation from recommendations
- CI/CD integration patterns
- Batch processing multiple repositories

## Specification-Driven Development

This template includes complete spec-kit integration:

### Example Specs

1. **Authentication** (`specs/001-example/`) — Complete working example
   - Feature overview and acceptance criteria
   - Endpoints specification
   - Events and data model
   - Task breakdown with effort estimates
   - API contracts with examples

2. **Notifications** (`specs/002-notifications/`) — Real-world spec
3. **User Profile** (`specs/003-user-profile/`) — Multi-feature spec

### Getting Started with Specs

1. Copy `specs/001-example/` structure for new features
2. Follow the [Spec Integration Guide](docs/spec-integration/readme.md)
3. Write tickets from specs using [Tickets Guide](docs/spec-integration/tickets.md)
4. Create knowledge base entries with [KB Guide](docs/spec-integration/knowledge-base.md)

## Documentation

Key documentation files:

| Topic | Location |
|-------|----------|
| Feature Lifecycle | [docs/lifecycle/feature-lifecycle.md](docs/lifecycle/feature-lifecycle.md) |
| Release Management | [docs/lifecycle/release-management.md](docs/lifecycle/release-management.md) |
| Code Review Standards | [docs/governance/code-review-standards.md](docs/governance/code-review-standards.md) |
| Change Management | [docs/governance/change-management.md](docs/governance/change-management.md) |
| Testing Strategy | [docs/testing/test-pyramid.md](docs/testing/test-pyramid.md) |
| Security Testing | [docs/testing/security-testing.md](docs/testing/security-testing.md) |
| Infrastructure Overview | [docs/infrastructure-overview.md](docs/infrastructure-overview.md) |
| Environment Strategy | [docs/environment-strategy.md](docs/environment-strategy.md) |
| First-Time Setup | [docs/runbooks/first-time-setup.md](docs/runbooks/first-time-setup.md) |
| Monitoring & Observability | [docs/runbooks/monitoring-observability.md](docs/runbooks/monitoring-observability.md) |

See [docs/](docs/) for complete documentation.

## Repository Analyzer

Check if any GitHub repository meets best practices standards:

### Quick Start

```bash
# Make executable
chmod +x scripts/analyze-repo

# Analyze any repository
./scripts/analyze-repo owner/repo

# Examples
./scripts/analyze-repo facebook/react
./scripts/analyze-repo kubernetes/kubernetes
./scripts/analyze-repo google/go-cloud
```

### Output

```
🟡 Overall Compliance Score: 72/100

Category Breakdown:
documentation       [████████████████░░] 90/100
governance          [██████████░░░░░░░░] 60/100
lifecycle           [████████░░░░░░░░░░] 40/100
...

Recommendations for Improvement:
🔴 HIGH PRIORITY:
1. Governance: Missing governance documentation
```

### Features

- ✅ Compliance scoring (0-100%)
- ✅ Category breakdown with weights
- ✅ Quality checks for key files
- ✅ Specific, actionable recommendations
- ✅ JSON output for automation
- ✅ Node.js or Python (no dependencies)

See [docs/tools/QUICK-START.md](docs/tools/QUICK-START.md) for full guide.

## CI/CD Workflows

## Getting Started

### 1. Clone or Use as Template

```bash
# Clone this repository
git clone https://github.com/RockRunner007/template.git

# Or use as template on GitHub: "Use this template" button
```

### 2. Customize for Your Project

- Edit `prompts/project-context.md` with your project details
- Customize docs in `docs/lifecycle/`, `docs/governance/`, etc. to match your team
- Update workflows in `.github/workflows/` for your tech stack
- Add your code to `src/` and tests to `tst/`

### 3. Start Using Specifications

- Create your first specification in `specs/` using the template in `specs/001-example/`
- Use [spec-kit](https://github.com/github/spec-kit) format for consistent feature documentation
- Link specs to GitHub issues and PRs for traceability

### 4. Enable CI/CD

Workflows are manual by default. To enable automated CI, edit `.github/workflows/*.yml`:

```yaml
# Change from:
on:
  workflow_dispatch:

# To:
on:
  push:
    branches: [ main ]
  pull_request:
```

### 5. Set Up Team Processes

Review and customize:
- [Code Review Standards](docs/governance/code-review-standards.md)
- [Change Management](docs/governance/change-management.md)
- [Team Onboarding](docs/governance/onboarding.md)
- [Testing Strategy](docs/testing/test-pyramid.md)

## Quick reference links

- [Spec-Driven Development](https://github.com/github/spec-kit) — Build high-quality software faster using specifications and AI agents
- [GitHub best practices](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features) — Repository configuration guidance
- [Security best practices](https://docs.github.com/en/code-security) — GitHub security features and guidance

Workflows in `.github/workflows/` are manual by default (`workflow_dispatch`). To enable automated triggers:

1. Edit the workflow file
2. Replace the `on: { workflow_dispatch: }` block with desired triggers:

```yaml
on:
  push:
    branches: [ main ]
  pull_request:
  schedule:
    - cron: '0 0 * * 0'  # Weekly
```

## Security

- **Reporting** — Publish [SECURITY.md](SECURITY.md) to define vulnerability reporting process
- **Automated Scanning** — Include CodeQL, secret scanning, dependency scanning, container scanning
- **Infrastructure Security** — Use tfsec and similar tools for IaC validation
- **Secrets Management** — Store in GitHub Secrets, never commit credentials
- **Access Control** — Use CODEOWNERS for permission management
- **Policy Enforcement** — Branch protection rules, required reviews, status checks

See [docs/testing/security-testing.md](docs/testing/security-testing.md) for comprehensive security testing guide.

## Contributing

- This template is meant to be adapted to your team's needs
- Open a PR or issue to suggest improvements
- See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines
- Help improve documentation and examples for other teams

## Personas

This repo includes stakeholder personas for guided communication and AI prompts:

- `boss.md` — Business/executive perspective
- `burned.md` — Burned-out team member
- `cynic.md` — Critical/skeptical perspective
- `herd.md` — Team/consensus perspective
- `irrational.md` — Emotional/reactive perspective
- `time_crunched.md` — Time-pressured perspective
- `uninformed.md` — Newcomer perspective

Use in AI prompts: `You are the "boss" persona. Explain the business impact...`

See [docs/personas/](docs/personas/) for details.

## Resources

### Documentation
- [Specification-Driven Development Integration](docs/spec-integration/readme.md)
- [Complete Documentation Index](docs/)
- [Repository Analyzer Guide](docs/tools/QUICK-START.md)
- [AI Integration Examples](docs/tools/ai-integration.md)

### External References
- [Spec-Kit](https://github.com/github/spec-kit) — GitHub's spec-driven development format
- [GitHub Best Practices](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features)
- [GitHub Security](https://docs.github.com/en/code-security)
- [12-Factor App](https://12factor.net/)
- [OWASP Threat Modeling](https://owasp.org/www-project-threat-modeling/)

## License

This template is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Maintainer

- [@stevencarlson](https://github.com/stevencarlson)

## Feedback & Issues

Found a gap or have an improvement? [Open an issue](https://github.com/RockRunner007/template/issues) or submit a pull request.

---

**Status:** Production-ready template with specification-driven development, comprehensive governance, and automated tooling.

**Last Updated:** January 2026