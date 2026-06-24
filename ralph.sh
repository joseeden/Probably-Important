#!/bin/bash

# Ralph - Autonomous AI Coding Loop for Probably Important
# Iteratively works through incomplete tasks in prd.json until complete.
#
# Usage: ./ralph.sh <max-iterations>
# Example: ./ralph.sh 20

set -e

if [ -z "$1" ]; then
  echo "Error: Please specify maximum iterations"
  echo "Usage: $0 <max-iterations>"
  echo "Example: $0 20"
  exit 1
fi

MAX_ITERATIONS=$1
PROGRESS_FILE="agent-progress.txt"
PRD_FILE="prd.json"
SPEC_FILE="SPEC.md"
GUIDE_FILE="CLAUDE.md"
APP_URL="${APP_URL:-http://localhost:3030}"

echo "🤖 Ralph - Autonomous Coding Agent"
echo "📋 Task List: $PRD_FILE"
echo "📝 Progress Log: $PROGRESS_FILE"
echo "📚 Spec: $SPEC_FILE"
echo "🌐 App URL: $APP_URL"
echo "🔄 Max Iterations: $MAX_ITERATIONS"
echo ""

touch "$PROGRESS_FILE"

for ((iteration=1; iteration<=MAX_ITERATIONS; iteration++)); do
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "Iteration $iteration / $MAX_ITERATIONS"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""

  result=$(claude --dangerously-skip-permissions -p "@$PRD_FILE @$PROGRESS_FILE @$SPEC_FILE @$GUIDE_FILE

You are running the Ralph loop for the Probably Important Next.js app.

Project setup:
- Bun is the package manager, but Next.js runs on the normal Node runtime.
- The app uses Next.js 16, React 19, TypeScript, Tailwind CSS 4, better-auth, Prisma 7, Neon PostgreSQL, TipTap, and Playwright.
- Do not use SQLite or Bun SQLite. Persistence goes through Prisma and Neon PostgreSQL.
- Keep secrets in .env.local. Never print or commit DATABASE_URL, BETTER_AUTH_SECRET, or BETTER_AUTH_URL.
- The development app URL is $APP_URL.

Pick ONE task from $PRD_FILE where passes=false.

You do not have to go in order. Choose the best next task based on dependencies, risk, and what is already implemented.

Implementation rules:
- Read $SPEC_FILE and $GUIDE_FILE before changing code.
- Follow the existing root-level app/, components/, lib/, prisma/, and tests/ structure.
- Use Prisma models and the db client in lib/db.ts for database work.
- Enforce note ownership on the server for every private note operation.
- Use the docs-researcher agent before relying on external framework or library documentation.

Validation:
- Run the smallest useful check for the task first.
- For code changes, run bun run lint.
- For framework, auth, database, route, or build-sensitive changes, also run bun run build.
- For user-flow changes, use Playwright MCP when available and/or run bunx playwright test.
- If validation cannot run because required services or environment variables are missing, document the exact blocker in $PROGRESS_FILE.

After each completed task:
- Mark passes=true in $PRD_FILE for the completed task only.
- Update $PROGRESS_FILE with what changed and what validation ran.
- Commit via Git when the working tree contains only the task's intended changes.

When ALL tasks have passes=true, output: <complete>ALL_TASKS_DONE</complete>
" 2>&1) || {
    echo "Error: claude failed with exit code $?"
    echo "Output: $result"
    exit 1
  }

  echo "$result"
  echo ""

  # Check if all work is complete
  if [[ "$result" == *"<complete>ALL_TASKS_DONE</complete>"* ]]; then
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅ All tasks complete!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    exit 0
  fi

  if [ $iteration -lt $MAX_ITERATIONS ]; then
    echo "⏸  2 second pause..."
    sleep 2
    echo ""
  fi
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🏁 Reached $MAX_ITERATIONS iterations"
echo "📊 Review: git log"
echo "📝 Progress: cat $PROGRESS_FILE"
echo "⏭️  Run again if more work remains"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
