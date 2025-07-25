# GitHub Workflow Automation for Open Hands Resolver

## Overview

This project uses automated GitHub workflows to convert Pull Requests into Issues for Open Hands Resolver processing. This ensures that every PR gets the benefit of AI-powered code review and assistance.

## Workflow Components

### 1. PR to Issue Conversion (`pr-to-issue.yml`)

**Triggers**: When a PR is opened, edited, or synchronized

**What it does**:
- Automatically creates an issue from PR content
- Includes PR title, description, author, and files changed
- Adds labels: `pr-{number}`, `auto-generated`, `openhands-trigger`
- Updates existing issues if PR is modified
- Links the issue back to the PR

**Issue Content**:
```
## PR Information
**PR #123**: Add user authentication feature
**Author**: @username
**Branch**: `feature/auth` → `main`
**Status**: open

## Description
[PR description content]

## Files Changed
🟢 `src/auth/login.tsx` (added)
🟡 `src/components/Button.tsx` (modified)
🔴 `src/old/auth.ts` (removed)
```

### 2. Open Hands Resolver (`openhands-resolver.yml`)

**Triggers**: When issues are opened, labeled, or edited (with specific labels)

**What it does**:
- Processes issues with labels: `openhands-trigger`, `auto-generated`, or `pr-*`
- Runs AI-powered code review and suggestions
- Provides automated assistance for code improvements

### 3. Issue Closure (`pr-close-issue.yml`)

**Triggers**: When a PR is closed or merged

**What it does**:
- Automatically closes the corresponding issue
- Adds a closing comment indicating merge status
- Maintains clean issue tracking

## Benefits

1. **Automatic Processing**: Every PR gets AI review without manual intervention
2. **Rich Context**: Issues contain full PR information including file changes
3. **Bidirectional Linking**: PRs and issues are cross-referenced
4. **Clean Lifecycle**: Issues are automatically closed when PRs are resolved
5. **Consistent Labeling**: Clear identification of auto-generated content

## Configuration

### Required GitHub Secrets

- `PAT_TOKEN`: Personal Access Token with repo permissions
- `PAT_USERNAME`: Username for the PAT
- `LLM_API_KEY`: API key for the language model
- `LLM_BASE_URL`: Base URL for the language model API

### Required GitHub Variables

- `OPENHANDS_MACRO`: Macro to trigger Open Hands (default: `@openhands-agent`)
- `OPENHANDS_MAX_ITER`: Maximum iterations (default: 50)
- `LLM_MODEL`: Model to use (default: `accounts/fireworks/models/qwen3-235b-a22b-instruct-2507`)
- `TARGET_BRANCH`: Target branch for changes (default: `main`)

## Usage

### For Developers

1. **Create a PR** as normal
2. **The workflow automatically**:
   - Creates an issue with PR content
   - Triggers Open Hands Resolver
   - Links everything together

3. **Review AI suggestions** in the generated issue
4. **Apply changes** as needed
5. **Close PR** - the issue closes automatically

### For Maintainers

- Monitor auto-generated issues for quality
- Adjust workflow triggers as needed
- Review Open Hands Resolver suggestions
- Manage workflow permissions and secrets

## Troubleshooting

### Issue Not Created
- Check workflow permissions
- Verify PAT token has correct permissions
- Review workflow logs for errors

### Open Hands Not Triggering
- Ensure issue has correct labels
- Check Open Hands Resolver configuration
- Verify API keys and endpoints

### Issue Not Closing
- Check if PR has correct labels
- Verify workflow permissions
- Review workflow logs

## Customization

### Modify Issue Content
Edit the script in `pr-to-issue.yml` to change:
- Issue title format
- Issue body structure
- Labels applied
- File change display

### Adjust Triggers
Modify the `on` sections in workflows to:
- Change when workflows run
- Add additional trigger conditions
- Exclude certain PR types

### Update Labels
Change the label names in:
- `pr-to-issue.yml` (creation labels)
- `openhands-resolver.yml` (trigger conditions)
- `pr-close-issue.yml` (closure detection) 