#!/usr/bin/env bash
# Verifies that when success-check passes after the agent's changes, the
# action commits them, pushes them to the real remote, and still posts the
# report — under real GitHub Actions composite-action semantics, using
# nektos/act (https://github.com/nektos/act).
#
# Builds a throwaway, disposable fixture repo containing a copy of the
# current action.yml, a real local bare repo as its `origin` (so an actual
# push can be verified, without reaching any real remote), and a tiny
# workflow that invokes the action with a stub agent that edits a tracked
# file and a success-check that always passes. Runs act with --bind (safe
# here since the fixture is disposable — never do this against a real
# checkout) and asserts, from act's own log output plus the resulting git
# state, that the fix was actually committed and pushed, and the report
# posted.
#
# Requires: act, docker (with the daemon running).
#
# Usage: bash .github/actions/auto-fix-with-agent/test/success-check-passes.sh
set -euo pipefail

ACTION_YML="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/action.yml"

if ! command -v act >/dev/null 2>&1; then
  echo "act is not installed (https://github.com/nektos/act) — e.g. \`brew install act\`" >&2
  exit 1
fi
if ! docker info >/dev/null 2>&1; then
  echo "docker is not running — act needs a running Docker daemon" >&2
  exit 1
fi

FIXTURE="$(mktemp -d)"
trap 'rm -rf "$FIXTURE"' EXIT

mkdir -p "$FIXTURE/.github/actions/auto-fix-with-agent" "$FIXTURE/.github/workflows"
cp "$ACTION_YML" "$FIXTURE/.github/actions/auto-fix-with-agent/action.yml"

cat > "$FIXTURE/.github/workflows/test.yml" <<'EOF'
name: test-success-check-passes
on: workflow_dispatch
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Install stub gh (no real GitHub API calls in this test)
        run: |
          cat > /usr/local/bin/gh <<'STUB'
          #!/usr/bin/env bash
          if [ "$1" = "run" ] && [ "$2" = "view" ]; then
            echo "stub failed workflow logs"
            exit 0
          fi
          if [ "$1" = "pr" ] && [ "$2" = "comment" ]; then
            echo "stub: pr comment suppressed"
            exit 0
          fi
          echo "stub gh: unhandled: $*" >&2
          exit 1
          STUB
          chmod +x /usr/local/bin/gh

      - name: Invoke the action
        uses: ./.github/actions/auto-fix-with-agent
        with:
          success-check: "true"
          failed-workflow-run-id: "1"
          branch: "__WORK_BRANCH__"
          github-token: "dummy"
          commit-title: "fix: stub fix"
          agent-install-command: "true"
          agent-command: |
            echo "fixed" > file.txt
            echo '{"result":"stub ran","total_cost_usd":0.01}'
          agent-env: ""
EOF

WORK_BRANCH="success-check-passes-branch-$(date +%s)-$$"
sed -i.bak "s/__WORK_BRANCH__/$WORK_BRANCH/" "$FIXTURE/.github/workflows/test.yml"
rm -f "$FIXTURE/.github/workflows/test.yml.bak"

# A real local bare repo as `origin`, so an actual push can be verified
# without reaching any real remote. Kept inside the fixture and referenced
# by a relative path (not an absolute host path), so it resolves correctly
# regardless of where --bind remaps the workspace inside the container.
git init -q --bare "$FIXTURE/.test-origin.git"

cd "$FIXTURE"
echo ".test-origin.git/" > .gitignore
echo "orig" > file.txt
git init -q .
git add .gitignore file.txt .github
git -c user.email=test@test.com -c user.name=test commit -q -m fixture
git remote add origin ./.test-origin.git

run_log="$(act workflow_dispatch -P ubuntu-latest=catthehacker/ubuntu:act-latest --pull=false --bind 2>&1)" || true
echo "$run_log" | grep -E "⭐ Run Main|✅|❌|proceed=|has_changes="

echo
failed=0

check() {
  local desc="$1" cond="$2"
  if eval "$cond"; then
    echo "ok - $desc"
  else
    echo "not ok - $desc"
    failed=1
  fi
}

check "success check step runs and succeeds" \
  'echo "$run_log" | grep -q "✅  Success - Main Stop if success check still fails"'
check "commit and push step runs and succeeds" \
  'echo "$run_log" | grep -q "✅  Success - Main Commit and push changes, if any"'
check "report step runs and succeeds" \
  'echo "$run_log" | grep -q "✅  Success - Main Whatever the outcome, post report as a comment to pull request"'

check "a new commit with the fix landed in the local working repo" \
  'git -C "$FIXTURE" log -1 --pretty=%B | grep -q "fix: stub fix"'
check "that commit was actually pushed to origin, on the expected branch" \
  "git --git-dir=\"$FIXTURE/.test-origin.git\" log -1 --pretty=%B \"$WORK_BRANCH\" | grep -q \"fix: stub fix\""
check "the report was posted (stub gh pr comment was called)" \
  'echo "$run_log" | grep -q "stub: pr comment suppressed"'

echo
if [ "$failed" -eq 0 ]; then
  echo "PASS"
else
  echo "FAIL"
  exit 1
fi
