# Superseded: major-language native dropdowns

The user cancelled the249-language expansion. The active scope is existing12languages plus Ukrainian, with native selects and no searchable language dialog. No long-running translation or publishing job was launched. Saved valid translations remain in version history.

---

# Stored AI localization and symbolic splash implementation plan

**Goal:** Generate and retain actual Codex translations for249target languages, make updates source-hash aware, remove the external translation flow, and keep the startup splash symbolic.

**Source scope:** Start with the latest37-topic curated register (all titles, bodies, actions, time explanations, caveats, quick summary and reader UI). Historical immutable snapshots and motion/feature text remain distinct source sets, never counted as translated without actual output. User clarification on whether historical data must enter the initial batch remains pending.

**Architecture:** Immutable snapshot/locale JSON packages plus a per-language translation memory keyed by source text hashes. Codex CLI structured output, exact-key checks, protected identifiers/versions/URLs/numbers, no foreign-language placeholder copies, per-language provenance and explicit generation state. Build static localized database pages and a local search panel from complete source-matched packages only. Preserve original source archives.

- [x] Verify official Codex CLI noninteractive/structured-output support and existing authenticated execution with a real small translation.
- [ ] Generate and validate latest database translations for all249targets; retain honest pending/unsupported/error states instead of fake completion.
- [x] Integrate source-hash translation memory and resumable update jobs; document generation/review/provenance and future refresh commands.
- [x] Remove Google translation links and replace language-directory choices with actual hosted data.
- [x] Make splash icon-only, including privacy/policy UI before unlock; retain accessible icon navigation and normal controls after unlock.
- [x] Verify static output, metadata, locale selection, no external translation requests, identifiers and responsive/accessibility/runtime/privacy behavior.
- [x] Publish tested changes and verify production. Report actual language coverage; do not claim249if generation has not completed.

Published baseline: commit1c151a5,6/249languages including Japanese,41indexable pages. Production JSON exact bytes verified for all6;249generation remains in progress, with unsupported targets explicit.
