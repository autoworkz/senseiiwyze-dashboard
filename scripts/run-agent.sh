#!/usr/bin/env bash
# run-agent.sh – lightweight wrapper to process an AI ticket YAML with a local LLM
#
# Usage:
#   ./scripts/run-agent.sh path/to/ticket.yml
#
# Requirements:
#   • Ollama (https://ollama.ai) or other CLI LLM tool installed.
#   • An image tag exported in $LLM_IMAGE (defaults to codellama:latest).
#   • gh (GitHub CLI) configured if you want automatic PR creation.
#
# Steps performed:
#   1. Read YAML ticket and echo to LLM as system+user prompt.
#   2. Expect LLM to return a unified diff patch (git format-patch).
#   3. Apply the patch, run CI (lint, test, build).
#   4. If green – create a branch & PR referencing the original ticket file.
#
TICKET_FILE="$1"
if [[ -z "$TICKET_FILE" || ! -f "$TICKET_FILE" ]]; then
  echo "Usage: $0 path/to/ticket.yml" >&2
  exit 1
fi

LLM_IMAGE="${LLM_IMAGE:-codellama:latest}"

BRANCH="ai/$(basename "$TICKET_FILE" .yml)-$(date +%s)"

echo "[run-agent] Generating patch with $LLM_IMAGE for $TICKET_FILE…"
PATCH=$(ollama run "$LLM_IMAGE" --format diff <<EOF
You are an AI code assistant. Apply the following ticket spec to the repository.
Respond ONLY with a valid unified git diff.
---
$(cat "$TICKET_FILE")
EOF
)

if [[ -z "$PATCH" ]]; then
  echo "[run-agent] No patch returned" >&2
  exit 1
fi

echo "$PATCH" | git apply --verbose - || { echo "Patch failed"; exit 1; }

pnpm lint && pnpm test && pnpm build || { echo "CI failed"; git reset --hard; exit 1; }

git checkout -b "$BRANCH"
git add -A
git commit -m "AI ticket $(basename "$TICKET_FILE")"

gh pr create --title "AI: $(basename "$TICKET_FILE")" --body "Automated change for $(basename "$TICKET_FILE")" --label ai-ticket || echo "PR creation skipped"

echo "[run-agent] Done – PR opened (if gh CLI configured)." 