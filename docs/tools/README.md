# Tools Directory

Collection of utilities for template management, analysis, and automation.

## Available Tools

### Repository Compliance Analyzer

**Purpose:** Analyze any GitHub repository against this template's best practices.

**What it checks:**
- Documentation completeness (README, CONTRIBUTING, SECURITY, etc.)
- Governance processes (code review, change management, onboarding)
- Lifecycle management (feature, release, deprecation)
- Infrastructure documentation (architecture, environments)
- Testing strategy (pyramid, security, performance)
- Specification-driven development setup
- CI/CD workflows (GitHub Actions)
- Example implementations

**Output:**
- 📊 Compliance score (0-100%)
- 📋 Category breakdown with scores
- 🎯 Specific recommendations (high/medium priority)
- 🤖 Machine-readable JSON for automation

**Usage:**
```bash
./scripts/analyze-repo owner/repo
```

**Examples:**
- [Quick Start Guide](QUICK-START.md) - Get running in 2 minutes
- [Full Documentation](repository-analyzer.md) - Complete reference
- [AI Integration Guide](ai-integration.md) - Use with LLMs and automation

---

## Quick Reference

### Repository Analyzer

| Task | Command |
|------|---------|
| Analyze repository | `./scripts/analyze-repo owner/repo` |
| Get JSON output | `OUTPUT_FORMAT=json ./scripts/analyze-repo owner/repo` |
| With GitHub token | `GITHUB_TOKEN=xxx ./scripts/analyze-repo owner/repo` |
| Get just score | `OUTPUT_FORMAT=json ./scripts/analyze-repo owner/repo \| jq '.overallScore'` |
| Batch check | `for repo in r1 r2 r3; do ./scripts/analyze-repo org/$repo; done` |

### Interpret Results

| Score | Status | Action |
|-------|--------|--------|
| 90-100 | 🟢 Excellent | Maintain standards |
| 80-89 | 🟢 Good | Minor improvements |
| 70-79 | 🟡 Fair | Address gaps |
| 60-69 | 🟡 Needs Work | Priority improvements |
| 0-59 | 🔴 Critical | Major overhaul needed |

---

## For AI/Automation

### Machine-Readable Output

Get structured JSON for processing by AI or automation:

```bash
OUTPUT_FORMAT=json ./scripts/analyze-repo owner/repo > report.json
```

### Process Results

**With jq:**
```bash
# Get score
jq '.overallScore' report.json

# Get recommendations
jq '.recommendations | sort_by(.priority)' report.json
```

**With Python:**
```python
import json
with open('report.json') as f:
    data = json.load(f)
    print(f"Score: {data['overallScore']}")
    print(f"Issues: {len(data['recommendations'])}")
```

### Integrate with CI/CD

**GitHub Actions:**
```yaml
- name: Check compliance
  run: |
    SCORE=$(OUTPUT_FORMAT=json ./scripts/analyze-repo ${{ github.repository }} | jq '.overallScore')
    [ $SCORE -ge 70 ] || exit 1
```

**Local Git Hook:**
```bash
# .git/hooks/pre-push
SCORE=$(OUTPUT_FORMAT=json ./scripts/analyze-repo $(git config --get remote.origin.url | grep -o '[^/:]*\/[^/]*$') | jq '.overallScore')
[ $SCORE -ge 70 ] || exit 1
```

---

## Documentation

- [QUICK-START.md](QUICK-START.md) - Get started in 2 minutes
- [repository-analyzer.md](repository-analyzer.md) - Complete reference guide
- [ai-integration.md](ai-integration.md) - Examples for LLMs and automation
- [../scripts/README.md](../scripts/README.md) - Scripts directory overview

---

## Requirements

### Node.js Version
- Node.js 14 or higher
- No additional dependencies (uses built-in HTTPS module)

### Python Version
- Python 3.6 or higher
- No external dependencies (uses built-in urllib and json)

### GitHub Access
- Public repositories: No authentication needed
- Private repositories: Requires `GITHUB_TOKEN`
- Rate limits: 60 requests/hour without token, 5,000/hour with token

---

## Examples

### Basic Usage

```bash
# Analyze your team's repositories
./scripts/analyze-repo myorg/backend
./scripts/analyze-repo myorg/frontend
./scripts/analyze-repo myorg/mobile

# Analyze popular open source
./scripts/analyze-repo facebook/react
./scripts/analyze-repo google/go-cloud
./scripts/analyze-repo python/cpython
```

### With Reports

```bash
# Generate text report
./scripts/analyze-repo myorg/myrepo > report.txt

# Generate JSON report
OUTPUT_FORMAT=json ./scripts/analyze-repo myorg/myrepo > report.json

# Generate HTML report (requires html-report tool)
python3 scripts/generate-html-report.py report.json > report.html
```

### Automation

```bash
# Check all repos in organization
for repo in $(gh api user/repos --jq '.[].name'); do
  echo "=== $repo ==="
  ./scripts/analyze-repo myorg/$repo | grep "Overall"
done

# Create GitHub issues for high-priority items
OUTPUT_FORMAT=json ./scripts/analyze-repo myorg/myrepo | \
  jq '.recommendations[] | select(.priority == "HIGH")' | \
  # Process to create issues
```

---

## Troubleshooting

### "GitHub API error: 404"
- Verify repository exists: `gh repo view owner/repo`
- Check spelling of owner/repo
- Private repos need GITHUB_TOKEN

### "GitHub API error: 401"
- GitHub token is invalid or expired
- Generate new token: https://github.com/settings/tokens
- Set environment variable: `export GITHUB_TOKEN=...`

### Rate Limited
- Without token: 60 requests/hour limit
- Set GitHub token: `GITHUB_TOKEN=ghp_xxx ./scripts/analyze-repo ...`
- Wait 1 hour for limit to reset

### Script Not Found
- Make executable: `chmod +x scripts/analyze-repo`
- Verify Node.js or Python installed: `node --version` or `python3 --version`

---

## Adding New Tools

To add a new tool to this directory:

1. **Create the tool** (bash, node, python, etc.)
2. **Add shebang** and usage comments
3. **Make executable**: `chmod +x scripts/tool-name`
4. **Document** in this README
5. **Add full docs** in `docs/tools/tool-name.md` if complex
6. **Test** before committing

Template:
```bash
#!/bin/bash
# Tool Name - Description
# Usage: ./scripts/tool-name [options]

set -e

# Check arguments
if [ $# -eq 0 ]; then
  echo "Usage: $0 [options]"
  exit 1
fi

# Implementation...
```

---

## References

- [Quick Start Guide](QUICK-START.md)
- [Repository Analyzer Docs](repository-analyzer.md)
- [AI Integration Guide](ai-integration.md)
- [GitHub API Documentation](https://docs.github.com/en/rest)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
