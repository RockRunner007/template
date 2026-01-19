# Scripts Directory

Utility scripts for template repository management and analysis.

## Scripts

### analyze-repo - Repository Compliance Analyzer

Analyzes any GitHub repository against this template and provides recommendations.

#### Quick Start

```bash
# Make executable
chmod +x scripts/analyze-repo

# Analyze any repository
./scripts/analyze-repo owner/repo

# Example
./scripts/analyze-repo facebook/react
```

#### Supported Formats

**Text output (default):**
```bash
./scripts/analyze-repo RockRunner007/template
```

**JSON output:**
```bash
OUTPUT_FORMAT=json ./scripts/analyze-repo RockRunner007/template
```

#### With GitHub Token

For higher rate limits and checking private repos:

```bash
export GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
./scripts/analyze-repo owner/repo
```

#### Node.js or Python

The wrapper script automatically uses:
- Node.js if available (`node scripts/analyze-repo.js`)
- Falls back to Python 3 if Node.js not found (`python3 scripts/analyze-repo.py`)

Requirements:
- Node.js 14+ OR Python 3.6+
- GitHub API access (no auth required for public repos)

#### Output

```
======================================================================
Repository Analysis: owner/repo
======================================================================

🟢 Overall Compliance Score: 85/100

Category Breakdown:
documentation       [████████████████████] 100/100 (50/50 points)
governance          [████████████░░░░░░░░] 65/100 (15/24 points)
lifecycle           [████████░░░░░░░░░░░░] 42/100 (8/19 points)
...

Recommendations for Improvement:
🔴 HIGH PRIORITY:
1. Governance: Missing governance documentation

🟡 MEDIUM PRIORITY:
1. Lifecycle: Missing lifecycle documentation
```

#### Use Cases

**Team health monitoring:**
```bash
for repo in backend frontend mobile api; do
  echo "=== Checking $repo ==="
  ./scripts/analyze-repo myorg/$repo
done
```

**CI/CD integration:**
```yaml
# .github/workflows/compliance-check.yml
- name: Check compliance
  run: |
    SCORE=$(OUTPUT_FORMAT=json ./scripts/analyze-repo ${{ github.repository }} | jq '.overallScore')
    if [ $SCORE -lt 70 ]; then
      echo "Compliance score $SCORE is below 70%"
      exit 1
    fi
```

**Generate reports:**
```bash
OUTPUT_FORMAT=json ./scripts/analyze-repo owner/repo > report.json
# Process with jq, python, node, etc.
```

#### For More Info

See [docs/tools/repository-analyzer.md](../docs/tools/repository-analyzer.md) for:
- Detailed installation instructions
- Complete usage examples
- CI/CD pipeline integration
- Score interpretation guide
- Troubleshooting

## Adding New Scripts

Follow this template:

```bash
#!/bin/bash
# 
# Script Name - Description
# 
# Usage: ./scripts/script-name [options]
# 
# Options:
#   --option      Description
#   --help        Show this help

set -e

# Implementation here
```

### Requirements

- ✅ Shebang line (`#!/bin/bash` or `#!/usr/bin/env node`)
- ✅ Usage comments at top
- ✅ Make executable: `chmod +x scripts/script-name`
- ✅ Document in this README
- ✅ Add to [docs/tools/](../docs/tools/) if complex

### Best Practices

1. Use `set -e` to fail on errors
2. Check arguments early and show usage
3. Support environment variables for configuration
4. Handle errors gracefully
5. Document with comments for complex logic
6. Test before committing

## Running Scripts

All scripts should be executable from repository root:

```bash
# From repo root
./scripts/analyze-repo owner/repo

# From anywhere with absolute path
/path/to/repo/scripts/analyze-repo owner/repo

# Or explicitly invoke
bash scripts/analyze-repo owner/repo
node scripts/analyze-repo.js owner/repo
python3 scripts/analyze-repo.py owner/repo
```

## Environment Variables

Common environment variables used by scripts:

- `GITHUB_TOKEN` - GitHub API authentication token
- `OUTPUT_FORMAT` - Output format (text, json)
- `DEBUG` - Enable debug output
- `QUIET` - Suppress non-essential output

## References

- [docs/tools/repository-analyzer.md](../docs/tools/repository-analyzer.md) - Analyzer documentation
- [Repository Root](../) - Main template repository
