# Repository Compliance Analyzer - Quick Start

## What It Does

Analyzes any GitHub repository and gives you:
- **Compliance Score** (0-100%) against best practices
- **Category Breakdown** (documentation, governance, testing, etc.)
- **Specific Recommendations** for improvement
- **Machine-Readable JSON** for automation

## Install

```bash
# Already in the template! Just make executable
chmod +x scripts/analyze-repo
```

## Usage

### Quick Check

```bash
# Analyze any GitHub repository
./scripts/analyze-repo owner/repo

# Examples
./scripts/analyze-repo facebook/react
./scripts/analyze-repo RockRunner007/template
./scripts/analyze-repo google/kubernetes
```

### With GitHub Token (Higher Rate Limits)

```bash
export GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
./scripts/analyze-repo owner/repo
```

### Get JSON Output (For AI/Automation)

```bash
OUTPUT_FORMAT=json ./scripts/analyze-repo owner/repo > report.json
```

## What Gets Checked

| Category | Files Checked | Weight |
|----------|--------------|--------|
| **Documentation** | README, CONTRIBUTING, SECURITY, LICENSE | 50 pts |
| **Governance** | Code review, change mgmt, onboarding, dependencies | 24 pts |
| **Lifecycle** | Feature, release, deprecation docs | 19 pts |
| **Infrastructure** | Architecture, environments, runbooks | 21 pts |
| **Testing** | Test pyramid, security, performance | 20 pts |
| **Specifications** | Specs directory with examples | 15 pts |
| **CI/CD** | GitHub Actions workflows | 8 pts |
| **Examples** | Example implementations | 5 pts |

## Score Guide

| Score | Status | Meaning |
|-------|--------|---------|
| 90-100 | 🟢 Excellent | Production-ready |
| 80-89 | 🟢 Good | Most areas covered |
| 70-79 | 🟡 Fair | Core docs present |
| 60-69 | 🟡 Needs Work | Major gaps |
| 0-59 | 🔴 Critical | Significant issues |

## Example Output

```
🟡 Overall Compliance Score: 72/100

Category Breakdown:
documentation       [████████████████░░] 90/100 (45/50 points)
governance          [██████████░░░░░░░░] 60/100 (30/50 points)
lifecycle           [████████░░░░░░░░░░] 40/100 (20/50 points)

Recommendations for Improvement:
🔴 HIGH PRIORITY:
1. Governance: Missing governance documentation
   Suggestion: Add code review standards and change management guides

🟡 MEDIUM PRIORITY:
1. Lifecycle: Missing feature lifecycle documentation
```

## For AI Integration

### Get JSON Report

```bash
OUTPUT_FORMAT=json ./scripts/analyze-repo myorg/myrepo > compliance.json
```

### Send to Claude/ChatGPT

```python
import json
import subprocess
from anthropic import Anthropic

# Get analysis
result = subprocess.run(
    ["bash", "-c", "OUTPUT_FORMAT=json ./scripts/analyze-repo owner/repo"],
    capture_output=True, text=True
)
analysis = json.loads(result.stdout)

# Ask AI for recommendations
client = Anthropic()
response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1024,
    messages=[{
        "role": "user",
        "content": f"Analyze this repo compliance: {json.dumps(analysis)}\n\nWhat are the top 3 issues?"
    }]
)
print(response.content[0].text)
```

### Create GitHub Issues from Results

```bash
OUTPUT_FORMAT=json ./scripts/analyze-repo myorg/repo | \
  jq '.recommendations[] | select(.priority == "HIGH")' | \
  # Process to create GitHub issues
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Check Compliance

on: [schedule: [{cron: '0 9 * * 1'}]]

jobs:
  compliance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Analyze repository
        env:
          OUTPUT_FORMAT: json
        run: |
          SCORE=$(./scripts/analyze-repo ${{ github.repository }} | \
            jq '.overallScore')
          echo "Score: $SCORE/100"
          [ $SCORE -ge 70 ] || exit 1
```

## Common Commands

```bash
# Check your repository
./scripts/analyze-repo myorg/myrepo

# Check multiple repositories
for repo in api web mobile; do
  ./scripts/analyze-repo myorg/$repo
done

# Export to JSON for processing
OUTPUT_FORMAT=json ./scripts/analyze-repo myorg/myrepo > report.json

# With GitHub token (recommended)
GITHUB_TOKEN=$MY_TOKEN ./scripts/analyze-repo myorg/myrepo

# Get just the score
OUTPUT_FORMAT=json ./scripts/analyze-repo myorg/myrepo | jq '.overallScore'

# Get high-priority recommendations
OUTPUT_FORMAT=json ./scripts/analyze-repo myorg/myrepo | \
  jq '.recommendations[] | select(.priority == "HIGH")'
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "GitHub API error: 404" | Repository doesn't exist or is private (need token) |
| "GitHub API error: 401" | Invalid GitHub token |
| Rate limit exceeded | Get GitHub token: `GITHUB_TOKEN=ghp_xxx` |
| Script not found | Make executable: `chmod +x scripts/analyze-repo` |
| Need Node/Python | Install Node.js 14+ or Python 3.6+ |

## Prerequisites

- **Node.js 14+** OR **Python 3.6+**
- **GitHub API access** (automatic for public repos)
- Optional: **GitHub token** for higher rate limits

## More Information

- Full documentation: [docs/tools/repository-analyzer.md](../docs/tools/repository-analyzer.md)
- AI integration guide: [docs/tools/ai-integration.md](../docs/tools/ai-integration.md)
- Scripts directory: [scripts/README.md](../scripts/README.md)

## Examples

### Analyze React
```bash
./scripts/analyze-repo facebook/react
```

### Analyze Kubernetes
```bash
./scripts/analyze-repo kubernetes/kubernetes
```

### Generate Report
```bash
./scripts/analyze-repo myorg/myrepo > text-report.txt
OUTPUT_FORMAT=json ./scripts/analyze-repo myorg/myrepo > report.json
```

### Find Missing Areas
```bash
OUTPUT_FORMAT=json ./scripts/analyze-repo myorg/myrepo | jq '.categories | to_entries | map(select(.value.score < 70)) | .[] | .key'
```

## Quick Links

- [Repository Analyzer Docs](../docs/tools/repository-analyzer.md)
- [AI Integration Examples](../docs/tools/ai-integration.md)
- [Scripts Directory](../scripts/README.md)
- [GitHub API Rate Limits](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api)
