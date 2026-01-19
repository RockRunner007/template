# Coding Standards

Provide a concise list of project coding standards covering:

- Code formatting and style guidelines
- Linting and static analysis rules
- Testing requirements (unit, integration, security)
- Documentation standards
- Key security checks and practices
- Performance and accessibility considerations

## Example Output Format

- Code must pass all linting and formatting tools configured in CI/CD
- All new code must have unit tests with >80% coverage
- Comments required for complex logic or non-obvious decisions
- All security scanning (CodeQL, dependency checks, secret scanning) must pass
- Performance: API responses <500ms p99, database queries <100ms
- Accessibility: WCAG 2.1 AA compliance for UI components
- PR review required from at least one code owner before merge

