#!/bin/bash

# Planning Mode Triggers for Memory Bank System
# Make executable with: chmod +x .claude/planning/triggers.sh

check_planning_needed() {
    echo "=== Planning Mode Trigger Check ===" >&2
    
    # Check commit-based trigger
    if git rev-parse --git-dir > /dev/null 2>&1; then
        COMMIT_COUNT=$(git rev-list --count HEAD 2>/dev/null || echo "0")
        PLAN_INTERVAL=5  # Plan every 5 commits
        
        if [ $((COMMIT_COUNT % PLAN_INTERVAL)) -eq 0 ] && [ "$COMMIT_COUNT" -gt 0 ]; then
            echo "🎯 PLANNING MODE TRIGGERED (Commit #$COMMIT_COUNT)" >&2
            echo "Run: claude-code --plan or use Quick Planning Prompt" >&2
            return 0
        fi
    fi
    
    # Check time-based trigger
    SESSION_FILE=".claude/planning/last-session"
    CURRENT_TIME=$(date +%s)
    
    if [ -f "$SESSION_FILE" ]; then
        LAST_PLANNING=$(cat "$SESSION_FILE" 2>/dev/null || echo "0")
        TIME_DIFF=$((CURRENT_TIME - LAST_PLANNING))
        HOURS_SINCE=$((TIME_DIFF / 3600))
        
        if [ "$HOURS_SINCE" -ge 8 ]; then  # 8 hours since last planning
            echo "🎯 Planning mode recommended (${HOURS_SINCE}h since last session)" >&2
            return 0
        fi
    else
        echo "$CURRENT_TIME" > "$SESSION_FILE"
    fi
    
    # Check Memory Bank staleness
    if [ -d ".claude/memory-bank" ]; then
        WEEK_AGO=$((CURRENT_TIME - 604800))  # 7 days in seconds
        STALE_FILES=$(find .claude/memory-bank -name "*.md" -not -newermt "@$WEEK_AGO" 2>/dev/null | wc -l)
        
        if [ "$STALE_FILES" -gt 0 ]; then
            echo "⚠️  Memory Bank files haven't been updated in >1 week" >&2
            echo "Consider running a Deep Planning Session" >&2
        fi
    fi
    
    return 1
}

# Update planning session timestamp
update_planning_timestamp() {
    mkdir -p .claude/planning
    date +%s > .claude/planning/last-session
    echo "Planning session timestamp updated" >&2
}

# Memory Bank health check
memory_bank_health() {
    echo "=== Memory Bank Health Check ===" >&2
    
    if [ ! -d ".claude/memory-bank" ]; then
        echo "❌ Memory Bank not initialized" >&2
        return 1
    fi
    
    CORE_FILES=("projectbrief.md" "activeContext.md" "systemPatterns.md" "progress.md")
    MISSING_FILES=0
    
    for file in "${CORE_FILES[@]}"; do
        if [ ! -f ".claude/memory-bank/$file" ]; then
            echo "❌ Missing: $file" >&2
            MISSING_FILES=$((MISSING_FILES + 1))
        else
            echo "✅ Found: $file" >&2
        fi
    done
    
    if [ "$MISSING_FILES" -eq 0 ]; then
        echo "🎉 Memory Bank health: GOOD" >&2
        return 0
    else
        echo "⚠️  Memory Bank health: NEEDS ATTENTION ($MISSING_FILES missing files)" >&2
        return 1
    fi
}

# Quick status summary
planning_status() {
    echo "=== Planning & Memory Bank Status ===" >&2
    
    # Last planning session
    if [ -f ".claude/planning/last-session" ]; then
        LAST_TIME=$(cat .claude/planning/last-session)
        CURRENT_TIME=$(date +%s)
        HOURS_AGO=$(( (CURRENT_TIME - LAST_TIME) / 3600 ))
        echo "Last planning session: ${HOURS_AGO}h ago" >&2
    else
        echo "No planning sessions recorded" >&2
    fi
    
    # Memory Bank health
    memory_bank_health
    
    # Recent planning activity
    if [ -f ".claude/planning/planning-log.md" ]; then
        echo "Recent planning entries:" >&2
        grep "^##" .claude/planning/planning-log.md | tail -3 >&2
    fi
}

# Main execution
case "${1:-check}" in
    "check")
        check_planning_needed
        ;;
    "update")
        update_planning_timestamp
        ;;
    "health")
        memory_bank_health
        ;;
    "status")
        planning_status
        ;;
    *)
        echo "Usage: $0 {check|update|health|status}" >&2
        echo "  check  - Check if planning is needed" >&2
        echo "  update - Update planning session timestamp" >&2
        echo "  health - Check Memory Bank health" >&2
        echo "  status - Show planning and Memory Bank status" >&2
        exit 1
        ;;
esac