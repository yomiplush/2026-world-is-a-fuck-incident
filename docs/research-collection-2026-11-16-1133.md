# Collection: November 16, 09:00–11:33 JST

UTC window: 2026-11-16T00:00:00Z–2026-11-16T02:33:00Z. API retrieval began at 02:34 UTC, after the cutoff. Official vendor source retrieval began earlier that same morning. The manifest preserves individual times and current upstream revisions; historical revisions cannot be reconstructed.

- NVD: nine published, ten modified; all nine published IDs overlap modified IDs. Every returned page was saved. The extra modified record is Linux CVE-2026-99288.
- GHSA: two published and two modified, the same malware advisories. Reviewed and unreviewed lists each returned zero. All six type/mode queries are saved, including empty pages.
- KEV: catalog 2026.11.13, 1,781 entries. Compare decoded bytes to the 09:00 response; no new entries. The earlier October-to-November comparison was discovery work, not this review's delta count.
- Primary follow-ups: GMO November 6 compensation notice, official headscale release metadata and Tailscale bulletins/findings. Saved sources outside the curated follow-up scope are not automatically endorsed.
- Failed guessed per-bulletin paths returned 404; correct Tailscale citations use the official bulletin index with anchors. The attempted GMO November 2 URL redirected to the corporate homepage, not a briefing. A tiny SonicWall response and failed Unicode URL are not evidence of an advisory's content.

Hashes validate bytes, not truth or completeness of a page. The manifest records failures and content limitations. The seven new topics and revised GMO row do not claim all prior topics were rechecked. No exploitation or fixed version is inferred from an NVD registration alone.

Reproduction: `python3 tools/intel/snapshot-20261116-1133.py` uses the fixed API window and writes to a fresh `data/recollect-2026-11-16-1133` directory. An existing output directory is rejected; override with `--output-dir` to select another fresh directory. Vendor captures are copied with their original retrieval timestamps and hashes; they are not represented as new downloads.
