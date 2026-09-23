#!/usr/bin/env bash
# Verifies run-no-more-than-once-ever-for-branch under real GitHub Actions
# composite-action semantics, using nektos/act (https://github.com/nektos/act)
# instead of a hand-rolled reimplementation of GitHub's expression evaluator.
#
# Builds a throwaway, disposable fixture repo (no `origin` remote, so nothing
# it does can reach a real remote) containing a copy of the current
# action.yml, and a tiny workflow that invokes it twice with the same
# (work-branch, success-check). Runs act against that fixture with --bind
# (safe here since the fixture is disposable — never do this against a real
# checkout) and asserts, from act's own log output, that the second
# invocation's real steps (in particular "Run agent") never execute.
#
# Requires: act, docker (with the daemon running).
#
# Usage: bash .github/actions/fix-with-agent/test/run-no-more-than-once-ever-for-branch.sh
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

mkdir -p "$FIXTURE/.github/actions/fix-with-agent" "$FIXTURE/.github/workflows"
cp "$ACTION_YML" "$FIXTURE/.github/actions/fix-with-agent/action.yml"

cat > "$FIXTURE/.github/workflows/test.yml" <<'EOF'
name: test-guard
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
        uses: ./.github/actions/fix-with-agent
        with:
          success-check: "true"
          failed-workflow-run-id: "1"
          branch: "__WORK_BRANCH__"
          github-token: "dummy"
          run-no-more-than-once-ever-for-branch: "true"
          agent-install-command: "true"
          agent-command: echo '{"result":"stub ran","total_cost_usd":0.01}'
          agent-env: ""
EOF

# act's local cache emulation is a persistent host-level store, shared across
# fixtures and runs (not scoped to this fixture directory) — a unique branch
# per script run keeps the guard cache key collision-free and the test
# deterministic regardless of what earlier runs left behind.
WORK_BRANCH="guard-test-branch-$(date +%s)-$$"
sed -i.bak "s/__WORK_BRANCH__/$WORK_BRANCH/" "$FIXTURE/.github/workflows/test.yml"
rm -f "$FIXTURE/.github/workflows/test.yml.bak"

cd "$FIXTURE"
git init -q .
git -c user.email=test@test.com -c user.name=test commit -q --allow-empty -m init
git add -A
git -c user.email=test@test.com -c user.name=test commit -q -m fixture

run_act() {
  act workflow_dispatch -P ubuntu-latest=catthehacker/ubuntu:act-latest --pull=false --bind
}

echo "=== Run 1 (expect: proceeds, runs the agent) ==="
run1_log="$(run_act 2>&1)" || true
echo "$run1_log" | grep -E "⭐ Run Main|proceed=|Agent cost"

echo
echo "=== Run 2, same branch + check (expect: blocked, agent never runs) ==="
run2_log="$(run_act 2>&1)" || true
echo "$run2_log" | grep -E "⭐ Run Main|proceed=|Agent cost"

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

check "run 1 proceeds (proceed=true)" \
  'echo "$run1_log" | grep -q "proceed=true"'
check "run 1 actually runs the agent (Run agent step executes)" \
  'echo "$run1_log" | grep -q "⭐ Run Main Run agent"'
check "run 1 reports an agent cost (confirms the agent command really ran, not just the step wrapper)" \
  'echo "$run1_log" | grep -q "Agent cost (USD): 0.01"'

check "run 2 is blocked (proceed=false)" \
  'echo "$run2_log" | grep -q "proceed=false"'
check "run 2 does NOT run the agent (Run agent step is entirely absent, not merely failed)" \
  '! echo "$run2_log" | grep -q "⭐ Run Main Run agent"'
check "run 2 reports no agent cost" \
  '! echo "$run2_log" | grep -q "Agent cost"'

echo
if [ "$failed" -eq 0 ]; then
  echo "PASS"
else
  echo "FAIL"
  exit 1
fi
