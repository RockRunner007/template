# Repository Compliance Analyzer

Tool to check if a GitHub repository has all the recommended documentation and practices from this template.

## Overview

The analyzer checks your repository against best practices and provides:
- ✅ Compliance score (0-100%)
- 📊 Category breakdown (documentation, governance, testing, etc.)
- 📋 Specific recommendations for improvement
- 🤖 Machine-readable JSON output for automation

## Use Cases

### For Individual Contributors
Check if your project needs documentation improvements:
```bash
node scripts/analyze-repo.js myorg/myrepo
```

### For Team Leads
Monitor repository health across multiple projects:
```bash
for repo in repo1 repo2 repo3; do
  node scripts/analyze-repo.js myorg/$repo
done
```

### For AI/Automation
Get machine-readable results for automation:
```bash
OUTPUT_FORMAT=json node scripts/analyze-repo.js myorg/myrepo > analysis.json
```

### For CI/CD Pipelines
Fail the build if compliance is too low:
```bash
node scripts/analyze-repo.js myorg/myrepo | grep "Overall" | grep -E "[0-5][0-9]" && exit 1
```

## Installation

### Node.js Version

Prerequisites:
- Node.js 14+ installed

Usage:
```bash
# Analyze a repository
node scripts/analyze-repo.js owner/repo

# Example
node scripts/analyze-repo.js RockRunner007/template

# With GitHub token (for higher rate limits)
GITHUB_TOKEN=ghp_xxxx node scripts/analyze-repo.js owner/repo

# Get JSON output
OUTPUT_FORMAT=json node scripts/analyze-repo.js owner/repo
```

### Python Version

Prerequisites:
- Python 3.6+ installed

Usage:
```bash
# Analyze a repository
python3 scripts/analyze-repo.py owner/repo

# Example
python3 scripts/analyze-repo.py RockRunner007/template

# With GitHub token
GITHUB_TOKEN=ghp_xxxx python3 scripts/analyze-repo.py owner/repo

# Get JSON output
OUTPUT_FORMAT=json python3 scripts/analyze-repo.py owner/repo
```

## Output Format

### Text Output (Default)

```
======================================================================
Repository Analysis: owner/repo
======================================================================

🟡 Overall Compliance Score: 72/100

Category Breakdown:
----------------------------------------------------------------------
documentation       [████████████████░░] 90/100 (45/50 points)
governance          [██████████░░░░░░░░] 60/100 (30/50 points)
lifecycle           [████████░░░░░░░░░░] 40/100 (20/50 points)
...

Content Quality Checks:
----------------------------------------------------------------------
✓ README.md quality: 85/100
  Contains 4/4 recommended sections
✗ CONTRIBUTING.md quality: 0/100
  File not found
✓ SECURITY.md quality: 70/100
  Contains 3/4 recommended sections

Recommendations for Improvement:
----------------------------------------------------------------------

🔴 HIGH PRIORITY:

1. Governance: Missing governance documentation
   Suggestion: Add code review standards, change management, and onboarding guides
   Impact: Team lacks clear processes and standards

2. Documentation: CONTRIBUTING.md incomplete
   Suggestion: Document contribution process, testing requirements, and PR guidelines
   Impact: Contributors lack clear guidance

🟡 MEDIUM PRIORITY:

1. Lifecycle: Missing lifecycle documentation
   Suggestion: Add feature lifecycle, release management, and deprecation policy
   Impact: Unclear feature and release processes

======================================================================
```

### JSON Output

```bash
OUTPUT_FORMAT=json node scripts/analyze-repo.js owner/repo
```

```json
{
  "repository": "owner/repo",
  "timestamp": "2024-01-19T15:30:45.123Z",
  "overallScore": 72,
  "categories": {
    "documentation": {
      "score": 90,
      "points": 45,
      "maxPoints": 50
    },
    "governance": {
      "score": 60,
      "points": 30,
      "maxPoints": 50
    }
  },
  "quality": {
    "readme": {
      "found": true,
      "score": 85,
      "description": "README.md quality",
      "details": "Contains 4/4 recommended sections"
    }
  },
  "recommendations": [
    {
      "priority": "HIGH",
      "area": "Governance",
      "issue": "Missing governance documentation",
      "suggestion": "Add code review standards, change management, and onboarding guides",
      "impact": "Team lacks clear processes and standards"
    }
  ]
}
```

## Score Interpretation

| Score | Status | Meaning |
|-------|--------|---------|
| 90-100 | 🟢 Excellent | Comprehensive compliance with template |
| 80-89 | 🟢 Good | Most documentation in place, minor gaps |
| 70-79 | 🟡 Fair | Core documentation present, some gaps |
| 60-69 | 🟡 Needs Work | Missing several key documents |
| 0-59 | 🔴 Critical | Significant gaps in documentation |

## What Gets Checked

### Documentation (Weight: 50 points)
- `README.md` - Project overview (with 4+ sections)
- `CONTRIBUTING.md` - Contribution guidelines (with 4+ sections)
- `SECURITY.md` - Security policy (with 4+ sections)
- `CODE_OF_CONDUCT.md` - Community guidelines
- `LICENSE` - License file

### Governance (Weight: 24 points)
- `docs/governance/code-review-standards.md` - Code review process
- `docs/governance/change-management.md` - Change control
- `docs/governance/onboarding.md` - Team onboarding
- `docs/governance/dependency-management.md` - Dependency updates

### Lifecycle (Weight: 19 points)
- `docs/lifecycle/feature-lifecycle.md` - Feature process
- `docs/lifecycle/release-management.md` - Release process
- `docs/lifecycle/deprecation-policy.md` - Deprecation timeline

### Infrastructure (Weight: 21 points)
- `docs/infrastructure-overview.md` - Architecture docs
- `docs/environment-strategy.md` - Environment management
- `docs/runbooks/` - Operational runbooks

### Testing (Weight: 20 points)
- `docs/testing/test-pyramid.md` - Testing strategy
- `docs/testing/security-testing.md` - Security testing
- `docs/testing/performance-testing.md` - Performance testing

### Specifications (Weight: 15 points)
- `specs/` - Specifications directory
- `specs/readme.md` - Specs documentation

### CI/CD (Weight: 8 points)
- `.github/workflows/` - GitHub Actions workflows

### Examples (Weight: 5 points)
- `example/` - Example implementations

## Environment Variables

### GITHUB_TOKEN

Increase API rate limits (recommended for checking multiple repos):

```bash
# Get your token from: https://github.com/settings/tokens
# Required scopes: repo (for private repos) or public_repo (for public)
export GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

node scripts/analyze-repo.js owner/repo
```

**Note:** Without a token, you're limited to 60 API requests per hour per IP.

### OUTPUT_FORMAT

Choose output format:

```bash
# Text output (human-readable, default)
OUTPUT_FORMAT=text node scripts/analyze-repo.js owner/repo

# JSON output (machine-readable)
OUTPUT_FORMAT=json node scripts/analyze-repo.js owner/repo
```

## Examples

### Basic Usage

```bash
# Check your own repository
node scripts/analyze-repo.js myorg/myproject

# Check a public repository
node scripts/analyze-repo.js facebook/react

# Check multiple repositories
for repo in app-api app-web app-mobile; do
  echo "=== Checking $repo ==="
  node scripts/analyze-repo.js myorg/$repo
done
```

### With GitHub Token

```bash
# Set token (one time, or add to .bashrc/.zshrc)
export GITHUB_TOKEN=ghp_xxxx

# Now check without rate limiting
node scripts/analyze-repo.js myorg/myrepo
```

### JSON Processing

```bash
# Get score only
OUTPUT_FORMAT=json node scripts/analyze-repo.js owner/repo | jq '.overallScore'

# Get all high-priority recommendations
OUTPUT_FORMAT=json node scripts/analyze-repo.js owner/repo | \
  jq '.recommendations[] | select(.priority == "HIGH")'

# Save report to file
OUTPUT_FORMAT=json node scripts/analyze-repo.js owner/repo > report.json

# Generate HTML report
python3 scripts/generate-html-report.py report.json > report.html
```

### CI/CD Integration

#### GitHub Actions

```yaml
name: Repository Compliance Check

on: [pull_request, schedule: [{cron: '0 9 * * 1'}]]

jobs:
  compliance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Analyze repository compliance
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          OUTPUT_FORMAT: json
        run: |
          node scripts/analyze-repo.js ${{ github.repository }} > compliance.json
          
          SCORE=$(jq '.overallScore' compliance.json)
          echo "Compliance Score: $SCORE/100"
          
          if [ $SCORE -lt 70 ]; then
            echo "❌ Repository compliance below 70%"
            jq '.recommendations[]' compliance.json
            exit 1
          fi
          
          echo "✅ Repository meets compliance standards"

      - name: Upload compliance report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: compliance-report
          path: compliance.json
```

#### Local Git Hook

Create `.git/hooks/pre-push`:

```bash
#!/bin/bash
REPO=$(git config --get remote.origin.url | grep -o '[^/:]*\/[^/]*$' | sed 's/.git//')
SCORE=$(OUTPUT_FORMAT=json node scripts/analyze-repo.js $REPO 2>/dev/null | jq '.overallScore')

if [ $SCORE -lt 70 ]; then
  echo "⚠️  Repository compliance is $SCORE%. Consider addressing recommendations before pushing."
  read -p "Push anyway? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi
```

Make executable:
```bash
chmod +x .git/hooks/pre-push
```

## Improving Your Score

### Minimum viable compliance (70+)

1. ✅ Add/improve README.md (with installation, usage, license sections)
2. ✅ Add/improve CONTRIBUTING.md (with process, testing, guidelines)
3. ✅ Add SECURITY.md (with vulnerability reporting process)
4. ✅ Add CODE_OF_CONDUCT.md
5. ✅ Create docs/governance/ directory with code review standards

### Good compliance (80+)

Add to the above:
- ✅ docs/lifecycle/ with feature and release documentation
- ✅ docs/infrastructure-overview.md with architecture
- ✅ docs/environment-strategy.md with environment details
- ✅ docs/testing/ with testing strategy
- ✅ GitHub Actions workflows in .github/workflows/

### Excellent compliance (90+)

Add to the above:
- ✅ Complete docs/governance/ with all 4 files
- ✅ Complete docs/lifecycle/ with all 3 files
- ✅ Complete docs/testing/ with all 3 files
- ✅ examples/ with working code examples
- ✅ specs/ with documented specifications

## Troubleshooting

### "GitHub API error: 401"
- Check your GitHub token is valid
- Regenerate token if expired

### "GitHub API error: 404"
- Verify repository exists and is public (or you have access)
- Check owner/repo format

### Rate limiting (60 requests/hour)
- Set GITHUB_TOKEN environment variable
- Wait an hour before running again
- Or check fewer repositories

### Script hangs
- Check your internet connection
- Verify GitHub is accessible
- Try with a specific repository first

## Contributing

To improve the analyzer:

1. Add new file types to `TEMPLATE_FILES` in the script
2. Add new quality checks to `QUALITY_CHECKS`
3. Update recommendation logic in `getRecommendations()`
4. Test against known good/bad repositories

## References

- [GitHub API Documentation](https://docs.github.com/en/rest)
- [Template Repository](https://github.com/RockRunner007/template)
- [Best Practices Guide](../README.md)
