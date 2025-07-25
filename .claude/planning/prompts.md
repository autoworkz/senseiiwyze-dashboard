# Planning Mode Prompts for Claude Code

## Context Setting Prompt
"I'm entering planning mode. Please:
1. Read my current activeContext.md and progress.md
2. Review my recent commits with git log --oneline -10  
3. Help me assess if I'm on the right track with my project goals
4. Check if my Memory Bank needs updates"

## Quick Planning Prompt
"Let's do a quick planning check:
- Review my activeContext.md - am I focused on the right things?
- Are my current tasks aligned with project goals?
- What's the most important work to focus on next?
- Should I update any Memory Bank files?"

## Deep Planning Prompt
"Let's do a comprehensive strategic review:
1. **Memory Bank Health**: Review all .claude/memory-bank/*.md files - are they current and accurate?
2. **Strategic Alignment**: Are we building the right things for users?
3. **Technical Direction**: What assumptions should we validate or decisions should we revisit?
4. **Resource Optimization**: What could we simplify, defer, or accelerate?
5. **Memory Bank Updates**: What insights from this session should be captured?"

## Course Correction Prompt
"Based on current progress and Memory Bank state, help me:
1. Identify any misalignments with project goals
2. Spot potential risks or technical debt
3. Prioritize next steps for maximum impact
4. Update Memory Bank with new insights and decisions"

## Settings Page Focus Prompt
"Let's plan the settings page account context implementation:
1. Review current account context patterns in the codebase
2. Design seamless personal vs team account switching
3. Plan settings persistence for each account context
4. Ensure UI clearly indicates current account context
5. Update Memory Bank with implementation decisions"

## Dashboard Integration Review Prompt
"Let's review our dashboard implementation strategy:
1. Assess current dashboard components (executive, user, program readiness)
2. Evaluate integration with authentication flow
3. Review data flow and state management patterns
4. Plan next dashboard features or improvements
5. Update systemPatterns.md with any new architectural insights"