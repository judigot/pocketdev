#!/bin/sh

readonly SCRIPT_DIR=$(cd "$(dirname "$0")" || exit 1; pwd)
readonly POCKETDEV_DIR="/home/ubuntu/pocketdev"
readonly AI_DIR="/home/ubuntu/ai"

usage() {
  printf '%s\n' "Usage: $0 [start|status|stop|merge]"
  printf '%s\n' "Commands:"
  printf '%s\n' "  start   - Start multitasker execution on all unclaimed worktrees"
  printf '%s\n' "  status  - Show status of all worktrees"
  printf '%s\n' "  stop    - Stop all running agents"
  printf '%s\n' "  merge   - Merge completed worktrees to main"
  exit 1
}

start_agent() {
  local worktree_path="$1"
  local worktree_name="$2"
  
  printf '%s\n' "Starting agent for $worktree_name..."
  
  # Navigate to worktree
  cd "$worktree_path" || exit 1
  
  # Check if task is unclaimed
  if [ -f ".agent-task-context/.state/TASK_STATUS.claimed" ] || \
     [ -f ".agent-task-context/.state/TASK_STATUS.done" ]; then
    printf '%s\n' "  Skipping $worktree_name (already claimed or done)"
    return 0
  fi
  
  # Mark as claimed
  touch ".agent-task-context/.state/TASK_STATUS.claimed"
  rm -f ".agent-task-context/.state/TASK_STATUS.unclaimed"
  
  # Read context for agent
  readonly CONTEXT_FILE=".agent-task-context/Context.md"
  if [ ! -f "$CONTEXT_FILE" ]; then
    printf '%s\n' "  Error: Context file not found for $worktree_name"
    return 1
  fi
  
  # Start OpenCode session in background
  nohup "$AI_DIR/scripts/start-agent.sh" "$CONTEXT_FILE" > ".agent-task-context/.state/agent.log" 2>&1 &
  readonly AGENT_PID=$!
  
  # Store PID for later management
  echo "$AGENT_PID" > ".agent-task-context/.state/agent.pid"
  
  printf '%s\n' "  ✓ Started agent for $worktree_name (PID: $AGENT_PID)"
  
  # Commit the claimed status
  git add .agent-task-context/.state/
  git commit -m "chore: mark task as claimed by multitasker" > /dev/null 2>&1
  git push > /dev/null 2>&1
  
  cd "$POCKETDEV_DIR" || exit 1
}

start_multitasker() {
  printf '%s\n' "🚀 Starting Pocketdev MVP Multitasker..."
  printf '%s\n' "====================================="
  
  cd "$POCKETDEV_DIR" || exit 1
  
  # Get all worktrees
  readonly WORKTREES=$(git worktree list --porcelain | grep -E "^worktree " | cut -d' ' -f2 | grep ".worktrees")
  
  # Start agents in parallel
  for worktree in $WORKTREES; do
    worktree_name=$(basename "$worktree")
    start_agent "$worktree" "$worktree_name" &
  done
  
  # Wait for all agents to start
  wait
  
  printf '%s\n' "====================================="
  printf '%s\n' "✅ Multitasker started - All 4 agents now running"
  printf '%s\n' "💡 Monitor progress with: $0 status"
  printf '%s\n' "🌙 Build will continue hands-free overnight"
}

show_status() {
  printf '%s\n' "📊 Pocketdev MVP Build Status"
  printf '%s\n' "============================"
  
  cd "$POCKETDEV_DIR" || exit 1
  
  # Get all worktrees
  readonly WORKTREES=$(git worktree list --porcelain | grep -E "^worktree " | cut -d' ' -f2 | grep ".worktrees")
  
  for worktree in $WORKTREES; do
    worktree_name=$(basename "$worktree")
    printf '%s\n' ""
    printf '%s\n' "📁 $worktree_name:"
    
    if [ -f "$worktree/.agent-task-context/.state/TASK_STATUS.unclaimed" ]; then
      printf '%s\n' "  🟡 Status: Unclaimed"
    elif [ -f "$worktree/.agent-task-context/.state/TASK_STATUS.claimed" ]; then
      printf '%s\n' "  🔵 Status: In Progress"
      if [ -f "$worktree/.agent-task-context/.state/agent.pid" ]; then
        pid=$(cat "$worktree/.agent-task-context/.state/agent.pid")
        if ps -p "$pid" > /dev/null 2>&1; then
          printf '%s\n' "  🔄 Agent PID: $pid (running)"
        else
          printf '%s\n' "  ❌ Agent PID: $pid (stopped)"
        fi
      fi
    elif [ -f "$worktree/.agent-task-context/.state/TASK_STATUS.done" ]; then
      printf '%s\n' "  ✅ Status: Completed"
    elif [ -f "$worktree/.agent-task-context/.state/TASK_STATUS.paused" ]; then
      printf '%s\n' "  ⏸️ Status: Paused"
    elif [ -f "$worktree/.agent-task-context/.state/TASK_STATUS.abandoned" ]; then
      printf '%s\n' "  ❌ Status: Abandoned"
    else
      printf '%s\n' "  ❓ Status: Unknown"
    fi
    
    # Show recent commits
    cd "$worktree" || continue
    printf '%s\n' "  📝 Latest commit: $(git log -1 --oneline --no-decorate)"
    cd "$POCKETDEV_DIR" || exit 1
  done
  
  printf '%s\n' ""
  printf '%s\n' "⏰ Build started at: $(date)"
  printf '%s\n' "🎯 Golden Test Target: '. <(curl -fsSL \"https://raw.githubusercontent.com/judigot/user/main/load-devrc.sh?cachebustkey=$(date +%s)\") && hi' → 'Hello, ubuntu!'"
}

stop_agents() {
  printf '%s\n' "🛑 Stopping all agents..."
  
  cd "$POCKETDEV_DIR" || exit 1
  
  # Get all worktrees
  readonly WORKTREES=$(git worktree list --porcelain | grep -E "^worktree " | cut -d' ' -f2 | grep ".worktrees")
  
  for worktree in $WORKTREES; do
    worktree_name=$(basename "$worktree")
    
    if [ -f "$worktree/.agent-task-context/.state/agent.pid" ]; then
      pid=$(cat "$worktree/.agent-task-context/.state/agent.pid")
      if ps -p "$pid" > /dev/null 2>&1; then
        printf '%s\n' "  Stopping $worktree_name (PID: $pid)..."
        kill "$pid"
        rm -f "$worktree/.agent-task-context/.state/agent.pid"
        printf '%s\n' "  ✅ Stopped $worktree_name"
      else
        printf '%s\n' "  ⚠️ $worktree_name already stopped"
        rm -f "$worktree/.agent-task-context/.state/agent.pid"
      fi
    fi
  done
  
  printf '%s\n' "✅ All agents stopped"
}

merge_completed() {
  printf '%s\n' "🔀 Merging completed worktrees..."
  
  cd "$POCKETDEV_DIR" || exit 1
  
  # Get all worktrees
  readonly WORKTREES=$(git worktree list --porcelain | grep -E "^worktree " | cut -d' ' -f2 | grep ".worktrees")
  
  # Switch to main branch
  git checkout main || exit 1
  git pull origin main || exit 1
  
  for worktree in $WORKTREES; do
    worktree_name=$(basename "$worktree")
    
    if [ -f "$worktree/.agent-task-context/.state/TASK_STATUS.done" ]; then
      printf '%s\n' "  Merging $worktree_name..."
      
      cd "$worktree" || continue
      branch_name=$(git branch --show-current)
      
      # Push latest changes
      git push origin "$branch_name" || continue
      
      cd "$POCKETDEV_DIR" || exit 1
      
      # Merge branch
      git merge "$branch_name" || {
        printf '%s\n' "  ❌ Merge failed for $worktree_name"
        git merge --abort
        continue
      }
      
      printf '%s\n' "  ✅ Merged $worktree_name"
    fi
  done
  
  # Push main
  git push origin main || exit 1
  
  printf '%s\n' "✅ All completed worktrees merged to main"
}

main() {
  case "${1:-start}" in
    start)
      start_multitasker
      ;;
    status)
      show_status
      ;;
    stop)
      stop_agents
      ;;
    merge)
      merge_completed
      ;;
    *)
      usage
      ;;
  esac
}

main "$@"