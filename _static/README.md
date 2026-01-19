# Static Assets

This directory contains static documentation and artifacts that support the project's architecture and security planning.

## Contents

### `deployment-diagram.md`

Visual representation of the deployment architecture, including:

- Infrastructure components and their relationships
- Network topology and traffic flow
- Cloud services and integrations
- Scaling and redundancy considerations

Related: `diagram.drawio.png` is the visual version of this diagram (created in Draw.io format).

### `threat-model.json`

Security threat model for the project, including:

- Identified threats and vulnerabilities
- Risk assessment and prioritization
- Mitigation strategies
- Compliance and audit checkpoints

Threat modeling ensures security is considered during design, not added as an afterthought.

## Usage

- Keep these artifacts up-to-date as the project architecture evolves
- Reference the threat model during security reviews and incident analysis
- Use deployment diagrams in runbooks and onboarding documentation
- Include diagrams in design documents and architectural decision records (ADRs)

## Best Practices

1. **Version control:** Commit changes to track architectural evolution
2. **Review:** Have diagrams reviewed by technical leads and security teams
3. **Currency:** Update when infrastructure or security posture changes
4. **Accessibility:** Provide alt text and descriptions for diagrams
5. **Documentation:** Link from relevant runbooks and design docs
