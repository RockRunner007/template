# Security Requirements

Provide a concise bullet list of security requirements for code and infrastructure including:

- Secrets handling and credential management
- TLS/encryption requirements
- Logging and audit trails
- Access control and least privilege principles
- Vulnerability scanning and dependency management
- Compliance requirements and security standards

## Example Output Format

- All secrets must be managed via environment variables or secrets manager (no hardcoded credentials)
- TLS 1.2+ required for all external communications
- Audit logs must capture all authentication and administrative actions
- Principle of least privilege for all service accounts and API tokens
- Automated dependency scanning on all pull requests
- Annual penetration testing and security assessments

