#!/bin/bash

# Check for unstaged or uncommitted changes
if git diff --quiet && git diff --cached --quiet; then
  echo "✅ Nothing to commit. Working tree clean."
  exit 0
fi

# Prompt for commit message
read -p "📝 Enter commit message: " message

# Fallback message if empty
if [ -z "$message" ]; then
  message="🔄 Auto commit on $(date)"
fi

# Commit and push
git add -A
git commit -m "$message"
git push
