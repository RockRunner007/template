# Project Constitution

Foundational principles and governance for this project.

## Mission

Build maintainable, secure, and well-documented software through Specification-Driven Development (SDD).

## Core Principles

### 1. Specs First

- Specifications are the source of truth
- Code implements specifications, not the other way around
- All features have written specifications before implementation begins

### 2. Documentation as Code

- Documentation lives in the repository
- Specs evolve with code through git history
- Diagrams are version-controlled artifacts

### 3. Transparency

- Design decisions are documented and discoverable
- Changes go through review process
- Knowledge is shared, not hoarded

### 4. Quality Over Speed

- Specifications ensure requirements are clear before coding
- Tests validate specifications are met
- Refactoring happens when design improves, not after failures

### 5. Security by Default

- Security requirements included in all specifications
- Audit logs track access and changes
- Regular security reviews part of release process

### 6. Accessibility

- Documentation is clear and searchable
- Examples demonstrate best practices
- Runbooks help teams respond to incidents

## Development Workflow

### Spec → Plan → Tasks → Code → Test

1. **Specification** - Define what we're building
2. **Implementation Plan** - Decide how to build it
3. **Task List** - Break down into actionable items
4. **Implementation** - Write the code
5. **Testing** - Verify specification is met

### Continuous Review

- All changes reviewed by at least 1 team member
- Spec changes require architecture review
- Security changes reviewed by security team
- Documentation changes reviewed for clarity

## Repository Structure

```
specs/          # Specifications (source of truth)
docs/           # Documentation and guides
infrastructure/ # IaC and deployment configs
src/            # Source code
tst/            # Tests
.github/        # GitHub configuration and workflows
```

## Branching Strategy

- `main` - Production ready code
- `scarlson/cleanup` - Documentation and style fixes
- `scarlson/spec` - New specifications and integration examples
- Feature branches - Work on specific features

## Specification Standards

### Every Spec Must Include

1. **spec.md** - Requirements and acceptance criteria
2. **plan.md** - Implementation strategy
3. **tasks.md** - Actionable task list
4. **contracts/** - API and data contracts
5. **diagrams/** - Visual architecture

### Spec Naming

- Use 3-digit numbers: `001-feature-name`
- Examples: `001-authentication`, `002-notifications`, `003-user-profile`
- Full names in directories: `specs/001-authentication/`

## Communication Standards

### Issues

- Use templates for bug reports and features
- Link to related specifications
- Include severity and acceptance criteria

### Pull Requests

- Reference related specification
- Include testing summary
- Link to related issues
- Explain breaking changes upfront

### Code Review

- Review against specification first
- Check for acceptance criteria satisfaction
- Verify security requirements
- Test locally before approval

## Quality Standards

### Code Coverage

- Minimum 80% coverage required
- Security-critical paths: 100%

### Performance

- Must meet SLAs in specification
- Load test before release
- Monitor post-deployment

### Security

- All dependencies audited
- Vulnerability scanning enabled
- Security headers implemented
- Rate limiting on public endpoints

## Release Process

1. Create release branch from main
2. Update version numbers
3. Generate release notes from spec changes
4. Tag release in git
5. Deploy to production

## Technical Decisions

### Languages & Tools

- **Backend:** JavaScript/Node.js (Express)
- **Database:** PostgreSQL
- **Documentation:** Markdown
- **Diagrams:** Mermaid + Draw.io
- **CI/CD:** GitHub Actions
- **IaC:** Terraform/Bicep

### Authentication

- All APIs authenticated with JWT
- Tokens expire after 1 hour
- Refresh tokens for long sessions
- Rate limiting on login endpoints

### Error Handling

- Consistent error response format
- Never expose internal details
- Log all errors for debugging
- Alert on anomalies

## Team Responsibilities

### Technical Lead

- Reviews all specifications before approval
- Ensures architectural consistency
- Makes technology decisions

### Security Lead

- Reviews security requirements
- Audits authentication/authorization code
- Conducts security testing
- Maintains vulnerability log

### Documentation Owner

- Keeps specs and guides current
- Reviews PR descriptions
- Maintains runbooks
- Publishes to knowledge bases

### QA Lead

- Validates acceptance criteria
- Creates test plans from specs
- Runs security tests
- Verifies performance SLAs

## Escalation Path

1. **Questions:** Ask in Slack/comments
2. **Disagreements:** Discuss in PR comments
3. **Blocking Issues:** Schedule design meeting
4. **Decisions:** Document in specification
5. **Conflicts:** Tech lead makes final call

## Evolution

This constitution will evolve as the project grows. Changes require:

1. Discussion in team meeting
2. Pull request with proposed changes
3. At least 2 approvals
4. Merge to main branch
5. Announcement to team

## References

- [Spec-Driven Development](https://github.com/github/spec-kit)
- [Specification Format](../specs/readme.md)
- [Contributing Guidelines](../CONTRIBUTING.md)
- [Security Policy](../SECURITY.md)
