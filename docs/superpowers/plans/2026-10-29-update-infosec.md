# update-infosec Implementation Plan

> Execute inline using executing-plans, test-driven-development and verification-before-completion.

**Goal:** On minipc, one command researches current security events, updates the existing database and site, verifies it, commits/pushes main and deploys the matching revision to Cloudflare Pages.

**Architecture:** Python standard-library controller owns Git and deployment. Codex CLI uses its existing ChatGPT login to research and edit an isolated clone; its output is an explicit completion manifest. Existing build/unit tests and a real headless browser gate publication. Secrets and run logs remain outside the repository.

**Tech Stack:** Python 3, Node 22, Codex CLI, Wrangler, Playwright with existing Chrome.

**Approved scope:** User chose the recommended approach and explicitly authorized commit, push and production deployment. Use existing data/site formats; preserve source evidence, historic records, stable scene links and two-language publishing conventions. No scheduler requested.

## Review focus

- Missing auth: doctor fails clearly before research.
- Concurrent runs and unrelated edits: lock and clean-checkout gate.
- Incomplete research or missing sources: require a fresh manifest, new timestamped snapshot and sourced records.
- Build/browser failures: no commit/push/deploy; keep run workspace and logs.
- Push/deploy failure: record exact state; deploy retry uses the previously verified commit, never silently publishes a newer revision.

## Tasks

1. Write integration tests for CLI help, failure before publication, fresh snapshot validation, same-run locking, changed Git history, safe deployment and retry. Observe RED.
2. Implement tools/update-infosec and focused research prompt/schema. Controller reads external config, checks dependencies/auth, clones clean main into a per-run workspace, invokes Codex, independently validates output, runs build/unit/browser checks, commits, pushes normally and deploys immutable committed files. Add --doctor, --dry-run and --retry-deploy RUN_ID.
3. Add a dynamic browser smoke test: Japanese/English current report, database, impact, timeline, static content without JS at 320/390/844/1440 widths; motion rail stays within viewport and chapter navigation remains usable. Screenshots remain in run state.
4. Run controller tests GREEN and existing suites/build. Install minipc launcher/config, validate doctor and browser smoke using real dependencies. Commit/push implementation. Deploy once authentication is available; report any remaining external blocker precisely.

## Execution record

- Baseline on minipc: Node 36/36; Python 28/28.
- Codex 0.165.0 installed in dedicated user-owned runtime; existing ChatGPT authentication detected.
- Wrangler 4.155.0 installed; Cloudflare login missing, user asked to authenticate while implementation continues.
- Controller tests: 14/14; full Python suite: 42/42; Node suite: 36/36.
- Site build and asset check pass; real Chrome: 36 responsive/no-JS/motion checks at four viewport sizes pass. Phone motion and impact screenshots inspected.
- Review findings fixed with RED→GREEN tests: process-group teardown on timeout/interrupt; remote-SHA reconciliation after ambiguous push result; exact deployment inventory including ignored extras.
- Runtime ruling: use official --approve-for-me (workspace-write plus automatic review) because AppArmor rejects bubblewrap user namespaces. A real read-only command succeeded through the approved escalation path. No OS policy change or unconditional sandbox bypass.
- Installed command launchers and private external configuration on minipc; backed up .bashrc and added user command directories before its noninteractive return so SSH can invoke the command by name.
- GitHub push dry run succeeded. Production doctor correctly stops before research while Cloudflare login is absent. No new incident scan or production deployment claimed.
