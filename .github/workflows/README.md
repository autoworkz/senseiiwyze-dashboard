# AI Agent GitHub Workflows

This directory contains GitHub Actions workflows for managing AI agent activation issues.

## Workflows

### 1. 🤖 AI Agent Issue Management (`ai-agent-issue.yml`)

**Purpose**: Automatically manages the AI agent activation issue to ensure it always exists with the correct label.

**Triggers**:
- ⏰ **Scheduled**: Runs every hour (`0 * * * *`)
- 🔄 **Issue Events**: Responds to issue changes (closed, labeled, unlabeled)
- 👆 **Manual**: Can be triggered manually via workflow_dispatch

**Logic**:
1. Checks for existing issues with the `ai-agent-active` label
2. If no labeled issue exists, looks for issues with the title "🤖 AI Agent Activation"
3. Adds the label to existing unlabeled issues
4. Creates a new issue if none exists
5. Validates the final state and reports results

**Features**:
- ✅ Comprehensive validation and error handling
- 📊 Detailed logging and reporting
- 🔄 Automatic recovery from edge cases
- 🛡️ Minimal required permissions

### 2. 🚀 Create AI Agent Issue (`create-ai-agent-issue.yml`)

**Purpose**: Simplified manual workflow for immediate AI agent issue creation/management.

**Triggers**:
- 👆 **Manual Only**: workflow_dispatch with optional force creation

**Options**:
- `force_create`: Creates a new issue even if one already exists

**Use Cases**:
- Testing the issue creation process
- Immediate activation of AI agents
- Recovery from workflow failures

### 3. 🧪 Test AI Agent Workflows (`test-ai-agent-workflows.yml`)

**Purpose**: Comprehensive testing suite for validating all workflow scenarios.

**Test Scenarios**:
- **No existing issue**: Tests creation from scratch
- **Issue without label**: Tests label addition
- **Issue with label**: Tests detection of existing valid issues
- **Multiple issues**: Tests handling of complex scenarios
- **Cleanup**: Removes test artifacts

**Usage**:
```bash
# Run all tests
Go to Actions → "Test AI Agent Workflows" → Run workflow → Select "all"

# Run specific test
Go to Actions → "Test AI Agent Workflows" → Run workflow → Select scenario
```

## Configuration

### Labels
- **Primary**: `ai-agent-active` - Required for AI agent activation
- **Test Labels**: Various test-specific labels for isolation

### Issue Title
- **Standard**: `🤖 AI Agent Activation`
- **Test Variations**: Include "(Test)" suffix for test scenarios

### Permissions Required
```yaml
permissions:
  issues: write
  contents: read
```

## Usage Instructions

### Quick Start
1. **Immediate Activation**: 
   - Go to Actions → "Create AI Agent Issue" → Run workflow
   
2. **Automatic Management**: 
   - The system runs hourly automatically
   - Responds to issue state changes

3. **Testing**:
   - Go to Actions → "Test AI Agent Workflows" → Run workflow
   - Select "all" to run comprehensive tests

### Monitoring
- Check the Actions tab for workflow runs
- Review logs for detailed operation reports
- Monitor issue #[number] for the AI agent activation issue

### Troubleshooting

**Issue doesn't have the label**:
- Wait for the next hourly run, or
- Manually trigger "AI Agent Issue Management"

**Multiple issues exist**:
- The workflow will use the first one found with the label
- Run cleanup via the test workflow if needed

**Permissions errors**:
- Verify the repository has Actions enabled
- Check that the workflow has the required permissions

**Validation failures**:
- Check workflow logs for specific error details
- Ensure the repository allows issue creation
- Verify GitHub token permissions

## Workflow Outputs

Each workflow provides structured outputs:

```yaml
action: "exists" | "labeled" | "created"
issue-number: "123"
issue-url: "https://github.com/owner/repo/issues/123"
validation: "passed" | "failed" | "error"
```

## Testing Strategy

The test workflow covers:

1. **Scenario Coverage**:
   - ✅ No existing issue (creation test)
   - ✅ Issue without label (labeling test)
   - ✅ Issue with label (detection test)
   - ✅ Multiple issues (selection test)

2. **Validation Checks**:
   - Issue existence
   - Correct state (open)
   - Proper labeling
   - Title accuracy

3. **Cleanup**:
   - Automatic test artifact removal
   - Safe isolation of test data

## Best Practices

1. **Regular Testing**: Run the test workflow monthly
2. **Monitor Logs**: Review workflow logs for any warnings
3. **Label Management**: Don't manually remove the `ai-agent-active` label
4. **Issue Preservation**: Keep the AI agent issue open for continuous activation

## Support

For issues with these workflows:
1. Check the workflow logs in the Actions tab
2. Run the test workflow to diagnose problems
3. Review this documentation for configuration details
4. Verify repository permissions and settings