# Incremental Testing Approach

## Philosophy: Start Small → Validate → Expand → Scale

When approaching complex testing or implementation problems, always follow this proven pattern:

### 1. Start Small (5-10 minutes)
- Begin with the most basic validation possible
- Fix fundamental issues first (build errors, syntax problems)
- Get one simple thing working before attempting complexity

**Example:** Run `pnpm build` before testing individual pages

### 2. Validate (5-10 minutes)  
- Confirm the small step actually works
- Test the most critical path first
- Verify core functionality before edge cases

**Example:** Test one page in one locale before testing all locales

### 3. Expand (10-15 minutes)
- Gradually increase scope once basics are confirmed
- Add one dimension at a time (more locales, more pages, etc.)
- Maintain working state throughout expansion

**Example:** Test same page across all 5 locales before adding more pages

### 4. Scale (15+ minutes)
- Only after confirming the pattern works at smaller scale
- Use learnings from small tests to optimize large-scale execution
- Implement full automation/orchestration when confident

**Example:** Full Chrome MCP testing across all pages and locales

## Anti-Patterns to Avoid

❌ **Complex First Approach**
- Starting with full parallel orchestration
- Testing everything at once
- Over-engineering before validating core functionality

❌ **Agent Suicide Pattern**
- Spawning 8+ agents simultaneously without coordination validation
- Complex multi-agent workflows without testing 2-agent patterns first
- Agent orchestration without proven communication patterns

❌ **Assumption-Based Testing**  
- Skipping build validation
- Assuming translations work without checking
- Not verifying basic setup before advanced testing

❌ **All-or-Nothing Mentality**
- Requiring complete test coverage immediately
- Not celebrating small wins
- Abandoning approach if any part fails

## Implementation Guidelines

### For Testing Tasks
1. **Build First:** Always run `pnpm build` and `pnpm lint`
2. **Single Page:** Test one route in one locale
3. **Single Dimension:** Expand to all locales for that route  
4. **Full Coverage:** Scale to all routes across all locales

### For Feature Development
1. **Core Logic:** Implement basic functionality
2. **Happy Path:** Test primary user flow
3. **Edge Cases:** Add error handling and validation
4. **Full Feature:** Complete with all requirements

### For Parallel Agent Coordination
1. **Single Agent:** Validate one agent completes the task successfully
2. **Two Agents:** Test basic coordination and communication patterns
3. **Small Team:** Add 1-2 more agents with dependency management
4. **Full Orchestra:** Deploy complete multi-agent architecture

### For Bug Fixes
1. **Reproduce:** Create minimal reproduction case
2. **Root Cause:** Identify specific issue
3. **Targeted Fix:** Implement focused solution
4. **Regression Test:** Ensure fix doesn't break other functionality

## Success Metrics

- ✅ Each step completes successfully before moving to next
- ✅ Issues are caught and fixed early in the process
- ✅ Progress is measurable and can be demonstrated
- ✅ Final result is more reliable due to incremental validation

## Time Investment

- **Total Time:** Often same or less than complex-first approach
- **Confidence Level:** Much higher due to incremental validation
- **Debugging Effort:** Significantly reduced through early issue detection
- **Success Rate:** Higher completion rate with working deliverables

---

**Remember:** Complexity is the enemy of reliability. Start simple, prove it works, then scale with confidence.