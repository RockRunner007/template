#!/usr/bin/env python3

"""
Repository Compliance Analyzer

Analyzes a GitHub repository against the template and provides
recommendations for missing or incomplete areas.

Usage:
    python3 scripts/analyze-repo.py <owner>/<repo>
    python3 scripts/analyze-repo.py RockRunner007/template

Environment variables:
    GITHUB_TOKEN - GitHub API token for higher rate limits
    OUTPUT_FORMAT - output format: "text" or "json" (default: text)
"""

import sys
import json
import os
import base64
import urllib.request
import urllib.error
from typing import Dict, List, Tuple, Optional
from datetime import datetime

# Configuration
TEMPLATE_FILES = {
    'documentation': {
        'README.md': {'weight': 10, 'description': 'Project overview'},
        'CONTRIBUTING.md': {'weight': 8, 'description': 'Contribution guidelines'},
        'SECURITY.md': {'weight': 8, 'description': 'Security policy'},
        'CODE_OF_CONDUCT.md': {'weight': 5, 'description': 'Code of conduct'},
        'LICENSE': {'weight': 10, 'description': 'License file'},
    },
    'governance': {
        'docs/governance/code-review-standards.md': {'weight': 7, 'description': 'Code review standards'},
        'docs/governance/change-management.md': {'weight': 6, 'description': 'Change management process'},
        'docs/governance/onboarding.md': {'weight': 6, 'description': 'Team onboarding guide'},
        'docs/governance/dependency-management.md': {'weight': 5, 'description': 'Dependency management'},
    },
    'lifecycle': {
        'docs/lifecycle/feature-lifecycle.md': {'weight': 7, 'description': 'Feature lifecycle'},
        'docs/lifecycle/release-management.md': {'weight': 7, 'description': 'Release management'},
        'docs/lifecycle/deprecation-policy.md': {'weight': 5, 'description': 'Deprecation policy'},
    },
    'infrastructure': {
        'docs/infrastructure-overview.md': {'weight': 8, 'description': 'Infrastructure overview'},
        'docs/environment-strategy.md': {'weight': 7, 'description': 'Environment strategy'},
        'docs/runbooks/': {'weight': 6, 'description': 'Runbooks directory'},
    },
    'testing': {
        'docs/testing/test-pyramid.md': {'weight': 7, 'description': 'Testing strategy'},
        'docs/testing/security-testing.md': {'weight': 7, 'description': 'Security testing guide'},
        'docs/testing/performance-testing.md': {'weight': 6, 'description': 'Performance testing'},
    },
    'specs': {
        'specs/': {'weight': 8, 'description': 'Specs directory'},
        'specs/readme.md': {'weight': 7, 'description': 'Specs documentation'},
    },
    'workflows': {
        '.github/workflows/': {'weight': 8, 'description': 'GitHub Actions workflows'},
    },
    'examples': {
        'example/': {'weight': 5, 'description': 'Example implementations'},
    },
}

QUALITY_CHECKS = {
    'readme': {
        'minLength': 500,
        'shouldInclude': ['installation', 'usage', 'contributing', 'license'],
        'description': 'README quality',
    },
    'contributing': {
        'minLength': 300,
        'shouldInclude': ['guidelines', 'process', 'tests', 'pull request'],
        'description': 'Contributing guide quality',
    },
    'security': {
        'minLength': 200,
        'shouldInclude': ['vulnerability', 'report', 'responsible', 'disclosure'],
        'description': 'Security policy quality',
    },
}


def make_github_request(path: str) -> dict:
    """Make a request to GitHub API"""
    url = f'https://api.github.com{path}'
    headers = {
        'User-Agent': 'RepoAnalyzer',
        'Accept': 'application/vnd.github.v3+json',
    }
    
    token = os.environ.get('GITHUB_TOKEN')
    if token:
        headers['Authorization'] = f'token {token}'
    
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode())
    except urllib.error.HTTPError as e:
        if e.code == 404:
            return None
        raise Exception(f'GitHub API error: {e.code}')


def get_file_content(owner: str, repo: str, file_path: str) -> Optional[str]:
    """Get file content from GitHub repo"""
    try:
        data = make_github_request(f'/repos/{owner}/{repo}/contents/{file_path}')
        if data and 'content' in data:
            return base64.b64decode(data['content']).decode('utf-8')
        return None
    except:
        return None


def calculate_score(points: int, max_points: int) -> int:
    """Calculate percentage score"""
    if max_points == 0:
        return 0
    return round((points / max_points) * 100)


def get_recommendations(results: dict) -> List[dict]:
    """Generate recommendations based on analysis"""
    recommendations = []
    
    doc_score = results['categories']['documentation']['score']
    if doc_score < 80:
        recommendations.append({
            'priority': 'HIGH',
            'area': 'Documentation',
            'issue': 'Missing core documentation files',
            'suggestion': 'Add README.md, CONTRIBUTING.md, SECURITY.md files',
            'impact': 'Developers cannot understand project or contribute effectively',
        })
    
    gov_score = results['categories']['governance']['score']
    if gov_score < 70:
        recommendations.append({
            'priority': 'HIGH',
            'area': 'Governance',
            'issue': 'Missing governance documentation',
            'suggestion': 'Add code review standards, change management, and onboarding guides',
            'impact': 'Team lacks clear processes and standards',
        })
    
    test_score = results['categories']['testing']['score']
    if test_score < 60:
        recommendations.append({
            'priority': 'MEDIUM',
            'area': 'Testing',
            'issue': 'Missing testing strategy documentation',
            'suggestion': 'Document test pyramid, security testing, and performance testing approaches',
            'impact': 'Team may lack consistency in testing practices',
        })
    
    lifecycle_score = results['categories']['lifecycle']['score']
    if lifecycle_score < 70:
        recommendations.append({
            'priority': 'MEDIUM',
            'area': 'Lifecycle',
            'issue': 'Missing lifecycle documentation',
            'suggestion': 'Add feature lifecycle, release management, and deprecation policy',
            'impact': 'Unclear feature and release processes',
        })
    
    infra_score = results['categories']['infrastructure']['score']
    if infra_score < 70:
        recommendations.append({
            'priority': 'MEDIUM',
            'area': 'Infrastructure',
            'issue': 'Missing infrastructure documentation',
            'suggestion': 'Document infrastructure overview, environments, and deployment strategy',
            'impact': 'Operations lack clear infrastructure guidance',
        })
    
    specs_score = results['categories']['specs']['score']
    if specs_score < 80:
        recommendations.append({
            'priority': 'MEDIUM',
            'area': 'Specifications',
            'issue': 'Missing or incomplete specification examples',
            'suggestion': 'Create specs/ directory with documented examples',
            'impact': 'Team may not be using specification-driven development',
        })
    
    workflow_score = results['categories']['workflows']['score']
    if workflow_score < 80:
        recommendations.append({
            'priority': 'MEDIUM',
            'area': 'CI/CD',
            'issue': 'Missing GitHub Actions workflows',
            'suggestion': 'Create workflows for testing, linting, and deployment',
            'impact': 'Manual processes prevent automation',
        })
    
    if results['quality']['readme']['score'] < 70:
        recommendations.append({
            'priority': 'HIGH',
            'area': 'Documentation',
            'issue': 'README.md needs improvement',
            'suggestion': 'Add installation, usage, contributing, and license sections',
            'impact': 'New users cannot understand project',
        })
    
    if results['quality']['contributing']['score'] < 70:
        recommendations.append({
            'priority': 'HIGH',
            'area': 'Contributing',
            'issue': 'CONTRIBUTING.md incomplete',
            'suggestion': 'Document contribution process, testing requirements, and PR guidelines',
            'impact': 'Contributors lack clear guidance',
        })
    
    return recommendations


def format_results(owner: str, repo: str, results: dict) -> None:
    """Format and print results as text"""
    total_score = results['overallScore']
    score_emoji = '🟢' if total_score >= 80 else '🟡' if total_score >= 60 else '🔴'
    
    print('\n' + '=' * 70)
    print(f"Repository Analysis: {owner}/{repo}".ljust(70))
    print('=' * 70 + '\n')
    
    print(f"{score_emoji} Overall Compliance Score: {total_score}/100\n")
    
    print('Category Breakdown:')
    print('-' * 70)
    for category, data in results['categories'].items():
        bar_length = round(data['score'] / 5)
        bar = '█' * bar_length + '░' * (20 - bar_length)
        print(f"{category.ljust(20)} [{bar}] {data['score']}/100 ({data['points']}/{data['maxPoints']} points)")
    
    print('\n\nContent Quality Checks:')
    print('-' * 70)
    for check, result in results['quality'].items():
        status = '✓' if result['found'] else '✗'
        print(f"{status} {result['description']}: {result['score']}/100")
        if 'details' in result:
            print(f"  {result['details']}")
    
    if results['recommendations']:
        print('\n\nRecommendations for Improvement:')
        print('-' * 70)
        
        high_priority = [r for r in results['recommendations'] if r['priority'] == 'HIGH']
        medium_priority = [r for r in results['recommendations'] if r['priority'] == 'MEDIUM']
        
        if high_priority:
            print('\n🔴 HIGH PRIORITY:')
            for i, rec in enumerate(high_priority, 1):
                print(f"\n{i}. {rec['area']}: {rec['issue']}")
                print(f"   Suggestion: {rec['suggestion']}")
                print(f"   Impact: {rec['impact']}")
        
        if medium_priority:
            print('\n\n🟡 MEDIUM PRIORITY:')
            for i, rec in enumerate(medium_priority, 1):
                print(f"\n{i}. {rec['area']}: {rec['issue']}")
                print(f"   Suggestion: {rec['suggestion']}")
                print(f"   Impact: {rec['impact']}")
    
    print('\n' + '=' * 70 + '\n')


def format_json(owner: str, repo: str, results: dict) -> str:
    """Format results as JSON"""
    return json.dumps({
        'repository': f'{owner}/{repo}',
        'timestamp': datetime.now().isoformat(),
        'overallScore': results['overallScore'],
        'categories': results['categories'],
        'quality': results['quality'],
        'recommendations': results['recommendations'],
    }, indent=2)


def analyze_repository(owner: str, repo: str) -> dict:
    """Analyze GitHub repository"""
    print(f'\nAnalyzing {owner}/{repo}...')
    
    results = {
        'categories': {},
        'quality': {},
        'overallScore': 0,
        'recommendations': [],
    }
    
    total_points = 0
    earned_points = 0
    
    # Check each category
    for category, files in TEMPLATE_FILES.items():
        category_points = 0
        category_max_points = 0
        
        for file_path, metadata in files.items():
            category_max_points += metadata['weight']
            total_points += metadata['weight']
            
            content = get_file_content(owner, repo, file_path)
            if content:
                category_points += metadata['weight']
                earned_points += metadata['weight']
        
        results['categories'][category] = {
            'score': calculate_score(category_points, category_max_points),
            'points': category_points,
            'maxPoints': category_max_points,
        }
    
    # Quality checks
    readme_content = get_file_content(owner, repo, 'README.md')
    if readme_content:
        checks = sum(1 for keyword in QUALITY_CHECKS['readme']['shouldInclude']
                    if keyword in readme_content.lower())
        score = min(100, round((len(readme_content) / QUALITY_CHECKS['readme']['minLength']) * 100 *
                              (checks / len(QUALITY_CHECKS['readme']['shouldInclude']))))
        results['quality']['readme'] = {
            'found': True,
            'score': score,
            'description': 'README.md quality',
            'details': f"Contains {checks}/{len(QUALITY_CHECKS['readme']['shouldInclude'])} recommended sections",
        }
    else:
        results['quality']['readme'] = {
            'found': False,
            'score': 0,
            'description': 'README.md quality',
            'details': 'File not found',
        }
    
    contributing_content = get_file_content(owner, repo, 'CONTRIBUTING.md')
    if contributing_content:
        checks = sum(1 for keyword in QUALITY_CHECKS['contributing']['shouldInclude']
                    if keyword in contributing_content.lower())
        score = min(100, round((len(contributing_content) / QUALITY_CHECKS['contributing']['minLength']) * 100 *
                              (checks / len(QUALITY_CHECKS['contributing']['shouldInclude']))))
        results['quality']['contributing'] = {
            'found': True,
            'score': score,
            'description': 'CONTRIBUTING.md quality',
            'details': f"Contains {checks}/{len(QUALITY_CHECKS['contributing']['shouldInclude'])} recommended sections",
        }
    else:
        results['quality']['contributing'] = {
            'found': False,
            'score': 0,
            'description': 'CONTRIBUTING.md quality',
            'details': 'File not found',
        }
    
    security_content = get_file_content(owner, repo, 'SECURITY.md')
    if security_content:
        checks = sum(1 for keyword in QUALITY_CHECKS['security']['shouldInclude']
                    if keyword in security_content.lower())
        score = min(100, round((len(security_content) / QUALITY_CHECKS['security']['minLength']) * 100 *
                              (checks / len(QUALITY_CHECKS['security']['shouldInclude']))))
        results['quality']['security'] = {
            'found': True,
            'score': score,
            'description': 'SECURITY.md quality',
            'details': f"Contains {checks}/{len(QUALITY_CHECKS['security']['shouldInclude'])} recommended sections",
        }
    else:
        results['quality']['security'] = {
            'found': False,
            'score': 0,
            'description': 'SECURITY.md quality',
            'details': 'File not found',
        }
    
    # Calculate overall score
    category_scores = [c['score'] for c in results['categories'].values()]
    quality_scores = [q['score'] for q in results['quality'].values()]
    all_scores = category_scores + quality_scores
    results['overallScore'] = round(sum(all_scores) / len(all_scores)) if all_scores else 0
    
    # Generate recommendations
    results['recommendations'] = get_recommendations(results)
    
    return results


def main():
    if len(sys.argv) < 2:
        print('Usage: python3 scripts/analyze-repo.py <owner>/<repo>')
        print('Example: python3 scripts/analyze-repo.py RockRunner007/template')
        print('\nEnvironment variables:')
        print('  GITHUB_TOKEN - GitHub API token for higher rate limits')
        print('  OUTPUT_FORMAT - output format: "text" or "json" (default: text)')
        sys.exit(1)
    
    try:
        parts = sys.argv[1].split('/')
        if len(parts) != 2:
            print('Invalid format. Use: owner/repo')
            sys.exit(1)
        
        owner, repo = parts
        output_format = os.environ.get('OUTPUT_FORMAT', 'text')
        
        results = analyze_repository(owner, repo)
        
        if output_format == 'json':
            print(format_json(owner, repo, results))
        else:
            format_results(owner, repo, results)
    
    except Exception as e:
        print(f'\nError analyzing repository: {e}', file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
